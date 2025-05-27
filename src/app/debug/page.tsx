"use client";

import { useState } from "react";
import { AuthService } from "@/services/auth.service";

export default function DebugPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testTokenRetrieval = () => {
    addResult("=== Testing Token Retrieval ===");
    const token = AuthService.getToken();
    addResult(`Token found: ${!!token}`);
    if (token) {
      addResult(`Token length: ${token.length}`);
      addResult(`Token preview: ${token.substring(0, 20)}...`);
    }

    const refreshToken = AuthService.getRefreshToken();
    addResult(`Refresh token found: ${!!refreshToken}`);

    const expiry = AuthService.getTokenExpiry();
    addResult(`Token expiry found: ${!!expiry}`);
    if (expiry) {
      addResult(`Token expiry: ${expiry.toISOString()}`);
      addResult(`Token expired: ${AuthService.isTokenExpired()}`);
    }
  };

  const testCurrentUser = async () => {
    addResult("=== Testing Current User ===");
    try {
      const user = await AuthService.getCurrentUser();
      addResult(`User data retrieved: ${JSON.stringify(user)}`);
    } catch (error) {
      addResult(
        `Error getting user: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>

      <div className="space-y-4 mb-6">
        <button
          onClick={testTokenRetrieval}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Token Retrieval
        </button>

        <button
          onClick={testCurrentUser}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Current User
        </button>

        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Results:</h2>
        <div className="space-y-1 font-mono text-sm">
          {testResults.map((result, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
