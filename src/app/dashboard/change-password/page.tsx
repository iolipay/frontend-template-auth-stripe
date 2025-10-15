"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export default function ChangePassword() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await AuthService.changePassword(currentPassword, newPassword);
      setSuccess(true);
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium uppercase tracking-wide">
            Change Password
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-sm shadow-lg border-2 border-gray-200"
        >
          {success && (
            <Alert
              type="success"
              message="Password changed successfully!"
            />
          )}

          {error && <Alert type="error" message={error} />}

          <div className="space-y-4">
            <Input
              id="currentPassword"
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                onClick={() => router.back()}
                variant="secondary"
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="flex-1"
              >
                {loading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
