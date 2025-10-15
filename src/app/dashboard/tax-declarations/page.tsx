"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DeclarationCalendar } from "@/components/tax/DeclarationCalendar";
import {
  TaxMonthlyBreakdown,
  DeclarationStatus,
  formatTaxAmount,
} from "@/types/tax";
import { TaxService } from "@/services/tax.service";

export default function TaxDeclarationsPage() {
  const [monthlyData, setMonthlyData] = useState<TaxMonthlyBreakdown | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    TaxService.getCurrentYear()
  );
  const [statusFilter, setStatusFilter] = useState<DeclarationStatus | "all">(
    "all"
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDeclarations();
  }, [selectedYear]);

  const loadDeclarations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await TaxService.getMonthlyBreakdown(selectedYear);
      setMonthlyData(data);
    } catch (err) {
      console.error("Failed to load declarations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load declarations"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter months based on status
  const filteredMonths =
    statusFilter === "all"
      ? monthlyData?.months || []
      : monthlyData?.months.filter(
          (m) => m.declaration_status === statusFilter
        ) || [];

  // Count by status
  const statusCounts = {
    pending:
      monthlyData?.months.filter((m) => m.declaration_status === "pending")
        .length || 0,
    submitted:
      monthlyData?.months.filter((m) => m.declaration_status === "submitted")
        .length || 0,
    overdue:
      monthlyData?.months.filter((m) => m.declaration_status === "overdue")
        .length || 0,
  };

  // Available years
  const availableYears = TaxService.getRecentYears(5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-medium uppercase tracking-wide">
            Tax Declarations
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monthly declaration status for {selectedYear}
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
          <Link href="/dashboard/tax-analytics">
            <Button variant="primary">Analytics</Button>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      {/* Summary Stats */}
      {monthlyData && (
        <div className="grid md:grid-cols-4 gap-4">
          {/* Total Income */}
          <Card hoverable={false}>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Total Income {selectedYear}
            </p>
            <p className="text-2xl font-medium text-green-600">
              {formatTaxAmount(monthlyData.total_income_gel)}
            </p>
          </Card>

          {/* Total Tax */}
          <Card hoverable={false}>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Total Tax Due
            </p>
            <p className="text-2xl font-medium text-[#003049]">
              {formatTaxAmount(monthlyData.total_tax_gel)}
            </p>
          </Card>

          {/* Monthly Average */}
          <Card hoverable={false}>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Monthly Average
            </p>
            <p className="text-2xl font-medium text-gray-900">
              {formatTaxAmount(monthlyData.avg_monthly_income_gel)}
            </p>
          </Card>

          {/* Months with Income */}
          <Card hoverable={false}>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Active Months
            </p>
            <p className="text-2xl font-medium text-[#4e35dc]">
              {monthlyData.months.length}
            </p>
          </Card>
        </div>
      )}

      {/* Status Filter */}
      <Card>
        <h3 className="text-sm font-medium uppercase tracking-wide mb-4">
          Filter by Status
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wide rounded-[1px] border-2 transition-all duration-200 ${
              statusFilter === "all"
                ? "bg-[#003049] text-white border-[#003049]"
                : "bg-white text-[#003049] border-gray-300 hover:border-[#003049]"
            }`}
          >
            All ({monthlyData?.months.length || 0})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wide rounded-[1px] border-2 transition-all duration-200 ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-amber-600 border-amber-300 hover:border-amber-500"
            }`}
          >
            Pending ({statusCounts.pending})
          </button>
          <button
            onClick={() => setStatusFilter("submitted")}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wide rounded-[1px] border-2 transition-all duration-200 ${
              statusFilter === "submitted"
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-green-600 border-green-300 hover:border-green-500"
            }`}
          >
            Submitted ({statusCounts.submitted})
          </button>
          <button
            onClick={() => setStatusFilter("overdue")}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wide rounded-[1px] border-2 transition-all duration-200 ${
              statusFilter === "overdue"
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-red-600 border-red-300 hover:border-red-500"
            }`}
          >
            Overdue ({statusCounts.overdue})
          </button>
        </div>
      </Card>

      {/* Declaration Calendar */}
      {loading ? (
        <Card>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      ) : filteredMonths.length > 0 ? (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium uppercase tracking-wide">
              {statusFilter === "all"
                ? "All Declarations"
                : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Declarations`}
            </h2>
            <p className="text-sm text-gray-600">
              {filteredMonths.length} month{filteredMonths.length !== 1 ? "s" : ""}
            </p>
          </div>
          <DeclarationCalendar months={filteredMonths} year={selectedYear} />
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-[9px] mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium uppercase tracking-wide text-gray-900 mb-2">
              No Declarations Found
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {statusFilter === "all"
                ? "No declarations for this year yet."
                : `No ${statusFilter} declarations found.`}
            </p>
            <Link href="/dashboard/transactions">
              <Button variant="primary">Add Income Transactions</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <h2 className="text-lg font-medium uppercase tracking-wide mb-4">
          About Tax Declarations
        </h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Automatic Generation:</strong> Declarations are
            automatically created based on your income transactions each month.
          </p>
          <p>
            <strong>Filing Deadline:</strong> Tax declarations must be
            submitted by the 15th of the following month at{" "}
            <a
              href="https://rs.ge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4e35dc] hover:underline"
            >
              rs.ge
            </a>
            .
          </p>
          <p>
            <strong>Tax Rate:</strong> Small business status (მცირე ბიზნესის
            სტატუსი) has a 1% tax rate on income.
          </p>
          <p>
            <strong>Annual Threshold:</strong> Your total annual income must
            stay under 500,000 GEL to maintain this status.
          </p>
        </div>
      </Card>
    </div>
  );
}
