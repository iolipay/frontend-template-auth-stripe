"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import type { UserResponse } from "@/types/auth";

interface NavbarProps {
  user: UserResponse | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await AuthService.logout();
    router.push("/auth/login");
  };

  return (
    <nav className="bg-white dark:bg-black/20 border-b border-black/[.08] dark:border-white/[.1] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-bold hover:text-gray-700 dark:hover:text-gray-300"
            >
              Dashboard
            </Link>
          </div>

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
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-100 dark:border-gray-700">
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
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
