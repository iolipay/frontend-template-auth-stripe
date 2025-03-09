import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={25}
            priority
          />
        </div>

        <div className="bg-white dark:bg-black/20 p-8 rounded-lg shadow-lg border border-black/[.08] dark:border-white/[.1]">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome</h1>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className="w-full flex items-center justify-center px-4 py-2 rounded-md border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
            >
              Register
            </Link>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Protected by industry standard encryption</p>
      </footer>
    </div>
  );
}
