import React from "react";
import { Star, Trophy, Zap, Gem, CheckCircle, ArrowRight } from "lucide-react";
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
  if (!isOpen) return null;

  const starsCount = calculateStarRating(mistakesCount);

  return (
    <div className="fixed inset-0 z-[350] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1329] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Trophy className="w-8 h-8 text-black" />
        </div>

        <h2 className="text-2xl font-black text-white mb-1 tracking-tight">{levelTitle}</h2>
        <p className="text-xs text-slate-300 mb-6">
          {mistakesCount === 0
            ? "Flawless performance! 0 mistakes."
            : `${mistakesCount} mistake${mistakesCount > 1 ? "s" : ""} on this run.`}
        </p>

        {/* 3 Stars display */}
        <div className="flex justify-center items-center gap-3 mb-6">
          {[1, 2, 3].map((starIndex) => (
            <div
              key={starIndex}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                starIndex <= starsCount
                  ? "bg-amber-400/20 border-2 border-amber-400 text-amber-300 scale-105 shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                  : "bg-white/5 border border-white/10 text-slate-600"
              }`}
            >
              <Star
                className={`w-7 h-7 ${
                  starIndex <= starsCount ? "fill-amber-400 stroke-amber-400" : "fill-none"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Rewards pill */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-white font-black text-sm">+{xpEarned} XP</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2">
            <Gem className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-black text-sm">+{diamondsEarned}</span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-lg hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LevelCompletedModal;
