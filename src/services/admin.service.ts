import {
  AdminDeclarationQueueResponse,
  CompleteFilingRequest,
  RejectFilingRequest,
  AdminActionResponse,
} from "@/types/tax";
import { apiFetch } from "@/utils/api";

export class AdminService {
  /**
   * Get the admin filing queue
   * Returns declarations grouped by status
   */
  static async getQueue(): Promise<AdminDeclarationQueueResponse> {
    const response = await apiFetch("/admin/declarations/queue");

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to fetch admin queue";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Start filing a declaration
   * Changes status from payment_received to in_progress
   */
  static async startFiling(
    declarationId: string
  ): Promise<AdminActionResponse> {
    const response = await apiFetch(
      `/admin/declarations/${declarationId}/start`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to start filing";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Complete filing a declaration
   * Changes status from in_progress to filed_by_admin
   */
  static async completeFiling(
    declarationId: string,
    data: CompleteFilingRequest
  ): Promise<AdminActionResponse> {
    const response = await apiFetch(
      `/admin/declarations/${declarationId}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to complete filing";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Reject a declaration and request corrections
   * Changes status to rejected
   */
  static async rejectFiling(
    declarationId: string,
    data: RejectFilingRequest
  ): Promise<AdminActionResponse> {
    const response = await apiFetch(
      `/admin/declarations/${declarationId}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to reject filing";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get admin dashboard stats (optional endpoint)
   */
  static async getStats(): Promise<{
    total_in_queue: number;
    pending_payment: number;
    ready_to_file: number;
    in_progress: number;
    needs_correction: number;
  }> {
    const response = await apiFetch("/admin/declarations/stats");

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to fetch admin stats";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Format declaration ID for display
   */
  static formatDeclarationId(id: string): string {
    return id.substring(0, 8).toUpperCase();
  }

  /**
   * Get deadline urgency level
   */
  static getDeadlineUrgency(
    deadline: string
  ): "critical" | "warning" | "normal" {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.ceil(
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil <= 3) return "critical";
    if (daysUntil <= 7) return "warning";
    return "normal";
  }
}
