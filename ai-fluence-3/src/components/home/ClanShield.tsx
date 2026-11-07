import React from "react";

export type ClanShieldShape =
  | "banner"
  | "heater"
  | "pentagon"
  | "buckler"
  | "diamond"
  | "gothic";

export type ClanShieldPattern =
  | "solid"
  | "split-vertical"
  | "split-horizontal"
  | "diagonal-slash"
  | "chevron"
  | "quarters"
  | "rays";

export type ClanShieldColor =
  | "black"
  | "blue"
  | "red"
  | "green"
  | "purple"
  | "gold"
  | "cyan"
  | "copper";

export type ClanShieldSymbol =
  | "arrows"
  | "swords"
  | "dragon"
  | "skull"
  | "crown"
  | "lightning"
  | "code"
  | "star"
  | "flame"
  | "axe"
  | "shield"
  | "tower";

interface ClanShieldProps {
  shape?: ClanShieldShape;
  pattern?: ClanShieldPattern;
  color?: ClanShieldColor;
  symbol?: ClanShieldSymbol;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const ClanShield: React.FC<ClanShieldProps> = ({
  shape = "banner",
  pattern = "solid",
  color = "blue",
  symbol = "arrows",
  size = "md",
  className = "",
}) => {
  const sizeMap = {
    xs: "w-7 h-9",
    sm: "w-9 h-11",
    md: "w-14 h-18",
    lg: "w-20 h-26",
    xl: "w-28 h-36",
  }[size];

  const colorPalettes: Record<
    ClanShieldColor,
    {
      top: string;
      mid: string;
      bot: string;
      border: string;
      highlight: string;
      patternFill: string;
    }
  > = {
    black: {
      top: "#334155",
      mid: "#1e293b",
      bot: "#090d16",
      border: "#020617",
      highlight: "#64748b",
      patternFill: "#0f172a",
    },
    blue: {
      top: "#38bdf8",
      mid: "#0284c7",
      bot: "#0369a1",
      border: "#075985",
      highlight: "#7dd3fc",
      patternFill: "#0c4a6e",
    },
    red: {
      top: "#f87171",
      mid: "#dc2626",
      bot: "#991b1b",
      border: "#7f1d1d",
      highlight: "#fca5a5",
      patternFill: "#7f1d1d",
    },
    green: {
      top: "#4ade80",
      mid: "#16a34a",
      bot: "#15803d",
      border: "#14532d",
      highlight: "#86efac",
      patternFill: "#14532d",
    },
    purple: {
      top: "#c084fc",
      mid: "#9333ea",
      bot: "#6b21a8",
      border: "#581c87",
      highlight: "#d8b4fe",
      patternFill: "#581c87",
    },
    gold: {
      top: "#fde047",
      mid: "#eab308",
      bot: "#ca8a04",
      border: "#854d0e",
      highlight: "#fef08a",
      patternFill: "#854d0e",
    },
    cyan: {
      top: "#67e8f9",
      mid: "#06b6d4",
      bot: "#0e7490",
      border: "#155e75",
      highlight: "#a5f3fc",
      patternFill: "#164e63",
    },
    copper: {
      top: "#fb923c",
      mid: "#ea580c",
      bot: "#9a3412",
      border: "#7c2d12",
      highlight: "#fdba74",
      patternFill: "#7c2d12",
    },
  };

  const palette = colorPalettes[color] || colorPalettes.blue;
  const uniqueId = `shield-${shape}-${pattern}-${color}-${symbol}`;
  const clipId = `clip-${uniqueId}`;
  const gradId = `grad-${uniqueId}`;

  // 1. Shapes Definitions (ViewBox: 0 0 48 60)
  const getShapePath = (s?: string) => {
    switch (s) {
      case "heater":
        // Classic curved medieval heater shield
        return "M8 4 H40 V26 C40 43 24 56 24 56 C24 56 8 43 8 26 V4 Z";
      case "pentagon":
        // Fortress Pentagon Shield
        return "M8 10 L24 3 L40 10 V38 L24 56 L8 38 V10 Z";
      case "buckler":
        // Round War Shield
        return "M24 4 C38 4 44 14 44 29 C44 44 38 55 24 55 C10 55 4 44 4 29 C4 14 10 4 24 4 Z";
      case "diamond":
        // Diamond Rhombus Crest
        return "M24 3 L44 29 L24 57 L4 29 Z";
      case "gothic":
        // Winged / Notched Gothic Shield
        return "M10 6 C14 6 18 4 24 4 C30 4 34 6 38 6 V22 C42 24 43 28 40 32 C37 43 24 56 24 56 C24 56 11 43 8 32 C5 28 6 24 10 22 V6 Z";
      case "banner":
      default:
        // Classic Clash of Clans swallowtail / pointed banner pennant
        return "M8 4 H40 V44 L24 56 L8 44 V4 Z";
    }
  };

  const shapePath = getShapePath(shape);

  // 2. Pattern Overlay inside clipPath
  const renderPattern = () => {
    const fill = palette.patternFill;
    const accentFill = "rgba(0, 0, 0, 0.38)";

    switch (pattern) {
      case "split-vertical":
        return <rect x="24" y="0" width="24" height="60" fill={accentFill} />;

      case "split-horizontal":
        return <rect x="0" y="28" width="48" height="32" fill={accentFill} />;

      case "diagonal-slash":
        return (
          <polygon
            points="0,12 48,36 48,48 0,24"
            fill={accentFill}
          />
        );

      case "chevron":
        return (
          <polygon
            points="0,18 24,34 48,18 48,28 24,44 0,28"
            fill={accentFill}
          />
        );

      case "quarters":
        return (
          <g fill={accentFill}>
            <rect x="24" y="0" width="24" height="28" />
            <rect x="0" y="28" width="24" height="32" />
          </g>
        );

      case "rays":
        return (
          <g fill={accentFill}>
            <polygon points="24,28 12,0 18,0" />
            <polygon points="24,28 30,0 36,0" />
            <polygon points="24,28 48,14 48,20" />
            <polygon points="24,28 48,36 48,42" />
            <polygon points="24,28 0,14 0,20" />
            <polygon points="24,28 0,36 0,42" />
            <polygon points="24,28 18,60 24,60" />
            <polygon points="24,28 24,60 30,60" />
          </g>
        );

      case "solid":
      default:
        return null;
    }
  };

  // 3. Heraldic Symbols
  const renderSymbol = () => {
    switch (symbol) {
      case "swords":
        return (
          <g stroke="#facc15" strokeWidth="2.2" strokeLinecap="round">
            <line x1="16" y1="16" x2="32" y2="32" />
            <line x1="32" y1="16" x2="16" y2="32" />
            <circle cx="24" cy="24" r="2.5" fill="#fef08a" />
          </g>
        );

      case "dragon":
        return (
          <path
            d="M24 16C26 18 29 18 31 16C31 20 28 23 30 26C32 29 29 32 24 33C21 33 19 31 20 28C21 25 18 24 18 20C18 17 21 16 24 16Z"
            fill="#facc15"
            stroke="#b45309"
            strokeWidth="1"
          />
        );

      case "skull":
        return (
          <g fill="#fef08a" stroke="#b45309" strokeWidth="1">
            <circle cx="24" cy="22" r="6" />
            <rect x="21" y="27" width="6" height="4" rx="1" />
            <circle cx="22" cy="22" r="1.5" fill="#090d16" />
            <circle cx="26" cy="22" r="1.5" fill="#090d16" />
          </g>
        );

      case "crown":
        return (
          <path
            d="M17 29L16 20L20 24L24 18L28 24L32 20L31 29H17Z"
            fill="#facc15"
            stroke="#ca8a04"
            strokeWidth="1.2"
          />
        );

      case "lightning":
        return (
          <path
            d="M26 15L18 25H25L22 34L30 23H24L26 15Z"
            fill="#fef08a"
            stroke="#eab308"
            strokeWidth="1.2"
          />
        );

      case "code":
        return (
          <g stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <polyline points="20,20 16,24 20,28" />
            <polyline points="28,20 32,24 28,28" />
            <line x1="25" y1="18" x2="23" y2="30" stroke="#facc15" strokeWidth="2" />
          </g>
        );

      case "star":
        return (
          <path
            d="M24 16L26.5 21.5L32 22.5L28 26.5L29 32L24 29.5L19 32L20 26.5L16 22.5L21.5 21.5L24 16Z"
            fill="#fef08a"
            stroke="#ca8a04"
            strokeWidth="1.2"
          />
        );

      case "flame":
        return (
          <path
            d="M24 15 C26 19, 31 22, 31 28 C31 32, 28 35, 24 35 C20 35, 17 32, 17 28 C17 23, 21 20, 24 15 Z"
            fill="#facc15"
            stroke="#ea580c"
            strokeWidth="1.5"
          />
        );

      case "axe":
        return (
          <g stroke="#facc15" strokeWidth="2" strokeLinecap="round" fill="none">
            <line x1="24" y1="15" x2="24" y2="34" stroke="#eab308" strokeWidth="2.5" />
            <path d="M24 17 C20 16 16 19 16 23 C16 27 20 28 24 27" fill="#fef08a" stroke="#ca8a04" />
            <path d="M24 17 C28 16 32 19 32 23 C32 27 28 28 24 27" fill="#fef08a" stroke="#ca8a04" />
          </g>
        );

      case "shield":
        return (
          <path
            d="M20 18 H28 V27 C28 31 24 34 24 34 C24 34 20 31 20 27 V18 Z"
            fill="#facc15"
            stroke="#ca8a04"
            strokeWidth="1.5"
          />
        );

      case "tower":
        return (
          <g fill="#fef08a" stroke="#ca8a04" strokeWidth="1">
            <rect x="19" y="21" width="10" height="12" />
            <polygon points="17,21 31,21 30,17 18,17" />
            <rect x="18" y="15" width="3" height="3" />
            <rect x="23" y="15" width="2" height="3" />
            <rect x="27" y="15" width="3" height="3" />
          </g>
        );

      case "arrows":
      default:
        // Crossed War Arrows
        return (
          <g fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="17" y1="31" x2="31" y2="17" strokeWidth="2.5" />
            <path d="M23 17H31V25" strokeWidth="2.5" />
            <path d="M15 27L19 31" />
            <path d="M17 33L21 29" />
            <circle cx="24" cy="24" r="2" fill="#fef08a" stroke="none" />
          </g>
        );
    }
  };

  return (
    <div className={`relative shrink-0 flex items-center justify-center ${sizeMap} ${className}`}>
      <svg viewBox="0 0 48 60" className="w-full h-full filter drop-shadow-md" fill="none">
        <defs>
          <linearGradient id={gradId} x1="24" y1="4" x2="24" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor={palette.top} />
            <stop offset="0.55" stopColor={palette.mid} />
            <stop offset="1" stopColor={palette.bot} />
          </linearGradient>

          <clipPath id={clipId}>
            <path d={shapePath} />
          </clipPath>
        </defs>

        {/* Shield Body Base with Gradient */}
        <path
          d={shapePath}
          fill={`url(#${gradId})`}
          stroke={palette.border}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Clipped Heraldic Pattern Layer */}
        <g clipPath={`url(#${clipId})`}>
          {renderPattern()}
        </g>

        {/* Golden Inner Trim Border */}
        <path
          d={shapePath}
          fill="none"
          stroke="#facc15"
          strokeWidth="1.2"
          strokeLinejoin="round"
          opacity="0.9"
          transform="scale(0.88) translate(3.2, 3.2)"
        />

        {/* Metallic Highlight Accents */}
        <ellipse cx="24" cy="10" rx="12" ry="2" fill={palette.highlight} opacity="0.4" />

        {/* Center Symbol Plaque */}
        <g transform="translate(0, 1)">{renderSymbol()}</g>
      </svg>
    </div>
  );
};
