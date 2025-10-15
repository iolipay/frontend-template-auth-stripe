"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FilingServiceCard } from "@/components/tax/FilingServiceCard";
import { PaymentFlow } from "@/components/tax/PaymentFlow";
import {
  DeclarationDetail,
  formatTaxAmount,
  getDeclarationStatusColor,
  getDeclarationStatusLabel,
  isDeadlineSoon,
  isDeadlineUrgent,
  GEORGIAN_TAX_CONSTANTS,
} from "@/types/tax";
import { TaxService } from "@/services/tax.service";

export default function DeclarationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const year = parseInt(params.year as string);
  const month = parseInt(params.month as string);

  const [declaration, setDeclaration] = useState<DeclarationDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDeclaration();
  }, [year, month]);

  const loadDeclaration = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await TaxService.getDeclarationDetail(year, month);
      setDeclaration(data);
    } catch (err) {
      console.error("Failed to load declaration:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load declaration"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSubmitted = async () => {
    if (!declaration) return;

    try {
      setSubmitting(true);
      setError("");
      const response = await TaxService.markDeclarationSubmitted(year, month);
      setSuccess(response.message);
      setDeclaration(response.declaration);
      setTimeout(() => {
        router.push("/dashboard/tax-declarations");
      }, 2000);
    } catch (err) {
      console.error("Failed to mark as submitted:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark declaration as submitted"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!declaration || error) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-[9px] mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium uppercase tracking-wide text-gray-900 mb-2">
              Declaration Not Found
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {error || "The requested declaration could not be found."}
            </p>
            <Link href="/dashboard/tax-declarations">
              <Button variant="primary">Back to Declarations</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const isSoon = isDeadlineSoon(declaration.days_until_deadline);
  const isUrgent = isDeadlineUrgent(declaration.days_until_deadline);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-medium uppercase tracking-wide">
            {declaration.month_name}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Tax Declaration Details
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/tax-declarations">
            <Button variant="secondary">Back</Button>
          </Link>
          <Link href="/dashboard/tax-overview">
            <Button variant="primary">Overview</Button>
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

      {/* Main Declaration Card */}
      <Card hoverable={false}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-medium uppercase tracking-wide text-[#003049]">
              Declaration Summary
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {GEORGIAN_TAX_CONSTANTS.taxSystemNameEn}
            </p>
          </div>
          <Badge
            variant={
              declaration.declaration_status === "submitted"
                ? "success"
                : declaration.declaration_status === "overdue"
                ? "danger"
                : "warning"
            }
          >
            {getDeclarationStatusLabel(declaration.declaration_status)}
          </Badge>
        </div>

        {/* Key Figures */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Income */}
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-[9px]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Total Income
            </p>
            <p className="text-3xl font-medium text-green-600">
              {formatTaxAmount(declaration.income_gel)}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              from {declaration.transaction_count} transaction
              {declaration.transaction_count !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Tax Due */}
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-[9px]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Tax Due (1%)
            </p>
            <p className="text-3xl font-medium text-[#003049]">
              {formatTaxAmount(declaration.tax_due_gel)}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {GEORGIAN_TAX_CONSTANTS.taxRate * 100}% of income
            </p>
          </div>

          {/* Deadline */}
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-[9px]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Filing Deadline
            </p>
            <p className="text-xl font-medium text-gray-900">
              {new Date(declaration.filing_deadline).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </p>
            {declaration.days_until_deadline !== null && (
              <p className="text-xs text-gray-600 mt-2">
                {declaration.days_until_deadline > 0
                  ? `${declaration.days_until_deadline} days remaining`
                  : "Deadline passed"}
              </p>
            )}
          </div>
        </div>

        {/* Status-specific Info */}
        {declaration.declaration_status === "pending" &&
          declaration.days_until_deadline !== null && (
            <div
              className={`p-4 rounded-[9px] border-2 ${
                isUrgent
                  ? "bg-red-50 border-red-200"
                  : isSoon
                  ? "bg-amber-50 border-amber-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <h3
                className={`text-sm font-medium uppercase tracking-wide mb-2 ${
                  isUrgent
                    ? "text-red-800"
                    : isSoon
                    ? "text-amber-800"
                    : "text-blue-800"
                }`}
              >
                {isUrgent
                  ? "🚨 Urgent: Deadline Approaching"
                  : isSoon
                  ? "⚠️ Reminder: Declaration Due Soon"
                  : "ℹ️ Declaration Pending"}
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                This declaration must be filed by{" "}
                {new Date(declaration.filing_deadline).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric" }
                )}{" "}
                at{" "}
                <a
                  href="https://rs.ge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4e35dc] hover:underline font-medium"
                >
                  rs.ge
                </a>
                .
              </p>
              {declaration.declaration_status === "pending" && (
                <Button
                  variant="primary"
                  onClick={handleMarkSubmitted}
                  disabled={submitting}
                  className="w-full md:w-auto"
                >
                  {submitting ? "Saving..." : "Mark as Submitted"}
                </Button>
              )}
            </div>
          )}

        {declaration.declaration_status === "submitted" &&
          declaration.submitted_date && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-[9px]">
              <h3 className="text-sm font-medium uppercase tracking-wide text-green-800 mb-2">
                ✓ Declaration Submitted
              </h3>
              <p className="text-sm text-gray-700">
                This declaration was successfully submitted on{" "}
                {new Date(declaration.submitted_date).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
                .
              </p>
            </div>
          )}

        {declaration.is_overdue && declaration.declaration_status !== "rejected" && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-[9px]">
            <h3 className="text-sm font-medium uppercase tracking-wide text-red-800 mb-2">
              ⚠️ Declaration Overdue
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              The filing deadline for this declaration has passed. Please submit
              your declaration at{" "}
              <a
                href="https://rs.ge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4e35dc] hover:underline font-medium"
              >
                rs.ge
              </a>{" "}
              as soon as possible.
            </p>
            <Button
              variant="primary"
              onClick={handleMarkSubmitted}
              disabled={submitting}
              className="w-full md:w-auto"
            >
              {submitting ? "Saving..." : "Mark as Submitted"}
            </Button>
          </div>
        )}

        {/* Payment Received - Waiting for Admin */}
        {declaration.declaration_status === "payment_received" && (
          <div className="p-4 bg-violet-50 border-2 border-violet-200 rounded-[9px]">
            <h3 className="text-sm font-medium uppercase tracking-wide text-violet-800 mb-2">
              ✓ Payment Received - In Admin Queue
            </h3>
            <p className="text-sm text-gray-700">
              Your payment has been received. Your declaration is in the admin filing
              queue and will be filed on RS.ge by our team soon.
            </p>
            {declaration.payment_date && (
              <p className="text-xs text-gray-600 mt-2">
                Payment completed on{" "}
                {new Date(declaration.payment_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        )}

        {/* In Progress - Admin is Filing */}
        {declaration.declaration_status === "in_progress" && (
          <div className="p-4 bg-cyan-50 border-2 border-cyan-200 rounded-[9px]">
            <h3 className="text-sm font-medium uppercase tracking-wide text-cyan-800 mb-2">
              🔄 Admin is Filing Your Declaration
            </h3>
            <p className="text-sm text-gray-700">
              Our admin team is currently filing your declaration on RS.ge. You'll be
              notified once it's complete.
            </p>
          </div>
        )}

        {/* Filed by Admin - Complete */}
        {declaration.declaration_status === "filed_by_admin" && (
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-[9px]">
            <h3 className="text-sm font-medium uppercase tracking-wide text-green-800 mb-2">
              ✓ Filed by Admin Team
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Your declaration was successfully filed on RS.ge by our admin team
              {declaration.filed_by_admin_at &&
                ` on ${new Date(declaration.filed_by_admin_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`}
              .
            </p>
            {declaration.admin_notes && (
              <div className="mt-3 p-3 bg-white border border-green-200 rounded-[9px]">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Admin Notes
                </p>
                <p className="text-sm text-gray-700">{declaration.admin_notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Rejected - Needs Correction */}
        {declaration.declaration_status === "rejected" && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-[9px]">
            <h3 className="text-sm font-medium uppercase tracking-wide text-red-800 mb-2">
              ⚠️ Corrections Required
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Your declaration has been reviewed and requires corrections before filing.
            </p>
            {declaration.correction_notes && (
              <div className="mt-3 p-3 bg-white border border-red-200 rounded-[9px]">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Correction Notes
                </p>
                <p className="text-sm text-gray-700">{declaration.correction_notes}</p>
              </div>
            )}
            <div className="mt-4">
              <Link href="/dashboard/transactions">
                <Button variant="primary">Fix Transaction Data</Button>
              </Link>
            </div>
          </div>
        )}
      </Card>

      {/* Filing Service Cards (Only for pending/awaiting_payment) */}
      {declaration.declaration_status === "pending" && (
        <FilingServiceCard
          year={year}
          month={month}
          income={declaration.income_gel}
          taxDue={declaration.tax_due_gel}
          onRequestSuccess={loadDeclaration}
        />
      )}

      {declaration.declaration_status === "awaiting_payment" &&
        declaration.mock_payment_id && (
          <PaymentFlow
            year={year}
            month={month}
            amount={declaration.payment_amount}
            paymentId={declaration.mock_payment_id}
            onPaymentSuccess={loadDeclaration}
          />
        )}

      {/* How to File (only for self-service) */}
      {!TaxService.isAdminManaged(declaration.declaration_status) && (
        <Card>
          <h2 className="text-lg font-medium uppercase tracking-wide mb-4">
            How to File This Declaration
          </h2>
        <ol className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#003049] text-white rounded-full flex items-center justify-center text-xs font-medium">
              1
            </span>
            <div>
              <p className="font-medium">Visit rs.ge</p>
              <p className="text-gray-600">
                Log in to the Revenue Service portal at{" "}
                <a
                  href="https://rs.ge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4e35dc] hover:underline"
                >
                  rs.ge
                </a>
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#003049] text-white rounded-full flex items-center justify-center text-xs font-medium">
              2
            </span>
            <div>
              <p className="font-medium">Navigate to Declarations</p>
              <p className="text-gray-600">
                Find the small business tax declaration section
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#003049] text-white rounded-full flex items-center justify-center text-xs font-medium">
              3
            </span>
            <div>
              <p className="font-medium">Enter Income Amount</p>
              <p className="text-gray-600">
                Report total income of{" "}
                <strong>{formatTaxAmount(declaration.income_gel)}</strong> for{" "}
                {declaration.month_name}
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#003049] text-white rounded-full flex items-center justify-center text-xs font-medium">
              4
            </span>
            <div>
              <p className="font-medium">Confirm Tax Amount</p>
              <p className="text-gray-600">
                Tax due should be{" "}
                <strong>{formatTaxAmount(declaration.tax_due_gel)}</strong> (1%
                of income)
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#003049] text-white rounded-full flex items-center justify-center text-xs font-medium">
              5
            </span>
            <div>
              <p className="font-medium">Submit Declaration</p>
              <p className="text-gray-600">
                Complete and submit your declaration, then mark it as submitted
                here
              </p>
            </div>
          </li>
        </ol>
        </Card>
      )}

      {/* Related Links */}
      <Card>
        <h2 className="text-lg font-medium uppercase tracking-wide mb-4">
          Related
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/transactions">
            <Button variant="secondary">View Transactions</Button>
          </Link>
          <Link href="/dashboard/tax-analytics">
            <Button variant="secondary">Tax Analytics</Button>
          </Link>
          <Link href="/dashboard/tax-declarations">
            <Button variant="secondary">All Declarations</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
