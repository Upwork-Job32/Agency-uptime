"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  User,
  Building,
  CheckCircle,
  CreditCard,
  Shield,
  Globe,
  BarChart3,
  Clock,
  Bell,
} from "lucide-react";

interface AgencyBranding {
  id: number;
  name: string;
  logo_url?: string;
  brand_color?: string;
  custom_domain?: string;
  pricing_settings?: {
    basic_plan: any;
    standard_plan: any;
    premium_plan: any;
  };
}

interface ClientInvitation {
  id: number;
  client_name: string;
  client_email: string;
  client_company?: string;
  agency_id: number;
  is_active: boolean;
  invited_at: string;
}

export default function ClientInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [agency, setAgency] = useState<AgencyBranding | null>(null);
  const [invitation, setInvitation] = useState<ClientInvitation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPricing, setShowPricing] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchInvitationData();
  }, [token]);

  const fetchInvitationData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/client-auth/invitation/${token}`
      );

      if (response.ok) {
        const data = await response.json();
        setInvitation(data.invitation);
        setAgency(data.agency);
      } else {
        const error = await response.json();
        setError(error.error || "Invalid invitation link");
      }
    } catch (error) {
      console.error("Error fetching invitation:", error);
      setError("Failed to load invitation details");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setRegistering(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/client-auth/complete-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            password: password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Store the client token
        localStorage.setItem("clientToken", data.token);
        // Redirect to client dashboard
        router.push("/client/dashboard");
      } else {
        const error = await response.json();
        setError(error.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading invitation...</span>
        </div>
      </div>
    );
  }

  if (error || !invitation || !agency) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error || "Invalid invitation"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const brandColor = agency.brand_color || "#3B82F6";
  const pricing = agency.pricing_settings || {
    basic_plan: {
      name: "Basic Monitoring",
      price: 29,
      sites: 5,
      features: [
        "24/7 uptime monitoring",
        "Email notifications",
        "Basic reporting",
      ],
    },
    standard_plan: {
      name: "Standard Monitoring",
      price: 59,
      sites: 15,
      features: [
        "Everything in Basic",
        "SMS notifications",
        "Advanced reporting",
        "SSL monitoring",
      ],
    },
    premium_plan: {
      name: "Premium Monitoring",
      price: 99,
      sites: 50,
      features: [
        "Everything in Standard",
        "Phone alerts",
        "Custom integrations",
        "Priority support",
      ],
    },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      style={{
        background: `linear-gradient(135deg, ${brandColor}10 0%, ${brandColor}05 100%)`,
      }}
    >
      {/* Header with Agency Branding */}
      <div
        className="w-full py-8 text-white"
        style={{ backgroundColor: brandColor }}
      >
        <div className="container max-w-6xl mx-auto px-6 text-center">
          {agency.logo_url && (
            <img
              src={agency.logo_url}
              alt={agency.name}
              className="h-16 mx-auto mb-4 object-contain"
            />
          )}
          <h1 className="text-3xl font-bold">{agency.name}</h1>
          <p className="text-white/90 mt-2">Professional Website Monitoring</p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-6 py-12">
        {!showPricing ? (
          <>
            {/* Registration Form */}
            <Card className="max-w-2xl mx-auto shadow-xl border-0 mb-8">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Complete Your Registration
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Join {agency.name}&apos;s professional monitoring service
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Invitation Details */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Account Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Full Name</Label>
                      <p className="font-medium text-gray-900">
                        {invitation.client_name}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-600">
                        Email Address
                      </Label>
                      <p className="font-medium text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {invitation.client_email}
                      </p>
                    </div>

                    {invitation.client_company && (
                      <div className="md:col-span-2">
                        <Label className="text-sm text-gray-600">Company</Label>
                        <p className="font-medium text-gray-900 flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          {invitation.client_company}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <Label htmlFor="password" className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Create Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="mt-1"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="mt-1"
                      required
                      minLength={6}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    style={{ backgroundColor: brandColor }}
                    disabled={registering}
                  >
                    {registering ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account & Continue"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Dashboard Preview */}
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  Preview: Your Monitoring Dashboard
                </CardTitle>
                <p className="text-gray-600">
                  Here&apos;s what you&apos;ll get access to after choosing your
                  plan
                </p>
              </CardHeader>
              <CardContent>
                {/* Feature Preview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 border rounded-lg">
                    <Globe
                      className="h-8 w-8 mx-auto mb-2"
                      style={{ color: brandColor }}
                    />
                    <h3 className="font-semibold">Website Monitoring</h3>
                    <p className="text-sm text-gray-600">
                      24/7 uptime tracking
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Bell
                      className="h-8 w-8 mx-auto mb-2"
                      style={{ color: brandColor }}
                    />
                    <h3 className="font-semibold">Instant Alerts</h3>
                    <p className="text-sm text-gray-600">
                      Email, SMS & phone calls
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <BarChart3
                      className="h-8 w-8 mx-auto mb-2"
                      style={{ color: brandColor }}
                    />
                    <h3 className="font-semibold">Analytics</h3>
                    <p className="text-sm text-gray-600">Detailed reports</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Shield
                      className="h-8 w-8 mx-auto mb-2"
                      style={{ color: brandColor }}
                    />
                    <h3 className="font-semibold">SSL Monitoring</h3>
                    <p className="text-sm text-gray-600">
                      Certificate tracking
                    </p>
                  </div>
                </div>

                {/* Mock Dashboard */}
                <div className="border rounded-lg p-6 bg-gray-50 relative">
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold text-gray-700">
                        Choose Your Plan
                      </p>
                      <p className="text-gray-600">
                        Unlock your full monitoring dashboard
                      </p>
                      <Button
                        onClick={() => setShowPricing(true)}
                        className="mt-4"
                        style={{ backgroundColor: brandColor }}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        View Pricing Plans
                      </Button>
                    </div>
                  </div>

                  {/* Mock Dashboard Content */}
                  <div className="opacity-30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="border rounded p-4">
                        <h4 className="font-medium">Total Sites</h4>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                      <div className="border rounded p-4">
                        <h4 className="font-medium">Uptime</h4>
                        <p className="text-2xl font-bold text-green-600">
                          99.9%
                        </p>
                      </div>
                      <div className="border rounded p-4">
                        <h4 className="font-medium">Response Time</h4>
                        <p className="text-2xl font-bold">245ms</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>example.com</span>
                        <Badge className="bg-green-100 text-green-800">
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>shop.example.com</span>
                        <Badge className="bg-green-100 text-green-800">
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>api.example.com</span>
                        <Badge className="bg-red-100 text-red-800">
                          Offline
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Pricing Plans */
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Choose Your Monitoring Plan
              </h2>
              <p className="text-gray-600 mb-6">
                Professional website monitoring from {agency.name}
              </p>
              <Button
                variant="outline"
                onClick={() => setShowPricing(false)}
                className="mb-8"
              >
                ← Back to Registration
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Basic Plan */}
              <Card className="border rounded-lg shadow-lg">
                <CardHeader className="text-center">
                  <Badge variant="outline" className="mb-2">
                    Basic
                  </Badge>
                  <CardTitle className="text-xl">
                    {pricing.basic_plan.name}
                  </CardTitle>
                  <div className="text-3xl font-bold mt-4">
                    ${pricing.basic_plan.price}
                    <span className="text-sm font-normal text-gray-600">
                      /month
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Up to {pricing.basic_plan.sites} websites
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pricing.basic_plan.features.map(
                      (feature: string, index: number) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() =>
                      router.push(`/client/checkout?plan=basic&token=${token}`)
                    }
                  >
                    Choose Basic Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Standard Plan */}
              <Card className="border-2 border-blue-500 rounded-lg shadow-lg relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge style={{ backgroundColor: brandColor }}>
                    Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center">
                  <Badge variant="default" className="mb-2">
                    Standard
                  </Badge>
                  <CardTitle className="text-xl">
                    {pricing.standard_plan.name}
                  </CardTitle>
                  <div className="text-3xl font-bold mt-4">
                    ${pricing.standard_plan.price}
                    <span className="text-sm font-normal text-gray-600">
                      /month
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Up to {pricing.standard_plan.sites} websites
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pricing.standard_plan.features.map(
                      (feature: string, index: number) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                  <Button
                    className="w-full"
                    style={{ backgroundColor: brandColor }}
                    onClick={() =>
                      router.push(
                        `/client/checkout?plan=standard&token=${token}`
                      )
                    }
                  >
                    Choose Standard Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="border rounded-lg shadow-lg">
                <CardHeader className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    Premium
                  </Badge>
                  <CardTitle className="text-xl">
                    {pricing.premium_plan.name}
                  </CardTitle>
                  <div className="text-3xl font-bold mt-4">
                    ${pricing.premium_plan.price}
                    <span className="text-sm font-normal text-gray-600">
                      /month
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Up to {pricing.premium_plan.sites} websites
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pricing.premium_plan.features.map(
                      (feature: string, index: number) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/client/checkout?plan=premium&token=${token}`
                      )
                    }
                  >
                    Choose Premium Plan
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Trust Indicators */}
            <div className="text-center mt-12">
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Secure Payment
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Cancel Anytime
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  30-Day Trial
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
