"use client";

import React, { useState, useEffect } from "react";
import { TelegramService } from "@/services/telegram.service";
import { TelegramConnectionResponse } from "@/types/telegram";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

interface TelegramConnectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function TelegramConnectModal({
  onClose,
  onSuccess,
}: TelegramConnectModalProps) {
  const [connectionData, setConnectionData] =
    useState<TelegramConnectionResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    generateConnection();
  }, []);

  // Poll for connection status
  useEffect(() => {
    if (!isWaiting) return;

    const interval = setInterval(async () => {
      try {
        const status = await TelegramService.getStatus();
        if (status.is_connected) {
          clearInterval(interval);
          onSuccess();
        }
      } catch (error) {
        console.error("Error checking status:", error);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [isWaiting, onSuccess]);

  // Countdown timer
  useEffect(() => {
    if (!connectionData) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(connectionData.expires_at).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        setError("Connection link expired. Please try again.");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [connectionData]);

  const generateConnection = async () => {
    try {
      setIsGenerating(true);
      setError("");
      const data = await TelegramService.connect();
      setConnectionData(data);
    } catch (error: any) {
      setError(error.message || "Failed to generate connection link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenTelegram = () => {
    if (!connectionData) return;

    window.open(connectionData.deep_link, "_blank");
    setIsWaiting(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[9px] max-w-md w-full max-h-[90vh] overflow-y-auto">
        <Card hoverable={false}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium uppercase tracking-wide">
              Connect Telegram Account
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && <Alert type="error" message={error} className="mb-4" />}

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003049] mb-4"></div>
              <p className="text-sm text-gray-600">Generating connection link...</p>
            </div>
          ) : isWaiting ? (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4e35dc] mb-4"></div>
                <p className="text-center text-sm font-medium text-gray-900 mb-2">
                  Waiting for connection...
                </p>
                <p className="text-center text-xs text-gray-500">
                  Please click "Start" in the Telegram bot to complete the connection.
                </p>
                <p className="text-center text-xs text-gray-500 mt-1">
                  This window will close automatically.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Click the button below to open Telegram and start the bot.
              </p>

              <div className="rounded-[9px] bg-[#4e35dc]/10 border-2 border-[#4e35dc]/20 p-4">
                <p className="text-sm font-medium text-[#003049] mb-1">
                  Important:
                </p>
                <p className="text-sm text-gray-700">
                  After opening Telegram, click the "Start" button to complete the
                  connection.
                </p>
              </div>

              <Button
                onClick={handleOpenTelegram}
                variant="primary"
                fullWidth
                className="flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Open Telegram Bot
              </Button>

              {timeLeft && timeLeft !== "Expired" && (
                <p className="text-center text-xs text-gray-500">
                  Link expires in: {timeLeft}
                </p>
              )}

              <Button onClick={onClose} variant="secondary" fullWidth>
                Cancel
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
