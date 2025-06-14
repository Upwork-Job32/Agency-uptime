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

        {/* Contact Information */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Contact with Renan</CardTitle>
              <CardDescription>
                Get in touch through mail or discord
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center space-x-8">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a
                      href="mailto:renan.work32@gmail.com"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      renan.work32@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-indigo-500" />
                  <div>
                    <p className="font-medium text-gray-900">Discord</p>
                    <p className="text-gray-600">fire2214</p>
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
                    <a href="mailto:renan.work32@gmail.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText("fire2214")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Copy Discord
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
