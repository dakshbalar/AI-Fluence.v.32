import React from 'react';
import logoData from './logoPaths.json';

export interface AIFluenceLogoProps {
  className?: string;
  variant?: 'blue' | 'white' | 'dark' | 'current';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  height?: number | string;
  width?: number | string;
  withDot?: boolean;
  style?: React.CSSProperties;
  title?: string;
}

const COLOR_MAP: Record<string, string> = {
  blue: '#2b8cfb',
  white: '#ffffff',
  dark: '#0f172a',
  current: 'currentColor',
};

const SIZE_HEIGHT_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 52,
  xl: 68,
  custom: undefined,
};

export const AIFluenceLogo: React.FC<AIFluenceLogoProps> = ({
  className = '',
  variant = 'blue',
  size = 'md',
  height,
  width,
  withDot = false,
  style,
  title = 'AIfluence Logo',
}) => {
  const chosenVariant = withDot ? logoData.dot_aifluence : logoData.aifluence;
  const fillColor = COLOR_MAP[variant] || '#2b8cfb';

  const computedHeight = height !== undefined 
    ? height 
    : size === 'custom' 
      ? undefined 
      : SIZE_HEIGHT_MAP[size];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${chosenVariant.width} ${chosenVariant.height}`}
      height={computedHeight}
      width={width}
      fill="none"
      className={`inline-block select-none overflow-visible transition-transform duration-150 ${className}`}
      style={{
        aspectRatio: `${chosenVariant.width} / ${chosenVariant.height}`,
        ...style,
      }}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        d={chosenVariant.pathData}
        fill={fillColor}
        className="transition-colors duration-200"
      />
    </svg>
  );
};

export default AIFluenceLogo;
