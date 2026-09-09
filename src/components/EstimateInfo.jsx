import React from "react";
import {
  MapPin,
  TrendingUp,
  FileText,
  DollarSign,
  Calendar,
  Scale,
  ShieldCheck,
  Sparkles,
  Award,
  Users,
} from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Enter Your Address",
    desc: "Start typing your property address and select it from the validated suggestions.",
  },
  {
    icon: TrendingUp,
    title: "Get Your Instant Estimate",
    desc: "Our AI analyzes local market data, comparable rentals, and regulations in seconds.",
  },
  {
    icon: FileText,
    title: "Receive Your Full Report",
    desc: "Share your contact details and our team follows up with a tailored rental strategy.",
  },
];

const included = [
  { icon: DollarSign, label: "Estimated Nightly Rate (ADR)" },
  { icon: Calendar, label: "Projected Occupancy Rate" },
  { icon: TrendingUp, label: "Gross & Net Monthly Revenue" },
  { icon: DollarSign, label: "Projected Annual Net Income" },
  { icon: Scale, label: "Local STR Regulation Summary" },
  { icon: FileText, label: "Market Demand & Seasonality Analysis" },
];

const benefits = [
  {
    icon: Award,
    title: "Luxury-Brand Positioning",
    desc: "Your home is marketed alongside a curated collection of premium vacation rentals to a discerning clientele.",
  },
  {
    icon: Users,
    title: "Full-Service Management",
    desc: "Marketing, guest services, housekeeping, and maintenance — handled end-to-end so you earn without the effort.",
  },
  {
    icon: ShieldCheck,
    title: "Property Protection",
    desc: "Rigorous guest screening, damage protection, and on-the-ground care keep your investment safe.",
  },
  {
    icon: Sparkles,
    title: "Personalized Experiences",
    desc: "Concierge add-ons — private chefs, spa, tours — elevate stays and command premium nightly rates.",
  },
];

export default function EstimateInfo({ onOpenLegal }) {
  return (
    <div className="space-y-20">
      {/* How It Works */}
      <section>
        <div className="text-center mb-12">
          <h3 className="text-[28px] tracking-[0.2em] font-light text-gray-700 mb-3">
            HOW IT WORKS
          </h3>
          <p className="text-gray-500 text-sm tracking-wider">
            Your estimate in three simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.title} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="w-16 h-16 rounded-full bg-[#b89968]/10 flex items-center justify-center">
                  <s.icon className="w-7 h-7 text-[#b89968]" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#b89968] text-white text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </span>
              </div>
              <h4 className="text-base tracking-wider font-medium text-gray-700 mb-2">
                {s.title.toUpperCase()}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed tracking-wide px-2">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-[#f8f6f3] -mx-6 px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-[28px] tracking-[0.2em] font-light text-gray-700 mb-3">
            WHAT'S IN YOUR ESTIMATE
          </h3>
          <p className="text-gray-500 text-sm tracking-wider">
            A comprehensive, data-backed snapshot of your home's rental potential
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {included.map((item) => (
            <div
              key={item.label}
              className="bg-white p-5 rounded-sm flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-[#b89968]/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-[#b89968]" />
              </div>
              <p className="text-sm text-gray-700 tracking-wide leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-8 tracking-wide max-w-2xl mx-auto">
          Estimates are generated from public market data and comparable rentals. A TRAVLR
          specialist refines these figures with an on-site assessment before any commitment.
        </p>
      </section>

      {/* Why TRAVLR */}
      <section>
        <div className="text-center mb-12">
          <h3 className="text-[28px] tracking-[0.2em] font-light text-gray-700 mb-3">
            WHY PARTNER WITH TRAVLR
          </h3>
          <p className="text-gray-500 text-sm tracking-wider">
            More than an estimate — a management partner invested in your returns
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#b89968]/10 flex items-center justify-center flex-shrink-0">
                <b.icon className="w-6 h-6 text-[#b89968]" />
              </div>
              <div>
                <h4 className="text-base tracking-wider font-medium text-gray-700 mb-2">
                  {b.title.toUpperCase()}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed tracking-wide">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom legal links — Terms of Service & Privacy Policy, present on the
          page that loads after "START MY ESTIMATE" so users can review them. */}
      <div className="flex items-center justify-center gap-4 pt-2 text-xs tracking-wider">
        <a
          href="https://staytrvlr.com/terms"
          onClick={(e) => { e.preventDefault(); onOpenLegal?.("terms"); }}
          className="text-[#b89968] underline hover:text-[#a68858] transition-colors cursor-pointer uppercase"
        >
          Terms of Service
        </a>
        <span className="text-gray-300">|</span>
        <a
          href="https://staytrvlr.com/privacy"
          onClick={(e) => { e.preventDefault(); onOpenLegal?.("privacy"); }}
          className="text-[#b89968] underline hover:text-[#a68858] transition-colors cursor-pointer uppercase"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
}