"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MonitoringServiceStatus {
  isRunning: boolean;
  activeSiteTimers: number;
  checkInterval: number;
}

export function MonitoringStatus() {
  const [status, setStatus] = useState<MonitoringServiceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestarting, setIsRestarting] = useState(false);
  const { toast } = useToast();

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/monitoring/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch monitoring status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = async () => {
    setIsRestarting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/monitoring/restart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Monitoring Restarted",
          description:
            "The monitoring service has been restarted successfully.",
        });

        // Refresh status after restart
        setTimeout(() => {
          fetchStatus();
        }, 2000);
      } else {
        throw new Error("Failed to restart monitoring service");
      }
    } catch (error) {
      toast({
        title: "Restart Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to restart monitoring",
        variant: "destructive",
      });
    } finally {
      setIsRestarting(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-2">
              Loading monitoring status...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Monitoring Service
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Status</span>
          <Badge variant={status?.isRunning ? "default" : "destructive"}>
            {status?.isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>

        {status?.isRunning && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Sites</span>
              <span className="text-sm font-medium">
                {status.activeSiteTimers}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Check Interval</span>
              <span className="text-sm font-medium">
                {status.checkInterval / 1000}s
              </span>
            </div>
          </>
        )}

        <Button
          onClick={handleRestart}
          disabled={isRestarting}
          size="sm"
          variant="outline"
          className="w-full"
        >
          {isRestarting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Restart Service
        </Button>
      </CardContent>
    </Card>
  );
}
