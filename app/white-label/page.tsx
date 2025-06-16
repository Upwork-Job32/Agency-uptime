"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

interface Agency {
  name: string;
  logo_url?: string;
  brand_color?: string;
  custom_domain?: string;
}

interface Report {
  id: number;
  report_type: string;
  period_start: string;
  period_end: string;
  generated_at: string;
  download_url: string;
}

interface Site {
  id: number;
  name: string;
  url: string;
  current_status: string;
}

interface DashboardData {
  agency: Agency;
  reports: Report[];
  sites: Site[];
  stats: {
    total_sites: number;
    sites_up: number;
    total_reports: number;
  };
}

export default function WhiteLabelPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/reports/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Error
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "This page is only accessible through a custom domain."}
          </p>
        </div>
      </div>
    );
  }

  const { agency, reports, sites, stats } = data;
  const brandColor = agency.brand_color || "#3B82F6";
  const uptimePercentage =
    stats.total_sites > 0
      ? ((stats.sites_up / stats.total_sites) * 100).toFixed(1)
      : 0;

  // Apply dynamic theming
  useEffect(() => {
    document.documentElement.style.setProperty("--brand-color", brandColor);
  }, [brandColor]);

  const handleDownloadReport = (reportId: number) => {
    window.open(`/api/reports/public/${reportId}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {agency.logo_url && (
                <img
                  src={agency.logo_url}
                  alt={agency.name}
                  className="h-10 w-10 object-contain"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {agency.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Uptime Monitoring Dashboard
                </p>
              </div>
            </div>
            <Badge
              className="text-white"
              style={{ backgroundColor: brandColor }}
            >
              Reports Portal
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_sites}</div>
              <p className="text-xs text-muted-foreground">
                Monitored websites
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Uptime
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {uptimePercentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.sites_up} of {stats.total_sites} sites online
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reports Generated
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_reports}</div>
              <p className="text-xs text-muted-foreground">
                Available for download
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sites Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monitored Sites</CardTitle>
            <CardDescription>
              Current status of all monitored websites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {site.current_status === "up" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <h3 className="font-medium">{site.name}</h3>
                      <p className="text-sm text-gray-600">{site.url}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      site.current_status === "up" ? "default" : "destructive"
                    }
                    className={
                      site.current_status === "up"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {site.current_status === "up" ? "Online" : "Offline"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>
              Download comprehensive uptime reports for your records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Reports Yet
                </h3>
                <p className="text-gray-600">
                  Reports will appear here once they are generated.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium capitalize">
                        {report.report_type} Report
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(report.period_start).toLocaleDateString()} -{" "}
                        {new Date(report.period_end).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Generated:{" "}
                        {new Date(report.generated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDownloadReport(report.id)}
                      style={{ backgroundColor: brandColor }}
                      className="text-white hover:opacity-90"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              Powered by <span className="font-medium">{agency.name}</span>{" "}
              Uptime Monitoring
            </p>
            {agency.custom_domain && (
              <p className="mt-1">
                Visit:{" "}
                <span className="font-medium">
                  reports.{agency.custom_domain}
                </span>
              </p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
