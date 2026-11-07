import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Trophy, Zap, Gem, ArrowRight, Sparkles } from "lucide-react";
import { calculateStarRating } from "../services/progressionService";

interface LevelCompletedModalProps {
  isOpen: boolean;
  levelTitle?: string;
  mistakesCount: number;
  xpEarned: number;
  diamondsEarned: number;
  onContinue: () => void;
}

export const LevelCompletedModal: React.FC<LevelCompletedModalProps> = ({
  isOpen,
  levelTitle = "Level Complete!",
  mistakesCount,
  xpEarned,
  diamondsEarned,
  onContinue,
}) => {
  const [displayedXp, setDisplayedXp] = useState(0);
  const starsCount = calculateStarRating(mistakesCount);

  useEffect(() => {
    if (isOpen) {
      let current = 0;
      const step = Math.max(1, Math.floor(xpEarned / 20));
      const interval = setInterval(() => {
        current += step;
        if (current >= xpEarned) {
          setDisplayedXp(xpEarned);
          clearInterval(interval);
        } else {
          setDisplayedXp(current);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [isOpen, xpEarned]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[350] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-gradient-to-b from-[#0b1329] via-[#080d1e] to-black border-2 border-amber-400/50 rounded-[36px] p-6 sm:p-8 max-w-sm w-full shadow-[0_0_80px_rgba(251,191,36,0.3)] text-center relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.6)] relative"
        >
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-white animate-spin" />
          <Trophy className="w-10 h-10 text-slate-950" />
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight hero-heading">{levelTitle}</h2>
        <p className="text-xs text-slate-300 mb-6 font-medium">
          {mistakesCount === 0
            ? "🌟 Flawless performance! 0 mistakes."
            : `${mistakesCount} mistake${mistakesCount > 1 ? "s" : ""} on this run.`}
        </p>

        {/* 3 Stars display with Epic Burst Animation */}
        <div className="flex justify-center items-center gap-3 mb-6">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= starsCount;
            return (
              <motion.div
                key={starIndex}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: isEarned ? 1.15 : 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.2 + starIndex * 0.15 }}
                className={`p-3.5 rounded-2xl transition-all duration-300 ${
                  isEarned
                    ? "bg-amber-400/25 border-2 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.6)]"
                    : "bg-white/5 border border-white/10 text-slate-600"
                }`}
              >
                <Star
                  className={`w-8 h-8 ${
                    isEarned ? "fill-amber-400 stroke-amber-400 drop-shadow-[0_0_10px_#fbbf24]" : "fill-none"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Rewards pill with Counter Roll-Up */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-3.5 rounded-2xl bg-white/[0.07] border border-white/15 flex items-center justify-center gap-2 shadow-inner"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-white font-black font-mono text-sm">+{displayedXp} XP</span>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-3.5 rounded-2xl bg-white/[0.07] border border-white/15 flex items-center justify-center gap-2 shadow-inner"
          >
            <Gem className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-white font-black font-mono text-sm">+{diamondsEarned} 💎</span>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(251,191,36,0.5)] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LevelCompletedModal;
