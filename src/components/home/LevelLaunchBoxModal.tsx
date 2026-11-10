import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Clock, Play, Tv, Sparkles, X, ShieldAlert, Zap } from "lucide-react";
import {
  fetchOrCreateUserLives,
  consumeLifeForLevel,
  grantAdRewardLife,
  UserLivesState,
  MAX_LIVES,
} from "../../services/livesService";
import { RewardedAdModal } from "./RewardedAdModal";
import { recordLevelLaunchWithLife } from "../../services/levelTrackingService";

interface LevelLaunchBoxModalProps {
  isOpen: boolean;
  levelId: string | number;
  levelTitle?: string;
  courseTitle?: string;
  xpReward?: number;
  userId?: string;
  onClose: () => void;
  onLaunchLevel: (levelId: string | number) => void;
  onShowToast?: (msg: string) => void;
}

export const LevelLaunchBoxModal: React.FC<LevelLaunchBoxModalProps> = ({
  isOpen,
  levelId,
  levelTitle = "Interactive Practice Level",
  courseTitle = "Learning Track",
  xpReward = 50,
  userId = "",
  onClose,
  onLaunchLevel,
  onShowToast,
}) => {
  const [livesState, setLivesState] = useState<UserLivesState>({
    currentLives: 5,
    maxLives: 5,
    isFull: true,
    secondsUntilNextLife: 0,
    formattedCountdown: "FULL ENERGY",
    lastLifeConsumedAt: null,
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);

  // Load lives and start 1-second interval timer for live countdown ticking
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const syncLives = async () => {
      const state = await fetchOrCreateUserLives(userId);
      if (isMounted) setLivesState(state);
    };

    syncLives();

    const interval = setInterval(async () => {
      if (isMounted) {
        const state = await fetchOrCreateUserLives(userId);
        setLivesState(state);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, userId]);

  if (!isOpen) return null;

  // Handle Option 1: USE 1 LIFE
  const handleUseLife = async () => {
    if (isProcessing) return;
    if (livesState.currentLives <= 0) {
      onShowToast?.("❤️ Out of Lives! Watch a rewarded ad or wait for regeneration.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await consumeLifeForLevel(userId, String(levelId));
      setLivesState(res.state);

      if (res.success) {
        recordLevelLaunchWithLife(String(levelId), "generative_ai", levelTitle).catch(console.warn);
        onShowToast?.(res.message);
        onLaunchLevel(levelId);
        onClose();
      } else {
        onShowToast?.(res.message);
      }
    } catch (e) {
      onShowToast?.("⚠️ Network transaction error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Option 2: WATCH AD +1 LIFE Completion
  const handleAdCompleted = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await grantAdRewardLife(userId, "admob");
      onShowToast?.(res.message);

      if (res.success) {
        // Automatically consume 1 life and launch the requested level
        const consumeRes = await consumeLifeForLevel(userId, String(levelId));
        setLivesState(consumeRes.state);

        if (consumeRes.success) {
          recordLevelLaunchWithLife(String(levelId), "generative_ai", levelTitle).catch(console.warn);
          onShowToast?.(`🚀 Level ${levelId} Launched with Refilled Life!`);
          onLaunchLevel(levelId);
          onClose();
        }
      }
    } catch (e) {
      onShowToast?.("⚠️ Failed to verify ad reward.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            className="w-full max-w-sm bg-gradient-to-b from-[#121826] via-[#0d121f] to-[#080a12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Level Icon Badge */}
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)] border border-cyan-300/40">
              <Zap className="w-8 h-8 text-slate-950 font-black" />
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              READY FOR CHALLENGE?
            </h3>
            <p className="text-xs text-cyan-400 font-bold tracking-wider mt-0.5">
              {courseTitle} • Level {levelId} (+{xpReward} XP)
            </p>

            {/* Lives Energy Status Box */}
            <div className="my-4 p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col items-center justify-center gap-1.5 shadow-inner">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
                <span className="text-lg font-black text-white tracking-wide">
                  ❤️ {livesState.currentLives}/{MAX_LIVES} Lives Available
                </span>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {livesState.isFull
                    ? "FULL ENERGY"
                    : `Next Life in ${livesState.formattedCountdown}`}
                </span>
              </div>
            </div>

            {/* Option 1: USE 1 LIFE */}
            <button
              onClick={handleUseLife}
              disabled={livesState.currentLives <= 0 || isProcessing}
              className={`w-full py-3.5 px-4 mb-3 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                livesState.currentLives > 0
                  ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95"
                  : "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed"
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {isProcessing
                  ? "AUTHORIZING..."
                  : livesState.currentLives > 0
                  ? "USE 1 LIFE"
                  : "0 LIVES (LOCKED)"}
              </span>
            </button>

            {/* Option 2: WATCH AD +1 LIFE */}
            <button
              onClick={() => setIsAdModalOpen(true)}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer active:scale-95"
            >
              <Tv className="w-4 h-4" />
              <span>WATCH AD (+1 LIFE &amp; LAUNCH)</span>
            </button>

            {/* Subtitle Footnote */}
            <p className="text-[10px] text-slate-400 mt-3 italic">
              1 Life consumed per level. Automatic regeneration every 30 minutes.
            </p>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Rewarded Ad Sponsor Modal */}
      <RewardedAdModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onAdCompleted={handleAdCompleted}
      />
    </>
  );
};
