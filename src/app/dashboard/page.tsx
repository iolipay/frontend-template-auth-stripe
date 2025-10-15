"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { CurrentMonthCard } from "@/components/transactions/CurrentMonthCard";
import { IncomeLineChart } from "@/components/transactions/charts/IncomeLineChart";
import { CategoryPieChart } from "@/components/transactions/charts/CategoryPieChart";
import {
  ChartData,
  CurrentMonthStats,
  TransactionStatistics,
} from "@/types/transaction";
import { TransactionService } from "@/services/transaction.service";

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState<CurrentMonthStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [stats, setStats] = useState<TransactionStatistics | null>(null);

  const [currentMonthLoading, setCurrentMonthLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Load current month data
    try {
      setCurrentMonthLoading(true);
      const monthData = await TransactionService.getCurrentMonthStatistics();
      setCurrentMonth(monthData);
    } catch (err) {
      console.error("Failed to load current month:", err);
      setError("Failed to load some dashboard data");
    } finally {
      setCurrentMonthLoading(false);
    }

    // Load last 30 days chart
    try {
      setChartLoading(true);
      const chart = await TransactionService.getChartData("daily");
      setChartData(chart);
    } catch (err) {
      console.error("Failed to load chart:", err);
    } finally {
      setChartLoading(false);
    }

    // Load overall stats
    try {
      setStatsLoading(true);
      const statistics = await TransactionService.getStatistics();
      setStats(statistics);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-medium uppercase tracking-wide">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back! Here's your income overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/transactions">
            <Button variant="secondary">View All Transactions</Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button variant="primary">Full Analytics</Button>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      {/* Current Month Overview */}
      {currentMonth && (
        <CurrentMonthCard data={currentMonth} loading={currentMonthLoading} />
      )}

      {/* Quick Stats Grid */}
      {stats && !statsLoading && (
        <div className="grid md:grid-cols-3 gap-4">
          {/* Total Income */}
          <Card hoverable={false}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                  Total Income (All Time)
                </p>
                <p className="text-2xl font-medium text-green-600">
                  {TransactionService.formatGEL(stats.total_income_gel)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.transaction_count} transactions
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          {/* Categories Used */}
          <Card hoverable={false}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                  Income Categories
                </p>
                <p className="text-2xl font-medium text-[#003049]">
                  {Object.keys(stats.by_category).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">active sources</p>
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          {/* Currencies Used */}
          <Card hoverable={false}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                  Currencies Tracked
                </p>
                <p className="text-2xl font-medium text-[#4e35dc]">
                  {stats.currencies_used.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.currencies_used.join(", ")}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#4e35dc]/10 rounded-[9px] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#4e35dc]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Trend (Last 30 Days) */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium uppercase tracking-wide">
              Recent Trend (30 Days)
            </h2>
            <Link
              href="/dashboard/analytics"
              className="text-sm text-[#4e35dc] hover:underline font-medium"
            >
              View More →
            </Link>
          </div>
          {chartData && (
            <IncomeLineChart data={chartData} loading={chartLoading} />
          )}
        </Card>

        {/* Category Breakdown */}
        {currentMonth && Object.keys(currentMonth.by_category).length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium uppercase tracking-wide">
                Current Month by Category
              </h2>
              <Link
                href="/dashboard/analytics"
                className="text-sm text-[#4e35dc] hover:underline font-medium"
              >
                View More →
              </Link>
            </div>
            <CategoryPieChart
              data={currentMonth.by_category}
              loading={currentMonthLoading}
            />
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-medium uppercase tracking-wide mb-4">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/dashboard/transactions">
            <button className="w-full p-4 text-left border-2 border-gray-200 rounded-[9px] hover:border-[#003049] hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#003049] rounded-[1px] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide">
                    Add Income
                  </p>
                  <p className="text-xs text-gray-500">Record new transaction</p>
                </div>
              </div>
            </button>
          </Link>

          <Link href="/dashboard/analytics">
            <button className="w-full p-4 text-left border-2 border-gray-200 rounded-[9px] hover:border-[#4e35dc] hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4e35dc] rounded-[1px] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide">
                    View Analytics
                  </p>
                  <p className="text-xs text-gray-500">Detailed insights</p>
                </div>
              </div>
            </button>
          </Link>

          <Link href="/dashboard/transactions">
            <button className="w-full p-4 text-left border-2 border-gray-200 rounded-[9px] hover:border-green-500 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-[1px] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide">
                    View History
                  </p>
                  <p className="text-xs text-gray-500">All transactions</p>
                </div>
              </div>
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
