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
} from "lucide-react";
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
}

export default function ClientDashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_sites: 0,
    active_sites: 0,
    total_incidents: 0,
    total_alerts: 0,
    uptime_percentage: "0",
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [client, setClient] = useState<ClientData | null>(null);
  const [agency, setAgency] = useState<AgencyBranding | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [currentTime, setCurrentTime] = useState(new Date());

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if user is authenticated as a client
  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      window.location.href = "/client/login";
      return;
    }
    fetchClientData();
    fetchAgencyBranding();
  }, []);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem("clientToken");
      const response = await fetch(`${API_BASE_URL}/api/client-auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClient(data.client);
      } else {
        console.error("Failed to fetch client data");
        localStorage.removeItem("clientToken");
        window.location.href = "/client/login";
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  const fetchAgencyBranding = async () => {
    try {
      const token = localStorage.getItem("clientToken");
      const response = await fetch(
        `${API_BASE_URL}/api/client-auth/agency-branding`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAgency(data.agency);
      }
    } catch (error) {
      console.error("Error fetching agency branding:", error);
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("clientToken");
      const response = await fetch(
        `${API_BASE_URL}/api/client-auth/stats?period=${selectedPeriod}`,
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
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  }, [selectedPeriod, API_BASE_URL]);

  const fetchSites = useCallback(async () => {
    try {
      const token = localStorage.getItem("clientToken");
      const response = await fetch(`${API_BASE_URL}/api/client-auth/sites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const fetchAlerts = useCallback(async () => {
    try {
      const token = localStorage.getItem("clientToken");
      const response = await fetch(`${API_BASE_URL}/api/client-auth/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setIsLoadingAlerts(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (client) {
      fetchStats();
      fetchSites();
      fetchAlerts();
    }
  }, [client, fetchStats, fetchSites, fetchAlerts]);

  const handleSiteAdded = () => {
    fetchSites();
    fetchStats();
  };

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    window.location.href = "/client/login";
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

  const formatCheckInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${seconds / 60}m`;
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
                <p className="text-sm text-gray-600">Monitoring Dashboard</p>
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

      {/* Trial Notice */}
      {isTrialing && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Free Trial Active - Upgrade anytime to continue monitoring
                </span>
              </div>
              <Button
                size="sm"
                style={{ backgroundColor: brandColor }}
                className="text-white"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Monitor your websites and track performance
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
              <AddSiteModal onSiteAdded={handleSiteAdded} />
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
                {stats.active_sites} active
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
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="sites" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Monitored Sites</CardTitle>
                        <CardDescription>
                          Manage and monitor your websites
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
                        {sites.length === 0 && (
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
                                  <span>Check:</span>
                                  <span className="font-medium">
                                    {formatCheckInterval(site.check_interval)}
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
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>
                      Monitor notifications and incidents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAlerts ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Loading alerts...</p>
                      </div>
                    ) : alerts.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No alerts to display</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {alerts.map((alert) => (
                          <div
                            key={alert.id}
                            className="flex items-start space-x-3 p-3 border rounded-lg"
                          >
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">
                                  {alert.site_name}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(alert.sent_at)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {alert.message}
                              </p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {alert.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>
                      Generate and download monitoring reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        Generate comprehensive reports for your monitoring data
                      </p>
                      <GenerateReportModal />
                    </div>
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
                <AddSiteModal
                  onSiteAdded={handleSiteAdded}
                  currentSiteCount={stats.total_sites}
                />
                <GenerateReportModal />
                <ManageAlertsModal />
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  style={{ color: brandColor, borderColor: brandColor }}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
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
                    {stats.total_sites} / {isPaidPlan ? "Unlimited" : "5"}
                  </span>
                </div>
                {isTrialing && client.trial_ends_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trial Ends</span>
                    <span className="text-sm font-medium">
                      {new Date(client.trial_ends_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {!isPaidPlan && (
                  <Button
                    className="w-full"
                    style={{ backgroundColor: brandColor }}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monitoring Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Service Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      <Activity className="w-3 h-3 mr-1" />
                      Online
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next Check</span>
                    <span className="text-sm font-medium">
                      {new Date(
                        currentTime.getTime() + 60000
                      ).toLocaleTimeString("en-US", {
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
