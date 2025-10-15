"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { CurrentMonthCard } from "@/components/transactions/CurrentMonthCard";
import { IncomeLineChart } from "@/components/transactions/charts/IncomeLineChart";
import { MonthlyBarChart } from "@/components/transactions/charts/MonthlyBarChart";
import {
  ChartData,
  CurrentMonthStats,
  TransactionStatistics,
  MonthlyStatsResponse,
} from "@/types/transaction";
import { TransactionService } from "@/services/transaction.service";
import { TaxOverview } from "@/types/tax";
import { TaxService } from "@/services/tax.service";
import { ThresholdProgress } from "@/components/tax/ThresholdProgress";
import { Badge } from "@/components/ui/Badge";
import { getTaxStatusLabel } from "@/types/tax";
import { AuthService } from "@/services/auth.service";

export default function Dashboard() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState<CurrentMonthStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [stats, setStats] = useState<TransactionStatistics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyStatsResponse | null>(null);
  const [taxOverview, setTaxOverview] = useState<TaxOverview | null>(null);

  const [currentMonthLoading, setCurrentMonthLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [taxLoading, setTaxLoading] = useState(true);

  const [error, setError] = useState("");
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    checkIfAdmin();
  }, []);

  const checkIfAdmin = async () => {
    try {
      const user = await AuthService.getCurrentUser();

      // If user is admin, redirect to admin dashboard
      if (user.is_admin) {
        router.push("/dashboard/admin");
        return;
      }

      // User is not admin, load regular dashboard
      setCheckingAdmin(false);
      loadDashboardData();
    } catch (error) {
      console.error("Failed to check user role:", error);
      setCheckingAdmin(false);
      loadDashboardData();
    }
  };

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

    // Load last 6 months data
    try {
      setMonthlyLoading(true);
      const currentYear = new Date().getFullYear();
      const allMonthlyData = await TransactionService.getMonthlyStatistics(currentYear);

      // Get only last 6 months
      const currentMonth = new Date().getMonth() + 1; // 1-12
      const last6Months = allMonthlyData.months
        .filter(m => {
          const monthNum = parseInt(m.month.split("-")[1]);
          return monthNum <= currentMonth && monthNum > currentMonth - 6;
        })
        .slice(-6); // Ensure we only get last 6

      setMonthlyData({
        ...allMonthlyData,
        months: last6Months,
      });
    } catch (err) {
      console.error("Failed to load monthly data:", err);
    } finally {
      setMonthlyLoading(false);
    }

    // Load tax overview
    try {
      setTaxLoading(true);
      const taxData = await TaxService.getOverview();
      setTaxOverview(taxData);
    } catch (err) {
      console.error("Failed to load tax overview:", err);
    } finally {
      setTaxLoading(false);
    }
  };

  // Show loading while checking admin status
  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#003049] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 uppercase tracking-wide">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

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

      {/* Tax Overview Summary */}
      {taxOverview && !taxLoading && (
        <Card hoverable={false} className="bg-gradient-to-br from-[#003049]/5 to-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium uppercase tracking-wide text-[#003049]">
                Tax Status {taxOverview.year}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Georgian Small Business • 1% Tax Rate
              </p>
            </div>
            <Badge
              variant={
                taxOverview.status === "on_track"
                  ? "success"
                  : taxOverview.status === "exceeded"
                  ? "danger"
                  : "warning"
              }
            >
              {getTaxStatusLabel(taxOverview.status)}
            </Badge>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <ThresholdProgress
                percentage={taxOverview.threshold_percentage_used}
                status={taxOverview.status}
                size="small"
              />
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mt-2">
                Threshold Used
              </p>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {taxOverview.threshold_percentage_used.toFixed(1)}%
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                Income YTD
              </p>
              <p className="text-lg font-medium text-green-600">
                ₾{taxOverview.total_income_ytd_gel.toLocaleString()}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                Tax Due
              </p>
              <p className="text-lg font-medium text-[#003049]">
                ₾{taxOverview.tax_liability_ytd_gel.toLocaleString()}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                Pending
              </p>
              <p className="text-lg font-medium text-amber-600">
                {taxOverview.months_pending} {taxOverview.months_pending === 1 ? "month" : "months"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
            <p className="text-xs text-gray-600">
              {taxOverview.next_declaration_due && (
                <>
                  Next deadline:{" "}
                  <span className="font-medium text-[#4e35dc]">
                    {new Date(taxOverview.next_declaration_due).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </>
              )}
            </p>
            <Link href="/dashboard/tax-overview">
              <button className="text-xs text-[#4e35dc] hover:underline font-medium">
                View Tax Dashboard →
              </button>
            </Link>
          </div>
        </Card>
      )}

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
          {chartData && !chartLoading && (
            <div className="mt-4 pt-4 border-t-2 border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Period Total:</span>
                <span className="font-medium text-green-600">
                  {TransactionService.formatGEL(chartData.total_income_gel)}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Last 6 Months Comparison */}
        {monthlyData && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium uppercase tracking-wide">
                Last 6 Months
              </h2>
              <Link
                href="/dashboard/analytics"
                className="text-sm text-[#4e35dc] hover:underline font-medium"
              >
                View More →
              </Link>
            </div>
            <MonthlyBarChart data={monthlyData} loading={monthlyLoading} />
            {monthlyData && !monthlyLoading && monthlyData.months.length > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Highest Month</p>
                    <p className="text-sm font-medium text-[#003049]">
                      {TransactionService.formatGEL(
                        Math.max(...monthlyData.months.map(m => m.total_income_gel))
                      )}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">6-Month Avg</p>
                    <p className="text-sm font-medium text-[#4e35dc]">
                      {TransactionService.formatGEL(
                        monthlyData.months.reduce((sum, m) => sum + m.total_income_gel, 0) /
                        monthlyData.months.length
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-medium uppercase tracking-wide mb-4">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
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
                  <p className="text-xs text-gray-500">Record transaction</p>
                </div>
              </div>
            </button>
          </Link>

          <Link href="/dashboard/tax-overview">
            <button className="w-full p-4 text-left border-2 border-gray-200 rounded-[9px] hover:border-[#003049] hover:shadow-lg transition-all duration-200 bg-[#003049]/5">
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
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide">
                    Tax Dashboard
                  </p>
                  <p className="text-xs text-gray-500">Declarations & status</p>
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
                    Analytics
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
                    History
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
