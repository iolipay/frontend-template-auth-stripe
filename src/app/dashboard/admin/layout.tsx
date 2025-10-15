"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { AuthService } from "@/services/auth.service";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await AuthService.logout();
    router.push("/auth/login");
  };

  const navItems = [
    {
      href: "/dashboard/admin",
      label: "Dashboard",
      icon: "📊",
      exact: true,
    },
    {
      href: "/dashboard/admin/queue",
      label: "Filing Queue",
      icon: "📋",
    },
    {
      href: "/dashboard/admin/declarations",
      label: "All Declarations",
      icon: "📄",
    },
    {
      href: "/dashboard/admin/users",
      label: "All Users",
      icon: "👥",
    },
  ];

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <nav className="bg-[#003049] text-white shadow-lg">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-white hover:text-gray-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h1 className="text-xl font-medium uppercase tracking-wide">
                  Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm hover:text-gray-200 transition-colors duration-200"
                >
                  View as User
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-[1px] border-2 border-white/20 uppercase tracking-wide font-medium transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r-2 border-gray-200 transition-transform duration-300 ease-in-out`}
          >
            <div className="h-full overflow-y-auto py-6">
              <nav className="px-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[1px] transition-all duration-200 ${
                      isActive(item.href, item.exact)
                        ? "bg-[#003049] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium uppercase tracking-wide text-sm">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Help Section */}
              <div className="mt-8 px-4">
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-[9px]">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-blue-900 mb-2">
                    Admin Guide
                  </h3>
                  <p className="text-xs text-blue-800 mb-3">
                    Manage user declarations and file on RS.ge
                  </p>
                  <Link
                    href="/admin/guide"
                    className="text-xs text-[#4e35dc] hover:underline font-medium"
                  >
                    View Documentation →
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </ProtectedAdminRoute>
  );
}
