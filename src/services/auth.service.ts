import { UserCreate, UserResponse, TokenResponse } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class AuthService {
  static async register(data: UserCreate): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // For both 400 and 422 errors, we want to show the error message
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : Array.isArray(responseData.detail)
          ? responseData.detail[0]?.msg
          : "Registration failed";

      throw new Error(errorMessage);
    }

    return responseData;
  }

  static async login(email: string, password: string): Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : Array.isArray(responseData.detail)
          ? responseData.detail[0]?.msg
          : "Login failed";

      throw new Error(errorMessage);
    }

    // Debug: Log the response to see what we're getting from the backend
    console.log("Login response data:", responseData);

    // Store tokens in cookies
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = `path=/; ${
      isProduction ? "secure; " : ""
    }samesite=strict`;

    console.log("Setting cookies with options:", cookieOptions);
    console.log("Access token exists:", !!responseData.access_token);

    if (responseData.access_token) {
      document.cookie = `token=${responseData.access_token}; max-age=86400; ${cookieOptions}`;
      console.log("Set access token cookie");
    }

    if (responseData.refresh_token) {
      document.cookie = `refresh_token=${responseData.refresh_token}; max-age=2592000; ${cookieOptions}`;
      console.log("Set refresh token cookie");
    }

    if (responseData.expires_at) {
      document.cookie = `token_expiry=${responseData.expires_at}; max-age=86400; ${cookieOptions}`;
      console.log("Set token expiry cookie");
    }

    return responseData;
  }

  static async logout(): Promise<void> {
    try {
      // Note: Backend doesn't have a logout endpoint according to OpenAPI spec
      // So we just clear the tokens locally
      console.log("Logging out user - clearing local tokens");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear all tokens
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "token_expiry=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  static async refreshToken(): Promise<boolean> {
    console.warn(
      "Refresh token endpoint not available in backend - cannot refresh token"
    );
    // Since the backend doesn't have a refresh endpoint according to OpenAPI spec,
    // we'll just return false to indicate refresh failed
    return false;
  }

  static async getCurrentUser(): Promise<UserResponse> {
    const token = AuthService.getToken();

    if (!token) {
      console.error("No token found in cookies");
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: include cookies in the request
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch user:",
        response.status,
        response.statusText
      );
      if (response.status === 401) {
        // Clear invalid token
        AuthService.logout();
        throw new Error("Session expired. Please login again.");
      }
      throw new Error("Failed to fetch user data");
    }

    return response.json();
  }

  static getToken(): string | null {
    try {
      console.log("All cookies:", document.cookie);
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const token = cookie ? cookie.split("=")[1] : null;
      console.log("Found token cookie:", !!token);
      return token;
    } catch (error) {
      console.error("Error reading token from cookie:", error);
      return null;
    }
  }

  static getRefreshToken(): string | null {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refresh_token="));
      const token = cookie ? cookie.split("=")[1] : null;
      return token;
    } catch (error) {
      console.error("Error reading refresh token from cookie:", error);
      return null;
    }
  }

  static getTokenExpiry(): Date | null {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token_expiry="));
      const expiryStr = cookie ? cookie.split("=")[1] : null;
      return expiryStr ? new Date(expiryStr) : null;
    } catch (error) {
      console.error("Error reading token expiry from cookie:", error);
      return null;
    }
  }

  static isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;

    // Add a buffer of 30 seconds to refresh before actual expiration
    const buffer = 30 * 1000; // 30 seconds in milliseconds
    return expiry.getTime() - buffer < Date.now();
  }

  static async forgotPassword(email: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/auth/forgot-password?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : Array.isArray(responseData.detail)
          ? responseData.detail[0]?.msg
          : "Failed to send reset email";

      throw new Error(errorMessage);
    }
  }

  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    const response = await fetch(
      `${API_URL}/auth/reset-password/${encodeURIComponent(
        token
      )}?new_password=${encodeURIComponent(newPassword)}`,
      {
        method: "POST",
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : Array.isArray(responseData.detail)
          ? responseData.detail[0]?.msg
          : "Failed to reset password";

      throw new Error(errorMessage);
    }
  }

  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : Array.isArray(responseData.detail)
          ? responseData.detail[0]?.msg
          : "Failed to change password";

      throw new Error(errorMessage);
    }
  }

  static async verifyEmail(token: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/auth/verify/${encodeURIComponent(token)}`,
      {
        method: "GET",
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : Array.isArray(responseData.detail)
          ? responseData.detail[0]?.msg
          : "Email verification failed";

      throw new Error(errorMessage);
    }
  }

  static async resendVerification(email: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/auth/resend-verification?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : Array.isArray(responseData.detail)
          ? responseData.detail[0]?.msg
          : "Failed to resend verification email";

      throw new Error(errorMessage);
    }
  }
}
