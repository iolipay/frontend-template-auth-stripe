"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
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
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-foreground text-background rounded-md hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
            >
              Sign In
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
