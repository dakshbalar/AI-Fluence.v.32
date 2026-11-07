import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Flame, 
  Star, 
  Gift, 
  X, 
  Check, 
  Zap, 
  Award, 
  Shield, 
  Trophy, 
  RotateCw, 
  Heart, 
  Bot, 
  Radio, 
  Play 
} from "lucide-react";
import { useGamification } from "../../utils/gamificationStore";
import { AIfluenceAvatar, normalizeRobotConfig } from "../avatar/AIfluenceAvatar";
import { DEFAULT_AVATAR_CONFIG } from "../../data/avatarData";
import { useEngagementStore } from "../../utils/engagementStore";

interface InteractiveEngagementProps {
  onShowToast: (msg: string) => void;
  userName: string;
}

export const InteractiveEngagementSuite: React.FC<InteractiveEngagementProps> = ({
  onShowToast,
  userName
}) => {
  const { state: gamification, addXp, addDiamonds } = useGamification();
  const { profile, updateProfile } = useEngagementStore();

  // 1. Welcome Back Modal State
  const [showWelcomeBack, setShowWelcomeBack] = useState<boolean>(() => {
    try {
      const lastSeen = localStorage.getItem("aifluence_last_seen_date");
      const today = new Date().toDateString();
      if (lastSeen !== today) {
        localStorage.setItem("aifluence_last_seen_date", today);
        return true;
      }
    } catch {}
    return false;
  });

  // 2. Daily Spin Wheel Modal State
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // 3. Companion Idle Chatter speech bubble
  const [companionBubble, setCompanionBubble] = useState<string>("Ready to crush your learning goals today?");
  const chatterList = [
    "⚡ Your neural sync is at 100%! Let's solve a level.",
    "🔥 That streak is looking legendary! Keep it burning.",
    "💡 Remember: Every algorithm mastered is a superpower unlocked.",
    "🛡️ Shield systems active. No bugs can pass us today!",
    "🚀 Ready for hyperspace learning? Tap any level to launch!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = chatterList[Math.floor(Math.random() * chatterList.length)];
      setCompanionBubble(randomMsg);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // 5. Surprise Treasure Chest Drop State
  const [showSurpriseChest, setShowSurpriseChest] = useState<boolean>(false);
  useEffect(() => {
    const chestTimer = setTimeout(() => {
      setShowSurpriseChest(true);
    }, 45000); // Appears after 45 seconds of session
    return () => clearTimeout(chestTimer);
  }, []);

  // 9. Overclock Energy Minigame State
  const [isMinigameOpen, setIsMinigameOpen] = useState<boolean>(false);
  const [minigameScore, setMinigameScore] = useState<number>(0);
  const [minigameActive, setMinigameActive] = useState<boolean>(false);

  // 10. Status Picker State
  const [isStatusPickerOpen, setIsStatusPickerOpen] = useState<boolean>(false);
  const statuses = [
    "⚡ Grinding DSA",
    "👑 Clan Leader",
    "🚀 Ship Mode",
    "🔥 Streak Master",
    "🧠 AI Architect",
    "✨ Prompt Virtuoso"
  ];

  const handleClaimWelcome = () => {
    addXp(120);
    addDiamonds(25);
    onShowToast("🎁 Claimed Welcome Back Bonus: +120 XP & +25 Gems!");
    setShowWelcomeBack(false);
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    setTimeout(() => {
      const prizes = ["+50 XP", "+15 Gems", "Streak Shield", "+100 XP", "+30 Gems"];
      const won = prizes[Math.floor(Math.random() * prizes.length)];
      setSpinResult(won);
      setIsSpinning(false);
      if (won.includes("XP")) addXp(parseInt(won));
      if (won.includes("Gems")) addDiamonds(parseInt(won));
      onShowToast(`🎉 Spin Wheel Reward: Won ${won}!`);
    }, 2000);
  };

  const handleOpenChest = () => {
    addXp(75);
    addDiamonds(20);
    setShowSurpriseChest(false);
    onShowToast("💎 Surprise Treasure Chest Opened: +75 XP & +20 Gems!");
  };

  return (
    <>
      {/* 1. WELCOME BACK MODAL */}
      <AnimatePresence>
        {showWelcomeBack && (
          <div className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm rounded-[32px] bg-gradient-to-b from-blue-950 via-slate-900 to-black border-2 border-cyan-400/50 p-6 shadow-[0_0_60px_rgba(6,182,212,0.35)] relative text-center text-white"
            >
              <button
                onClick={() => setShowWelcomeBack(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-white/60 hover:text-white bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Sparkles className="w-10 h-10 text-cyan-300 animate-pulse" />
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tight mb-1 hero-heading">
                Welcome Back, {userName}!
              </h2>
              <p className="text-xs text-slate-300 mb-6">
                Your AI companion guarded your streak and prepared your daily rewards while you were away.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Offline XP</span>
                  <span className="text-lg font-black font-mono text-cyan-300">+120 XP</span>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-2xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Bonus Gems</span>
                  <span className="text-lg font-black font-mono text-amber-300">+25 💎</span>
                </div>
              </div>

              <button
                onClick={handleClaimWelcome}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95 transition-all"
              >
                Claim Daily Rewards
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. DAILY SPIN WHEEL MODAL */}
      <AnimatePresence>
        {isSpinWheelOpen && (
          <div className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-[32px] bg-[#111827] border-2 border-amber-500/40 p-6 shadow-2xl relative text-center text-white"
            >
              <button
                onClick={() => setIsSpinWheelOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-white/60 hover:text-white bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner">
                🎡
              </div>

              <h3 className="text-xl font-black uppercase tracking-tight mb-1">Daily Luck Wheel</h3>
              <p className="text-xs text-slate-300 mb-6">Spin every 24 hours to test your fortune for bonus rewards!</p>

              <div className="my-6 p-6 rounded-3xl bg-black/50 border border-amber-500/30 flex flex-col items-center justify-center relative overflow-hidden">
                <div className={`w-24 h-24 rounded-full border-4 border-amber-400 flex items-center justify-center text-2xl font-bold bg-amber-500/10 ${isSpinning ? "animate-spin" : ""}`}>
                  {spinResult || "🎰"}
                </div>
                {spinResult && (
                  <p className="text-xs font-bold text-amber-300 mt-3">Won: {spinResult}!</p>
                )}
              </div>

              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:brightness-110 disabled:opacity-50 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
                <span>{isSpinning ? "Spinning Wheel..." : "Spin Now"}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. SURPRISE TREASURE CHEST DROP (Floating Notification) */}
      <AnimatePresence>
        {showSurpriseChest && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.5)] border-2 border-white flex items-center gap-3 cursor-pointer animate-bounce"
            onClick={handleOpenChest}
          >
            <span className="text-2xl">🎁</span>
            <div>
              <p className="text-xs font-black uppercase tracking-tight">Surprise Chest!</p>
              <p className="text-[10px] font-bold">Tap to open +75 XP & +20 Gems</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSurpriseChest(false); }}
              className="ml-2 p-1 rounded-full hover:bg-black/10 text-slate-950"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. CLAN LIVE ANNOUNCEMENT TICKER (Bottom Floating Bar or Header Ticker) */}
      <div className="w-full bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-y border-blue-500/20 py-1.5 px-4 overflow-hidden text-xs font-mono text-sky-300 flex items-center gap-3 shadow-inner">
        <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase shrink-0">Live Clan Feed</span>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <p className="inline-block animate-[marquee_20s_linear_infinite] text-slate-300">
            🔥 CyberKnights clan climbed to #2 in global league! • Scholar Alex completed DSA Section 3 with 3 Stars! • New Weekly Clan Tournament is now live!
          </p>
        </div>
      </div>

      {/* FLOATING ENGAGEMENT QUICK LAUNCH BUTTONS BAR (Spin Wheel & Status Picker) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsSpinWheelOpen(true)}
          className="px-3.5 py-2 rounded-full bg-[#121418] border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          title="Daily Luck Wheel"
        >
          <span>🎡</span>
          <span className="hidden sm:inline">Daily Spin</span>
        </button>

        <button
          onClick={() => setIsStatusPickerOpen(true)}
          className="px-3.5 py-2 rounded-full bg-[#121418] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          title="Set Scholar Status"
        >
          <span>⚡</span>
          <span className="hidden sm:inline">Status</span>
        </button>
      </div>

      {/* 10. SCHOLAR STATUS PICKER MODAL */}
      <AnimatePresence>
        {isStatusPickerOpen && (
          <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#111827] border border-white/20 p-5 shadow-2xl relative text-left text-white"
            >
              <button
                onClick={() => setIsStatusPickerOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-black mb-1">Set Scholar Status</h3>
              <p className="text-xs text-slate-300 mb-4">Choose your vibe for friends and clanmates to see.</p>

              <div className="space-y-2 mb-4">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onShowToast(`Status updated to "${s}"!`);
                      setIsStatusPickerOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>{s}</span>
                    <Check className="w-4 h-4 text-cyan-400 opacity-60" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
