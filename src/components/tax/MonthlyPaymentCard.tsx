"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatTaxAmount, DeclarationStatus, getDeclarationStatusLabel } from "@/types/tax";

interface MonthlyPaymentCardProps {
  year: number;
  month: number;
  monthName?: string;
  income: number;
  taxAmount: number;
  serviceFee: number;
  totalAmount: number;
  status: DeclarationStatus;
  transactionCount?: number;
  deadline?: string;
  daysUntilDeadline?: number | null;
  variant?: "full" | "compact" | "inline";
  onPaymentClick?: () => void;
}

export function MonthlyPaymentCard({
  year,
  month,
  monthName,
  income,
  taxAmount,
  serviceFee,
  totalAmount,
  status,
  transactionCount,
  deadline,
  daysUntilDeadline,
  variant = "full",
  onPaymentClick,
}: MonthlyPaymentCardProps) {
  const router = useRouter();

  const displayMonthName =
    monthName ||
    new Date(year, month - 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  const isUnpaid = ["pending", "awaiting_payment", "overdue"].includes(status);
  const isPaid = ["payment_received", "in_progress", "filed_by_admin"].includes(status);
  const needsCorrection = status === "rejected";

  const handlePayClick = () => {
    if (onPaymentClick) {
      onPaymentClick();
    } else {
      router.push(`/dashboard/tax-declarations/${year}/${month}/pay`);
    }
  };

  // Inline variant - minimal, single line
  if (variant === "inline") {
    return (
      <div className="flex items-center justify-between p-3 bg-white border-2 border-gray-200 rounded-[9px] hover:border-[#003049] transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-medium text-gray-900">{displayMonthName}</p>
            <p className="text-xs text-gray-600">{formatTaxAmount(income)} income</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-medium text-[#4e35dc]">
              {formatTaxAmount(totalAmount)}
            </p>
            <p className="text-xs text-gray-500">to pay</p>
          </div>
          {isUnpaid && (
            <Button
              variant="primary"
              onClick={handlePayClick}
              className="text-sm px-4 py-2"
            >
              Pay Now
            </Button>
          )}
          {isPaid && (
            <Badge variant="success">
              {status === "filed_by_admin" ? "Filed ✓" : "Paid"}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  // Compact variant - for list views
  if (variant === "compact") {
    return (
      <Card hoverable className="cursor-pointer" onClick={() => router.push(`/dashboard/tax-declarations/${year}/${month}`)}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-medium uppercase tracking-wide text-gray-900">
              {displayMonthName}
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {transactionCount || 0} transaction{transactionCount !== 1 ? "s" : ""}
            </p>
          </div>
          <Badge
            variant={
              status === "filed_by_admin"
                ? "success"
                : isUnpaid
                ? "warning"
                : "primary"
            }
          >
            {getDeclarationStatusLabel(status)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-500">Income</p>
            <p className="text-lg font-medium text-green-600">
              {formatTaxAmount(income)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Payment Due</p>
            <p className="text-lg font-medium text-[#4e35dc]">
              {formatTaxAmount(totalAmount)}
            </p>
          </div>
        </div>

        {daysUntilDeadline !== null && daysUntilDeadline !== undefined && daysUntilDeadline >= 0 && (
          <p className="text-xs text-gray-600 mb-3">
            {daysUntilDeadline === 0
              ? "Deadline today!"
              : `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? "s" : ""} until deadline`}
          </p>
        )}

        {isUnpaid && (
          <Button
            variant="primary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              handlePayClick();
            }}
          >
            Pay {formatTaxAmount(totalAmount)}
          </Button>
        )}

        {needsCorrection && (
          <Button
            variant="secondary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              router.push("/dashboard/transactions");
            }}
          >
            Fix Transactions
          </Button>
        )}
      </Card>
    );
  }

  // Full variant - complete payment card
  return (
    <Card>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium uppercase tracking-wide text-[#003049]">
            {displayMonthName}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Monthly tax declaration payment
          </p>
        </div>
        <Badge
          variant={
            status === "filed_by_admin"
              ? "success"
              : isUnpaid
              ? "warning"
              : "primary"
          }
        >
          {getDeclarationStatusLabel(status)}
        </Badge>
      </div>

      {/* Income Summary */}
      <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-[9px]">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Monthly Income
            </p>
            <p className="text-2xl font-medium text-green-600">
              {formatTaxAmount(income)}
            </p>
            {transactionCount && (
              <p className="text-xs text-gray-600 mt-1">
                from {transactionCount} transaction{transactionCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {deadline && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                Payment Deadline
              </p>
              <p className="text-base font-medium text-gray-900">
                {new Date(deadline).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              {daysUntilDeadline !== null && daysUntilDeadline !== undefined && (
                <p
                  className={`text-xs mt-1 ${
                    daysUntilDeadline <= 3
                      ? "text-red-600 font-medium"
                      : daysUntilDeadline <= 7
                      ? "text-orange-600"
                      : "text-gray-600"
                  }`}
                >
                  {daysUntilDeadline > 0
                    ? `${daysUntilDeadline} days remaining`
                    : daysUntilDeadline === 0
                    ? "Due today!"
                    : `${Math.abs(daysUntilDeadline)} days overdue`}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="mb-6">
        <h3 className="text-sm font-medium uppercase tracking-wide text-gray-700 mb-3">
          Payment Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-green-50 border-2 border-green-200 rounded-[9px]">
            <div>
              <p className="text-sm font-medium text-gray-900">Tax Payment (1%)</p>
              <p className="text-xs text-gray-600">Goes to government</p>
            </div>
            <p className="text-xl font-medium text-green-600">
              {formatTaxAmount(taxAmount)}
            </p>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 border-2 border-blue-200 rounded-[9px]">
            <div>
              <p className="text-sm font-medium text-gray-900">Service Fee (2%)</p>
              <p className="text-xs text-gray-600">Admin filing service</p>
            </div>
            <p className="text-xl font-medium text-blue-600">
              {formatTaxAmount(serviceFee)}
            </p>
          </div>
          <div className="flex justify-between items-center p-4 bg-purple-50 border-2 border-purple-300 rounded-[9px]">
            <div>
              <p className="text-base font-medium uppercase tracking-wide text-gray-900">
                Total Payment (3%)
              </p>
              <p className="text-xs text-gray-600">Pay once, we file for you</p>
            </div>
            <p className="text-3xl font-medium text-[#4e35dc]">
              {formatTaxAmount(totalAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isUnpaid && (
        <div className="space-y-3">
          <Button variant="primary" fullWidth onClick={handlePayClick}>
            Pay {formatTaxAmount(totalAmount)} Now
          </Button>
          <p className="text-xs text-gray-500 text-center">
            After payment, our admin team will file your declaration on RS.ge automatically
          </p>
        </div>
      )}

      {isPaid && status !== "filed_by_admin" && (
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-[9px]">
          <p className="text-sm text-center text-blue-900 font-medium">
            ✓ Payment received! Our admin team will file your declaration soon.
          </p>
        </div>
      )}

      {status === "filed_by_admin" && (
        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-[9px]">
          <p className="text-sm text-center text-green-900 font-medium">
            ✓ Declaration filed successfully by our admin team
          </p>
        </div>
      )}

      {needsCorrection && (
        <div className="space-y-3">
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-[9px]">
            <p className="text-sm text-red-900 font-medium mb-2">
              ⚠️ Corrections Required
            </p>
            <p className="text-xs text-red-800">
              Please fix your transaction data before payment can be processed
            </p>
          </div>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => router.push("/dashboard/transactions")}
          >
            Go to Transactions
          </Button>
        </div>
      )}
    </Card>
  );
}
