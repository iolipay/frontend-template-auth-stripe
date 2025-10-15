"use client";

import Link from "next/link";
import Image from "next/image";
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
    <nav className="bg-[#003049] border-b-2 border-black py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and App Name */}
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
              Smallbusiness
            </span>
          </Link>

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
    </nav>
  );
}
