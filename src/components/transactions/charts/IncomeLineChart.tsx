"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartData } from "@/types/transaction";
import { TransactionService } from "@/services/transaction.service";

interface IncomeLineChartProps {
  data: ChartData;
  loading?: boolean;
}

export function IncomeLineChart({ data, loading = false }: IncomeLineChartProps) {
  if (loading) {
    return (
      <div className="h-[400px] bg-gray-50 rounded-[9px] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading chart data...</div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
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
          <p className="mt-2 text-sm text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Format date labels based on chart type
  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);

    if (data.chart_type === "monthly") {
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } else if (data.chart_type === "weekly") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-[9px] shadow-lg border-2 border-gray-200">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-600 mb-2">
            {formatDateLabel(label)}
          </p>
          <p className="text-sm font-medium text-green-600">
            Income: {TransactionService.formatGEL(payload[0].value)}
          </p>
          <p className="text-xs text-gray-500">
            {payload[0].payload.transaction_count} transaction{payload[0].payload.transaction_count !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data.data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDateLabel}
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
            formatter={(value) => "Income (GEL)"}
          />
          <Line
            type="monotone"
            dataKey="income_gel"
            stroke="#003049"
            strokeWidth={3}
            dot={{ fill: "#003049", r: 4 }}
            activeDot={{ r: 6, fill: "#4e35dc" }}
            name="Income (GEL)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
