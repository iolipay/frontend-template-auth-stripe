import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  MonthlyTaxData,
  getDeclarationStatusColor,
  getDeclarationStatusLabel,
  formatTaxAmount,
  isDeadlineSoon,
  isDeadlineUrgent,
} from "@/types/tax";
import { TaxService } from "@/services/tax.service";

interface DeclarationCalendarProps {
  months: MonthlyTaxData[];
  year: number;
  onMonthClick?: (month: MonthlyTaxData) => void;
}

export function DeclarationCalendar({
  months,
  year,
  onMonthClick,
}: DeclarationCalendarProps) {
  // Sort months chronologically
  const sortedMonths = [...months].sort((a, b) => {
    const monthA = TaxService.getMonthNumber(a.month);
    const monthB = TaxService.getMonthNumber(b.month);
    return monthA - monthB;
  });

  const handleCardClick = (monthData: MonthlyTaxData, monthNum: number, yearNum: number) => {
    if (onMonthClick) {
      onMonthClick(monthData);
    } else {
      window.location.href = `/dashboard/tax-declarations/${yearNum}/${monthNum}`;
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sortedMonths.map((monthData) => {
        const monthNum = TaxService.getMonthNumber(monthData.month);
        const yearNum = TaxService.getYear(monthData.month);
        const monthName = new Date(yearNum, monthNum - 1).toLocaleDateString(
          "en-US",
          { month: "long" }
        );
        const statusColor = getDeclarationStatusColor(
          monthData.declaration_status
        );
        const isSoon = isDeadlineSoon(monthData.days_until_deadline);
        const isUrgent = isDeadlineUrgent(monthData.days_until_deadline);

        return (
          <div
            key={monthData.month}
            onClick={() => handleCardClick(monthData, monthNum, yearNum)}
            className="border-2 border-gray-200 rounded-[9px] p-4 hover:border-[#003049] hover:shadow-lg transition-all duration-200 bg-white cursor-pointer"
          >
            {/* Month Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900">
                {monthName}
              </h3>
              <Badge
                variant={
                  monthData.declaration_status === "submitted"
                    ? "success"
                    : monthData.declaration_status === "overdue"
                    ? "danger"
                    : "warning"
                }
              >
                {getDeclarationStatusLabel(monthData.declaration_status)}
              </Badge>
            </div>

            {/* Income */}
            <div className="mb-2">
              <p className="text-xs text-gray-500">Income</p>
              <p className="text-lg font-medium text-green-600">
                {formatTaxAmount(monthData.income_gel)}
              </p>
            </div>

            {/* Tax */}
            <div className="mb-3">
              <p className="text-xs text-gray-500">Tax Due (1%)</p>
              <p className="text-lg font-medium text-[#003049]">
                {formatTaxAmount(monthData.tax_due_gel)}
              </p>
            </div>

            {/* Payment Amount (for unpaid declarations) */}
            {(monthData.declaration_status === "pending" ||
              monthData.declaration_status === "awaiting_payment" ||
              monthData.declaration_status === "overdue") && (
              <div className="mb-3 p-2 bg-purple-50 border-2 border-purple-200 rounded-[9px]">
                <p className="text-xs text-gray-500">Total Payment (3%)</p>
                <p className="text-base font-medium text-[#4e35dc]">
                  {formatTaxAmount(TaxService.calculateTotalFilingCost(monthData.income_gel))}
                </p>
              </div>
            )}

            {/* Transaction Count */}
            <div className="mb-3 pb-3 border-b-2 border-gray-100">
              <p className="text-xs text-gray-500">
                {monthData.transaction_count} transaction
                {monthData.transaction_count !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Deadline Info */}
            {monthData.declaration_status === "pending" &&
              monthData.days_until_deadline !== null && (
                <div
                  className={`p-2 rounded-[1px] ${
                    isUrgent
                      ? "bg-red-100 border-2 border-red-200"
                      : isSoon
                      ? "bg-amber-100 border-2 border-amber-200"
                      : "bg-blue-50 border-2 border-blue-100"
                  }`}
                >
                  <p
                    className={`text-xs font-medium ${
                      isUrgent
                        ? "text-red-800"
                        : isSoon
                        ? "text-amber-800"
                        : "text-blue-800"
                    }`}
                  >
                    {isUrgent && "🚨 "} Due in {monthData.days_until_deadline} day
                    {monthData.days_until_deadline !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(monthData.filing_deadline).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}

            {/* Submitted Date */}
            {monthData.declaration_status === "submitted" &&
              monthData.submitted_date && (
                <div className="p-2 bg-green-50 rounded-[1px] border-2 border-green-100">
                  <p className="text-xs font-medium text-green-800">
                    ✓ Submitted
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(monthData.submitted_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}

            {/* Overdue Warning */}
            {monthData.declaration_status === "overdue" && (
              <div className="p-2 bg-red-100 rounded-[1px] border-2 border-red-200">
                <p className="text-xs font-medium text-red-800">
                  ⚠️ Overdue
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Was due{" "}
                  {new Date(monthData.filing_deadline).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            )}

            {/* Pay Now Button for Unpaid Declarations */}
            {(monthData.declaration_status === "pending" ||
              monthData.declaration_status === "awaiting_payment" ||
              monthData.declaration_status === "overdue") && !onMonthClick && (
              <div className="mt-3 pt-3 border-t-2 border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/dashboard/tax-declarations/${yearNum}/${monthNum}/pay`;
                  }}
                  className="w-full bg-[#4e35dc] hover:bg-[#003049] text-white text-sm font-medium uppercase tracking-wide py-2 px-4 rounded-none border-2 border-[#4e35dc] hover:border-[#003049] shadow-[3px_3px_0px_0px_#333333] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all duration-200"
                >
                  Pay Now
                </button>
              </div>
            )}

            {/* Filed Status */}
            {monthData.declaration_status === "filed_by_admin" && (
              <div className="mt-3 pt-3 border-t-2 border-gray-100">
                <div className="p-2 bg-green-50 rounded-[9px] border-2 border-green-200 text-center">
                  <p className="text-xs font-medium text-green-800">
                    ✓ Filed by Admin
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
