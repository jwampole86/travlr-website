const STORAGE_KEY = "travlr_estimate_leads_v1";

export function readStoredLeads() {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function storeEstimateLead(lead) {
  if (typeof window === "undefined") return lead;
  const record = {
    ...lead,
    id: lead.id || `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_date: lead.created_date || new Date().toISOString(),
    status: lead.status || "new",
    source: lead.source || "estimate_web_form",
  };
  const existing = readStoredLeads().filter((item) => item.id !== record.id);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...existing]));
  } catch {
    // Keep the submission flow usable if browser storage is unavailable.
  }
  return record;
}

export function updateStoredLead(id, changes) {
  const updated = readStoredLeads().map((lead) =>
    lead.id === id ? { ...lead, ...changes } : lead
  );
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage failures; the server remains the source of truth when available.
    }
  }
  return updated;
}
