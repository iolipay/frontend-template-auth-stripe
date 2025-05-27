"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import type { UserResponse } from "@/types/auth";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { usePlan } from "@/contexts/SubscriptionContext";
import { PLAN_CONFIGS } from "@/types/subscription";

interface NavbarProps {
  user: UserResponse | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentPlan = usePlan();

  const handleLogout = async () => {
    await AuthService.logout();
    router.push("/auth/login");
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "pro":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "premium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <nav className="bg-white dark:bg-black/20 border-b border-black/[.08] dark:border-white/[.1] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-xl font-bold hover:text-gray-700 dark:hover:text-gray-300"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span>Chat</span>
            </Link>

            {/* Subscription Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/subscription/free"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Free
              </Link>
              <Link
                href="/subscription/pro"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Pro
              </Link>
              <Link
                href="/subscription/premium"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Premium
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Plan Badge */}
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium hidden sm:block ${getPlanBadgeColor(
                currentPlan
              )}`}
            >
              {PLAN_CONFIGS[currentPlan].name}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.email?.[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                  {user?.email}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-100 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Current Plan
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {PLAN_CONFIGS[currentPlan].name}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/change-password"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Change Password
                  </Link>

                  {/* Subscription Links in Mobile */}
                  <div className="md:hidden border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                    <p className="px-4 py-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Subscription Plans
                    </p>
                    <Link
                      href="/subscription/free"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Free Features
                    </Link>
                    <Link
                      href="/subscription/pro"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Pro Features
                    </Link>
                    <Link
                      href="/subscription/premium"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Premium Features
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
