"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { TaxOverviewCard } from "@/components/tax/TaxOverviewCard";
import { TaxInsightsPanel } from "@/components/tax/TaxInsightsPanel";
import { DeclarationCalendar } from "@/components/tax/DeclarationCalendar";
import {
  TaxOverview,
  TaxInsightsResponse,
  TaxMonthlyBreakdown,
} from "@/types/tax";
import { TaxService } from "@/services/tax.service";

export default function TaxOverviewPage() {
  const [overview, setOverview] = useState<TaxOverview | null>(null);
  const [insights, setInsights] = useState<TaxInsightsResponse | null>(null);
  const [monthlyData, setMonthlyData] = useState<TaxMonthlyBreakdown | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    TaxService.getCurrentYear()
  );

  const [overviewLoading, setOverviewLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [monthlyLoading, setMonthlyLoading] = useState(true);

  const [error, setError] = useState("");

  // Load data on mount and when year changes
  useEffect(() => {
    loadTaxData();
  }, [selectedYear]);

  const loadTaxData = async () => {
    // Load overview
    try {
      setOverviewLoading(true);
      const overviewData = await TaxService.getOverview(selectedYear);
      setOverview(overviewData);
    } catch (err) {
      console.error("Failed to load tax overview:", err);
      setError("Failed to load tax overview data");
    } finally {
      setOverviewLoading(false);
    }

    // Load insights
    try {
      setInsightsLoading(true);
      const insightsData = await TaxService.getInsights();
      setInsights(insightsData);
    } catch (err) {
      console.error("Failed to load insights:", err);
    } finally {
      setInsightsLoading(false);
    }

    // Load monthly data for upcoming deadlines
    try {
      setMonthlyLoading(true);
      const monthly = await TaxService.getMonthlyBreakdown(selectedYear);
      setMonthlyData(monthly);
    } catch (err) {
      console.error("Failed to load monthly data:", err);
    } finally {
      setMonthlyLoading(false);
    }
  };

  // Get pending declarations for quick view
  const pendingDeclarations =
    monthlyData?.months
      .filter((m) => m.declaration_status === "pending")
      .sort(
        (a, b) =>
          (a.days_until_deadline || 999) - (b.days_until_deadline || 999)
      )
      .slice(0, 3) || [];

  // Available years for dropdown
  const availableYears = TaxService.getRecentYears(5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-medium uppercase tracking-wide">
            Tax Overview
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Georgian Small Business Status • მცირე ბიზნესის სტატუსი
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
          <Link href="/dashboard/tax-declarations">
            <Button variant="secondary">View All Declarations</Button>
          </Link>
          <Link href="/dashboard/tax-analytics">
            <Button variant="primary">Analytics</Button>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Main Overview Card */}
      {overview && <TaxOverviewCard data={overview} loading={overviewLoading} />}

      {/* Insights Panel */}
      {insights && (
        <TaxInsightsPanel
          insights={insights.insights}
          loading={insightsLoading}
          maxDisplay={3}
        />
      )}

      {/* Upcoming Deadlines Section */}
      {pendingDeclarations.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium uppercase tracking-wide">
              Upcoming Deadlines
            </h2>
            <Link
              href="/dashboard/tax-declarations"
              className="text-sm text-[#4e35dc] hover:underline font-medium"
            >
              View All →
            </Link>
          </div>
          <DeclarationCalendar
            months={pendingDeclarations}
            year={selectedYear}
          />
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-medium uppercase tracking-wide mb-4">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/dashboard/tax-declarations">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide">
                    Declarations
                  </p>
                  <p className="text-xs text-gray-500">View all months</p>
                </div>
              </div>
            </button>
          </Link>

          <Link href="/dashboard/tax-analytics">
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
                  <p className="text-xs text-gray-500">Charts & trends</p>
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
        </div>
      </Card>
    </div>
  );
}
