import React from "react";
import { RefreshCw } from "lucide-react";

export default function PullRefreshIndicator({ pullDistance = 0, refreshing = false }) {
  if (!pullDistance && !refreshing) return null;
  const top = refreshing ? 24 : Math.min(pullDistance, 100);
  const spinning = refreshing || pullDistance >= 60;
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none"
      style={{ top: `${top}px` }}
      aria-hidden="true"
    >
      <RefreshCw
        className={`w-6 h-6 text-[#b89968] ${spinning ? "animate-spin" : ""}`}
      />
    </div>
  );
}