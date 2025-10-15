"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { DeclarationDetail, formatTaxAmount } from "@/types/tax";
import { TaxService } from "@/services/tax.service";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const year = parseInt(params.year as string);
  const month = parseInt(params.month as string);

  const [declaration, setDeclaration] = useState<DeclarationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
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

      // Check if already paid
      if (
        data.declaration_status !== "pending" &&
        data.declaration_status !== "awaiting_payment" &&
        data.declaration_status !== "overdue"
      ) {
        // Already paid, redirect back
        router.push(`/dashboard/tax-declarations/${year}/${month}`);
      }
    } catch (err) {
      console.error("Failed to load declaration:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load declaration"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!declaration) return;

    try {
      setPaying(true);
      setError("");

      // If already awaiting payment, complete the payment
      if (declaration.declaration_status === "awaiting_payment") {
        const response = await TaxService.payForFilingService(year, month);
        setSuccess(response.message);

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(`/dashboard/tax-declarations/${year}/${month}`);
        }, 2000);
      } else {
        // First request the service, then pay
        await TaxService.requestFilingService(year, month);

        // Now complete payment
        const response = await TaxService.payForFilingService(year, month);
        setSuccess(response.message);

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(`/dashboard/tax-declarations/${year}/${month}`);
        }, 2000);
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003049] mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!declaration || error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-[9px] border-2 border-gray-200 p-8 text-center">
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
          <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 mb-2">
            Unable to Load Payment
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {error || "The declaration could not be loaded."}
          </p>
          <Link href="/dashboard/tax-declarations">
            <Button variant="primary" fullWidth>
              Back to Declarations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const taxAmount = TaxService.calculateTaxAmount(declaration.income_gel);
  const serviceFee = TaxService.calculateServiceFee(declaration.income_gel);
  const totalAmount = TaxService.calculateTotalFilingCost(declaration.income_gel);
  const daysRemaining = declaration.days_until_deadline ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/dashboard/tax-declarations/${year}/${month}`}
          className="inline-flex items-center gap-2 text-sm text-[#4e35dc] hover:underline mb-6"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Declaration
        </Link>

        {/* Main Payment Card */}
        <div className="bg-white rounded-[9px] border-2 border-gray-200 p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-purple-100 rounded-[9px] mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-[#4e35dc]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-medium uppercase tracking-wide text-[#003049] mb-2">
              Pay for {declaration.month_name}
            </h1>
            <p className="text-sm text-gray-600">
              Complete your monthly tax declaration payment
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError("")}
              className="mb-6"
            />
          )}
          {success && (
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess("")}
              className="mb-6"
            />
          )}

          {/* Income Summary */}
          <div className="mb-6 p-6 bg-gray-50 border-2 border-gray-200 rounded-[9px]">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                  Monthly Income
                </p>
                <p className="text-3xl font-medium text-green-600">
                  {formatTaxAmount(declaration.income_gel)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  from {declaration.transaction_count} transaction
                  {declaration.transaction_count !== 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                  Payment Deadline
                </p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(declaration.filing_deadline).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
                <p
                  className={`text-sm mt-1 font-medium ${
                    daysRemaining <= 3
                      ? "text-red-600"
                      : daysRemaining <= 7
                      ? "text-orange-600"
                      : "text-gray-600"
                  }`}
                >
                  {daysRemaining > 0
                    ? `${daysRemaining} days remaining`
                    : daysRemaining === 0
                    ? "Due today!"
                    : `${Math.abs(daysRemaining)} days overdue`}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="mb-8">
            <h2 className="text-sm font-medium uppercase tracking-wide text-gray-700 mb-4">
              Payment Breakdown
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 border-2 border-green-200 rounded-[9px]">
                <div>
                  <p className="text-base font-medium text-gray-900">
                    Tax Payment (1%)
                  </p>
                  <p className="text-xs text-gray-600">Goes to government</p>
                </div>
                <p className="text-2xl font-medium text-green-600">
                  {formatTaxAmount(taxAmount)}
                </p>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 border-2 border-blue-200 rounded-[9px]">
                <div>
                  <p className="text-base font-medium text-gray-900">
                    Service Fee (2%)
                  </p>
                  <p className="text-xs text-gray-600">Admin filing service</p>
                </div>
                <p className="text-2xl font-medium text-blue-600">
                  {formatTaxAmount(serviceFee)}
                </p>
              </div>
              <div className="flex justify-between items-center p-6 bg-purple-50 border-2 border-purple-300 rounded-[9px]">
                <div>
                  <p className="text-lg font-medium uppercase tracking-wide text-gray-900">
                    Total Payment (3%)
                  </p>
                  <p className="text-sm text-gray-600">Pay once, we file for you</p>
                </div>
                <p className="text-4xl font-medium text-[#4e35dc]">
                  {formatTaxAmount(totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Mock Payment Notice */}
          <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-[9px]">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-amber-900 mb-1">
                  Mock Payment System
                </h3>
                <p className="text-xs text-amber-800">
                  This is a demo payment system. No real money will be charged. In
                  production, this would integrate with a real payment gateway.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            variant="primary"
            fullWidth
            onClick={handlePayment}
            disabled={paying || !!success}
            className="text-lg py-4"
          >
            {paying
              ? "Processing Payment..."
              : success
              ? "Payment Complete ✓"
              : `Pay ${formatTaxAmount(totalAmount)} (Mock)`}
          </Button>

          {/* Info Text */}
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-[9px]">
            <p className="text-sm text-center text-blue-900">
              ℹ️ After payment, our admin team will file your declaration on{" "}
              <span className="font-medium">RS.ge</span> automatically. You'll be
              notified when it's complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
