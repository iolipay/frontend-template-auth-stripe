"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  AdminDeclarationItem,
  formatTaxAmount,
  getDeclarationStatusLabel,
} from "@/types/tax";

interface DeclarationQueueTableProps {
  declarations: AdminDeclarationItem[];
  onStartFiling?: (declarationId: string) => void;
  onCompleteFiling?: (declarationId: string) => void;
  onRejectFiling?: (declarationId: string) => void;
  loading?: boolean;
}

export function DeclarationQueueTable({
  declarations,
  onStartFiling,
  onCompleteFiling,
  onRejectFiling,
  loading = false,
}: DeclarationQueueTableProps) {
  if (declarations.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-[9px] border-2 border-gray-200">
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
        <p className="text-sm text-gray-600">No declarations in this queue</p>
      </div>
    );
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const daysUntil = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (daysUntil < 0) return `${dateStr} (Overdue)`;
    if (daysUntil <= 3) return `${dateStr} (${daysUntil}d - Urgent!)`;
    if (daysUntil <= 7) return `${dateStr} (${daysUntil}d)`;
    return dateStr;
  };

  return (
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
            <th className="text-left py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
              Deadline
            </th>
            <th className="text-center py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
              Transactions
            </th>
            <th className="text-center py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
              Status
            </th>
            <th className="text-center py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {declarations.map((declaration) => {
            const deadlineStr = formatDeadline(declaration.filing_deadline);
            const isUrgent = deadlineStr.includes("Urgent");
            const isOverdue = deadlineStr.includes("Overdue");

            return (
              <tr
                key={declaration.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {declaration.user_email}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {declaration.user_id.substring(0, 8)}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/dashboard/tax-declarations/${declaration.year}/${declaration.month}`}
                    className="text-[#4e35dc] hover:underline font-medium"
                  >
                    {declaration.month}/{declaration.year}
                  </Link>
                </td>
                <td className="py-3 px-4 text-right font-medium text-green-600">
                  {formatTaxAmount(declaration.income_gel)}
                </td>
                <td className="py-3 px-4 text-right font-medium text-[#003049]">
                  {formatTaxAmount(declaration.tax_due_gel)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs ${
                      isOverdue
                        ? "text-red-600 font-medium"
                        : isUrgent
                        ? "text-orange-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {deadlineStr}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-gray-600">
                  {declaration.transaction_count}
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge
                    variant={
                      declaration.status === "payment_received"
                        ? "primary"
                        : declaration.status === "in_progress"
                        ? "warning"
                        : declaration.status === "rejected"
                        ? "danger"
                        : "secondary"
                    }
                  >
                    {getDeclarationStatusLabel(declaration.status)}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    {declaration.status === "payment_received" &&
                      onStartFiling && (
                        <Button
                          variant="primary"
                          onClick={() => onStartFiling(declaration.id)}
                          disabled={loading}
                          className="text-xs px-3 py-1"
                        >
                          Start
                        </Button>
                      )}
                    {declaration.status === "in_progress" &&
                      onCompleteFiling && (
                        <Button
                          variant="primary"
                          onClick={() => onCompleteFiling(declaration.id)}
                          disabled={loading}
                          className="text-xs px-3 py-1"
                        >
                          Complete
                        </Button>
                      )}
                    {(declaration.status === "payment_received" ||
                      declaration.status === "in_progress") &&
                      onRejectFiling && (
                        <Button
                          variant="secondary"
                          onClick={() => onRejectFiling(declaration.id)}
                          disabled={loading}
                          className="text-xs px-3 py-1"
                        >
                          Reject
                        </Button>
                      )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
