"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ExternalLink,
  Plus,
  Settings,
  Bell,
  Smartphone,
  Mail,
  Phone,
  Zap,
  Monitor,
  Timer,
  Users,
  Eye,
} from "lucide-react";

interface MockSite {
  id: number;
  name: string;
  url: string;
  status: "up" | "down" | "warning";
  uptime: number;
  response_time: number;
  last_checked: string;
  ssl_status: "valid" | "expiring" | "expired";
  ssl_expires: string;
}

interface MockAlert {
  id: number;
  site_name: string;
  type: "downtime" | "slow_response" | "ssl_expiry";
  message: string;
  timestamp: string;
  resolved: boolean;
}

export default function CustomPortalPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Mock data for the portal
  const mockSites: MockSite[] = [
    {
      id: 1,
      name: "Main Website",
      url: "https://example.com",
      status: "up",
      uptime: 99.98,
      response_time: 245,
      last_checked: new Date(Date.now() - 30000).toISOString(),
      ssl_status: "valid",
      ssl_expires: "2025-06-15",
    },
    {
      id: 2,
      name: "E-commerce Store",
      url: "https://shop.example.com",
      status: "up",
      uptime: 99.95,
      response_time: 312,
      last_checked: new Date(Date.now() - 45000).toISOString(),
      ssl_status: "valid",
      ssl_expires: "2025-03-20",
    },
    {
      id: 3,
      name: "API Service",
      url: "https://api.example.com",
      status: "warning",
      uptime: 99.8,
      response_time: 850,
      last_checked: new Date(Date.now() - 60000).toISOString(),
      ssl_status: "expiring",
      ssl_expires: "2024-12-25",
    },
    {
      id: 4,
      name: "Blog Platform",
      url: "https://blog.example.com",
      status: "down",
      uptime: 98.2,
      response_time: 0,
      last_checked: new Date(Date.now() - 300000).toISOString(),
      ssl_status: "valid",
      ssl_expires: "2025-08-10",
    },
    {
      id: 5,
      name: "Customer Portal",
      url: "https://portal.example.com",
      status: "up",
      uptime: 99.92,
      response_time: 180,
      last_checked: new Date(Date.now() - 20000).toISOString(),
      ssl_status: "valid",
      ssl_expires: "2025-04-30",
    },
  ];

  const mockAlerts: MockAlert[] = [
    {
      id: 1,
      site_name: "Blog Platform",
      type: "downtime",
      message: "Site is currently unreachable - HTTP 500 error",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      resolved: false,
    },
    {
      id: 2,
      site_name: "API Service",
      type: "slow_response",
      message: "Response time exceeded 500ms threshold (850ms)",
      timestamp: new Date(Date.now() - 180000).toISOString(),
      resolved: false,
    },
    {
      id: 3,
      site_name: "API Service",
      type: "ssl_expiry",
      message: "SSL certificate expires in 25 days",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      resolved: false,
    },
  ];

  const stats = {
    total_sites: mockSites.length,
    sites_up: mockSites.filter((s) => s.status === "up").length,
    sites_warning: mockSites.filter((s) => s.status === "warning").length,
    sites_down: mockSites.filter((s) => s.status === "down").length,
    avg_uptime: (
      mockSites.reduce((sum, site) => sum + site.uptime, 0) / mockSites.length
    ).toFixed(2),
    avg_response_time: Math.round(
      mockSites
        .filter((s) => s.status !== "down")
        .reduce((sum, site) => sum + site.response_time, 0) /
        mockSites.filter((s) => s.status !== "down").length
    ),
    active_alerts: mockAlerts.filter((a) => !a.resolved).length,
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "down":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "down":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                <Monitor className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Monitoring Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Professional Website Uptime & Performance Monitoring
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
              <Badge className="bg-blue-600 text-white font-medium">
                <Shield className="w-3 h-3 mr-1" />
                Live Monitoring
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_sites}</div>
              <p className="text-xs text-muted-foreground">
                {stats.sites_up} online • {stats.sites_down} offline
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Uptime
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.avg_uptime}%
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Response Time
              </CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avg_response_time}ms
              </div>
              <p className="text-xs text-muted-foreground">Average response</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Alerts
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.active_alerts}
              </div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sites Monitor */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Website Status</CardTitle>
                  <p className="text-sm text-gray-600">
                    Real-time monitoring of all your websites
                  </p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Site
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSites.map((site) => (
                    <div
                      key={site.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(site.status)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{site.name}</h3>
                            <Badge
                              className={`text-xs ${getStatusColor(
                                site.status
                              )}`}
                            >
                              {site.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{site.url}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>Uptime: {site.uptime}%</span>
                            {site.status !== "down" && (
                              <span>Response: {site.response_time}ms</span>
                            )}
                            <span>SSL: {site.ssl_status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p>Last check:</p>
                        <p>{formatTime(site.last_checked)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Reports */}
          <div className="space-y-6">
            {/* Active Alerts */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAlerts
                    .filter((a) => !a.resolved)
                    .map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3 border-l-4 border-orange-400 bg-orange-50 rounded"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">
                              {alert.site_name}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(alert.timestamp)}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {alert.type.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Notification Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Status Page
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Channels */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Email Alerts</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-green-600" />
                      <span className="text-sm">SMS Alerts</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Voice Calls</span>
                    </div>
                    <Badge variant="outline">Upgrade</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">Slack Integration</span>
                    </div>
                    <Badge variant="outline">Configure</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500">
            <p className="text-sm">Professional Website Monitoring Portal</p>
            <p className="text-xs mt-1">
              Powered by Advanced Monitoring Technology
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
