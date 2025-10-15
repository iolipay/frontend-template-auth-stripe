"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export default function ResetPassword({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Use React's use() hook to unwrap the promise
  const { token } = use(params);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await AuthService.resetPassword(token, password);
      router.push("/auth/login?reset=success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
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
              src="/next.svg"
              alt="Logo"
              width={120}
              height={25}
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

          {error && <Alert type="error" message={error} />}

          <div className="space-y-4">
            <Input
              id="password"
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              disabled={loading}
              fullWidth
              variant="primary"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
