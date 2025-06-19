import React from "react";
import Image from "next/image";

interface LogoImageProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: "icon" | "full";
  priority?: boolean;
}

export const LogoImage: React.FC<LogoImageProps> = ({
  className = "",
  width = 32,
  height = 32,
  variant = "icon",
  priority = false,
}) => {
  const src = variant === "full" ? "/logo-full.svg" : "/logo.svg";
  const alt = variant === "full" ? "Agency Uptime Logo" : "Agency Uptime Icon";

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
};

export default LogoImage;
