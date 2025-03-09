"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import type { UserResponse } from "@/types/auth";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white dark:bg-black/20 p-6 rounded-lg shadow-lg border border-black/[.08] dark:border-white/[.1]">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
          <div className="space-y-2">
            <p>Account Details:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>User ID: {user?.id}</li>
              <li>Email Verified: {user?.is_verified ? "Yes" : "No"}</li>
              <li>
                Account Created:{" "}
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "N/A"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
