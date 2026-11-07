import React from "react";

export type ChestTier = "bronze" | "silver" | "gold" | "crystal" | "deluxe";

export interface ModernChestGraphicProps {
  status?: "closed" | "open" | "locked";
  tier?: ChestTier;
  size?: number;
  className?: string;
  isOpening?: boolean;
}

/**
 * ModernChestGraphic
 * A clean, modern, non-pixel-art vector chest designed to fit the premium
 * visual style of AI Fluence. Features a full chest hierarchy (Bronze, Silver,
 * Gold, Crystal/Deluxe) with smooth curves, metallic banding, dynamic reflections,
 * a luminous emblem/latch, and radiant glow when opened.
 */
export const ModernChestGraphic: React.FC<ModernChestGraphicProps> = ({
  status = "closed",
  tier = "gold",
  size = 64,
  className = "",
  isOpening = false,
}) => {
  const isOpen = status === "open" || isOpening;
  const isLocked = status === "locked";
  const normalizedTier: ChestTier = (tier === "deluxe" ? "crystal" : tier) as ChestTier;

  // Unique ID prefix per tier to prevent SVG gradient clashes
  const p = `mc-${normalizedTier}`;

  // Theme configuration for Chest Hierarchy
  const config = React.useMemo(() => {
    switch (normalizedTier) {
      case "bronze":
        return {
          woodGrad: ["#78350f", "#592809", "#3b1704"],
          lidGrad: ["#92400e", "#78350f", "#451a03"],
          trimGrad: ["#fed7aa", "#f97316", "#c2410c", "#7c2d12"],
          studColor: "#ffedd5",
          studStroke: "#7c2d12",
          bodyStroke: "#2b1003",
          auraColor: "rgba(234, 88, 12, 0.55)",
          treasureLight: "#fb923c",
          gemColor: "#f97316",
        };
      case "silver":
        return {
          woodGrad: ["#1e293b", "#0f172a", "#020617"],
          lidGrad: ["#334155", "#1e293b", "#0f172a"],
          trimGrad: ["#f0f9ff", "#7dd3fc", "#0284c7", "#0369a1"],
          studColor: "#e0f2fe",
          studStroke: "#0369a1",
          bodyStroke: "#020617",
          auraColor: "rgba(56, 189, 248, 0.6)",
          treasureLight: "#38bdf8",
          gemColor: "#00e5ff",
        };
      case "crystal":
        return {
          woodGrad: ["#3b0764", "#1e1b4b", "#0f172a"],
          lidGrad: ["#581c87", "#3b0764", "#1e1b4b"],
          trimGrad: ["#fdf4ff", "#e879f9", "#a855f7", "#6b21a8"],
          studColor: "#fae8ff",
          studStroke: "#6b21a8",
          bodyStroke: "#1e0b36",
          auraColor: "rgba(168, 85, 247, 0.7)",
          treasureLight: "#c084fc",
          gemColor: "#f43f5e",
        };
      case "gold":
      default:
        return {
          woodGrad: ["#854d0e", "#713f12", "#451a03"],
          lidGrad: ["#a16207", "#854d0e", "#592809"],
          trimGrad: ["#fef08a", "#f59e0b", "#d97706", "#92400e"],
          studColor: "#fef08a",
          studStroke: "#78350f",
          bodyStroke: "#260f02",
          auraColor: "rgba(250, 204, 21, 0.65)",
          treasureLight: "#f59e0b",
          gemColor: "#10b981",
        };
    }
  }, [normalizedTier]);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Radiant ambient aura behind chest */}
      {isOpen ? (
        <div
          className="absolute inset-0 rounded-full animate-pulse pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${config.auraColor} 0%, transparent 70%)`,
            transform: "scale(1.8)",
          }}
        />
      ) : (
        <div
          className="absolute inset-0 rounded-full opacity-40 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${config.auraColor} 0%, transparent 65%)`,
            transform: "scale(1.2)",
          }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wood Body Gradient */}
          <linearGradient id={`${p}-woodGrad`} x1="50" y1="35" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={config.woodGrad[0]} />
            <stop offset="50%" stopColor={config.woodGrad[1]} />
            <stop offset="100%" stopColor={config.woodGrad[2]} />
          </linearGradient>

          {/* Lid Wood Gradient */}
          <linearGradient id={`${p}-lidGrad`} x1="50" y1="15" x2="50" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={config.lidGrad[0]} />
            <stop offset="40%" stopColor={config.lidGrad[1]} />
            <stop offset="100%" stopColor={config.lidGrad[2]} />
          </linearGradient>

          {/* Metal Trim Gradient */}
          <linearGradient id={`${p}-trimGrad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={config.trimGrad[0]} />
            <stop offset="35%" stopColor={config.trimGrad[1]} />
            <stop offset="70%" stopColor={config.trimGrad[2]} />
            <stop offset="100%" stopColor={config.trimGrad[3]} />
          </linearGradient>

          {/* Treasure Radiance Gradient for Open Chest */}
          <radialGradient id={`${p}-treasureGlow`} cx="50" cy="50" r="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor={config.trimGrad[0]} stopOpacity="0.8" />
            <stop offset="70%" stopColor={config.treasureLight} stopOpacity="0.45" />
            <stop offset="100%" stopColor={config.treasureLight} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft ground shadow underneath */}
        <ellipse cx="50" cy="88" rx="36" ry="7" fill="#000000" fillOpacity="0.5" />

        {/* =========================================================================
            CHEST BASE (BOTTOM TUB)
            ========================================================================= */}
        <rect
          x="16"
          y="46"
          width="68"
          height="38"
          rx="10"
          fill={`url(#${p}-woodGrad)`}
          stroke={config.bodyStroke}
          strokeWidth="3.5"
        />

        {/* Subtle Horizontal Wood Groove Line */}
        <line x1="18" y1="64" x2="82" y2="64" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Left Metal Band */}
        <rect
          x="26"
          y="46"
          width="11"
          height="38"
          fill={`url(#${p}-trimGrad)`}
          stroke={config.studStroke}
          strokeWidth="1.5"
        />
        {/* Left Band Studs */}
        <circle cx="31.5" cy="53" r="1.8" fill={config.studColor} stroke={config.studStroke} strokeWidth="0.8" />
        <circle cx="31.5" cy="77" r="1.8" fill={config.studColor} stroke={config.studStroke} strokeWidth="0.8" />

        {/* Right Metal Band */}
        <rect
          x="63"
          y="46"
          width="11"
          height="38"
          fill={`url(#${p}-trimGrad)`}
          stroke={config.studStroke}
          strokeWidth="1.5"
        />
        {/* Right Band Studs */}
        <circle cx="68.5" cy="53" r="1.8" fill={config.studColor} stroke={config.studStroke} strokeWidth="0.8" />
        <circle cx="68.5" cy="77" r="1.8" fill={config.studColor} stroke={config.studStroke} strokeWidth="0.8" />

        {/* Bottom Metal Trim Lip */}
        <rect
          x="16"
          y="80"
          width="68"
          height="5"
          rx="2.5"
          fill={`url(#${p}-trimGrad)`}
          stroke={config.studStroke}
          strokeWidth="1.2"
        />

        {/* =========================================================================
            CHEST INTERIOR & LID (OPEN vs CLOSED)
            ========================================================================= */}
        {isOpen ? (
          <g id="modern-chest-open-state">
            {/* Interior Dark Void */}
            <path
              d="M 20 48 Q 50 42 80 48 L 80 54 Q 50 48 20 54 Z"
              fill="#080301"
            />

            {/* Radiant Treasure Light Beam Exiting Chest */}
            <path
              d="M 22 47 L 12 16 L 88 16 L 78 47 Z"
              fill={`url(#${p}-treasureGlow)`}
            />

            {/* Glowing Golden Coins / Gems Mound */}
            <ellipse cx="50" cy="49" rx="24" ry="7" fill={config.trimGrad[1]} />
            <ellipse cx="50" cy="48" rx="20" ry="5.5" fill={config.trimGrad[0]} />
            <circle cx="44" cy="46" r="3" fill="#ffffff" />
            <circle cx="56" cy="47" r="2.5" fill="#ffffff" />

            {/* Radiant center gem */}
            <polygon points="50,44 54,48 50,52 46,48" fill={config.gemColor} stroke="#ffffff" strokeWidth="0.8" />

            {/* Floating Sparkle Particles */}
            <path
              d="M 50 18 L 52 24 L 58 26 L 52 28 L 50 34 L 48 28 L 42 26 L 48 24 Z"
              fill="#ffffff"
              filter={`drop-shadow(0 0 4px ${config.trimGrad[0]})`}
            />
            <circle cx="34" cy="22" r="2" fill={config.trimGrad[0]} />
            <circle cx="66" cy="24" r="2" fill={config.gemColor} />

            {/* Hinged Open Lid (Tilted back/up) */}
            <g transform="translate(0, -6)">
              <path
                d="M 17 26 C 22 14, 78 14, 83 26 L 81 38 C 76 26, 24 26, 19 38 Z"
                fill={`url(#${p}-lidGrad)`}
                stroke={config.bodyStroke}
                strokeWidth="3"
              />
              {/* Metal bands on tilted lid */}
              <path
                d="M 27 23 C 30 18, 36 18, 38 23 L 36 34 C 34 30, 29 30, 28 34 Z"
                fill={`url(#${p}-trimGrad)`}
                stroke={config.studStroke}
                strokeWidth="1.2"
              />
              <path
                d="M 62 23 C 64 18, 70 18, 73 23 L 72 34 C 71 30, 65 30, 64 34 Z"
                fill={`url(#${p}-trimGrad)`}
                stroke={config.studStroke}
                strokeWidth="1.2"
              />
            </g>
          </g>
        ) : (
          <g id="modern-chest-closed-state">
            {/* Vaulted Curved Closed Lid */}
            <path
              d="M 15 47 C 15 26, 85 26, 85 47 Z"
              fill={`url(#${p}-lidGrad)`}
              stroke={config.bodyStroke}
              strokeWidth="3.5"
            />

            {/* Smooth Top Arc Highlight */}
            <path
              d="M 22 34 C 32 26, 68 26, 78 34"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />

            {/* Left Metal Band on Lid */}
            <path
              d="M 26 47 C 26 31, 37 31, 37 47 Z"
              fill={`url(#${p}-trimGrad)`}
              stroke={config.studStroke}
              strokeWidth="1.5"
            />
            <circle cx="31.5" cy="38" r="1.8" fill={config.studColor} stroke={config.studStroke} strokeWidth="0.8" />

            {/* Right Metal Band on Lid */}
            <path
              d="M 63 47 C 63 31, 74 31, 74 47 Z"
              fill={`url(#${p}-trimGrad)`}
              stroke={config.studStroke}
              strokeWidth="1.5"
            />
            <circle cx="68.5" cy="38" r="1.8" fill={config.studColor} stroke={config.studStroke} strokeWidth="0.8" />

            {/* Horizontal Rim Seam (Where Lid meets Base) */}
            <rect
              x="13"
              y="44"
              width="74"
              height="6"
              rx="3"
              fill={`url(#${p}-trimGrad)`}
              stroke={config.studStroke}
              strokeWidth="1.5"
            />

            {/* Center Shield Lock Clasp */}
            <g id="modern-chest-lock">
              <path
                d="M 44 42 L 56 42 L 56 56 C 56 61, 50 65, 50 65 C 50 65, 44 61, 44 56 Z"
                fill={`url(#${p}-trimGrad)`}
                stroke={config.studStroke}
                strokeWidth="1.5"
              />
              {/* Center Gem / Emblem */}
              {isLocked ? (
                <circle cx="50" cy="52" r="3.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
              ) : (
                <g>
                  <circle cx="50" cy="51" r="3" fill={config.gemColor} stroke="#ffffff" strokeWidth="0.8" />
                  <circle cx="49" cy="50" r="0.8" fill="#ffffff" />
                </g>
              )}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

/**
 * Drop-in backward compatibility alias
 */
export const PixelChestGraphic = ModernChestGraphic;
