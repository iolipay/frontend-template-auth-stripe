import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <main className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={60}
            height={60}
            priority
          />
        </div>

        <div className="bg-white p-8 rounded-[9px] shadow-lg border-2 border-gray-200">
          <h1 className="text-2xl font-medium mb-6 text-center uppercase tracking-wide">
            Welcome
          </h1>

          <div className="space-y-4">
            <Link href="/auth/login" className="block">
              <Button variant="primary" fullWidth>
                Login
              </Button>
            </Link>

            <Link href="/auth/register" className="block">
              <Button variant="secondary" fullWidth>
                Register
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-[#4e35dc] hover:underline font-medium transition-colors duration-200"
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
