"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Globe,
  Heart,
  Shield,
  Zap,
  Users,
  Github,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Logo className="h-8 w-8" />
                <span className="text-2xl font-bold text-gray-900">
                  Agency Uptime
                </span>
              </div>
              <Badge className="bg-indigo-100 text-indigo-800">About</Badge>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Agency Uptime
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional website monitoring and uptime tracking for agencies.
            Keep your clients&apos; websites running smoothly with real-time
            monitoring, instant alerts, and comprehensive reporting.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Zap className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Real-time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Monitor your clients&apos; websites 24/7 with configurable check
                intervals
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Instant Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get notified immediately when sites go down via email and
                webhooks
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Global Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Monitor from multiple regions worldwide for accurate uptime data
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">White-label Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Generate branded PDF reports and status pages for your clients
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Company Information */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Agency Uptime Platform</CardTitle>
              <CardDescription>
                Professional monitoring solution for agencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Agency Uptime provides comprehensive website monitoring and
                  uptime tracking specifically designed for digital agencies.
                  Our platform helps you maintain your clients&apos; websites
                  with professional monitoring, instant alerts, and white-label
                  reporting capabilities.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Key Features
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Real-time monitoring</li>
                      <li>• Custom alert systems</li>
                      <li>• White-label reporting</li>
                      <li>• Multi-client management</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Benefits</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Reduce client downtime</li>
                      <li>• Professional reporting</li>
                      <li>• Automated monitoring</li>
                      <li>• Scalable for agencies</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center pt-6 border-t">
                <p className="text-sm text-gray-500 mb-4">
                  Built with{" "}
                  <Heart className="h-4 w-4 text-red-500 inline mx-1" /> for
                  agencies who care about uptime
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" asChild>
                    <Link href="/register">
                      <Users className="h-4 w-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/login">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
