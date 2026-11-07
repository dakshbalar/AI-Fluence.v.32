import React, { useState, useEffect, useMemo } from "react";
import { Trophy, Clock, Shield, Award, Sparkles, ChevronRight, Info, Crown, TrendingUp } from "lucide-react";
import {
  COURSE_LEADERBOARDS,
  CourseLeaderboard,
  LeaderboardUser,
} from "../../data/courseGamificationData";
import { COC_LEAGUES, getLeagueForTrophies, getNextLeague } from "../../data/leaguesData";
import { LeagueEmblem } from "./LeagueEmblem";
import { LeaguesOverviewModal } from "./LeaguesOverviewModal";
import { ClanManagementView, getClanTheme } from "./ClanManagementView";
import { ClanShieldColor } from "./ClanShield";
import { CornerStarsAndSmokeBackground } from "../onboarding-animations/shared/CornerStarsAndSmokeBackground";
import {
  getSimulatedLeagueBots,
  tickBotSimulation,
  SimulatedBotPlayer,
} from "../../utils/botSimulationService";
import { useGamification } from "../../utils/gamificationStore";

interface LeaderboardPageProps {
  onContinue?: () => void;
  themeColor?: string;
  courseId?: string;
  onSelectCourse?: (courseId: string) => void;
  onSubTabChange?: (tab: "leaderboard" | "clan") => void;
  onClanBannerColorChange?: (color: ClanShieldColor) => void;
  activeSubTab?: "leaderboard" | "clan";
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  onContinue,
  themeColor,
  courseId = "dsa",
  onSubTabChange,
  onClanBannerColorChange,
  activeSubTab = "leaderboard",
}) => {
  const effectiveCourseId = (courseId || "dsa").toLowerCase();

  // Top Page Tab: "leaderboard" (Leagues & Ranks) vs "clan" (Clash of Clans clan management)
  const [activeMainTab, setActiveMainTab] = useState<"leaderboard" | "clan">(activeSubTab);

  // Active clan color tracking for dynamic buttons & background glow
  const [activeClanColor, setActiveClanColor] = useState<ClanShieldColor>(() => {
    try {
      const stored = localStorage.getItem("clash_of_code_user_clan");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.shieldColor) return parsed.shieldColor;
      }
    } catch (e) {}
    return "blue";
  });

  const clanTheme = getClanTheme(activeClanColor);

  const handleClanBannerColorChange = (color: ClanShieldColor) => {
    setActiveClanColor(color);
    onClanBannerColorChange?.(color);
  };

  useEffect(() => {
    if (activeSubTab && activeSubTab !== activeMainTab) {
      setActiveMainTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleTabChange = (tab: "leaderboard" | "clan") => {
    setActiveMainTab(tab);
    onSubTabChange?.(tab);
  };

  // Division Scope: "division" vs "global"
  const [divisionScope, setDivisionScope] = useState<"division" | "global">("division");

  // Leagues Overview Modal
  const [showLeaguesModal, setShowLeaguesModal] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Retrieve course-specific leaderboard dataset
  const currentLeaderboard: CourseLeaderboard =
    COURSE_LEADERBOARDS[effectiveCourseId] || COURSE_LEADERBOARDS["dsa"];

  const { state: gamificationState } = useGamification();
  const userTrophies = gamificationState?.trophies ?? 0; // Dynamic user trophies from gamification store
  const currentLeague = getLeagueForTrophies(userTrophies);
  const nextLeague = getNextLeague(currentLeague);

  // Simulated bots that gain trophies gradually
  const [simulatedBots, setSimulatedBots] = useState<SimulatedBotPlayer[]>(() =>
    getSimulatedLeagueBots()
  );

  useEffect(() => {
    // Tick immediately on mount to reflect time passed
    const updated = tickBotSimulation();
    setSimulatedBots([...updated]);

    // Live tick every 15 seconds
    const interval = setInterval(() => {
      const ticked = tickBotSimulation();
      setSimulatedBots([...ticked]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Compute live sorted leaderboard ranking combining user + bots
  const activeLeaderboardUsers = useMemo(() => {
    const combined = [
      {
        id: "current_user",
        name: "You",
        xp: userTrophies,
        isCurrentUser: true,
        clan: "ByteKnights",
        lastIncrease: undefined as number | undefined,
      },
      ...simulatedBots.map((bot) => ({
        id: bot.id,
        name: bot.name,
        xp: bot.currentTrophies,
        isCurrentUser: false,
        clan: bot.clanName || "ByteKnights",
        lastIncrease: bot.lastIncrease,
      })),
    ];

    combined.sort((a, b) => b.xp - a.xp);

    return combined.map((user, idx) => ({
      ...user,
      rank: idx + 1,
    }));
  }, [userTrophies, simulatedBots]);

  const topFirst = activeLeaderboardUsers[0] || currentLeaderboard.topPodium.first;
  const topSecond = activeLeaderboardUsers[1] || currentLeaderboard.topPodium.second;
  const topThird = activeLeaderboardUsers[2] || currentLeaderboard.topPodium.third;

  // Trophy progress inside current tier
  const minTrophies = currentLeague.minTrophies ?? currentLeague.minXp;
  const maxTrophies = currentLeague.maxTrophies ?? currentLeague.maxXp;
  const trophiesInTier = Math.max(0, userTrophies - minTrophies);
  const tierRange = Math.max(1, maxTrophies - minTrophies);
  const tierProgressPct = nextLeague
    ? Math.min(100, Math.round((trophiesInTier / tierRange) * 100))
    : 100;

  // Dynamic glow theme based on active tab and clan banner / league
  const effectiveTheme =
    activeMainTab === "clan"
      ? themeColor === "light-blue" || themeColor === "cyan" || themeColor === "blue"
        ? "light-blue"
        : themeColor || "light-blue"
      : themeColor || (currentLeague.id === "bronze" ? "bronze" : currentLeague.id);

  const isBronze = effectiveTheme === "bronze";
  const isLightBlue = effectiveTheme === "light-blue";

  return (
    <div
      className="w-full flex flex-col min-h-screen pb-28 select-none text-left relative overflow-hidden transition-colors duration-500"
      style={{
        background: activeMainTab === "clan" ? clanTheme.bgGradient : "#000000",
      }}
    >
      {/* Dynamic Page Background Glow with Corner Stars (Adapts to current league or chosen clan banner color) */}
      <CornerStarsAndSmokeBackground
        theme={activeMainTab === "clan" ? undefined : effectiveTheme}
        customColor={activeMainTab === "clan" ? clanTheme.customHex : undefined}
        topStarsClassName="top-3"
        bottomStarsClassName="bottom-28"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0b0b0e] text-white border border-white/20 font-black px-4 py-2.5 rounded-2xl shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Leagues Overview Modal */}
      <LeaguesOverviewModal
        isOpen={showLeaguesModal}
        onClose={() => setShowLeaguesModal(false)}
        currentUserTrophies={userTrophies}
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full pt-3">
        {/* =====================================================================
            TOP PRIMARY SEGMENTED BAR: [ 🏆 LEADERBOARD ] vs [ 🛡️ CLAN ] (Obsidian Black)
            ===================================================================== */}
        <div className="px-4 mb-3">
          <div className="bg-[#0b0b0e] p-1 rounded-xl border border-white/10 flex items-center gap-1 shadow-md">
            <button
              onClick={() => handleTabChange("leaderboard")}
              className={`flex-1 py-2 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                activeMainTab === "leaderboard"
                  ? isBronze
                    ? "bg-gradient-to-r from-[#cd7f32] to-[#8b4513] text-white border border-[#f59e0b]/70 shadow-[0_0_15px_rgba(205,127,50,0.5)]"
                    : "bg-white/[0.12] border border-white/25 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
              id="top-nav-leaderboard"
            >
              <Trophy className="w-4 h-4 fill-current" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => handleTabChange("clan")}
              className={`flex-1 py-2 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                activeMainTab === "clan"
                  ? clanTheme.primaryBtn
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
              id="top-nav-clan"
            >
              <Shield className="w-4 h-4 fill-current" />
              <span>Clan</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            MAIN TAB 1: LEADERBOARD & CLASH OF CLANS LEAGUES SYSTEM (Black Theme)
            ===================================================================== */}
        {activeMainTab === "leaderboard" && (
          <>
            {/* 1. CLASH OF CLANS LEAGUE EMBLEM & PROGRESS CARD (Sleek Obsidian Black) */}
            <div className="px-4 mb-4">
              <div
                className={`rounded-3xl p-4 sm:p-5 bg-[#0b0b0e] border shadow-[0_4px_20px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all ${
                  isBronze ? "border-[#cd7f32]/40 shadow-[0_0_25px_rgba(205,127,50,0.15)]" : "border-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Big 3D League Crest */}
                    <div className="relative shrink-0">
                      <LeagueEmblem
                        leagueId={currentLeague.id}
                        subTier={currentLeague.subTier}
                        size="lg"
                      />
                    </div>

                    {/* League Titles & Trophies */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-amber-400 border border-white/10 font-mono">
                          Clash League
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          3D LEFT
                        </span>
                      </div>

                      <h2 className="text-xl font-black text-white tracking-tight">
                        {currentLeague.fullName}
                      </h2>

                      <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                        <span className="font-black text-amber-300">
                          🏆 {userTrophies.toLocaleString()}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-emerald-400 font-bold">
                          +{currentLeague.bonusPercentage}% XP Bonus
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View All Leagues Button */}
                  <button
                    onClick={() => setShowLeaguesModal(true)}
                    className={`shrink-0 p-2.5 rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center ${
                      isBronze
                        ? "bg-[#201108]/90 hover:bg-[#2c170a] border border-[#cd7f32]/60 hover:border-[#cd7f32] text-amber-300 shadow-[0_0_14px_rgba(205,127,50,0.3)]"
                        : "bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.20] border border-white/20 hover:border-white/40 text-white shadow-sm"
                    }`}
                    title="View all Leagues & Roadmaps"
                    id="view-all-leagues-btn"
                  >
                    <Award className="w-5 h-5 text-amber-400" />
                  </button>
                </div>

                {/* Progress Bar to Next League */}
                <div className="mt-4 bg-[#111116] rounded-2xl p-3 border border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1.5">
                    <span className="text-slate-300">
                      {nextLeague
                        ? `Promotion to ${nextLeague.fullName}`
                        : "Peak League Achieved!"}
                    </span>
                    <span className="text-amber-400">
                      {nextLeague
                        ? `${Math.max(0, (nextLeague.minTrophies ?? nextLeague.minXp) - userTrophies)} 🏆 to go`
                        : "Legendary"}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                        isBronze
                          ? "bg-gradient-to-r from-amber-500 via-[#cd7f32] to-amber-300 shadow-[0_0_10px_rgba(205,127,50,0.6)]"
                          : "bg-amber-400"
                      }`}
                      style={{ width: `${tierProgressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DIVISION VS GLOBAL TOGGLE */}
            <div className="px-4 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0b0b0e] border border-white/10 shadow-md">
                <button
                  onClick={() => setDivisionScope("division")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                    divisionScope === "division"
                      ? isBronze
                        ? "bg-gradient-to-r from-[#cd7f32] to-[#9c4d16] text-white border border-[#f59e0b]/70 shadow-[0_0_12px_rgba(205,127,50,0.45)]"
                        : "bg-white/[0.12] border border-white/25 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  My Division ({currentLeague.name})
                </button>
                <button
                  onClick={() => setDivisionScope("global")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                    divisionScope === "global"
                      ? isBronze
                        ? "bg-gradient-to-r from-[#cd7f32] to-[#9c4d16] text-white border border-[#f59e0b]/70 shadow-[0_0_12px_rgba(205,127,50,0.45)]"
                        : "bg-white/[0.12] border border-white/25 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  Top Global
                </button>
              </div>

              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {divisionScope === "division" ? "Top 10 Promote" : "Top 100 World"}
              </span>
            </div>

            {/* 3. CHAMPIONSHIP PODIUM (Redesigned: High-End Prestigious Pedestals) */}
            <div className="px-4 mb-3">
              <div className="grid grid-cols-3 gap-2.5 pt-3 pb-2">
                {/* 2nd Place: Silver Runner-Up */}
                <div className="flex flex-col items-center justify-between p-3 rounded-2xl bg-gradient-to-b from-slate-300/10 via-[#101217] to-[#08090d] border border-slate-300/30 shadow-[0_4px_18px_rgba(0,0,0,0.7)] relative overflow-hidden mt-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 via-slate-300 to-slate-400 text-slate-950 flex items-center justify-center shadow-[0_2px_10px_rgba(203,213,225,0.35)] border border-white/70 mb-2">
                    <span className="font-black text-sm text-slate-950 font-mono">2</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/20 font-mono">
                    2ND PLACE
                  </span>
                  <span className="text-xs font-bold text-slate-100 truncate max-w-full mt-2 text-center">
                    {topSecond.name}
                  </span>
                  <div className="mt-1.5 px-2 py-0.5 rounded-lg bg-slate-900/80 border border-slate-400/20">
                    <span className="text-[11px] font-mono font-bold text-amber-300">
                      🏆 {topSecond.xp.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 1st Place: Champion Gold (Dominant Center Pedestal) */}
                <div className="flex flex-col items-center justify-between p-3.5 pt-4 rounded-2xl bg-gradient-to-b from-amber-500/15 via-[#181308] to-[#0c0904] border border-amber-400/50 shadow-[0_4px_25px_rgba(245,158,11,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden -mt-2 z-10">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.5)] border border-amber-200/90 mb-1.5">
                    <Crown className="w-6 h-6 fill-slate-950 text-slate-950" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/40 font-mono shadow-sm">
                    CHAMPION
                  </span>
                  <span className="text-xs font-black text-amber-100 truncate max-w-full mt-2 text-center tracking-tight">
                    {topFirst.name}
                  </span>
                  <div className="mt-1.5 px-2.5 py-0.5 rounded-lg bg-amber-950/70 border border-amber-500/40 shadow-sm">
                    <span className="text-xs font-mono font-black text-amber-400">
                      🏆 {topFirst.xp.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 3rd Place: Bronze Challenger */}
                <div className="flex flex-col items-center justify-between p-3 rounded-2xl bg-gradient-to-b from-amber-700/15 via-[#140e09] to-[#090604] border border-amber-700/35 shadow-[0_4px_18px_rgba(0,0,0,0.7)] relative overflow-hidden mt-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-100 flex items-center justify-center shadow-[0_2px_10px_rgba(205,127,50,0.35)] border border-amber-500/50 mb-2">
                    <span className="font-black text-sm text-amber-100 font-mono">3</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-700/40 font-mono">
                    3RD PLACE
                  </span>
                  <span className="text-xs font-bold text-slate-100 truncate max-w-full mt-2 text-center">
                    {topThird.name}
                  </span>
                  <div className="mt-1.5 px-2 py-0.5 rounded-lg bg-amber-950/50 border border-amber-700/30">
                    <span className="text-[11px] font-mono font-bold text-amber-400">
                      🏆 {topThird.xp.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. LEADERBOARD ROWS CARD (Clean Obsidian Black, No Circles, No Taglines) */}
            <div className="px-4 mb-4">
              <div className="bg-[#0b0b0e] border border-white/10 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
                {/* PROMOTION ZONE BANNER */}
                <div className="bg-emerald-950/30 py-2 px-4 flex items-center justify-center gap-2 border-b border-emerald-500/20">
                  <span className="text-[11px] font-black tracking-wider text-emerald-400 uppercase font-sans">
                    PROMOTION ZONE (TOP 10 ADVANCE)
                  </span>
                </div>

                {/* Leaderboard Rows */}
                <div className="divide-y divide-white/5">
                  {activeLeaderboardUsers.map((user) => {
                    const isCurrentUser = user.isCurrentUser;
                    const userLeague = getLeagueForTrophies(user.xp);

                    return (
                      <div
                        key={`user-rank-${user.rank}-${user.name}`}
                        className={`flex items-center justify-between px-4 py-3 transition-colors ${
                          isCurrentUser
                            ? "bg-amber-400/10 border-y border-amber-400/30"
                            : "hover:bg-white/[0.03]"
                        }`}
                      >
                        {/* Left: Custom Rank Medal & Clean Player Name */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Sculpted Rank Badges */}
                          {user.rank === 1 ? (
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-[0_2px_8px_rgba(245,158,11,0.5)] border border-amber-200/80 shrink-0">
                              1
                            </div>
                          ) : user.rank === 2 ? (
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-100 via-slate-300 to-slate-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-[0_2px_8px_rgba(203,213,225,0.4)] border border-white/70 shrink-0">
                              2
                            </div>
                          ) : user.rank === 3 ? (
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-100 font-black text-xs flex items-center justify-center shadow-[0_2px_8px_rgba(205,127,50,0.4)] border border-amber-500/50 shrink-0">
                              3
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              #{user.rank}
                            </div>
                          )}

                          {/* Clean Player Name & Clan Tag */}
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`text-sm truncate block ${
                                isCurrentUser
                                  ? "text-amber-300 font-black"
                                  : "text-zinc-100 font-bold"
                              }`}
                            >
                              {user.name}
                            </span>
                            {isCurrentUser ? (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold uppercase tracking-wider border border-amber-400/40 shrink-0">
                                YOU
                              </span>
                            ) : (
                              user.lastIncrease && (
                                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-0.5 shrink-0 animate-pulse">
                                  <TrendingUp className="w-2.5 h-2.5" />+{user.lastIncrease}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        {/* Right: League Badge & Trophy Value */}
                        <div className="flex items-center gap-2 pl-2 whitespace-nowrap">
                          <LeagueEmblem leagueId={userLeague.id} size="xs" />
                          <span
                            className={`text-sm font-black font-mono ${
                              isCurrentUser ? "text-amber-400 font-bold" : "text-amber-300"
                            }`}
                          >
                            🏆 {user.xp.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. ACTION BUTTON */}
            <div className="px-4 mt-2 mb-2">
              <button
                onClick={() => {
                  if (onContinue) onContinue();
                }}
                className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 relative overflow-hidden group/btn ${
                  isBronze
                    ? "bg-gradient-to-r from-[#cd7f32] via-[#b86b24] to-[#8b4513] hover:brightness-110 active:brightness-95 border border-[#f59e0b]/70 text-white shadow-[0_0_20px_rgba(205,127,50,0.45),inset_0_1px_0_rgba(255,255,255,0.3)]"
                    : "bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.20] backdrop-blur-md border border-white/20 hover:border-white/40 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_14px_rgba(0,0,0,0.6)]"
                }`}
                id="leaderboard-continue-btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                <span>PRACTICE {currentLeaderboard.courseName.toUpperCase()}</span>
              </button>
            </div>
          </>
        )}

        {/* =====================================================================
            MAIN TAB 2: CLAN MANAGEMENT (Dynamic Theme)
            ===================================================================== */}
        {activeMainTab === "clan" && (
          <ClanManagementView
            onShowToast={showToast}
            currentUserXp={userTrophies}
            onClanBannerColorChange={handleClanBannerColorChange}
            themeColor={activeClanColor}
          />
        )}
      </div>
    </div>
  );
};
