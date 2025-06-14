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
import { Bell, Loader2, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AlertSettings {
  ghl_integration: {
    location_id: string;
    webhook_url: string;
    api_key: string;
  } | null;
  email_alerts: boolean;
  webhook_alerts: boolean;
}

export function ManageAlertsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [settings, setSettings] = useState<AlertSettings>({
    ghl_integration: null,
    email_alerts: true,
    webhook_alerts: false,
  });
  const [ghlForm, setGhlForm] = useState({
    location_id: "",
    webhook_url: "",
    api_key: "",
  });
  const { toast } = useToast();

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

  const handleTestAlert = async () => {
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

      const response = await fetch("http://localhost:5000/api/alerts/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          site_id: testSite.id,
          type: "email",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send test alert");
      }

      toast({
        title: "Success",
        description: "Test alert sent successfully",
      });
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Bell className="h-4 w-4 mr-2" />
          Manage Alerts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Alerts</DialogTitle>
          <DialogDescription>
            Configure how you receive notifications when your sites go down.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
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

            <div className="pt-4">
              <Button
                onClick={handleTestAlert}
                disabled={isTesting}
                variant="outline"
              >
                {isTesting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <TestTube className="mr-2 h-4 w-4" />
                )}
                Send Test Alert
              </Button>
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
