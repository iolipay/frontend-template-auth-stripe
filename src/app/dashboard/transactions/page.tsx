"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import {
  Transaction,
  TransactionCategory,
  TransactionStatistics,
  getAllCategories,
  getCategoryLabel,
} from "@/types/transaction";
import { TransactionService } from "@/services/transaction.service";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statistics, setStatistics] = useState<TransactionStatistics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<
    TransactionCategory | "all"
  >("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const pageSize = 20;

  // Load transactions
  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const filters: any = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
      };

      if (categoryFilter !== "all") filters.category = categoryFilter;
      if (dateFrom) filters.date_from = dateFrom;
      if (dateTo) filters.date_to = dateTo;

      const response = await TransactionService.listTransactions(filters);
      setTransactions(response.transactions);
      setTotalTransactions(response.total);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load income records"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      setStatsLoading(true);
      const filters: any = {};
      if (dateFrom) filters.date_from = dateFrom;
      if (dateTo) filters.date_to = dateTo;

      const stats = await TransactionService.getStatistics(filters);
      setStatistics(stats);
    } catch (err) {
      console.error("Failed to load statistics:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    loadTransactions();
  }, [currentPage, categoryFilter, dateFrom, dateTo]);

  useEffect(() => {
    loadStatistics();
  }, [dateFrom, dateTo]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setSuccess("Income record created successfully!");
    setCurrentPage(1); // Reset to first page
    loadTransactions();
    loadStatistics();
    setTimeout(() => setSuccess(""), 5000);
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    setTotalTransactions(totalTransactions - 1);
    loadStatistics();
    setSuccess("Income record deleted successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleClearFilters = () => {
    setCategoryFilter("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalTransactions / pageSize);
  const availableCategories = getAllCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-medium uppercase tracking-wide">
          Income Tracking
        </h1>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
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
          {showForm ? "Cancel" : "Add Income"}
        </Button>
      </div>

      {/* Notifications */}
      {error && <Alert type="error" message={error} />}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess("")} />
      )}

      {/* Transaction Form */}
      {showForm && (
        <Card>
          <h2 className="text-lg font-medium uppercase tracking-wide mb-4">
            New Income Record
          </h2>
          <TransactionForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      {/* Statistics */}
      {statistics && <TransactionStats statistics={statistics} loading={statsLoading} />}

      {/* Filters */}
      <Card>
        <h3 className="text-sm font-medium uppercase tracking-wide mb-4">
          Filters
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Date From */}
          <div className="space-y-2">
            <label
              htmlFor="date_from"
              className="block text-xs font-medium uppercase tracking-wide text-gray-700"
            >
              From Date
            </label>
            <input
              id="date_from"
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-[1px] focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10"
            />
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <label
              htmlFor="date_to"
              className="block text-xs font-medium uppercase tracking-wide text-gray-700"
            >
              To Date
            </label>
            <input
              id="date_to"
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-[1px] focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label
              htmlFor="category_filter"
              className="block text-xs font-medium uppercase tracking-wide text-gray-700"
            >
              Category
            </label>
            <select
              id="category_filter"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as TransactionCategory | "all");
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-[1px] focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(categoryFilter !== "all" || dateFrom || dateTo) && (
          <div className="mt-4">
            <Button variant="secondary" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Transaction List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium uppercase tracking-wide">
            {totalTransactions > 0
              ? `${totalTransactions} Income Record${totalTransactions !== 1 ? "s" : ""}`
              : "Income Records"}
          </h3>
        </div>

        <TransactionList
          transactions={transactions}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2"
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm border-2 rounded-[1px] transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-[#003049] text-white border-[#003049]"
                        : "bg-white text-[#003049] border-gray-300 hover:border-[#003049]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="secondary"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
