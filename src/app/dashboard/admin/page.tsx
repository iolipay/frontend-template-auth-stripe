"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { AdminService } from "@/services/admin.service";
import { formatTaxAmount } from "@/types/tax";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [queue, setQueue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    loadDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setError("");
      setDebugInfo("Attempting to fetch queue data...");

      // Load queue data (this endpoint exists)
      const queueData = await AdminService.getQueue();
      setQueue(queueData);
      setDebugInfo(`Queue loaded successfully. Total count: ${queueData.total_count || 0}`);

      // Calculate stats from queue data if stats endpoint doesn't exist
      try {
        const statsData = await AdminService.getStats();
        setStats(statsData);
        setDebugInfo("Stats loaded from API");
      } catch (statsErr) {
        // If stats endpoint doesn't exist, calculate from queue
        console.log("Stats endpoint not available, calculating from queue");
        setDebugInfo("Stats endpoint not available, using calculated stats");
        const calculatedStats = {
          total_in_queue: queueData.total_count || 0,
          ready_to_file: queueData.ready_to_file?.length || 0,
          in_progress: queueData.in_progress?.length || 0,
          needs_correction: queueData.needs_correction?.length || 0,
          pending_payment: queueData.pending_payment?.length || 0,
        };
        setStats(calculatedStats);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard data";
      setError(errorMessage);
      setDebugInfo(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-medium uppercase tracking-wide">
          Admin Dashboard
        </h1>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-[9px]"></div>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500">Loading admin data...</p>
      </div>
    );
  }

  // If error, show error state with actual data
  if (error && !queue) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-medium uppercase tracking-wide">
          Admin Dashboard
        </h1>
        <Alert type="error" message={error} onClose={() => setError("")} />
        <Card>
          <div className="text-center py-12">
            <p className="text-sm text-gray-600 mb-4">
              Unable to connect to admin API endpoints.
            </p>
            <p className="text-xs text-gray-500">
              Make sure the backend is running and admin endpoints are available:
              <br />
              - GET /admin/declarations/queue
              <br />
              - GET /admin/declarations/stats (optional)
            </p>
            <Button variant="primary" onClick={loadDashboardData} className="mt-4">
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Info (remove in production) */}
      {debugInfo && (
        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
          Debug: {debugInfo}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium uppercase tracking-wide">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Overview of filing service operations
          </p>
        </div>
        <Button variant="secondary" onClick={loadDashboardData}>
          🔄 Refresh
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card hoverable={false}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Total in Queue
            </p>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-medium text-[#003049]">
            {stats?.total_in_queue || 0}
          </p>
          <p className="text-xs text-gray-600 mt-1">All pending filings</p>
        </Card>

        <Card hoverable={false}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Ready to File
            </p>
            <span className="text-2xl">🟠</span>
          </div>
          <p className="text-3xl font-medium text-orange-600">
            {stats?.ready_to_file || 0}
          </p>
          <p className="text-xs text-gray-600 mt-1">Awaiting admin action</p>
        </Card>

        <Card hoverable={false}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              In Progress
            </p>
            <span className="text-2xl">🔵</span>
          </div>
          <p className="text-3xl font-medium text-blue-600">
            {stats?.in_progress || 0}
          </p>
          <p className="text-xs text-gray-600 mt-1">Currently being filed</p>
        </Card>

        <Card hoverable={false}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Needs Correction
            </p>
            <span className="text-2xl">🔴</span>
          </div>
          <p className="text-3xl font-medium text-red-600">
            {stats?.needs_correction || 0}
          </p>
          <p className="text-xs text-gray-600 mt-1">Requires user action</p>
        </Card>
      </div>

      {/* Filing Queue Summary */}
      <Card>
        <h2 className="text-lg font-medium uppercase tracking-wide mb-4">
          Filing Queue Overview
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Ready to File */}
          <Link href="/dashboard/admin/queue">
            <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-[9px] hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium uppercase tracking-wide text-orange-900">
                  🟠 Ready to File
                </h3>
                <span className="text-2xl font-medium text-orange-600">
                  {queue?.ready_to_file?.length || 0}
                </span>
              </div>
              <p className="text-xs text-orange-800">
                Declarations paid and awaiting filing
              </p>
            </div>
          </Link>

          {/* In Progress */}
          <Link href="/dashboard/admin/queue">
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-[9px] hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium uppercase tracking-wide text-blue-900">
                  🔵 In Progress
                </h3>
                <span className="text-2xl font-medium text-blue-600">
                  {queue?.in_progress?.length || 0}
                </span>
              </div>
              <p className="text-xs text-blue-800">
                Declarations currently being filed
              </p>
            </div>
          </Link>

          {/* Needs Correction */}
          <Link href="/dashboard/admin/queue">
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-[9px] hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium uppercase tracking-wide text-red-900">
                  🔴 Needs Correction
                </h3>
                <span className="text-2xl font-medium text-red-600">
                  {queue?.needs_correction?.length || 0}
                </span>
              </div>
              <p className="text-xs text-red-800">
                Rejected - awaiting user corrections
              </p>
            </div>
          </Link>

          {/* Pending Payment */}
          <Link href="/dashboard/admin/queue">
            <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-[9px] hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900">
                  ⚪ Pending Payment
                </h3>
                <span className="text-2xl font-medium text-gray-600">
                  {queue?.pending_payment?.length || 0}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Requested but not yet paid
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t-2 border-gray-200">
          <Link href="/dashboard/admin/queue">
            <Button variant="primary" fullWidth>
              Go to Filing Queue →
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-medium uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link href="/dashboard/admin/queue">
              <Button variant="primary" fullWidth>
                📋 View Filing Queue
              </Button>
            </Link>
            <Link href="/dashboard/admin/declarations">
              <Button variant="secondary" fullWidth>
                📄 All Declarations
              </Button>
            </Link>
            <Link href="/dashboard/admin/users">
              <Button variant="secondary" fullWidth>
                👥 All Users
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium uppercase tracking-wide mb-3">
            Admin Guide
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Step 1:</strong> Check "Ready to File" queue
            </p>
            <p>
              <strong>Step 2:</strong> Start filing on RS.ge
            </p>
            <p>
              <strong>Step 3:</strong> Complete with confirmation number
            </p>
            <p className="text-xs text-gray-500 mt-4">
              If data is incorrect, reject the declaration with correction notes
              for the user.
            </p>
          </div>
        </Card>
      </div>

      {/* Auto-refresh indicator */}
      <p className="text-xs text-gray-500 text-center">
        Auto-refreshes every 30 seconds • Last updated:{" "}
        {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
