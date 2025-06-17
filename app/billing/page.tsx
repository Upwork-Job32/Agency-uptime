"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Elements } from "@stripe/react-stripe-js";
import { useStripe } from "@/contexts/StripeContext";
import { PaymentForm } from "@/components/PaymentForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Star,
  CreditCard,
  Loader2,
  ArrowLeft,
  Zap,
  FileText,
  Users,
  Globe,
  Shield,
  BarChart3,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface Subscription {
  id: string;
  plan_type: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id: string | null;
  active_addons: string[];
}

const plans = [
  {
    name: "Trial",
    price: "$0",
    period: "14 days",
    description: "Perfect for trying out Agency Uptime",
    features: [
      "Up to 3 sites monitoring",
      "5-minute check intervals",
      "Basic email alerts",
      "Dashboard access",
      "Basic uptime reporting",
    ],
    restrictions: [
      "No PDF report generation",
      "No team invitations",
      "No Slack/webhook alerts",
      "No white-label options",
    ],
    current: true,
    planType: "trial",
  },
  {
    name: "Professional",
    price: "$50",
    period: "per month",
    description: "Perfect for agencies managing client websites",
    features: [
      "Up to 1000 sites monitoring",
      "1-minute check intervals",
      "Email & Slack alerts",
      "Team collaboration",
      "PDF report generation",
      "Custom domain support",
      "White-label reports",
      "Priority support",
    ],
    popular: true,
    planType: "basic",
  },
];

const addons = [
  {
    name: "PDF Reports",
    description: "Monthly branded PDF reports for your clients",
    price: "$29/month",
    id: "pdf_reports",
    icon: FileText,
    features: [
      "Automated monthly reports",
      "Custom branding",
      "Email delivery",
      "Historical data analysis",
    ],
  },
  {
    name: "Status Pages",
    description: "Public status pages for your clients to view",
    price: "$19/month",
    id: "status_pages",
    icon: Globe,
    features: [
      "Public status pages",
      "Custom domains",
      "Incident management",
      "Subscriber notifications",
    ],
  },
  {
    name: "Resell Dashboard",
    description: "White-labeled client dashboard access",
    price: "$49/month",
    id: "resell_dashboard",
    icon: Users,
    features: [
      "Client portal access",
      "White-label branding",
      "Multi-user management",
      "Custom permissions",
    ],
  },
];

export default function Billing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { stripe, isLoading: stripeLoading } = useStripe();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/billing/subscription",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        setSelectedAddons(data.subscription.active_addons || []);
      } else {
        console.error(
          "Failed to fetch subscription:",
          response.status,
          response.statusText
        );

        // Set default trial subscription on error
        const defaultTrialSubscription = {
          id: "trial",
          plan_type: "trial",
          status: "trialing",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          stripe_subscription_id: null,
          active_addons: [],
        };
        setSubscription(defaultTrialSubscription);
        setSelectedAddons([]);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);

      // Set default trial subscription on network error
      const defaultTrialSubscription = {
        id: "trial",
        plan_type: "trial",
        status: "trialing",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
        stripe_subscription_id: null,
        active_addons: [],
      };
      setSubscription(defaultTrialSubscription);
      setSelectedAddons([]);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleUpgrade = async (planType: string) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();
      window.open(data.checkout_url, "_blank");

      toast({
        title: "Redirecting to Payment",
        description: "You will be redirected to complete your payment.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    let total = 50; // Base plan price
    selectedAddons.forEach((addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      if (addon) {
        total += parseInt(addon.price.replace(/\D/g, ""));
      }
    });
    return total;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Logo className="h-8 w-8" />
                  <span className="text-2xl font-bold text-gray-900">
                    Agency Uptime
                  </span>
                </div>
                <Badge className="bg-indigo-100 text-indigo-800">Billing</Badge>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Current Plan Status */}
          {subscription && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="capitalize">
                      Current Plan:{" "}
                      {subscription.plan_type === "basic"
                        ? "Professional"
                        : subscription.plan_type}
                    </CardTitle>
                    <CardDescription>
                      {subscription.status === "trialing"
                        ? "You are currently on a free trial"
                        : "Your active subscription"}
                    </CardDescription>
                  </div>
                  <Badge
                    className={
                      subscription.status === "active"
                        ? "bg-green-100 text-green-800"
                        : subscription.status === "trialing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {subscription.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* Plans */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h1>
              <p className="text-xl text-gray-600">
                Upgrade to unlock powerful monitoring features for your agency
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative ${
                    plan.popular
                      ? "ring-2 ring-indigo-500 shadow-lg"
                      : plan.current
                      ? "ring-2 ring-blue-300"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-indigo-600 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {plan.current && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">
                        Current Plan
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.restrictions &&
                        plan.restrictions.map((restriction, index) => (
                          <div key={index} className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-500">
                              {restriction}
                            </span>
                          </div>
                        ))}
                    </div>
                    {!plan.current && (
                      <Button
                        onClick={() => handleUpgrade(plan.planType)}
                        disabled={isLoading}
                        className="w-full mt-6"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CreditCard className="h-4 w-4 mr-2" />
                        )}
                        Upgrade to {plan.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add-ons Section */}
          {subscription?.status !== "trialing" && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Add-ons
                </h2>
                <p className="text-gray-600">
                  Enhance your plan with powerful additional features
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {addons.map((addon) => (
                  <Card
                    key={addon.id}
                    className={`cursor-pointer transition-all ${
                      selectedAddons.includes(addon.id)
                        ? "ring-2 ring-indigo-500 shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <CardHeader className="text-center">
                      <addon.icon className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                      <CardTitle className="text-lg">{addon.name}</CardTitle>
                      <div className="text-2xl font-bold text-gray-900">
                        {addon.price}
                      </div>
                      <CardDescription>{addon.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {addon.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        {selectedAddons.includes(addon.id) ? (
                          <Badge className="bg-green-100 text-green-800">
                            Selected
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Add to Plan
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedAddons.length > 0 && (
                <Card className="max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Professional Plan</span>
                      <span>$50/month</span>
                    </div>
                    {selectedAddons.map((addonId) => {
                      const addon = addons.find((a) => a.id === addonId);
                      return (
                        <div key={addonId} className="flex justify-between">
                          <span>{addon?.name}</span>
                          <span>{addon?.price}</span>
                        </div>
                      );
                    })}
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${calculateTotal()}/month</span>
                    </div>
                    <Button
                      onClick={() => handleUpgrade("basic")}
                      disabled={isLoading}
                      className="w-full mt-4"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      Upgrade Now
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
