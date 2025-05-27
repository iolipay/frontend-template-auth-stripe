"use client";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { SubscriptionPlan } from "@/types/subscription";
import { useHasAccess, useSubscription } from "@/contexts/SubscriptionContext";

interface ProtectedRouteProps {
  allowedPlans: SubscriptionPlan[];
  children: ReactNode;
  fallbackPath?: string;
  showUpgradePrompt?: boolean;
}

export default function ProtectedRoute({
  allowedPlans,
  children,
  fallbackPath = "/dashboard",
  showUpgradePrompt = true,
}: ProtectedRouteProps) {
  const { loading } = useSubscription();
  const hasAccess = useHasAccess(allowedPlans);

  // Show loading state while checking subscription
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  // If user has access, render the protected content
  if (hasAccess) {
    return <>{children}</>;
  }

  // If user doesn't have access, show upgrade prompt or redirect
  if (showUpgradePrompt) {
    return <UpgradePrompt allowedPlans={allowedPlans} />;
  }

  // Redirect to fallback path
  redirect(fallbackPath);
}

interface UpgradePromptProps {
  allowedPlans: SubscriptionPlan[];
}

function UpgradePrompt({ allowedPlans }: UpgradePromptProps) {
  const getUpgradeMessage = () => {
    if (allowedPlans.includes("pro") && allowedPlans.includes("premium")) {
      return "This feature requires a Pro or Premium subscription.";
    }
    if (allowedPlans.includes("premium")) {
      return "This feature is only available to Premium subscribers.";
    }
    if (allowedPlans.includes("pro")) {
      return "This feature requires a Pro subscription or higher.";
    }
    return "This feature requires a subscription upgrade.";
  };

  const getRequiredPlan = (): SubscriptionPlan => {
    if (allowedPlans.includes("pro")) return "pro";
    if (allowedPlans.includes("premium")) return "premium";
    return "pro"; // default
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <svg
                className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Upgrade Required
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {getUpgradeMessage()}
          </p>

          <div className="space-y-3">
            <button
              onClick={() =>
                (window.location.href = `/subscription/${getRequiredPlan()}`)
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              View Pricing Plans
            </button>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
