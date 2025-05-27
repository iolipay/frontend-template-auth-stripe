"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CancelPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          {/* Cancel Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-6">
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

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Cancelled
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            No worries! Your payment was cancelled and no charges were made. You
            can try again anytime.
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
              Back to Dashboard
            </Link>

            <Link
              href="/subscription/pro"
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-md transition-colors block"
            >
              View Plans Again
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help choosing a plan? Contact our{" "}
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
