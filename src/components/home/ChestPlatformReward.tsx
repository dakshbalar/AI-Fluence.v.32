import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Sparkles, Gift, Check } from "lucide-react";
import { PixelChestGraphic } from "./PixelChestGraphic";

interface ChestPlatformRewardProps {
  themeColor?: string;
  completedLevelsCount?: number;
  unlockLevelThreshold?: number;
  sectionNumber?: number;
  onOpenChestReward?: () => void;
  className?: string;
}

export const ChestPlatformReward: React.FC<ChestPlatformRewardProps> = ({
  themeColor = "purple",
  completedLevelsCount = 0,
  unlockLevelThreshold = 3,
  sectionNumber = 1,
  onOpenChestReward,
  className = "",
}) => {
  const storageKey = `dsa_chest_claimed_sec_${sectionNumber}`;
  const [isClaimed, setIsClaimed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch (e) {
      return false;
    }
  });

  const [isShaking, setIsShaking] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showLockedHint, setShowLockedHint] = useState(false);

  // Sync state if sectionNumber changes
  useEffect(() => {
    try {
      setIsClaimed(localStorage.getItem(storageKey) === "true");
    } catch (e) {
      // ignore
    }
  }, [storageKey]);

  const isUnlocked = completedLevelsCount >= unlockLevelThreshold;

  const handleTap = () => {
    if (!isUnlocked) {
      // Locked shake
      setIsShaking(true);
      setShowLockedHint(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setShowLockedHint(false), 2400);
      return;
    }

    if (isClaimed) {
      // Already claimed, celebratory bounce
      setIsOpening(true);
      setTimeout(() => setIsOpening(false), 700);
      if (onOpenChestReward) {
        onOpenChestReward();
      }
      return;
    }

    // Claim reward!
    setIsOpening(true);
    setIsClaimed(true);
    try {
      localStorage.setItem(storageKey, "true");
    } catch (e) {
      // ignore
    }

    if (onOpenChestReward) {
      onOpenChestReward();
    }

    setTimeout(() => setIsOpening(false), 1200);
  };

  // Platform pedestal colors tailored to course theme
  const platformAccents = React.useMemo(() => {
    if (!isUnlocked) {
      return {
        topFace: "#334155",
        topFaceHighlight: "#475569",
        leftFace: "#1e293b",
        rightFace: "#0f172a",
        border: "#64748b",
      };
    }
    switch (themeColor) {
      case "cyan":
      case "blue":
        return {
          topFace: "#0e7490",
          topFaceHighlight: "#06b6d4",
          leftFace: "#083344",
          rightFace: "#031c26",
          border: "#22d3ee",
        };
      case "green":
      case "emerald":
        return {
          topFace: "#15803d",
          topFaceHighlight: "#22c55e",
          leftFace: "#14532d",
          rightFace: "#052e16",
          border: "#4ade80",
        };
      case "red":
        return {
          topFace: "#b91c1c",
          topFaceHighlight: "#ef4444",
          leftFace: "#7f1d1d",
          rightFace: "#450a0a",
          border: "#f87171",
        };
      case "purple":
      default:
        return {
          topFace: "#6b21a8",
          topFaceHighlight: "#a855f7",
          leftFace: "#3b0764",
          rightFace: "#1e0436",
          border: "#c084fc",
        };
    }
  }, [themeColor, isUnlocked]);

  return (
    <div
      id="roadmap-chest-platform"
      className={`relative select-none flex flex-col items-center group cursor-pointer ${className}`}
      onClick={handleTap}
      title={
        !isUnlocked
          ? `Complete ${unlockLevelThreshold} levels to unlock chest`
          : isClaimed
          ? "Treasure Chest Claimed!"
          : "Tap to open and claim rewards!"
      }
    >
      {/* LOCKED HINT POPUP */}
      <AnimatePresence>
        {showLockedHint && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            className="absolute -top-14 z-40 px-3 py-1.5 rounded-xl bg-slate-950/95 border-2 border-amber-400 text-amber-300 font-pixel text-[9px] shadow-[0_4px_20px_rgba(0,0,0,0.9)] flex items-center gap-1.5 whitespace-nowrap pointer-events-none"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span>CLEAR {unlockLevelThreshold} LEVELS TO UNLOCK CHEST!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTAINER WITH TACTILE ANIMATIONS */}
      <motion.div
        animate={
          isShaking
            ? { x: [-5, 5, -4, 4, -2, 2, 0] }
            : isOpening
            ? { y: [0, -18, 0, -8, 0], scale: [1, 1.14, 0.98, 1.05, 1] }
            : isUnlocked && !isClaimed
            ? { y: [0, -6, 0] }
            : { y: 0 }
        }
        transition={
          isShaking
            ? { duration: 0.4 }
            : isOpening
            ? { duration: 0.7, ease: "easeOut" }
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
        className={`flex flex-col items-center transition-all duration-300 ${
          !isUnlocked
            ? "grayscale contrast-125 brightness-75 opacity-85"
            : "hover:scale-105"
        }`}
      >
        {/* =========================================================================
            1. PIXEL GRAPHICS CHEST (AUTHENTIC RETRO PIXEL ART)
            ========================================================================= */}
        <div className="relative z-20 mb-[-18px] flex items-center justify-center">
          {/* Unlocked Radiant Glow */}
          {isUnlocked && !isClaimed && (
            <div className="absolute -inset-2 w-24 h-24 rounded-full blur-xl pointer-events-none bg-amber-400/30 animate-pulse" />
          )}

          <PixelChestGraphic
            status={isClaimed ? "open" : "closed"}
            size={76}
            isOpening={isOpening}
          />
        </div>

        {/* =========================================================================
            2. MATCHING 3D ISOMETRIC PODIUM PEDESTAL
            ========================================================================= */}
        <div className="relative z-10 flex flex-col items-center">
          <svg
            width="150"
            height="86"
            viewBox="0 0 140 82"
            className="drop-shadow-[0_14px_24px_rgba(0,0,0,0.85)]"
          >
            <defs>
              <linearGradient id="cr-pedestal-top-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={platformAccents.topFaceHighlight} />
                <stop offset="100%" stopColor={platformAccents.topFace} />
              </linearGradient>

              <linearGradient id="cr-step-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            {/* Ground Contact Shadow */}
            <ellipse cx="70" cy="75" rx="60" ry="7" fill="#000000" opacity="0.65" />

            {/* LOWER ISOMETRIC BASE TIER */}
            <g id="iso-base-tier">
              {/* Left face */}
              <polygon
                points="14,52 70,70 70,77 14,59"
                fill={platformAccents.leftFace}
              />
              {/* Right face */}
              <polygon
                points="70,70 126,52 126,59 70,77"
                fill={platformAccents.rightFace}
              />
            </g>

            {/* MAIN UPPER ISOMETRIC PEDESTAL */}
            <g id="iso-main-pedestal">
              {/* Left face */}
              <polygon
                points="16,45 70,63 70,53 16,35"
                fill={platformAccents.leftFace}
                stroke="#0f172a"
                strokeWidth="1"
              />
              {/* Right face */}
              <polygon
                points="70,63 124,45 124,35 70,53"
                fill={platformAccents.rightFace}
                stroke="#0f172a"
                strokeWidth="1"
              />
              {/* Top Diamond Surface */}
              <polygon
                points="70,18 124,35 70,53 16,35"
                fill="url(#cr-pedestal-top-grad)"
                stroke={platformAccents.border}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Grid lines on pedestal top */}
              <path
                d="M 44 27 L 96 45 M 96 27 L 44 45"
                stroke="#ffffff"
                strokeOpacity="0.25"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>

            {/* SIDE ISOMETRIC STEPPING BOX */}
            <g id="iso-step-box" transform="translate(17, 31)">
              {/* Left face */}
              <polygon points="0,14 18,22 18,28 0,20" fill="#1e293b" />
              {/* Right face */}
              <polygon points="18,22 36,14 36,20 18,28" fill="#0f172a" />
              {/* Top face */}
              <polygon
                points="18,6 36,14 18,22 0,14"
                fill="url(#cr-step-grad)"
                stroke="#475569"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* =========================================================================
          3. TACTILE STATUS BADGE (LOCKED / READY / CLAIMED)
          ========================================================================= */}
      <div className="absolute -bottom-2.5 z-30 pointer-events-none">
        {!isUnlocked ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border-2 border-slate-700 text-slate-300 font-pixel text-[8px] tracking-wider shadow-[0_3px_0_#0f172a]">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            <span>{completedLevelsCount}/{unlockLevelThreshold} LOCKED</span>
          </div>
        ) : isClaimed ? (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-pixel text-[8px] font-black tracking-wider shadow-[0_3px_0_#064e3b]">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
            <span>CLAIMED</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-pixel text-[8px] font-black tracking-wider shadow-[0_3px_0_#78350f] animate-pixel-sparkle">
            <Gift className="w-3 h-3 text-slate-950 animate-bounce" />
            <span>CLAIM REWARD</span>
          </div>
        )}
      </div>
    </div>
  );
};
