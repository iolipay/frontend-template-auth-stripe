"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to transactions page
    router.replace("/dashboard/transactions");
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003049] mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
