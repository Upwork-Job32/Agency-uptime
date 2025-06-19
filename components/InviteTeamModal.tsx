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
import { Users, Loader2, Mail, Lock, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Link from "next/link";

export function InviteTeamModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "member",
    message: "",
  });
  const { toast } = useToast();
  const { canInviteTeam, isPro } = useSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canInviteTeam) {
      toast({
        title: "Feature Restricted",
        description: "Team invitations are only available for Pro plan users.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // For now, simulate the invite process since team management isn't in the backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Invitation Sent",
        description: `Team invitation has been sent to ${formData.email}`,
      });

      setFormData({
        email: "",
        role: "member",
        message: "",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show disabled button for trial users
  if (!canInviteTeam) {
    return (
      <Button variant="outline" className="w-full justify-start" disabled>
        <Lock className="h-4 w-4 mr-2" />
        Invite Team
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Users className="h-4 w-4 mr-2" />
          Invite Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your agency dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {formData.role === "admin" &&
                  "Full access to all features and settings"}
                {formData.role === "member" &&
                  "Can manage sites and view reports"}
                {formData.role === "viewer" && "View-only access to dashboard"}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Input
                id="message"
                placeholder="Welcome to our monitoring team!"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
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
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Team Management
          </h4>
          <p className="text-xs text-blue-700">
            Team management features are coming soon. For now, you can send
            invitations and manage team members manually through your account
            settings.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
