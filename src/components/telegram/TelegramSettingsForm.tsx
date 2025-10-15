"use client";

import React, { useState } from "react";
import { TelegramService } from "@/services/telegram.service";
import { TelegramSettings } from "@/types/telegram";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

interface TelegramSettingsFormProps {
  settings: TelegramSettings;
  onUpdate: (settings: TelegramSettings) => void;
}

export function TelegramSettingsForm({
  settings,
  onUpdate,
}: TelegramSettingsFormProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(localSettings);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage("");
      const updated = await TelegramService.updateSettings(localSettings);
      onUpdate(updated);
      setSuccessMessage("Settings updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTest = async (type: string) => {
    try {
      setIsSendingTest(type);
      setErrorMessage("");
      await TelegramService.sendTestReminder(type);
      setSuccessMessage(`Test ${type} reminder sent! Check your Telegram.`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to send test reminder");
    } finally {
      setIsSendingTest(null);
    }
  };

  // Generate time options (00:00 to 23:00)
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage("")} />
      )}
      {errorMessage && (
        <Alert type="error" message={errorMessage} onClose={() => setErrorMessage("")} />
      )}

      <div className="rounded-[9px] border-2 border-gray-200 p-4 space-y-4">
        <h3 className="text-sm font-medium uppercase tracking-wide">
          Notification Settings
        </h3>

        <div className="flex items-center justify-between">
          <label
            htmlFor="notifications-enabled"
            className="flex-1 cursor-pointer"
          >
            <div>
              <div className="text-sm font-medium">Enable notifications</div>
              <div className="text-xs text-gray-500">
                Master switch for all Telegram notifications
              </div>
            </div>
          </label>
          <input
            type="checkbox"
            id="notifications-enabled"
            checked={localSettings.notifications_enabled}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                notifications_enabled: e.target.checked,
              })
            }
            className="w-5 h-5 text-[#003049] border-2 border-gray-300 rounded focus:ring-[#003049] focus:ring-2"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="reminder-time"
            className="block text-xs font-medium uppercase tracking-wide text-gray-700"
          >
            Daily reminder time
          </label>
          <select
            id="reminder-time"
            value={localSettings.reminder_time}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, reminder_time: e.target.value })
            }
            disabled={!localSettings.notifications_enabled}
            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-[1px] focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Time when you'll receive daily transaction reminders
          </p>
        </div>

        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="primary"
            fullWidth
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <div className="rounded-[9px] border-2 border-gray-200 p-4 space-y-4">
        <h3 className="text-sm font-medium uppercase tracking-wide">
          Test Reminders
        </h3>
        <p className="text-xs text-gray-600">
          Send test notifications to verify your integration
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => handleSendTest("daily")}
            disabled={isSendingTest !== null}
            className="text-xs"
          >
            {isSendingTest === "daily" ? "Sending..." : "Daily"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSendTest("weekly")}
            disabled={isSendingTest !== null}
            className="text-xs"
          >
            {isSendingTest === "weekly" ? "Sending..." : "Weekly"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSendTest("monthly")}
            disabled={isSendingTest !== null}
            className="text-xs"
          >
            {isSendingTest === "monthly" ? "Sending..." : "Monthly"}
          </Button>
        </div>
      </div>
    </div>
  );
}
