"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setLoading(true);
      await AuthService.forgotPassword(email);
      setSuccess(true);
      setEmail(""); // Clear the form
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={25}
              priority
            />
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-black/20 p-8 rounded-lg shadow-lg border border-black/[.08] dark:border-white/[.1]"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">
            Reset Your Password
          </h1>

          {success && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30 rounded-md">
              If an account exists with this email, you will receive password
              reset instructions.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-foreground text-background rounded-md hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/auth/login"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
