import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Share2,
  Trophy,
  Zap,
  Shield,
  Award,
  Users,
  Check,
  UserPlus,
  Flame,
  Copy,
  BookOpen,
  Code2,
  Sparkles,
  Star,
  Clock,
} from "lucide-react";
import { AIfluenceAvatar } from "../avatar/AIfluenceAvatar";
import { AvatarConfig } from "../../types/avatar";
import { GAME_ASSETS, getTrophyImage } from "../../utils/gameAssets";

export interface PublicUserProfile {
  id: string;
  name: string;
  userCode: string;
  level: number;
  xp: number;
  trophies: number;
  league: string;
  clanName?: string;
  clanTag?: string;
  streak: number;
  lessonsCompleted: number;
  perfectQuizzes: number;
  joinedDate: string;
  avatarConfig: AvatarConfig;
  isFriend?: boolean;
  isRequestSent?: boolean;
}

interface UserProfileModalProps {
  user: PublicUserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSendFriendRequest?: (user: PublicUserProfile) => void;
  onToggleFriend?: (user: PublicUserProfile) => void;
  onShowToast?: (msg: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSendFriendRequest,
  onToggleFriend,
  onShowToast,
}) => {
  if (!isOpen || !user) return null;

  // Determine League & League Logo image
  const isBronze = user.trophies < 500;
  const isSilver = user.trophies >= 500 && user.trophies < 1000;
  const isGold = user.trophies >= 1000;

  const leagueName = isGold
    ? "Gold League"
    : isSilver
    ? "Silver League"
    : "Bronze League";

  const leagueLogoImg = isGold
    ? GAME_ASSETS.trophies.gold
    : isSilver
    ? GAME_ASSETS.trophies.silver
    : GAME_ASSETS.trophies.bronze;

  const userHandle = `@${user.name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10) || "SCHOLAR"}`;

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(user.userCode);
      onShowToast?.(`📋 Friend Code ${user.userCode} copied!`);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out ${user.name}'s Scholar Profile on AIfluence! Code: ${user.userCode} · 🏆 ${user.trophies} Trophies`
      );
      onShowToast?.(`🔗 Profile link copied to clipboard!`);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#09090b] text-white flex flex-col items-center">
        {/* Full-width container identical in scale to AvatarProfilePage */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg mx-auto flex flex-col min-h-screen pb-32 text-left select-none"
        >
          {/* =========================================================================
              1. TOP BAR (Duolingo format: Back button on left, Name, Share on right)
              ========================================================================= */}
          <div className="w-full px-5 pt-4 pb-2 flex items-center justify-between border-b border-white/10 sticky top-0 bg-[#09090b]/95 backdrop-blur-md z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-white transition-all cursor-pointer active:scale-95 flex items-center justify-center border border-white/15"
                title="Back to previous page"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight truncate max-w-[220px]">
                  {user.name}
                </h1>
                <p className="text-[11px] font-mono text-zinc-400">
                  {user.userCode}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer border border-white/10"
                title="Share profile"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* =========================================================================
              2. HERO AVATAR STAGE (Identical to AvatarProfilePage: Centered large character)
              ========================================================================= */}
          <div className="w-full relative px-4 pt-4 pb-2 flex flex-col items-center justify-center">
            {/* Ground contact shadow */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-56 h-3.5 rounded-full pointer-events-none bg-black/70 blur-sm" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center justify-center min-h-[310px]">
                <AIfluenceAvatar
                  config={user.avatarConfig}
                  mood={user.avatarConfig.customPose || "idle"}
                  size={320}
                  showBackground={false}
                  animate={true}
                  faceZoom={false}
                />
              </div>

              {/* Scholar Level Tag below Avatar */}
              <div className="mt-1 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-black uppercase tracking-wider shadow-sm">
                  LEVEL {user.level} SCHOLAR
                </span>
                {user.clanName && (
                  <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-mono font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{user.clanName}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. USER HANDLE & JOIN DATE
              ========================================================================= */}
          <div className="w-full px-5 mt-3 flex items-center justify-between">
            <p className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
              {userHandle} · JOINED {user.joinedDate || "2026"}
            </p>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-black transition-all cursor-pointer shadow-sm active:scale-95"
              title="Click to copy friend code"
            >
              <span className="text-[10px] text-cyan-400 font-sans font-bold">CODE:</span>
              <span>{user.userCode}</span>
              <Copy className="w-3 h-3 text-cyan-400" />
            </button>
          </div>

          {/* =========================================================================
              4. 3-COLUMN STATS BAR (Courses | Following | Followers)
              ========================================================================= */}
          <div className="w-full px-5 mt-4 grid grid-cols-3 gap-2">
            {/* Column 1: Courses */}
            <div className="p-3 rounded-2xl bg-[#0e0f14] border border-white/10 flex flex-col">
              <div className="flex items-center gap-1.5 h-7">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border border-blue-400/50 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                </div>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#6b21a8] to-[#3b0764] border border-purple-400/50 flex items-center justify-center">
                  <Code2 className="w-3.5 h-3.5 text-purple-300" />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 mt-1">2 Courses</span>
            </div>

            {/* Column 2: Following */}
            <div className="p-3 rounded-2xl bg-[#0e0f14] border border-white/10 flex flex-col">
              <div className="h-7 flex items-center">
                <span className="text-lg font-black text-white leading-none">
                  {Math.max(1, Math.floor(user.trophies / 90))}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400 mt-1">Following</span>
            </div>

            {/* Column 3: Followers */}
            <div className="p-3 rounded-2xl bg-[#0e0f14] border border-white/10 flex flex-col">
              <div className="h-7 flex items-center">
                <span className="text-lg font-black text-white leading-none">
                  {Math.max(1, Math.floor(user.trophies / 75))}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400 mt-1">Followers</span>
            </div>
          </div>

          {/* =========================================================================
              5. LEAGUE SHOWCASE CARD (Shows Bronze/Silver/Gold League Emblem Image)
              ========================================================================= */}
          <div className="w-full px-5 mt-4">
            <div className="p-4 rounded-3xl bg-gradient-to-b from-[#12131a] to-[#09090b] border-2 border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.85)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {/* Real League Trophy / Emblem Image */}
                <div className="w-16 h-16 rounded-2xl bg-black/60 border border-white/15 flex items-center justify-center p-2 shadow-inner shrink-0">
                  {React.createElement(leagueLogoImg, { size: 44, className: "drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" })}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30">
                      CURRENT LEAGUE
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1 tracking-tight">
                    {leagueName}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono flex items-center gap-1 mt-0.5">
                    <span className="text-amber-300 font-bold font-mono">
                      🏆 {user.trophies}
                    </span>
                    <span>Trophies Accumulated</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono font-black text-zinc-400 uppercase">
                  Division
                </span>
                <p className="text-sm font-black text-cyan-300 font-mono">
                  Tier {isGold ? "I" : isSilver ? "II" : "III"}
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              6. SCHOLAR ACADEMIC JOURNEY STATS (Duolingo Style 4-Box Grid)
              ========================================================================= */}
          <div className="w-full px-5 mt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
              Scholar Statistics
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Stat 1: Total XP */}
              <div className="p-3.5 rounded-2xl bg-[#0c0c10] border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-purple-300 fill-purple-300/30" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Total XP
                  </span>
                  <span className="text-sm font-black text-purple-300 font-mono">
                    {user.xp.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Stat 2: Daily Streak */}
              <div className="p-3.5 rounded-2xl bg-[#0c0c10] border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-amber-400 fill-amber-400/30 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Streak
                  </span>
                  <span className="text-sm font-black text-amber-300 font-mono">
                    {user.streak} Days
                  </span>
                </div>
              </div>

              {/* Stat 3: Lessons Mastered */}
              <div className="p-3.5 rounded-2xl bg-[#0c0c10] border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Lessons
                  </span>
                  <span className="text-sm font-black text-cyan-300 font-mono">
                    {user.lessonsCompleted} Mastered
                  </span>
                </div>
              </div>

              {/* Stat 4: Perfect Quizzes */}
              <div className="p-3.5 rounded-2xl bg-[#0c0c10] border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-emerald-300 fill-emerald-300/30" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Perfect Quizzes
                  </span>
                  <span className="text-sm font-black text-emerald-300 font-mono">
                    {user.perfectQuizzes} Scores
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              7. SCHOLAR ACHIEVEMENT BADGES SHOWCASE
              ========================================================================= */}
          <div className="w-full px-5 mt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
              Unlocked Achievements
            </h4>
            <div className="p-4 rounded-3xl bg-[#0b0b0e] border border-white/10 space-y-2.5">
              {[
                { title: "Crown of Perfection", desc: "Earned 15 3-Star perfect quiz scores", icon: "👑" },
                { title: "Vector Specialist", desc: "Mastered Retrieval-Augmented Generation curriculum", icon: "🔍" },
                { title: "Fine-Tuning Titan", desc: "Completed Weights & LoRA fine-tuning tracks", icon: "⚙️" },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.04] border border-white/10"
                >
                  <div className="w-9 h-9 rounded-xl bg-black/60 border border-white/15 flex items-center justify-center text-lg shrink-0">
                    {badge.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{badge.title}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{badge.desc}</p>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[9px] font-black uppercase shrink-0">
                    UNLOCKED
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              8. STICKY BOTTOM ACTION BAR (Add Friend / Friends status & Close)
              ========================================================================= */}
          <div className="fixed bottom-0 inset-x-0 p-4 bg-[#09090b]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-center z-40">
            <div className="w-full max-w-lg flex items-center gap-2.5">
              {user.isFriend ? (
                <button
                  onClick={() => onToggleFriend?.(user)}
                  className="flex-1 py-3 rounded-2xl bg-emerald-500/20 hover:bg-rose-500/20 border border-emerald-400/40 hover:border-rose-400/40 text-emerald-300 hover:text-rose-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Friends (Tap to Manage)</span>
                </button>
              ) : user.isRequestSent ? (
                <button
                  disabled
                  className="flex-1 py-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-default"
                >
                  <Check className="w-4 h-4" />
                  <span>Friend Request Sent</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onSendFriendRequest?.(user);
                    onShowToast?.(`📨 Friend request sent to ${user.name}!`);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Send Friend Request</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="py-3 px-5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
