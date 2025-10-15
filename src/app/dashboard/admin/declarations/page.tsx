"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  DeclarationStatus,
  formatTaxAmount,
  getDeclarationStatusLabel,
} from "@/types/tax";
import { apiFetch } from "@/utils/api";

interface DeclarationListItem {
  id: string;
  user_id: string;
  user_email: string;
  year: number;
  month: number;
  income_gel: number;
  tax_due_gel: number;
  status: DeclarationStatus;
  filing_deadline: string;
  payment_status: string;
  transaction_count: number;
}

export default function AdminAllDeclarationsPage() {
  const [declarations, setDeclarations] = useState<DeclarationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState<DeclarationStatus | "all">("all");
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    loadDeclarations();
  }, [statusFilter, yearFilter, monthFilter]);

  const loadDeclarations = async () => {
    try {
      setLoading(true);
      setError("");

      // Build query params
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (yearFilter) params.append("year", yearFilter);
      if (monthFilter) params.append("month", monthFilter);

      const response = await apiFetch(`/admin/declarations/all?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to load declarations");
      }

      const data = await response.json();
      setDeclarations(data.declarations || data);
    } catch (err) {
      console.error("Failed to load declarations:", err);
      setError(err instanceof Error ? err.message : "Failed to load declarations");
    } finally {
      setLoading(false);
    }
  };

  // Filter by email search
  const filteredDeclarations = declarations.filter((dec) =>
    dec.user_email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const getBadgeVariant = (status: DeclarationStatus) => {
    switch (status) {
      case "submitted":
      case "filed_by_admin":
        return "success";
      case "rejected":
      case "overdue":
        return "danger";
      case "in_progress":
      case "payment_received":
        return "primary";
      case "awaiting_payment":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium uppercase tracking-wide">
          All Declarations
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          View and search all user declarations
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Filters */}
      <Card>
        <h3 className="text-sm font-medium uppercase tracking-wide mb-4">
          Filters
        </h3>

        <div className="grid md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-[1px] focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="awaiting_payment">Awaiting Payment</option>
              <option value="payment_received">Payment Received</option>
              <option value="in_progress">In Progress</option>
              <option value="filed_by_admin">Filed by Admin</option>
              <option value="rejected">Rejected</option>
              <option value="submitted">Submitted</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Year Filter */}
          <Input
            id="year"
            label="Year"
            type="number"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            placeholder="2025"
          />

          {/* Month Filter */}
          <Input
            id="month"
            label="Month"
            type="number"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            placeholder="1-12"
          />

          {/* Email Search */}
          <Input
            id="search"
            label="Search Email"
            type="text"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="user@example.com"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setStatusFilter("all");
              setYearFilter("");
              setMonthFilter("");
              setSearchEmail("");
            }}
          >
            Clear Filters
          </Button>
          <Button variant="primary" onClick={loadDeclarations}>
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Results Summary */}
      <Card>
        <p className="text-sm text-gray-600">
          Showing <strong>{filteredDeclarations.length}</strong> declarations
        </p>
      </Card>

      {/* Declarations Table */}
      <Card>
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : filteredDeclarations.length === 0 ? (
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
            <p className="text-sm text-gray-600">No declarations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    User
                  </th>
                  <th className="text-left py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Period
                  </th>
                  <th className="text-right py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Income
                  </th>
                  <th className="text-right py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Tax Due
                  </th>
                  <th className="text-center py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Transactions
                  </th>
                  <th className="text-center py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Payment
                  </th>
                  <th className="text-center py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeclarations.map((dec) => (
                  <tr
                    key={dec.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{dec.user_email}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {dec.user_id.substring(0, 8)}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/dashboard/tax-declarations/${dec.year}/${dec.month}`}
                        className="text-[#4e35dc] hover:underline font-medium"
                      >
                        {dec.month}/{dec.year}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-green-600">
                      {formatTaxAmount(dec.income_gel)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-[#003049]">
                      {formatTaxAmount(dec.tax_due_gel)}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {dec.transaction_count}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={getBadgeVariant(dec.status)}>
                        {getDeclarationStatusLabel(dec.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {dec.payment_status === "paid" ? (
                        <Badge variant="success">Paid</Badge>
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link href={`/dashboard/tax-declarations/${dec.year}/${dec.month}`}>
                        <Button variant="secondary" className="text-xs px-3 py-1">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
