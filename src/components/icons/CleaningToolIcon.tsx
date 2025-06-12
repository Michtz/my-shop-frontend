// components/icons/CleaningToolIcon.tsx
import React from 'react';

interface SvgIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const CleaningToolIcon: React.FC<SvgIconProps> = ({
  width = 45,
  height = 45,
  color = '#4C4B4B',
  className,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 45 45"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 13.2458L17.1472 19.2254V32.8314"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M12.6341 12L17.3028 19.3338"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M11.7225 12.4769L15.0573 16.1056"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M17.15 26V38.5"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M19.0736 38.5V10.5"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M24.3787 11.505V10.5807L19.55 10.8427V11.243L24.3787 11.505Z"
      stroke={color}
      strokeWidth="1.1"
    />
    <path
      d="M24.3787 13.6129V12.6774L19.55 12.9395V13.3509L24.3787 13.6129Z"
      stroke={color}
      strokeWidth="1.1"
    />
    <path
      d="M24.3787 15.7208V14.7853L19.55 15.0473V15.4587L24.3787 15.7208Z"
      stroke={color}
      strokeWidth="1.1"
    />
    <path
      d="M24.3787 17.8287V16.8932L19.55 17.1552V17.5666L24.3787 17.8287Z"
      stroke={color}
      strokeWidth="1.1"
    />
    <path d="M21 29H34" stroke={color} strokeMiterlimit="10" />
    <rect x="21.5" y="25.5" width="12" height="13" rx="1.5" stroke={color} />
  </svg>
);
