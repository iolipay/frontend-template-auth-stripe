"use client";

import { PLAN_CONFIGS } from "@/types/subscription";
import { usePlan } from "@/contexts/SubscriptionContext";
import Link from "next/link";

export default function FreePage() {
  const currentPlan = usePlan();
  const freePlan = PLAN_CONFIGS.free;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to {freePlan.name} Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get started with our basic features
          </p>
          {currentPlan === "free" && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              What&apos;s Included
            </h2>
            <ul className="space-y-3">
              {freePlan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
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
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Free Features Demo
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Basic Dashboard
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access your personal dashboard with essential features and
                  basic analytics.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Community Support
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get help from our community forums and documentation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        {currentPlan === "free" && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ready for More Features?
            </h2>
            <p className="text-blue-100 mb-6">
              Upgrade to Pro or Premium to unlock advanced features and priority
              support.
            </p>
            <div className="space-x-4">
              <Link
                href="/subscription/pro"
                className="inline-block bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Pro Plan
              </Link>
              <Link
                href="/subscription/premium"
                className="inline-block bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-800 transition-colors"
              >
                View Premium Plan
              </Link>
            </div>
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
