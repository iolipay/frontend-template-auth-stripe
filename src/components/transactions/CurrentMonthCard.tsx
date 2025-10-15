"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CurrentMonthStats } from "@/types/transaction";
import { TransactionService } from "@/services/transaction.service";

interface CurrentMonthCardProps {
  data: CurrentMonthStats;
  loading?: boolean;
}

export function CurrentMonthCard({ data, loading = false }: CurrentMonthCardProps) {
  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const progressPercent = (data.days_elapsed / data.days_in_month) * 100;
  const hasLastMonthData = data.last_month_income_gel !== null;
  const isIncreasing = data.month_over_month_change && data.month_over_month_change > 0;

  // Format month name
  const monthName = new Date(data.month + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="bg-gradient-to-br from-[#003049]/5 to-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium uppercase tracking-wide text-[#003049]">
            Current Month: {monthName}
          </h2>
          {hasLastMonthData && data.month_over_month_change !== null && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                isIncreasing ? "text-green-600" : "text-red-600"
              }`}
            >
              {isIncreasing ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              {Math.abs(data.month_over_month_change).toFixed(1)}%
            </div>
          )}
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Income So Far */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
              Income So Far
            </p>
            <p className="text-2xl font-medium text-green-600">
              {TransactionService.formatGEL(data.total_income_gel)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {data.transaction_count} transaction{data.transaction_count !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Daily Average */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
              Daily Average
            </p>
            <p className="text-2xl font-medium text-[#003049]">
              {TransactionService.formatGEL(data.daily_avg_gel)}
            </p>
            <p className="text-xs text-gray-500 mt-1">per day</p>
          </div>

          {/* Projected Total */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
              Projected Total
            </p>
            <p className="text-2xl font-medium text-[#4e35dc]">
              {TransactionService.formatGEL(data.projected_monthly_income_gel)}
            </p>
            <p className="text-xs text-gray-500 mt-1">by month end</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium uppercase tracking-wide">
              Month Progress
            </span>
            <span className="text-gray-500">
              {data.days_elapsed} of {data.days_in_month} days ({progressPercent.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-300 bg-gradient-to-r from-[#003049] to-[#4e35dc]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-right">
            {data.days_remaining} day{data.days_remaining !== 1 ? "s" : ""} remaining
          </p>
        </div>

        {/* Last Month Comparison */}
        {hasLastMonthData && (
          <div className="pt-4 border-t-2 border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last month total:</span>
              <span className="font-medium text-gray-900">
                {TransactionService.formatGEL(data.last_month_income_gel!)}
              </span>
            </div>
          </div>
        )}

        {/* Category Breakdown (if available) */}
        {Object.keys(data.by_category).length > 0 && (
          <div className="pt-4 border-t-2 border-gray-200">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">
              Top Categories
            </p>
            <div className="space-y-2">
              {Object.entries(data.by_category)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-gray-700">{category}</span>
                    <span className="font-medium text-green-600">
                      {TransactionService.formatGEL(amount)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
