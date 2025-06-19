"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertCircle, LogIn } from "lucide-react";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!sessionId || !token) {
      setError("Missing payment session information");
      setLoading(false);
      return;
    }

    activateAccount();
  }, [sessionId, token]);

  const activateAccount = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/client-auth/activate-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            token: token,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Store the client token
        localStorage.setItem("clientToken", data.token);
        setSuccess(true);

        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/client/dashboard");
        }, 3000);
      } else {
        const error = await response.json();
        setError(error.error || "Failed to activate account");
      }
    } catch (error) {
      console.error("Activation error:", error);
      setError("Failed to activate account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToDashboard = () => {
    router.push("/client/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">
              Activating Your Account
            </h2>
            <p className="text-gray-600">
              Please wait while we set up your monitoring service...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold mb-2">Activation Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-lg shadow-xl">
        <CardContent className="pt-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Your Monitoring Service!
            </h1>
            <p className="text-gray-600 text-lg">
              Your account has been successfully activated
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-green-900 mb-3">
              What&apos;s Next?
            </h3>
            <ul className="text-sm text-green-800 space-y-2 text-left">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                Your 30-day free trial has started
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                Access your monitoring dashboard
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                Add your websites to start monitoring
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                Set up your notification preferences
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={goToDashboard}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>

            <p className="text-xs text-gray-500">
              Redirecting automatically in a few seconds...
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Trial Information
            </h4>
            <p className="text-sm text-blue-800">
              Your free trial gives you full access to all features for 30 days.
              You can cancel anytime before the trial ends to avoid charges.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
