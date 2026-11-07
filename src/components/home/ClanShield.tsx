import React, { useId } from "react";

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
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showGlow?: boolean;
}

export const ClanShield: React.FC<ClanShieldProps> = ({
  shape = "banner",
  pattern = "solid",
  color = "blue",
  symbol = "arrows",
  size = "md",
  className = "",
  showGlow = false,
}) => {
  const reactId = useId().replace(/[:]/g, "");

  const sizeMap = {
    xs: "w-7 h-9",
    sm: "w-9 h-11",
    md: "w-14 h-18",
    lg: "w-20 h-26",
    xl: "w-28 h-36",
    "2xl": "w-36 h-46",
  }[size];

  // Rich palettes with multi-stop gradients, metallic rims and glow colors
  const colorPalettes: Record<
    ClanShieldColor,
    {
      top: string;
      mid: string;
      bot: string;
      borderOuter: string;
      borderInner: string;
      highlight: string;
      patternFill: string;
      glow: string;
      emblemFill: string;
      emblemStroke: string;
      emblemAccent: string;
    }
  > = {
    black: {
      top: "#475569",
      mid: "#1e293b",
      bot: "#090d16",
      borderOuter: "#64748b",
      borderInner: "#94a3b8",
      highlight: "#cbd5e1",
      patternFill: "rgba(0, 0, 0, 0.45)",
      glow: "rgba(100, 116, 139, 0.4)",
      emblemFill: "#f8fafc",
      emblemStroke: "#0f172a",
      emblemAccent: "#94a3b8",
    },
    blue: {
      top: "#38bdf8",
      mid: "#0284c7",
      bot: "#075985",
      borderOuter: "#facc15",
      borderInner: "#fef08a",
      highlight: "#bae6fd",
      patternFill: "rgba(3, 105, 161, 0.55)",
      glow: "rgba(56, 189, 248, 0.5)",
      emblemFill: "#fef08a",
      emblemStroke: "#854d0e",
      emblemAccent: "#eab308",
    },
    red: {
      top: "#fb7185",
      mid: "#e11d48",
      bot: "#881337",
      borderOuter: "#facc15",
      borderInner: "#fef08a",
      highlight: "#fecdd3",
      patternFill: "rgba(136, 19, 55, 0.55)",
      glow: "rgba(244, 63, 94, 0.5)",
      emblemFill: "#fef08a",
      emblemStroke: "#854d0e",
      emblemAccent: "#f59e0b",
    },
    green: {
      top: "#4ade80",
      mid: "#16a34a",
      bot: "#14532d",
      borderOuter: "#facc15",
      borderInner: "#fef08a",
      highlight: "#bbf7d0",
      patternFill: "rgba(20, 83, 45, 0.55)",
      glow: "rgba(74, 222, 128, 0.5)",
      emblemFill: "#fef08a",
      emblemStroke: "#854d0e",
      emblemAccent: "#ca8a04",
    },
    purple: {
      top: "#c084fc",
      mid: "#9333ea",
      bot: "#581c87",
      borderOuter: "#facc15",
      borderInner: "#fef08a",
      highlight: "#f3e8ff",
      patternFill: "rgba(88, 28, 135, 0.55)",
      glow: "rgba(192, 132, 252, 0.5)",
      emblemFill: "#fef08a",
      emblemStroke: "#854d0e",
      emblemAccent: "#d97706",
    },
    gold: {
      top: "#fef08a",
      mid: "#eab308",
      bot: "#854d0e",
      borderOuter: "#ffffff",
      borderInner: "#fef9c3",
      highlight: "#ffffff",
      patternFill: "rgba(113, 63, 18, 0.5)",
      glow: "rgba(234, 179, 8, 0.55)",
      emblemFill: "#ffffff",
      emblemStroke: "#713f12",
      emblemAccent: "#fde047",
    },
    cyan: {
      top: "#67e8f9",
      mid: "#06b6d4",
      bot: "#155e75",
      borderOuter: "#facc15",
      borderInner: "#fef08a",
      highlight: "#cffafe",
      patternFill: "rgba(21, 94, 117, 0.55)",
      glow: "rgba(6, 182, 212, 0.5)",
      emblemFill: "#fef08a",
      emblemStroke: "#854d0e",
      emblemAccent: "#eab308",
    },
    copper: {
      top: "#fdba74",
      mid: "#ea580c",
      bot: "#7c2d12",
      borderOuter: "#facc15",
      borderInner: "#fef08a",
      highlight: "#ffedd5",
      patternFill: "rgba(124, 45, 18, 0.55)",
      glow: "rgba(234, 88, 12, 0.5)",
      emblemFill: "#fef08a",
      emblemStroke: "#854d0e",
      emblemAccent: "#ca8a04",
    },
  };

  const palette = colorPalettes[color] || colorPalettes.blue;
  const clipId = `clip-${reactId}`;
  const gradId = `grad-${reactId}`;
  const rimGradId = `rim-${reactId}`;
  const glossId = `gloss-${reactId}`;
  const shadowFilterId = `shadow-${reactId}`;

  // 1. Shapes Definitions (ViewBox: 0 0 60 74)
  const getShapePath = (s?: string) => {
    switch (s) {
      case "heater":
        // Classic curved medieval heater shield with sharp pointed tip
        return "M10 6 H50 V32 C50 53 30 68 30 68 C30 68 10 53 10 32 V6 Z";
      case "pentagon":
        // High-tech fortress citadel polygon
        return "M10 14 L30 5 L50 14 V46 L30 69 L10 46 V14 Z";
      case "buckler":
        // Round War Shield with curved bevel
        return "M30 6 C47 6 54 18 54 37 C54 56 47 68 30 68 C13 68 6 56 6 37 C6 18 13 6 30 6 Z";
      case "diamond":
        // Diamond Rhombus Crest
        return "M30 4 L55 37 L30 70 L5 37 Z";
      case "gothic":
        // Flanged wings and notched Gothic silhouette
        return "M12 8 C17 8 22 5 30 5 C38 5 43 8 48 8 V26 C53 28 54 34 50 39 C46 52 30 68 30 68 C30 68 14 52 10 39 C6 34 7 28 12 26 V8 Z";
      case "banner":
      default:
        // Clash of Clans swallowtail pointed banner pennant
        return "M10 6 H50 V54 L30 68 L10 54 V6 Z";
    }
  };

  const shapePath = getShapePath(shape);

  // 2. Pattern Overlays (inside clipPath)
  const renderPattern = () => {
    const darkAccent = palette.patternFill;
    const lightAccent = "rgba(255, 255, 255, 0.16)";

    switch (pattern) {
      case "split-vertical":
        return (
          <g>
            <rect x="30" y="0" width="30" height="74" fill={darkAccent} />
            <line x1="30" y1="0" x2="30" y2="74" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          </g>
        );

      case "split-horizontal":
        return (
          <g>
            <rect x="0" y="36" width="60" height="38" fill={darkAccent} />
            <line x1="0" y1="36" x2="60" y2="36" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          </g>
        );

      case "diagonal-slash":
        return (
          <g>
            <polygon points="0,10 60,46 60,62 0,26" fill={darkAccent} />
            <polygon points="0,16 60,52 60,56 0,20" fill={lightAccent} />
          </g>
        );

      case "chevron":
        return (
          <g>
            <polygon points="0,22 30,42 60,22 60,34 30,54 0,34" fill={darkAccent} />
            <polygon points="0,8 30,28 60,8 60,14 30,34 0,14" fill={lightAccent} />
          </g>
        );

      case "quarters":
        return (
          <g>
            <rect x="30" y="0" width="30" height="36" fill={darkAccent} />
            <rect x="0" y="36" width="30" height="38" fill={darkAccent} />
            <line x1="30" y1="0" x2="30" y2="74" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <line x1="0" y1="36" x2="60" y2="36" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          </g>
        );

      case "rays":
        return (
          <g fill={darkAccent}>
            <polygon points="30,37 15,0 23,0" />
            <polygon points="30,37 37,0 45,0" />
            <polygon points="30,37 60,18 60,26" />
            <polygon points="30,37 60,46 60,54" />
            <polygon points="30,37 0,18 0,26" />
            <polygon points="30,37 0,46 0,54" />
            <polygon points="30,37 22,74 30,74" />
            <polygon points="30,37 30,74 38,74" />
          </g>
        );

      case "solid":
      default:
        return (
          <circle
            cx="30"
            cy="36"
            r="24"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
        );
    }
  };

  // 3. Heraldic Symbols (Center Emblem)
  const renderSymbol = () => {
    const fill = palette.emblemFill;
    const stroke = palette.emblemStroke;
    const accent = palette.emblemAccent;

    switch (symbol) {
      case "swords":
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            {/* Crossed Greatswords */}
            <g stroke={stroke} strokeWidth="3" strokeLinecap="round">
              <line x1="20" y1="22" x2="40" y2="46" />
              <line x1="40" y1="22" x2="20" y2="46" />
            </g>
            <g stroke={fill} strokeWidth="2" strokeLinecap="round">
              <line x1="20" y1="22" x2="40" y2="46" />
              <line x1="40" y1="22" x2="20" y2="46" />
            </g>
            {/* Sword Guards */}
            <line x1="17" y1="27" x2="25" y2="21" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="43" y1="27" x2="35" y2="21" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
            {/* Central Boss */}
            <circle cx="30" cy="34" r="3.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <circle cx="30" cy="34" r="1.5" fill={accent} />
          </g>
        );

      case "crown":
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            {/* Imperial Golden Crown */}
            <path
              d="M18 41L16 26L23 31L30 21L37 31L44 26L42 41H18Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Crown Jewels */}
            <circle cx="16" cy="25" r="2" fill="#ef4444" stroke={stroke} strokeWidth="1" />
            <circle cx="30" cy="20" r="2.5" fill="#38bdf8" stroke={stroke} strokeWidth="1" />
            <circle cx="44" cy="25" r="2" fill="#ef4444" stroke={stroke} strokeWidth="1" />
            <rect x="21" y="37" width="18" height="2.5" rx="1" fill={accent} />
          </g>
        );

      case "dragon":
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            <path
              d="M30 19C33 22 38 22 41 19C41 24 37 28 40 33C43 38 38 43 31 44C27 44 24 41 25 37C26 33 22 31 22 26C22 21 26 19 30 19Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="2"
            />
            <path
              d="M30 25L34 29L30 33"
              stroke={accent}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="33" cy="24" r="1.5" fill="#ef4444" />
          </g>
        );

      case "skull":
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            <ellipse cx="30" cy="30" rx="9" ry="8" fill={fill} stroke={stroke} strokeWidth="2" />
            <rect x="25" y="37" width="10" height="6" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <circle cx="27" cy="30" r="2.5" fill="#090d16" />
            <circle cx="33" cy="30" r="2.5" fill="#090d16" />
            <polygon points="30,33 29,36 31,36" fill="#090d16" />
            <line x1="28" y1="39" x2="28" y2="42" stroke={stroke} strokeWidth="1.2" />
            <line x1="32" y1="39" x2="32" y2="42" stroke={stroke} strokeWidth="1.2" />
          </g>
        );

      case "lightning":
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            <path
              d="M33 19L22 33H31L27 46L39 31H30L33 19Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M32 23L26 32H31L29 40L36 32H31L32 23Z"
              fill={accent}
            />
          </g>
        );

      case "code":
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            <g stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <polyline points="24,28 18,34 24,40" />
              <polyline points="36,28 42,34 36,40" />
              <line x1="32" y1="25" x2="28" y2="43" />
            </g>
            <g stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <polyline points="24,28 18,34 24,40" />
              <polyline points="36,28 42,34 36,40" />
              <line x1="32" y1="25" x2="28" y2="43" stroke={accent} />
            </g>
          </g>
        );

      case "star":
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            <polygon
              points="30,19 33.5,28 43,29.5 36,36 38,45 30,40.5 22,45 24,36 17,29.5 26.5,28"
              fill={fill}
              stroke={stroke}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polygon
              points="30,23 32,29 38,30 33,34.5 34.5,41 30,37.5 25.5,41 27,34.5 22,30 28,29"
              fill={accent}
            />
          </g>
        );

      case "flame":
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            <path
              d="M30 18 C33 23, 40 27, 40 35 C40 42, 35 46, 30 46 C25 46, 20 42, 20 35 C20 28, 26 24, 30 18 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="2"
            />
            <path
              d="M30 27 C31.5 30, 35 32, 35 37 C35 41, 33 43, 30 43 C27 43, 25 41, 25 37 C25 33, 28 31, 30 27 Z"
              fill="#ef4444"
            />
          </g>
        );

      case "axe":
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            <line x1="30" y1="18" x2="30" y2="46" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
            <line x1="30" y1="18" x2="30" y2="46" stroke={accent} strokeWidth="2" strokeLinecap="round" />
            {/* Double Battle Axe Blades */}
            <path
              d="M30 21 C24 19 18 24 18 30 C18 36 24 40 30 37"
              fill={fill}
              stroke={stroke}
              strokeWidth="2"
            />
            <path
              d="M30 21 C36 19 42 24 42 30 C42 36 36 40 30 37"
              fill={fill}
              stroke={stroke}
              strokeWidth="2"
            />
          </g>
        );

      case "shield":
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            <path
              d="M24 23 H36 V34 C36 40 30 44 30 44 C30 44 24 40 24 34 V23 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="2"
            />
            <path
              d="M27 26 H33 V33 C33 37 30 39 30 39 C30 39 27 37 27 33 V26 Z"
              fill={accent}
            />
          </g>
        );

      case "tower":
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            <rect x="23" y="27" width="14" height="17" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
            <polygon points="21,27 39,27 38,21 22,21" fill={fill} stroke={stroke} strokeWidth="1.8" />
            {/* Battlements */}
            <rect x="22" y="18" width="3.5" height="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <rect x="28" y="18" width="4" height="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <rect x="34.5" y="18" width="3.5" height="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
            {/* Gate */}
            <path d="M28 44 V36 C28 34 32 34 32 36 V44 Z" fill="#090d16" />
          </g>
        );

      case "arrows":
      default:
        return (
          <g filter={`drop-shadow(0px 2px 3px rgba(0,0,0,0.7))`}>
            {/* Crossed War Arrows */}
            <g stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <line x1="20" y1="42" x2="40" y2="22" />
              <polyline points="29,22 40,22 40,33" />
              <line x1="40" y1="42" x2="20" y2="22" />
              <polyline points="31,22 20,22 20,33" />
            </g>
            <g stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <line x1="20" y1="42" x2="40" y2="22" />
              <polyline points="29,22 40,22 40,33" />
              <line x1="40" y1="42" x2="20" y2="22" />
              <polyline points="31,22 20,22 20,33" />
            </g>
            <circle cx="30" cy="32" r="3" fill={accent} stroke={stroke} strokeWidth="1.5" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center ${sizeMap} ${className}`}
      style={{
        filter: showGlow ? `drop-shadow(0 0 16px ${palette.glow})` : undefined,
      }}
    >
      <svg
        viewBox="0 0 60 74"
        className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.65)] select-none overflow-visible"
        fill="none"
      >
        <defs>
          {/* Main Shield Gradient Fill */}
          <linearGradient id={gradId} x1="30" y1="5" x2="30" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor={palette.top} />
            <stop offset="0.5" stopColor={palette.mid} />
            <stop offset="1" stopColor={palette.bot} />
          </linearGradient>

          {/* 3D Golden/Metallic Outer Rim Bevel Gradient */}
          <linearGradient id={rimGradId} x1="10" y1="5" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor={palette.borderInner} />
            <stop offset="0.35" stopColor={palette.borderOuter} />
            <stop offset="0.75" stopColor="#ca8a04" />
            <stop offset="1" stopColor="#713f12" />
          </linearGradient>

          {/* Curved Specular Gloss Overlay */}
          <linearGradient id={glossId} x1="30" y1="6" x2="30" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="0.8" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Clip path for the shield body */}
          <clipPath id={clipId}>
            <path d={shapePath} />
          </clipPath>

          <filter id={shadowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 1. Outer Dark Cast Shadow Edge */}
        <path
          d={shapePath}
          fill="none"
          stroke="#050810"
          strokeWidth="6.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* 2. Metallic 3D Outer Beveled Rim */}
        <path
          d={shapePath}
          fill={`url(#${gradId})`}
          stroke={`url(#${rimGradId})`}
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* 3. Clipped Content: Pattern + Inset Lighting */}
        <g clipPath={`url(#${clipId})`}>
          {/* Dynamic Pattern */}
          {renderPattern()}

          {/* Top-down Specular Glass Sheen */}
          <ellipse
            cx="30"
            cy="16"
            rx="20"
            ry="12"
            fill={`url(#${glossId})`}
            transform="rotate(-5 30 16)"
          />

          {/* Subtle Bottom Vignette Shadow */}
          <path
            d="M5 45 Q30 60 55 45 V74 H5 Z"
            fill="rgba(0,0,0,0.3)"
          />
        </g>

        {/* 4. Fine Metallic Inlay Bevel Border */}
        <path
          d={shapePath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1"
          strokeLinejoin="round"
          opacity="0.85"
          transform="scale(0.88) translate(4.1, 4.3)"
        />

        {/* 5. Corner Rivets / Golden Studs */}
        <g fill="#fef08a" stroke="#854d0e" strokeWidth="0.8">
          <circle cx="14" cy="11" r="1.5" />
          <circle cx="46" cy="11" r="1.5" />
          {shape === "buckler" ? (
            <>
              <circle cx="10" cy="37" r="1.5" />
              <circle cx="50" cy="37" r="1.5" />
              <circle cx="30" cy="62" r="1.5" />
            </>
          ) : (
            <circle cx="30" cy="61" r="1.5" />
          )}
        </g>

        {/* 6. Central Heraldic Emblem */}
        <g transform="translate(0, 0.5)">
          {renderSymbol()}
        </g>
      </svg>
    </div>
  );
};
