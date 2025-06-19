"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";

interface AgencyData {
  id: number;
  name: string;
  logo_url?: string;
  brand_color?: string;
  custom_domain?: string;
  pricing_settings?: any;
}

interface MockSite {
  id: number;
  name: string;
  url: string;
  status: "up" | "down";
  uptime: number;
  response_time: number;
  last_checked: string;
}

interface MockReport {
  id: number;
  title: string;
  date: string;
  type: string;
}

export default function PortalPreview() {
  const searchParams = useSearchParams();
  const agencyId = searchParams.get("agency");

  const [agency, setAgency] = useState<AgencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Mock data for preview
  const mockSites: MockSite[] = [
    {
      id: 1,
      name: "Main Website",
      url: "https://example.com",
      status: "up",
      uptime: 99.9,
      response_time: 245,
      last_checked: new Date().toISOString(),
    },
    {
      id: 2,
      name: "E-commerce Store",
      url: "https://shop.example.com",
      status: "up",
      uptime: 99.8,
      response_time: 312,
      last_checked: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: 3,
      name: "API Endpoint",
      url: "https://api.example.com",
      status: "down",
      uptime: 98.5,
      response_time: 0,
      last_checked: new Date(Date.now() - 300000).toISOString(),
    },
  ];

  const mockReports: MockReport[] = [
    {
      id: 1,
      title: "Monthly Uptime Report - December 2024",
      date: "2024-12-01",
      type: "monthly",
    },
    {
      id: 2,
      title: "Weekly Performance Summary",
      date: "2024-11-25",
      type: "weekly",
    },
  ];

  const mockStats = {
    total_sites: mockSites.length,
    sites_up: mockSites.filter((s) => s.status === "up").length,
    uptime_percentage: 99.1,
    avg_response_time: 279,
    total_reports: mockReports.length,
  };

  useEffect(() => {
    const fetchAgencyData = async () => {
      if (!agencyId) {
        setError("Agency ID is required");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/api/white-label/agency/${agencyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAgency(data.agency);
        } else {
          setError("Failed to load agency data");
        }
      } catch (error) {
        console.error("Error fetching agency data:", error);
        setError("Failed to load agency data");
      } finally {
        setLoading(false);
      }
    };

    fetchAgencyData();
  }, [agencyId, API_BASE_URL]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portal preview...</p>
        </div>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Preview Error
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "Unable to load portal preview."}
          </p>
          <Button onClick={() => window.close()}>Close Preview</Button>
        </div>
      </div>
    );
  }

  const brandColor = agency.brand_color || "#3B82F6";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Preview Notice Banner */}
      <div className="bg-yellow-100 border-b border-yellow-200 p-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-800">
                🎨 Portal Preview Mode - This is how your clients will see their
                dashboard
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.close()}
              className="text-yellow-800 border-yellow-300"
            >
              Close Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Header with Agency Branding */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {agency.logo_url && (
                <img
                  src={agency.logo_url}
                  alt={`${agency.name} Logo`}
                  className="h-12 w-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {agency.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Website Uptime & Performance Dashboard
                </p>
                {agency.custom_domain && (
                  <p className="text-xs text-gray-500">
                    reports.{agency.custom_domain}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge
                className="text-white font-medium"
                style={{ backgroundColor: brandColor }}
              >
                <Shield className="w-3 h-3 mr-1" />
                Monitoring Portal
              </Badge>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-1" />
                Status Page
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.total_sites}</div>
              <p className="text-xs text-muted-foreground">
                Monitored websites
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Uptime
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockStats.uptime_percentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {mockStats.sites_up} of {mockStats.total_sites} sites online
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Status
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {mockStats.sites_up === mockStats.total_sites ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      All Operational
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600">
                      Issues Detected
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                System health status
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reports Available
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockStats.total_reports}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for download
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sites Status */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Monitored Websites</CardTitle>
              <p className="text-sm text-gray-600">
                Real-time status of all monitored websites
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSites.map((site) => (
                  <div
                    key={site.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50"
                  >
                    <div className="flex items-center space-x-3">
                      {site.status === "up" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <h3 className="font-medium">{site.name}</h3>
                        <p className="text-sm text-gray-600">{site.url}</p>
                        <p className="text-xs text-gray-500">
                          Last checked: {formatTime(site.last_checked)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          site.status === "up" ? "default" : "destructive"
                        }
                        className={
                          site.status === "up"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {site.status === "up" ? "Online" : "Offline"}
                      </Badge>
                      {site.status === "up" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {site.response_time}ms
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reports Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
              <p className="text-sm text-gray-600">
                Downloadable reports with detailed analytics
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50"
                  >
                    <div className="flex items-center space-x-3">
                      <BarChart3
                        className="h-5 w-5"
                        style={{ color: brandColor }}
                      />
                      <div>
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm text-gray-600">
                          Generated on{" "}
                          {new Date(report.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="opacity-50 cursor-not-allowed"
                      disabled
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}

                {mockReports.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No reports available yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer with Agency Branding */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500">
            <p className="text-sm">Powered by {agency.name}</p>
            {agency.custom_domain && (
              <p className="text-xs mt-1">
                Visit: reports.{agency.custom_domain}
              </p>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}
