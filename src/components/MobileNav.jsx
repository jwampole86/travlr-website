import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    label: "VACATION HOMES",
    items: [
      { label: "ALL VACATION HOMES", to: createPageUrl("SearchResults") },
      { label: "3+ BEDROOMS", to: `${createPageUrl("SearchResults")}?bedrooms=3` },
      { label: "5+ BEDROOMS", to: `${createPageUrl("SearchResults")}?bedrooms=5` },
      { label: "7+ BEDROOMS", to: `${createPageUrl("SearchResults")}?bedrooms=7` },
      { label: "10+ BEDROOMS", to: `${createPageUrl("SearchResults")}?bedrooms=10` },
    ],
  },
  {
    label: "AREAS",
    items: [
      { label: "BERMUDA DUNES", to: "/areas/Bermuda%20Dunes" },
      { label: "COACHELLA", to: "/areas/Coachella" },
      { label: "INDIO", to: "/areas/Indio" },
      { label: "LA QUINTA", to: "/areas/La%20Quinta" },
      { label: "PALM DESERT", to: "/areas/Palm%20Desert" },
      { label: "PALM SPRINGS", to: "/areas/Palm%20Springs" },
      { label: "ASPEN", to: "/areas/Aspen" },
      { label: "BRECKENRIDGE", to: "/areas/Breckenridge" },
      { label: "VAIL", to: "/areas/Vail" },
      { label: "LAS VEGAS", to: "/areas/Las%20Vegas" },
      { label: "SEATTLE", to: "/areas/Seattle" },
      { label: "BELLEVUE", to: "/areas/Bellevue" },
      { label: "MIAMI", to: "/areas/Miami" },
    ],
  },
  {
    label: "SEE & DO",
    items: [
      { label: "ALL ACTIVITIES", to: createPageUrl("Activities") },
      { label: "DINE", to: createPageUrl("Activities") },
      { label: "SHOP", to: createPageUrl("Activities") },
      { label: "HIKE", to: createPageUrl("Activities") },
      { label: "GOLF", to: createPageUrl("Activities") },
      { label: "MUSIC FESTIVALS", to: createPageUrl("Activities") },
    ],
  },
  {
    label: "GUEST SERVICES",
    items: [
      { label: "DEDICATED CONCIERGE", to: createPageUrl("GuestServices") },
      { label: "CHEF SERVICES", to: createPageUrl("GuestServices") },
      { label: "DAILY HOUSEKEEPING", to: createPageUrl("GuestServices") },
      { label: "PRE-VILLA STOCKING", to: createPageUrl("GuestServices") },
      { label: "TRANSPORTATION", to: createPageUrl("GuestServices") },
      { label: "IN-HOME SPA", to: createPageUrl("GuestServices") },
    ],
  },
  {
    label: "GUEST RESOURCES",
    items: [
      { label: "FAQS", to: createPageUrl("GuestResources") },
      { label: "TRAVEL PROTECTION", to: createPageUrl("GuestResources") },
      { label: "GUEST DOCUMENTS", to: createPageUrl("GuestResources") },
      { label: "CONTACT US", to: createPageUrl("Contact") },
    ],
  },
];

const LOGO_SRC =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f9945aff077ee02e61835e/98433c0c0_35C7376B-41E8-4994-AE14-22D49B92A14A-1-384x384-0.png";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  // Lock body scroll while the menu is open so the page behind doesn't shift.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const close = () => {
    setOpen(false);
    setOpenSection(null);
  };

  return (
    <div className="lg:hidden">
      {/* Mobile header bar */}
      <div className="bg-white border-b border-gray-100 sa-top">
        <div className="relative flex items-center justify-between px-4 py-2.5">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="p-2.5 -ml-2 text-gray-700 active:text-[#b89968] transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to={createPageUrl("Home")} onClick={close} className="absolute left-1/2 flex -translate-x-1/2 items-center">
            <img src={LOGO_SRC} alt="TRAVLR Vacation Homes" className="h-14 sm:h-16" />
          </Link>

          <a
            href="tel:+19495398862"
            aria-label="Call TRAVLR"
            className="p-2.5 -mr-2 text-gray-700 active:text-[#b89968] transition-colors"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Full-screen slide-down menu — kept mounted and animated via CSS so it
          opens/closes smoothly instead of snapping in/out. */}
      <div
        className={`fixed inset-0 z-50 bg-white overflow-y-auto transition-all duration-300 ease-out sa-top ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <img src={LOGO_SRC} alt="TRAVLR Vacation Homes" className="h-14 sm:h-16" />
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="p-2.5 -mr-2 text-gray-700 active:text-[#b89968] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4 py-2">
          <Link
            to={createPageUrl("Home")}
            onClick={close}
            className="block py-4 text-sm tracking-[0.15em] text-gray-700 border-b border-gray-100 active:text-[#b89968] transition-colors"
          >
            HOME
          </Link>
          <Link
            to={createPageUrl("About")}
            onClick={close}
            className="block py-4 text-sm tracking-[0.15em] text-gray-700 border-b border-gray-100 active:text-[#b89968] transition-colors"
          >
            ABOUT
          </Link>
          <Link
            to="/careers"
            onClick={close}
            className="block py-4 text-sm tracking-[0.15em] text-gray-700 border-b border-gray-100 active:text-[#b89968] transition-colors"
          >
            CAREERS
          </Link>

          {SECTIONS.map((section) => {
            const isOpen = openSection === section.label;
            return (
              <div key={section.label} className="border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : section.label)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between min-h-[48px] py-3.5 text-sm tracking-[0.15em] text-gray-700 active:text-[#b89968] transition-colors"
                >
                  {section.label}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-y-auto transition-all duration-200 ease-out ${
                    isOpen ? "max-h-[36rem] pb-2 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={close}
                      className="flex items-center min-h-[44px] pl-5 pr-2 text-sm tracking-[0.1em] text-gray-600 active:text-[#b89968] active:bg-[#f8f6f3] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          <Link
            to={createPageUrl("Homeowners")}
            onClick={close}
            className="block py-4 text-sm tracking-[0.15em] text-gray-700 border-b border-gray-100 active:text-[#b89968] transition-colors"
          >
            HOMEOWNERS
          </Link>

          <Link
            to="/settings"
            onClick={close}
            className="block py-4 text-sm tracking-[0.15em] text-gray-700 border-b border-gray-100 active:text-[#b89968] transition-colors"
          >
            ACCOUNT
          </Link>

          <div className="pt-5 pb-8">
            <Link to={createPageUrl("Contact")} onClick={close}>
              <Button className="w-full bg-[#c4a574] hover:bg-[#b89968] text-white py-4 text-sm tracking-[0.15em] font-medium rounded-sm">
                CONNECT
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}