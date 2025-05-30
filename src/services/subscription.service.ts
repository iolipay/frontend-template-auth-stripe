import {
  UserSubscription,
  CreateCheckoutRequest,
  StripeCheckoutSession,
} from "@/types/subscription";
import { AuthService } from "./auth.service";
import { config } from "@/utils/config";

export class SubscriptionService {
  /**
   * Get current user's subscription details
   */
  static async getSubscription(): Promise<UserSubscription> {
    const token = AuthService.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${config.api.baseUrl}/subscription/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        AuthService.logout();
        throw new Error("Session expired. Please login again.");
      }
      throw new Error("Failed to fetch subscription data");
    }

    return response.json();
  }

  /**
   * Create Stripe checkout session for subscription upgrade
   */
  static async createCheckoutSession(
    request: CreateCheckoutRequest
  ): Promise<StripeCheckoutSession> {
    const token = AuthService.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${config.api.baseUrl}/subscription/create-checkout-session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof data.detail === "string"
          ? data.detail
          : "Failed to create checkout session";
      throw new Error(errorMessage);
    }

    return data;
  }

  /**
   * Handle upgrade to a specific plan
   */
  static async handleUpgrade(priceId: string): Promise<void> {
    try {
      const session = await this.createCheckoutSession({
        price_id: priceId,
        success_url: `${window.location.origin}${config.urls.successRedirect}`,
        cancel_url: `${window.location.origin}${config.urls.cancelRedirect}`,
      });

      if (session.checkout_url) {
        window.location.href = session.checkout_url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      throw error;
    }
  }

  /**
   * Get Stripe billing portal URL for subscription management
   */
  static async getManagePortalUrl(): Promise<{ url: string }> {
    const token = AuthService.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${config.api.baseUrl}/subscription/manage-portal`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof data.detail === "string"
          ? data.detail
          : "Failed to get billing portal URL";
      throw new Error(errorMessage);
    }

    return data;
  }

  /**
   * Handle redirect to Stripe billing portal
   */
  static async redirectToBillingPortal(): Promise<void> {
    try {
      const { url } = await this.getManagePortalUrl();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No billing portal URL received");
      }
    } catch (error) {
      console.error("Failed to redirect to billing portal:", error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(): Promise<{ message: string }> {
    const token = AuthService.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${config.api.baseUrl}/subscription/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof data.detail === "string"
          ? data.detail
          : "Failed to cancel subscription";
      throw new Error(errorMessage);
    }

    return data;
  }

  /**
   * Reactivate subscription
   */
  static async reactivateSubscription(): Promise<void> {
    const token = AuthService.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${config.api.baseUrl}/subscription/reactivate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      const errorMessage =
        typeof data.detail === "string"
          ? data.detail
          : "Failed to reactivate subscription";
      throw new Error(errorMessage);
    }
  }
}
