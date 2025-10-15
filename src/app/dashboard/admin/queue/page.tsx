"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { DeclarationQueueTable } from "@/components/admin/DeclarationQueueTable";
import { AdminActionModal } from "@/components/admin/AdminActionModal";
import { AdminService } from "@/services/admin.service";
import { AdminDeclarationItem } from "@/types/tax";

type QueueTab = "ready_to_file" | "in_progress" | "needs_correction" | "pending_payment";

export default function AdminQueuePage() {
  const [queue, setQueue] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<QueueTab>("ready_to_file");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"complete" | "reject">("complete");
  const [selectedDeclaration, setSelectedDeclaration] = useState<AdminDeclarationItem | null>(null);

  useEffect(() => {
    loadQueue();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadQueue = async () => {
    try {
      setError("");
      const data = await AdminService.getQueue();
      setQueue(data);
    } catch (err) {
      console.error("Failed to load queue:", err);
      setError(err instanceof Error ? err.message : "Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  const handleStartFiling = async (declarationId: string) => {
    if (!confirm("Start filing this declaration?")) return;

    try {
      setActionLoading(true);
      setError("");
      await AdminService.startFiling(declarationId);
      setSuccess("Filing started successfully");
      await loadQueue();
    } catch (err) {
      console.error("Failed to start filing:", err);
      setError(err instanceof Error ? err.message : "Failed to start filing");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteFiling = (declarationId: string) => {
    const declaration = findDeclarationById(declarationId);
    if (!declaration) return;

    setSelectedDeclaration(declaration);
    setModalType("complete");
    setModalOpen(true);
  };

  const handleRejectFiling = (declarationId: string) => {
    const declaration = findDeclarationById(declarationId);
    if (!declaration) return;

    setSelectedDeclaration(declaration);
    setModalType("reject");
    setModalOpen(true);
  };

  const handleModalConfirm = async (data: any) => {
    if (!selectedDeclaration) return;

    try {
      setActionLoading(true);
      setError("");

      if (modalType === "complete") {
        await AdminService.completeFiling(selectedDeclaration.id, data);
        setSuccess("Declaration filed successfully!");
      } else {
        await AdminService.rejectFiling(selectedDeclaration.id, data);
        setSuccess("Declaration rejected. User will be notified.");
      }

      setModalOpen(false);
      setSelectedDeclaration(null);
      await loadQueue();
    } catch (err) {
      console.error("Action failed:", err);
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const findDeclarationById = (id: string): AdminDeclarationItem | null => {
    if (!queue) return null;

    for (const category of ["ready_to_file", "in_progress", "needs_correction", "pending_payment"]) {
      const found = queue[category]?.find((d: AdminDeclarationItem) => d.id === id);
      if (found) return found;
    }
    return null;
  };

  const getCurrentTabDeclarations = (): AdminDeclarationItem[] => {
    if (!queue) return [];
    return queue[selectedTab] || [];
  };

  const tabs = [
    { id: "ready_to_file" as QueueTab, label: "Ready to File", color: "orange", icon: "🟠" },
    { id: "in_progress" as QueueTab, label: "In Progress", color: "blue", icon: "🔵" },
    { id: "needs_correction" as QueueTab, label: "Needs Correction", color: "red", icon: "🔴" },
    { id: "pending_payment" as QueueTab, label: "Pending Payment", color: "gray", icon: "⚪" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-[9px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium uppercase tracking-wide">
            Filing Queue
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage user declarations and file on RS.ge
          </p>
        </div>
        <Button variant="secondary" onClick={loadQueue} disabled={actionLoading}>
          🔄 Refresh
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess("")} />
      )}

      {/* Tabs */}
      <Card>
        <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-gray-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium uppercase tracking-wide rounded-[1px] border-2 transition-all duration-200 ${
                selectedTab === tab.id
                  ? `bg-${tab.color}-500 text-white border-${tab.color}-500`
                  : `bg-white text-gray-700 border-gray-300 hover:border-${tab.color}-500`
              }`}
              style={
                selectedTab === tab.id
                  ? {
                      backgroundColor:
                        tab.color === "orange"
                          ? "#f97316"
                          : tab.color === "blue"
                          ? "#3b82f6"
                          : tab.color === "red"
                          ? "#ef4444"
                          : "#9ca3af",
                      borderColor:
                        tab.color === "orange"
                          ? "#f97316"
                          : tab.color === "blue"
                          ? "#3b82f6"
                          : tab.color === "red"
                          ? "#ef4444"
                          : "#9ca3af",
                    }
                  : undefined
              }
            >
              {tab.icon} {tab.label} ({queue?.[tab.id]?.length || 0})
            </button>
          ))}
        </div>

        {/* Queue Table */}
        <DeclarationQueueTable
          declarations={getCurrentTabDeclarations()}
          onStartFiling={handleStartFiling}
          onCompleteFiling={handleCompleteFiling}
          onRejectFiling={handleRejectFiling}
          loading={actionLoading}
        />
      </Card>

      {/* Help Text */}
      <Card>
        <h3 className="text-sm font-medium uppercase tracking-wide mb-3">
          How to Process Declarations
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Ready to File:</strong> User has paid. Click "Start" when you begin filing on RS.ge.
          </p>
          <p>
            <strong>In Progress:</strong> You're currently filing. Click "Complete" when done or "Reject" if data is incorrect.
          </p>
          <p>
            <strong>Needs Correction:</strong> Declarations you rejected. User must fix their data.
          </p>
          <p>
            <strong>Pending Payment:</strong> User requested service but hasn't paid yet.
          </p>
        </div>
      </Card>

      {/* Action Modal */}
      {modalOpen && selectedDeclaration && (
        <AdminActionModal
          type={modalType}
          declarationId={selectedDeclaration.id}
          userEmail={selectedDeclaration.user_email}
          period={`${selectedDeclaration.month}/${selectedDeclaration.year}`}
          onConfirm={handleModalConfirm}
          onClose={() => {
            setModalOpen(false);
            setSelectedDeclaration(null);
          }}
        />
      )}

      {/* Auto-refresh indicator */}
      <p className="text-xs text-gray-500 text-center">
        Auto-refreshes every 30 seconds
      </p>
    </div>
  );
}
