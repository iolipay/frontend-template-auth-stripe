"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

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
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={60}
              height={60}
              priority
            />
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-sm shadow-lg border-2 border-gray-200"
        >
          <h1 className="text-2xl font-medium mb-6 text-center uppercase tracking-wide">
            Reset Your Password
          </h1>

          {success && (
            <Alert
              type="success"
              message="If an account exists with this email, you will receive password reset instructions."
            />
          )}

          {error && <Alert type="error" message={error} />}

          <div className="space-y-4">
            <Input
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              disabled={loading}
              fullWidth
              variant="primary"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/auth/login"
              className="text-accent hover:underline font-medium"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
