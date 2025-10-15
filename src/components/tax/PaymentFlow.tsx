"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { formatTaxAmount } from "@/types/tax";
import { TaxService } from "@/services/tax.service";

interface PaymentFlowProps {
  year: number;
  month: number;
  amount: number;
  paymentId: string;
  onPaymentSuccess?: () => void;
}

export function PaymentFlow({
  year,
  month,
  amount,
  paymentId,
  onPaymentSuccess,
}: PaymentFlowProps) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePayment = async () => {
    try {
      setPaying(true);
      setError("");
      const response = await TaxService.payForFilingService(year, month);
      setSuccess(response.message);
      if (onPaymentSuccess) {
        setTimeout(() => {
          onPaymentSuccess();
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to process payment:", err);
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <Card>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-[9px] mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600"
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
        <h3 className="text-xl font-medium uppercase tracking-wide text-[#003049] mb-2">
          Complete Payment
        </h3>
        <p className="text-sm text-gray-600">
          Pay for admin filing service to have your declaration filed by our
          team
        </p>
      </div>

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

      {/* Payment Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Service</span>
          <span className="text-sm font-medium">
            Admin Filing - {month}/{year}
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Payment ID</span>
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
            {paymentId}
          </span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-lg font-medium uppercase tracking-wide">
            Total Amount
          </span>
          <span className="text-2xl font-medium text-[#4e35dc]">
            {formatTaxAmount(amount)}
          </span>
        </div>
      </div>

      {/* Mock Payment Notice */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-[9px] p-4 mb-6">
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
            <h4 className="text-sm font-medium text-amber-900 mb-1">
              Mock Payment System
            </h4>
            <p className="text-xs text-amber-800">
              This is a demo payment system. No real money will be charged. In
              production, this would integrate with a real payment gateway (e.g.,
              Stripe, BOG, TBC Pay).
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
      >
        {paying
          ? "Processing Payment..."
          : success
          ? "Payment Complete ✓"
          : `Pay ${formatTaxAmount(amount)} (Mock)`}
      </Button>

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center mt-4">
        After payment, your declaration will be added to the admin filing queue.
        You'll receive confirmation once it's been filed on RS.ge.
      </p>
    </Card>
  );
}
