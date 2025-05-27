export type SubscriptionPlan = "free" | "pro" | "premium";

export interface UserSubscription {
  subscription_plan: SubscriptionPlan;
  subscription_status: "active" | "inactive" | "canceled" | "past_due";
  current_period_end?: string;
  cancel_at_period_end?: boolean;
}

export interface StripeCheckoutSession {
  checkout_url: string;
  session_id: string;
}

export interface CreateCheckoutRequest {
  price_id: string;
  success_url?: string;
  cancel_url?: string;
}

export interface PlanDetails {
  name: string;
  price: number;
  priceId: string;
  features: string[];
  recommended?: boolean;
}

export const PLAN_CONFIGS: Record<SubscriptionPlan, PlanDetails> = {
  free: {
    name: "Free",
    price: 0,
    priceId: "",
    features: [
      "Basic dashboard access",
      "Limited features",
      "Community support",
    ],
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: "price_1RTTLOPSkxSyOwymnX2URZid", // Replace with actual Stripe price ID
    features: [
      "Full dashboard access",
      "Pro features unlocked",
      "Email support",
      "Advanced analytics",
    ],
    recommended: true,
  },
  premium: {
    name: "Premium",
    price: 49,
    priceId: "price_1RTTLkPSkxSyOwymwyO4cVgC", // Replace with actual Stripe price ID
    features: [
      "All Pro features",
      "Premium-only content",
      "Priority support",
      "Custom integrations",
      "Advanced reporting",
    ],
  },
};

export const ROUTE_ACCESS: Record<string, SubscriptionPlan[]> = {
  "/dashboard": ["free", "pro", "premium"],
  "/subscription/free": ["free", "pro", "premium"],
  "/subscription/pro": ["pro", "premium"],
  "/subscription/premium": ["premium"],
};
