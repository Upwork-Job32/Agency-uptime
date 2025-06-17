"use client";

import React, { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentFormProps {
  planType: string;
  selectedAddons: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentFormInner: React.FC<PaymentFormProps> = ({
  planType,
  selectedAddons,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTotal = () => {
    let total = 0;

    if (planType === "basic") {
      total += 50; // Base plan $50
    }

    selectedAddons.forEach((addon) => {
      switch (addon) {
        case "pdf_reports":
          total += 29;
          break;
        case "status_pages":
          total += 19;
          break;
        case "resell_dashboard":
          total += 49;
          break;
      }
    });

    return total;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      // Create checkout session
      const response = await fetch(
        "http://localhost:5000/api/billing/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan_type: planType,
            addons: selectedAddons,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Payment Error",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAddonName = (addon: string) => {
    switch (addon) {
      case "pdf_reports":
        return "PDF Reports";
      case "status_pages":
        return "Status Pages";
      case "resell_dashboard":
        return "Resell Dashboard";
      default:
        return addon;
    }
  };

  const getAddonPrice = (addon: string) => {
    switch (addon) {
      case "pdf_reports":
        return 29;
      case "status_pages":
        return 19;
      case "resell_dashboard":
        return 49;
      default:
        return 0;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Your Purchase
        </CardTitle>
        <CardDescription>Review your plan and complete payment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="space-y-4">
          <h3 className="font-semibold">Order Summary</h3>

          {/* Base Plan */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Professional Plan</span>
              <p className="text-sm text-gray-600">
                Unlimited sites, 1-minute checks
              </p>
            </div>
            <span className="font-semibold">$50/mo</span>
          </div>

          {/* Add-ons */}
          {selectedAddons.map((addon) => (
            <div key={addon} className="flex items-center justify-between">
              <div>
                <span className="font-medium">{getAddonName(addon)}</span>
                <Badge variant="secondary" className="ml-2">
                  Add-on
                </Badge>
              </div>
              <span className="font-semibold">${getAddonPrice(addon)}/mo</span>
            </div>
          ))}

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>${calculateTotal()}/month</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Card Information
            </label>
            <div className="border rounded-md p-3">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#334155",
                      "::placeholder": {
                        color: "#94a3b8",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Subscribe ${calculateTotal()}/mo
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center">
          <p>Secure payment powered by Stripe</p>
          <p>You can cancel anytime from your billing settings</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return <PaymentFormInner {...props} />;
};
