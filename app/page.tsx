'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Globe, 
  Bell, 
  BarChart3, 
  Zap, 
  Check, 
  Star,
  ArrowRight,
  Clock,
  Users,
  Target,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('monitoring');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Agency Uptime</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</Link>
              <Link href="#integrations" className="text-gray-600 hover:text-indigo-600 transition-colors">Integrations</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 transition-colors">Dashboard</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 hover:text-indigo-600">
                Sign In
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-indigo-100 text-indigo-800 border-indigo-200">
                🚀 White-Label Solution for Agencies
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                White-Label Uptime Monitoring
                <span className="text-indigo-600 block">Built for Digital Agencies</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Provide enterprise-grade uptime monitoring to your clients with your own branding. 
                Get instant alerts, detailed reports, and professional status pages that build trust and showcase your expertise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg">
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">No credit card required • Setup in 2 minutes</p>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              {[
                { label: 'Uptime Guaranteed', value: '99.9%', icon: Shield },
                { label: 'Global Monitoring', value: '8 Regions', icon: Globe },
                { label: 'Alert Speed', value: '<30s', icon: Bell },
                { label: 'Agencies Trust Us', value: '500+', icon: Users }
              ].map((stat, index) => (
                <Card key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <stat.icon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built exclusively for agencies to help them offer professional monitoring services under their own brand.
              </p>
            </div>

            {/* Feature Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { id: 'monitoring', label: 'Monitoring', icon: Shield },
                { id: 'alerts', label: 'Smart Alerts', icon: Bell },
                { id: 'reports', label: 'Branded Reports', icon: BarChart3 },
                { id: 'status', label: 'Status Pages', icon: Globe }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Feature Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {activeTab === 'monitoring' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Enterprise-Grade Monitoring
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Monitor your clients' websites from 8 global locations with sub-minute checking intervals. 
                      Get detailed insights into performance, SSL certificates, and availability.
                    </p>
                    <ul className="space-y-3">
                      {[
                        'HTTP/HTTPS monitoring with response time tracking',
                        'SSL certificate expiry monitoring',
                        'Multi-region redundancy with failover',
                        'Configurable check intervals (1-5 minutes)',
                        'Advanced error detection and categorization'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'alerts' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Intelligent Alert System
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Never miss a critical issue with our smart alerting system. Get notified via email, 
                      SMS, or push notifications to your team and clients.
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Multi-channel notifications (Email, SMS, Slack)',
                        'GoHighLevel integration for client alerts',
                        'Smart escalation rules and alert policies',
                        'Customizable notification templates',
                        'Alert suppression to prevent spam'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'reports' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Professional Branded Reports
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Deliver professional monthly reports to your clients with your branding. 
                      Showcase your value with detailed uptime analytics and insights.
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Custom branded PDF reports with your logo',
                        'Monthly automated delivery to clients',
                        'Detailed uptime statistics and trends',
                        'Performance insights and recommendations',
                        'White-label client portal access'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'status' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Beautiful Status Pages
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create stunning public status pages that build trust with your clients' customers. 
                      Fully customizable with real-time updates.
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Fully customizable status pages',
                        'Real-time status updates and incident reports',
                        'Custom domain support (status.yourclient.com)',
                        'Maintenance scheduling and notifications',
                        'Historical uptime data and charts'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Live Dashboard Preview</h4>
                    <Badge className="bg-green-100 text-green-800">All Systems Operational</Badge>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'example.com', status: 'online', uptime: '99.9%' },
                      { name: 'api.example.com', status: 'online', uptime: '100%' },
                      { name: 'app.example.com', status: 'maintenance', uptime: '99.5%' }
                    ].map((site, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            site.status === 'online' ? 'bg-green-500' : 
                            site.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium text-gray-900">{site.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{site.uptime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Start free, then choose the plan that scales with your agency. All plans include unlimited team members.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Starter Plan */}
              <Card className="relative bg-white border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900">Starter</CardTitle>
                  <CardDescription className="text-gray-600 mt-2">Perfect for small agencies getting started</CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">Free</span>
                    <span className="text-gray-600 ml-2">forever</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {[
                      'Up to 5 monitored websites',
                      'Email notifications',
                      'Basic uptime reporting',
                      'Community support',
                      'Basic branding options'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    Get Started Free
                  </Button>
                </CardContent>
              </Card>

              {/* Professional Plan */}
              <Card className="relative bg-white border-2 border-indigo-500 hover:border-indigo-600 transition-all duration-300 hover:shadow-xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-indigo-600 text-white px-4 py-1">Most Popular</Badge>
                </div>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900">Professional</CardTitle>
                  <CardDescription className="text-gray-600 mt-2">Everything you need to serve clients professionally</CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">$50</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {[
                      'Up to 100 monitored websites',
                      'Multi-channel notifications',
                      'Advanced uptime analytics',
                      'Priority support',
                      'Full white-label branding',
                      'Custom domain status pages',
                      'GoHighLevel integration'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative bg-white border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900">Enterprise</CardTitle>
                  <CardDescription className="text-gray-600 mt-2">For large agencies with custom requirements</CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">Custom</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {[
                      'Unlimited monitored websites',
                      'Custom integrations',
                      'Advanced reporting & analytics',
                      'Dedicated support manager',
                      'Custom branding & features',
                      'SLA guarantees',
                      'On-premise deployment options'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Add-ons */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Optional Add-ons</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Branded PDF Reports', price: '$29/month', description: 'Automated monthly reports with your branding' },
                  { name: 'Status Pages', price: '$19/month', description: 'Public status pages for your clients' },
                  { name: 'Client Dashboard', price: '$49/month', description: 'White-label client access portal' }
                ].map((addon, index) => (
                  <Card key={index} className="text-center p-6 bg-white border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{addon.name}</h4>
                    <p className="text-2xl font-bold text-indigo-600 mb-2">{addon.price}</p>
                    <p className="text-sm text-gray-600">{addon.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Powerful Integrations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with the tools your agency already uses to streamline your workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'GoHighLevel', icon: Smartphone, description: 'Push notifications to mobile app' },
                { name: 'Stripe', icon: Target, description: 'Secure payment processing' },
                { name: 'Slack', icon: Bell, description: 'Team notifications' },
                { name: 'Webhooks', icon: Zap, description: 'Custom integrations' }
              ].map((integration, index) => (
                <Card key={index} className="text-center p-6 bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
                  <integration.icon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Add Recurring Revenue to Your Agency?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of agencies already using Agency Uptime to monitor their clients' websites 
              and generate additional monthly revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 text-lg">
                Schedule Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-indigo-200">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-8 w-8 text-indigo-400" />
                  <span className="text-2xl font-bold">Agency Uptime</span>
                </div>
                <p className="text-gray-400 mb-4">
                  White-label uptime monitoring built specifically for digital agencies.
                </p>
                <div className="flex space-x-4">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Star className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="#integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
                  <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Agency Uptime. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}