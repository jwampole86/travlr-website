import React, { useEffect } from "react";
import { X } from "lucide-react";
import { TermsContent, PrivacyContent } from "@/components/legal/LegalContent";

export default function LegalModal({ type, onClose }) {
  const isTerms = type === "terms";
  const title = isTerms ? "TERMS OF SERVICE" : "PRIVACY POLICY";
  const lastUpdated = "Last updated: August 25, 2026";

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full h-full sm:h-[90vh] sm:max-w-3xl sm:rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#f8f6f3] flex-shrink-0">
          <h2 className="text-xl font-light tracking-[0.2em] text-gray-700">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-800 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-8">
          <p className="text-sm text-gray-500 mb-8">{lastUpdated}</p>
          <div className="space-y-10">
            {isTerms ? <TermsContent /> : <PrivacyContent />}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 px-6 py-3 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-[#b89968] hover:bg-[#a68858] text-white py-2.5 text-xs tracking-[0.15em] font-medium rounded-sm transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}