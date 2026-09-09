import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Briefcase, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAREERS } from "@/data/careersData";

const salaryRank = (r) => {
  const matches = (r.shortComp || "").match(/\$([\d,]+)/g) || [];
  const nums = matches.map((m) => parseInt(m.replace(/[$,]/g, ""), 10));
  return nums.length ? Math.max(...nums) : 0;
};
const sortedCareers = [...CAREERS].sort((a, b) => salaryRank(b) - salaryRank(a));

export default function Careers() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] dark:bg-slate-950 dark:border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center text-[11px] tracking-[0.15em] text-gray-600 hover:text-[#c4a574] transition-colors dark:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Link>
          <h1 className="text-[11px] tracking-[0.3em] text-gray-700 dark:text-slate-200">CAREERS</h1>
          <span className="w-12" />
        </div>
      </div>

      {/* Intro */}
      <div className="py-12 md:py-20 bg-white dark:bg-slate-950">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#b89968]/10 mb-6">
            <Briefcase className="w-7 h-7 text-[#b89968]" />
          </div>
          <h2 className="text-2xl md:text-[36px] tracking-[0.2em] font-light text-gray-700 mb-4 dark:text-slate-100">
            JOIN THE TRAVLR TEAM
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed tracking-wide dark:text-slate-300">
            TRAVLR Vacation Homes is growing across multiple states. We're building a team of hospitality
            professionals who care deeply about the guest and homeowner experience. Most roles are fully
            remote; field roles are travel-based. Tap any role below to read the full listing and apply directly.
          </p>
        </div>
      </div>

      {/* Open Roles — dark panel */}
      <div className="pb-16 md:pb-24 bg-white dark:bg-slate-950">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="bg-[#1f1f1f] rounded-sm overflow-hidden border border-white/10">
            <div className="hidden md:grid grid-cols-[1.3fr_1.3fr_1.8fr] gap-6 px-6 py-4 border-b border-white/15">
              <div className="text-[11px] tracking-[0.2em] uppercase text-[#a1a1a1]">Role</div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-[#a1a1a1]">Salary / Compensation</div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-[#a1a1a1]">Short Description</div>
            </div>
            {sortedCareers.map((r) => (
              <Link
                key={r.slug}
                to={`/careers/${r.slug}`}
                className="block md:grid md:grid-cols-[1.3fr_1.3fr_1.8fr] gap-6 px-6 py-5 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors group"
              >
                {/* Mobile card layout */}
                <div className="md:hidden">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-white font-semibold text-base leading-snug flex-1">{r.title}</h3>
                    <ChevronRight className="w-5 h-5 text-[#b89968] flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-[#b89968] text-sm font-medium tracking-wide mb-2">{r.shortComp}</p>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">{r.shortDesc}</p>
                  <span className="inline-flex items-center text-[#b89968] text-xs tracking-[0.15em] uppercase font-medium">
                    View & apply →
                  </span>
                </div>

                {/* Desktop grid layout */}
                <div className="hidden md:block text-white font-semibold">
                  <span className="inline-flex items-start gap-2">
                    <span>{r.title}</span>
                    <ChevronRight className="w-4 h-4 text-[#b89968] mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>
                <div className="hidden md:block text-white/80 text-sm leading-relaxed">
                  {r.shortComp}
                </div>
                <div className="hidden md:block text-white/70 text-sm leading-relaxed">
                  {r.shortDesc}
                  <span className="text-[#b89968] group-hover:text-[#c4a574] transition-colors ml-1 whitespace-nowrap">
                    View & apply →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Apply CTA */}
      <div className="pb-16 md:pb-24 bg-white dark:bg-slate-950">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <h3 className="text-xl md:text-2xl tracking-[0.15em] font-light text-gray-700 mb-4 dark:text-slate-100">
            DON'T SEE THE RIGHT FIT?
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto dark:text-slate-300">
            Send your resume and the role you're interested in to our team and we'll be in touch.
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button className="bg-[#b89968] hover:bg-[#a68858] text-white px-8 py-3 text-[11px] tracking-[0.15em] font-medium rounded-sm">
              CONTACT US
            </Button>
          </Link>
          <p className="text-xs text-gray-400 dark:text-slate-500 tracking-wide mt-8">
            Learn more about TRAVLR Vacation Homes at staytrvlr.com.
          </p>
        </div>
      </div>
    </div>
  );
}