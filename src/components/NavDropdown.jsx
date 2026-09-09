import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

/**
 * NavDropdown — hover-to-open (desktop) with a tap/click fallback for touch.
 * The trigger and panel share a wrapping <div> so the cursor can travel from
 * the label into the menu with no gap that would close it prematurely.
 */
export default function NavDropdown({ label, items, activeColor = "#c4a574" }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="tracking-[0.15em] font-normal text-gray-600 flex items-center gap-1 transition-colors"
        style={{ "--hover": activeColor }}
      >
        <span className="hover:text-[var(--hover)]">{label}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 min-w-max"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="bg-white border border-gray-100 shadow-lg rounded-sm py-2 min-w-[200px]">
            {items.map((item, i) =>
              item.to ? (
                <Link
                  key={i}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-2 text-[10px] tracking-[0.15em] text-gray-600 hover:text-[var(--hover)] hover:bg-[#f8f6f3] transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={i}
                  className="block px-5 py-2 text-[10px] tracking-[0.15em] text-gray-300 cursor-default"
                >
                  {item.label}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}