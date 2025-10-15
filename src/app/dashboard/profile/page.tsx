"use client";

import { useEffect, useState } from "react";
import { AuthService } from "@/services/auth.service";
import type { UserResponse } from "@/types/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TelegramIntegration } from "@/components/telegram/TelegramIntegration";

export default function Profile() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<{
    success?: string;
    error?: string;
  }>({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    try {
      setResendLoading(true);
      await AuthService.resendVerification(user.email);
      setResendStatus({
        success: "Verification email sent! Please check your inbox.",
      });
    } catch (err) {
      setResendStatus({
        error:
          err instanceof Error
            ? err.message
            : "Failed to send verification email",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card hoverable={false}>
        <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-medium uppercase tracking-wide">
            Profile
          </h1>
          <Badge variant={user?.is_verified ? "success" : "warning"}>
            {user?.is_verified ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Not Verified
              </span>
            )}
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#003049] flex items-center justify-center">
              <span className="text-2xl font-medium text-white">
                {user?.email?.[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-medium">{user?.email}</h2>
              <p className="text-sm text-gray-600">
                {user?.is_verified ? "Verified Account" : "Email not verified"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium uppercase tracking-wide mb-4">
                Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-gray-200 rounded-[9px] p-4">
                  <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">
                    User ID
                  </p>
                  <p className="font-medium break-all">{user?.id}</p>
                </div>
                <div className="border-2 border-gray-200 rounded-[9px] p-4">
                  <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">
                    Account Created
                  </p>
                  <p className="font-medium">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {!user?.is_verified && (
        <Card hoverable={false}>
          <Alert
            type="warning"
            message="Your email is not verified. Please check your inbox for the verification link."
          />

          <div className="mt-4">
            <Button
              onClick={handleResendVerification}
              disabled={resendLoading}
              variant="primary"
            >
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </Button>
          </div>

          {resendStatus.success && (
            <Alert
              type="success"
              message={resendStatus.success}
              className="mt-4"
            />
          )}
          {resendStatus.error && (
            <Alert
              type="error"
              message={resendStatus.error}
              className="mt-4"
            />
          )}
        </Card>
      )}

      {/* Telegram Integration Section */}
      <TelegramIntegration />
    </div>
  );
}
