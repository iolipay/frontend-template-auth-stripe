"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { CurrentMonthCard } from "@/components/transactions/CurrentMonthCard";
import { IncomeLineChart } from "@/components/transactions/charts/IncomeLineChart";
import { CategoryPieChart } from "@/components/transactions/charts/CategoryPieChart";
import { MonthlyBarChart } from "@/components/transactions/charts/MonthlyBarChart";
import {
  ChartData,
  CurrentMonthStats,
  MonthlyStatsResponse,
} from "@/types/transaction";
import { TransactionService } from "@/services/transaction.service";

type ChartType = "daily" | "weekly" | "monthly" | "yearly";

export default function AnalyticsPage() {
  const [currentMonth, setCurrentMonth] = useState<CurrentMonthStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyStatsResponse | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>("daily");

  const [currentMonthLoading, setCurrentMonthLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [monthlyLoading, setMonthlyLoading] = useState(true);

  const [error, setError] = useState("");

  // Load current month data
  const loadCurrentMonth = async () => {
    try {
      setCurrentMonthLoading(true);
      setError("");
      const data = await TransactionService.getCurrentMonthStatistics();
      setCurrentMonth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load current month data");
      console.error("Failed to load current month data:", err);
    } finally {
      setCurrentMonthLoading(false);
    }
  };

  // Load chart data based on selected type
  const loadChartData = async (type: ChartType) => {
    try {
      setChartLoading(true);
      setError("");

      if (type === "yearly") {
        // For yearly view, use monthly data
        return;
      }

      const data = await TransactionService.getChartData(type);
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chart data");
      console.error("Failed to load chart data:", err);
    } finally {
      setChartLoading(false);
    }
  };

  // Load monthly/yearly data
  const loadMonthlyData = async () => {
    try {
      setMonthlyLoading(true);
      setError("");
      const currentYear = new Date().getFullYear();
      const data = await TransactionService.getMonthlyStatistics(currentYear);
      setMonthlyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load yearly data");
      console.error("Failed to load yearly data:", err);
    } finally {
      setMonthlyLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCurrentMonth();
    loadMonthlyData();
  }, []);

  // Load chart data when type changes
  useEffect(() => {
    if (selectedChartType !== "yearly") {
      loadChartData(selectedChartType);
    } else {
      setChartLoading(false);
    }
  }, [selectedChartType]);

  const handleChartTypeChange = (type: ChartType) => {
    setSelectedChartType(type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-medium uppercase tracking-wide">
          Income Analytics
        </h1>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Current Month Overview */}
      {currentMonth && (
        <CurrentMonthCard data={currentMonth} loading={currentMonthLoading} />
      )}

      {/* Chart Type Selector */}
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-lg font-medium uppercase tracking-wide">
            Income Trends
          </h2>
          <div className="flex gap-2">
            {(["daily", "weekly", "monthly", "yearly"] as ChartType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleChartTypeChange(type)}
                className={`
                  px-4 py-2 text-sm font-medium uppercase tracking-wide rounded-[1px] border-2
                  transition-all duration-200
                  ${
                    selectedChartType === type
                      ? "bg-[#003049] text-white border-[#003049]"
                      : "bg-white text-[#003049] border-gray-300 hover:border-[#003049]"
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {selectedChartType === "yearly" ? (
            monthlyData && (
              <MonthlyBarChart data={monthlyData} loading={monthlyLoading} />
            )
          ) : (
            chartData && (
              <IncomeLineChart data={chartData} loading={chartLoading} />
            )
          )}
        </div>

        {/* Chart Summary */}
        {selectedChartType === "yearly" && monthlyData && !monthlyLoading && (
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Total for Year
                </p>
                <p className="text-xl font-medium text-green-600">
                  {TransactionService.formatGEL(monthlyData.grand_total_gel)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Monthly Average
                </p>
                <p className="text-xl font-medium text-[#003049]">
                  {TransactionService.formatGEL(monthlyData.avg_monthly_income_gel)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Total Months
                </p>
                <p className="text-xl font-medium text-gray-900">
                  {monthlyData.total_months}
                </p>
              </div>
            </div>
          </div>
        )}

        {chartData && selectedChartType !== "yearly" && !chartLoading && (
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Total Income
                </p>
                <p className="text-xl font-medium text-green-600">
                  {TransactionService.formatGEL(chartData.total_income_gel)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Total Transactions
                </p>
                <p className="text-xl font-medium text-[#003049]">
                  {chartData.total_transactions}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Category Breakdown */}
      {currentMonth && Object.keys(currentMonth.by_category).length > 0 && (
        <Card>
          <h2 className="text-lg font-medium uppercase tracking-wide mb-6">
            Income by Category
          </h2>
          <CategoryPieChart
            data={currentMonth.by_category}
            loading={currentMonthLoading}
          />
        </Card>
      )}

      {/* Monthly Comparison (if not already showing yearly) */}
      {selectedChartType !== "yearly" && monthlyData && (
        <Card>
          <h2 className="text-lg font-medium uppercase tracking-wide mb-6">
            Monthly Comparison ({new Date().getFullYear()})
          </h2>
          <MonthlyBarChart data={monthlyData} loading={monthlyLoading} />

          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Year Total
                </p>
                <p className="text-xl font-medium text-green-600">
                  {TransactionService.formatGEL(monthlyData.grand_total_gel)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Monthly Average
                </p>
                <p className="text-xl font-medium text-[#003049]">
                  {TransactionService.formatGEL(monthlyData.avg_monthly_income_gel)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
