"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Shield, Users, Globe } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-8 w-8" />
                <span className="text-2xl font-bold text-gray-900">
                  Agency Uptime
                </span>
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center">
              <Shield className="h-8 w-8 mr-3 text-indigo-600" />
              Terms of Service
            </CardTitle>
            <CardDescription className="text-lg">
              Last updated: January 2024
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Agency Uptime ("Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Use License and Fair Use Policy
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <div className="flex items-start">
                  <Globe className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Fair Use - Site Monitoring Limits
                    </h3>
                    <p className="text-blue-800">
                      Each account is limited to monitoring{" "}
                      <strong>1,000 endpoints maximum</strong> under our fair
                      use policy. For requirements beyond this limit, please
                      contact our sales team for enterprise pricing.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Permission is granted to temporarily download one copy of Agency
                Uptime per device for personal, non-commercial transitory
                viewing only. This is the grant of a license, not a transfer of
                title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li>modify or copy the materials</li>
                <li>
                  use the materials for any commercial purpose or for any public
                  display
                </li>
                <li>
                  attempt to reverse engineer any software contained in Agency
                  Uptime
                </li>
                <li>
                  remove any copyright or other proprietary notations from the
                  materials
                </li>
                <li>
                  exceed the 1,000 monitored endpoints limit without upgrading
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Service Description
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Agency Uptime provides website monitoring and uptime tracking
                services for digital agencies and their clients. Our services
                include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  HTTP/HTTPS website monitoring with configurable intervals
                </li>
                <li>SSL certificate expiry monitoring</li>
                <li>
                  Multi-channel alerting (Email, Slack, Discord, Telegram,
                  Teams, Webhooks)
                </li>
                <li>GoHighLevel mobile app integration</li>
                <li>Branded PDF reports (add-on)</li>
                <li>Public status pages (add-on)</li>
                <li>White-labeled client dashboard (add-on)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Billing and Subscription
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  Trial Period
                </h3>
                <p className="text-green-800">
                  New users receive a 14-day free trial with full access to all
                  features. No credit card required during trial period.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Subscription plans and pricing:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Professional Plan:</strong> $50/month for unlimited
                  site monitoring
                </li>
                <li>
                  <strong>PDF Reports Add-on:</strong> $29/month for automated
                  branded reports
                </li>
                <li>
                  <strong>Status Pages Add-on:</strong> $19/month for public
                  status pages
                </li>
                <li>
                  <strong>Resell Dashboard Add-on:</strong> $49/month for client
                  portal access
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Subscriptions automatically renew monthly. You may cancel at any
                time with service continuing until the end of the current
                billing period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Data Protection and Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We collect minimal personally identifiable information (PII)
                including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li>Email addresses for account management and alerts</li>
                <li>Website URLs for monitoring purposes</li>
                <li>Optional client names for reporting</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                All monitoring data is stored securely and we do not share your
                data with third parties except as necessary to provide our
                services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Service Availability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                While we strive for 99.9% uptime, Agency Uptime is provided "as
                is" without warranty of any kind. We do not guarantee
                uninterrupted service and are not liable for any downtime or
                missed alerts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Account Termination
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if you breach the Terms. Upon termination,
                your right to use the Service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Usage Threshold Warnings
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Users className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      Automatic Notifications
                    </h3>
                    <p className="text-yellow-800">
                      You will receive warnings when approaching the 1,000
                      endpoint limit at 80% (800 sites) and 95% (950 sites)
                      usage. At 100% usage, you will need to upgrade to continue
                      adding new monitoring endpoints.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. We will
                notify users of material changes via email or through the
                service interface. Continued use of the service constitutes
                acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms of Service, please contact us
                at:
              </p>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-800">
                  <strong>Email:</strong> support@agencyuptime.com
                  <br />
                  <strong>Website:</strong> https://agencyuptime.com
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
