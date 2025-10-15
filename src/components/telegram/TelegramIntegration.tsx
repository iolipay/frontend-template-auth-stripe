"use client";

import React, { useState, useEffect } from "react";
import { TelegramService } from "@/services/telegram.service";
import { TelegramStatus, TelegramSettings } from "@/types/telegram";
import { TelegramConnectModal } from "./TelegramConnectModal";
import { TelegramSettingsForm } from "./TelegramSettingsForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";

export function TelegramIntegration() {
  const [status, setStatus] = useState<TelegramStatus | null>(null);
  const [settings, setSettings] = useState<TelegramSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const statusData = await TelegramService.getStatus();
      setStatus(statusData);

      if (statusData.is_connected) {
        const settingsData = await TelegramService.getSettings();
        setSettings(settingsData);
      }
    } catch (error: any) {
      console.error("Failed to load Telegram data:", error);
      setError("Failed to load Telegram integration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect Telegram? You will no longer receive notifications."
      )
    )
      return;

    try {
      await TelegramService.disconnect();
      setSuccessMessage("Telegram disconnected successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      loadData();
    } catch (error: any) {
      setError(error.message || "Failed to disconnect Telegram");
    }
  };

  const handleConnect = () => {
    setShowConnectModal(true);
  };

  const handleConnectionSuccess = () => {
    setShowConnectModal(false);
    loadData();
    setSuccessMessage("Telegram connected successfully! 🎉");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  if (isLoading) {
    return (
      <Card hoverable={false}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003049]"></div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card hoverable={false}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0088cc]/10 rounded-[9px] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[#0088cc]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L8.08 13.768l-2.87-.903c-.627-.198-.642-.626.13-.927l11.2-4.315c.52-.18.977.127.803.598z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium uppercase tracking-wide">
              Telegram Notifications
            </h2>
          </div>
          {status?.is_connected && (
            <Badge variant="success" className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Connected
            </Badge>
          )}
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} className="mb-4" />}
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage("")}
            className="mb-4"
          />
        )}

        {!status?.is_connected ? (
          // Not Connected View
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Get automated reminders about your transactions, weekly summaries, and
              monthly reports directly in Telegram.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-green-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Daily transaction reminders</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-green-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Weekly income summaries</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-green-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Monthly financial reports</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-green-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Subscription expiry alerts</span>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={handleConnect} variant="primary">
                Connect Telegram Account
              </Button>
            </div>
          </div>
        ) : (
          // Connected View
          <div className="space-y-6">
            <div className="rounded-[9px] bg-green-50 border-2 border-green-200 p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-green-900 text-sm">
                    Connected as @{status.telegram_username}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Connected on{" "}
                    {status.connected_at
                      ? new Date(status.connected_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {settings && (
              <TelegramSettingsForm
                settings={settings}
                onUpdate={(newSettings) => {
                  setSettings(newSettings);
                  setSuccessMessage("Settings updated successfully!");
                  setTimeout(() => setSuccessMessage(""), 3000);
                }}
              />
            )}

            <div className="pt-4 border-t-2 border-gray-200">
              <Button onClick={handleDisconnect} variant="secondary">
                Disconnect Telegram
              </Button>
            </div>
          </div>
        )}
      </Card>

      {showConnectModal && (
        <TelegramConnectModal
          onClose={() => setShowConnectModal(false)}
          onSuccess={handleConnectionSuccess}
        />
      )}
    </>
  );
}
