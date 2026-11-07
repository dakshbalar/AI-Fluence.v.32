import React from "react";

// =========================================================================
// LOCKED MASTER REFERENCE: CORNER STARS & SMOKE GLOW BACKGROUND
// Exact reproduction from WelcomeBackExperience master reference
// =========================================================================
interface CornerStarsAndSmokeBackgroundProps {
  theme?: "aiden" | "lumi" | "vex" | "purple" | "green" | "red" | "blue" | "dsa" | "html" | "java" | "cpp" | "white" | string;
  customColor?: string;
  topStarsClassName?: string;
  bottomStarsClassName?: string;
}

// Convert any hex color to rgba
function parseHexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(0, 229, 255, ${alpha})`;
  if (hex.startsWith("rgb")) return hex;
  const clean = hex.replace("#", "").trim();
  let r = 0, g = 229, b = 255;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16) || 0;
    g = parseInt(clean[1] + clean[1], 16) || 0;
    b = parseInt(clean[2] + clean[2], 16) || 0;
  } else if (clean.length >= 6) {
    r = parseInt(clean.substring(0, 2), 16) || 0;
    g = parseInt(clean.substring(2, 4), 16) || 0;
    b = parseInt(clean.substring(4, 6), 16) || 0;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Convert hex to pastel star fill (65% white + 35% base color)
function parseHexToStarFill(hex: string): string {
  if (!hex) return "#E0F7FF";
  const clean = hex.replace("#", "").trim();
  let r = 255, g = 255, b = 255;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16) || 255;
    g = parseInt(clean[1] + clean[1], 16) || 255;
    b = parseInt(clean[2] + clean[2], 16) || 255;
  } else if (clean.length >= 6) {
    r = parseInt(clean.substring(0, 2), 16) || 255;
    g = parseInt(clean.substring(2, 4), 16) || 255;
    b = parseInt(clean.substring(4, 6), 16) || 255;
  }
  const lr = Math.round(255 * 0.65 + r * 0.35);
  const lg = Math.round(255 * 0.65 + g * 0.35);
  const lb = Math.round(255 * 0.65 + b * 0.35);
  return `rgb(${lr}, ${lg}, ${lb})`;
}

export const CornerStarsAndSmokeBackground: React.FC<CornerStarsAndSmokeBackgroundProps> = ({
  theme = "aiden",
  customColor,
  topStarsClassName = "top-4",
  bottomStarsClassName = "bottom-4",
}) => {
  let edgeGlow: string;
  let starFill: string;
  let starGlow: string;

  if (customColor) {
    edgeGlow = parseHexToRgba(customColor, 0.32);
    starFill = parseHexToStarFill(customColor);
    starGlow = parseHexToRgba(customColor, 0.85);
  } else {
    const isWhite = theme === "white";
    const isVexOrRed = theme === "vex" || theme === "red" || theme === "java";
    const isLumi = theme === "lumi";
    const isPurple = theme === "purple" || theme === "dsa";
    const isGreen = theme === "green" || theme === "html";
    const isBronze = theme === "bronze";
    const isLightBlue = theme === "light-blue";
    const isGold = theme === "gold";
    const isYellow = theme === "yellow" || theme === "amber" || theme === "gold";
    const isSilver = theme === "silver";

    edgeGlow = isWhite
      ? "rgba(255, 255, 255, 0.22)"
      : isPurple
      ? "rgba(168, 85, 247, 0.32)"
      : isGreen
      ? "rgba(34, 197, 94, 0.30)"
      : isVexOrRed
      ? "rgba(239, 68, 68, 0.30)"
      : isBronze
      ? "rgba(205, 127, 50, 0.38)"
      : isYellow
      ? "rgba(234, 179, 8, 0.38)"
      : isLightBlue
      ? "rgba(37, 99, 235, 0.35)"
      : isSilver
      ? "rgba(203, 213, 225, 0.32)"
      : isLumi
      ? "rgba(255, 42, 141, 0.28)"
      : "rgba(37, 99, 235, 0.32)";

    starFill = isWhite
      ? "#ffffff"
      : isPurple
      ? "#e9d5ff"
      : isGreen
      ? "#bbf7d0"
      : isVexOrRed
      ? "#fecaca"
      : isBronze
      ? "#fde68a"
      : isYellow
      ? "#fef08a"
      : isLightBlue
      ? "#bfdbfe"
      : isSilver
      ? "#f8fafc"
      : isLumi
      ? "#ffb3d9"
      : "#dbeafe";

    starGlow = isWhite
      ? "rgba(255, 255, 255, 0.85)"
      : isPurple
      ? "rgba(168, 85, 247, 0.85)"
      : isGreen
      ? "rgba(34, 197, 94, 0.85)"
      : isVexOrRed
      ? "rgba(239, 68, 68, 0.85)"
      : isBronze
      ? "rgba(205, 127, 50, 0.95)"
      : isYellow
      ? "rgba(234, 179, 8, 0.90)"
      : isLightBlue
      ? "rgba(59, 130, 246, 0.85)"
      : isSilver
      ? "rgba(203, 213, 225, 0.85)"
      : isLumi
      ? "rgba(255, 42, 141, 0.85)"
      : "rgba(59, 130, 246, 0.85)";
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-black z-0">
      {/* 1. Pure Pitch Black Background */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* 2. Ambient Border & Corner Glow Frame */}
      <div
        className="absolute inset-0 transition-all duration-500 ease-out"
        style={{
          boxShadow: `inset 0 0 60px ${edgeGlow}`,
          background: `
            radial-gradient(circle at 0% 0%, ${edgeGlow} 0%, transparent 28%),
            radial-gradient(circle at 100% 0%, ${edgeGlow} 0%, transparent 28%),
            radial-gradient(circle at 0% 100%, ${edgeGlow} 0%, transparent 28%),
            radial-gradient(circle at 100% 100%, ${edgeGlow} 0%, transparent 28%)
          `
        }}
      />

      {/* 3. Top-Left Corner Star */}
      <div className={`absolute ${topStarsClassName} left-4 pointer-events-none opacity-80 transition-opacity duration-300`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 5px ${starGlow})` }}>
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill={starFill} />
        </svg>
      </div>

      {/* 4. Top-Right Corner Star */}
      <div className={`absolute ${topStarsClassName} right-4 pointer-events-none opacity-80 transition-opacity duration-300`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 5px ${starGlow})` }}>
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill={starFill} />
        </svg>
      </div>

      {/* 5. Bottom-Left Corner Star */}
      <div className={`absolute ${bottomStarsClassName} left-4 pointer-events-none opacity-80 transition-opacity duration-300`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 5px ${starGlow})` }}>
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill={starFill} />
        </svg>
      </div>

      {/* 6. Bottom-Right Corner Star */}
      <div className={`absolute ${bottomStarsClassName} right-4 pointer-events-none opacity-80 transition-opacity duration-300`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 5px ${starGlow})` }}>
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill={starFill} />
        </svg>
      </div>
    </div>
  );
};
