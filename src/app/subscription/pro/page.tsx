"use client";

import { useState } from "react";
import { PLAN_CONFIGS } from "@/types/subscription";
import { usePlan } from "@/contexts/SubscriptionContext";
import { SubscriptionService } from "@/services/subscription.service";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function ProPage() {
  return (
    <ProtectedRoute allowedPlans={["pro", "premium"]}>
      <ProPageContent />
    </ProtectedRoute>
  );
}

function ProPageContent() {
  const currentPlan = usePlan();
  const proPlan = PLAN_CONFIGS.pro;
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (currentPlan === "pro" || currentPlan === "premium") return;

    try {
      setUpgrading(true);
      await SubscriptionService.handleUpgrade(proPlan.priceId);
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Failed to start upgrade process. Please try again.");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {proPlan.name} Plan Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Unlock powerful features for professionals
          </p>
          {currentPlan === "pro" && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Your Current Plan
            </div>
          )}
          {currentPlan === "premium" && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 rounded-full text-sm font-medium">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              You have Premium (includes all Pro features)
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Pro Features
            </h2>
            <ul className="space-y-3">
              {proPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
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
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Pro Tools Demo
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Advanced Analytics
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get detailed insights with custom reports and real-time data
                  visualization.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Priority Support
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get fast email support and priority assistance from our team.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Pro Integrations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect with popular tools and services to streamline your
                  workflow.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Upgrade */}
        {currentPlan === "free" && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-center text-white mb-8">
            <h2 className="text-3xl font-bold mb-2">${proPlan.price}/month</h2>
            <p className="text-blue-100 mb-6">
              Upgrade to Pro and unlock all these powerful features
            </p>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {upgrading ? "Processing..." : "Upgrade to Pro"}
            </button>
            <p className="text-xs text-blue-200 mt-4">
              Secure payment powered by Stripe
            </p>
          </div>
        )}

        {/* Want More? */}
        {(currentPlan === "free" || currentPlan === "pro") && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Need Even More Features?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Check out our Premium plan for advanced features and priority
              support.
            </p>
            <Link
              href="/subscription/premium"
              className="inline-block bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View Premium Plan
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="text-center mt-8">
          <Link
            href="/dashboard"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
