import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Sparkles, Zap, Check } from "lucide-react";

interface XpPlatformRewardProps {
  themeColor?: string;
  completedLevelsCount?: number;
  unlockLevelThreshold?: number;
  sectionNumber?: number;
  xpAmount?: number;
  onClaimXp?: (amount: number) => void;
  className?: string;
}

export const XpPlatformReward: React.FC<XpPlatformRewardProps> = ({
  themeColor = "purple",
  completedLevelsCount = 0,
  unlockLevelThreshold = 5,
  sectionNumber = 1,
  xpAmount = 250,
  onClaimXp,
  className = "",
}) => {
  const storageKey = `dsa_xp_claimed_sec_${sectionNumber}_${xpAmount}`;

  const [isClaimed, setIsClaimed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch (e) {
      return false;
    }
  });

  const [isShaking, setIsShaking] = useState(false);
  const [showLockedHint, setShowLockedHint] = useState(false);
  const [isBursting, setIsBursting] = useState(false);

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
      setIsShaking(true);
      setShowLockedHint(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setShowLockedHint(false), 2400);
      return;
    }

    if (isClaimed) {
      setIsBursting(true);
      setTimeout(() => setIsBursting(false), 800);
      return;
    }

    // Claim XP
    setIsClaimed(true);
    setIsBursting(true);
    try {
      localStorage.setItem(storageKey, "true");
    } catch (e) {
      // ignore
    }

    if (onClaimXp) {
      onClaimXp(xpAmount);
    }
    setTimeout(() => setIsBursting(false), 1200);
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Platform & XP Crystal Button */}
      <motion.button
        onClick={handleTap}
        animate={
          isShaking
            ? { x: [-5, 5, -4, 4, -2, 2, 0] }
            : isUnlocked && !isClaimed
            ? { y: [0, -4, 0] }
            : { y: 0 }
        }
        transition={
          isShaking
            ? { duration: 0.4 }
            : isUnlocked && !isClaimed
            ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex flex-col items-center cursor-pointer group focus:outline-none"
        title={isUnlocked ? `XP Surge Reward (+${xpAmount} XP)` : `Locked (${completedLevelsCount}/${unlockLevelThreshold})`}
      >
        {/* Ambient Glow */}
        {isUnlocked && (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-6 w-28 h-28 rounded-full pointer-events-none -z-10 blur-xl bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-indigo-500/30"
          />
        )}

        {/* 3D ARCANE XP BOTTLE / ELIXIR CRYSTAL */}
        <div className="relative w-20 h-20 flex items-center justify-center z-10">
          <motion.div
            animate={
              isBursting
                ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }
                : isUnlocked && !isClaimed
                ? { y: [0, -3, 0], rotate: [-2, 2, -2] }
                : {}
            }
            transition={{ duration: isBursting ? 0.6 : 2.5, repeat: isBursting ? 0 : Infinity }}
            className="relative w-14 h-16 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
            style={{
              filter: isUnlocked
                ? "drop-shadow(0 0 12px #eab308) drop-shadow(0 4px 8px rgba(0,0,0,0.6))"
                : "grayscale(0.9) opacity(0.55)",
            }}
          >
            {/* XP Flask / Star Container */}
            <div className="relative w-12 h-14 flex items-center justify-center">
              {/* Bottle Cap */}
              <div className="absolute -top-1.5 w-5 h-2 rounded-t-sm bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-800 border border-amber-300 shadow-sm" />

              {/* Crystal Flask Body */}
              <div
                className="w-12 h-13 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border-2 border-amber-300/80 shadow-inner"
                style={{
                  background: isClaimed
                    ? "linear-gradient(180deg, #334155 0%, #1e293b 100%)"
                    : "linear-gradient(180deg, #f59e0b 0%, #b45309 50%, #78350f 100%)",
                }}
              >
                {/* Liquid Bubble Waves */}
                {!isClaimed && (
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-yellow-400 via-amber-300 to-transparent opacity-80"
                  />
                )}

                {/* Big Bold "XP" Emblem */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="font-pixel font-black text-xs text-white drop-shadow-[0_2px_2px_#000]">
                    XP
                  </span>
                  <span className="text-[9px] font-black text-yellow-100 font-mono leading-none">
                    +{xpAmount}
                  </span>
                </div>

                {/* Gloss Glass Highlight */}
                <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Sparkle Particles on Hover / Unlocked */}
            {isUnlocked && !isClaimed && (
              <div className="absolute -top-1 right-0 text-yellow-200 text-xs animate-bounce">
                ✨
              </div>
            )}
          </motion.div>
        </div>

        {/* 3D ISOMETRIC PEDESTAL / PLATFORM */}
        <div className="relative -mt-6 w-24 h-12 flex flex-col items-center pointer-events-none">
          {/* Ground Ambient Contact Shadow */}
          <div className="absolute -bottom-1 w-24 h-6 rounded-full bg-black/70 blur-sm -z-20" />

          {/* Platform Top Facet */}
          <div
            className="w-22 h-9 relative z-10 border border-t-2"
            style={{
              clipPath: "polygon(50% 0%, 100% 28%, 100% 72%, 50% 100%, 0% 72%, 0% 28%)",
              background: isUnlocked
                ? "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)"
                : "#1e293b",
              borderColor: isUnlocked ? "#f59e0b" : "#475569",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="w-8 h-4 rounded-full border border-dashed border-amber-400" />
            </div>
          </div>

          {/* Platform Front 3D Rim / Skirt */}
          <div
            className="w-22 h-3.5 -mt-1.5 z-0"
            style={{
              clipPath: "polygon(0% 0%, 50% 35%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)",
              background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
              borderBottom: `2px solid ${isUnlocked ? "#92400e" : "#334155"}`,
            }}
          />
        </div>

        {/* STATUS BADGE */}
        <div className="mt-1 flex flex-col items-center">
          {isClaimed ? (
            <div className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-[9px] font-pixel text-emerald-300 font-bold flex items-center gap-1 shadow-sm">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
              <span>CLAIMED</span>
            </div>
          ) : isUnlocked ? (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 border border-amber-300 text-white font-pixel font-black text-[9px] shadow-[0_3px_0_#78350f,0_0_12px_rgba(245,158,11,0.5)] flex items-center gap-1"
            >
              <Zap className="w-2.5 h-2.5 text-yellow-200 fill-yellow-200" />
              <span>+{xpAmount} XP</span>
            </motion.div>
          ) : (
            <div className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-400 font-pixel text-[8.5px] font-bold flex items-center gap-1 shadow-sm">
              <Lock className="w-2.5 h-2.5 text-slate-400" />
              <span>{completedLevelsCount}/{unlockLevelThreshold}</span>
            </div>
          )}
        </div>
      </motion.button>

      {/* LOCKED HINT TOOLTIP */}
      <AnimatePresence>
        {showLockedHint && !isUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: -4, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute -top-12 z-50 px-2.5 py-1.5 rounded-xl bg-slate-900/95 border border-amber-400/40 text-white shadow-xl flex items-center gap-1.5 text-center whitespace-nowrap pointer-events-none"
          >
            <Lock className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="text-[10px] font-pixel text-amber-200">
              Complete {unlockLevelThreshold - completedLevelsCount} more level{unlockLevelThreshold - completedLevelsCount > 1 ? "s" : ""} to claim XP!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
