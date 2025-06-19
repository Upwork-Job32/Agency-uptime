"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Bell,
  BarChart3,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Users,
  CreditCard,
  Download,
  Crown,
  Lock,
  Shield,
  Zap,
} from "lucide-react";
import { FullLogo } from "@/components/ui/full-logo";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddSiteModal } from "@/components/AddSiteModal";
import { GenerateReportModal } from "@/components/GenerateReportModal";
import { ManageAlertsModal } from "@/components/ManageAlertsModal";
import { BillingSettingsModal } from "@/components/BillingSettingsModal";
import { InviteTeamModal } from "@/components/InviteTeamModal";
import { AddSiteButton } from "@/components/AddSiteButton";
import { TestMonitoringButton } from "@/components/TestMonitoringButton";
import { MonitoringStatus } from "@/components/MonitoringStatus";
import { WhiteLabelSettings } from "@/components/WhiteLabelSettings";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Link from "next/link";

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

interface Alert {
  id: number;
  site_name: string;
  type: string;
  message: string;
  sent_at: string;
  severity?: string;
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [sites, setSites] = useState<Site[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_sites: 0,
    active_sites: 0,
    total_incidents: 0,
    total_alerts: 0,
    uptime_percentage: "0",
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuth();
  const { subscription, isPro, isTrial, isExpired } = useSubscription();

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchSites = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/sites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSites(data.sites || []);
      }
    } catch (error) {
      console.error("Failed to fetch sites:", error);
    } finally {
      setIsLoadingSites(false);
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/alerts?limit=5", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchSites();
    fetchAlerts();
  }, [fetchStats, fetchSites, fetchAlerts]);

  const handleSiteAdded = () => {
    fetchSites();
    fetchStats();
  };

  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate actual up/down counts based on current status
  const upSites = sites.filter((site) => site.current_status === "up").length;
  const downSites = sites.filter(
    (site) => site.current_status === "down"
  ).length;

  // Plan limits
  const siteLimit = isPro ? 1000 : 3;
  const hasReachedLimit = stats.total_sites >= siteLimit;

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

  const formatCheckInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <FullLogo />
                <div className="hidden md:block ml-6">
                  <nav className="flex space-x-8">
                    <Link
                      href="/dashboard"
                      className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-blue-500"
                    >
                      Dashboard
                    </Link>
                    {isPro && (
                      <Link
                        href="/white-label"
                        className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                      >
                        <Crown className="h-4 w-4 mr-1" />
                        White-Label
                      </Link>
                    )}
                  </nav>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge
                  variant={
                    isPro ? "default" : isExpired ? "destructive" : "secondary"
                  }
                  className={
                    isPro
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : ""
                  }
                >
                  {isPro ? (
                    <>
                      <Crown className="h-3 w-3 mr-1" />
                      Pro Plan
                    </>
                  ) : isExpired ? (
                    "Expired"
                  ) : (
                    "Trial"
                  )}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-gray-700"
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Pro Upgrade Banner for Trial Users */}
        {!isPro && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Zap className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">
                      Upgrade to Pro for $50/month
                    </h3>
                    <p className="text-purple-100 text-sm">
                      Unlock white-labeling, unlimited sites, and start
                      reselling at $20-$50/month per client
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-purple-100">Potential Revenue</p>
                    <p className="font-bold">$200-500/month per client</p>
                  </div>
                  <BillingSettingsModal />
                </div>
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
                  Welcome back, {user?.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isPro
                    ? "Your white-label monitoring platform is ready to resell"
                    : "Monitor your websites and upgrade to start reselling"}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
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
                {!hasReachedLimit && (
                  <AddSiteModal onSiteAdded={handleSiteAdded} />
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sites
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Avg Uptime
                </CardTitle>
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
                    {!isPro && <Lock className="h-3 w-3 ml-1" />}
                  </TabsTrigger>
                  <TabsTrigger value="reports">
                    Reports
                    {!isPro && <Lock className="h-3 w-3 ml-1" />}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sites" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Monitored Sites</CardTitle>
                          <CardDescription>
                            Manage and monitor your websites
                            {!isPro &&
                              ` • ${
                                siteLimit - stats.total_sites
                              } sites remaining`}
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
                      {hasReachedLimit && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                            <div>
                              <h3 className="font-medium text-yellow-800">
                                Site Limit Reached
                              </h3>
                              <p className="text-sm text-yellow-700 mt-1">
                                You've reached your limit of {siteLimit} sites.{" "}
                                {!isPro && (
                                  <span>
                                    Upgrade to Pro for unlimited sites and
                                    white-labeling features.
                                  </span>
                                )}
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
                          {sites.length === 0 && !hasReachedLimit && (
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
                        Alerts & Notifications
                        {!isPro && (
                          <Lock className="h-4 w-4 ml-2 text-gray-400" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {isPro
                          ? "Manage your monitoring alerts and integrations"
                          : "Upgrade to Pro to access advanced alerting features"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!isPro ? (
                        <div className="text-center py-12">
                          <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Pro Feature
                          </h3>
                          <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Get instant alerts via Slack, Discord, Teams, and
                            email when your sites go down. Plus advanced
                            reporting and white-label features.
                          </p>
                          <BillingSettingsModal />
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No alerts to display</p>
                          <ManageAlertsModal />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        Reports & Analytics
                        {!isPro && (
                          <Lock className="h-4 w-4 ml-2 text-gray-400" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {isPro
                          ? "Generate detailed monitoring reports"
                          : "Upgrade to Pro to access professional reporting features"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!isPro ? (
                        <div className="text-center py-12">
                          <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Pro Feature
                          </h3>
                          <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Generate branded PDF reports for your clients.
                            Perfect for white-label reselling at $20-50/month
                            per client.
                          </p>
                          <BillingSettingsModal />
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">
                            Generate comprehensive reports for your monitoring
                            data
                          </p>
                          <GenerateReportModal />
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
                  {!hasReachedLimit && (
                    <AddSiteModal
                      onSiteAdded={handleSiteAdded}
                      currentSiteCount={stats.total_sites}
                    />
                  )}
                  {isPro ? (
                    <>
                      <GenerateReportModal />
                      <ManageAlertsModal />
                      <Link href="/white-label">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          White-Label Settings
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">
                        Unlock all features with Pro
                      </p>
                      <BillingSettingsModal />
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
                        isPro
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          : isExpired
                          ? "bg-red-100 text-red-800"
                          : "bg-indigo-100 text-indigo-800"
                      }
                    >
                      {isPro ? (
                        <>
                          <Crown className="h-3 w-3 mr-1" />
                          Professional
                        </>
                      ) : isExpired ? (
                        "Expired"
                      ) : (
                        "Trial"
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sites Used</span>
                    <span className="text-sm font-medium">
                      {stats.total_sites} / {isPro ? "∞" : siteLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isPro
                          ? "bg-gradient-to-r from-purple-500 to-blue-500"
                          : "bg-indigo-600"
                      }`}
                      style={{
                        width: isPro
                          ? "100%"
                          : `${Math.min(
                              (stats.total_sites / siteLimit) * 100,
                              100
                            )}%`,
                      }}
                    ></div>
                  </div>
                  {!isPro && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 text-sm mb-2">
                        Ready to Start Reselling?
                      </h4>
                      <p className="text-xs text-purple-700 mb-3">
                        Pro plan includes white-labeling, unlimited sites, and
                        everything you need to resell at $20-50/month per
                        client.
                      </p>
                      <BillingSettingsModal />
                    </div>
                  )}
                </CardContent>
              </Card>

              <MonitoringStatus />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
