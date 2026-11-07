import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Sparkles, Zap, Check, Clock, ShieldCheck, Heart } from "lucide-react";

export type StoneDuration = "1h" | "3h" | "6h" | "24h";

interface StonePlatformRewardProps {
  themeColor?: string;
  completedLevelsCount?: number;
  unlockLevelThreshold?: number;
  sectionNumber?: number;
  duration?: StoneDuration;
  onActivateUnlimitedLives?: (hours: number) => void;
  className?: string;
}

export const StonePlatformReward: React.FC<StonePlatformRewardProps> = ({
  themeColor = "purple",
  completedLevelsCount = 0,
  unlockLevelThreshold = 3,
  sectionNumber = 1,
  duration = "1h",
  onActivateUnlimitedLives,
  className = "",
}) => {
  const durationHours = duration === "24h" ? 24 : parseInt(duration, 10) || 1;
  const storageKey = `dsa_stone_claimed_sec_${sectionNumber}_${duration}`;

  const [isClaimed, setIsClaimed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch (e) {
      return false;
    }
  });

  const [isShaking, setIsShaking] = useState(false);
  const [showLockedHint, setShowLockedHint] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);

  useEffect(() => {
    try {
      setIsClaimed(localStorage.getItem(storageKey) === "true");
    } catch (e) {
      // ignore
    }
  }, [storageKey]);

  const isUnlocked = completedLevelsCount >= unlockLevelThreshold;

  const durationLabel = duration === "24h" ? "1 DAY" : `${durationHours} HOURS`;

  const handleTap = () => {
    if (!isUnlocked) {
      setIsShaking(true);
      setShowLockedHint(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setShowLockedHint(false), 2400);
      return;
    }

    if (isClaimed) {
      // Already claimed, show info dialog
      setShowActivationModal(true);
      return;
    }

    // Open activation modal
    setShowActivationModal(true);
  };

  const handleConfirmActivate = () => {
    setIsClaimed(true);
    try {
      localStorage.setItem(storageKey, "true");
    } catch (e) {
      // ignore
    }

    if (onActivateUnlimitedLives) {
      onActivateUnlimitedLives(durationHours);
    }
    setShowActivationModal(false);
  };

  // Color styles for Stone
  const stoneColors = React.useMemo(() => {
    switch (duration) {
      case "1h":
        return {
          primary: "#10b981", // Emerald
          secondary: "#059669",
          dark: "#064e3b",
          highlight: "#6ee7b7",
          glow: "rgba(16, 185, 129, 0.5)",
          tagBg: "from-emerald-500 to-teal-700",
          border: "border-emerald-300",
        };
      case "3h":
        return {
          primary: "#06b6d4", // Cyan
          secondary: "#0891b2",
          dark: "#164e63",
          highlight: "#67e8f9",
          glow: "rgba(6, 182, 212, 0.5)",
          tagBg: "from-cyan-500 to-blue-700",
          border: "border-cyan-300",
        };
      case "6h":
        return {
          primary: "#8b5cf6", // Purple
          secondary: "#7c3aed",
          dark: "#4c1d95",
          highlight: "#c4b5fd",
          glow: "rgba(139, 92, 246, 0.5)",
          tagBg: "from-purple-500 to-indigo-800",
          border: "border-purple-300",
        };
      case "24h":
      default:
        return {
          primary: "#f59e0b", // Gold / Amber
          secondary: "#d97706",
          dark: "#78350f",
          highlight: "#fde68a",
          glow: "rgba(245, 158, 11, 0.55)",
          tagBg: "from-amber-400 to-rose-700",
          border: "border-amber-300",
        };
    }
  }, [duration]);

  return (
    <>
      <div className={`relative flex flex-col items-center select-none ${className}`}>
        {/* Hovering Stone & Pedestal Button */}
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
              ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex flex-col items-center cursor-pointer group focus:outline-none"
          title={isUnlocked ? `Unlimited Lives Stone (${durationLabel})` : `Locked (${completedLevelsCount}/${unlockLevelThreshold})`}
        >
          {/* Cosmic Aura & Rays when unlocked */}
          {isUnlocked && (
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ rotate: { duration: 16, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity } }}
              className="absolute -top-6 w-28 h-28 rounded-full pointer-events-none -z-10 blur-xl opacity-60"
              style={{
                background: `radial-gradient(circle, ${stoneColors.glow} 0%, rgba(0,0,0,0) 70%)`,
              }}
            />
          )}

          {/* THE 3D TIME / INFINITY STONE */}
          <div className="relative w-20 h-20 flex items-center justify-center z-10">
            {/* Spinning Energy Rings */}
            {isUnlocked && (
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed pointer-events-none opacity-40"
                style={{ borderColor: stoneColors.highlight }}
              />
            )}

            {/* Glowing Stone Crystal Mesh */}
            <motion.div
              animate={
                isUnlocked && !isClaimed
                  ? { rotateY: [0, 180, 360], scale: [1, 1.06, 1] }
                  : { scale: 1 }
              }
              transition={{
                rotateY: { duration: 6, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative w-14 h-16 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              style={{
                filter: isUnlocked
                  ? `drop-shadow(0 0 14px ${stoneColors.primary}) drop-shadow(0 4px 8px rgba(0,0,0,0.7))`
                  : "grayscale(0.9) opacity(0.55)",
              }}
            >
              {/* Octagonal / Hexagonal Crystal Facets */}
              <div
                className="w-11 h-14 relative"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  background: `linear-gradient(135deg, ${stoneColors.highlight} 0%, ${stoneColors.primary} 45%, ${stoneColors.dark} 100%)`,
                  border: `2px solid ${stoneColors.highlight}`,
                }}
              >
                {/* Internal Crystal Core / Rune */}
                <div className="absolute inset-1.5 flex items-center justify-center rounded-sm">
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      clipPath: "polygon(50% 10%, 90% 30%, 90% 70%, 50% 90%, 10% 70%, 10% 30%)",
                      background: `linear-gradient(to bottom, rgba(255,255,255,0.7), ${stoneColors.secondary})`,
                    }}
                  >
                    {/* Infinity / Zap Glyph */}
                    <span className="text-white font-black text-xs drop-shadow-[0_0_4px_#000]">
                      ∞
                    </span>
                  </div>
                </div>

                {/* Crystal Specular Shimmer */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/45 to-transparent pointer-events-none" />
              </div>

              {/* Floating magical sparkles */}
              {isUnlocked && !isClaimed && (
                <div className="absolute -top-1 -right-1 text-yellow-300 text-xs animate-ping">
                  ✦
                </div>
              )}
            </motion.div>
          </div>

          {/* 3D ISOMETRIC PEDESTAL / PLATFORM */}
          <div className="relative -mt-6 w-24 h-12 flex flex-col items-center pointer-events-none">
            {/* Ground Ambient Contact Shadow */}
            <div className="absolute -bottom-1 w-24 h-6 rounded-full bg-black/70 blur-sm -z-20" />

            {/* Platform Top Facet (Isometric Hexagon) */}
            <div
              className="w-22 h-9 relative z-10 border border-t-2"
              style={{
                clipPath: "polygon(50% 0%, 100% 28%, 100% 72%, 50% 100%, 0% 72%, 0% 28%)",
                background: isUnlocked
                  ? "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)"
                  : "#1e293b",
                borderColor: isUnlocked ? stoneColors.primary : "#475569",
              }}
            >
              {/* Rune in center of pedestal */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-8 h-4 rounded-full border border-dashed" style={{ borderColor: stoneColors.highlight }} />
              </div>
            </div>

            {/* Platform Front 3D Rim / Skirt */}
            <div
              className="w-22 h-3.5 -mt-1.5 z-0"
              style={{
                clipPath: "polygon(0% 0%, 50% 35%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)",
                background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
                borderBottom: `2px solid ${isUnlocked ? stoneColors.dark : "#334155"}`,
              }}
            />
          </div>

          {/* BADGE / STATUS LABEL PILL */}
          <div className="mt-1 flex flex-col items-center">
            {isClaimed ? (
              <div className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center gap-1 text-[9px] font-pixel text-emerald-300 font-bold">
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span>ACTIVE</span>
              </div>
            ) : isUnlocked ? (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`px-2.5 py-0.5 rounded-full bg-gradient-to-r ${stoneColors.tagBg} border ${stoneColors.border} text-white font-pixel font-black text-[9px] shadow-[0_3px_0_rgba(0,0,0,0.6),0_0_12px_${stoneColors.glow}] flex items-center gap-1`}
              >
                <Zap className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" />
                <span>{durationLabel} LIVES</span>
              </motion.div>
            ) : (
              <div className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-400 font-pixel text-[8.5px] font-bold flex items-center gap-1 shadow-sm">
                <Lock className="w-2.5 h-2.5 text-slate-400" />
                <span>{completedLevelsCount}/{unlockLevelThreshold}</span>
              </div>
            )}
          </div>
        </motion.button>

        {/* LOCKED TOOLTIP HINT */}
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
                Solve {unlockLevelThreshold - completedLevelsCount} more level{unlockLevelThreshold - completedLevelsCount > 1 ? "s" : ""} to unlock!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ACTIVATION MODAL */}
      <AnimatePresence>
        {showActivationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl p-6 bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#020617] border-2 border-emerald-400/40 text-white shadow-[0_0_50px_rgba(16,185,129,0.3)] flex flex-col items-center text-center overflow-hidden"
            >
              {/* Background ambient light */}
              <div
                className="absolute -top-24 w-60 h-60 rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ background: stoneColors.glow }}
              />

              {/* Glowing animated Stone */}
              <motion.div
                animate={{ rotateY: [0, 360], y: [0, -6, 0] }}
                transition={{
                  rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
                className="w-20 h-24 my-3 flex items-center justify-center filter drop-shadow-[0_0_20px_#10b981]"
              >
                <div
                  className="w-14 h-20 relative flex items-center justify-center"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    background: `linear-gradient(135deg, ${stoneColors.highlight} 0%, ${stoneColors.primary} 45%, ${stoneColors.dark} 100%)`,
                    border: `2px solid ${stoneColors.highlight}`,
                  }}
                >
                  <span className="text-white font-black text-2xl drop-shadow-[0_0_8px_#000]">
                    ∞
                  </span>
                </div>
              </motion.div>

              <h3 className="text-lg font-pixel font-black text-emerald-300 tracking-wider mt-1">
                TIME STONE ACTIVATED!
              </h3>

              <div className="my-3 px-4 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">
                    {durationLabel} UNLIMITED LIVES
                  </span>
                  <span className="text-[10px] text-emerald-300">
                    No hearts or energy deducted on wrong answers!
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                Harness the cosmic energy of the Time Stone. Practice and conquer any algorithm, quiz, or challenge with zero penalties!
              </p>

              {/* Action Buttons */}
              <div className="w-full flex gap-3">
                <button
                  onClick={() => setShowActivationModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs font-bold transition-all cursor-pointer"
                >
                  LATER
                </button>
                <button
                  onClick={handleConfirmActivate}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-white font-pixel text-xs font-black shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                  ACTIVATE NOW
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
