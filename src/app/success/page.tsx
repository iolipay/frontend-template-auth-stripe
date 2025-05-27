"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSubscription } from "@/contexts/SubscriptionContext";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshSubscription } = useSubscription();
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Refresh subscription data to get the latest plan
    const handleSuccess = async () => {
      try {
        await refreshSubscription();
      } catch (error) {
        console.error("Failed to refresh subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure backend webhook has processed
    const timer = setTimeout(handleSuccess, 2000);

    return () => clearTimeout(timer);
  }, [refreshSubscription]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Processing your upgrade...
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we update your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your subscription has been upgraded successfully. You now have
            access to all your new features.
          </p>

          {sessionId && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Session ID
              </p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                {sessionId}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors block"
            >
              Go to Dashboard
            </Link>

            <button
              onClick={() => router.back()}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Go Back
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help? Contact our{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
