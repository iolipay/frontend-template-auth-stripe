import { AuthService } from "@/services/auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Add authorization header if token exists
  const token = AuthService.getToken();
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    // Clear auth data
    AuthService.logout();

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }

    throw new Error("Unauthorized - Please log in again");
  }

  return response;
}

// Stream version that returns the body directly
export async function apiStreamFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<ReadableStream<Uint8Array> | null> {
  const response = await apiFetch(endpoint, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.body;
}
