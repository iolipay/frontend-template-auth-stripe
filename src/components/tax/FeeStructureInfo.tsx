"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { GEORGIAN_TAX_CONSTANTS } from "@/types/tax";
import { TaxService } from "@/services/tax.service";

interface FeeStructureInfoProps {
  variant?: "card" | "inline" | "minimal";
  className?: string;
}

export function FeeStructureInfo({
  variant = "card",
  className = "",
}: FeeStructureInfoProps) {
  const [feeStructure, setFeeStructure] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeeStructure();
  }, []);

  const loadFeeStructure = async () => {
    try {
      setLoading(true);
      const data = await TaxService.getFeeStructure();
      setFeeStructure(data);
    } catch (err) {
      console.error("Failed to load fee structure:", err);
      // Use fallback constants if API fails
      setFeeStructure({
        tax_rate: GEORGIAN_TAX_CONSTANTS.taxRate,
        service_fee_rate: GEORGIAN_TAX_CONSTANTS.serviceFeeRate,
        total_rate: GEORGIAN_TAX_CONSTANTS.totalFilingRate,
        description: "Admin filing service fee structure",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-[9px]"></div>
      </div>
    );
  }

  const taxPercent = ((feeStructure?.tax_rate ?? GEORGIAN_TAX_CONSTANTS.taxRate) * 100).toFixed(0);
  const servicePercent = ((feeStructure?.service_fee_rate ?? GEORGIAN_TAX_CONSTANTS.serviceFeeRate) * 100).toFixed(0);
  const totalPercent = ((feeStructure?.total_rate ?? GEORGIAN_TAX_CONSTANTS.totalFilingRate) * 100).toFixed(0);

  // Minimal variant - just text
  if (variant === "minimal") {
    return (
      <p className={`text-sm text-gray-600 ${className}`}>
        You pay <strong>{totalPercent}% total</strong> ({taxPercent}% tax + {servicePercent}% service fee)
      </p>
    );
  }

  // Inline variant - simple badge-like display
  if (variant === "inline") {
    return (
      <div className={`inline-flex items-center gap-2 bg-blue-50 border-2 border-blue-200 rounded-[9px] px-4 py-2 ${className}`}>
        <svg
          className="w-5 h-5 text-blue-600"
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
        <span className="text-sm font-medium text-blue-900">
          {totalPercent}% total ({taxPercent}% tax + {servicePercent}% service)
        </span>
      </div>
    );
  }

  // Card variant - full detailed display
  return (
    <Card className={className}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-[9px] flex items-center justify-center">
          <svg
            className="w-6 h-6 text-blue-600"
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
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium uppercase tracking-wide text-[#003049] mb-2">
            Filing Service Fee Structure
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {feeStructure?.description || "Transparent pricing for admin-managed tax filing"}
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 border-2 border-green-200 rounded-[9px]">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Tax Payment
                </p>
                <p className="text-sm text-gray-700 mt-0.5">Goes to government</p>
              </div>
              <p className="text-2xl font-medium text-green-600">{taxPercent}%</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 border-2 border-blue-200 rounded-[9px]">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Service Fee
                </p>
                <p className="text-sm text-gray-700 mt-0.5">Admin filing service</p>
              </div>
              <p className="text-2xl font-medium text-blue-600">{servicePercent}%</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 border-2 border-purple-200 rounded-[9px]">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Total Cost
                </p>
                <p className="text-sm text-gray-700 mt-0.5">Of your monthly income</p>
              </div>
              <p className="text-2xl font-medium text-[#4e35dc]">{totalPercent}%</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 border-2 border-gray-200 rounded-[9px]">
            <p className="text-xs text-gray-600">
              <strong>Example:</strong> For 22,000 GEL income, you pay 660 GEL total
              (220 GEL tax + 440 GEL service fee)
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
