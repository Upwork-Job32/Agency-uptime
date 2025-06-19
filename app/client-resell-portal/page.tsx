"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Globe,
  CheckCircle,
  XCircle,
  Calendar,
  Download,
  Shield,
  Activity,
  TrendingUp,
  BarChart3,
  Clock,
  AlertTriangle,
  Plus,
  Settings,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  TrendingDown,
  LogOut,
  User,
  CreditCard,
  Users,
  Timer,
  Monitor,
  Lock,
  Crown,
  Zap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddSiteModal } from "@/components/AddSiteModal";

interface Site {
  id: number;
  name: string;
  url: string;
  current_status?: string;
  uptime_percentage: string;
  check_interval: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  total_sites: number;
  active_sites: number;
  total_incidents: number;
  total_alerts: number;
  uptime_percentage: string;
}

interface ClientData {
  id: number;
  name: string;
  email: string;
  subscription_status: string;
  plan_type: string;
  trial_ends_at?: string;
}

interface AgencyBranding {
  id: number;
  name: string;
  logo_url?: string;
  brand_color?: string;
  custom_domain?: string;
  pricing: {
    basic_plan: { name: string; price: number; sites: number };
    standard_plan: { name: string; price: number; sites: number };
    premium_plan: { name: string; price: number; sites: number };
  };
}

export default function ClientResellPortal() {
  const [sites, setSites] = useState<Site[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_sites: 0,
    active_sites: 0,
    total_incidents: 0,
    total_alerts: 0,
    uptime_percentage: "0",
  });
  const [client, setClient] = useState<ClientData | null>(null);
  const [agency, setAgency] = useState<AgencyBranding | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPricingModal, setShowPricingModal] = useState(false);

  // Add default pricing structure and load from agency settings
  const [pricingSettings, setPricingSettings] = useState({
    basic_plan: { name: "Basic Monitoring", price: 29, sites: 5 },
    standard_plan: { name: "Standard Monitoring", price: 59, sites: 15 },
    premium_plan: { name: "Premium Monitoring", price: 99, sites: 50 },
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check authentication and load data
  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      window.location.href = "/client/login";
      return;
    }
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem("clientToken");
      const response = await fetch(
        `${API_BASE_URL}/api/client-auth/resell-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setClient(data.client);
        setAgency(data.agency);

        // Load agency pricing if available
        if (data.agency.pricing_settings) {
          setPricingSettings(data.agency.pricing_settings);
        }

        // Check for payment success in URL
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get("payment");
        const sessionId = urlParams.get("session_id");

        if (paymentStatus === "success" && sessionId) {
          // Activate subscription
          const activateResponse = await fetch(
            `${API_BASE_URL}/api/client-auth/activate-resell-subscription`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ session_id: sessionId }),
            }
          );

          if (activateResponse.ok) {
            alert(
              "🎉 Subscription activated successfully! You now have access to all premium features."
            );
            // Refresh data
            setTimeout(() => {
              window.location.href = "/client-resell-portal";
            }, 2000);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("clientToken");
      const response = await fetch(
        `${API_BASE_URL}/api/client-auth/stats?period=${selectedPeriod}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  }, [selectedPeriod, API_BASE_URL]);

  const fetchSites = useCallback(async () => {
    try {
      const token = localStorage.getItem("clientToken");
      const response = await fetch(`${API_BASE_URL}/api/client-auth/sites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSites(data.sites || []);
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
    } finally {
      setIsLoadingSites(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (client) {
      fetchStats();
      fetchSites();
    }
  }, [client, fetchStats, fetchSites]);

  const handleSiteAdded = () => {
    fetchSites();
    fetchStats();
  };

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    window.location.href = "/client/login";
  };

  const handleUpgrade = async (planType: string) => {
    try {
      const token = localStorage.getItem("clientToken");
      const response = await fetch(
        `${API_BASE_URL}/api/client-auth/create-resell-payment-session`,
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

      if (response.ok) {
        const data = await response.json();
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        const error = await response.json();
        alert(`Payment setup failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to setup payment. Please try again.");
    }
    setShowPricingModal(false);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "up":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "down":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upSites = sites.filter((site) => site.current_status === "up").length;
  const downSites = sites.filter(
    (site) => site.current_status === "down"
  ).length;

  const brandColor = agency?.brand_color || "#3B82F6";
  const isPaidPlan = client?.subscription_status === "active";
  const isTrialing = client?.subscription_status === "trialing";
  const siteLimit = isPaidPlan ? 50 : 3; // Basic limit for trial users

  // Update upgrade banner pricing
  const upgradeBannerPricing = pricingSettings.basic_plan.price;

  if (!client || !agency) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
                <p className="text-sm text-gray-600">Monitoring Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Real-time Clock */}
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>

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

      {/* Upgrade Banner for Trial/Free Users */}
      {!isPaidPlan && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Zap className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">
                    Unlock Full Monitoring Features
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Get alerts, reports, and advanced monitoring starting at $
                    {upgradeBannerPricing}/month
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowPricingModal(true)}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                View Plans
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Monitoring Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor your websites with {agency.name}
                {!isPaidPlan &&
                  ` • ${siteLimit - stats.total_sites} sites remaining`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              {stats.total_sites < siteLimit && (
                <AddSiteModal onSiteAdded={handleSiteAdded} />
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : stats.total_sites}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.active_sites} active • {siteLimit - stats.total_sites}{" "}
                remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Up</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {isLoadingStats || isLoadingSites ? "..." : upSites}
              </div>
              <p className="text-xs text-muted-foreground">Sites online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Down</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {isLoadingStats || isLoadingSites ? "..." : downSites}
              </div>
              <p className="text-xs text-muted-foreground">Sites offline</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Uptime</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : `${stats.uptime_percentage}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                Last {selectedPeriod === "24h" ? "24 hours" : selectedPeriod}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : stats.total_alerts}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="sites" className="space-y-4">
              <TabsList>
                <TabsTrigger value="sites">Sites</TabsTrigger>
                <TabsTrigger value="alerts">
                  Alerts
                  {!isPaidPlan && <Lock className="h-3 w-3 ml-1" />}
                </TabsTrigger>
                <TabsTrigger value="reports">
                  Reports
                  {!isPaidPlan && <Lock className="h-3 w-3 ml-1" />}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sites" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Monitored Sites</CardTitle>
                        <CardDescription>
                          Basic monitoring for your websites
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search sites..."
                            className="pl-8 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Site limit warning */}
                    {stats.total_sites >= siteLimit && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                          <div>
                            <h3 className="font-medium text-yellow-800">
                              Site Limit Reached
                            </h3>
                            <p className="text-sm text-yellow-700 mt-1">
                              Upgrade to monitor more websites and unlock
                              advanced features.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isLoadingSites ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Loading sites...</p>
                      </div>
                    ) : filteredSites.length === 0 ? (
                      <div className="text-center py-8">
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                          {sites.length === 0
                            ? "No sites added yet"
                            : "No sites match your search"}
                        </p>
                        {sites.length === 0 &&
                          stats.total_sites < siteLimit && (
                            <AddSiteModal onSiteAdded={handleSiteAdded} />
                          )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredSites.map((site) => (
                          <div
                            key={site.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={`${getStatusColor(
                                  site.current_status
                                )}`}
                              >
                                {getStatusIcon(site.current_status)}
                              </div>
                              <div>
                                <h3 className="font-medium">{site.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {site.url}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium text-gray-900">
                                    Status
                                  </span>
                                  <Badge
                                    variant={
                                      site.current_status === "up"
                                        ? "default"
                                        : "destructive"
                                    }
                                  >
                                    {site.current_status || "Unknown"}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span>Uptime:</span>
                                  <span className="font-medium">
                                    {site.uptime_percentage}%
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span>Added:</span>
                                  <span className="font-medium">
                                    {formatTimeAgo(site.created_at)}
                                  </span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      Alert Management
                      {!isPaidPlan && (
                        <Lock className="h-4 w-4 ml-2 text-gray-400" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      {isPaidPlan
                        ? "Configure alerts and notifications"
                        : "Upgrade to get instant alerts via email, Slack, and more"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isPaidPlan ? (
                      <div className="text-center py-12">
                        <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Premium Feature
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                          Get instant notifications when your sites go down.
                          Multiple notification channels available.
                        </p>
                        <Button
                          onClick={() => setShowPricingModal(true)}
                          style={{ backgroundColor: brandColor }}
                        >
                          Upgrade to Unlock Alerts
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No alerts configured yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      Report Generation
                      {!isPaidPlan && (
                        <Lock className="h-4 w-4 ml-2 text-gray-400" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      {isPaidPlan
                        ? "Generate detailed monitoring reports"
                        : "Upgrade to generate professional PDF reports"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isPaidPlan ? (
                      <div className="text-center py-12">
                        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Premium Feature
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                          Generate professional PDF reports with detailed
                          analytics and insights.
                        </p>
                        <Button
                          onClick={() => setShowPricingModal(true)}
                          style={{ backgroundColor: brandColor }}
                        >
                          Upgrade to Generate Reports
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                          Generate monitoring reports
                        </p>
                        <Button style={{ backgroundColor: brandColor }}>
                          <Download className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.total_sites < siteLimit && (
                  <AddSiteModal
                    onSiteAdded={handleSiteAdded}
                    currentSiteCount={stats.total_sites}
                  />
                )}
                {isPaidPlan ? (
                  <>
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Manage Alerts
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-3">
                      Unlock premium features
                    </p>
                    <Button
                      onClick={() => setShowPricingModal(true)}
                      style={{ backgroundColor: brandColor }}
                      className="w-full"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Plan</span>
                  <Badge
                    className={
                      isPaidPlan
                        ? "bg-green-100 text-green-800"
                        : isTrialing
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {isPaidPlan
                      ? client.plan_type || "Active"
                      : isTrialing
                      ? "Trial"
                      : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sites Used</span>
                  <span className="text-sm font-medium">
                    {stats.total_sites} / {isPaidPlan ? "50" : "3"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(
                        (stats.total_sites / siteLimit) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                {!isPaidPlan && (
                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: `${brandColor}10`,
                      borderColor: `${brandColor}30`,
                    }}
                  >
                    <h4 className="font-semibold text-sm mb-2">
                      Upgrade Benefits
                    </h4>
                    <ul className="text-xs space-y-1">
                      <li>• More monitored sites</li>
                      <li>• Email & Slack alerts</li>
                      <li>• Professional reports</li>
                      <li>• Priority support</li>
                    </ul>
                    <Button
                      onClick={() => setShowPricingModal(true)}
                      size="sm"
                      className="w-full mt-3"
                      style={{ backgroundColor: brandColor }}
                    >
                      View Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monitoring</span>
                    <Badge className="bg-green-100 text-green-800">
                      <Activity className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Check</span>
                    <span className="text-sm font-medium">
                      {currentTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing Modal */}
        {showPricingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Choose Your Plan</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowPricingModal(false)}
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic Plan */}
                <div className="border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-2">
                    {pricingSettings.basic_plan.name}
                  </h3>
                  <div
                    className="text-3xl font-bold mb-4"
                    style={{ color: brandColor }}
                  >
                    ${pricingSettings.basic_plan.price}
                    <span className="text-sm font-normal text-gray-600">
                      /month
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Up to {pricingSettings.basic_plan.sites} websites
                  </div>
                  <ul className="text-sm space-y-2 text-left mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      24/7 uptime monitoring
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Email notifications
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Basic reporting
                    </li>
                  </ul>
                  <Button
                    onClick={() => handleUpgrade("basic")}
                    className="w-full"
                    style={{ backgroundColor: brandColor }}
                  >
                    Choose Basic
                  </Button>
                </div>

                {/* Standard Plan */}
                <div
                  className="border-2 rounded-lg p-6 text-center hover:shadow-lg transition-shadow relative"
                  style={{ borderColor: brandColor }}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge style={{ backgroundColor: brandColor }}>
                      Most Popular
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {pricingSettings.standard_plan.name}
                  </h3>
                  <div
                    className="text-3xl font-bold mb-4"
                    style={{ color: brandColor }}
                  >
                    ${pricingSettings.standard_plan.price}
                    <span className="text-sm font-normal text-gray-600">
                      /month
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Up to {pricingSettings.standard_plan.sites} websites
                  </div>
                  <ul className="text-sm space-y-2 text-left mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Everything in Basic
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      SMS notifications
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Advanced reporting
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      SSL monitoring
                    </li>
                  </ul>
                  <Button
                    onClick={() => handleUpgrade("standard")}
                    className="w-full"
                    style={{ backgroundColor: brandColor }}
                  >
                    Choose Standard
                  </Button>
                </div>

                {/* Premium Plan */}
                <div className="border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-2">
                    {pricingSettings.premium_plan.name}
                  </h3>
                  <div
                    className="text-3xl font-bold mb-4"
                    style={{ color: brandColor }}
                  >
                    ${pricingSettings.premium_plan.price}
                    <span className="text-sm font-normal text-gray-600">
                      /month
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Up to {pricingSettings.premium_plan.sites} websites
                  </div>
                  <ul className="text-sm space-y-2 text-left mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Everything in Standard
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Phone call alerts
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Custom integrations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Priority support
                    </li>
                  </ul>
                  <Button
                    onClick={() => handleUpgrade("premium")}
                    className="w-full"
                    style={{ backgroundColor: brandColor }}
                  >
                    Choose Premium
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500">
            <p className="text-sm">Powered by {agency.name}</p>
            <p className="text-xs mt-1">
              Professional Website Monitoring Services
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
