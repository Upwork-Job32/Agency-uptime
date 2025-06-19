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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Palette,
  Eye,
  ExternalLink,
  Check,
  AlertTriangle,
  Copy,
  Users,
  BarChart3,
} from "lucide-react";

interface Agency {
  id: number;
  name: string;
  email: string;
  logo_url?: string;
  brand_color?: string;
  custom_domain?: string;
  subscription_status: string;
}

export default function WhiteLabelSettings() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form states
  const [brandColor, setBrandColor] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    fetchAgencyData();
  }, []);

  const fetchAgencyData = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgency(data.agency);
        setBrandColor(data.agency.brand_color || "#3B82F6");
        setCustomDomain(data.agency.custom_domain || "");
        setLogoUrl(data.agency.logo_url || "");
      }
    } catch (error) {
      console.error("Error fetching agency data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brand_color: brandColor,
          custom_domain: customDomain,
          logo_url: logoUrl,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "White-label settings saved successfully!",
        });
        fetchAgencyData(); // Refresh data
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to save settings",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: "success", text: "Copied to clipboard!" });
  };

  // For development, use local server with agency ID parameter
  // For production, this would route through custom domains
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const FRONTEND_URL =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  const previewUrl = customDomain
    ? `https://${customDomain}`
    : `${FRONTEND_URL}/portal?agency=${agency?.id}`;
  // Removed template portal URL since template page was deleted
  const statusPageUrl = customDomain
    ? `${API_BASE_URL}/api/white-label/status?agency=${agency?.id}`
    : `${API_BASE_URL}/api/white-label/status?agency=${agency?.id}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isPro = agency?.subscription_status === "active";

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">White-Label Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure your branded monitoring portal for clients
          </p>
        </div>
        <Badge
          variant={isPro ? "default" : "secondary"}
          className={isPro ? "bg-green-100 text-green-800" : ""}
        >
          {isPro ? "Pro Plan" : "Free Plan"}
        </Badge>
      </div>

      {!isPro && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            White-label features are in demo mode.
            <Button variant="link" className="p-0 ml-2 h-auto">
              Upgrade to Pro for full features
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="branding">
            <Palette className="w-4 h-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="domain">
            <Globe className="w-4 h-4 mr-2" />
            Domain
          </TabsTrigger>

          <TabsTrigger value="preview">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Customization</CardTitle>
              <CardDescription>
                Customize the appearance of your white-label portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand-color">Brand Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="brand-color"
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-20 h-10"
                      disabled={false}
                    />
                    <Input
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      placeholder="#3B82F6"
                      disabled={false}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    This color will be used for buttons, badges, and accents
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input
                    id="logo-url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://your-domain.com/logo.png"
                    disabled={false}
                  />
                  <p className="text-sm text-gray-500">
                    URL to your agency logo (recommended: 200x60px)
                  </p>
                </div>
              </div>

              {logoUrl && (
                <div className="border rounded-lg p-4">
                  <Label className="text-sm font-medium">Logo Preview</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="h-12 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="text-sm text-gray-500">
                      Logo will appear in the portal header
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain Configuration</CardTitle>
              <CardDescription>
                Set up your custom domain for the white-label portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="custom-domain">Custom Domain</Label>
                <Input
                  id="custom-domain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="monitoring.youragency.com"
                  disabled={false}
                />
                <p className="text-sm text-gray-500">
                  Enter your custom domain without https://
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  DNS Setup Instructions
                </h4>
                <div className="text-sm text-blue-800 space-y-2">
                  <p>1. Add a CNAME record in your DNS settings:</p>
                  <div className="bg-white rounded border p-2 font-mono text-xs">
                    <strong>Type:</strong> CNAME
                    <br />
                    <strong>Name:</strong> monitoring (or your subdomain)
                    <br />
                    <strong>Value:</strong> your-app-domain.com
                  </div>
                  <p>2. Wait for DNS propagation (up to 24 hours)</p>
                  <p>3. Your portal will be accessible at your custom domain</p>
                </div>
              </div>

              {customDomain && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Status Page URL</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Status Page</div>
                        <div className="text-sm text-gray-600">
                          {statusPageUrl}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(statusPageUrl)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portal Preview</CardTitle>
              <CardDescription>
                See how your white-label portal will look to clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-white p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="h-8 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="font-bold">
                        {agency?.name || "Your Agency"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Website Uptime & Performance Dashboard
                      </p>
                    </div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: brandColor }}
                  >
                    Monitoring Portal
                  </div>
                </div>
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-sm text-gray-600">Total Sites</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        99.9%
                      </div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-gray-600">Reports</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium mb-3">Monitored Websites</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">Example Website</div>
                          <div className="text-sm text-gray-600">
                            https://example.com
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => window.open(statusPageUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Status Page
                </Button>
                {!customDomain && (
                  <div className="text-xs text-gray-500 mt-2">
                    💡 For development testing - configure custom domain for
                    production
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="px-8">
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
