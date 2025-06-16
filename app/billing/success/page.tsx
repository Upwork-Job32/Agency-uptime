"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { refreshSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("No session ID found");
      setIsProcessing(false);
      return;
    }

    const processPayment = async () => {
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

        if (response.ok) {
          // Refresh subscription data
          await refreshSubscription();

          toast({
            title: "Payment Successful!",
            description: "Your subscription has been activated successfully.",
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to process payment");
        }
      } catch (error) {
        console.error("Payment processing error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to process payment"
        );
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, toast, refreshSubscription]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Logo className="h-10 w-10" />
            <span className="text-2xl font-bold text-gray-900">
              Agency Uptime
            </span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            {isProcessing ? (
              <>
                <div className="mx-auto mb-4">
                  <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                </div>
                <CardTitle>Processing Payment...</CardTitle>
                <CardDescription>
                  Please wait while we confirm your payment
                </CardDescription>
              </>
            ) : error ? (
              <>
                <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-2xl">❌</span>
                </div>
                <CardTitle className="text-red-600">Payment Error</CardTitle>
                <CardDescription>{error}</CardDescription>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-green-600">
                  Payment Successful!
                </CardTitle>
                <CardDescription>
                  Your subscription has been activated successfully
                </CardDescription>
              </>
            )}
          </CardHeader>

          {!isProcessing && (
            <CardContent className="space-y-4">
              {!error ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">
                    What happens next?
                  </h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>✓ Your Pro features are now active</li>
                    <li>✓ You can now generate PDF reports</li>
                    <li>✓ Team collaboration is enabled</li>
                    <li>✓ Slack & webhook alerts are available</li>
                  </ul>
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Need help?
                  </h3>
                  <p className="text-sm text-red-800">
                    If you continue to experience issues, please contact support
                    or try the payment process again.
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                {error ? (
                  <>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/billing">Try Again</Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild className="w-full">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Questions? Contact us at{" "}
            <a
              href="mailto:renan.work32@gmail.com"
              className="text-indigo-600 hover:text-indigo-800"
            >
              renan.work32@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
