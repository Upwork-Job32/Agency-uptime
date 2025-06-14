"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TestTube, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestMonitoringButtonProps {
  siteId: number;
  siteName: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function TestMonitoringButton({
  siteId,
  siteName,
  size = "sm",
  variant = "outline",
}: TestMonitoringButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTest = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/monitoring/check/${siteId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to test monitoring");
      }

      const data = await response.json();

      toast({
        title: "Monitoring Test Complete",
        description: `${siteName} has been checked. Check the Alerts tab for results.`,
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description:
          error instanceof Error ? error.message : "Failed to test monitoring",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleTest}
      disabled={isLoading}
      size={size}
      variant={variant}
      title={`Test monitoring for ${siteName}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <TestTube className="h-4 w-4" />
      )}
    </Button>
  );
}
