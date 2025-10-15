"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TransactionStatistics, getCategoryLabel } from "@/types/transaction";
import { TransactionService } from "@/services/transaction.service";

interface TransactionStatsProps {
  statistics: TransactionStatistics;
  loading?: boolean;
}

export function TransactionStats({
  statistics,
  loading = false,
}: TransactionStatsProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    TransactionService.formatGEL(amount);

  return (
    <div className="space-y-4">
      {/* Main stats cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Total Income */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                Total Income
              </p>
              <p className="text-2xl font-medium text-green-600">
                {formatCurrency(statistics.total_income_gel)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {statistics.transaction_count} income records
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-[9px] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* Currencies Used */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                Currencies Used
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {statistics.currencies_used.length > 0 ? (
                  statistics.currencies_used.map((currency) => (
                    <Badge key={currency} variant="secondary">
                      {currency}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No currencies yet</p>
                )}
              </div>
            </div>
            <div className="w-12 h-12 bg-[#003049]/10 rounded-[9px] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[#003049]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Category breakdown */}
      {Object.keys(statistics.by_category).length > 0 && (
        <Card>
          <h3 className="text-sm font-medium uppercase tracking-wide mb-4">
            Income by Category
          </h3>
          <div className="space-y-3">
            {Object.entries(statistics.by_category)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const maxAmount = Math.max(
                  ...Object.values(statistics.by_category)
                );
                const percentage = (amount / maxAmount) * 100;

                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm capitalize">
                        {getCategoryLabel(category as any)}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        +{formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300 bg-green-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      )}
    </div>
  );
}
