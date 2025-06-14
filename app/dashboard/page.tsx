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
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "up":
        return <CheckCircle className="h-4 w-4" />;
      case "down":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
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
                <Badge className="bg-indigo-100 text-indigo-800">
                  Dashboard
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name || "Agency Admin"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Monitor your clients&apos; websites and track performance
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
                <AddSiteModal onSiteAdded={handleSiteAdded} />
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
                            Manage and monitor your clients&apos; websites
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
                              <div className="flex items-center space-x-6 text-sm">
                                <div className="text-center">
                                  <p className="font-medium">
                                    {site.current_status?.toUpperCase() ||
                                      "UNKNOWN"}
                                  </p>
                                  <p className="text-gray-500">Status</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-medium">
                                    {site.uptime_percentage}%
                                  </p>
                                  <p className="text-gray-500">Uptime</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-medium">
                                    {formatCheckInterval(site.check_interval)}
                                  </p>
                                  <p className="text-gray-500">Interval</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-medium">
                                    {formatTimeAgo(site.updated_at)}
                                  </p>
                                  <p className="text-gray-500">Last Check</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <TestMonitoringButton
                                    siteId={site.id}
                                    siteName={site.name}
                                  />
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
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
                        Latest notifications and incidents
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {alerts.length === 0 ? (
                        <div className="text-center py-8">
                          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No recent alerts</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {alerts.map((alert) => (
                            <div
                              key={alert.id}
                              className="flex items-start space-x-4 p-4 border rounded-lg"
                            >
                              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
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
                                <Badge
                                  variant="outline"
                                  className="mt-2 text-xs"
                                >
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
                          Generate comprehensive reports for your monitoring
                          data
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
                  <AddSiteModal onSiteAdded={handleSiteAdded} />
                  <GenerateReportModal />
                  <ManageAlertsModal />
                  <InviteTeamModal />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plan</span>
                    <Badge className="bg-indigo-100 text-indigo-800">
                      Trial
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sites Used</span>
                    <span className="text-sm font-medium">
                      {stats.total_sites} / 1000
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (stats.total_sites / 1000) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <BillingSettingsModal />
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
