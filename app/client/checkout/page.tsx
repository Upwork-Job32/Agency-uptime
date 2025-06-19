"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Loader2,
  CheckCircle,
  CreditCard,
  Shield,
  ArrowLeft,
} from "lucide-react";

interface PlanDetails {
  name: string;
  price: number;
  sites: number;
  features: string[];
}

interface AgencyBranding {
  id: number;
  name: string;
  logo_url?: string;
  brand_color?: string;
  pricing_settings?: {
    basic_plan: PlanDetails;
    standard_plan: PlanDetails;
    premium_plan: PlanDetails;
  };
}

export default function ClientCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [agency, setAgency] = useState<AgencyBranding | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!plan || !token) {
      setError("Missing plan or token information");
      setLoading(false);
      return;
    }

    fetchPlanDetails();
  }, [plan, token]);

  const fetchPlanDetails = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/client-auth/invitation/${token}`
      );

      if (response.ok) {
        const data = await response.json();
        setAgency(data.agency);

        // Get selected plan details
        const pricing = data.agency.pricing_settings || {
          basic_plan: {
            name: "Basic Monitoring",
            price: 29,
            sites: 5,
            features: [
              "24/7 uptime monitoring",
              "Email notifications",
              "Basic reporting",
            ],
          },
          standard_plan: {
            name: "Standard Monitoring",
            price: 59,
            sites: 15,
            features: [
              "Everything in Basic",
              "SMS notifications",
              "Advanced reporting",
              "SSL monitoring",
            ],
          },
          premium_plan: {
            name: "Premium Monitoring",
            price: 99,
            sites: 50,
            features: [
              "Everything in Standard",
              "Phone alerts",
              "Custom integrations",
              "Priority support",
            ],
          },
        };

        let planDetails = null;
        switch (plan) {
          case "basic":
            planDetails = pricing.basic_plan;
            break;
          case "standard":
            planDetails = pricing.standard_plan;
            break;
          case "premium":
            planDetails = pricing.premium_plan;
            break;
          default:
            setError("Invalid plan selected");
            return;
        }

        setSelectedPlan(planDetails);
      } else {
        setError("Failed to load plan details");
      }
    } catch (error) {
      console.error("Error fetching plan details:", error);
      setError("Failed to load plan details");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan || !token || !plan) return;

    setProcessing(true);
    setError(null);

    try {
      // First, complete user registration
      const registrationResponse = await fetch(
        `${API_BASE_URL}/api/client-auth/create-payment-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            plan_type: plan,
            plan_details: selectedPlan,
          }),
        }
      );

      if (registrationResponse.ok) {
        const data = await registrationResponse.json();

        // Redirect to Stripe Checkout
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          setError("Failed to create payment session");
        }
      } else {
        const error = await registrationResponse.json();
        setError(error.error || "Failed to create payment session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("Payment processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const goBack = () => {
    router.push(`/client/invite/${token}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading checkout...</span>
        </div>
      </div>
    );
  }

  if (error || !agency || !selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <span>{error || "Failed to load checkout"}</span>
            </div>
            <Button onClick={goBack} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const brandColor = agency.brand_color || "#3B82F6";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      style={{
        background: `linear-gradient(135deg, ${brandColor}10 0%, ${brandColor}05 100%)`,
      }}
    >
      {/* Header */}
      <div
        className="w-full py-6 text-white"
        style={{ backgroundColor: brandColor }}
      >
        <div className="container max-w-4xl mx-auto px-6">
          <div className="flex items-center space-x-4">
            {agency.logo_url && (
              <img
                src={agency.logo_url}
                alt={agency.name}
                className="h-10 object-contain"
              />
            )}
            <div>
              <h1 className="text-xl font-bold">{agency.name}</h1>
              <p className="text-white/90 text-sm">Secure Checkout</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle
                  className="h-5 w-5 mr-2"
                  style={{ color: brandColor }}
                />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Details */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
                  <Badge
                    variant={plan === "standard" ? "default" : "outline"}
                    style={
                      plan === "standard" ? { backgroundColor: brandColor } : {}
                    }
                  >
                    {plan === "basic"
                      ? "Basic"
                      : plan === "standard"
                      ? "Popular"
                      : "Premium"}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-3">
                  ${selectedPlan.price}
                  <span className="text-sm font-normal text-gray-600">
                    /month
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Monitor up to {selectedPlan.sites} websites
                </p>

                <div>
                  <h4 className="font-medium mb-2">Included Features:</h4>
                  <ul className="space-y-1">
                    {selectedPlan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Billing Info */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Monthly Subscription</span>
                  <span className="font-medium">${selectedPlan.price}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">First Month</span>
                  <span className="font-medium text-green-600">FREE TRIAL</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Today</span>
                    <span className="text-xl font-bold">$0.00</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your card will be charged ${selectedPlan.price} after your
                    30-day trial
                  </p>
                </div>
              </div>

              {/* Trial Benefits */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">
                  30-Day Free Trial Includes:
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Full access to all plan features</li>
                  <li>• No setup fees or hidden costs</li>
                  <li>• Cancel anytime during trial</li>
                  <li>• No commitment required</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard
                  className="h-5 w-5 mr-2"
                  style={{ color: brandColor }}
                />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Secure Payment Notice */}
              <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Secure Payment
                  </p>
                  <p className="text-xs text-blue-700">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="space-y-4">
                <h4 className="font-medium">Payment Method</h4>
                <p className="text-sm text-gray-600">
                  You&apos;ll be redirected to Stripe&apos;s secure payment page
                  to complete your subscription setup.
                </p>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Visa, Mastercard, American Express, and more
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handlePayment}
                  className="w-full"
                  style={{ backgroundColor: brandColor }}
                  disabled={processing}
                  size="lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Start Free Trial
                    </>
                  )}
                </Button>

                <Button
                  onClick={goBack}
                  variant="outline"
                  className="w-full"
                  disabled={processing}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Change Plan
                </Button>
              </div>

              {/* Terms */}
              <div className="text-xs text-gray-500 text-center">
                <p>
                  By continuing, you agree to {agency.name}&apos;s terms of
                  service and privacy policy. You can cancel your subscription
                  at any time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
