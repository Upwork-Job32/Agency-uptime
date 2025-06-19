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
      viewBox="0 0 60 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B73F5" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>

      {/* Main circle background */}
      <circle
        cx="30"
        cy="30"
        r="28"
        fill="url(#logoGradient)"
        stroke="#3730A3"
        strokeWidth="1"
      />

      {/* Shield/U shape icon */}
      <path
        d="M20 22 L20 35 Q20 42 30 42 Q40 42 40 35 L40 22"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Inner accent line */}
      <path
        d="M24 26 L24 35 Q24 38 30 38 Q36 38 36 35 L36 26"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
};

export default Logo;
