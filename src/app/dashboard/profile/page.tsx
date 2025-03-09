"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import type { UserResponse } from "@/types/auth";

export default function Profile() {
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  return (
    <div className="bg-white dark:bg-black/20 p-6 rounded-lg shadow-lg border border-black/[.08] dark:border-white/[.1]">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

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
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Your email is not verified. Please check your inbox for the
                verification link.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
