"use client";

import { useState } from "react";
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

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const { user, logout } = useAuth();

  // Mock data for dashboard
  const stats = {
    totalSites: 12,
    upSites: 11,
    downSites: 1,
    avgUptime: 99.2,
    alertsToday: 3,
    responseTime: 245,
  };

  const sites = [
    {
      id: 1,
      name: "example.com",
      status: "up",
      uptime: 99.9,
      responseTime: 210,
      lastCheck: "2 min ago",
      alerts: 0,
    },
    {
      id: 2,
      name: "api.example.com",
      status: "up",
      uptime: 100,
      responseTime: 180,
      lastCheck: "1 min ago",
      alerts: 0,
    },
    {
      id: 3,
      name: "app.example.com",
      status: "down",
      uptime: 98.5,
      responseTime: 0,
      lastCheck: "5 min ago",
      alerts: 2,
    },
    {
      id: 4,
      name: "blog.example.com",
      status: "up",
      uptime: 99.8,
      responseTime: 320,
      lastCheck: "3 min ago",
      alerts: 1,
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      site: "app.example.com",
      type: "DOWN",
      message: "HTTP 500 - Internal Server Error",
      time: "5 minutes ago",
      severity: "critical",
    },
    {
      id: 2,
      site: "blog.example.com",
      type: "SLOW",
      message: "Response time above 3s threshold",
      time: "2 hours ago",
      severity: "warning",
    },
    {
      id: 3,
      site: "api.example.com",
      type: "SSL",
      message: "SSL certificate expires in 7 days",
      time: "1 day ago",
      severity: "info",
    },
  ];

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
                  Monitor your clients' websites and track performance
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
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Sites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.totalSites}
                </div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +2 this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Up
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {stats.upSites}
                </div>
                <div className="text-sm text-gray-500 mt-1">Sites online</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Down
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {stats.downSites}
                </div>
                <div className="text-sm text-gray-500 mt-1">Sites offline</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Avg Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.avgUptime}%
                </div>
                <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.responseTime}ms
                </div>
                <div className="text-sm text-gray-500 mt-1">Average</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="sites" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="sites">Sites</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="sites" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Monitored Sites</CardTitle>
                          <CardDescription>
                            Manage and monitor your clients' websites
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search sites..."
                              className="pl-10 w-64"
                            />
                          </div>
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {sites.map((site) => (
                          <div
                            key={site.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                {site.status === "up" ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                <span className="font-medium text-gray-900">
                                  {site.name}
                                </span>
                              </div>
                              <Badge
                                variant={
                                  site.status === "up"
                                    ? "default"
                                    : "destructive"
                                }
                                className={
                                  site.status === "up"
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }
                              >
                                {site.status.toUpperCase()}
                              </Badge>
                              {site.alerts > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="bg-red-100 text-red-800"
                                >
                                  {site.alerts} alerts
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">
                                  {site.uptime}%
                                </span>
                                <span className="text-gray-400 ml-1">
                                  uptime
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">
                                  {site.responseTime}ms
                                </span>
                                <span className="text-gray-400 ml-1">
                                  response
                                </span>
                              </div>
                              <div>
                                <Clock className="h-4 w-4 inline mr-1" />
                                {site.lastCheck}
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Alerts</CardTitle>
                      <CardDescription>
                        Stay informed about your sites' status changes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentAlerts.map((alert) => (
                          <div
                            key={alert.id}
                            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-shrink-0">
                              {alert.severity === "critical" && (
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                              )}
                              {alert.severity === "warning" && (
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                              )}
                              {alert.severity === "info" && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {alert.site}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {alert.message}
                                  </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {alert.time}
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={`mt-2 ${
                                  alert.severity === "critical"
                                    ? "text-red-600 border-red-200"
                                    : alert.severity === "warning"
                                    ? "text-yellow-600 border-yellow-200"
                                    : "text-blue-600 border-blue-200"
                                }`}
                              >
                                {alert.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Reports</CardTitle>
                      <CardDescription>
                        Generate and download branded reports for your clients
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          "November 2024",
                          "October 2024",
                          "September 2024",
                        ].map((month, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {month} Report
                              </h4>
                              <p className="text-sm text-gray-600">
                                12 sites monitored
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">
                                Generated
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Site
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Alerts
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Team
                  </Button>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Plan</span>
                      <Badge className="bg-indigo-100 text-indigo-800">
                        Professional
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sites Used</span>
                      <span className="text-sm font-medium">12 / 100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: "12%" }}
                      ></div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        action: "Site added",
                        site: "new-client.com",
                        time: "2h ago",
                      },
                      {
                        action: "Alert sent",
                        site: "app.example.com",
                        time: "5h ago",
                      },
                      {
                        action: "Report generated",
                        site: "All sites",
                        time: "1d ago",
                      },
                      {
                        action: "Site updated",
                        site: "api.example.com",
                        time: "2d ago",
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-600">
                            {activity.site}
                          </p>
                          <p className="text-xs text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
