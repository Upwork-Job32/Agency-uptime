"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Globe,
  Clock,
} from "lucide-react";

interface Site {
  id: number;
  name: string;
  url: string;
  current_status: string;
  last_response_time?: number;
  last_checked?: string;
}

interface Agency {
  id: number;
  name: string;
  logo_url?: string;
  brand_color?: string;
  custom_domain?: string;
}

interface StatusData {
  agency: Agency;
  sites: Site[];
  overall_status: string;
  last_updated: string;
}

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { agency, sites, overall_status, last_updated } = data || {};
  const brandColor = agency?.brand_color || "#3B82F6";

  useEffect(() => {
    if (agency) {
      document.title = `Status - ${agency.name}`;
    }
  }, [agency]);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const urlParams = new URLSearchParams(window.location.search);
        const agencyId = urlParams.get("agency");
        const customDomain = urlParams.get("domain");

        let fetchUrl = `${API_BASE_URL}/api/white-label/status`;

        if (agencyId) {
          fetchUrl += `?agency=${agencyId}`;
        } else if (customDomain) {
          fetchUrl += `?domain=${customDomain}`;
        }

        const response = await fetch(fetchUrl);

        if (!response.ok) {
          setError("Failed to load status data");
          return;
        }

        const statusData = await response.json();
        setData(statusData);
      } catch (err) {
        console.error("Status data fetch error:", err);
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatusData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "down":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
        return "bg-green-100 text-green-800";
      case "down":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading system status...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Status Unavailable
          </h1>
          <p className="text-gray-600">
            {error || "Unable to load system status."}
          </p>
        </div>
      </div>
    );
  }

  const sitesUp = sites?.filter((s) => s.current_status === "up").length || 0;
  const totalSites = sites?.length || 0;
  const uptime = totalSites > 0 ? (sitesUp / totalSites) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {agency?.logo_url && (
                <img
                  src={agency.logo_url}
                  alt={`${agency?.name} Logo`}
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {agency?.name} Status
                </h1>
                <p className="text-sm text-gray-600">
                  System Health & Uptime Status
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                className="text-white font-medium"
                style={{ backgroundColor: brandColor }}
              >
                <Activity className="w-3 h-3 mr-1" />
                Live Status
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Status */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(overall_status || "up")}
                <div>
                  <CardTitle className="text-2xl">
                    {overall_status === "up"
                      ? "All Systems Operational"
                      : "System Issues Detected"}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {sitesUp} of {totalSites} services are operational (
                    {uptime.toFixed(1)}% uptime)
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Last updated:{" "}
                  {last_updated ? formatTime(last_updated) : "Just now"}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Services Status */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Services Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(sites || []).map((site) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(site.current_status)}
                    <div>
                      <h3 className="font-medium">{site.name}</h3>
                      <p className="text-sm text-gray-600">{site.url}</p>
                      {site.last_checked && (
                        <p className="text-xs text-gray-500">
                          Last checked: {formatTime(site.last_checked)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(site.current_status)}>
                      {site.current_status === "up" ? "Operational" : "Down"}
                    </Badge>
                    {site.last_response_time && (
                      <p className="text-xs text-gray-500 mt-1">
                        Response: {site.last_response_time}ms
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {(!sites || sites.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No services are currently being monitored.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500">
            <p className="text-sm">
              Powered by {agency?.name || "Agency Uptime"}
            </p>
            <p className="text-xs mt-1">
              Status page automatically refreshes every 30 seconds
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
