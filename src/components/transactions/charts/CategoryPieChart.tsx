"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getCategoryLabel } from "@/types/transaction";
import { TransactionService } from "@/services/transaction.service";

interface CategoryPieChartProps {
  data: Record<string, number>;
  loading?: boolean;
}

// Color palette for categories (matching design system)
const COLORS = [
  "#003049", // Navy blue
  "#4e35dc", // Purple
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#84cc16", // Lime
];

export function CategoryPieChart({ data, loading = false }: CategoryPieChartProps) {
  if (loading) {
    return (
      <div className="h-[400px] bg-gray-50 rounded-[9px] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading chart data...</div>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-[400px] bg-gray-50 rounded-[9px] flex items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No category data available</p>
        </div>
      </div>
    );
  }

  // Transform data for recharts
  const chartData = Object.entries(data).map(([category, amount]) => ({
    name: getCategoryLabel(category as any),
    value: amount,
    category: category,
  }));

  // Sort by value descending
  chartData.sort((a, b) => b.value - a.value);

  // Calculate total
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom label
  const renderLabel = (entry: any) => {
    if (!total || total === 0) return "";
    const percent = ((entry.value / total) * 100).toFixed(0);
    return `${percent}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-[9px] shadow-lg border-2 border-gray-200">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-600 mb-1">
            {payload[0].name}
          </p>
          <p className="text-sm font-medium text-green-600">
            {TransactionService.formatGEL(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            formatter={(value, entry: any) => {
              const amount = TransactionService.formatGEL(entry.payload.value);
              return `${value}: ${amount}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
