import React from "react";

// =========================================================================
// LOCKED MASTER REFERENCE: AVATAR STAGE PLATFORM & 3D PEDESTAL
// Exact reproduction from WelcomeBackExperience master reference
// =========================================================================
interface AvatarStagePlatformProps {
  accentColor?: string;
  glowColor?: string;
  accentGlow?: string;
  characterType?: "aiden" | "vex" | "lumi";
}

export const AvatarStagePlatform: React.FC<AvatarStagePlatformProps> = ({
  accentColor = "#3B82F6",
  glowColor = "#1D4ED8",
  accentGlow = "#2563EB",
  characterType = "aiden"
}) => {
  const isVex = characterType === "vex";
  const isLumi = characterType === "lumi";

  const resolvedAccent = isVex ? "#EF4444" : isLumi ? "#FF2A8D" : accentColor;
  const resolvedGlow = isVex ? "#EF4444" : isLumi ? "#FF2A8D" : accentGlow;

  return (
    <div className="relative w-full flex flex-col items-center justify-center -mt-7 sm:-mt-8 pointer-events-none z-0">
      {/* 1. Deep Core Ground Shadow */}
      <div
        className={`w-52 sm:w-64 h-6 sm:h-7 rounded-[100%] ${
          isVex ? "bg-red-950/80" : isLumi ? "bg-pink-950/70" : "bg-black/95"
        }`}
        style={{
          boxShadow: isVex
            ? "0 0 16px rgba(239,68,68,0.35)"
            : isLumi
            ? "0 0 16px rgba(255,42,141,0.35)"
            : "0 0 16px rgba(0,0,0,0.8)"
        }}
      />

      {/* 2. Concentric Holographic Stage Pedestal Surface */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Outer Rotating Cyber Tech Ring */}
        <div
          className="w-56 sm:w-68 h-12 sm:h-14 rounded-[100%] border border-dashed opacity-40 animate-[spin_30s_linear_infinite]"
          style={{ borderColor: resolvedAccent }}
        />

        {/* Stepping Base Platform Surface */}
        <div 
          className="absolute w-48 sm:w-60 h-9 sm:h-11 rounded-[100%] border border-white/20 bg-gradient-to-b from-white/10 to-black/85 flex items-center justify-center"
        >
          {/* Inner Stepping Plate */}
          <div
            className="w-36 sm:w-48 h-5 sm:h-7 rounded-[100%] border border-white/15"
            style={{
              background: `radial-gradient(ellipse at center, ${resolvedGlow}33 0%, transparent 70%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};
