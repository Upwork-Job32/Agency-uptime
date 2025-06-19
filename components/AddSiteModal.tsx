"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Lock, CreditCard, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Link from "next/link";

interface AddSiteModalProps {
  onSiteAdded: () => void;
  currentSiteCount?: number;
}

export function AddSiteModal({
  onSiteAdded,
  currentSiteCount = 0,
}: AddSiteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    check_interval: "300",
    check_type: "http",
    tags: "",
  });
  const { toast } = useToast();
  const { isPro, isTrial } = useSubscription();

  // Check if trial user has reached site limit
  const hasReachedTrialLimit = isTrial && currentSiteCount >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check trial limits before submitting
    if (hasReachedTrialLimit) {
      toast({
        title: "Site Limit Reached",
        description:
          "Trial users can monitor up to 3 sites. Upgrade to Professional for unlimited sites.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          check_interval: parseInt(formData.check_interval),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add site");
      }

      toast({
        title: "Success",
        description: "Site added successfully",
      });

      setFormData({
        name: "",
        url: "",
        check_interval: "300",
        check_type: "http",
        tags: "",
      });
      setIsOpen(false);
      onSiteAdded();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add site",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show disabled button for trial users who have reached the limit
  if (hasReachedTrialLimit) {
    return (
      <Button variant="outline" className="w-full justify-start" disabled>
        <Lock className="h-4 w-4 mr-2" />
        Add Site
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Plus className="h-4 w-4 mr-2" />
          Add Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Site</DialogTitle>
          <DialogDescription>
            Add a new website to monitor. We&apos;ll check its status at regular
            intervals.
            {isTrial && (
              <div className="mt-2 text-sm text-gray-600">
                Trial plan: {currentSiteCount}/3 sites used.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                placeholder="My Website"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="check_interval">Check Interval</Label>
              <Select
                value={formData.check_interval}
                onValueChange={(value) =>
                  setFormData({ ...formData, check_interval: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                  <SelectItem value="600">10 minutes</SelectItem>
                  <SelectItem value="1800">30 minutes</SelectItem>
                  <SelectItem value="3600">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="check_type">Check Type</Label>
              <Select
                value={formData.check_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, check_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="http">HTTP/HTTPS</SelectItem>
                  <SelectItem value="ping">Ping</SelectItem>
                  <SelectItem value="port">Port</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                placeholder="production, client-site"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Site
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
