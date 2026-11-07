import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Sparkles, Check } from "lucide-react";

interface DiamondsPlatformRewardProps {
  themeColor?: string;
  completedLevelsCount?: number;
  unlockLevelThreshold?: number;
  sectionNumber?: number;
  diamondsAmount?: number;
  onClaimDiamonds?: (amount: number) => void;
  className?: string;
}

export const DiamondsPlatformReward: React.FC<DiamondsPlatformRewardProps> = ({
  themeColor = "purple",
  completedLevelsCount = 0,
  unlockLevelThreshold = 3,
  sectionNumber = 1,
  diamondsAmount = 50,
  onClaimDiamonds,
  className = "",
}) => {
  const storageKey = `dsa_diamonds_claimed_sec_${sectionNumber}_${diamondsAmount}`;

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
      setTimeout(() => setIsBursting(false), 700);
      return;
    }

    // Claim Diamonds
    setIsClaimed(true);
    setIsBursting(true);
    try {
      localStorage.setItem(storageKey, "true");
    } catch (e) {
      // ignore
    }

    if (onClaimDiamonds) {
      onClaimDiamonds(diamondsAmount);
    }
    setTimeout(() => setIsBursting(false), 1200);
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Button wrapper */}
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
        title={isUnlocked ? `Diamond Cache (+${diamondsAmount} 💎)` : `Locked (${completedLevelsCount}/${unlockLevelThreshold})`}
      >
        {/* Diamond Aura */}
        {isUnlocked && (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity }}
            className="absolute -top-6 w-28 h-28 rounded-full pointer-events-none -z-10 blur-xl bg-cyan-400/35"
          />
        )}

        {/* 3D DIAMOND CLUSTER */}
        <div className="relative w-20 h-20 flex items-center justify-center z-10">
          <motion.div
            animate={
              isBursting
                ? { scale: [1, 1.3, 1], rotate: [0, -12, 12, 0] }
                : isUnlocked && !isClaimed
                ? { y: [0, -3, 0], rotate: [-1, 1, -1] }
                : {}
            }
            transition={{ duration: isBursting ? 0.6 : 2.5, repeat: isBursting ? 0 : Infinity }}
            className="relative w-14 h-16 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
            style={{
              filter: isUnlocked
                ? "drop-shadow(0 0 14px #06b6d4) drop-shadow(0 4px 8px rgba(0,0,0,0.6))"
                : "grayscale(0.9) opacity(0.55)",
            }}
          >
            {/* Multi-facet Diamond Gem */}
            <div className="relative flex items-center justify-center">
              {/* Back smaller gem */}
              <div
                className="absolute -top-1 -right-2 w-6 h-6 rotate-45 rounded-[3px] border border-cyan-200 opacity-70"
                style={{
                  background: isClaimed
                    ? "#334155"
                    : "linear-gradient(135deg, #a5f3fc 0%, #06b6d4 50%, #0891b2 100%)",
                }}
              />

              {/* Main Cut Diamond */}
              <div
                className="w-11 h-11 rotate-45 rounded-[4px] relative overflow-hidden border-2 border-cyan-200 shadow-lg flex items-center justify-center"
                style={{
                  background: isClaimed
                    ? "linear-gradient(135deg, #475569 0%, #1e293b 100%)"
                    : "linear-gradient(135deg, #cffafe 0%, #22d3ee 30%, #0284c7 80%, #0c4a6e 100%)",
                }}
              >
                {/* Inner Facet Lines */}
                <div className="w-5 h-5 border border-white/60 rotate-45 bg-white/20 rounded-[2px]" />

                {/* Glint Flare */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
              </div>

              {/* Sparkle star */}
              {isUnlocked && !isClaimed && (
                <div className="absolute -top-3 -right-1 text-cyan-200 text-sm animate-ping">
                  ✦
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 3D PEDESTAL */}
        <div className="relative -mt-6 w-24 h-12 flex flex-col items-center pointer-events-none">
          <div className="absolute -bottom-1 w-24 h-6 rounded-full bg-black/70 blur-sm -z-20" />

          {/* Platform Top Facet */}
          <div
            className="w-22 h-9 relative z-10 border border-t-2"
            style={{
              clipPath: "polygon(50% 0%, 100% 28%, 100% 72%, 50% 100%, 0% 72%, 0% 28%)",
              background: isUnlocked
                ? "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)"
                : "#1e293b",
              borderColor: isUnlocked ? "#22d3ee" : "#475569",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="w-8 h-4 rounded-full border border-dashed border-cyan-400" />
            </div>
          </div>

          {/* Platform Front 3D Rim */}
          <div
            className="w-22 h-3.5 -mt-1.5 z-0"
            style={{
              clipPath: "polygon(0% 0%, 50% 35%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)",
              background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
              borderBottom: `2px solid ${isUnlocked ? "#0891b2" : "#334155"}`,
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
              className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300 text-white font-pixel font-black text-[9px] shadow-[0_3px_0_#0369a1,0_0_12px_rgba(6,182,212,0.5)] flex items-center gap-1"
            >
              <span>+{diamondsAmount} 💎</span>
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
            className="absolute -top-12 z-50 px-2.5 py-1.5 rounded-xl bg-slate-900/95 border border-cyan-400/40 text-white shadow-xl flex items-center gap-1.5 text-center whitespace-nowrap pointer-events-none"
          >
            <Lock className="w-3 h-3 text-cyan-400 flex-shrink-0" />
            <span className="text-[10px] font-pixel text-cyan-200">
              Clear {unlockLevelThreshold - completedLevelsCount} more level{unlockLevelThreshold - completedLevelsCount > 1 ? "s" : ""} to unlock diamonds!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
