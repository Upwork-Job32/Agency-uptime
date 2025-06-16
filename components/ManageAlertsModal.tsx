"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Loader2,
  TestTube,
  Lock,
  CreditCard,
  MessageSquare,
  Webhook,
  Slack,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Link from "next/link";

interface AlertSettings {
  ghl_integration: {
    location_id: string;
    webhook_url: string;
    api_key: string;
  } | null;
  slack_integration: {
    webhook_url: string;
    channel: string;
  } | null;
  webhook_settings: Array<{
    id: number;
    webhook_url: string;
    name: string;
    headers: Record<string, string>;
  }>;
  email_alerts: boolean;
  slack_alerts: boolean;
  webhook_alerts: boolean;
  ghl_alerts: boolean;
}

export function ManageAlertsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [settings, setSettings] = useState<AlertSettings>({
    ghl_integration: null,
    slack_integration: null,
    webhook_settings: [],
    email_alerts: true,
    slack_alerts: false,
    webhook_alerts: false,
    ghl_alerts: false,
  });
  const [ghlForm, setGhlForm] = useState({
    location_id: "",
    webhook_url: "",
    api_key: "",
  });
  const [slackForm, setSlackForm] = useState({
    webhook_url: "",
    channel: "",
  });
  const [webhookForm, setWebhookForm] = useState({
    webhook_url: "",
    name: "",
    headers: {} as Record<string, string>,
  });
  const [newHeaderKey, setNewHeaderKey] = useState("");
  const [newHeaderValue, setNewHeaderValue] = useState("");
  const { toast } = useToast();
  const { canUseSlackAlerts, isPro } = useSubscription();

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/alerts/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        if (data.ghl_integration) {
          setGhlForm({
            location_id: data.ghl_integration.location_id || "",
            webhook_url: data.ghl_integration.webhook_url || "",
            api_key: data.ghl_integration.api_key || "",
          });
        }
        if (data.slack_integration) {
          setSlackForm({
            webhook_url: data.slack_integration.webhook_url || "",
            channel: data.slack_integration.channel || "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch alert settings:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const handleSaveGeneralSettings = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/alerts/general-settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email_alerts: settings.email_alerts,
            slack_alerts: settings.slack_alerts,
            webhook_alerts: settings.webhook_alerts,
            ghl_alerts: settings.ghl_alerts,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save alert settings");
      }

      toast({
        title: "Success",
        description: "Alert settings saved successfully",
      });

      fetchSettings();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGHL = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/alerts/ghl-integration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ghlForm),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save GHL integration");
      }

      toast({
        title: "Success",
        description: "GHL integration settings saved successfully",
      });

      fetchSettings();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSlack = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/alerts/slack-integration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(slackForm),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save Slack integration");
      }

      toast({
        title: "Success",
        description: "Slack integration settings saved successfully",
      });

      fetchSettings();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWebhook = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/alerts/webhook-settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(webhookForm),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save webhook settings");
      }

      toast({
        title: "Success",
        description: "Webhook settings saved successfully",
      });

      // Reset form
      setWebhookForm({
        webhook_url: "",
        name: "",
        headers: {},
      });

      fetchSettings();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWebhook = async (webhookId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/alerts/webhook-settings/${webhookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete webhook");
      }

      toast({
        title: "Success",
        description: "Webhook deleted successfully",
      });

      fetchSettings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete webhook",
        variant: "destructive",
      });
    }
  };

  const addCustomHeader = () => {
    if (newHeaderKey && newHeaderValue) {
      setWebhookForm({
        ...webhookForm,
        headers: {
          ...webhookForm.headers,
          [newHeaderKey]: newHeaderValue,
        },
      });
      setNewHeaderKey("");
      setNewHeaderValue("");
    }
  };

  const removeCustomHeader = (key: string) => {
    const newHeaders = { ...webhookForm.headers };
    delete newHeaders[key];
    setWebhookForm({
      ...webhookForm,
      headers: newHeaders,
    });
  };

  const handleTestAlert = async (type: string = "email") => {
    setIsTesting(true);

    try {
      const token = localStorage.getItem("token");

      // First get a site to test with
      const sitesResponse = await fetch("http://localhost:5000/api/sites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!sitesResponse.ok) {
        throw new Error("No sites available for testing");
      }

      const sitesData = await sitesResponse.json();
      if (!sitesData.sites || sitesData.sites.length === 0) {
        throw new Error("No sites available for testing");
      }

      const testSite = sitesData.sites[0];

      const endpoint =
        type === "slack"
          ? "http://localhost:5000/api/alerts/test-all-sites"
          : "http://localhost:5000/api/alerts/test";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(type === "slack" ? {} : { site_id: testSite.id }),
          type: type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send test alert");
      }

      if (type === "slack") {
        const data = await response.json();
        toast({
          title: "Success",
          description: `Slack status report sent successfully! (${
            data.sites_count || "All"
          } sites checked)`,
        });
      } else {
        toast({
          title: "Success",
          description: `Test ${type} alert sent successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send test alert",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Show upgrade prompt for trial users wanting Slack alerts
  if (!canUseSlackAlerts) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start relative">
            <Lock className="h-4 w-4 mr-2" />
            Manage Alerts
            <Badge className="ml-auto bg-yellow-100 text-yellow-800 text-xs">
              Pro
            </Badge>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-yellow-500" />
              Upgrade Required
            </DialogTitle>
            <DialogDescription>
              Advanced alert management including Slack integration is available
              for Pro plan users.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">
                What you&apos;ll get with Pro:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-indigo-600" />
                  Slack integration
                </li>
                <li className="flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-indigo-600" />
                  Advanced webhook alerts
                </li>
                <li className="flex items-center">
                  <TestTube className="h-4 w-4 mr-2 text-indigo-600" />
                  Custom alert policies
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Maybe Later
            </Button>
            <Button asChild>
              <Link href="/billing">
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade Now
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Bell className="h-4 w-4 mr-2" />
          Manage Alerts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Alerts</DialogTitle>
          <DialogDescription>
            Configure how you receive notifications when your sites go down.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="slack">
              <Slack className="h-4 w-4 mr-2" />
              Slack
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <Webhook className="h-4 w-4 mr-2" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="ghl">GoHighLevel</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications when sites go down
                </p>
              </div>
              <Switch
                checked={settings.email_alerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, email_alerts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Slack Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications to your Slack channel
                </p>
              </div>
              <Switch
                checked={settings.slack_alerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, slack_alerts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Webhook Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Send alerts to custom webhook endpoints
                </p>
              </div>
              <Switch
                checked={settings.webhook_alerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, webhook_alerts: checked })
                }
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveGeneralSettings}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            </div>

            <div className="pt-4 border-t">
              <div className="flex gap-2">
                <Button
                  onClick={() => handleTestAlert("email")}
                  disabled={isTesting}
                  variant="outline"
                  size="sm"
                >
                  {isTesting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <TestTube className="mr-2 h-4 w-4" />
                  )}
                  Test Email
                </Button>
                <Button
                  onClick={() => handleTestAlert("slack")}
                  disabled={isTesting || !settings.slack_alerts}
                  variant="outline"
                  size="sm"
                >
                  <Slack className="mr-2 h-4 w-4" />
                  Test Slack
                </Button>
                <Button
                  onClick={() => handleTestAlert("webhook")}
                  disabled={isTesting || !settings.webhook_alerts}
                  variant="outline"
                  size="sm"
                >
                  <Webhook className="mr-2 h-4 w-4" />
                  Test Webhook
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="slack" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border">
                <h4 className="font-medium text-blue-900 mb-2">
                  How to set up Slack integration:
                </h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Go to your Slack workspace settings</li>
                  <li>2. Create a new Incoming Webhook</li>
                  <li>
                    3. Choose the channel where you want to receive alerts
                  </li>
                  <li>4. Copy the webhook URL and paste it below</li>
                </ol>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="slack_webhook">Slack Webhook URL</Label>
                  <Input
                    id="slack_webhook"
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={slackForm.webhook_url}
                    onChange={(e) =>
                      setSlackForm({
                        ...slackForm,
                        webhook_url: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="slack_channel">Channel (Optional)</Label>
                  <Input
                    id="slack_channel"
                    placeholder="#alerts or @username"
                    value={slackForm.channel}
                    onChange={(e) =>
                      setSlackForm({ ...slackForm, channel: e.target.value })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Override the default channel configured in your webhook
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSaveSlack}
                disabled={isLoading || !slackForm.webhook_url}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Slack Integration
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-2">
                  Existing Webhooks
                </h4>
                {settings.webhook_settings.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No webhooks configured yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {settings.webhook_settings.map((webhook) => (
                      <div
                        key={webhook.id}
                        className="flex items-center justify-between bg-white p-3 rounded border"
                      >
                        <div>
                          <div className="font-medium">
                            {webhook.name || "Unnamed Webhook"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {webhook.webhook_url}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">Add New Webhook</h4>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="webhook_name">Name</Label>
                    <Input
                      id="webhook_name"
                      placeholder="My Custom Webhook"
                      value={webhookForm.name}
                      onChange={(e) =>
                        setWebhookForm({ ...webhookForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="webhook_url">Webhook URL</Label>
                    <Input
                      id="webhook_url"
                      type="url"
                      placeholder="https://your-service.com/webhooks/alerts"
                      value={webhookForm.webhook_url}
                      onChange={(e) =>
                        setWebhookForm({
                          ...webhookForm,
                          webhook_url: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Custom Headers (Optional)</Label>
                    <div className="space-y-2">
                      {Object.entries(webhookForm.headers).map(
                        ([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <Input value={key} disabled className="flex-1" />
                            <Input value={value} disabled className="flex-1" />
                            <Button
                              onClick={() => removeCustomHeader(key)}
                              variant="outline"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Header name"
                          value={newHeaderKey}
                          onChange={(e) => setNewHeaderKey(e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Header value"
                          value={newHeaderValue}
                          onChange={(e) => setNewHeaderValue(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={addCustomHeader}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSaveWebhook}
                  disabled={isLoading || !webhookForm.webhook_url}
                  className="w-full mt-4"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Webhook
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ghl" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location_id">Location ID</Label>
                <Input
                  id="location_id"
                  placeholder="Enter your GHL Location ID"
                  value={ghlForm.location_id}
                  onChange={(e) =>
                    setGhlForm({ ...ghlForm, location_id: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="webhook_url">Webhook URL (Optional)</Label>
                <Input
                  id="webhook_url"
                  type="url"
                  placeholder="https://services.leadconnectorhq.com/hooks/..."
                  value={ghlForm.webhook_url}
                  onChange={(e) =>
                    setGhlForm({ ...ghlForm, webhook_url: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="api_key">API Key (Optional)</Label>
                <Input
                  id="api_key"
                  type="password"
                  placeholder="Enter your GHL API Key"
                  value={ghlForm.api_key}
                  onChange={(e) =>
                    setGhlForm({ ...ghlForm, api_key: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleSaveGHL}
              disabled={isLoading || !ghlForm.location_id}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save GHL Integration
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
