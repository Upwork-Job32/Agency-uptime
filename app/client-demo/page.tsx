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
  CreditCard,
  Star,
  Lock,
  Unlock,
  DollarSign,
} from "lucide-react";

interface MockSite {
  id: number;
  name: string;
  url: string;
  status: "up" | "down" | "warning";
  uptime: number;
  response_time: number;
  last_checked: string;
}

interface PricingPlan {
  name: string;
  price: number;
  sites: number;
  features: string[];
  popular?: boolean;
}

export default function ClientDemoPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPricing, setShowPricing] = useState(false);

  // Agency branding (this would come from API in real implementation)
  const agency = {
    name: "TechGuard Solutions",
    logo_url: "https://via.placeholder.com/120x40/3B82F6/FFFFFF?text=TechGuard",
    brand_color: "#3B82F6",
    custom_domain: "techguard.com",
  };

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Mock data showing what client would see
  const mockSites: MockSite[] = [
    {
      id: 1,
      name: "Your Main Website",
      url: "https://your-website.com",
      status: "up",
      uptime: 99.98,
      response_time: 245,
      last_checked: new Date(Date.now() - 30000).toISOString(),
    },
    {
      id: 2,
      name: "E-commerce Store",
      url: "https://your-store.com",
      status: "up",
      uptime: 99.95,
      response_time: 312,
      last_checked: new Date(Date.now() - 45000).toISOString(),
    },
    {
      id: 3,
      name: "Blog Platform",
      url: "https://your-blog.com",
      status: "warning",
      uptime: 99.8,
      response_time: 850,
      last_checked: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: 4,
      name: "API Service",
      url: "https://api.your-domain.com",
      status: "up",
      uptime: 99.92,
      response_time: 180,
      last_checked: new Date(Date.now() - 20000).toISOString(),
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Basic Monitoring",
      price: 29,
      sites: 5,
      features: [
        "24/7 uptime monitoring",
        "Email notifications",
        "Basic reporting",
        "Response time tracking",
        "SSL monitoring",
      ],
    },
    {
      name: "Professional",
      price: 59,
      sites: 15,
      features: [
        "Everything in Basic",
        "SMS notifications",
        "Advanced reporting",
        "Custom integrations",
        "Priority support",
        "White-label status pages",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: 99,
      sites: 50,
      features: [
        "Everything in Professional",
        "Phone call alerts",
        "Custom SLA monitoring",
        "Advanced analytics",
        "Dedicated account manager",
        "API access",
      ],
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
      {/* Demo Notice Banner */}
      <div className="bg-blue-600 text-white p-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                🚀 This is what your monitoring dashboard will look like - Start
                your free trial today!
              </span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowPricing(true)}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>

      {/* Header with Agency Branding */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img
                src={agency.logo_url}
                alt={`${agency.name} Logo`}
                className="h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {agency.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Website Monitoring Dashboard
                </p>
                <p className="text-xs text-gray-500">
                  reports.{agency.custom_domain}
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
              <Badge
                className="text-white font-medium"
                style={{ backgroundColor: agency.brand_color }}
              >
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
                {stats.sites_up} online • {stats.sites_warning} warnings
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
                Monthly Savings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$2,400</div>
              <p className="text-xs text-muted-foreground">
                Downtime prevented
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sites Monitor */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Websites</CardTitle>
                  <p className="text-sm text-gray-600">
                    Real-time monitoring of all your websites
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked - Upgrade to Access
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSites.map((site, index) => (
                    <div
                      key={site.id}
                      className={`flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 ${
                        index >= 2 ? "opacity-50 relative" : ""
                      }`}
                    >
                      {index >= 2 && (
                        <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm font-medium text-gray-600">
                              Upgrade to monitor more sites
                            </p>
                          </div>
                        </div>
                      )}
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

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">
                        Ready to start monitoring?
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Get instant alerts when your websites go down. Start
                        your free trial today!
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowPricing(true)}
                      style={{ backgroundColor: agency.brand_color }}
                      className="text-white hover:opacity-90"
                    >
                      Start Free Trial
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profit Calculator & Features */}
          <div className="space-y-6">
            {/* Profit Calculator */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Your ROI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        $2,400
                      </div>
                      <p className="text-sm text-green-600">
                        Monthly savings from prevented downtime
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cost per minute down:</span>
                      <span className="font-medium">$20</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Downtime prevented:</span>
                      <span className="font-medium">120 min/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monitoring cost:</span>
                      <span className="font-medium">-$59</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Net monthly savings:</span>
                      <span className="text-green-600">$2,341</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Preview */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>What You Get</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded border">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">24/7 uptime monitoring</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded border">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Instant email alerts</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded border">
                    <Smartphone className="w-4 h-4 text-green-500" />
                    <span className="text-sm">SMS notifications</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded border">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Detailed reports</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded border">
                    <Shield className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">SSL monitoring</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowPricing(true)}
                  className="w-full mt-4"
                  style={{ backgroundColor: agency.brand_color }}
                >
                  View All Plans
                </Button>
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
      </main>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Choose Your Plan</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPricing(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`border rounded-lg p-6 relative ${
                      plan.popular
                        ? "border-blue-500 ring-2 ring-blue-100"
                        : "border-gray-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">
                          ${plan.price}
                        </span>
                        <span className="text-gray-500">/month</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Up to {plan.sites} websites
                      </p>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      style={{
                        backgroundColor: plan.popular
                          ? agency.brand_color
                          : "transparent",
                        color: plan.popular ? "white" : agency.brand_color,
                        border: plan.popular
                          ? "none"
                          : `1px solid ${agency.brand_color}`,
                      }}
                    >
                      Start Free Trial
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center text-sm text-gray-600">
                <p>✓ 30-day free trial • ✓ No setup fees • ✓ Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
