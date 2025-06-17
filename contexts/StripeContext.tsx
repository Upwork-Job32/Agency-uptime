"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

interface StripeContextType {
  stripe: Stripe | null;
  isLoading: boolean;
  publishableKey: string | null;
}

const StripeContext = createContext<StripeContextType>({
  stripe: null,
  isLoading: true,
  publishableKey: null,
});

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error("useStripe must be used within a StripeProvider");
  }
  return context;
};

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Fetch Stripe config from backend
        const response = await fetch(
          "http://localhost:5000/api/billing/config"
        );
        const config = await response.json();

        if (config.publishableKey) {
          setPublishableKey(config.publishableKey);
          const stripeInstance = await loadStripe(config.publishableKey);
          setStripe(stripeInstance);
        }
      } catch (error) {
        console.error("Failed to initialize Stripe:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStripe();
  }, []);

  return (
    <StripeContext.Provider value={{ stripe, isLoading, publishableKey }}>
      {children}
    </StripeContext.Provider>
  );
};
