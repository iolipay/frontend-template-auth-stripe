import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  TaxChartDataPoint,
  formatTaxAmount,
  GEORGIAN_TAX_CONSTANTS,
} from "@/types/tax";

interface ThresholdChartProps {
  data: TaxChartDataPoint[];
  loading?: boolean;
}

export function ThresholdChart({ data, loading }: ThresholdChartProps) {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-[9px] animate-pulse">
        <p className="text-gray-400">Loading chart...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-[9px]">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Format data for chart - cumulative income
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
    }),
    "Cumulative Income": point.cumulative_income || 0,
    "Threshold (500k)": GEORGIAN_TAX_CONSTANTS.annualThreshold,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const cumulativeIncome = payload[0]?.value || 0;
      const percentageUsed =
        (cumulativeIncome / GEORGIAN_TAX_CONSTANTS.annualThreshold) * 100;

      return (
        <div className="bg-white p-3 border-2 border-gray-200 rounded-[9px] shadow-lg">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-900 mb-2">
            {label}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-gray-600">Income:</span>
              <span className="text-xs font-medium text-green-600">
                {formatTaxAmount(cumulativeIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-gray-600">Threshold:</span>
              <span className="text-xs font-medium">
                {percentageUsed.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-gray-600">Remaining:</span>
              <span className="text-xs font-medium text-[#003049]">
                {formatTaxAmount(
                  GEORGIAN_TAX_CONSTANTS.annualThreshold - cumulativeIncome
                )}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            stroke="#d1d5db"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            stroke="#d1d5db"
            tickFormatter={(value) => `₾${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Threshold Reference Line */}
          <ReferenceLine
            y={GEORGIAN_TAX_CONSTANTS.annualThreshold}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: "500k Threshold",
              position: "right",
              fill: "#ef4444",
              fontSize: 12,
              fontWeight: 500,
            }}
          />
          <Area
            type="monotone"
            dataKey="Cumulative Income"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
