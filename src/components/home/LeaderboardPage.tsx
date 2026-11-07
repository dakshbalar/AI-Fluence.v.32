import React, { useState, useEffect, useMemo } from "react";
import { Lock } from "lucide-react";
import { LeagueEmblem } from "./LeagueEmblems";
import {
  COURSE_LEADERBOARDS,
  CourseLeaderboard,
} from "../../data/courseGamificationData";
import { ClanManagementView, getClanTheme } from "./ClanManagementView";
import { ClanShieldColor } from "./ClanShield";
import { CornerStarsAndSmokeBackground } from "../onboarding-animations/shared/CornerStarsAndSmokeBackground";
import { useGamification } from "../../utils/gamificationStore";
import { useAuth } from "../../context/AuthContext";
import { subscribeToFriends, FriendProfile } from "../../services/friendService";

interface LeaderboardPageProps {
  onContinue?: () => void;
  themeColor?: string;
  courseId?: string;
  onSelectCourse?: (courseId: string) => void;
  onSubTabChange?: (tab: "leaderboard" | "clan") => void;
  onClanBannerColorChange?: (color: ClanShieldColor) => void;
  activeSubTab?: "leaderboard" | "clan";
}

interface LeagueSpec {
  id: string;
  name: string;
  c1: string;
  c2: string;
  min: number;
  bonus: string;
  baseScore: number;
}

// Exactly matches LG from user's template
export const LG_SPECS: LeagueSpec[] = [
  { id: "bronze", name: "Bronze", c1: "#E0A064", c2: "#7a4520", min: 0, bonus: "+0%", baseScore: 370 },
  { id: "silver", name: "Silver", c1: "#EEF3F6", c2: "#5F6870", min: 500, bonus: "+5%", baseScore: 880 },
  { id: "gold", name: "Gold", c1: "#FFE27A", c2: "#9A6A00", min: 1000, bonus: "+10%", baseScore: 1620 },
  { id: "crystal", name: "Crystal", c1: "#C9A2FF", c2: "#4A1C9A", min: 2000, bonus: "+15%", baseScore: 2900 },
  { id: "masters", name: "Masters", c1: "#6B7280", c2: "#000000", min: 3500, bonus: "+20%", baseScore: 4700 },
  { id: "champion", name: "Champion", c1: "#FF7A7A", c2: "#7A0F10", min: 5500, bonus: "+30%", baseScore: 7000 },
  { id: "emerald", name: "Emerald", c1: "#5CF2A8", c2: "#076B45", min: 8000, bonus: "+50%", baseScore: 9800 },
];

const BOT_NAMES = [
  "CipherByte", "ApexCoder", "KaggleHero", "SyntaxSlayer", "DeepThinker",
  "TensorFlow_99", "RustEnthusiast", "PromptWhisperer", "AlgoWizard", "ZeroDayNinja",
  "QuantumLeap", "NullPointer", "ByteBaron", "StackSage", "RecursionKing",
  "HeapHero", "GraphGuru", "BitBender", "LambdaLord", "CacheCat"
];

const SCORE_FRACTIONS = [1, 0.9, 0.83, 0.77, 0.7, 0.67, 0.53, 0.47, 0.43, 0.34];
const BOT_UP_MAP: Record<number, number> = { 4: 7, 5: 8, 8: 8 };

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  onContinue,
  courseId = "dsa",
  onSubTabChange,
  onClanBannerColorChange,
  activeSubTab = "leaderboard",
}) => {
  const effectiveCourseId = (courseId || "dsa").toLowerCase();

  // Top Page Tab: "leaderboard" (Leagues & Ranks) vs "clan"
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

  // Division Scope: "division" vs "friends"
  const [divisionScope, setDivisionScope] = useState<"division" | "friends">("division");

  const { state: gamificationState } = useGamification();
  const userTrophies = gamificationState?.trophies ?? 0;
  const { user } = useAuth();
  const [friendsList, setFriendsList] = useState<FriendProfile[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubFriends = subscribeToFriends(user.uid, (friends) => {
      setFriendsList(friends);
    });
    return () => unsubFriends();
  }, [user?.uid]);

  // Determine user's actual league index based on their trophies
  const userLeagueIdx = useMemo(() => {
    for (let i = LG_SPECS.length - 1; i >= 0; i--) {
      if (userTrophies >= LG_SPECS[i].min) {
        return i;
      }
    }
    return 0;
  }, [userTrophies]);

  const userLeague = LG_SPECS[userLeagueIdx];

  // Selected league for viewing (defaults to user's current league based on trophies)
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(() => LG_SPECS[userLeagueIdx].id);

  // Sync if user advances league
  useEffect(() => {
    setSelectedLeagueId(LG_SPECS[userLeagueIdx].id);
  }, [userLeagueIdx]);

  const sel = useMemo(() => {
    const idx = LG_SPECS.findIndex((l) => l.id === selectedLeagueId);
    return idx >= 0 ? idx : userLeagueIdx;
  }, [selectedLeagueId, userLeagueIdx]);

  const selectedLeague = LG_SPECS[sel];
  const isCur = sel === userLeagueIdx;
  const isLocked = sel > userLeagueIdx;
  const nextLeagueSpec = sel < LG_SPECS.length - 1 ? LG_SPECS[sel + 1] : null;

  // Progress bar and trophies to go calculation
  const tierProgressPct = useMemo(() => {
    if (!isCur) {
      return isLocked ? 0 : 100;
    }
    if (!nextLeagueSpec) return 100;
    const min = selectedLeague.min;
    const max = nextLeagueSpec.min;
    const gained = Math.max(0, userTrophies - min);
    const range = Math.max(1, max - min);
    return Math.min(100, Math.max(4, Math.round((gained / range) * 100)));
  }, [isCur, isLocked, nextLeagueSpec, selectedLeague.min, userTrophies]);

  const trophiesToGo = useMemo(() => {
    if (isCur) {
      return nextLeagueSpec ? Math.max(0, nextLeagueSpec.min - userTrophies) : 0;
    }
    if (isLocked) {
      return Math.max(0, selectedLeague.min - userTrophies);
    }
    return 0;
  }, [isCur, isLocked, nextLeagueSpec, selectedLeague.min, userTrophies]);

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

  // Compute live sorted leaderboard ranking combining user + bots or user + friends
  const activeLeaderboardUsers = useMemo(() => {
    if (divisionScope === "friends") {
      const userEntry = {
        id: "current_user",
        name: "You",
        xp: userTrophies,
        isCurrentUser: true,
        lastIncrease: undefined as number | undefined,
      };
      const friendEntries = friendsList.map((f, i) => ({
        id: `friend-${f.uid || i}`,
        name: f.name || "Friend",
        xp: f.trophies || f.xp || 800,
        isCurrentUser: false,
        lastIncrease: undefined as number | undefined,
      }));
      const combined = [userEntry, ...friendEntries];
      combined.sort((a, b) => b.xp - a.xp);
      return combined.map((u, idx) => ({
        ...u,
        rank: idx + 1,
      }));
    }

    // Division mode:
    // Generate bots specific to selected league's baseScore
    const bots = SCORE_FRACTIONS.map((f, k) => ({
      id: `bot-${sel}-${k}`,
      name: BOT_NAMES[(k + sel * 3) % BOT_NAMES.length],
      xp: Math.round(selectedLeague.baseScore * f),
      isCurrentUser: false,
      lastIncrease: BOT_UP_MAP[k],
    }));

    if (isCur) {
      // User is in this division
      const userEntry = {
        id: "current_user",
        name: "You",
        xp: userTrophies,
        isCurrentUser: true,
        lastIncrease: undefined as number | undefined,
      };

      const combined = [...bots, userEntry];
      combined.sort((a, b) => {
        if (b.xp !== a.xp) return b.xp - a.xp;
        if (a.isCurrentUser) return 1;
        return 0;
      });

      return combined.map((u, idx) => ({
        ...u,
        rank: idx + 1,
      }));
    }

    // Locked or preview league: show division competitors
    return bots.map((b, idx) => ({
      ...b,
      rank: idx + 1,
    }));
  }, [divisionScope, sel, selectedLeague.baseScore, isCur, userTrophies, friendsList]);

  const topFirst = activeLeaderboardUsers[0] || { name: "Champion", xp: 0 };
  const topSecond = activeLeaderboardUsers[1] || { name: "Contender", xp: 0 };
  const topThird = activeLeaderboardUsers[2] || { name: "Contender", xp: 0 };

  return (
    <div
      className="leaderboard-root w-full flex flex-col min-h-screen pb-28 select-none text-left relative overflow-hidden transition-colors duration-500"
      data-league={activeMainTab === "leaderboard" ? selectedLeagueId : undefined}
      data-clan-color={activeMainTab === "clan" ? (activeClanColor || "blue") : undefined}
      style={{
        background: activeMainTab === "clan" ? clanTheme.bgGradient : undefined,
      }}
    >
      {/* Background glow for clan view (Default Blue, or dynamically adapts to joined clan's shield color) */}
      {activeMainTab === "clan" && (
        <CornerStarsAndSmokeBackground
          customColor={clanTheme.customHex || "#0284c7"}
          topStarsClassName="top-3"
          bottomStarsClassName="bottom-28"
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0b0b0e] text-white border border-white/20 font-black px-4 py-2.5 rounded-2xl shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Content wrapper */}
      <div className="wrap relative z-10 w-full pt-2">
        <h1 className="hg fade in text-3xl sm:text-5xl font-black text-center my-3">
          {activeMainTab === "leaderboard" ? "Leaderboard" : "Clan"}
        </h1>

        {/* =====================================================================
            TOP TABS: LEADERBOARD vs CLAN
            ===================================================================== */}
        <div className="tabs-lb fade in mb-4" style={{ "--d": ".1s" } as any}>
          <button
            onClick={() => handleTabChange("leaderboard")}
            className={`tab-lb ${activeMainTab === "leaderboard" ? "on" : ""}`}
            id="top-nav-leaderboard"
          >
            Leaderboard
          </button>
          <button
            onClick={() => handleTabChange("clan")}
            className={`tab-lb ${activeMainTab === "clan" ? "on" : ""}`}
            id="top-nav-clan"
          >
            Clan
          </button>
        </div>

        {/* =====================================================================
            MAIN TAB 1: LEADERBOARD & CLASH OF CLANS LEAGUES SYSTEM
            ===================================================================== */}
        {activeMainTab === "leaderboard" && (
          <div id="lb">
            {/* LEAGUE SELECTOR CHIPS BAR (.lg) */}
            <div className="lg fade in" id="lg" style={{ "--d": ".15s" } as any}>
              {LG_SPECS.map((l, i) => {
                const isSelected = l.id === selectedLeagueId;
                const isUserLeague = i === userLeagueIdx;
                const isLeagueLocked = i > userLeagueIdx;
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLeagueId(l.id)}
                    className={`chip ${isSelected ? "on" : ""} ${isLeagueLocked ? "locked" : ""}`}
                    title={isLeagueLocked ? `${l.name} League is locked. Reach ${l.min.toLocaleString()} trophies to unlock.` : l.name}
                  >
                    <span className="relative flex items-center justify-center flex-none w-7 h-7">
                      <LeagueEmblem leagueId={l.id} size={24} />
                      {isLeagueLocked && (
                        <span className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white/90 drop-shadow" />
                        </span>
                      )}
                    </span>
                    <span>{l.name}</span>
                    {isUserLeague && <small>You</small>}
                    {isLeagueLocked && (
                      <small className="lock-tag">
                        <Lock className="w-2.5 h-2.5" />
                        Locked
                      </small>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 1. LEAGUE CARD (.league-card) */}
            <div className="league-card fade in mt-4" style={{ "--d": ".2s" } as any}>
              <div className="lrow">
                <div className={`badge-crest ${isLocked ? "locked" : ""}`}>
                  <LeagueEmblem leagueId={selectedLeague.id} size={54} />
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 rounded-[22%] flex flex-col items-center justify-center -rotate-12 backdrop-blur-[1px]">
                      <Lock className="w-6 h-6 text-white drop-shadow" />
                    </div>
                  )}
                </div>
                <div>
                  {isLocked ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-bold tracking-wider uppercase mb-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked · Requires {selectedLeague.min.toLocaleString()} Trophies</span>
                    </div>
                  ) : (
                    <small className="k">
                      {isCur ? "Clash League · 3d left" : "Completed League"}
                    </small>
                  )}
                  <div className="lname">
                    {selectedLeague.name} League {isCur ? "III" : "I"}
                  </div>
                  <div className="lmeta">
                    <b>{(isCur ? userTrophies : selectedLeague.min).toLocaleString()}</b> trophies · <span>{selectedLeague.bonus}</span> XP bonus
                  </div>
                </div>
              </div>
              <div className="prog">
                <div className="top">
                  <span className="flex items-center gap-1.5">
                    {isLocked && <Lock className="w-3 h-3 text-white/60 inline" />}
                    {isCur
                      ? nextLeagueSpec
                        ? `Promotion to ${nextLeagueSpec.name} League`
                        : "Peak League Achieved!"
                      : isLocked
                      ? `Unlock ${selectedLeague.name} League`
                      : "League cleared"}
                  </span>
                  <span>
                    {isCur
                      ? nextLeagueSpec
                        ? `${trophiesToGo} to go`
                        : "Legendary"
                      : isLocked
                      ? `${trophiesToGo} to go`
                      : "Done"}
                  </span>
                </div>
                <div className="bar-lb">
                  <i style={{ width: `${tierProgressPct}%` }} />
                </div>
              </div>
            </div>

            {/* IF LEAGUE IS LOCKED: ONLY OPEN ITS LOGO AND MESSAGE SAYING IT'S LOCKED */}
            {isLocked ? (
              <div className="locked-showcase fade in mt-5 text-center flex flex-col items-center justify-center p-6 sm:p-8 rounded-[36px] bg-[#111317] border-2 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
                {/* Ambient radial glow in this locked league's color */}
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[90px] pointer-events-none opacity-40"
                  style={{ background: selectedLeague.c1 }}
                />

                {/* Big Specific League Emblem Logo */}
                <div className="relative mb-5 my-2">
                  <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none"
                    style={{ background: selectedLeague.c1 }}
                  />
                  <div className="relative p-6 rounded-[34px] bg-black/50 border border-white/15 backdrop-blur-md shadow-2xl flex items-center justify-center">
                    <LeagueEmblem leagueId={selectedLeague.id} size={150} />
                  </div>
                  {/* Floating Glowing Lock Badge */}
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-amber-600 border-2 border-white flex items-center justify-center shadow-lg shadow-red-500/40">
                    <Lock className="w-6 h-6 text-white drop-shadow" />
                  </div>
                </div>

                {/* Locked Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-bold uppercase text-xs tracking-widest mb-3">
                  <Lock className="w-3.5 h-3.5" />
                  <span>League Locked</span>
                </div>

                {/* League Name Heading */}
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
                  {selectedLeague.name} League
                </h2>

                {/* Clear message that it is locked */}
                <p className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed mb-6 font-medium px-2">
                  This league is locked! You need{" "}
                  <span className="text-amber-300 font-bold">{selectedLeague.min.toLocaleString()} trophies</span> to unlock and enter the{" "}
                  <span className="text-white font-bold">{selectedLeague.name} League</span>.
                </p>

                {/* Trophy Requirement Box */}
                <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-4 mb-6 text-left">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="text-slate-400">Trophy Requirement</span>
                    <span className="text-amber-400 flex items-center gap-1 font-mono">
                      <span>🏆 {userTrophies.toLocaleString()}</span>
                      <span className="text-slate-500">/ {selectedLeague.min.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, Math.max(5, Math.round((userTrophies / selectedLeague.min) * 100)))}%`,
                        backgroundImage: `linear-gradient(90deg, ${selectedLeague.c2}, ${selectedLeague.c1})`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-medium">
                    <span>Current: {userLeague.name} League</span>
                    <span className="text-amber-300 font-semibold">{trophiesToGo.toLocaleString()} trophies to unlock</span>
                  </div>
                </div>

                {/* League Rewards */}
                <div className="inline-flex items-center gap-2 text-xs text-slate-300 mb-6 bg-white/[0.04] px-4 py-2 rounded-xl border border-white/10">
                  <span>✨ League Perk:</span>
                  <b className="text-amber-300 font-bold">{selectedLeague.bonus} XP Bonus</b>
                  <span>&amp; Division Glory</span>
                </div>

                {/* Action Buttons */}
                <div className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onContinue}
                    className="flex-1 py-3.5 px-6 rounded-full font-bold uppercase text-xs tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Play to Earn Trophies</span>
                  </button>
                  <button
                    onClick={() => setSelectedLeagueId(userLeague.id)}
                    className="py-3.5 px-6 rounded-full font-bold uppercase text-xs tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Back to {userLeague.name}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* UNLOCKED / CURRENT LEAGUE VIEW: Shows normal Podium, pills, rows */
              <>
                {/* ACTION BUTTON (.lb-btn) */}
                <button
                  onClick={onContinue}
                  className="lb-btn fade in flex items-center justify-center gap-2 mt-4"
                  style={{ "--d": ".3s" } as any}
                >
                  Play to Increase Trophies
                </button>

                {/* SEGMENT / PILLS (.seg) */}
                <div className="seg fade in" style={{ "--d": ".35s" } as any}>
                  <div className="pills">
                    <button
                      onClick={() => setDivisionScope("division")}
                      className={`pill ${divisionScope === "division" ? "on" : ""}`}
                    >
                      My Division
                    </button>
                    <button
                      onClick={() => setDivisionScope("friends")}
                      className={`pill ${divisionScope === "friends" ? "on" : ""}`}
                    >
                      My Friends
                    </button>
                  </div>
                  <span className="note">{divisionScope === "division" ? "Top 10 promote" : "Among you and your friends"}</span>
                </div>

                {/* PODIUM (.podium) */}
                <div className="podium" id="podium">
                  {/* 2nd Place */}
                  <div className="pc p2 fade in" style={{ "--d": ".05s" } as any}>
                    <div className="medal">2</div>
                    <span className="tag-badge">2nd place</span>
                    <div className="pname">{topSecond.name}</div>
                    <span className="pscore">{topSecond.xp.toLocaleString()}</span>
                  </div>

                  {/* 1st Place */}
                  <div className="pc p1 fade in" style={{ "--d": ".15s" } as any}>
                    <div className="medal">1</div>
                    <span className="tag-badge">Champion</span>
                    <div className="pname">{topFirst.name}</div>
                    <span className="pscore">{topFirst.xp.toLocaleString()}</span>
                  </div>

                  {/* 3rd Place */}
                  <div className="pc p3 fade in" style={{ "--d": ".25s" } as any}>
                    <div className="medal">3</div>
                    <span className="tag-badge">3rd place</span>
                    <div className="pname">{topThird.name}</div>
                    <span className="pscore">{topThird.xp.toLocaleString()}</span>
                  </div>
                </div>

                {/* ZONE / ROWS (.zone) */}
                <div className="zone fade in" style={{ "--d": ".2s" } as any}>
                  <div className="zh" id="zh">
                    {divisionScope === "friends"
                      ? "Friends leaderboard · your circle"
                      : "Promotion zone · top 10 advance"}
                  </div>

                  <div id="rows">
                    {activeLeaderboardUsers.map((user, index) => {
                      const isCurrentUser = user.isCurrentUser;
                      const rClass = index === 0 ? " r1" : index === 1 ? " r2" : index === 2 ? " r3" : "";
                      return (
                        <div
                          key={`user-row-${user.rank}-${user.name}-${sel}`}
                          className={`row ${isCurrentUser ? "me" : ""}`}
                          style={{ "--d": `${index * 0.04}s` } as any}
                        >
                          <div className={`rank${rClass}`}>
                            {index < 3 ? index + 1 : `#${user.rank}`}
                          </div>
                          <div className="nm">
                            <span className="t">{user.name}</span>
                            {isCurrentUser && <span className="you">YOU</span>}
                            {user.lastIncrease && <span className="up">↗ +{user.lastIncrease}</span>}
                          </div>
                          <div className="sc">
                            <em />
                            {user.xp.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* =====================================================================
            MAIN TAB 2: CLAN MANAGEMENT (Preserved exactly as before)
            ===================================================================== */}
        {activeMainTab === "clan" && (
          <div className="w-full mt-2">
            <ClanManagementView
              onShowToast={showToast}
              currentUserXp={userTrophies}
              onClanBannerColorChange={handleClanBannerColorChange}
              themeColor={activeClanColor}
            />
          </div>
        )}
      </div>

      {/* Dock Button */}
      {activeMainTab === "leaderboard" && (
        <div className="dock">
          <button
            onClick={onContinue}
            className="lb-btn"
            style={{ margin: "0 auto", maxWidth: "528px" }}
          >
            Practice {currentLeaderboard.courseName}
          </button>
        </div>
      )}
    </div>
  );
};
