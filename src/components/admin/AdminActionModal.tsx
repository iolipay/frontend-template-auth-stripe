"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

interface AdminActionModalProps {
  type: "complete" | "reject";
  declarationId: string;
  userEmail: string;
  period: string;
  onConfirm: (data: {
    confirmation_number?: string;
    admin_notes?: string;
    correction_notes?: string;
  }) => Promise<void>;
  onClose: () => void;
}

export function AdminActionModal({
  type,
  declarationId,
  userEmail,
  period,
  onConfirm,
  onClose,
}: AdminActionModalProps) {
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [correctionNotes, setCorrectionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "reject" && !correctionNotes.trim()) {
      setError("Correction notes are required when rejecting a declaration");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (type === "complete") {
        await onConfirm({
          confirmation_number: confirmationNumber.trim() || undefined,
          admin_notes: adminNotes.trim() || undefined,
        });
      } else {
        await onConfirm({
          correction_notes: correctionNotes.trim(),
          admin_notes: adminNotes.trim() || undefined,
        });
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[9px] max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 rounded-t-[9px]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-medium uppercase tracking-wide text-[#003049]">
                {type === "complete"
                  ? "Complete Filing"
                  : "Reject Declaration"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {userEmail} - {period}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <Alert type="error" message={error} onClose={() => setError("")} />
          )}

          {type === "complete" ? (
            <>
              <Input
                id="confirmation_number"
                label="RS.ge Confirmation Number (Optional)"
                type="text"
                value={confirmationNumber}
                onChange={(e) => setConfirmationNumber(e.target.value)}
                placeholder="RS12345678"
              />

              <div>
                <label
                  htmlFor="admin_notes"
                  className="block text-sm font-medium uppercase tracking-wide mb-2"
                >
                  Admin Notes (Optional)
                </label>
                <textarea
                  id="admin_notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Filed successfully on RS.ge..."
                  rows={3}
                  className="w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-[1px] focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10 transition-all duration-200"
                />
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-[9px] p-4">
                <p className="text-sm text-gray-700">
                  This declaration will be marked as <strong>filed_by_admin</strong>{" "}
                  and the user will be notified that filing is complete.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="correction_notes"
                  className="block text-sm font-medium uppercase tracking-wide mb-2"
                >
                  Correction Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="correction_notes"
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  placeholder="Please add missing transactions from October 5-8..."
                  rows={4}
                  required
                  className="w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-[1px] focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  These notes will be visible to the user
                </p>
              </div>

              <div>
                <label
                  htmlFor="admin_notes_reject"
                  className="block text-sm font-medium uppercase tracking-wide mb-2"
                >
                  Internal Notes (Optional)
                </label>
                <textarea
                  id="admin_notes_reject"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes for admin reference..."
                  rows={2}
                  className="w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-[1px] focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  These notes are for admin use only
                </p>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-[9px] p-4">
                <p className="text-sm text-gray-700">
                  This declaration will be marked as <strong>rejected</strong>. The
                  user will need to fix their transaction data and re-request filing
                  service.
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={submitting}
            >
              {submitting
                ? "Processing..."
                : type === "complete"
                ? "Complete Filing"
                : "Reject Declaration"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
