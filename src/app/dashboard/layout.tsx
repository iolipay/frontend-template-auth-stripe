"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import type { UserResponse } from "@/types/auth";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if current route is admin route
  const isAdminRoute = pathname?.startsWith("/dashboard/admin");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user data:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  // If admin route, don't wrap with regular dashboard layout
  // Admin layout handles its own navigation
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Regular dashboard layout with navbar
  return (
    <div>
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
