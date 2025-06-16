"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function PaymentCancel() {
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
            <div className="mx-auto mb-4">
              <XCircle className="h-12 w-12 text-gray-400" />
            </div>
            <CardTitle className="text-gray-700">Payment Cancelled</CardTitle>
            <CardDescription>
              Your payment was cancelled. No charges were made to your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">
                Still interested in upgrading?
              </h3>
              <p className="text-sm text-blue-800">
                You can upgrade to Pro at any time to unlock powerful monitoring
                features including PDF reports, team collaboration, and Slack
                alerts.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/billing">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Try Again
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Have questions? Contact us at{" "}
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
