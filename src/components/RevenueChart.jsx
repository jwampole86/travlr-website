import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Seasonal demand multipliers for a desert/leisure short-term rental market
// (peak in winter/spring, dip in summer). Applied to the estimated net
// monthly revenue to project a 12-month outlook that's easy to read at a glance.
const MONTH_MULTIPLIERS = [
  { m: "Jan", mult: 1.3 },
  { m: "Feb", mult: 1.4 },
  { m: "Mar", mult: 1.5 },
  { m: "Apr", mult: 1.6 },
  { m: "May", mult: 1.1 },
  { m: "Jun", mult: 0.7 },
  { m: "Jul", mult: 0.6 },
  { m: "Aug", mult: 0.6 },
  { m: "Sep", mult: 0.8 },
  { m: "Oct", mult: 1.1 },
  { m: "Nov", mult: 1.2 },
  { m: "Dec", mult: 1.3 },
];

const fmt = (n) =>
  typeof n === "number" && !isNaN(n) ? `$${Math.round(n).toLocaleString()}` : "—";

export default function RevenueChart({ netMonthlyRevenue }) {
  const data = useMemo(() => {
    const base = typeof netMonthlyRevenue === "number" && !isNaN(netMonthlyRevenue)
      ? netMonthlyRevenue
      : 0;
    return MONTH_MULTIPLIERS.map(({ m, mult }) => ({
      month: m,
      revenue: Math.round(base * mult),
    }));
  }, [netMonthlyRevenue]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-sm">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUpSmall />
        <h3 className="text-sm tracking-wider text-gray-700 uppercase font-medium">
          Potential Monthly Revenue
        </h3>
      </div>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        12-month projection based on estimated net monthly revenue and typical
        seasonal demand. Figures are estimates of potential, not a guarantee.
      </p>
      <div className="w-full h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              interval={0}
              minTickGap={2}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
              width={40}
            />
            <Tooltip
              cursor={{ fill: "#f8f6f3" }}
              contentStyle={{
                borderRadius: 4,
                border: "1px solid #e5e7eb",
                fontSize: 12,
              }}
              formatter={(v) => [fmt(v), "Est. Revenue"]}
              labelStyle={{ color: "#374151", fontWeight: 500 }}
            />
            <Bar dataKey="revenue" fill="#b89968" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const TrendingUpSmall = () => (
  <svg
    className="w-5 h-5 text-[#b89968]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 17l6-6 4 4 8-8M17 7h4v4"
    />
  </svg>
);