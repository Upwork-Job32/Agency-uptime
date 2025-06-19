"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Globe,
  Plus,
  Bell,
  Settings,
  BarChart3,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Lock,
  CreditCard,
  LogOut,
  User,
  Mail,
  Building,
  Monitor,
  Zap,
  Phone,
  MessageSquare,
} from "lucide-react";

interface ClientData {
  id: number;
  name: string;
  email: string;
  company?: string;
  subscription_status: string;
  plan_type?: string;
  activated_at: string;
}

interface AgencyBranding {
  id: number;
  name: string;
  logo_url?: string;
  brand_color?: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [client, setClient] = useState<ClientData | null>(null);
  const [agency, setAgency] = useState<AgencyBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      router.push("/client/login");
      return;
    }

    fetchClientData(token);
  }, [router]);

  const fetchClientData = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/client-auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClient(data.client);
        setAgency(data.agency);
      } else {
        localStorage.removeItem("clientToken");
        router.push("/client/login");
      }
    } catch (error) {
      console.error("Failed to fetch client data:", error);
      localStorage.removeItem("clientToken");
      router.push("/client/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    router.push("/client/login");
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  const handleLockedFeature = (featureName: string) => {
    alert(
      `${featureName} is available in paid plans. Upgrade to unlock this feature!`
    );
    setShowUpgradeModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!client || !agency) {
    return null;
  }

  const brandColor = agency.brand_color || "#3B82F6";
  const isPaidPlan = client.subscription_status === "active";
  const isTrialing = client.subscription_status === "trialing";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {agency.logo_url && (
                <img
                  src={agency.logo_url}
                  alt={agency.name}
                  className="h-8 object-contain"
                />
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {agency.name}
                </h1>
                <p className="text-sm text-gray-600">Monitoring Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Subscription Status */}
              <Badge
                variant={
                  isPaidPlan
                    ? "default"
                    : isTrialing
                    ? "secondary"
                    : "destructive"
                }
                style={isPaidPlan ? { backgroundColor: brandColor } : {}}
              >
                {isTrialing ? "Free Trial" : isPaidPlan ? "Active" : "Inactive"}
              </Badge>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {client.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upgrade Banner for Free Users */}
        {!isPaidPlan && (
          <Card className="mb-8 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {isTrialing
                        ? "You're on a Free Trial"
                        : "Upgrade to Access All Features"}
                    </h3>
                    <p className="text-gray-600">
                      {isTrialing
                        ? "Your trial includes full access. Upgrade before it expires to continue monitoring."
                        : "Unlock website monitoring, alerts, and advanced features."}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleUpgrade}
                  style={{ backgroundColor: brandColor }}
                  className="flex items-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Upgrade Now</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Websites
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isPaidPlan || isTrialing ? "3" : "0"}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold text-green-600">
                    {isPaidPlan || isTrialing ? "99.9%" : "--"}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Response
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {isPaidPlan || isTrialing ? "245ms" : "--"}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Incidents</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {isPaidPlan || isTrialing ? "2" : "--"}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Website Monitoring */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>Your Websites</span>
                </CardTitle>
                <Button
                  onClick={() =>
                    isPaidPlan || isTrialing
                      ? null
                      : handleLockedFeature("Add Website")
                  }
                  disabled={!isPaidPlan && !isTrialing}
                  style={
                    isPaidPlan || isTrialing
                      ? { backgroundColor: brandColor }
                      : {}
                  }
                  variant={isPaidPlan || isTrialing ? "default" : "outline"}
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  {!isPaidPlan && !isTrialing && <Lock className="h-4 w-4" />}
                  <Plus className="h-4 w-4" />
                  <span>Add Website</span>
                </Button>
              </CardHeader>
              <CardContent>
                {isPaidPlan || isTrialing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">example.com</p>
                          <p className="text-sm text-gray-600">
                            Last checked: 2 minutes ago
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">shop.example.com</p>
                          <p className="text-sm text-gray-600">
                            Last checked: 1 minute ago
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">api.example.com</p>
                          <p className="text-sm text-gray-600">
                            Last checked: 5 minutes ago
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Offline</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Website Monitoring
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Monitor your websites 24/7 with instant alerts
                    </p>
                    <Button
                      onClick={handleUpgrade}
                      style={{ backgroundColor: brandColor }}
                    >
                      Upgrade to Add Websites
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Incidents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Recent Incidents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPaidPlan || isTrialing ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900">
                          api.example.com is down
                        </p>
                        <p className="text-sm text-red-700">
                          Started 15 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-green-900">
                          example.com resolved
                        </p>
                        <p className="text-sm text-green-700">
                          Resolved 2 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">
                      Upgrade to view incident history
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Account Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{client.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{client.email}</span>
                </div>
                {client.company && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{client.company}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Joined {new Date(client.activated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    isPaidPlan || isTrialing
                      ? null
                      : handleLockedFeature("Email Notifications")
                  }
                  disabled={!isPaidPlan && !isTrialing}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Email Notifications
                  {!isPaidPlan && !isTrialing && (
                    <Lock className="h-4 w-4 ml-auto" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    isPaidPlan || isTrialing
                      ? null
                      : handleLockedFeature("SMS Alerts")
                  }
                  disabled={!isPaidPlan && !isTrialing}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS Alerts
                  {!isPaidPlan && !isTrialing && (
                    <Lock className="h-4 w-4 ml-auto" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    isPaidPlan || isTrialing
                      ? null
                      : handleLockedFeature("Phone Calls")
                  }
                  disabled={!isPaidPlan && !isTrialing}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Calls
                  {!isPaidPlan && !isTrialing && (
                    <Lock className="h-4 w-4 ml-auto" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    isPaidPlan || isTrialing
                      ? null
                      : handleLockedFeature("Reports")
                  }
                  disabled={!isPaidPlan && !isTrialing}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Download Reports
                  {!isPaidPlan && !isTrialing && (
                    <Lock className="h-4 w-4 ml-auto" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    isPaidPlan || isTrialing
                      ? null
                      : handleLockedFeature("SSL Monitoring")
                  }
                  disabled={!isPaidPlan && !isTrialing}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  SSL Monitoring
                  {!isPaidPlan && !isTrialing && (
                    <Lock className="h-4 w-4 ml-auto" />
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Subscription</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge
                      variant={
                        isPaidPlan
                          ? "default"
                          : isTrialing
                          ? "secondary"
                          : "destructive"
                      }
                      style={isPaidPlan ? { backgroundColor: brandColor } : {}}
                    >
                      {isTrialing
                        ? "Free Trial"
                        : isPaidPlan
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className="text-sm font-medium">
                      {client.plan_type
                        ? client.plan_type.charAt(0).toUpperCase() +
                          client.plan_type.slice(1)
                        : "None"}
                    </span>
                  </div>

                  {isTrialing && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 font-medium">
                        Trial ends in 27 days
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Upgrade now to continue monitoring
                      </p>
                    </div>
                  )}

                  {!isPaidPlan && (
                    <Button
                      onClick={handleUpgrade}
                      className="w-full mt-4"
                      style={{ backgroundColor: brandColor }}
                    >
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                To access this feature, please upgrade to a paid plan with full
                monitoring capabilities.
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowUpgradeModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    // Redirect to upgrade page
                    window.open(
                      `mailto:${agency.name
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          ""
                        )}@example.com?subject=Upgrade Request`,
                      "_blank"
                    );
                  }}
                  style={{ backgroundColor: brandColor }}
                  className="flex-1"
                >
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
