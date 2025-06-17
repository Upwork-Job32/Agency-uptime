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
  Send,
  Bot,
  Users,
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
  discord_integration: {
    webhook_url: string;
  } | null;
  telegram_integration: {
    bot_token: string;
    chat_id: string;
  } | null;
  teams_integration: {
    webhook_url: string;
  } | null;
  webhook_settings: Array<{
    id: number;
    webhook_url: string;
    name: string;
    headers: Record<string, string>;
  }>;
  email_alerts: boolean;
  slack_alerts: boolean;
  discord_alerts: boolean;
  telegram_alerts: boolean;
  teams_alerts: boolean;
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
    discord_integration: null,
    telegram_integration: null,
    teams_integration: null,
    webhook_settings: [],
    email_alerts: true,
    slack_alerts: false,
    discord_alerts: false,
    telegram_alerts: false,
    teams_alerts: false,
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
  const [discordForm, setDiscordForm] = useState({
    webhook_url: "",
  });
  const [telegramForm, setTelegramForm] = useState({
    bot_token: "",
    chat_id: "",
  });
  const [teamsForm, setTeamsForm] = useState({
    webhook_url: "",
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
        if (data.discord_integration) {
          setDiscordForm({
            webhook_url: data.discord_integration.webhook_url || "",
          });
        }
        if (data.telegram_integration) {
          setTelegramForm({
            bot_token: data.telegram_integration.bot_token || "",
            chat_id: data.telegram_integration.chat_id || "",
          });
        }
        if (data.teams_integration) {
          setTeamsForm({
            webhook_url: data.teams_integration.webhook_url || "",
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

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/alerts/settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email_alerts: settings.email_alerts,
            slack_alerts: settings.slack_alerts,
            discord_alerts: settings.discord_alerts,
            telegram_alerts: settings.telegram_alerts,
            teams_alerts: settings.teams_alerts,
            webhook_alerts: settings.webhook_alerts,
            ghl_alerts: settings.ghl_alerts,
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Settings saved",
          description: "Alert settings have been updated successfully.",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save alert settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSlack = async () => {
    if (!slackForm.webhook_url) return;

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

      if (response.ok) {
        toast({
          title: "Slack integration saved",
          description: "Your Slack webhook has been configured successfully.",
        });
        fetchSettings();
      } else {
        throw new Error("Failed to save Slack integration");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to save Slack integration. Please check your webhook URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDiscord = async () => {
    if (!discordForm.webhook_url) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/alerts/discord-integration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(discordForm),
        }
      );

      if (response.ok) {
        toast({
          title: "Discord integration saved",
          description: "Your Discord webhook has been configured successfully.",
        });
        fetchSettings();
      } else {
        throw new Error("Failed to save Discord integration");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to save Discord integration. Please check your webhook URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTelegram = async () => {
    if (!telegramForm.bot_token || !telegramForm.chat_id) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/alerts/telegram-integration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(telegramForm),
        }
      );

      if (response.ok) {
        toast({
          title: "Telegram integration saved",
          description: "Your Telegram bot has been configured successfully.",
        });
        fetchSettings();
      } else {
        throw new Error("Failed to save Telegram integration");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to save Telegram integration. Please check your bot token and chat ID.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTeams = async () => {
    if (!teamsForm.webhook_url) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/alerts/teams-integration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(teamsForm),
        }
      );

      if (response.ok) {
        toast({
          title: "Teams integration saved",
          description: "Your Teams webhook has been configured successfully.",
        });
        fetchSettings();
      } else {
        throw new Error("Failed to save Teams integration");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to save Teams integration. Please check your webhook URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestIntegration = async (
    integrationType: string,
    config: any
  ) => {
    setIsTesting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/alerts/test-integration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            integration_type: integrationType,
            config,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Test successful",
          description: data.message,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Test failed");
      }
    } catch (error) {
      toast({
        title: "Test failed",
        description:
          error instanceof Error ? error.message : "Failed to send test alert",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!canUseSlackAlerts) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start relative">
            <Lock className="h-4 w-4 mr-2" />
            Manage Alerts
            <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 py-0.5">
              Pro
            </Badge>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade Required</DialogTitle>
            <DialogDescription>
              Alert management is available with our Pro plan. Upgrade to get
              notifications when your sites go down.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">Pro Plan Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Email alerts</li>
                <li>• Slack notifications</li>
                <li>• Discord alerts</li>
                <li>• Telegram bot</li>
                <li>• Teams integration</li>
                <li>• Custom webhooks</li>
                <li>• Real-time monitoring</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Link href="/billing">
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </Link>
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
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Alerts</DialogTitle>
          <DialogDescription>
            Configure how you receive notifications when your sites go down.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="slack">
              <Slack className="h-4 w-4 mr-2" />
              Slack
            </TabsTrigger>
            <TabsTrigger value="discord">
              <MessageSquare className="h-4 w-4 mr-2" />
              Discord
            </TabsTrigger>
            <TabsTrigger value="telegram">
              <Bot className="h-4 w-4 mr-2" />
              Telegram
            </TabsTrigger>
            <TabsTrigger value="teams">
              <Users className="h-4 w-4 mr-2" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <Webhook className="h-4 w-4 mr-2" />
              Webhooks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications when sites go down
                  </p>
                </div>
                <Switch
                  id="email-alerts"
                  checked={settings.email_alerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, email_alerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="slack-alerts">Slack Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to your Slack workspace
                  </p>
                </div>
                <Switch
                  id="slack-alerts"
                  checked={settings.slack_alerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, slack_alerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="discord-alerts">Discord Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to your Discord server
                  </p>
                </div>
                <Switch
                  id="discord-alerts"
                  checked={settings.discord_alerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, discord_alerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="telegram-alerts">Telegram Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via Telegram bot
                  </p>
                </div>
                <Switch
                  id="telegram-alerts"
                  checked={settings.telegram_alerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, telegram_alerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="teams-alerts">Teams Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to Microsoft Teams
                  </p>
                </div>
                <Switch
                  id="teams-alerts"
                  checked={settings.teams_alerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, teams_alerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="webhook-alerts">Webhook Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to custom webhook endpoints
                  </p>
                </div>
                <Switch
                  id="webhook-alerts"
                  checked={settings.webhook_alerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, webhook_alerts: checked })
                  }
                />
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
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

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveSlack}
                  disabled={isLoading || !slackForm.webhook_url}
                  className="flex-1"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Slack Integration
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleTestIntegration("slack", {
                      webhook_url: slackForm.webhook_url,
                      channel: slackForm.channel,
                    })
                  }
                  disabled={isTesting || !slackForm.webhook_url}
                >
                  {isTesting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <TestTube className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discord" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg border">
                <h4 className="font-medium text-indigo-900 mb-2">
                  How to set up Discord integration:
                </h4>
                <ol className="text-sm text-indigo-800 space-y-1">
                  <li>1. Go to your Discord server settings</li>
                  <li>2. Navigate to Integrations → Webhooks</li>
                  <li>3. Click &quot;New Webhook&quot; and configure it</li>
                  <li>4. Copy the webhook URL and paste it below</li>
                </ol>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discord_webhook">Discord Webhook URL</Label>
                <Input
                  id="discord_webhook"
                  type="url"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={discordForm.webhook_url}
                  onChange={(e) =>
                    setDiscordForm({
                      ...discordForm,
                      webhook_url: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveDiscord}
                  disabled={isLoading || !discordForm.webhook_url}
                  className="flex-1"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Discord Integration
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleTestIntegration("discord", {
                      webhook_url: discordForm.webhook_url,
                    })
                  }
                  disabled={isTesting || !discordForm.webhook_url}
                >
                  {isTesting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <TestTube className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="telegram" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border">
                <h4 className="font-medium text-blue-900 mb-2">
                  How to set up Telegram integration:
                </h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Create a bot by messaging @BotFather on Telegram</li>
                  <li>2. Follow the instructions to get your bot token</li>
                  <li>3. Add your bot to a group or get your chat ID</li>
                  <li>4. Enter the bot token and chat ID below</li>
                </ol>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="telegram_token">Bot Token</Label>
                  <Input
                    id="telegram_token"
                    type="password"
                    placeholder="123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                    value={telegramForm.bot_token}
                    onChange={(e) =>
                      setTelegramForm({
                        ...telegramForm,
                        bot_token: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="telegram_chat">Chat ID</Label>
                  <Input
                    id="telegram_chat"
                    placeholder="-1001234567890 or @username"
                    value={telegramForm.chat_id}
                    onChange={(e) =>
                      setTelegramForm({
                        ...telegramForm,
                        chat_id: e.target.value,
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Use a group chat ID (negative number) or @username for
                    channels
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveTelegram}
                  disabled={
                    isLoading ||
                    !telegramForm.bot_token ||
                    !telegramForm.chat_id
                  }
                  className="flex-1"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Telegram Integration
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleTestIntegration("telegram", {
                      bot_token: telegramForm.bot_token,
                      chat_id: telegramForm.chat_id,
                    })
                  }
                  disabled={
                    isTesting ||
                    !telegramForm.bot_token ||
                    !telegramForm.chat_id
                  }
                >
                  {isTesting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <TestTube className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border">
                <h4 className="font-medium text-purple-900 mb-2">
                  How to set up Teams integration:
                </h4>
                <ol className="text-sm text-purple-800 space-y-1">
                  <li>1. Go to your Teams channel</li>
                  <li>
                    2. Click &quot;...&quot; and select &quot;Connectors&quot;
                  </li>
                  <li>3. Find &quot;Incoming Webhook&quot; and configure it</li>
                  <li>4. Copy the webhook URL and paste it below</li>
                </ol>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="teams_webhook">Teams Webhook URL</Label>
                <Input
                  id="teams_webhook"
                  type="url"
                  placeholder="https://outlook.office.com/webhook/..."
                  value={teamsForm.webhook_url}
                  onChange={(e) =>
                    setTeamsForm({
                      ...teamsForm,
                      webhook_url: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveTeams}
                  disabled={isLoading || !teamsForm.webhook_url}
                  className="flex-1"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Teams Integration
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleTestIntegration("teams", {
                      webhook_url: teamsForm.webhook_url,
                    })
                  }
                  disabled={isTesting || !teamsForm.webhook_url}
                >
                  {isTesting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <TestTube className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-2">
                  Custom Webhook Integration
                </h4>
                <p className="text-sm text-gray-600">
                  Send alerts to any custom API endpoint. Perfect for
                  integrating with your own systems or third-party services.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="webhook_name">Webhook Name</Label>
                  <Input
                    id="webhook_name"
                    placeholder="My Custom Integration"
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
                    placeholder="https://api.example.com/webhooks/uptime"
                    value={webhookForm.webhook_url}
                    onChange={(e) =>
                      setWebhookForm({
                        ...webhookForm,
                        webhook_url: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Custom Headers (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Header name"
                      value={newHeaderKey}
                      onChange={(e) => setNewHeaderKey(e.target.value)}
                    />
                    <Input
                      placeholder="Header value"
                      value={newHeaderValue}
                      onChange={(e) => setNewHeaderValue(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
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
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {Object.entries(webhookForm.headers).length > 0 && (
                    <div className="space-y-1">
                      {Object.entries(webhookForm.headers).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded"
                          >
                            <span className="text-sm">
                              <strong>{key}:</strong> {value}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newHeaders = { ...webhookForm.headers };
                                delete newHeaders[key];
                                setWebhookForm({
                                  ...webhookForm,
                                  headers: newHeaders,
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={async () => {
                  if (!webhookForm.name || !webhookForm.webhook_url) return;

                  setIsLoading(true);
                  try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(
                      "http://localhost:5000/api/alerts/webhook-integration",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(webhookForm),
                      }
                    );

                    if (response.ok) {
                      toast({
                        title: "Webhook integration saved",
                        description:
                          "Your custom webhook has been configured successfully.",
                      });
                      setWebhookForm({
                        webhook_url: "",
                        name: "",
                        headers: {},
                      });
                      fetchSettings();
                    } else {
                      throw new Error("Failed to save webhook integration");
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description:
                        "Failed to save webhook integration. Please check your settings.",
                      variant: "destructive",
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={
                  isLoading || !webhookForm.name || !webhookForm.webhook_url
                }
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Webhook Integration
              </Button>

              {settings.webhook_settings.length > 0 && (
                <div className="space-y-2">
                  <Label>Configured Webhooks</Label>
                  {settings.webhook_settings.map((webhook) => (
                    <div
                      key={webhook.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <p className="font-medium">{webhook.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {webhook.webhook_url}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleTestIntegration("webhook", {
                              url: webhook.webhook_url,
                              name: webhook.name,
                              headers: webhook.headers,
                            })
                          }
                          disabled={isTesting}
                        >
                          {isTesting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <TestTube className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const token = localStorage.getItem("token");
                            await fetch(
                              `http://localhost:5000/api/alerts/webhook-integration/${webhook.id}`,
                              {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            fetchSettings();
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
