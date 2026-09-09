import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { readStoredLeads, updateStoredLead } from "@/lib/leadStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Phone,
  Mail,
  Search,
  Download,
  MessageSquare,
} from "lucide-react";

const fmt = (n) =>
  typeof n === "number" && !isNaN(n) ? `$${Math.round(n).toLocaleString()}` : "—";

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Full submission timestamp (date + time) so admins can see exactly when each
// inquiry came in — used in the "Submitted" column to surface the newest leads.
const fmtTimestamp = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

// Extract a location label (city, state) from a full property address.
// Standardized addresses typically look like: "123 Main St, Palm Desert, CA 92211"
const extractLocation = (address) => {
  if (!address) return "";
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 3) {
    const city = parts[parts.length - 3];
    const stateZip = parts[parts.length - 2];
    const state = stateZip.split(/\s+/)[0];
    return `${city}, ${state}`;
  }
  if (parts.length === 2) return parts[0];
  return address;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "contacted", label: "Contacted", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "qualified", label: "Qualified", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { value: "closed", label: "Closed", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "lost", label: "Lost", color: "bg-gray-100 text-gray-500 border-gray-200" },
];

const STATUS_ORDER = { new: 0, contacted: 1, qualified: 2, closed: 3, lost: 4 };

// Display labels for the lead's saved contact preferences.
const METHOD_LABELS = {
  phone: "Phone Call",
  text: "Text Message",
  email: "Email",
  no_preference: "No Preference",
};
const TIME_LABELS = {
  morning: "Morning (8 AM–12 PM)",
  afternoon: "Afternoon (12 PM–5 PM)",
  evening: "Evening (5 PM–8 PM)",
  no_preference: "No Preference",
};

const StatusBadge = ({ status }) => {
  const opt = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-sm border text-xs font-medium tracking-wide capitalize ${opt.color}`}>
      {opt.label}
    </span>
  );
};

// Delivery status of the estimate lead to the Prospect Finder CRM (app.staytrvlr.com).
// "failed" means the webhook never reached the CRM (stale URL or secret mismatch) —
// the lead still saved locally, so this is the only visible signal of a broken link.
const PF_STATUS_OPTIONS = {
  sent: { label: "Sent", color: "bg-green-100 text-green-700 border-green-200" },
  pending: { label: "Pending", color: "bg-gray-100 text-gray-500 border-gray-200" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700 border-red-200" },
};

const PfStatusBadge = ({ status }) => {
  const opt = PF_STATUS_OPTIONS[status] || PF_STATUS_OPTIONS.pending;
  return (
    <span className={`inline-block px-2 py-0.5 rounded-sm border text-xs font-medium tracking-wide ${opt.color}`}>
      {opt.label}
    </span>
  );
};

export default function AdminLeads() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const localLeads = readStoredLeads();
      try {
        const items = await base44.entities.Lead.list("-created_date", 500);
        const knownIds = new Set(items.map((item) => item.id));
        return [...items, ...localLeads.filter((item) => !knownIds.has(item.id))];
      } catch {
        return localLeads;
      }
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      updateStoredLead(id, { status });
      try {
        await base44.entities.Lead.update(id, { status });
      } catch {
        // Local fallback leads remain editable when the backend is unavailable.
      }
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries(["admin-leads"]);
      const previous = queryClient.getQueryData(["admin-leads"]);
      queryClient.setQueryData(["admin-leads"], (old) =>
        (old || []).map((l) => (l.id === id ? { ...l, status } : l))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["admin-leads"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["admin-leads"]);
    },
  });

  // Build the unique location list from parsed addresses
  const locations = useMemo(() => {
    const set = new Set();
    leads.forEach((l) => {
      const loc = extractLocation(l.property_address);
      if (loc) set.add(loc);
    });
    return Array.from(set).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads
      .filter((l) => {
        // Text search
        if (q) {
          const matches = [
            l.first_name,
            l.last_name,
            l.email,
            l.phone,
            l.property_address,
            `${l.first_name ?? ""} ${l.last_name ?? ""}`,
          ]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(q));
          if (!matches) return false;
        }
        // Location filter
        if (locationFilter !== "all") {
          if (extractLocation(l.property_address) !== locationFilter) return false;
        }
        // Status filter
        if (statusFilter !== "all") {
          const s = l.status || "new";
          if (s !== statusFilter) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [leads, query, locationFilter, statusFilter]);

  const exportCsv = () => {
    const headers = [
      "Submitted",
      "First Name",
      "Last Name",
      "Phone",
      "Email",
      "Property Address",
      "Location",
      "Status",
      "Est. ADR",
      "Occupancy",
      "Gross Monthly",
      "Net Monthly",
      "Projected Annual Net",
      "Property Type",
      "Rental Status",
      "Interest Timeline",
      "Preferred Contact Method",
      "Best Time to Reach",
      "Timezone",
      "SMS Consent",
    ];
    const rows = filtered.map((l) => [
      l.created_date ? new Date(l.created_date).toISOString() : "",
      l.first_name ?? "",
      l.last_name ?? "",
      l.phone ?? "",
      l.email ?? "",
      l.property_address ?? "",
      extractLocation(l.property_address),
      l.status ?? "new",
      l.estimated_adr ?? "",
      l.estimated_occupancy ?? "",
      l.gross_monthly_revenue ?? "",
      l.net_monthly_revenue ?? "",
      l.projected_annual_net ?? "",
      l.qualification_property_type ?? "",
      l.qualification_rental_status ?? "",
      l.qualification_interest_timeline ?? "",
      l.preferred_contact_method ? (METHOD_LABELS[l.preferred_contact_method] || l.preferred_contact_method) : "",
      l.preferred_contact_time ? (TIME_LABELS[l.preferred_contact_time] || l.preferred_contact_time) : "",
      l.preferred_contact_timezone ?? "",
      l.sms_consent_given ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `travlr-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasFilters = locationFilter !== "all" || statusFilter !== "all" || query.trim();

  const resetFilters = () => {
    setQuery("");
    setLocationFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/applications"
              className="text-sm tracking-[0.15em] uppercase text-gray-400 hover:text-[#b89968] transition-colors"
            >
              Applications
            </Link>
            <Link
              to="/admin/reviews"
              className="text-sm tracking-[0.15em] uppercase text-gray-400 hover:text-[#b89968] transition-colors"
            >
              Reviews
            </Link>
            <h1 className="text-sm tracking-[0.2em] uppercase text-gray-500 font-medium">
              TRAVLR Admin
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-1">
              Property Inquiries
            </h2>
            <p className="text-sm text-gray-500 tracking-wide">
              {filtered.length} lead{filtered.length === 1 ? "" : "s"} •
              track and follow up with potential homeowners
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, address, phone, email..."
                className="pl-9 w-full md:w-72"
              />
            </div>
            <Button
              variant="outline"
              onClick={exportCsv}
              disabled={!filtered.length}
              className="border-[#b89968] text-[#b89968] hover:bg-[#b89968]/10"
            >
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 p-4 bg-[#f8f6f3] rounded-sm border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-[0.15em] uppercase font-medium text-gray-500">Filter</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-56 bg-white">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-gray-500 hover:text-gray-800 text-sm"
            >
              Clear filters
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-2">No inquiries found.</p>
            <p className="text-sm text-gray-400">
              {hasFilters
                ? "Try adjusting your filters."
                : "New estimate submissions will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f6f3] text-gray-600">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium tracking-wide">Submitted</th>
                  <th className="px-4 py-3 font-medium tracking-wide">Homeowner</th>
                  <th className="px-4 py-3 font-medium tracking-wide">Contact Prefs</th>
                  <th className="px-4 py-3 font-medium tracking-wide">Property Address</th>
                  <th className="px-4 py-3 font-medium tracking-wide">Status</th>
                  <th className="px-4 py-3 font-medium tracking-wide text-right">Est. ADR</th>
                  <th className="px-4 py-3 font-medium tracking-wide text-right">Net Monthly</th>
                  <th className="px-4 py-3 font-medium tracking-wide text-right">Annual Net</th>
                  <th className="px-4 py-3 font-medium tracking-wide">Timeline</th>
                  <th className="px-4 py-3 font-medium tracking-wide" title="Delivery status of the webhook to the Prospect Finder CRM (app.staytrvlr.com)">CRM Sync</th>
                  <th className="px-4 py-3 font-medium tracking-wide text-right">Follow Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-[#f8f6f3]/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      <div className="text-gray-700">{fmtTimestamp(l.created_date)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">
                        {l.first_name} {l.last_name}
                      </div>
                      <div className="text-xs text-gray-500">{l.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="text-xs leading-relaxed space-y-0.5">
                        <div>
                          <span className="text-gray-400">Contact:</span>{" "}
                          {l.preferred_contact_method ? (METHOD_LABELS[l.preferred_contact_method] || l.preferred_contact_method) : "—"}
                        </div>
                        <div>
                          <span className="text-gray-400">Best Time:</span>{" "}
                          {l.preferred_contact_time ? (TIME_LABELS[l.preferred_contact_time] || l.preferred_contact_time) : "—"}
                        </div>
                        <div>
                          <span className="text-gray-400">Timezone:</span>{" "}
                          {l.preferred_contact_timezone || "—"}
                        </div>
                        <div>
                          <span className="text-gray-400">SMS:</span>{" "}
                          {l.consent_given ? "Yes" : "No"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs">
                      <div className="truncate" title={l.property_address}>
                        {l.property_address}
                      </div>
                      {l.estimated_occupancy && (
                        <div className="text-xs text-gray-400">
                          {l.estimated_occupancy} occupancy
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={l.status || "new"}
                        onValueChange={(value) =>
                          statusMutation.mutate({ id: l.id, status: value })
                        }
                      >
                        <SelectTrigger className="h-8 w-36 text-xs border-gray-200 bg-white">
                          <SelectValue>
                            <StatusBadge status={l.status || "new"} />
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {fmt(l.estimated_adr)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {fmt(l.net_monthly_revenue)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[#b89968]">
                      {fmt(l.projected_annual_net)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {l.qualification_interest_timeline ? (
                        <span className="capitalize">
                          {l.qualification_interest_timeline}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <PfStatusBadge status={l.prospect_finder_status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {l.consent_given ? (
                          <a
                            href={`sms:${l.phone}`}
                            aria-label={`Text ${l.first_name}`}
                            title="SMS consent on file"
                            className="p-2 rounded-sm border border-gray-200 text-gray-600 hover:bg-[#b89968] hover:text-white hover:border-[#b89968] transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        ) : (
                          <span
                            aria-label="No SMS consent"
                            title="No SMS consent on file — do not text this lead"
                            className="p-2 rounded-sm border border-gray-100 text-gray-300 cursor-not-allowed"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </span>
                        )}
                        <a
                          href={`tel:${l.phone}`}
                          aria-label={`Call ${l.first_name}`}
                          className="p-2 rounded-sm border border-gray-200 text-gray-600 hover:bg-[#b89968] hover:text-white hover:border-[#b89968] transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={`mailto:${l.email}`}
                          aria-label={`Email ${l.first_name}`}
                          className="p-2 rounded-sm border border-gray-200 text-gray-600 hover:bg-[#b89968] hover:text-white hover:border-[#b89968] transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}