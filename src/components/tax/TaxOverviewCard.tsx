import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  TaxOverview,
  getTaxStatusColor,
  getTaxStatusLabel,
  formatTaxAmount,
  GEORGIAN_TAX_CONSTANTS,
} from "@/types/tax";
import { TaxService } from "@/services/tax.service";
import { ThresholdProgress } from "./ThresholdProgress";

interface TaxOverviewCardProps {
  data: TaxOverview;
  loading?: boolean;
}

export function TaxOverviewCard({ data, loading }: TaxOverviewCardProps) {
  if (loading) {
    return (
      <Card hoverable={false}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  const statusColor = getTaxStatusColor(data.status);
  const statusLabel = getTaxStatusLabel(data.status);

  return (
    <Card hoverable={false} className="bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium uppercase tracking-wide text-[#003049]">
            Tax Overview {data.year}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {GEORGIAN_TAX_CONSTANTS.taxSystemNameEn} • {GEORGIAN_TAX_CONSTANTS.taxRate * 100}% Tax Rate
          </p>
        </div>
        <Badge
          variant={
            data.status === "on_track"
              ? "success"
              : data.status === "exceeded"
              ? "danger"
              : "warning"
          }
        >
          {statusLabel}
        </Badge>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Left: Threshold Progress */}
        <div>
          <ThresholdProgress
            percentage={data.threshold_percentage_used}
            status={data.status}
          />
          <div className="text-center mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Annual Threshold Usage
            </p>
            <p className="text-2xl font-medium mt-1" style={{ color: statusColor }}>
              {TaxService.formatPercentage(data.threshold_percentage_used)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              of {formatTaxAmount(GEORGIAN_TAX_CONSTANTS.annualThreshold)}
            </p>
          </div>
        </div>

        {/* Right: Key Stats */}
        <div className="space-y-4">
          {/* Income YTD */}
          <div className="p-4 bg-white border-2 border-gray-200 rounded-[9px]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Income Year-to-Date
            </p>
            <p className="text-2xl font-medium text-green-600">
              {formatTaxAmount(data.total_income_ytd_gel)}
            </p>
          </div>

          {/* Tax Liability */}
          <div className="p-4 bg-white border-2 border-gray-200 rounded-[9px]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Tax Liability YTD
            </p>
            <p className="text-2xl font-medium text-[#003049]">
              {formatTaxAmount(data.tax_liability_ytd_gel)}
            </p>
          </div>

          {/* Remaining Capacity */}
          <div className="p-4 bg-white border-2 border-gray-200 rounded-[9px]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              Remaining Capacity
            </p>
            <p className="text-2xl font-medium text-gray-900">
              {formatTaxAmount(data.threshold_remaining_gel)}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-gray-200">
        {/* Months Declared */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
            Declared
          </p>
          <p className="text-xl font-medium text-green-600">{data.months_declared}</p>
          <p className="text-xs text-gray-500">months</p>
        </div>

        {/* Months Pending */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
            Pending
          </p>
          <p className="text-xl font-medium text-amber-500">{data.months_pending}</p>
          <p className="text-xs text-gray-500">months</p>
        </div>

        {/* Last Declaration */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
            Last Declared
          </p>
          <p className="text-sm font-medium text-gray-900">
            {data.last_declaration_date
              ? new Date(data.last_declaration_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>

        {/* Next Deadline */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
            Next Deadline
          </p>
          <p className="text-sm font-medium text-[#4e35dc]">
            {data.next_declaration_due
              ? new Date(data.next_declaration_due).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>
    </Card>
  );
}
