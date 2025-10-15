"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { UserResponse } from "@/types/auth";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    try {
      const user: UserResponse = await AuthService.getCurrentUser();

      if (!user.is_admin) {
        // Not an admin - redirect to regular dashboard
        console.warn("Access denied: User is not an admin");
        router.push("/dashboard?error=admin_only");
        return;
      }

      // User is admin
      setIsAuthorized(true);
    } catch (error) {
      console.error("Failed to check admin access:", error);
      // Auth error - redirect to login
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#003049] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 uppercase tracking-wide">
            Verifying Admin Access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
