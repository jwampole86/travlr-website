import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  MapPin,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3,
  ChevronDown,
  ArrowRight,
  Info,
} from "lucide-react";

// Pre-estimate landing screen. Sets expectations and surfaces the key
// disclaimers BEFORE the homeowner enters information or relies on any number.
// Positioned as "an estimate of potential" — never as a guaranteed outcome.
export default function EstimateIntro({ onStart, onOpenLegal }) {
  const [showMethod, setShowMethod] = useState(false);

  const considerItems = [
    { icon: Home, title: "Property", desc: "Type, bedrooms & bathrooms, sleeps, amenities, and characteristics" },
    { icon: MapPin, title: "Location", desc: "Neighborhood, nearby attractions, and local market position" },
    { icon: TrendingUp, title: "Market", desc: "Local demand, comparable properties, and typical nightly rates" },
    { icon: Calendar, title: "Seasonality", desc: "Occupancy patterns and demand shifts throughout the year" },
    { icon: BarChart3, title: "Demand", desc: "Market conditions and competitive positioning" },
  ];

  const receiveItems = [
    { icon: DollarSign, label: "Estimated Annual Revenue", sample: "$XX,XXX – $XX,XXX" },
    { icon: TrendingUp, label: "Estimated Monthly Revenue", sample: "$X,XXX – $X,XXX" },
    { icon: Calendar, label: "Estimated Occupancy", sample: "XX% – XX%" },
    { icon: DollarSign, label: "Estimated ADR", sample: "$XXX" },
    { icon: Info, label: "Market Insights", sample: "Local demand, seasonality & regulation summary" },
  ];

  return (
    <div className="space-y-12">
      {/* Intro statement — positioned as "potential", never a guarantee */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] text-gray-800 mb-4">
          DISCOVER YOUR PROPERTY'S VACATION-RENTAL POTENTIAL
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed tracking-wide">
          TRAVLR analyzes your property and relevant market data to generate a
          data-informed estimate of your property's potential vacation-rental
          revenue — a planning tool to help you understand what your home could earn.
        </p>
      </div>

      {/* What we consider */}
      <div className="bg-[#f8f6f3] p-8 rounded-sm">
        <h3 className="text-sm tracking-[0.2em] text-gray-700 uppercase font-medium mb-6 text-center">
          What Your Estimate Considers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {considerItems.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#b89968]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 tracking-wide">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What you'll receive */}
      <div>
        <h3 className="text-sm tracking-[0.2em] text-gray-700 uppercase font-medium mb-6 text-center">
          Your Results May Include
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {receiveItems.map(({ icon: Icon, label, sample }) => (
            <div key={label} className="border border-gray-200 rounded-sm p-5 bg-white">
              <Icon className="w-5 h-5 text-[#b89968] mb-3" />
              <p className="text-sm font-medium text-gray-800 tracking-wide">{label}</p>
              <p className="text-xs text-gray-400 mt-1 tracking-wide">{sample}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important to know */}
      <div className="border-l-4 border-[#b89968] bg-gray-50 p-6 rounded-sm">
        <h3 className="text-sm tracking-[0.2em] text-gray-700 uppercase font-medium mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#b89968]" />
          Important to Know
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 leading-relaxed tracking-wide">
          <li className="flex gap-2">
            <span className="text-[#b89968] flex-shrink-0">•</span>
            <span>Your Property Revenue Estimate is an estimate — not a guarantee of future revenue.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#b89968] flex-shrink-0">•</span>
            <span>Actual performance can vary based on market conditions, pricing strategy, availability, property condition, amenities, guest demand, competition, seasonality, and other factors.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#b89968] flex-shrink-0">•</span>
            <span>The estimate is based on the information available to TRAVLR and the information you provide. Estimates may change if additional or more accurate property information becomes available.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#b89968] flex-shrink-0">•</span>
            <span>This estimate does not constitute a quote, appraisal, or guaranteed income projection.</span>
          </li>
        </ul>
      </div>

      {/* Methodology — expandable for credibility */}
      <div>
        <button
          type="button"
          onClick={() => setShowMethod((s) => !s)}
          className="flex items-center gap-2 text-sm text-[#b89968] hover:text-[#a68858] transition-colors tracking-wide mx-auto"
        >
          How is my estimate calculated?
          <ChevronDown className={`w-4 h-4 transition-transform ${showMethod ? "rotate-180" : ""}`} />
        </button>
        {showMethod && (
          <div className="mt-4 max-w-2xl mx-auto bg-white border border-gray-200 rounded-sm p-6 text-sm text-gray-600 leading-relaxed tracking-wide">
            <h4 className="text-sm tracking-wider text-gray-700 uppercase font-medium mb-3">
              How TRAVLR Calculates Your Estimate
            </h4>
            <p>
              TRAVLR uses a combination of property characteristics, market conditions,
              comparable vacation-rental data, seasonality, demand indicators, and other
              available information to develop an estimated revenue range. Because
              vacation-rental performance changes over time, the estimate should be
              considered a planning tool rather than a guarantee of future income.
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <Button
          onClick={onStart}
          className="bg-[#b89968] hover:bg-[#a68858] text-white px-10 py-6 text-sm tracking-[0.15em] font-medium rounded-sm inline-flex items-center gap-2"
        >
          START MY ESTIMATE
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-xs text-gray-400 mt-4 max-w-md mx-auto leading-relaxed tracking-wide">
          Estimates are for informational purposes only and are not guaranteed.
          Actual vacation-rental performance may vary based on market conditions,
          property characteristics, pricing, occupancy, seasonality, and other factors.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500 tracking-wide">
          <a
            href="https://staytrvlr.com/terms"
            onClick={(e) => { e.preventDefault(); onOpenLegal?.("terms"); }}
            className="text-[#b89968] underline hover:text-[#a68858] transition-colors cursor-pointer"
          >
            Terms of Service
          </a>
          <span className="text-gray-300">|</span>
          <a
            href="https://staytrvlr.com/privacy"
            onClick={(e) => { e.preventDefault(); onOpenLegal?.("privacy"); }}
            className="text-[#b89968] underline hover:text-[#a68858] transition-colors cursor-pointer"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}