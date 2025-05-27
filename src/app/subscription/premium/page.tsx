"use client";

import { useState } from "react";
import { PLAN_CONFIGS } from "@/types/subscription";
import { usePlan } from "@/contexts/SubscriptionContext";
import { SubscriptionService } from "@/services/subscription.service";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function PremiumPage() {
  return (
    <ProtectedRoute allowedPlans={["premium"]}>
      <PremiumPageContent />
    </ProtectedRoute>
  );
}

function PremiumPageContent() {
  const currentPlan = usePlan();
  const premiumPlan = PLAN_CONFIGS.premium;
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (currentPlan === "premium") return;

    try {
      setUpgrading(true);
      await SubscriptionService.handleUpgrade(premiumPlan.priceId);
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Failed to start upgrade process. Please try again.");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-medium mb-4">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Premium Features
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {premiumPlan.name} Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Ultimate features for power users and enterprises
          </p>

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
              Your Current Plan
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg
                className="w-6 h-6 text-purple-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Premium Features
            </h2>
            <ul className="space-y-3">
              {premiumPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
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
              Exclusive Premium Tools
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Custom Integrations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Build custom integrations with our API and webhook system.
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Advanced Reporting
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generate comprehensive reports with custom metrics and KPIs.
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  White-label Solutions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize the platform with your branding and domain.
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Dedicated Account Manager
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get a dedicated account manager for personalized support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Upgrade */}
        {currentPlan !== "premium" && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center text-white mb-8">
            <h2 className="text-3xl font-bold mb-2">
              ${premiumPlan.price}/month
            </h2>
            <p className="text-purple-100 mb-6">
              Get the ultimate experience with Premium features
            </p>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="bg-white text-purple-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {upgrading ? "Processing..." : "Upgrade to Premium"}
            </button>
            <p className="text-xs text-purple-200 mt-4">
              Secure payment powered by Stripe • Cancel anytime
            </p>
          </div>
        )}

        {/* Premium Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Why Choose Premium?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
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
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Maximum Performance
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unlock the full potential of our platform with premium
                performance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Enterprise Support
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get priority support with guaranteed response times.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Complete Customization
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tailor every aspect of the platform to your needs.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
