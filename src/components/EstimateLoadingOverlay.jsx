import React, { useState, useEffect } from "react";
import { MapPin, Check, Loader2 } from "lucide-react";

const STEPS = [
  "Researching the local short-term rental market",
  "Estimating average nightly rate (ADR)",
  "Calculating occupancy and seasonality",
  "Reviewing city regulations & permits",
  "Projecting your net revenue",
];

export default function EstimateLoadingOverlay({ address, isLoading }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setActiveStep(0);
      return;
    }
    const t = setInterval(() => {
      setActiveStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 1800);
    return () => clearInterval(t);
  }, [isLoading]);

  if (!isLoading) return null;

  const pct = Math.round(((activeStep + 1) / STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85 backdrop-blur-sm px-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-sm shadow-xl p-8">
        {/* Animated icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#b89968]/20 rounded-full animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-[#b89968]/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-[#b89968]" />
            </div>
          </div>
        </div>

        <h3 className="text-center text-lg font-light tracking-wider text-gray-800 mb-1">
          Analyzing your property
        </h3>
        {address && (
          <p className="text-center text-sm text-gray-500 tracking-wide mb-6 truncate px-4">
            {address}
          </p>
        )}

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-[#b89968] transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Steps */}
        <ul className="space-y-3">
          {STEPS.map((label, i) => {
            const done = i < activeStep;
            const current = i === activeStep;
            return (
              <li key={label} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {done ? (
                    <span className="w-5 h-5 rounded-full bg-[#b89968] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  ) : current ? (
                    <Loader2 className="w-5 h-5 text-[#b89968] animate-spin" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-gray-200" />
                  )}
                </span>
                <span
                  className={
                    done
                      ? "text-sm text-gray-700 tracking-wide"
                      : current
                      ? "text-sm text-gray-800 tracking-wide font-medium"
                      : "text-sm text-gray-400 tracking-wide"
                  }
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="text-center text-xs text-gray-400 tracking-wide mt-6">
          This usually takes 15–30 seconds — we're pulling live local data.
        </p>
      </div>
    </div>
  );
}