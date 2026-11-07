import React from "react";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { ModernChestGraphic, ChestTier } from "./PixelChestGraphic";

export type QuestChestTier = "bronze" | "silver" | "gold" | "deluxe";

interface QuestRewardChestProps {
  tier: QuestChestTier;
  isClaimed?: boolean;
  isReadyToClaim?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  onClick?: () => void;
  className?: string;
}

export const QuestRewardChest: React.FC<QuestRewardChestProps> = ({
  tier,
  isClaimed = false,
  isReadyToClaim = false,
  size = "md",
  onClick,
  className = "",
}) => {
  // Dimension mappings matching app proportion
  const pixelSize = {
    sm: 52,
    md: 68,
    lg: 100,
    xl: 170,
    "2xl": 220,
  }[size];

  const chestTier: ChestTier = tier === "deluxe" ? "crystal" : tier;

  const glowBg = {
    bronze: "bg-orange-500/30",
    silver: "bg-sky-400/30",
    gold: "bg-amber-400/30",
    deluxe: "bg-purple-500/35",
  }[tier];

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.08 } : undefined}
      whileTap={onClick ? { scale: 0.94 } : undefined}
      animate={
        isReadyToClaim && !isClaimed
          ? {
              y: [0, -6, 0],
              scale: [1, 1.04, 1],
              transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
            }
          : {}
      }
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Ready to claim radiant backdrop aura */}
      {isReadyToClaim && !isClaimed && (
        <div className={`absolute inset-0 rounded-full ${glowBg} blur-xl animate-pulse pointer-events-none`} />
      )}

      {/* The Modern Chest Graphic rendered with the exact tier hierarchy */}
      <ModernChestGraphic
        status={isClaimed ? "open" : "closed"}
        tier={chestTier}
        size={pixelSize}
        isOpening={isReadyToClaim && !isClaimed}
      />

      {/* Claimed Checkmark Badge */}
      {isClaimed && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-lg z-10">
          <Check className="w-3 h-3 text-white stroke-[3]" />
        </div>
      )}

      {/* Ready to Claim Ping Bubble with Sparkles */}
      {isReadyToClaim && !isClaimed && (
        <>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-md animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-md" />
        </>
      )}
    </motion.div>
  );
};
