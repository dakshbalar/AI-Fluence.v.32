import React, { useState } from "react";
import { Flame, Sparkles, Share2, CheckCircle2, Trophy, Clock, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { publishStreakVictoryToClassFeed } from "../../services/classFeedService";
import { loadStoredStudentProfile } from "../../utils/engagementStore";

interface StreakVictoryModalProps {
  isOpen: boolean;
  streakCount: number;
  questsCompleted: number;
  totalQuests: number;
  learningMinutes: number;
  xpEarned: number;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  onNavigateToClassFeed?: () => void;
}

export const StreakVictoryModal: React.FC<StreakVictoryModalProps> = ({
  isOpen,
  streakCount,
  questsCompleted,
  totalQuests,
  learningMinutes,
  xpEarned,
  onClose,
  onShowToast,
  onNavigateToClassFeed,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const profile = loadStoredStudentProfile();
  const studentName = profile.username || "Daksh Balar";

  if (!isOpen) return null;

  const handleShareToClass = async () => {
    setIsSharing(true);
    try {
      await publishStreakVictoryToClassFeed(
        streakCount,
        questsCompleted,
        learningMinutes,
        xpEarned
      );
      setHasShared(true);
      onShowToast?.("🚀 Victory Card published to AI Pioneers Class Feed!");
      if (onNavigateToClassFeed) {
        setTimeout(() => {
          onClose();
          onNavigateToClassFeed();
        }, 800);
      }
    } catch (e) {
      console.warn("Error sharing to class feed:", e);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/95 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 25 }}
          className="w-full max-w-lg bg-[#111318] border-2 border-amber-400/60 rounded-[36px] p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-center relative overflow-hidden my-auto"
        >
          {/* Top Ambient Glow & Confetti Header */}
          <div className="absolute -top-20 inset-x-0 h-40 bg-gradient-to-b from-amber-400/20 via-orange-500/10 to-transparent pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated Flame Icon & Title */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-pulse">
              <div className="w-full h-full bg-[#111318] rounded-[22px] flex items-center justify-center text-amber-400">
                <Flame className="w-11 h-11 text-amber-400 fill-amber-400" />
              </div>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 font-mono block">
                DAILY VICTORY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-kanit tracking-wide">
                STREAK COMPLETED!
              </h2>
            </div>
          </div>

          {/* SPEC-COMPLIANT GENERATED ACHIEVEMENT CARD */}
          <div className="my-6 relative z-10 bg-[#161a22] border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 text-center shadow-xl space-y-3">
            <div className="border-b border-white/10 pb-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 font-mono block">
                AI PIONEERS · DAILY VICTORY
              </span>
            </div>

            <div className="py-2">
              <div className="inline-flex items-center justify-center gap-2 text-4xl sm:text-5xl font-black font-kanit text-amber-300 drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]">
                <span>🔥</span>
                <span>{streakCount}</span>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-white block mt-1">
                DAY STREAK COMPLETED
              </span>
              <span className="text-sm font-bold text-sky-400 block mt-0.5 font-kanit">
                {studentName}
              </span>
            </div>

            {/* Stats Row inside Card */}
            <div className="grid grid-cols-3 gap-2 bg-[#0d0f14] p-3 rounded-2xl border border-white/10 text-center">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">
                  Quests
                </span>
                <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                  {questsCompleted}/{totalQuests}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">
                  Time
                </span>
                <span className="text-xs sm:text-sm font-black text-sky-400 font-mono">
                  {learningMinutes} MIN
                </span>
              </div>

              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">
                  Reward
                </span>
                <span className="text-xs sm:text-sm font-black text-amber-300 font-mono">
                  +{xpEarned} XP
                </span>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block font-mono">
              KEEP BUILDING! 🚀
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 relative z-10">
            <button
              onClick={handleShareToClass}
              disabled={isSharing || hasShared}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wide border-b-4 flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0.5 shadow-lg ${
                hasShared
                  ? "bg-emerald-500 text-slate-950 border-emerald-700"
                  : "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 border-amber-800 text-slate-950 shadow-[0_6px_20px_rgba(245,158,11,0.4)]"
              }`}
            >
              {hasShared ? (
                <>
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  <span>SHARED TO CLASS FEED!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5 stroke-[2.5]" />
                  <span>{isSharing ? "PUBLISHING..." : "SHARE TO CLASS"}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-black text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>CONTINUE LEARNING</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
