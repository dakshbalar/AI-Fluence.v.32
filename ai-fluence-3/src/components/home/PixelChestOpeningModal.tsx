import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Zap, Trophy, X, ChevronRight, Check } from "lucide-react";
import { ModernChestGraphic, ChestTier } from "./PixelChestGraphic";
import { CornerStarsAndSmokeBackground } from "../onboarding-animations/shared/CornerStarsAndSmokeBackground";

export interface ChestRewardsData {
  xp: number;
  diamonds: number;
  trophies: number;
  bonusTitle?: string;
  sourceTitle?: string;
  tier?: ChestTier;
}

interface PixelChestOpeningModalProps {
  isOpen: boolean;
  rewards: ChestRewardsData;
  tier?: ChestTier;
  onClose: () => void;
  onCollect: (rewards: ChestRewardsData) => void;
}

export const PixelChestOpeningModal: React.FC<PixelChestOpeningModalProps> = ({
  isOpen,
  rewards,
  tier: propTier,
  onClose,
  onCollect,
}) => {
  const activeTier: ChestTier = propTier || rewards.tier || "gold";

  // Sequential reward reveal stages (matching Welcome Back Slide 3 pacing):
  // 0: Chest closed, ready to unlock
  // 1: Chest pops open, shockwave burst
  // 2: Reward 1 (XP) pops into center
  // 3: Reward 1 flies up to header
  // 4: Reward 2 (Diamonds) pops into center
  // 5: Reward 2 flies up to header
  // 6: Reward 3 (Trophies) pops into center
  // 7: Reward 3 flies up to header
  // 8: All rewards claimed celebration
  const [stage, setStage] = useState<number>(0);
  const [headerXp, setHeaderXp] = useState<number>(0);
  const [headerDiamonds, setHeaderDiamonds] = useState<number>(0);
  const [headerTrophies, setHeaderTrophies] = useState<number>(0);

  const [pulseXp, setPulseXp] = useState(false);
  const [pulseDiamonds, setPulseDiamonds] = useState(false);
  const [pulseTrophies, setPulseTrophies] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStage(0);
      setHeaderXp(0);
      setHeaderDiamonds(0);
      setHeaderTrophies(0);
      return;
    }

    // Stage timing pipeline
    const t0 = setTimeout(() => setStage(1), 700);
    const t1 = setTimeout(() => setStage(2), 1400);

    const t2 = setTimeout(() => {
      setStage(3);
      setHeaderXp(rewards.xp || 50);
      setPulseXp(true);
      setTimeout(() => setPulseXp(false), 500);
    }, 2500);

    const t3 = setTimeout(() => setStage(4), 3100);

    const t4 = setTimeout(() => {
      setStage(5);
      setHeaderDiamonds(rewards.diamonds || 25);
      setPulseDiamonds(true);
      setTimeout(() => setPulseDiamonds(false), 500);
    }, 4200);

    const t5 = setTimeout(() => setStage(6), 4800);

    const t6 = setTimeout(() => {
      setStage(7);
      setHeaderTrophies(rewards.trophies || 20);
      setPulseTrophies(true);
      setTimeout(() => setPulseTrophies(false), 500);
    }, 5900);

    const t7 = setTimeout(() => setStage(8), 6500);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [isOpen, rewards]);

  // Chest tier styling, particle palette and ambient glow logic
  const tierConfig = React.useMemo(() => {
    switch (activeTier) {
      case "bronze":
        return {
          glowColor: "rgba(234, 88, 12, 0.45)",
          ringColor: "border-orange-500/50",
          titleColor: "text-amber-400",
          bgTheme: "bronze" as const,
          particleColors: ["#ea580c", "#f97316", "#d97706", "#fde047", "#fed7aa", "#c2410c"],
          sparkleColor: "#fb923c",
        };
      case "silver":
        return {
          glowColor: "rgba(56, 189, 248, 0.5)",
          ringColor: "border-sky-400/50",
          titleColor: "text-sky-300",
          bgTheme: "silver" as const,
          particleColors: ["#38bdf8", "#7dd3fc", "#e2e8f0", "#ffffff", "#94a3b8", "#0284c7"],
          sparkleColor: "#38bdf8",
        };
      case "crystal":
      case "deluxe":
        return {
          glowColor: "rgba(168, 85, 247, 0.55)",
          ringColor: "border-purple-400/50",
          titleColor: "text-purple-300",
          bgTheme: "purple" as const,
          particleColors: ["#c084fc", "#e879f9", "#a855f7", "#38bdf8", "#ffffff", "#f43f5e"],
          sparkleColor: "#e879f9",
        };
      case "gold":
      default:
        return {
          glowColor: "rgba(250, 204, 21, 0.55)",
          ringColor: "border-yellow-400/50",
          titleColor: "text-yellow-400",
          bgTheme: "gold" as const,
          particleColors: ["#facc15", "#f59e0b", "#fbbf24", "#fef08a", "#ffffff", "#d97706"],
          sparkleColor: "#facc15",
        };
    }
  }, [activeTier]);

  if (!isOpen) return null;

  const tierGlow = tierConfig;

  const handleContainerTap = () => {
    if (stage < 8) {
      setHeaderXp(rewards.xp || 50);
      setHeaderDiamonds(rewards.diamonds || 25);
      setHeaderTrophies(rewards.trophies || 20);
      setStage(8);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[320] bg-[#07090e]/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden"
      onClick={handleContainerTap}
    >
      {/* Background stars & smoke adapted to chest tier */}
      <CornerStarsAndSmokeBackground
        theme={tierGlow.bgTheme}
        topStarsClassName="top-8"
        bottomStarsClassName="bottom-12"
      />

      {/* Dynamic ambient radial burst corresponding directly to chest type */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${tierGlow.glowColor} 0%, transparent 65%)`,
          opacity: stage >= 1 ? 1 : 0.4,
        }}
      />

      {/* =========================================================================
          1. TOP STATS BAR (FLY-TO TARGETS)
          ========================================================================= */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between z-20 pt-2">
        <div className="flex items-center gap-2">
          {/* XP Pill */}
          <motion.div
            animate={pulseXp ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold shadow-md shadow-amber-500/10"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>+{headerXp} XP</span>
          </motion.div>

          {/* Diamonds Pill */}
          <motion.div
            animate={pulseDiamonds ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold shadow-md shadow-cyan-500/10"
          >
            <span className="text-xs">💎</span>
            <span>+{headerDiamonds}</span>
          </motion.div>

          {/* Trophies Pill */}
          <motion.div
            animate={pulseTrophies ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 font-mono text-xs font-bold shadow-md shadow-yellow-500/10"
          >
            <Trophy className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>+{headerTrophies}</span>
          </motion.div>
        </div>

        {/* Dismiss / Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* =========================================================================
          2. CENTER STAGE: LARGE IMPRESSIVE CHEST & SEQUENTIAL REWARDS REVEAL
          ========================================================================= */}
      <main className="relative w-full max-w-md flex-1 flex flex-col items-center justify-center z-20 py-4">
        {/* Tier & Source Badge */}
        <div className="text-center mb-4">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-[11px] font-mono uppercase tracking-widest font-black px-3.5 py-1 rounded-full border ${tierGlow.ringColor} ${tierGlow.titleColor} bg-slate-950/80 shadow-md`}
          >
            {activeTier.toUpperCase()} CHEST • {rewards.sourceTitle || "ACADEMY LOOT"}
          </motion.span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2 drop-shadow-md">
            {stage === 0
              ? "Unlocking Chest..."
              : stage >= 8
              ? "All Rewards Claimed!"
              : "Claiming Rewards..."}
          </h2>
        </div>

        {/* Chest Display (Sized big & prominent as requested) */}
        <div className="relative my-2 flex items-center justify-center">
          <motion.div
            animate={
              stage === 0
                ? {
                    rotate: [-3, 3, -3, 3, 0],
                    scale: [1, 1.05, 1, 1.05, 1],
                  }
                : stage === 1
                ? {
                    scale: [1, 1.18, 1.08],
                    y: [0, -10, -2],
                  }
                : {
                    scale: stage >= 2 && stage < 8 ? 0.9 : 1,
                    opacity: stage >= 2 && stage < 8 ? 0.4 : 1,
                  }
            }
            transition={{
              duration: stage === 0 ? 0.6 : 0.4,
              ease: "easeInOut",
            }}
          >
            <ModernChestGraphic
              status={stage >= 1 ? "open" : "closed"}
              tier={activeTier}
              size={stage >= 8 ? 160 : 185}
              isOpening={stage === 1}
            />
          </motion.div>

          {/* Radial shockwave burst upon unlock */}
          {stage === 1 && (
            <motion.div
              initial={{ scale: 0.4, opacity: 1 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className={`absolute inset-0 rounded-full border-2 ${tierGlow.ringColor} pointer-events-none`}
            />
          )}

          {/* Dynamic Theme-Colored Erupting Chest Particles */}
          {stage >= 1 && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {[...Array(16)].map((_, i) => {
                const angle = (i / 16) * 360;
                const rad = (angle * Math.PI) / 180;
                const distance = 70 + (i % 4) * 22;
                const x = Math.cos(rad) * distance;
                const y = Math.sin(rad) * distance - 25;
                const color = tierGlow.particleColors[i % tierGlow.particleColors.length];
                const size = 6 + (i % 3) * 3;
                return (
                  <motion.div
                    key={`chest-particle-${activeTier}-${i}`}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{
                      x: [0, x * 1.1, x],
                      y: [0, y * 1.1, y],
                      scale: [0, 1.4, 1],
                      opacity: [1, 1, 0.7],
                      rotate: [0, angle + 90, angle + 180],
                    }}
                    transition={{
                      duration: 0.9 + (i % 5) * 0.15,
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: 0.2,
                    }}
                    className="absolute rounded-full shadow-lg"
                    style={{
                      width: size,
                      height: size,
                      backgroundColor: color,
                      boxShadow: `0 0 ${size * 2}px ${color}`,
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* =========================================================================
            SEQUENTIAL REWARD CARDS
            ========================================================================= */}
        <div className="relative w-full h-40 flex items-center justify-center">
          {/* REWARD 1: XP / LIGHTNING */}
          <AnimatePresence>
            {(stage === 2 || stage === 3) && (
              <motion.div
                key="reward-xp-card"
                initial={{ scale: 0.3, opacity: 0, y: 30 }}
                animate={
                  stage === 3
                    ? { scale: 0.35, opacity: 0, y: -240, x: -110 }
                    : { scale: [0.3, 1.18, 1], opacity: 1, y: [30, -5, 0] }
                }
                exit={{ opacity: 0 }}
                transition={
                  stage === 3
                    ? { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                    : { duration: 0.45, ease: "easeOut" }
                }
                className="absolute flex flex-col items-center justify-center pointer-events-none"
              >
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-amber-600/30 border-2 border-yellow-400/60 flex items-center justify-center shadow-[0_0_45px_rgba(250,204,21,0.55)] mb-3">
                  <Zap className="w-12 h-12 text-yellow-300 fill-yellow-400 filter drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] animate-pulse" />
                  <Sparkles className="w-5 h-5 text-amber-300 absolute -top-2 -right-2 animate-spin" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-black text-lg tracking-wider shadow-lg">
                  +{rewards.xp || 50} XP
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* REWARD 2: DIAMONDS */}
          <AnimatePresence>
            {(stage === 4 || stage === 5) && (
              <motion.div
                key="reward-diamonds-card"
                initial={{ scale: 0.3, opacity: 0, rotate: -15, y: 30 }}
                animate={
                  stage === 5
                    ? { scale: 0.35, opacity: 0, y: -240, x: 0 }
                    : { scale: [0.3, 1.18, 1], opacity: 1, rotate: [-15, 5, 0], y: [30, -5, 0] }
                }
                exit={{ opacity: 0 }}
                transition={
                  stage === 5
                    ? { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                    : { duration: 0.45, ease: "easeOut" }
                }
                className="absolute flex flex-col items-center justify-center pointer-events-none"
              >
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500/30 via-sky-400/20 to-blue-600/30 border-2 border-cyan-400/60 flex items-center justify-center shadow-[0_0_45px_rgba(6,182,212,0.55)] mb-3">
                  <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">💎</span>
                  <Sparkles className="w-5 h-5 text-cyan-300 absolute -top-2 -left-2 animate-pulse" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-black text-lg tracking-wider shadow-lg">
                  +{rewards.diamonds || 25} Diamonds
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* REWARD 3: TROPHIES */}
          <AnimatePresence>
            {(stage === 6 || stage === 7) && (
              <motion.div
                key="reward-trophies-card"
                initial={{ scale: 0.3, opacity: 0, y: 30 }}
                animate={
                  stage === 7
                    ? { scale: 0.35, opacity: 0, y: -240, x: 110 }
                    : { scale: [0.3, 1.18, 1], opacity: 1, y: [30, -5, 0] }
                }
                exit={{ opacity: 0 }}
                transition={
                  stage === 7
                    ? { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                    : { duration: 0.45, ease: "easeOut" }
                }
                className="absolute flex flex-col items-center justify-center pointer-events-none"
              >
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-yellow-500/30 via-amber-400/20 to-yellow-600/30 border-2 border-yellow-400/60 flex items-center justify-center shadow-[0_0_45px_rgba(234,179,8,0.55)] mb-3">
                  <Trophy className="w-12 h-12 text-yellow-300 fill-yellow-400 filter drop-shadow-[0_0_14px_rgba(234,179,8,0.8)]" />
                  <Sparkles className="w-5 h-5 text-yellow-200 absolute -top-2 -right-2 animate-spin" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 font-mono font-black text-lg tracking-wider shadow-lg">
                  +{rewards.trophies || 20} Trophies
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SETTLED ALL REWARDS SUMMARY ROW */}
          {stage >= 8 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex items-center justify-center gap-2.5"
            >
              <div className="flex-1 p-3 rounded-2xl bg-[#0e1628] border border-amber-400/30 text-center shadow-lg">
                <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">XP</div>
                <div className="text-base font-mono font-black text-white">+{rewards.xp || 50}</div>
              </div>
              <div className="flex-1 p-3 rounded-2xl bg-[#0e1628] border border-cyan-400/30 text-center shadow-lg">
                <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">GEMS</div>
                <div className="text-base font-mono font-black text-white">+{rewards.diamonds || 25}</div>
              </div>
              <div className="flex-1 p-3 rounded-2xl bg-[#0e1628] border border-yellow-400/30 text-center shadow-lg">
                <div className="text-[10px] font-mono uppercase text-yellow-400 font-bold">TROPHIES</div>
                <div className="text-base font-mono font-black text-white">+{rewards.trophies || 20}</div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* =========================================================================
          3. FOOTER: CLEAN TACTILE CALL TO ACTION (NO AIDEN ENTITY AS REQUESTED)
          ========================================================================= */}
      <footer className="w-full max-w-md mx-auto z-20 space-y-2.5 pb-2">
        {/* Subtle helper text */}
        <p className="text-center text-xs text-slate-400 font-medium">
          {stage < 8 ? "Tap anywhere to skip reveal..." : "All items deposited into inventory"}
        </p>

        {/* Tactile Primary Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (stage < 8) {
              setHeaderXp(rewards.xp || 50);
              setHeaderDiamonds(rewards.diamonds || 25);
              setHeaderTrophies(rewards.trophies || 20);
              setStage(8);
            } else {
              onCollect(rewards);
            }
          }}
          className="w-full py-4 rounded-2xl font-sans font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 shadow-[0_5px_0_#78350f,0_10px_25px_rgba(245,158,11,0.35)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-transform"
        >
          {stage < 8 ? (
            <>
              <span>SKIP REVEAL & COLLECT</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </>
          ) : (
            <>
              <Check className="w-5 h-5 stroke-[3]" />
              <span>COLLECT & CONTINUE</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
};
