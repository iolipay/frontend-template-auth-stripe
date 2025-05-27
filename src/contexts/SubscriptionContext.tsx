"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { SubscriptionPlan, UserSubscription } from "@/types/subscription";
import { SubscriptionService } from "@/services/subscription.service";
import { AuthService } from "@/services/auth.service";

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  hasAccess: (requiredPlans: SubscriptionPlan[]) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      const token = AuthService.getToken();
      if (!token) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      const subscriptionData = await SubscriptionService.getSubscription();
      setSubscription(subscriptionData);
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load subscription"
      );
      // Set default free plan if fetch fails
      setSubscription({
        subscription_plan: "free",
        subscription_status: "active",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = (requiredPlans: SubscriptionPlan[]): boolean => {
    if (!subscription) return false;
    return requiredPlans.includes(subscription.subscription_plan);
  };

  useEffect(() => {
    refreshSubscription();
  }, []);

  const value: SubscriptionContextType = {
    subscription,
    loading,
    error,
    refreshSubscription,
    hasAccess,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}

// Hook for getting current plan
export function usePlan(): SubscriptionPlan {
  const { subscription } = useSubscription();
  return subscription?.subscription_plan || "free";
}

// Hook for checking access to specific plans
export function useHasAccess(requiredPlans: SubscriptionPlan[]): boolean {
  const { hasAccess } = useSubscription();
  return hasAccess(requiredPlans);
}
