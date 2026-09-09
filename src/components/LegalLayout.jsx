import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft } from "lucide-react";

export function LegalSection({ number, title, children }) {
  return (
    <section>
      <h2 className="text-2xl font-light tracking-wider text-gray-800 mb-4">
        {number}. {title}
      </h2>
      <div className="text-gray-600 leading-relaxed tracking-wide space-y-4">
        {children}
      </div>
    </section>
  );
}

export default function LegalLayout({ title, heroImage, lastUpdated, children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-[1400px] mx-auto px-6">
          <Link to={createPageUrl("Home")} className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968] transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Title */}
      <div className="bg-[#f8f6f3] py-12 md:py-20">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-gray-700">
            {title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 py-12 md:py-20">
        <p className="text-sm text-gray-500 mb-12">{lastUpdated}</p>
        <div className="space-y-12">{children}</div>
      </div>
    </div>
  );
}