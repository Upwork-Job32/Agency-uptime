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
import { CreditCard, Loader2, ExternalLink, CheckCircle } from "lucide-react";
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
  const [addonLoading, setAddonLoading] = useState<Record<string, boolean>>({});
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

  const handleAddAddon = async (addonId: string) => {
    setAddonLoading((prev) => ({ ...prev, [addonId]: true }));

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
            plan_type: subscription?.plan_type || "basic",
            addons: [addonId],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to Stripe checkout
      window.location.href = data.checkout_url;

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
      setAddonLoading((prev) => ({ ...prev, [addonId]: false }));
    }
  };

  const handleManageAddon = async (addonId: string) => {
    // For now, show a message about contacting support
    toast({
      title: "Manage Add-on",
      description:
        "To modify or cancel this add-on, please contact support at support@agencyuptime.com",
    });
  };

  const addons = [
    {
      name: "PDF Reports",
      description: "Monthly branded PDF reports for your clients",
      price: "$29/month",
      id: "pdf_reports",
    },
    {
      name: "Status Pages",
      description: "Public status pages for your clients to view",
      price: "$19/month",
      id: "status_pages",
    },
    {
      name: "Resell Dashboard",
      description: "White-labeled client dashboard access",
      price: "$49/month",
      id: "resell_dashboard",
    },
  ];

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <CreditCard className="h-4 w-4 mr-2" />
          Billing Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Billing Settings</DialogTitle>
          <DialogDescription>
            Manage your subscription and billing information.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
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
                        Upgrade to Paid Plan
                      </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Continue monitoring after your trial ends
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

          <TabsContent value="addons" className="space-y-4">
            <div className="grid gap-4">
              {addons.map((addon) => (
                <Card key={addon.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {addon.name}
                        </CardTitle>
                        <CardDescription>{addon.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{addon.price}</p>
                        {subscription?.active_addons?.includes(addon.id) && (
                          <div className="flex items-center text-green-600 text-sm mt-1">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Active
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant={
                        subscription?.active_addons?.includes(addon.id)
                          ? "outline"
                          : "default"
                      }
                      size="sm"
                      disabled={
                        subscription?.status !== "active" ||
                        addonLoading[addon.id]
                      }
                      onClick={() => {
                        if (subscription?.active_addons?.includes(addon.id)) {
                          handleManageAddon(addon.id);
                        } else {
                          handleAddAddon(addon.id);
                        }
                      }}
                    >
                      {addonLoading[addon.id] ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {subscription?.active_addons?.includes(addon.id)
                        ? "Manage"
                        : "Add to Plan"}
                    </Button>
                    {subscription?.status !== "active" && (
                      <p className="text-xs text-gray-500 mt-2">
                        Available after upgrading to paid plan
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
