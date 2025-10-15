import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TaxChartDataPoint, formatTaxAmount } from "@/types/tax";

interface TaxTrendChartProps {
  data: TaxChartDataPoint[];
  loading?: boolean;
}

export function TaxTrendChart({ data, loading }: TaxTrendChartProps) {
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

  // Format data for chart
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
    }),
    Income: point.income || 0,
    Tax: point.tax || 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border-2 border-gray-200 rounded-[9px] shadow-lg">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-900 mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span
                className="text-xs"
                style={{ color: entry.color }}
              >
                {entry.name}:
              </span>
              <span className="text-xs font-medium">
                {formatTaxAmount(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
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
          <Legend
            wrapperStyle={{ fontSize: "12px", fontWeight: 500 }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="Income"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Tax"
            stroke="#003049"
            strokeWidth={3}
            dot={{ fill: "#003049", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
