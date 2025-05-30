import { AuthService } from "@/services/auth.service";
import { config } from "./config";

// Track if a token refresh is in progress
let isRefreshing = false;
// Store pending requests that are waiting for token refresh
let pendingRequests: (() => void)[] = [];

// Helper to process pending requests after token refresh
const processPendingRequests = () => {
  pendingRequests.forEach((callback) => callback());
  pendingRequests = [];
};

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Check if token is expired and refresh if needed
  if (AuthService.getToken() && AuthService.isTokenExpired()) {
    await refreshTokenAndRetry();
  }

  // Add authorization header if token exists
  const token = AuthService.getToken();
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      // Try to refresh the token
      const refreshed = await refreshTokenAndRetry();

      if (refreshed) {
        // Retry the original request with new token
        return apiFetch(endpoint, options);
      } else {
        // If refresh failed, logout and redirect
        AuthService.logout();
        if (typeof window !== "undefined") {
          window.location.href = config.urls.loginRedirect;
        }
        throw new Error("Unauthorized - Please log in again");
      }
    }

    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

async function refreshTokenAndRetry(): Promise<boolean> {
  // If already refreshing, wait for it to complete
  if (isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push(() => resolve(true));
    });
  }

  isRefreshing = true;

  try {
    const success = await AuthService.refreshToken();
    isRefreshing = false;

    if (success) {
      processPendingRequests();
      return true;
    }

    return false;
  } catch (error) {
    console.error("Token refresh failed:", error);
    isRefreshing = false;
    return false;
  }
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
