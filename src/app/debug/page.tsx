"use client";

import { useState } from "react";
import { useSubscription, usePlan } from "@/contexts/SubscriptionContext";
import { SubscriptionService } from "@/services/subscription.service";
import { AuthService } from "@/services/auth.service";

export default function DebugPage() {
  const { subscription, loading, error, refreshSubscription } =
    useSubscription();
  const currentPlan = usePlan();
  const [debugInfo, setDebugInfo] = useState<object | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshSubscription = async () => {
    try {
      setIsRefreshing(true);
      console.log("Manually refreshing subscription...");
      await refreshSubscription();
      console.log("Subscription refreshed");
    } catch (error) {
      console.error("Error refreshing subscription:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDebugAPICall = async () => {
    try {
      console.log("Making direct API call to /subscription/me");
      const subscriptionData = await SubscriptionService.getSubscription();
      console.log("Direct API response:", subscriptionData);
      setDebugInfo(subscriptionData);
    } catch (error) {
      console.error("Direct API call failed:", error);
      setDebugInfo({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleTestToken = () => {
    const token = AuthService.getToken();
    console.log("Current token:", token);
    console.log("All cookies:", document.cookie);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Debug Subscription System</h1>

      {/* Context State */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Subscription Context State
        </h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Loading:</strong> {loading ? "Yes" : "No"}
          </p>
          <p>
            <strong>Error:</strong> {error || "None"}
          </p>
          <p>
            <strong>Current Plan (Hook):</strong> {currentPlan}
          </p>
          <div>
            <strong>Subscription Object:</strong>
          </div>
          <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-auto">
            {JSON.stringify(subscription, null, 2)}
          </pre>
        </div>
      </div>

      {/* Debug Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Debug Actions</h2>
        <div className="space-y-4">
          <button
            onClick={handleRefreshSubscription}
            disabled={isRefreshing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded mr-4"
          >
            {isRefreshing ? "Refreshing..." : "Refresh Subscription Context"}
          </button>

          <button
            onClick={handleDebugAPICall}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-4"
          >
            Test Direct API Call
          </button>

          <button
            onClick={handleTestToken}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Check Auth Token
          </button>
        </div>
      </div>

      {/* Direct API Response */}
      {debugInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Direct API Response</h2>
          <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      {/* Backend Data Comparison */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Expected Backend Data</h2>
        <p className="text-sm mb-2">
          According to MongoDB, the user should have:
        </p>
        <ul className="text-sm space-y-1">
          <li>
            • <strong>subscription_plan:</strong> &quot;pro&quot;
          </li>
          <li>
            • <strong>subscription_status:</strong> &quot;active&quot;
          </li>
          <li>
            • <strong>subscription_end_date:</strong> 2025-06-27
          </li>
        </ul>
        <p className="text-sm mt-4 text-yellow-800 dark:text-yellow-200">
          If the API response doesn&apos;t match this, check your backend&apos;s
          /subscription/me endpoint.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <a
            href="/dashboard"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded mr-2"
          >
            Go to Dashboard
          </a>
          <a
            href="/subscription/pro"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Test Pro Access
          </a>
        </div>
      </div>
    </div>
  );
}
