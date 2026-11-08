import React from "react";
import {
  Flame,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Gift,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import { LeagueEmblem } from "./LeagueEmblems";

interface DesktopLearningSidebarProps {
  courseName: string;
  courseCode: string;
  currentLevel: number;
  streakDays: number;
  trophiesCount: number;
  diamonds: number;
  plays: number;
  userLivesState: {
    currentLives: number;
    isFull: boolean;
    formattedCountdown: string;
  };
  dailyTasksDone?: number;
  dailyTasksTotal?: number;
  themeColor?: string;
  onOpenQuests: () => void;
  onOpenLeaderboard: () => void;
  onOpenStore: () => void;
  onOpenChestReward?: () => void;
  onLaunchDailyPractice?: () => void;
}

export const DesktopLearningSidebar: React.FC<DesktopLearningSidebarProps> = ({
  courseName,
  courseCode,
  currentLevel,
  streakDays,
  trophiesCount,
  diamonds,
  plays,
  userLivesState,
  dailyTasksDone = 1,
  dailyTasksTotal = 3,
  themeColor = "purple",
  onOpenQuests,
  onOpenLeaderboard,
  onOpenStore,
  onOpenChestReward,
  onLaunchDailyPractice,
}) => {
  // Determine league based on trophies
  const leagueId =
    trophiesCount >= 8000
      ? "emerald"
      : trophiesCount >= 5500
      ? "champion"
      : trophiesCount >= 3500
      ? "masters"
      : trophiesCount >= 2000
      ? "crystal"
      : trophiesCount >= 1000
      ? "gold"
      : trophiesCount >= 500
      ? "silver"
      : "bronze";

  const leagueName =
    leagueId.charAt(0).toUpperCase() + leagueId.slice(1) + " League";

  const progressPercent = Math.min(
    100,
    Math.round((dailyTasksDone / Math.max(dailyTasksTotal, 1)) * 100)
  );

  return (
    <aside
      aria-label="Student Learning Companion & Quest Rail"
      className="w-full flex flex-col gap-5 select-none"
    >
      {/* 1. DAILY GOALS & QUESTS CARD */}
      <div className="rounded-3xl bg-gradient-to-b from-[#141824]/90 via-[#0d101a]/95 to-[#070911]/95 border border-white/10 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-xl">
        {/* Soft atmospheric radial glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0 text-sky-300">
              <Target className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm font-black font-sans text-white tracking-wide uppercase">
                Daily Goals
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                {dailyTasksDone} of {dailyTasksTotal} tasks done
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-black px-2 py-0.5 rounded-lg bg-sky-500/20 border border-sky-400/30 text-sky-300">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-black/60 border border-white/10 p-0.5 mb-4 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 3 Quick Daily Task Items */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-4 h-4 ${
                  dailyTasksDone >= 1 ? "text-emerald-400" : "text-slate-500"
                }`}
              />
              <span className="text-slate-300 font-medium">Complete 2 Lessons</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-amber-300">+15 💎</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-4 h-4 ${
                  dailyTasksDone >= 2 ? "text-emerald-400" : "text-slate-500"
                }`}
              />
              <span className="text-slate-300 font-medium">30 Min Active Study</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-amber-300">+25 💎</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-4 h-4 ${
                  dailyTasksDone >= 3 ? "text-emerald-400" : "text-slate-500"
                }`}
              />
              <span className="text-slate-300 font-medium">Score 90%+ Assessment</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-amber-300">+20 💎</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenQuests}
          className="w-full py-2.5 px-4 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <span>View All Quests & Rewards</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. LEADERBOARD LEAGUE STANDING CARD */}
      <div className="rounded-3xl bg-gradient-to-b from-[#21150a]/90 via-[#140e06]/95 to-[#0b0803]/95 border border-amber-500/20 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-xl">
        {/* Soft amber radial glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 mb-3.5">
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <LeagueEmblem leagueId={leagueId} size={48} />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Current Division
              </span>
            </div>
            <h2 className="text-base font-black font-sans text-white tracking-wide">
              {leagueName}
            </h2>
            <p className="text-xs font-mono text-slate-300">
              <strong className="text-amber-300">{trophiesCount.toLocaleString()}</strong> trophies
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/20 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="text-xs text-amber-100 font-medium leading-snug">
            Rank #3 in Weekly Group · <strong>Promotion Zone</strong>
          </span>
        </div>

        <button
          onClick={onOpenLeaderboard}
          className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-100 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <span>Open Leagues & Clan</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. STREAK & SCHOLAR ENERGY VAULT CARD */}
      <div className="rounded-3xl bg-gradient-to-b from-[#181024]/90 via-[#0f0a17]/95 to-[#08050e]/95 border border-purple-500/20 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
            <h2 className="text-sm font-black font-sans text-white uppercase tracking-wider">
              {streakDays} Day Streak
            </h2>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>PROTECTED</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          {/* Diamonds balance */}
          <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Diamonds
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-base">💎</span>
              <span className="text-sm font-black font-mono text-white">
                {diamonds.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Energy / Lives */}
          <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Energy Lives
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-base">❤️</span>
              <span className="text-sm font-black font-mono text-white">
                {plays}/5
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenStore}
          className="w-full py-2.5 px-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-100 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <span>Cosmic Store & Perks</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
