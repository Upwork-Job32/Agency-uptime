"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Shield,
  CheckCircle,
  XCircle,
  CreditCard,
  User,
  Mail,
  Building,
  DollarSign,
  Monitor,
  BarChart3,
  Clock,
  Star,
} from "lucide-react";

interface InvitationData {
  id: number;
  client_name: string;
  client_email: string;
  client_company?: string;
  monthly_price: number;
  billing_cycle: string;
  agency: {
    id: number;
    name: string;
    logo_url?: string;
    brand_color?: string;
    custom_domain?: string;
  };
  valid: boolean;
  already_registered: boolean;
}

export default function ClientRegistration() {
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Registration form state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    if (token) {
      fetchInvitation();
    } else {
      setError("Invalid invitation link");
      setLoading(false);
    }
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${API_BASE_URL}/api/client-auth/invitation/${token}`
      );

      if (response.ok) {
        const invitationData = await response.json();
        setInvitation(invitationData);
        setIsRegistered(invitationData.already_registered);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Invalid or expired invitation");
      }
    } catch (err) {
      setError("Failed to load invitation details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setRegistering(true);
    setError(null);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/api/client-auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitation_token: token,
          password: password,
        }),
      });

      if (response.ok) {
        setIsRegistered(true);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const handlePayment = async () => {
    if (!invitation) return;

    setPaymentLoading(true);
    setError(null);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${API_BASE_URL}/api/client-auth/create-payment-session-invitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: invitation.id,
            invitation_token: token,
          }),
        }
      );

      if (response.ok) {
        const { checkout_url } = await response.json();
        window.location.href = checkout_url;
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create payment session");
      }
    } catch (err) {
      setError("Payment setup failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading invitation details...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Invitation
            </h1>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) return null;

  const brandColor = invitation.agency.brand_color || "#3B82F6";

  // Payment success page
  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your monitoring service is now active. You can access your
              dashboard below.
            </p>
            <Button
              className="w-full"
              style={{ backgroundColor: brandColor }}
              onClick={() => (window.location.href = "/template")}
            >
              Access Your Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {invitation.agency.logo_url && (
              <img
                src={invitation.agency.logo_url}
                alt={`${invitation.agency.name} Logo`}
                className="h-16 w-16 object-contain mr-4"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to {invitation.agency.name}
              </h1>
              <p className="text-gray-600">
                Professional Website Monitoring Services
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Service Details */}
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor
                  className="h-6 w-6 mr-2"
                  style={{ color: brandColor }}
                />
                Your Monitoring Service
              </CardTitle>
              <CardDescription>
                Complete website monitoring solution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Overview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Service Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium">
                      {invitation.client_name}
                    </span>
                  </div>
                  {invitation.client_company && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium">
                        {invitation.client_company}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {invitation.client_email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span
                      className="font-bold text-lg"
                      style={{ color: brandColor }}
                    >
                      ${invitation.monthly_price}/{invitation.billing_cycle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  What's Included
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      icon: <Shield className="h-5 w-5" />,
                      text: "24/7 Website Monitoring",
                    },
                    {
                      icon: <BarChart3 className="h-5 w-5" />,
                      text: "Performance Analytics",
                    },
                    {
                      icon: <Clock className="h-5 w-5" />,
                      text: "Real-time Alerts",
                    },
                    {
                      icon: <Star className="h-5 w-5" />,
                      text: "Detailed Reports",
                    },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-green-500">{feature.icon}</div>
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration/Payment Form */}
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                {!isRegistered ? (
                  <>
                    <User
                      className="h-6 w-6 mr-2"
                      style={{ color: brandColor }}
                    />
                    Complete Registration
                  </>
                ) : (
                  <>
                    <CreditCard
                      className="h-6 w-6 mr-2"
                      style={{ color: brandColor }}
                    />
                    Activate Service
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {!isRegistered
                  ? "Create your account to get started"
                  : "Complete payment to activate your monitoring service"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isRegistered ? (
                /* Registration Form */
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Read-only)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={invitation.client_email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name (Read-only)</Label>
                    <Input
                      id="name"
                      value={invitation.client_name}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Create Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registering}
                    style={{ backgroundColor: brandColor }}
                  >
                    {registering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              ) : (
                /* Payment Section */
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Account Created Successfully!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Complete your payment to activate monitoring services
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Service Summary
                    </h4>
                    <div className="text-blue-800 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Monthly Service:</span>
                        <span>${invitation.monthly_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Billing Cycle:</span>
                        <span className="capitalize">
                          {invitation.billing_cycle}
                        </span>
                      </div>
                      <div className="border-t border-blue-300 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>
                            ${invitation.monthly_price}/
                            {invitation.billing_cycle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    className="w-full h-12 text-lg"
                    disabled={paymentLoading}
                    style={{ backgroundColor: brandColor }}
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Setting up payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Complete Payment & Activate Service
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Secure payment powered by Stripe
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      You can cancel anytime from your dashboard
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Powered by{" "}
            <span className="font-medium" style={{ color: brandColor }}>
              {invitation.agency.name}
            </span>
          </p>
          <p className="text-xs mt-1">
            Professional Website Monitoring Services
          </p>
        </div>
      </div>
    </div>
  );
}
