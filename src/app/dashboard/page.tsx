"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSubscription, usePlan } from "@/contexts/SubscriptionContext";
import { PLAN_CONFIGS } from "@/types/subscription";
import { SubscriptionService } from "@/services/subscription.service";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const { subscription } = useSubscription();
  const currentPlan = usePlan();
  const [upgrading, setUpgrading] = useState(false);

  // Check for upgrade success/cancel messages
  const upgraded = searchParams.get("upgraded") === "true";
  const upgradeCancelled = searchParams.get("upgrade") === "cancelled";

  const handleUpgrade = async (planType: "pro" | "premium") => {
    try {
      setUpgrading(true);
      const planConfig = PLAN_CONFIGS[planType];
      await SubscriptionService.handleUpgrade(planConfig.priceId);
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Failed to start upgrade process. Please try again.");
    } finally {
      setUpgrading(false);
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "pro":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "premium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {upgraded && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 dark:text-green-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-green-800 dark:text-green-200 font-medium">
              Upgrade successful! Your new features are now available.
            </span>
          </div>
        </div>
      )}

      {upgradeCancelled && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-yellow-800 dark:text-yellow-200 font-medium">
              Upgrade was cancelled. You can try again anytime.
            </span>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-white dark:bg-black/20 p-6 rounded-lg shadow-lg border border-black/[.08] dark:border-white/[.1]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanBadgeColor(
              currentPlan
            )}`}
          >
            {PLAN_CONFIGS[currentPlan].name} Plan
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Manage your account, access features, and explore what&apos;s
          available with your {PLAN_CONFIGS[currentPlan].name} plan.
        </p>

        {subscription && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Plan Status:{" "}
            <span className="capitalize font-medium">
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
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Subscription Plans */}
        <Link
          href="/subscription/free"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
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
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Free Features
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Explore basic features available to all users
          </p>
        </Link>

        <Link
          href="/subscription/pro"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Pro Features
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentPlan === "free"
              ? "Upgrade to unlock advanced features"
              : "Access your Pro features"}
          </p>
        </Link>

        <Link
          href="/subscription/premium"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-purple-600 dark:text-purple-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Premium Features
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentPlan === "premium"
              ? "Access exclusive premium content"
              : "Ultimate features for power users"}
          </p>
        </Link>
      </div>

      {/* Upgrade Section */}
      {currentPlan !== "premium" && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Ready to Upgrade?</h2>
          <p className="text-blue-100 mb-4">
            Unlock powerful features and take your experience to the next level.
          </p>
          <div className="flex space-x-4">
            {currentPlan === "free" && (
              <button
                onClick={() => handleUpgrade("pro")}
                disabled={upgrading}
                className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {upgrading
                  ? "Processing..."
                  : `Upgrade to Pro - $${PLAN_CONFIGS.pro.price}/mo`}
              </button>
            )}
            <button
              onClick={() => handleUpgrade("premium")}
              disabled={upgrading}
              className="bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-800 transition-colors disabled:opacity-50"
            >
              {upgrading
                ? "Processing..."
                : `${currentPlan === "free" ? "Go" : "Upgrade to"} Premium - $${
                    PLAN_CONFIGS.premium.price
                  }/mo`}
            </button>
          </div>
        </div>
      )}

      {/* Current Plan Features */}
      <div className="bg-white dark:bg-black/20 p-6 rounded-lg shadow-lg border border-black/[.08] dark:border-white/[.1]">
        <h2 className="text-xl font-semibold mb-4">
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
              <span className="text-gray-700 dark:text-gray-300">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
