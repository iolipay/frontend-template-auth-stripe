"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import type { UserResponse } from "@/types/auth";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

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
    <div className="bg-white dark:bg-black/20 p-6 rounded-lg shadow-lg border border-black/[.08] dark:border-white/[.1]">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            user?.is_verified
              ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
              : "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
          }`}
        >
          {user?.is_verified ? (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              <span>Verified</span>
            </>
          ) : (
            <>
              <ExclamationCircleIcon className="w-5 h-5" />
              <span>Not Verified</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-2xl font-medium">
              {user?.email?.[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.email}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user?.is_verified ? "Verified Account" : "Email not verified"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Account Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  User ID
                </p>
                <p className="font-medium">{user?.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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

          {!user?.is_verified && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md">
              <div className="flex flex-col gap-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Your email is not verified. Please check your inbox for the
                  verification link.
                </p>
                <button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="self-start px-4 py-2 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? "Sending..." : "Resend Verification Email"}
                </button>
                {resendStatus.success && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {resendStatus.success}
                  </p>
                )}
                {resendStatus.error && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {resendStatus.error}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
