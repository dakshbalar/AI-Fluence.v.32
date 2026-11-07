import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, CheckCircle, X, Tv, ShieldCheck } from "lucide-react";

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdCompleted: () => void;
  onAdFailed?: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onAdCompleted,
  onAdFailed,
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isWatching, setIsWatching] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsCompleted(false);
      setIsWatching(false);
      return;
    }

    setIsWatching(true);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          setIsWatching(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-gradient-to-b from-[#111827] via-[#0b0f19] to-[#05070d] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center relative overflow-hidden"
        >
          {/* Ad Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Tv className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider">AdMob Rewarded Sponsor</span>
            </div>
            {isCompleted ? (
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                Reward in {countdown}s
              </span>
            )}
          </div>

          {/* Ad Body Video Visualizer */}
          <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 flex flex-col items-center justify-center relative overflow-hidden my-3 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.25),transparent_70%)] animate-pulse" />
            
            {!isCompleted ? (
              <>
                <Play className="w-12 h-12 text-cyan-400 animate-bounce drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] mb-2" />
                <p className="text-xs font-bold text-slate-200">AI Pioneers Sponsor Video</p>
                <p className="text-[10px] text-slate-400">Watch to earn +1 Life Energy</p>
                {/* Progress bar */}
                <div className="w-4/5 h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden border border-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((5 - countdown) / 5) * 100}%` }}
                    transition={{ ease: "linear", duration: 1 }}
                  />
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="w-14 h-14 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.8)] mb-2 animate-bounce" />
                <h4 className="text-sm font-black text-white">REWARD VERIFIED!</h4>
                <p className="text-xs text-emerald-400 font-bold">+1 Life Refilled ❤️</p>
              </>
            )}
          </div>

          {/* Verification info footer */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Server-side verification active</span>
          </div>

          {/* Action button */}
          {isCompleted ? (
            <button
              onClick={() => {
                onAdCompleted();
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(52,211,153,0.5)] cursor-pointer transition-all active:scale-95"
            >
              CLAIM +1 LIFE &amp; LAUNCH
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-500 font-bold text-xs uppercase cursor-not-allowed"
            >
              WATCHING ADVERTISEMENT ({countdown}s)
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
