"use client";

import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function TestAuth() {
  const router = useRouter();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults((prev) => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[${timestamp}] ${message}`);
  };

  const testLogin = async () => {
    setResults([]);
    addResult("🚀 Starting login test...");

    try {
      addResult(`Attempting login with email: ${email}`);
      const response = await AuthService.login(email, password);
      addResult(`✅ Login successful!`);
      addResult(`Response: ${JSON.stringify(response, null, 2)}`);

      // Test token retrieval
      addResult("🔍 Testing token retrieval...");
      const token = AuthService.getToken();
      addResult(`Token retrieved: ${!!token}`);

      if (token) {
        addResult(`Token length: ${token.length} characters`);
        addResult(`Token preview: ${token.substring(0, 50)}...`);

        // Test current user
        addResult("👤 Testing current user retrieval...");
        try {
          const user = await AuthService.getCurrentUser();
          addResult(`✅ User data retrieved: ${JSON.stringify(user, null, 2)}`);

          // Navigate to dashboard
          addResult("🏠 Attempting to navigate to dashboard...");
          router.push("/dashboard");
        } catch (userError) {
          addResult(
            `❌ Failed to get user data: ${
              userError instanceof Error ? userError.message : String(userError)
            }`
          );
        }
      } else {
        addResult("❌ No token found after login!");
      }
    } catch (error) {
      addResult(
        `❌ Login failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const testTokenRetrieval = () => {
    addResult("🔍 Testing token retrieval without login...");
    const token = AuthService.getToken();
    addResult(`Token exists: ${!!token}`);

    if (token) {
      addResult(`Token length: ${token.length} characters`);
      addResult(`Token preview: ${token.substring(0, 50)}...`);
    }
  };

  const clearCookies = () => {
    addResult("🧹 Clearing all cookies...");
    AuthService.logout();
    addResult("Cookies cleared");
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Authentication Test Lab</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Login Test</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={testLogin}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              🔐 Test Login Flow
            </button>

            <button
              onClick={testTokenRetrieval}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              🔍 Check Current Token
            </button>

            <button
              onClick={clearCookies}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              🧹 Clear Cookies
            </button>

            <button
              onClick={clearResults}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              🗑️ Clear Results
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500 italic">
                No test results yet. Click a test button to start.
              </p>
            ) : (
              <div className="space-y-1 font-mono text-sm">
                {results.map((result, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Testing Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Enter valid credentials for your backend</li>
          <li>
            Click &quot;Test Login Flow&quot; to see the complete authentication
            process
          </li>
          <li>
            Check the console in browser dev tools for additional debugging info
          </li>
          <li>
            If login succeeds but dashboard redirect fails, check the results
            for clues
          </li>
          <li>
            Use &quot;Check Current Token&quot; to verify if tokens persist
            between page loads
          </li>
        </ol>
      </div>
    </div>
  );
}
