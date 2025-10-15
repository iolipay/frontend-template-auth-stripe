"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSubscription, usePlan } from "@/contexts/SubscriptionContext";
import { PLAN_CONFIGS } from "@/types/subscription";
import { SubscriptionService } from "@/services/subscription.service";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const { subscription, refreshSubscription } = useSubscription();
  const currentPlan = usePlan();
  const [upgrading, setUpgrading] = useState(false);
  const [managingSubscription, setManagingSubscription] = useState(false);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Check for upgrade success/cancel messages
  const upgraded = searchParams.get("upgraded") === "true";
  const upgradeCancelled = searchParams.get("upgrade") === "cancelled";

  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
  };

  const handleUpgrade = async (planType: "pro" | "premium") => {
    try {
      setUpgrading(true);
      const planConfig = PLAN_CONFIGS[planType];
      await SubscriptionService.handleUpgrade(planConfig.priceId);
    } catch (error) {
      console.error("Upgrade failed:", error);
      showNotification(
        "error",
        "Failed to start upgrade process. Please try again."
      );
    } finally {
      setUpgrading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setManagingSubscription(true);
      await SubscriptionService.redirectToBillingPortal();
    } catch (error) {
      console.error("Failed to open billing portal:", error);
      showNotification(
        "error",
        "Failed to open billing portal. Please try again."
      );
    } finally {
      setManagingSubscription(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setCancellingSubscription(true);
      const result = await SubscriptionService.cancelSubscription();
      showNotification(
        "success",
        result.message || "Subscription cancelled successfully."
      );

      // Refresh subscription data to reflect the change
      await refreshSubscription();
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      showNotification(
        "error",
        "Failed to cancel subscription. Please try again."
      );
    } finally {
      setCancellingSubscription(false);
    }
  };

  const getPlanBadgeVariant = (plan: string): 'primary' | 'success' | 'warning' | 'secondary' => {
    switch (plan) {
      case "pro":
        return "success";
      case "premium":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Success/Error Messages */}
      {upgraded && (
        <Alert
          type="success"
          message="Upgrade successful! Your new features are now available."
        />
      )}

      {upgradeCancelled && (
        <Alert
          type="warning"
          message="Upgrade was cancelled. You can try again anytime."
        />
      )}

      {/* Welcome Section */}
      <Card>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-medium uppercase tracking-wide">
            Welcome to Your Dashboard
          </h1>
          <Badge variant={getPlanBadgeVariant(currentPlan)}>
            {PLAN_CONFIGS[currentPlan].name} Plan
          </Badge>
        </div>
        <p className="text-gray-600 mb-4">
          Manage your account, access features, and explore what&apos;s
          available with your {PLAN_CONFIGS[currentPlan].name} plan.
        </p>

        {subscription && (
          <div className="text-sm text-gray-500">
            Plan Status:{" "}
            <span className="capitalize font-medium text-[#003049]">
              {subscription.subscription_status}
            </span>
            {subscription.current_period_end && (
              <span className="ml-4">
                Next billing:{" "}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Subscription Management Section */}
      {currentPlan !== "free" && (
        <Card>
          <h2 className="text-xl font-medium uppercase tracking-wide mb-4">
            Subscription Management
          </h2>
          <p className="text-gray-600 mb-4">
            Manage your subscription, update payment methods, or cancel your
            plan.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleManageSubscription}
              disabled={managingSubscription}
              variant="primary"
              className="flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {managingSubscription
                ? "Opening Portal..."
                : "Manage Subscription"}
            </Button>

            <Button
              onClick={handleCancelSubscription}
              disabled={cancellingSubscription}
              variant="secondary"
              className="flex items-center bg-red-600 hover:bg-red-700 border-red-600 text-white hover:text-white"
            >
              <svg
                className="w-4 h-4 mr-2"
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
              {cancellingSubscription ? "Cancelling..." : "Cancel Subscription"}
            </Button>
          </div>

          <Alert
            type="info"
            message="Tip: Use &quot;Manage Subscription&quot; to update payment methods, view invoices, or change billing details through Stripe's secure portal."
            className="mt-4"
          />
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Transactions */}
        <Link href="/dashboard/transactions">
          <Card hoverable className="h-full">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-[#003049]/10 rounded-[9px] flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-[#003049]"
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
              <h3 className="font-medium uppercase tracking-wide text-gray-900">
                Transactions
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Track your income and expenses
            </p>
          </Card>
        </Link>

        {/* Subscription Plans */}
        <Link href="/subscription/free">
          <Card hoverable className="h-full">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-[9px] flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="font-medium uppercase tracking-wide text-gray-900">
                Free Features
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Explore basic features available to all users
            </p>
          </Card>
        </Link>

        <Link href="/subscription/pro">
          <Card hoverable className="h-full">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-[9px] flex items-center justify-center mr-3">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-medium uppercase tracking-wide text-gray-900">
                Pro Features
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              {currentPlan === "free"
                ? "Upgrade to unlock advanced features"
                : "Access your Pro features"}
            </p>
          </Card>
        </Link>

        <Link href="/subscription/premium">
          <Card hoverable className="h-full">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-[9px] flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-medium uppercase tracking-wide text-gray-900">
                Premium Features
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              {currentPlan === "premium"
                ? "Access exclusive premium content"
                : "Ultimate features for power users"}
            </p>
          </Card>
        </Link>
      </div>

      {/* Upgrade Section */}
      {currentPlan !== "premium" && (
        <div className="bg-gradient-to-r from-[#003049] to-[#4e35dc] rounded-[9px] p-6 text-white border-2 border-[#003049]">
          <h2 className="text-xl font-medium uppercase tracking-wide mb-2">
            Ready to Upgrade?
          </h2>
          <p className="text-white/80 mb-4">
            Unlock powerful features and take your experience to the next level.
          </p>
          <div className="flex flex-wrap gap-4">
            {currentPlan === "free" && (
              <Button
                onClick={() => handleUpgrade("pro")}
                disabled={upgrading}
                variant="secondary"
                className="bg-white text-[#003049] border-white hover:bg-gray-100"
              >
                {upgrading
                  ? "Processing..."
                  : `Upgrade to Pro - $${PLAN_CONFIGS.pro.price}/mo`}
              </Button>
            )}
            <Button
              onClick={() => handleUpgrade("premium")}
              disabled={upgrading}
              variant="secondary"
              className="bg-[#4e35dc] text-white border-[#4e35dc] hover:bg-purple-700"
            >
              {upgrading
                ? "Processing..."
                : `${currentPlan === "free" ? "Go" : "Upgrade to"} Premium - $${
                    PLAN_CONFIGS.premium.price
                  }/mo`}
            </Button>
          </div>
        </div>
      )}

      {/* Current Plan Features */}
      <Card>
        <h2 className="text-xl font-medium uppercase tracking-wide mb-4">
          Your {PLAN_CONFIGS[currentPlan].name} Plan Features
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {PLAN_CONFIGS[currentPlan].features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
