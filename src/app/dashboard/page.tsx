"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import type { UserResponse } from "@/types/auth";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="bg-white dark:bg-black/20 p-6 rounded-lg shadow-lg border border-black/[.08] dark:border-white/[.1]">
      <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400">
        This is your personal dashboard where you can manage your account and
        view your information.
      </p>
    </div>
  );
}
