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
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-orange-900">Payment Cancelled</CardTitle>
            <CardDescription>Your payment was not completed</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              No worries! Your payment was cancelled and no charges were made to
              your card.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Try Again Later
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your account is still active on the free trial</li>
              <li>• You can upgrade anytime from the billing page</li>
              <li>• All your data and settings are preserved</li>
              <li>• Need help? Contact our support team</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/billing">
                <CreditCard className="h-4 w-4 mr-2" />
                Try Again
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Questions about pricing? Contact our sales team anytime.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
