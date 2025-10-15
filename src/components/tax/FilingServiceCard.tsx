"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { formatTaxAmount } from "@/types/tax";
import { TaxService } from "@/services/tax.service";

interface FilingServiceCardProps {
  year: number;
  month: number;
  income: number;
  taxDue: number;
  onRequestSuccess?: () => void;
}

export function FilingServiceCard({
  year,
  month,
  income,
  taxDue,
  onRequestSuccess,
}: FilingServiceCardProps) {
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const serviceCost = TaxService.getFilingServiceCost();

  const handleRequestService = async () => {
    try {
      setRequesting(true);
      setError("");
      const response = await TaxService.requestFilingService(year, month);
      setSuccess(response.message);
      if (onRequestSuccess) {
        onRequestSuccess();
      }
    } catch (err) {
      console.error("Failed to request filing service:", err);
      setError(
        err instanceof Error ? err.message : "Failed to request filing service"
      );
    } finally {
      setRequesting(false);
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium uppercase tracking-wide text-[#003049]">
            Admin Filing Service
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Let our team file your declaration on RS.ge
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-medium text-[#4e35dc]">
            {formatTaxAmount(serviceCost)}
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            One-time fee
          </p>
        </div>
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

      <div className="space-y-4 mt-6">
        {/* What's Included */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[9px] p-4">
          <h4 className="text-sm font-medium uppercase tracking-wide text-blue-900 mb-3">
            What's Included
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                Admin files declaration on{" "}
                <a
                  href="https://rs.ge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4e35dc] hover:underline"
                >
                  RS.ge
                </a>{" "}
                for you
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Review and verification of tax data</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Confirmation number provided</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Peace of mind - no manual filing required</span>
            </li>
          </ul>
        </div>

        {/* Declaration Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 border-2 border-gray-200 rounded-[9px]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Income
            </p>
            <p className="text-lg font-medium text-gray-900">
              {formatTaxAmount(income)}
            </p>
          </div>
          <div className="p-3 bg-gray-50 border-2 border-gray-200 rounded-[9px]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Tax Due (1%)
            </p>
            <p className="text-lg font-medium text-gray-900">
              {formatTaxAmount(taxDue)}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleRequestService}
          disabled={requesting}
        >
          {requesting ? "Requesting..." : `Request Filing Service - ${formatTaxAmount(serviceCost)}`}
        </Button>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center">
          After requesting service, you'll need to complete payment. Our admin
          team will then file your declaration on RS.ge.
        </p>
      </div>
    </Card>
  );
}
