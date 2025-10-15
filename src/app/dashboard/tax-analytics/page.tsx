"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { TaxTrendChart } from "@/components/tax/charts/TaxTrendChart";
import { ThresholdChart } from "@/components/tax/charts/ThresholdChart";
import {
  TaxChartData,
  TaxProjections,
  TaxComparisonResponse,
  formatTaxAmount,
  GEORGIAN_TAX_CONSTANTS,
} from "@/types/tax";
import { TaxService } from "@/services/tax.service";

export default function TaxAnalyticsPage() {
  const [monthlyTaxData, setMonthlyTaxData] = useState<TaxChartData | null>(
    null
  );
  const [thresholdData, setThresholdData] = useState<TaxChartData | null>(null);
  const [projections, setProjections] = useState<TaxProjections | null>(null);
  const [comparison, setComparison] = useState<TaxComparisonResponse | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    TaxService.getCurrentYear()
  );

  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [thresholdLoading, setThresholdLoading] = useState(true);
  const [projectionsLoading, setProjectionsLoading] = useState(true);
  const [comparisonLoading, setComparisonLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, [selectedYear]);

  const loadAnalytics = async () => {
    // Load monthly tax chart
    try {
      setMonthlyLoading(true);
      const data = await TaxService.getChartData("monthly_tax", selectedYear);
      setMonthlyTaxData(data);
    } catch (err) {
      console.error("Failed to load monthly tax data:", err);
      setError("Failed to load some analytics data");
    } finally {
      setMonthlyLoading(false);
    }

    // Load threshold progress chart
    try {
      setThresholdLoading(true);
      const data = await TaxService.getChartData(
        "threshold_progress",
        selectedYear
      );
      setThresholdData(data);
    } catch (err) {
      console.error("Failed to load threshold data:", err);
    } finally {
      setThresholdLoading(false);
    }

    // Load projections (only for current year)
    if (selectedYear === TaxService.getCurrentYear()) {
      try {
        setProjectionsLoading(true);
        const data = await TaxService.getProjections();
        setProjections(data);
      } catch (err) {
        console.error("Failed to load projections:", err);
      } finally {
        setProjectionsLoading(false);
      }
    } else {
      setProjections(null);
      setProjectionsLoading(false);
    }

    // Load year comparison
    try {
      setComparisonLoading(true);
      const years = [selectedYear, selectedYear - 1, selectedYear - 2].filter(
        (y) => y >= 2020
      );
      const data = await TaxService.getComparison(years);
      setComparison(data);
    } catch (err) {
      console.error("Failed to load comparison:", err);
    } finally {
      setComparisonLoading(false);
    }
  };

  const availableYears = TaxService.getRecentYears(5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-medium uppercase tracking-wide">
            Tax Analytics
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Detailed tax insights and projections
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 text-sm border-2 border-gray-300 rounded-[1px] focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <Link href="/dashboard/tax-overview">
            <Button variant="secondary">Overview</Button>
          </Link>
          <Link href="/dashboard/tax-declarations">
            <Button variant="primary">Declarations</Button>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Monthly Tax Trend */}
      {monthlyTaxData && (
        <Card>
          <h2 className="text-lg font-medium uppercase tracking-wide mb-6">
            Monthly Tax Trend ({selectedYear})
          </h2>
          <TaxTrendChart
            data={monthlyTaxData.data}
            loading={monthlyLoading}
          />
          <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t-2 border-gray-200">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                Total Income
              </p>
              <p className="text-2xl font-medium text-green-600">
                {formatTaxAmount(monthlyTaxData.total_income)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                Total Tax
              </p>
              <p className="text-2xl font-medium text-[#003049]">
                {formatTaxAmount(monthlyTaxData.total_tax)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Threshold Progress */}
      {thresholdData && (
        <Card>
          <h2 className="text-lg font-medium uppercase tracking-wide mb-6">
            Threshold Progress ({selectedYear})
          </h2>
          <ThresholdChart data={thresholdData.data} loading={thresholdLoading} />
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Annual Threshold
                </p>
                <p className="text-xl font-medium text-gray-900">
                  {formatTaxAmount(GEORGIAN_TAX_CONSTANTS.annualThreshold)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Current Income
                </p>
                <p className="text-xl font-medium text-green-600">
                  {formatTaxAmount(thresholdData.total_income)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Remaining
                </p>
                <p className="text-xl font-medium text-[#4e35dc]">
                  {formatTaxAmount(
                    GEORGIAN_TAX_CONSTANTS.annualThreshold -
                      thresholdData.total_income
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Projections (Current Year Only) */}
      {projections && selectedYear === TaxService.getCurrentYear() && (
        <Card>
          <h2 className="text-lg font-medium uppercase tracking-wide mb-6">
            Year-End Projections
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-[9px]">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                Projected Annual Income
              </p>
              <p className="text-3xl font-medium text-green-600 mb-1">
                {formatTaxAmount(projections.projected_annual_income_gel)}
              </p>
              <p className="text-xs text-gray-600">
                Based on {projections.based_on_months} months of data
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-[9px]">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                Projected Annual Tax
              </p>
              <p className="text-3xl font-medium text-[#003049] mb-1">
                {formatTaxAmount(projections.projected_annual_tax_gel)}
              </p>
              <p className="text-xs text-gray-600">
                1% of projected income
              </p>
            </div>
          </div>

          {/* Threshold Status */}
          <div className="mt-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-[9px]">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-medium uppercase tracking-wide">
                Threshold Risk Assessment
              </h3>
              <span
                className={`px-3 py-1 rounded-[1px] text-xs font-medium uppercase ${
                  projections.threshold_status.risk_level === "low"
                    ? "bg-green-100 text-green-800"
                    : projections.threshold_status.risk_level === "medium"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {projections.threshold_status.risk_level} Risk
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Will Exceed?</p>
                <p className="text-sm font-medium">
                  {projections.threshold_status.will_exceed_threshold
                    ? "⚠️ Yes"
                    : "✓ No"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Projected Remaining</p>
                <p className="text-sm font-medium">
                  {formatTaxAmount(
                    projections.threshold_status.projected_remaining_gel
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Confidence</p>
                <p className="text-sm font-medium">
                  {(projections.threshold_status.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 p-3 bg-white rounded-[1px]">
              <strong>Recommendation:</strong> {projections.recommendation}
            </p>
          </div>
        </Card>
      )}

      {/* Year-over-Year Comparison */}
      {comparison && comparison.years.length > 0 && (
        <Card>
          <h2 className="text-lg font-medium uppercase tracking-wide mb-6">
            Year-over-Year Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Year
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Total Income
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Total Tax
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Avg Monthly
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.years.map((yearData) => (
                  <tr
                    key={yearData.year}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {yearData.year}
                    </td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">
                      {formatTaxAmount(yearData.total_income_gel)}
                    </td>
                    <td className="py-3 px-4 text-right text-[#003049] font-medium">
                      {formatTaxAmount(yearData.total_tax_gel)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatTaxAmount(yearData.avg_monthly_income_gel)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {yearData.growth_vs_previous !== null ? (
                        <span
                          className={`font-medium ${
                            yearData.growth_vs_previous >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {yearData.growth_vs_previous >= 0 ? "+" : ""}
                          {yearData.growth_vs_previous.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t-2 border-gray-200 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Total Tax Paid (All Years)
            </p>
            <p className="text-2xl font-medium text-[#003049]">
              {formatTaxAmount(comparison.total_tax_paid_all_years)}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
