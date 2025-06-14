"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Something went wrong");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 mb-6"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">Back to sign in</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Logo className="h-8 w-8" />
            <span className="text-2xl font-bold text-gray-900">
              Agency Uptime
            </span>
          </div>
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            🔒 Password Recovery
          </Badge>
        </div>

        {/* Forgot Password Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            {!isSubmitted ? (
              <>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-gray-600">
                  No worries! Enter your email and we&apos;ll send you a reset
                  link
                </CardDescription>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-gray-600">
                  We&apos;ve sent a password reset link to {email}
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    If an account with that email exists, you&apos;ll receive a
                    password reset link shortly.
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Didn&apos;t receive the email? Check your spam folder or try
                    again.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team at support@agencyuptime.com
          </p>
        </div>
      </div>
    </div>
  );
}
