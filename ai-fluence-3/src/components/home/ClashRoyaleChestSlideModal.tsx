import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Zap, Heart, Shield, Check, X, ArrowRight } from "lucide-react";
import { QuestRewardChest, QuestChestTier } from "./QuestRewardChest";

export interface LootItem {
  id: string;
  type: "diamonds" | "xp" | "bonus";
  title: string;
  amount: string | number;
  icon: React.ReactNode;
  bgGrad: string;
  borderCol: string;
  glowCol: string;
  badge?: string;
}

interface ClashRoyaleChestSlideModalProps {
  isOpen: boolean;
  tier: QuestChestTier;
  chestName: string;
  rewardXP: number;
  rewardDiamonds: number;
  bonusReward?: string;
  onCollect: () => void;
  onClose?: () => void;
}

export const ClashRoyaleChestSlideModal: React.FC<ClashRoyaleChestSlideModalProps> = ({
  isOpen,
  tier,
  chestName,
  rewardXP,
  rewardDiamonds,
  bonusReward,
  onCollect,
  onClose,
}) => {
  // Opening steps: "closed" -> "revealing" -> "summary"
  const [step, setStep] = useState<"closed" | "opening" | "revealing" | "summary">("closed");
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Construct individual loot cards
  const cards: LootItem[] = React.useMemo(() => {
    const list: LootItem[] = [
      {
        id: "loot-diamonds",
        type: "diamonds",
        title: "Diamonds",
        amount: `+${rewardDiamonds}`,
        icon: <Sparkles className="w-12 h-12 text-cyan-300 fill-cyan-400" />,
        bgGrad: "from-cyan-900/90 via-sky-950 to-black",
        borderCol: "border-cyan-400/80",
        glowCol: "rgba(6, 182, 212, 0.4)",
        badge: "GEMS",
      },
      {
        id: "loot-xp",
        type: "xp",
        title: "Course XP",
        amount: `+${rewardXP}`,
        icon: <Zap className="w-12 h-12 text-amber-300 fill-amber-400" />,
        bgGrad: "from-amber-900/90 via-purple-950 to-black",
        borderCol: "border-amber-400/80",
        glowCol: "rgba(245, 158, 11, 0.4)",
        badge: "LEVEL UP",
      },
    ];

    if (bonusReward) {
      list.push({
        id: "loot-bonus",
        type: "bonus",
        title: bonusReward,
        amount: "RARE",
        icon: <Shield className="w-12 h-12 text-emerald-300 fill-emerald-400/30" />,
        bgGrad: "from-emerald-900/90 via-teal-950 to-black",
        borderCol: "border-emerald-400/80",
        glowCol: "rgba(16, 185, 129, 0.4)",
        badge: "SPECIAL",
      });
    }

    return list;
  }, [rewardDiamonds, rewardXP, bonusReward]);

  // Reset states on open
  useEffect(() => {
    if (isOpen) {
      setStep("closed");
      setActiveCardIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle tap anywhere
  const handleTap = () => {
    if (step === "closed") {
      setStep("opening");
      setTimeout(() => {
        setStep("revealing");
        setActiveCardIndex(0);
      }, 450);
    } else if (step === "revealing") {
      if (activeCardIndex < cards.length - 1) {
        setActiveCardIndex((prev) => prev + 1);
      } else {
        setStep("summary");
      }
    }
  };

  const remainingCount = cards.length - activeCardIndex - 1;
  const currentCard = cards[activeCardIndex];

  // Theme configuration for background rays, sparkles, and auras matching chest color
  const chestTheme = React.useMemo(() => {
    switch (tier) {
      case "deluxe":
        return {
          sunburst:
            "radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(192,132,252,0.2) 45%, transparent 70%)",
          particleColors: ["#c084fc", "#e879f9", "#a855f7", "#d8b4fe", "#9333ea", "#f0abfc"],
          chestGlow: "drop-shadow-[0_0_55px_rgba(168,85,247,0.75)]",
          burstGlow: "drop-shadow-[0_0_85px_rgba(192,132,252,0.95)]",
          openAura: "rgba(168, 85, 247, 0.4)",
        };
      case "gold":
        return {
          sunburst:
            "radial-gradient(circle, rgba(245,158,11,0.45) 0%, rgba(250,204,21,0.2) 45%, transparent 70%)",
          particleColors: ["#facc15", "#f59e0b", "#fbbf24", "#fef08a", "#d97706", "#ffffff"],
          chestGlow: "drop-shadow-[0_0_55px_rgba(245,158,11,0.75)]",
          burstGlow: "drop-shadow-[0_0_85px_rgba(250,204,21,0.95)]",
          openAura: "rgba(245, 158, 11, 0.4)",
        };
      case "silver":
        return {
          sunburst:
            "radial-gradient(circle, rgba(56,189,248,0.45) 0%, rgba(148,163,184,0.2) 45%, transparent 70%)",
          particleColors: ["#38bdf8", "#7dd3fc", "#bae6fd", "#e2e8f0", "#94a3b8", "#ffffff"],
          chestGlow: "drop-shadow-[0_0_55px_rgba(56,189,248,0.75)]",
          burstGlow: "drop-shadow-[0_0_85px_rgba(125,211,252,0.95)]",
          openAura: "rgba(56, 189, 248, 0.4)",
        };
      case "bronze":
      default:
        return {
          sunburst:
            "radial-gradient(circle, rgba(234,88,12,0.45) 0%, rgba(249,115,22,0.2) 45%, transparent 70%)",
          particleColors: ["#ea580c", "#f97316", "#fb923c", "#fed7aa", "#d97706", "#c2410c"],
          chestGlow: "drop-shadow-[0_0_55px_rgba(234,88,12,0.75)]",
          burstGlow: "drop-shadow-[0_0_85px_rgba(249,115,22,0.95)]",
          openAura: "rgba(234, 88, 12, 0.4)",
        };
    }
  }, [tier]);

  return (
    <div
      onClick={handleTap}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none cursor-pointer overflow-hidden text-center"
    >
      {/* Background Rotating Sunburst Light Rays in Exact Chest Theme Color */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-[720px] h-[720px] pointer-events-none opacity-30"
        style={{
          background: chestTheme.sunburst,
        }}
      />

      {/* Floating Sparkle Particles in Exact Chest Theme Color */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(18)].map((_, i) => {
          const color = chestTheme.particleColors[i % chestTheme.particleColors.length];
          const size = 5 + (i % 4) * 2;
          return (
            <motion.div
              key={i}
              initial={{
                x: (i * 41) % 360 - 180,
                y: 220,
                opacity: 0,
                scale: 0.4,
              }}
              animate={{
                y: -260,
                opacity: [0, 0.95, 0],
                scale: [0.4, 1.3, 0.5],
              }}
              transition={{
                duration: 2.4 + (i % 4) * 0.4,
                repeat: Infinity,
                delay: (i * 0.22) % 2.5,
                ease: "easeOut",
              }}
              className="absolute left-1/2 top-1/2 rounded-full"
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

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center -mt-6 sm:-mt-10">
        {/* ===================================================================
            STAGE 1: CLOSED CHEST (WAITING FOR TAP) - HIGH ON SCREEN & BIGGER
            =================================================================== */}
        {step === "closed" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            {/* Bouncing Chest: High, Grand & Sized Extra Large */}
            <motion.div
              animate={{
                y: [0, -14, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`my-3 sm:my-4 ${chestTheme.chestGlow}`}
            >
              <QuestRewardChest tier={tier} size="2xl" isClaimed={false} isReadyToClaim={true} />
            </motion.div>

            {/* Minimal Tap Prompt */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.02, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="mt-4 sm:mt-6 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-black text-xs uppercase tracking-wider backdrop-blur-md shadow-lg"
            >
              Tap to Open ({cards.length} items)
            </motion.div>
          </motion.div>
        )}

        {/* ===================================================================
            STAGE 2: CHEST BURSTING OPEN
            =================================================================== */}
        {step === "opening" && (
          <motion.div
            animate={{
              x: [-10, 10, -8, 8, -4, 4, 0],
              scale: [1, 1.18, 1.08],
            }}
            transition={{ duration: 0.45 }}
            className={`flex flex-col items-center ${chestTheme.burstGlow}`}
          >
            <QuestRewardChest tier={tier} size="2xl" isClaimed={true} />
          </motion.div>
        )}

        {/* ===================================================================
            STAGE 3: REVEALING CARDS ONE BY ONE (CLASH ROYALE STYLE)
            =================================================================== */}
        {step === "revealing" && currentCard && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ scale: 0.3, y: 80, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.7, y: -60, opacity: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 220 }}
              className="w-full flex flex-col items-center"
            >
              {/* Card Container */}
              <div
                className={`w-64 rounded-3xl bg-gradient-to-b ${currentCard.bgGrad} border-2 ${currentCard.borderCol} p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden`}
                style={{
                  boxShadow: `0 0 40px ${currentCard.glowCol}`,
                }}
              >
                {/* Diagonal Card Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

                {/* Badge */}
                {currentCard.badge && (
                  <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white mb-4">
                    {currentCard.badge}
                  </span>
                )}

                {/* Main Graphic Icon */}
                <motion.div
                  animate={{ scale: [0.95, 1.08, 0.95] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="my-3 flex items-center justify-center"
                >
                  {currentCard.icon}
                </motion.div>

                {/* Big Amount */}
                <h2 className="text-3xl font-black text-white tracking-tight mt-2">
                  {currentCard.amount}
                </h2>

                {/* Title */}
                <p className="text-sm font-bold text-slate-300 mt-1">
                  {currentCard.title}
                </p>
              </div>

              {/* Minimal Bottom Prompt */}
              <div className="mt-5 flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400">
                {remainingCount > 0 ? (
                  <span>
                    Tap for next ({remainingCount} left)
                  </span>
                ) : (
                  <span className="text-amber-300 animate-pulse font-black">
                    Tap to see summary
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ===================================================================
            STAGE 4: FINAL REWARD SUMMARY SLIDE
            =================================================================== */}
        {step === "summary" && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-[#111114] border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative"
          >
            <span className="text-[11px] font-mono font-black uppercase tracking-widest text-amber-400 mb-2">
              ALL REWARDS UNLOCKED
            </span>

            <h3 className="text-lg font-black text-white mb-4">
              {chestName}
            </h3>

            {/* Horizontal Cards Row */}
            <div className="w-full flex items-center justify-center gap-2.5 mb-6">
              {cards.map((c) => (
                <div
                  key={c.id}
                  className={`flex-1 rounded-2xl bg-gradient-to-b ${c.bgGrad} border ${c.borderCol} p-3 flex flex-col items-center shadow-lg`}
                >
                  <div className="scale-75 mb-1">{c.icon}</div>
                  <span className="text-sm font-black text-white leading-tight">
                    {c.amount}
                  </span>
                  <span className="text-[10px] text-slate-300 font-bold truncate max-w-full">
                    {c.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Big Collect Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCollect();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl cursor-pointer transition-all active:scale-95"
            >
              COLLECT
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
