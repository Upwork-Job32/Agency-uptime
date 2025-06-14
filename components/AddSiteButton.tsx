"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddSiteButtonProps {
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function AddSiteButton({
  onClick,
  variant = "outline",
  size = "default",
  className = "",
}: AddSiteButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      className={`w-full justify-start ${className}`}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Site
    </Button>
  );
}
