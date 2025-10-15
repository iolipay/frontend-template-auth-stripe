import React from "react";
import { TaxStatus, getTaxStatusColor } from "@/types/tax";

interface ThresholdProgressProps {
  percentage: number;
  status: TaxStatus;
  size?: "small" | "medium" | "large";
}

export function ThresholdProgress({
  percentage,
  status,
  size = "large",
}: ThresholdProgressProps) {
  const statusColor = getTaxStatusColor(status);

  // Circular progress for large size
  if (size === "large") {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex items-center justify-center">
        <svg width="180" height="180" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={statusColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
          {/* Center text */}
          <text
            x="90"
            y="85"
            textAnchor="middle"
            className="text-3xl font-medium fill-gray-900 transform rotate-90"
            style={{ transformOrigin: "90px 90px" }}
          >
            {percentage.toFixed(1)}%
          </text>
          <text
            x="90"
            y="105"
            textAnchor="middle"
            className="text-xs fill-gray-500 transform rotate-90 uppercase tracking-wide"
            style={{ transformOrigin: "90px 90px" }}
          >
            Used
          </text>
        </svg>
      </div>
    );
  }

  // Linear progress bar for small/medium
  const height = size === "small" ? "h-2" : "h-3";

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-[1px] overflow-hidden ${height}`}>
        <div
          className={`${height} transition-all duration-500 rounded-[1px]`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: statusColor,
          }}
        />
      </div>
    </div>
  );
}
