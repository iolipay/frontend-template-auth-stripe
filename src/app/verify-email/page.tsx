"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Invalid verification link");
      return;
    }

    const verifyEmail = async () => {
      try {
        await AuthService.verifyEmail(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Verification failed");
      }
    };

    verifyEmail();
  }, [token]);

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

        <div className="bg-white dark:bg-black/20 p-8 rounded-lg shadow-lg border border-black/[.08] dark:border-white/[.1]">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Email Verification
          </h1>

          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verifying your email...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mb-4 p-3 text-sm text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30 rounded-md">
                Your email has been verified successfully!
              </div>
              <Link
                href="/auth/login"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Click here to login
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-md">
                {error || "Verification failed"}
              </div>
              <Link
                href="/auth/login"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
