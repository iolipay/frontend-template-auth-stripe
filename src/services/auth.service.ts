import { UserCreate, UserResponse } from "@/types/auth";

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

  static async login(
    email: string,
    password: string
  ): Promise<{ access_token: string }> {
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

    return responseData;
  }
}
