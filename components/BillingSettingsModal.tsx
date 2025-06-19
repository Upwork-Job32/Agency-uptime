"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  Loader2,
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Users,
  Globe,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  plan_type: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id: string | null;
  active_addons: string[];
}

export function BillingSettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/billing/subscription",
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
        console.error(
          "Failed to fetch subscription:",
          response.status,
          response.statusText
        );
        // Set default trial subscription on error
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
      // Set default trial subscription on error
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
  };

  useEffect(() => {
    if (isOpen) {
      fetchSubscription();
    }
  }, [isOpen]);

  const handleUpgrade = async () => {
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
            plan_type: "basic",
            addons: [],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to Stripe checkout
      window.open(data.checkout_url, "_blank");

      toast({
        title: "Redirecting to Stripe",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "trialing":
        return "bg-blue-100 text-blue-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate potential profit examples
  const profitExamples = [
    { sites: 10, clientPrice: 30, yourPay: 50, profit: 250 },
    { sites: 50, clientPrice: 25, yourPay: 50, profit: 1200 },
    { sites: 100, clientPrice: 20, yourPay: 50, profit: 1950 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <CreditCard className="h-4 w-4 mr-2" />
          Billing Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Billing Settings</DialogTitle>
          <DialogDescription>
            Manage your subscription and reseller business model.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="reseller">Reseller Model</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="space-y-4">
            {subscription ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize">
                      {subscription.plan_type === "basic"
                        ? "Professional"
                        : subscription.plan_type}{" "}
                      Plan
                    </CardTitle>
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {subscription.status === "trialing"
                      ? "You are currently on a free trial"
                      : "Your current subscription plan"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Current Period
                      </p>
                      <p className="text-sm">
                        {formatDate(subscription.current_period_start)} -{" "}
                        {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Next Billing
                      </p>
                      <p className="text-sm">
                        {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                  </div>

                  {subscription.plan_type === "basic" &&
                    subscription.status === "active" && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center text-green-800 mb-2">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">White-Label Ready</span>
                        </div>
                        <p className="text-sm text-green-700">
                          Your monitoring platform is fully white-labeled and
                          ready to resell to clients. Start selling at
                          $20-$50/month per site!
                        </p>
                      </div>
                    )}

                  {subscription.status === "trialing" && (
                    <div className="mt-4">
                      <Button
                        onClick={handleUpgrade}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ExternalLink className="mr-2 h-4 w-4" />
                        )}
                        Start Reselling - Upgrade to Pro
                      </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Unlock unlimited client sites for $50/month
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">
                    Loading subscription details...
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reseller" className="space-y-6">
            {/* Business Model Overview */}
            <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-800">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Built to Print Profit
                </CardTitle>
                <CardDescription className="text-indigo-600">
                  Agency Uptime lets you break into the SaaS game without
                  writing a single line of code. For one flat monthly fee, you
                  get a fully white-labeled uptime monitoring platform branded
                  to your agency — ready to sell at $20–$50/month per site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Users className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                    <h4 className="font-semibold text-gray-800">
                      Unlimited Sites
                    </h4>
                    <p className="text-sm text-gray-600">
                      Monitor as many client sites as you want
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Globe className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                    <h4 className="font-semibold text-gray-800">
                      Full White-Label
                    </h4>
                    <p className="text-sm text-gray-600">
                      Your logo, domain, and colors
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Zap className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                    <h4 className="font-semibold text-gray-800">
                      Real-Time Alerts
                    </h4>
                    <p className="text-sm text-gray-600">
                      Slack, Discord, Teams, and more
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profit Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>💰 Profit Examples</CardTitle>
                <CardDescription>
                  See how much you can earn by reselling monitoring services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">
                          Sites Monitored
                        </th>
                        <th className="text-left p-3 font-medium">
                          Client Price (each)
                        </th>
                        <th className="text-left p-3 font-medium">You Pay</th>
                        <th className="text-left p-3 font-medium text-green-600">
                          Your Monthly Profit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {profitExamples.map((example, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{example.sites}</td>
                          <td className="p-3">${example.clientPrice}</td>
                          <td className="p-3">${example.yourPay}</td>
                          <td className="p-3 font-bold text-green-600">
                            ${example.profit.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Upsell Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>🔧 Start with Uptime. Expand from There.</CardTitle>
                <CardDescription>
                  Once you're in the door, the upsell opportunities are endless
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">SEO & Performance Reports</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Security & SSL Monitoring</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">
                        Website Maintenance Retainers
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Hosting & DNS Management</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Conversion Optimization</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">
                        AI Chat & Lead Recovery Tools
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* No Tech Skills Required */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    🧠 No Tech Skills Required
                  </h3>
                  <p className="text-green-700 mb-4">
                    We host everything. You just log in, brand your dashboard,
                    and start selling.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-green-600">
                    <span>✅ Fully Hosted</span>
                    <span>✅ Zero Code</span>
                    <span>✅ Easy Setup</span>
                    <span>✅ Start Selling Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
