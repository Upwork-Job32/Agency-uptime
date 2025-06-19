"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface Subscription {
  id: string;
  plan_type: string;
  status: string;
  trial_start_date?: string;
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id: string | null;
  active_addons: string[];
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  isPro: boolean;
  isTrial: boolean;
  isExpired: boolean;
  canGenerateReports: boolean;
  canInviteTeam: boolean;
  canUseSlackAlerts: boolean;
  canUseAddons: boolean;
  canUseWhiteLabel: boolean;
  hasAddon: (addonId: string) => boolean;
  getTrialDaysRemaining: () => number;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/billing/subscription`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      } else {
        // If no subscription found, assume trial
        setSubscription({
          id: "trial",
          plan_type: "trial",
          status: "trialing",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          stripe_subscription_id: null,
          active_addons: [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
      // Default to trial on error
      setSubscription({
        id: "trial",
        plan_type: "trial",
        status: "trialing",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
        stripe_subscription_id: null,
        active_addons: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [isAuthenticated]);

  // Plan capabilities
  const isPro =
    subscription?.plan_type === "basic" && subscription?.status === "active";
  const isTrial =
    subscription?.plan_type === "trial" || subscription?.status === "trialing";
  const isExpired = subscription?.status === "expired";

  // Feature restrictions for trial users
  const canGenerateReports = isPro;
  const canInviteTeam = isPro;
  const canUseSlackAlerts = isPro;
  const canUseAddons = isPro;
  const canUseWhiteLabel = isPro;

  // Calculate trial days remaining
  const getTrialDaysRemaining = () => {
    if (!subscription?.trial_start_date || !isTrial) return 0;

    const startDate = new Date(subscription.trial_start_date);
    const daysSinceStart = Math.floor(
      (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, 15 - daysSinceStart);
  };

  const hasAddon = (addonId: string): boolean => {
    return subscription?.active_addons.includes(addonId) || false;
  };

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  const value: SubscriptionContextType = {
    subscription,
    isLoading,
    isPro,
    isTrial,
    isExpired,
    canGenerateReports,
    canInviteTeam,
    canUseSlackAlerts,
    canUseAddons,
    canUseWhiteLabel,
    hasAddon,
    getTrialDaysRemaining,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
