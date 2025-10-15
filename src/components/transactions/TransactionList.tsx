"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  Transaction,
  getCategoryLabel,
} from "@/types/transaction";
import { TransactionService } from "@/services/transaction.service";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  loading = false,
}: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this income record? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await TransactionService.deleteTransaction(id);
      onDelete(id);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      alert("Failed to delete income record. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-500">
          Loading income records...
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900 uppercase tracking-wide">
            No Income Records
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first income entry.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="hover:shadow-lg transition-all duration-200">
          <div className="flex items-start justify-between gap-4">
            {/* Left section - main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success">
                  {getCategoryLabel(transaction.category)}
                </Badge>
              </div>

              {transaction.description && (
                <p className="text-sm text-gray-700 mb-2">
                  {transaction.description}
                </p>
              )}

              <div className="text-xs text-gray-500">
                {TransactionService.formatDateForDisplay(
                  transaction.transaction_date
                )}
              </div>
            </div>

            {/* Right section - amounts and actions */}
            <div className="flex flex-col items-end gap-2">
              {/* Amount display */}
              <div className="text-right">
                <div className="text-lg font-medium text-green-600">
                  +{TransactionService.formatAmount(
                    transaction.amount,
                    transaction.currency
                  )}
                </div>
                {transaction.currency !== "GEL" && (
                  <div className="text-sm text-gray-600">
                    {TransactionService.formatGEL(transaction.amount_gel)}
                    <span className="text-xs text-gray-400 ml-1">
                      (@ {transaction.exchange_rate.toFixed(4)})
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-2 text-[#4e35dc] hover:bg-[#4e35dc]/10 rounded-[1px] transition-colors duration-200"
                    title="Edit income"
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(transaction.id)}
                  disabled={deletingId === transaction.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-[1px] transition-colors duration-200 disabled:opacity-50"
                  title="Delete income"
                >
                  {deletingId === transaction.id ? (
                    <span className="text-xs">...</span>
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
