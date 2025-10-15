import {
  TelegramStatus,
  TelegramConnectionResponse,
  TelegramSettings,
  TelegramSettingsUpdate,
  TelegramBotInfo,
} from "@/types/telegram";
import { apiFetch } from "@/utils/api";

export class TelegramService {
  /**
   * Get Telegram connection status
   */
  static async getStatus(): Promise<TelegramStatus> {
    const response = await apiFetch("/telegram/status");

    if (!response.ok) {
      throw new Error("Failed to fetch Telegram status");
    }

    return response.json();
  }

  /**
   * Generate connection link for linking Telegram account
   */
  static async connect(): Promise<TelegramConnectionResponse> {
    const response = await apiFetch("/telegram/connect", {
      method: "POST",
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : Array.isArray(responseData.detail)
          ? responseData.detail[0]?.msg
          : "Failed to generate connection link";
      throw new Error(errorMessage);
    }

    return responseData;
  }

  /**
   * Disconnect Telegram account
   */
  static async disconnect(): Promise<{ message: string }> {
    const response = await apiFetch("/telegram/disconnect", {
      method: "DELETE",
    });

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to disconnect Telegram";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get Telegram notification settings
   */
  static async getSettings(): Promise<TelegramSettings> {
    const response = await apiFetch("/telegram/settings");

    if (!response.ok) {
      throw new Error("Failed to fetch Telegram settings");
    }

    return response.json();
  }

  /**
   * Update Telegram notification settings
   */
  static async updateSettings(
    settings: TelegramSettingsUpdate
  ): Promise<TelegramSettings> {
    const response = await apiFetch("/telegram/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : Array.isArray(responseData.detail)
          ? responseData.detail[0]?.msg
          : "Failed to update settings";
      throw new Error(errorMessage);
    }

    return responseData;
  }

  /**
   * Send test reminder to verify integration
   */
  static async sendTestReminder(
    reminderType: string
  ): Promise<{ message: string }> {
    const response = await apiFetch("/telegram/test-reminder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reminder_type: reminderType }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to send test reminder";
      throw new Error(errorMessage);
    }

    return responseData;
  }

  /**
   * Get bot information
   */
  static async getBotInfo(): Promise<TelegramBotInfo> {
    const response = await apiFetch("/telegram/bot-info");

    if (!response.ok) {
      throw new Error("Failed to fetch bot info");
    }

    return response.json();
  }

  /**
   * Format time for display
   */
  static formatTime(time: string): string {
    return time; // Already in HH:MM format
  }

  /**
   * Validate time format (HH:MM)
   */
  static validateTime(time: string): boolean {
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  }
}
