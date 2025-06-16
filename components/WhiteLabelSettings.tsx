"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge, Palette, Globe, Eye, ExternalLink, Copy } from "lucide-react";

interface WhiteLabelSettings {
  name: string;
  brand_color: string;
  custom_domain: string;
  logo_url: string;
}

export function WhiteLabelSettings() {
  const [settings, setSettings] = useState<WhiteLabelSettings>({
    name: "",
    brand_color: "#3B82F6",
    custom_domain: "",
    logo_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({
          name: data.agency.name || "",
          brand_color: data.agency.brand_color || "#3B82F6",
          custom_domain: data.agency.custom_domain || "",
          logo_url: data.agency.logo_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "White label settings updated successfully",
        });
        setIsOpen(false);
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update white label settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    });
  };

  const previewUrl = settings.custom_domain
    ? `https://reports.${settings.custom_domain}`
    : "Configure custom domain first";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Palette className="h-4 w-4 mr-2" />
          White Label Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            White Label Configuration
          </DialogTitle>
          <DialogDescription>
            Customize your branding and configure custom domain for
            white-labeled reports
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Agency Branding */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agency Branding</CardTitle>
              <CardDescription>
                Customize your agency's appearance across all client-facing
                pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Agency Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) =>
                      setSettings({ ...settings, name: e.target.value })
                    }
                    placeholder="Your Agency Name"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Brand Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="color"
                      type="color"
                      value={settings.brand_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          brand_color: e.target.value,
                        })
                      }
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.brand_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          brand_color: e.target.value,
                        })
                      }
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={settings.logo_url}
                  onChange={(e) =>
                    setSettings({ ...settings, logo_url: e.target.value })
                  }
                  placeholder="https://your-domain.com/logo.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a direct URL to your logo image (PNG, JPG, SVG)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Custom Domain */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Domain</CardTitle>
              <CardDescription>
                Configure reports.agencyuptime.com for your white-labeled
                reports portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="domain">Domain</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">reports.</span>
                  <Input
                    id="domain"
                    value={settings.custom_domain}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        custom_domain: e.target.value,
                      })
                    }
                    placeholder="agencyuptime.com"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will create reports.
                  {settings.custom_domain || "your-domain.com"}
                </p>
              </div>

              {settings.custom_domain && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    White-labeled Portal Ready
                  </h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Your custom domain will be:{" "}
                    <strong>reports.{settings.custom_domain}</strong>
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(`reports.${settings.custom_domain}`)
                      }
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy URL
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://reports.${settings.custom_domain}`,
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Portal
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
