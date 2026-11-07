import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Sparkles } from "lucide-react";
import { AIfluenceAvatar } from "../avatar/AIfluenceAvatar";
import { AvatarSkinUnlock } from "../../data/avatarSkinsData";

interface AvatarPlatformMascotProps {
  skinUnlock: AvatarSkinUnlock;
  themeColor?: string;
  completedLevelsCount?: number;
  totalLevelsCount?: number;
  isLocked?: boolean;
  onOpenSkinsModal: () => void;
  className?: string;
}

export const AvatarPlatformMascot: React.FC<AvatarPlatformMascotProps> = ({
  skinUnlock,
  themeColor = "purple",
  completedLevelsCount = 0,
  totalLevelsCount = 5,
  isLocked = true,
  onOpenSkinsModal,
  className = "",
}) => {
  const [isCheering, setIsCheering] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showLockedHint, setShowLockedHint] = useState(false);

  const bundle = skinUnlock.bundle;
  const config = bundle.config;

  const handleTap = () => {
    if (isLocked) {
      // Play shake animation and show unlock hint
      setIsShaking(true);
      setShowLockedHint(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setShowLockedHint(false), 2400);
      return;
    }

    // Unlocked: cheer and open wardrobe
    setIsCheering(true);
    setTimeout(() => setIsCheering(false), 900);
    onOpenSkinsModal();
  };

  // 3D platform facet colors adapted to course theme (when unlocked)
  const platformAccents = React.useMemo(() => {
    if (isLocked) {
      return {
        topFace: "#334155",
        topFaceHighlight: "#475569",
        leftFace: "#1e293b",
        rightFace: "#0f172a",
        border: "#64748b",
        shadowColor: "#0f172a",
      };
    }
    switch (themeColor) {
      case "blue":
      case "cyan":
        return {
          topFace: "#1d4ed8",
          topFaceHighlight: "#3b82f6",
          leftFace: "#1e3a8a",
          rightFace: "#172554",
          border: "#60a5fa",
          shadowColor: "#172554",
        };
      case "yellow":
      case "amber":
        return {
          topFace: "#a16207",
          topFaceHighlight: "#eab308",
          leftFace: "#713f12",
          rightFace: "#422006",
          border: "#fde047",
          shadowColor: "#422006",
        };
      case "green":
      case "emerald":
        return {
          topFace: "#15803d",
          topFaceHighlight: "#22c55e",
          leftFace: "#14532d",
          rightFace: "#052e16",
          border: "#4ade80",
          shadowColor: "#14532d",
        };
      case "red":
        return {
          topFace: "#b91c1c",
          topFaceHighlight: "#ef4444",
          leftFace: "#7f1d1d",
          rightFace: "#450a0a",
          border: "#f87171",
          shadowColor: "#7f1d1d",
        };
      case "purple":
      default:
        return {
          topFace: "#6b21a8",
          topFaceHighlight: "#a855f7",
          leftFace: "#3b0764",
          rightFace: "#1e0436",
          border: "#c084fc",
          shadowColor: "#3b0764",
        };
    }
  }, [themeColor, isLocked]);

  return (
    <div
      className={`relative select-none flex flex-col items-center group cursor-pointer ${className}`}
      onClick={handleTap}
      title={isLocked ? "Locked until section is completed" : "Tap to open avatar skins"}
    >
      {/* LOCKED HINT POPUP */}
      <AnimatePresence>
        {showLockedHint && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            className="absolute -top-10 z-40 px-3 py-1 rounded-xl bg-slate-950/95 border-2 border-amber-400 text-amber-300 font-pixel text-[9px] shadow-[0_4px_16px_rgba(0,0,0,0.9)] flex items-center gap-1.5 whitespace-nowrap pointer-events-none"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span>CLEAR ALL {totalLevelsCount} LEVELS TO UNLOCK!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTAINER WITH OPTIONAL GRAYSCALE / BLACK & WHITE FILTER WHEN LOCKED */}
      <motion.div
        animate={
          isShaking
            ? { x: [-5, 5, -4, 4, -2, 2, 0] }
            : isCheering
            ? { y: [0, -14, 0, -8, 0], scale: [1, 1.08, 0.98, 1.04, 1] }
            : { y: [0, -4, 0] }
        }
        transition={
          isShaking
            ? { duration: 0.4 }
            : isCheering
            ? { duration: 0.8, ease: "easeOut" }
            : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
        }
        className={`flex flex-col items-center transition-all duration-500 ${
          isLocked
            ? "grayscale contrast-125 brightness-75 opacity-85"
            : "hover:scale-105"
        }`}
      >
        {/* 1. OUR OFFICIAL 2.5D ROBOT AVATAR (ENLARGED) */}
        <div className="relative z-20 mb-[-54px]">
          <AIfluenceAvatar
            config={config}
            size={140}
            mood={isLocked ? "still" : "happy"}
            animate={!isLocked}
            showBackground={false}
          />
        </div>

        {/* 2. ENLARGED 3D ISOMETRIC PODIUM */}
        <div className="relative z-10 flex flex-col items-center">
          <svg
            width="160"
            height="94"
            viewBox="0 0 140 82"
            className="drop-shadow-[0_14px_24px_rgba(0,0,0,0.85)]"
          >
            <defs>
              <linearGradient id="platform-top-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={platformAccents.topFaceHighlight} />
                <stop offset="100%" stopColor={platformAccents.topFace} />
              </linearGradient>

              <linearGradient id="block-step-grad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                fill="url(#platform-top-grad)"
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
            <g id="iso-step-box" transform="translate(77, 31)">
              {/* Left face */}
              <polygon points="0,14 18,22 18,28 0,20" fill="#1e293b" />
              {/* Right face */}
              <polygon points="18,22 36,14 36,20 18,28" fill="#0f172a" />
              {/* Top face */}
              <polygon
                points="18,6 36,14 18,22 0,14"
                fill="url(#block-step-grad)"
                stroke="#475569"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* 3. TACTILE STATUS BADGE (LOCKED OR UNLOCKED) */}
      <div className="absolute -bottom-2.5 z-30 pointer-events-none">
        {isLocked ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border-2 border-slate-700 text-slate-300 font-pixel text-[8px] tracking-wider shadow-[0_3px_0_#0f172a]">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            <span>{completedLevelsCount}/{totalLevelsCount} LOCKED</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-pixel text-[8px] font-black tracking-wider shadow-[0_3px_0_#78350f] animate-pixel-sparkle">
            <Sparkles className="w-2.5 h-2.5 text-slate-950" />
            <span>UNLOCKED</span>
          </div>
        )}
      </div>
    </div>
  );
};
