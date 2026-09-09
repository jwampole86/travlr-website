import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, Calculator, Phone, Heart } from "lucide-react";
import { createPageUrl } from "@/utils";

const CACHE_KEY = "travlr_tab_cache_v2";
const TAB_PATHS = new Set(["/", "/SearchResults", "/estimate", "/Contact", "/saved"]);

function readCache() {
  try {
    return JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore quota / privacy errors */
  }
}

function inputKey(el) {
  return el.name || el.id || el.placeholder || el.getAttribute("aria-label") || null;
}

function snapshotInputs() {
  const inputs = {};
  document.querySelectorAll("input, textarea, select").forEach((el) => {
    const key = inputKey(el);
    if (!key) return;
    if (el.type === "checkbox" || el.type === "radio") inputs[key] = el.checked;
    else inputs[key] = el.value;
  });
  return inputs;
}

// Restore a cached snapshot for the active page.
function restore(entry) {
  if (!entry) {
    window.scrollTo(0, 0);
    return;
  }
  window.scrollTo(0, entry.scrollY || 0);
  Object.entries(entry.inputs || {}).forEach(([key, val]) => {
    document.querySelectorAll("input, textarea, select").forEach((el) => {
      if (inputKey(el) !== key) return;
      if (el.type === "checkbox" || el.type === "radio") {
        if (el.checked !== !!val) {
          el.checked = !!val;
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
      } else if (el.value !== val) {
        el.value = val;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  });
}

const TABS = [
  { label: "HOME", to: "/", icon: Home, exact: true },
  { label: "SEARCH", to: createPageUrl("SearchResults"), icon: Search },
  { label: "ESTIMATES", to: "/estimate", icon: Calculator },
  { label: "CONTACT", to: createPageUrl("Contact"), icon: Phone },
  { label: "SAVED", to: "/saved", icon: Heart },
];

export default function BottomNav() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const prevPathRef = useRef(pathname);
  const scrollRef = useRef(0);

  // Track live scroll so we can persist it even when leaving via in-page links
  // (not just explicit tab taps).
  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Persist the page we're leaving, then restore the page we're entering.
  // Runs only on pathname change (not query-string changes) to avoid jumping
  // scroll when only the URL params update.
  useEffect(() => {
    const prev = prevPathRef.current;
    if (prev !== pathname && TAB_PATHS.has(prev)) {
      const cache = readCache();
      cache[prev] = {
        ...(cache[prev] || {}),
        scrollY: scrollRef.current,
        inputs: snapshotInputs(),
      };
      writeCache(cache);
    }
    prevPathRef.current = pathname;

    if (TAB_PATHS.has(pathname)) {
      const cache = readCache();
      const id = requestAnimationFrame(() => restore(cache[pathname] || null));
      return () => cancelAnimationFrame(id);
    }
  }, [pathname]);

  // Keep the active tab's last visited URL (incl. query string) fresh so
  // returning to the tab resumes exactly where the user left off.
  useEffect(() => {
    if (TAB_PATHS.has(pathname)) {
      const cache = readCache();
      cache[pathname] = { ...(cache[pathname] || {}), lastUrl: pathname + search };
      writeCache(cache);
    }
  }, [pathname, search]);

  const isActive = (tab) => {
    if (tab.exact) return pathname === tab.to;
    return (
      pathname === tab.to ||
      pathname.startsWith(tab.to + "/") ||
      pathname.startsWith(tab.to)
    );
  };

  const handleTabClick = (tab, e) => {
    // Persist the current page's scroll + fields before navigating away.
    if (TAB_PATHS.has(pathname)) {
      const cache = readCache();
      cache[pathname] = {
        ...(cache[pathname] || {}),
        scrollY: scrollRef.current,
        inputs: snapshotInputs(),
        lastUrl: pathname + search,
      };
      writeCache(cache);
    }

    // Resume the tab at its last sub-route/context, falling back to its root.
    const target = readCache()[tab.to]?.lastUrl || tab.to;
    if (e) e.preventDefault();
    navigate(target);

    // Tapping the already-active tab snaps back to the top.
    if (isActive(tab) && pathname === tab.to) {
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-t border-gray-200 select-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary navigation"
    >
      <div className="flex">
        {TABS.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              to={tab.to}
              onClick={(e) => handleTabClick(tab, e)}
              className="flex-1 flex flex-col items-center justify-center py-2 select-none"
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={`w-5 h-5 mb-1 transition-colors ${active ? "text-[#c4a574]" : "text-gray-500"}`}
              />
              <span
                className={`text-[11px] tracking-[0.12em] transition-colors ${
                  active ? "text-[#c4a574] font-medium" : "text-gray-500"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}