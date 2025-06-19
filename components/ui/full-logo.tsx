import React from "react";
import { Logo } from "./logo";

interface FullLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export const FullLogo: React.FC<FullLogoProps> = ({
  className = "",
  iconSize = 32,
  textSize = "md",
  showText = true,
}) => {
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Logo width={iconSize} height={iconSize} />
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold text-gray-800 ${textSizeClasses[textSize]} leading-tight tracking-wide`}
          >
            AGENCY
          </span>
          <span
            className={`font-bold text-gray-500 ${textSizeClasses[textSize]} leading-tight tracking-wide -mt-1`}
          >
            UPTIME
          </span>
        </div>
      )}
    </div>
  );
};

export default FullLogo;
