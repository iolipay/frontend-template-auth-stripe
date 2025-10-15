"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MonthlyStatsResponse } from "@/types/transaction";
import { TransactionService } from "@/services/transaction.service";

interface MonthlyBarChartProps {
  data: MonthlyStatsResponse;
  loading?: boolean;
}

export function MonthlyBarChart({ data, loading = false }: MonthlyBarChartProps) {
  if (loading) {
    return (
      <div className="h-[400px] bg-gray-50 rounded-[9px] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading chart data...</div>
      </div>
    );
  }

  if (!data || data.months.length === 0) {
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No monthly data available</p>
        </div>
      </div>
    );
  }

  // Format month label (e.g., "2025-01" -> "Jan")
  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  // Transform data for recharts
  const chartData = data.months.map((month) => ({
    month: formatMonthLabel(month.month),
    fullMonth: month.month,
    income: month.total_income_gel,
    transactions: month.transaction_count,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-[9px] shadow-lg border-2 border-gray-200">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-600 mb-2">
            {payload[0].payload.fullMonth}
          </p>
          <p className="text-sm font-medium text-green-600">
            Income: {TransactionService.formatGEL(payload[0].value)}
          </p>
          <p className="text-xs text-gray-500">
            {payload[0].payload.transactions} transaction{payload[0].payload.transactions !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            tickFormatter={(value) => `₾${value.toLocaleString()}`}
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", fontWeight: 500 }}
            formatter={(value) => "Monthly Income (GEL)"}
          />
          <Bar
            dataKey="income"
            fill="#003049"
            radius={[4, 4, 0, 0]}
            name="Monthly Income (GEL)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
