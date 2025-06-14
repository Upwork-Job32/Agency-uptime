import React from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  width = 32,
  height = 32,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>

      {/* Outer circle background */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="url(#logoGradient)"
        stroke="#1E40AF"
        strokeWidth="1"
      />

      {/* Inner shield/uptime symbol */}
      <g transform="translate(50, 50)">
        {/* Main "U" shape for Uptime */}
        <path
          d="M -15 -20 L -15 5 Q -15 15 -5 15 L 5 15 Q 15 15 15 5 L 15 -20"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Upward arrow/chevron for "up" */}
        <path
          d="M -10 -5 L 0 -15 L 10 -5"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Small dots for monitoring/status */}
        <circle cx="-8" cy="8" r="1.5" fill="white" opacity="0.8" />
        <circle cx="0" cy="8" r="1.5" fill="white" opacity="0.8" />
        <circle cx="8" cy="8" r="1.5" fill="white" opacity="0.8" />
      </g>
    </svg>
  );
};

export default Logo;
