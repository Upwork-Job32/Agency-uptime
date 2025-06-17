"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("No session ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/billing/success/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setSuccess(true);
          toast({
            title: "Payment Successful!",
            description: "Your subscription has been activated successfully.",
          });
        } else {
          setError(data.error || "Failed to verify payment");
        }
      } catch (err) {
        setError("Failed to verify payment");
        console.error("Payment verification error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
              <h2 className="text-xl font-semibold">Verifying Payment...</h2>
              <p className="text-gray-600">
                Please wait while we confirm your payment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-900">Payment Error</CardTitle>
              <CardDescription>
                There was an issue processing your payment
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">{error}</p>
            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/billing">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Billing
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-900">
              Payment Successful!
            </CardTitle>
            <CardDescription>
              Your subscription has been activated
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Thank you for subscribing to Agency Uptime! Your account has been
              upgraded and all features are now available.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">
              What&apos;s Next?
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Set up your monitoring sites</li>
              <li>• Configure alerts and notifications</li>
              <li>• Customize your white-label settings</li>
              <li>• Generate your first branded report</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/billing">View Billing</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team anytime.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
