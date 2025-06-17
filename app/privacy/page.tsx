"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Database, UserCheck } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function PrivacyPolicy() {
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
              <Eye className="h-8 w-8 mr-3 text-indigo-600" />
              Privacy Policy
            </CardTitle>
            <CardDescription className="text-lg">
              Last updated: January 2024
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Information We Collect
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <div className="flex items-start">
                  <Database className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Minimal Data Collection
                    </h3>
                    <p className="text-blue-800">
                      We only collect the minimum amount of data necessary to
                      provide our uptime monitoring services effectively.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Personal Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect the following types of personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Email Address:</strong> Required for account creation,
                  authentication, and sending alert notifications
                </li>
                <li>
                  <strong>Agency Name:</strong> Used for branding and
                  identification in reports and dashboards
                </li>
                <li>
                  <strong>Payment Information:</strong> Processed securely
                  through Stripe for subscription billing
                </li>
                <li>
                  <strong>Optional Contact Details:</strong> Additional team
                  member emails for alert notifications
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                Website Data
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Website URLs:</strong> The endpoints you choose to
                  monitor
                </li>
                <li>
                  <strong>Monitoring Results:</strong> Response times, status
                  codes, and availability data
                </li>
                <li>
                  <strong>SSL Certificate Information:</strong> Expiry dates and
                  validation status
                </li>
                <li>
                  <strong>Optional Site Names:</strong> Custom labels for better
                  organization
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the collected information solely for providing and
                improving our services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Monitor your websites for uptime and performance</li>
                <li>Send alert notifications when issues are detected</li>
                <li>Generate reports and analytics for your websites</li>
                <li>Process payments and manage your subscription</li>
                <li>Provide customer support and technical assistance</li>
                <li>
                  Improve our monitoring algorithms and service reliability
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Data Storage and Security
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">
                      Security Measures
                    </h3>
                    <p className="text-green-800">
                      All data is encrypted in transit and at rest. We use
                      industry-standard security practices to protect your
                      information.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Data Storage
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Data is stored on secure servers with regular backups</li>
                <li>
                  Monitoring logs are retained for historical reporting and
                  analysis
                </li>
                <li>
                  Personal information is stored separately from monitoring data
                </li>
                <li>Regular security audits and vulnerability assessments</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                Data Protection
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>HTTPS encryption for all data transmission</li>
                <li>
                  Access controls and authentication for all user accounts
                </li>
                <li>Regular security updates and patch management</li>
                <li>Limited access to data by authorized personnel only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Data Sharing and Third Parties
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We only share data in the following limited
                circumstances:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Service Providers
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Stripe:</strong> Payment processing for subscriptions
                  (PCI DSS compliant)
                </li>
                <li>
                  <strong>Email Services:</strong> For sending alert
                  notifications and account communications
                </li>
                <li>
                  <strong>Cloud Infrastructure:</strong> Secure hosting and data
                  storage providers
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                Integration Platforms
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you configure third-party integrations (Slack, Discord,
                Telegram, Teams, GoHighLevel), we send monitoring alerts to
                these platforms according to your configuration. Only alert
                information is shared, no personal account data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Your Rights and Control
              </h2>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
                <div className="flex items-start">
                  <UserCheck className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-2">
                      You Control Your Data
                    </h3>
                    <p className="text-purple-800">
                      You have full control over your data and can modify or
                      delete it at any time through your account dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Data Access and Portability
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>View and download all your monitoring data and reports</li>
                <li>Export your website configuration and historical data</li>
                <li>Update your personal information and preferences</li>
                <li>Configure or disable alert notifications</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                Data Deletion
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Delete individual websites from monitoring</li>
                <li>Remove team members and their access</li>
                <li>Cancel your account and delete all associated data</li>
                <li>Request complete data removal upon account closure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Cookies and Tracking
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use minimal cookies and tracking technologies:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Essential Cookies:</strong> Required for login
                  sessions and basic functionality
                </li>
                <li>
                  <strong>Analytics:</strong> Anonymous usage statistics to
                  improve our service
                </li>
                <li>
                  <strong>No Third-Party Tracking:</strong> We do not use
                  advertising trackers or social media pixels
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. GDPR and International Compliance
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For users in the European Union and other jurisdictions with
                data protection laws:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  We process data based on legitimate business interests and
                  user consent
                </li>
                <li>
                  You have the right to access, rectify, erase, and port your
                  data
                </li>
                <li>
                  You can object to processing and request restriction of
                  processing
                </li>
                <li>
                  You have the right to lodge a complaint with supervisory
                  authorities
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain data for the following periods:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Account Information:</strong> Until account deletion
                  or 1 year after cancellation
                </li>
                <li>
                  <strong>Monitoring Data:</strong> Historical data retained for
                  reporting purposes (configurable retention period)
                </li>
                <li>
                  <strong>Billing Records:</strong> Retained for tax and
                  accounting purposes as required by law
                </li>
                <li>
                  <strong>Support Communications:</strong> Retained for 2 years
                  for service improvement
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Changes to Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by email and by posting the
                updated policy on our website. Your continued use of the service
                after changes indicates your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or how we
                handle your data, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-800">
                  <strong>Email:</strong> privacy@agencyuptime.com
                  <br />
                  <strong>Support:</strong> support@agencyuptime.com
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
