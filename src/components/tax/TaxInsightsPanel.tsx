import React, { useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  TaxInsight,
  InsightSeverity,
  getInsightSeverityColor,
} from "@/types/tax";

interface TaxInsightsPanelProps {
  insights: TaxInsight[];
  loading?: boolean;
  maxDisplay?: number;
}

export function TaxInsightsPanel({
  insights,
  loading,
  maxDisplay = 5,
}: TaxInsightsPanelProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <Card hoverable={false}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  // Create unique ID for each insight
  const getInsightId = (insight: TaxInsight, index: number) => {
    return `${insight.type}-${insight.created_at}-${index}`;
  };

  // Filter out dismissed insights
  const visibleInsights = insights.filter(
    (insight, index) => !dismissedIds.has(getInsightId(insight, index))
  );

  // Determine which insights to show
  const displayedInsights = showAll
    ? visibleInsights
    : visibleInsights.slice(0, maxDisplay);

  const hasMore = visibleInsights.length > maxDisplay;

  if (visibleInsights.length === 0) {
    return (
      <Card hoverable={false}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-[9px] mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium uppercase tracking-wide text-gray-900 mb-2">
            All Clear!
          </h3>
          <p className="text-sm text-gray-600">
            No alerts or recommendations at this time.
          </p>
        </div>
      </Card>
    );
  }

  const handleDismiss = (insightId: string) => {
    setDismissedIds(new Set([...dismissedIds, insightId]));
  };

  const getSeverityIcon = (severity: InsightSeverity) => {
    switch (severity) {
      case "critical":
        return "🚨";
      case "high":
        return "⚠️";
      case "medium":
        return "📌";
      case "info":
        return "ℹ️";
    }
  };

  const getSeverityBgColor = (severity: InsightSeverity) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200";
      case "high":
        return "bg-orange-50 border-orange-200";
      case "medium":
        return "bg-amber-50 border-amber-200";
      case "info":
        return "bg-blue-50 border-blue-200";
    }
  };

  const getSeverityTextColor = (severity: InsightSeverity) => {
    switch (severity) {
      case "critical":
        return "text-red-800";
      case "high":
        return "text-orange-800";
      case "medium":
        return "text-amber-800";
      case "info":
        return "text-blue-800";
    }
  };

  return (
    <Card hoverable={false}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium uppercase tracking-wide">
          Tax Insights & Alerts
        </h2>
        {hasMore && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-[#4e35dc] hover:underline font-medium"
          >
            View All ({visibleInsights.length})
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayedInsights.map((insight, index) => {
          const insightId = getInsightId(insight, insights.indexOf(insight));
          return (
            <div
              key={insightId}
              className={`p-4 border-2 rounded-[9px] ${getSeverityBgColor(
                insight.severity
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {getSeverityIcon(insight.severity)}
                    </span>
                    <h3
                      className={`text-sm font-medium uppercase tracking-wide ${getSeverityTextColor(
                        insight.severity
                      )}`}
                    >
                      {insight.title}
                    </h3>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-gray-700 mb-3">{insight.message}</p>

                  {/* Action Button */}
                  {insight.action_url && insight.action_text && (
                    <Link href={insight.action_url}>
                      <Button variant="secondary" className="text-xs py-1 px-3">
                        {insight.action_text}
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Dismiss Button */}
                {!insight.action_required && (
                  <button
                    onClick={() => handleDismiss(insightId)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label="Dismiss"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Timestamp */}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(insight.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          );
        })}
      </div>

      {showAll && hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(false)}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Show Less
          </button>
        </div>
      )}
    </Card>
  );
}
