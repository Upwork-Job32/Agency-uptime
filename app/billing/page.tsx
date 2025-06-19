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
    description: "Perfect for testing Agency Uptime",
    features: [
      "Up to 3 sites monitoring",
      "5-minute check intervals",
      "Basic email alerts",
      "Dashboard access",
      "Basic uptime reporting",
    ],
    restrictions: [
      "No white-label branding",
      "No reselling capabilities",
      "Limited client sites",
      "No advanced integrations",
    ],
    current: true,
    planType: "trial",
  },
  {
    name: "Professional",
    price: "$50",
    period: "per month",
    description:
      "Complete white-label reseller platform - ready to sell at $20-$50/month per site",
    features: [
      "Unlimited client sites monitoring",
      "1-minute check intervals",
      "Full white-label branding",
      "Your logo, domain, and colors",
      "Real-time alerts (Slack, Discord, Teams)",
      "PDF report generation included",
      "Reseller dashboard access",
      "Easy client onboarding",
      "Priority support",
    ],
    highlight: "Built to Print Profit",
    popular: true,
    planType: "basic",
  },
];

export default function Billing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { stripe, isLoading: stripeLoading } = useStripe();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

          {/* Reseller Business Model Section */}
          <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  💰 Built to Print Profit
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Agency Uptime lets you break into the SaaS game without
                  writing a single line of code. For one flat monthly fee, you
                  get a fully white-labeled uptime monitoring platform branded
                  to your agency — ready to sell at $20–$50/month per site.
                </p>
              </div>

              {/* Profit Examples */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                  Profit Examples
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">
                          Sites Monitored
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">
                          Client Price (each)
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">
                          You Pay
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-green-600">
                          Your Monthly Profit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium">10</td>
                        <td className="py-4 px-6">$30</td>
                        <td className="py-4 px-6">$50</td>
                        <td className="py-4 px-6 font-bold text-green-600 text-lg">
                          $250
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium">50</td>
                        <td className="py-4 px-6">$25</td>
                        <td className="py-4 px-6">$50</td>
                        <td className="py-4 px-6 font-bold text-green-600 text-lg">
                          $1,200
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium">100</td>
                        <td className="py-4 px-6">$20</td>
                        <td className="py-4 px-6">$50</td>
                        <td className="py-4 px-6 font-bold text-green-600 text-lg">
                          $1,950
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-white rounded-lg shadow">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Unlimited Sites
                  </h4>
                  <p className="text-sm text-gray-600">
                    Monitor as many client sites as you want
                  </p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Full White-Label
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your logo, domain, and colors
                  </p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Real-Time Alerts
                  </h4>
                  <p className="text-sm text-gray-600">
                    Slack, Discord, Teams, and more
                  </p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    No Tech Skills
                  </h4>
                  <p className="text-sm text-gray-600">
                    We host everything for you
                  </p>
                </div>
              </div>

              {/* Upsell Opportunities */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                  🔧 Start with Uptime. Expand from There.
                </h3>
                <p className="text-center text-gray-600 mb-8">
                  Once you're in the door, the upsell opportunities are endless
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium">
                      SEO & Performance Reports
                    </span>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium">
                      Security & SSL Monitoring
                    </span>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium">
                      Website Maintenance Retainers
                    </span>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium">
                      Hosting & DNS Management
                    </span>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium">
                      Conversion Optimization
                    </span>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium">
                      AI Chat & Lead Recovery Tools
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
