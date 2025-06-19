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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Settings,
  Eye,
  Plus,
  AlertCircle,
  Check,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface Agency {
  id: number;
  name: string;
  email: string;
  logo_url?: string;
  brand_color?: string;
  custom_domain?: string;
  subscription_status: string;
  client_count: number;
  total_monthly_revenue: number;
  estimated_profit: number;
  has_pro_plan: boolean;
}

interface Client {
  id: number;
  name: string;
  email: string;
  company?: string;
  is_active: boolean;
  activated_at?: string;
  invitation_token?: string;
}

interface ResellStatus {
  resell_enabled: boolean;
  has_pro_plan: boolean;
  platform_cost: number;
  estimated_profit: number;
  stats: {
    total_clients: number;
    active_clients: number;
    pending_invitations: number;
    total_revenue: number;
    avg_price: number;
  };
  setup_steps: {
    branding_complete: boolean;
    domain_configured: boolean;
    clients_invited: boolean;
  };
}

export default function WhiteLabelPage() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [resellStatus, setResellStatus] = useState<ResellStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Form states
  const [brandingForm, setBrandingForm] = useState({
    name: "",
    logo_url: "",
    brand_color: "#3B82F6",
  });

  const [domainForm, setDomainForm] = useState({
    subdomain: "",
    custom_domain: "",
  });

  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    company: "",
    sites: [],
  });
  const [pricingSettings, setPricingSettings] = useState({
    basic_plan: {
      name: "Basic Monitoring",
      price: 29,
      sites: 5,
      check_interval: 5,
      features: [
        "24/7 uptime monitoring",
        "Email notifications",
        "Basic reporting",
        "Response time tracking",
      ],
    },
    standard_plan: {
      name: "Standard Monitoring",
      price: 59,
      sites: 15,
      check_interval: 1,
      features: [
        "Everything in Basic",
        "SMS notifications",
        "Advanced reporting",
        "SSL certificate monitoring",
        "Domain expiry alerts",
      ],
    },
    premium_plan: {
      name: "Premium Monitoring",
      price: 99,
      sites: 50,
      check_interval: 1,
      features: [
        "Everything in Standard",
        "Phone call alerts",
        "Custom integrations",
        "White-label status pages",
        "Priority support",
      ],
    },
  });

  const [showInviteDialog, setShowInviteDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const [configRes, clientsRes, resellRes, pricingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/white-label/config`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/white-label/resell-status`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/white-label/pricing`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (configRes.ok) {
        const configData = await configRes.json();
        setAgency(configData.agency);
        setBrandingForm({
          name: configData.agency.name || "",
          logo_url: configData.agency.logo_url || "",
          brand_color: configData.agency.brand_color || "#3B82F6",
        });
      }

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData.clients || []);
      }

      if (resellRes.ok) {
        const resellData = await resellRes.json();
        setResellStatus(resellData);
      }

      if (pricingRes.ok) {
        const pricingData = await pricingRes.json();
        if (pricingData.pricing_settings) {
          setPricingSettings(pricingData.pricing_settings);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandingUpdate = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/api/white-label/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brandingForm),
      });

      if (response.ok) {
        await fetchData();
        alert("Branding updated successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to update branding: ${error.error}`);
      }
    } catch (error) {
      console.error("Branding update error:", error);
      alert("Failed to update branding");
    } finally {
      setSaving(false);
    }
  };

  const handlePricingUpdate = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/api/white-label/pricing`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pricing_settings: pricingSettings,
        }),
      });

      if (response.ok) {
        alert("Pricing settings updated successfully!");
        await fetchData();
      } else {
        const error = await response.json();
        alert(`Failed to update pricing: ${error.error}`);
      }
    } catch (error) {
      console.error("Pricing update error:", error);
      alert("Failed to update pricing settings");
    } finally {
      setSaving(false);
    }
  };

  const handleInviteClient = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/api/clients/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_name: clientForm.name,
          client_email: clientForm.email,
          client_company: clientForm.company,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.email_sent) {
          alert(
            `✅ Client invited successfully!\n\nInvitation email has been sent to ${clientForm.email}\n\nInvitation link: ${data.invitation_link}`
          );
        } else {
          alert(
            `⚠️ ${data.message}\n\nInvitation link: ${data.invitation_link}\n\nPlease share this link manually with the client.`
          );
        }
        setShowInviteDialog(false);
        setClientForm({
          name: "",
          email: "",
          company: "",
          sites: [],
        });
        await fetchData();
      } else {
        const error = await response.json();
        alert(`❌ Failed to invite client: ${error.error}`);
      }
    } catch (error) {
      console.error("Client invitation error:", error);
      alert("Failed to invite client");
    } finally {
      setSaving(false);
    }
  };

  const handleSetupSubdomain = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${API_BASE_URL}/api/white-label/setup-subdomain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subdomain: domainForm.subdomain }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(
          `Subdomain created successfully! Your portal is available at: ${data.portal_url}`
        );
        await fetchData();
      } else {
        const error = await response.json();
        alert(`Failed to setup subdomain: ${error.error}`);
      }
    } catch (error) {
      console.error("Subdomain setup error:", error);
      alert("Failed to setup subdomain");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyCustomDomain = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${API_BASE_URL}/api/white-label/verify-custom-domain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ custom_domain: domainForm.custom_domain }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(
          `Custom domain verified successfully! Your portal is available at: ${data.portal_url}`
        );
        await fetchData();
      } else {
        const error = await response.json();
        alert(`Failed to verify custom domain: ${error.error}`);
      }
    } catch (error) {
      console.error("Custom domain verification error:", error);
      alert("Failed to verify custom domain");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isPro = agency?.subscription_status === "active";

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">White-Label Resell System</h1>
          <p className="text-gray-600 mt-2">
            Configure your white-label branding and invite clients
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
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <h3 className="font-medium text-yellow-800">
                Upgrade to Pro Required
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                White-label features and client invitations are only available
                on the Pro plan.
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Clients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resellStatus?.stats.total_clients || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {resellStatus?.stats.active_clients || 0} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Invitations
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resellStatus?.stats.pending_invitations || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting activation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Setup Progress
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resellStatus?.setup_steps
                    ? Object.values(resellStatus.setup_steps).filter(Boolean)
                        .length
                    : 0}
                  /3
                </div>
                <p className="text-xs text-muted-foreground">
                  Setup steps completed
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Setup Steps</CardTitle>
              <CardDescription>
                Complete these steps to start inviting clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                {resellStatus?.setup_steps?.branding_complete ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
                <div className="flex-1">
                  <p className="font-medium">Configure Branding</p>
                  <p className="text-sm text-gray-600">
                    Set up your logo, colors, and agency name
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("branding")}
                >
                  {resellStatus?.setup_steps?.branding_complete
                    ? "Edit"
                    : "Setup"}
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                {resellStatus?.setup_steps?.clients_invited ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
                <div className="flex-1">
                  <p className="font-medium">Invite Clients</p>
                  <p className="text-sm text-gray-600">
                    Send invitations to your first clients
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("clients")}
                >
                  {resellStatus?.setup_steps?.clients_invited
                    ? "Manage"
                    : "Invite"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {isPro && (
            <Card>
              <CardHeader>
                <CardTitle>White-Label Portal Ready</CardTitle>
                <CardDescription>
                  Your customized portal is configured with your branding and
                  includes all monitoring features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-medium mb-2 text-blue-900">
                    White-Label Features
                  </h3>
                  <div className="text-sm text-blue-800 space-y-1 mb-3">
                    <p>✓ Custom branding with your logo and colors</p>
                    <p>✓ Status page monitoring</p>
                    <p>✓ Custom domain configuration</p>
                    <p>✓ Client management system</p>
                    <p>✓ Mobile-responsive design</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      const previewUrl = `${window.location.origin}/portal-preview?agency=${agency?.id}`;
                      window.open(previewUrl, "_blank");
                    }}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Preview Your Portal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>White-Label Branding</CardTitle>
              <CardDescription>
                Customize the appearance of your white-label system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="agency_name">Agency Name</Label>
                    <Input
                      id="agency_name"
                      value={brandingForm.name}
                      onChange={(e) =>
                        setBrandingForm({
                          ...brandingForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Your Agency Name"
                      disabled={!isPro}
                    />
                  </div>

                  <div>
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input
                      id="logo_url"
                      value={brandingForm.logo_url}
                      onChange={(e) =>
                        setBrandingForm({
                          ...brandingForm,
                          logo_url: e.target.value,
                        })
                      }
                      placeholder="https://example.com/logo.png"
                      disabled={!isPro}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Logo will appear in the portal header
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="brand_color">Brand Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="brand_color"
                        type="color"
                        value={brandingForm.brand_color}
                        onChange={(e) =>
                          setBrandingForm({
                            ...brandingForm,
                            brand_color: e.target.value,
                          })
                        }
                        className="w-16 h-10"
                        disabled={!isPro}
                      />
                      <Input
                        value={brandingForm.brand_color}
                        onChange={(e) =>
                          setBrandingForm({
                            ...brandingForm,
                            brand_color: e.target.value,
                          })
                        }
                        placeholder="#3B82F6"
                        disabled={!isPro}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleBrandingUpdate}
                    disabled={saving || !isPro}
                  >
                    {saving ? "Saving..." : "Save Branding"}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Preview</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-white p-4 border-b flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {brandingForm.logo_url && (
                          <img
                            src={brandingForm.logo_url}
                            alt="Logo"
                            className="h-8 object-contain"
                          />
                        )}
                        <div>
                          <h3 className="font-bold">
                            {brandingForm.name || "Your Agency"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Website Monitoring Dashboard
                          </p>
                        </div>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: brandingForm.brand_color }}
                      >
                        Status Portal
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50">
                      <h4 className="font-medium mb-2">Sample Status Page</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded bg-white">
                          <span>Website Monitoring</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            Operational
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          {!isPro ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Pro Plan Required
                  </h3>
                  <p className="text-gray-600">
                    Upgrade to Pro to configure custom pricing for your clients
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Configuration</CardTitle>
                  <CardDescription>
                    Set up your monitoring service pricing plans that clients
                    will see
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Plan */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Basic Plan</h3>
                      <Badge variant="outline">Entry Level</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="basic-name">Plan Name</Label>
                        <Input
                          id="basic-name"
                          value={pricingSettings.basic_plan.name}
                          onChange={(e) =>
                            setPricingSettings({
                              ...pricingSettings,
                              basic_plan: {
                                ...pricingSettings.basic_plan,
                                name: e.target.value,
                              },
                            })
                          }
                          placeholder="Basic Monitoring"
                        />
                      </div>
                      <div>
                        <Label htmlFor="basic-price">Monthly Price ($)</Label>
                        <Input
                          id="basic-price"
                          type="number"
                          value={pricingSettings.basic_plan.price}
                          onChange={(e) =>
                            setPricingSettings({
                              ...pricingSettings,
                              basic_plan: {
                                ...pricingSettings.basic_plan,
                                price: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="29"
                        />
                      </div>
                      <div>
                        <Label htmlFor="basic-sites">Max Sites</Label>
                        <Input
                          id="basic-sites"
                          type="number"
                          value={pricingSettings.basic_plan.sites}
                          onChange={(e) =>
                            setPricingSettings({
                              ...pricingSettings,
                              basic_plan: {
                                ...pricingSettings.basic_plan,
                                sites: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Standard Plan */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Standard Plan</h3>
                      <Badge variant="default">Popular</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="standard-name">Plan Name</Label>
                        <Input
                          id="standard-name"
                          value={pricingSettings.standard_plan.name}
                          onChange={(e) =>
                            setPricingSettings({
                              ...pricingSettings,
                              standard_plan: {
                                ...pricingSettings.standard_plan,
                                name: e.target.value,
                              },
                            })
                          }
                          placeholder="Standard Monitoring"
                        />
                      </div>
                      <div>
                        <Label htmlFor="standard-price">
                          Monthly Price ($)
                        </Label>
                        <Input
                          id="standard-price"
                          type="number"
                          value={pricingSettings.standard_plan.price}
                          onChange={(e) =>
                            setPricingSettings({
                              ...pricingSettings,
                              standard_plan: {
                                ...pricingSettings.standard_plan,
                                price: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="59"
                        />
                      </div>
                      <div>
                        <Label htmlFor="standard-sites">Max Sites</Label>
                        <Input
                          id="standard-sites"
                          type="number"
                          value={pricingSettings.standard_plan.sites}
                          onChange={(e) =>
                            setPricingSettings({
                              ...pricingSettings,
                              standard_plan: {
                                ...pricingSettings.standard_plan,
                                sites: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="15"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Premium Plan */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Premium Plan</h3>
                      <Badge variant="secondary">Professional</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="premium-name">Plan Name</Label>
                        <Input
                          id="premium-name"
                          value={pricingSettings.premium_plan.name}
                          onChange={(e) =>
                            setPricingSettings({
                              ...pricingSettings,
                              premium_plan: {
                                ...pricingSettings.premium_plan,
                                name: e.target.value,
                              },
                            })
                          }
                          placeholder="Premium Monitoring"
                        />
                      </div>
                      <div>
                        <Label htmlFor="premium-price">Monthly Price ($)</Label>
                        <Input
                          id="premium-price"
                          type="number"
                          value={pricingSettings.premium_plan.price}
                          onChange={(e) =>
                            setPricingSettings({
                              ...pricingSettings,
                              premium_plan: {
                                ...pricingSettings.premium_plan,
                                price: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="99"
                        />
                      </div>
                      <div>
                        <Label htmlFor="premium-sites">Max Sites</Label>
                        <Input
                          id="premium-sites"
                          type="number"
                          value={pricingSettings.premium_plan.sites}
                          onChange={(e) =>
                            setPricingSettings({
                              ...pricingSettings,
                              premium_plan: {
                                ...pricingSettings.premium_plan,
                                sites: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handlePricingUpdate} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Pricing Settings"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Preview</CardTitle>
                  <CardDescription>
                    This is how your pricing will appear to clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Plan Preview */}
                    <div className="border rounded-lg p-6 text-center">
                      <h3 className="text-lg font-semibold mb-2">
                        {pricingSettings.basic_plan.name}
                      </h3>
                      <div className="text-3xl font-bold mb-4">
                        ${pricingSettings.basic_plan.price}
                        <span className="text-sm font-normal text-gray-600">
                          /month
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        Up to {pricingSettings.basic_plan.sites} websites
                      </div>
                      <ul className="text-sm space-y-2 text-left">
                        {pricingSettings.basic_plan.features.map(
                          (feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Standard Plan Preview */}
                    <div className="border-2 border-blue-500 rounded-lg p-6 text-center relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge>Most Popular</Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {pricingSettings.standard_plan.name}
                      </h3>
                      <div className="text-3xl font-bold mb-4">
                        ${pricingSettings.standard_plan.price}
                        <span className="text-sm font-normal text-gray-600">
                          /month
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        Up to {pricingSettings.standard_plan.sites} websites
                      </div>
                      <ul className="text-sm space-y-2 text-left">
                        {pricingSettings.standard_plan.features.map(
                          (feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Premium Plan Preview */}
                    <div className="border rounded-lg p-6 text-center">
                      <h3 className="text-lg font-semibold mb-2">
                        {pricingSettings.premium_plan.name}
                      </h3>
                      <div className="text-3xl font-bold mb-4">
                        ${pricingSettings.premium_plan.price}
                        <span className="text-sm font-normal text-gray-600">
                          /month
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        Up to {pricingSettings.premium_plan.sites} websites
                      </div>
                      <ul className="text-sm space-y-2 text-left">
                        {pricingSettings.premium_plan.features.map(
                          (feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  Invite and manage clients for your white-label service
                </CardDescription>
              </div>
              <Dialog
                open={showInviteDialog}
                onOpenChange={setShowInviteDialog}
              >
                <DialogTrigger asChild>
                  <Button disabled={!isPro}>
                    <Plus className="h-4 w-4 mr-2" />
                    Invite Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite New Client</DialogTitle>
                    <DialogDescription>
                      Send an invitation to a new client for monitoring services
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="client_name">Client Name</Label>
                      <Input
                        id="client_name"
                        value={clientForm.name}
                        onChange={(e) =>
                          setClientForm({ ...clientForm, name: e.target.value })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client_email">Email</Label>
                      <Input
                        id="client_email"
                        type="email"
                        value={clientForm.email}
                        onChange={(e) =>
                          setClientForm({
                            ...clientForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client_company">Company (Optional)</Label>
                      <Input
                        id="client_company"
                        value={clientForm.company}
                        onChange={(e) =>
                          setClientForm({
                            ...clientForm,
                            company: e.target.value,
                          })
                        }
                        placeholder="Acme Corp"
                      />
                    </div>

                    <Button
                      onClick={handleInviteClient}
                      disabled={saving}
                      className="w-full"
                    >
                      {saving ? "Sending..." : "Send Invitation"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {clients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          {client.name}
                        </TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.company || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={client.is_active ? "default" : "secondary"}
                          >
                            {client.is_active ? "Active" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {client.invitation_token && !client.is_active && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const inviteUrl = `${window.location.origin}/client/activate?token=${client.invitation_token}`;
                                  navigator.clipboard.writeText(inviteUrl);
                                  alert("Invitation link copied to clipboard!");
                                }}
                              >
                                Copy Invite Link
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No clients invited yet</p>
                  <p className="text-sm">
                    Click &quot;Invite Client&quot; to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
