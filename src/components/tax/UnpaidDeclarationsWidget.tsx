"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatTaxAmount, TaxMonthlyBreakdown } from "@/types/tax";
import { TaxService } from "@/services/tax.service";

export function UnpaidDeclarationsWidget() {
  const router = useRouter();
  const [monthlyData, setMonthlyData] = useState<TaxMonthlyBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnpaidDeclarations();
  }, []);

  const loadUnpaidDeclarations = async () => {
    try {
      setLoading(true);
      const currentYear = new Date().getFullYear();
      const data = await TaxService.getMonthlyBreakdown(currentYear);
      setMonthlyData(data);
    } catch (err) {
      console.error("Failed to load unpaid declarations:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  // Filter unpaid declarations
  const unpaidDeclarations =
    monthlyData?.months.filter(
      (m) =>
        m.declaration_status === "pending" ||
        m.declaration_status === "awaiting_payment" ||
        m.declaration_status === "overdue"
    ) || [];

  // Calculate total amount owed
  const totalOwed = unpaidDeclarations.reduce((sum, declaration) => {
    const totalCost = TaxService.calculateTotalFilingCost(declaration.income_gel);
    return sum + totalCost;
  }, 0);

  if (unpaidDeclarations.length === 0) {
    return null; // Don't show widget if no unpaid declarations
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium uppercase tracking-wide text-[#003049]">
            Unpaid Declarations
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {unpaidDeclarations.length} month{unpaidDeclarations.length !== 1 ? "s" : ""} require payment
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-medium text-[#4e35dc]">
            {formatTaxAmount(totalOwed)}
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Total Due
          </p>
        </div>
      </div>

      {/* Unpaid List */}
      <div className="space-y-2 mb-4">
        {unpaidDeclarations.slice(0, 3).map((declaration) => {
          const monthNum = TaxService.getMonthNumber(declaration.month);
          const yearNum = TaxService.getYear(declaration.month);
          const monthName = new Date(yearNum, monthNum - 1).toLocaleDateString(
            "en-US",
            { month: "long" }
          );
          const totalCost = TaxService.calculateTotalFilingCost(declaration.income_gel);
          const isOverdue = declaration.declaration_status === "overdue";

          return (
            <div
              key={declaration.month}
              className={`flex items-center justify-between p-3 rounded-[9px] border-2 ${
                isOverdue
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {monthName} {yearNum}
                </p>
                <p className="text-xs text-gray-600">
                  {formatTaxAmount(declaration.income_gel)} income
                </p>
                {isOverdue && (
                  <p className="text-xs text-red-600 font-medium mt-0.5">
                    Overdue
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-base font-medium text-[#4e35dc]">
                    {formatTaxAmount(totalCost)}
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() =>
                    router.push(`/dashboard/tax-declarations/${yearNum}/${monthNum}/pay`)
                  }
                  className="text-sm px-4 py-2"
                >
                  Pay
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More Link */}
      {unpaidDeclarations.length > 3 && (
        <p className="text-sm text-gray-600 text-center mb-4">
          +{unpaidDeclarations.length - 3} more unpaid declaration
          {unpaidDeclarations.length - 3 !== 1 ? "s" : ""}
        </p>
      )}

      {/* Action Button */}
      <Link href="/dashboard/tax-declarations">
        <Button variant="secondary" fullWidth>
          View All Declarations
        </Button>
      </Link>
    </Card>
  );
}
