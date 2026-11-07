import React from "react";
import { CharacterId } from "../../../types/character";

interface MasterCosmicBackgroundProps {
  character?: CharacterId;
  accentOverride?: string;
  intensity?: "subtle" | "normal" | "high";
  children?: React.ReactNode;
}

export const MasterCosmicBackground: React.FC<MasterCosmicBackgroundProps> = ({
  character = "aiden",
  accentOverride,
  intensity = "normal",
  children
}) => {
  const isVex = character === "vex";
  const isLumi = character === "lumi";

  const edgeGlow = accentOverride || (
    isVex
      ? "rgba(239, 68, 68, 0.25)"
      : isLumi
      ? "rgba(255, 42, 141, 0.22)"
      : "rgba(0, 128, 255, 0.22)"
  );

  const starFill = isVex ? "#ff8888" : isLumi ? "#ffb3d9" : "#E0F7FF";
  const starGlow = isVex ? "rgba(239, 68, 68, 0.75)" : isLumi ? "rgba(255, 42, 141, 0.75)" : "rgba(0, 229, 255, 0.7)";

  return (
    <div className="relative w-full h-full min-h-[580px] bg-black text-white overflow-hidden flex flex-col justify-between select-none">
      {/* 1. Master Pitch-Black Base Layer */}
      <div className="absolute inset-0 bg-[#000000] z-0" />

      {/* 2. Standardized Atmospheric Corner Radiance */}
      <div
        className="absolute inset-0 transition-all duration-500 ease-out pointer-events-none z-0"
        style={{
          boxShadow: `inset 0 0 ${intensity === "high" ? "90px" : "60px"} ${edgeGlow}`,
          background: `
            radial-gradient(circle at 0% 0%, ${edgeGlow} 0%, transparent 28%),
            radial-gradient(circle at 100% 0%, ${edgeGlow} 0%, transparent 28%),
            radial-gradient(circle at 0% 100%, ${edgeGlow} 0%, transparent 28%),
            radial-gradient(circle at 100% 100%, ${edgeGlow} 0%, transparent 28%)
          `
        }}
      />

      {/* 3. Master Four-Corner Ambient Star Sparkles */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-80 z-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 5px ${starGlow})` }}>
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill={starFill} />
        </svg>
      </div>

      <div className="absolute top-4 right-4 pointer-events-none opacity-80 z-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 5px ${starGlow})` }}>
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill={starFill} />
        </svg>
      </div>

      <div className="absolute bottom-4 left-4 pointer-events-none opacity-80 z-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 5px ${starGlow})` }}>
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill={starFill} />
        </svg>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none opacity-80 z-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 5px ${starGlow})` }}>
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill={starFill} />
        </svg>
      </div>

      {/* 4. Safe Content Enclosure Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
        {children}
      </div>
    </div>
  );
};
