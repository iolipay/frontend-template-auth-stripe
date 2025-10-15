"use client";

import Link from "next/link";
import Image from "next/image";
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
        return "bg-blue-100 text-blue-800 border-2 border-blue-200";
      case "premium":
        return "bg-purple-100 text-purple-800 border-2 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-2 border-gray-200";
    }
  };

  return (
    <nav className="bg-[#003049] border-b-2 border-black py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                priority
                className="hover:opacity-80 transition-opacity duration-200"
              />
              <span className="text-xl font-medium text-white uppercase tracking-wide hover:text-[#4e35dc] transition-colors duration-200">
                Dashboard
              </span>
            </Link>
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-2 text-white hover:text-[#4e35dc] transition-colors duration-200"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span className="font-medium text-sm uppercase tracking-wide">Chat</span>
            </Link>

            {/* Subscription Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/subscription/free"
                className="text-sm font-medium text-white uppercase tracking-wide hover:text-[#4e35dc] transition-colors duration-200"
              >
                Free
              </Link>
              <Link
                href="/subscription/pro"
                className="text-sm font-medium text-white uppercase tracking-wide hover:text-[#4e35dc] transition-colors duration-200"
              >
                Pro
              </Link>
              <Link
                href="/subscription/premium"
                className="text-sm font-medium text-white uppercase tracking-wide hover:text-[#4e35dc] transition-colors duration-200"
              >
                Premium
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Plan Badge */}
            <div
              className={`px-3 py-1 rounded-[1px] text-xs font-medium uppercase tracking-wide hidden sm:block ${getPlanBadgeColor(
                currentPlan
              )}`}
            >
              {PLAN_CONFIGS[currentPlan].name}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-white border-2 border-[#4e35dc] flex items-center justify-center">
                  <span className="text-sm font-medium text-[#003049]">
                    {user?.email?.[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-white hidden sm:inline">
                  {user?.email}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 py-2 bg-white rounded-[9px] shadow-lg border-2 border-gray-200">
                  <div className="px-4 py-2 border-b-2 border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Current Plan
                    </p>
                    <p className="text-sm font-medium text-[#003049] uppercase tracking-wide">
                      {PLAN_CONFIGS[currentPlan].name}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#4e35dc] transition-colors duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/change-password"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#4e35dc] transition-colors duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Change Password
                  </Link>

                  {/* Subscription Links in Mobile */}
                  <div className="md:hidden border-t-2 border-gray-200 mt-2 pt-2">
                    <p className="px-4 py-1 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Subscription Plans
                    </p>
                    <Link
                      href="/subscription/free"
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#4e35dc] transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Free Features
                    </Link>
                    <Link
                      href="/subscription/pro"
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#4e35dc] transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Pro Features
                    </Link>
                    <Link
                      href="/subscription/premium"
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#4e35dc] transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Premium Features
                    </Link>
                  </div>

                  <div className="border-t-2 border-gray-200 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
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
