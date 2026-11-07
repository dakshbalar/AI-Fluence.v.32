import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Share2,
  Settings as SettingsIcon,
  Edit3,
  Check,
  X,
  Lock,
  Sparkles,
  Copy,
  Search,
  Volume2,
  Bell,
  Flame,
  Calendar,
  Clock,
  Award,
  Star,
  Gem,
} from "lucide-react";
import { getStoredStreakData, getStreakMilestones } from "../../services/streakEngine";
import { activeLearningTracker } from "../../services/activeLearningTracker";
import { AIfluenceAvatar, normalizeRobotConfig } from "../avatar/AIfluenceAvatar";
import { AvatarStudioModal } from "../avatar/AvatarStudioModal";
import { UserProfileModal } from "./UserProfileModal";
import { useEngagementStore } from "../../utils/engagementStore";
import { useGamification } from "../../utils/gamificationStore";
import { AvatarConfig } from "../../types/avatar";
import { DEFAULT_AVATAR_CONFIG } from "../../data/avatarData";
import { useAuth } from "../../context/AuthContext";
import {
  getNameChangeStatus,
  markInitialNameAsSet,
  consumeNameChangeCard,
  addNameChangeCard,
  NameChangeStatus,
} from "../../utils/nameChangeService";
import {
  sendFriendRequestByCode,
  subscribeToFriendRequests,
  subscribeToFriends,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  FriendRequestItem,
  FriendProfile,
} from "../../services/friendService";
import { getLeagueForTrophies } from "../../data/leaguesData";

interface AvatarProfilePageProps {
  themeColor?: string;
  courseId?: string;
  onSelectCourse?: (courseId: string) => void;
  onOpenSettings?: () => void;
  onStartLearning?: () => void;
}

export const AvatarProfilePage: React.FC<AvatarProfilePageProps> = ({
  courseId,
  onOpenSettings,
  onStartLearning,
}) => {
  const { profile, updateProfile } = useEngagementStore();
  const { state: gamification, clearLevelPlayHistory } = useGamification();

  const currentXP = gamification?.xp ?? 0;

  // Active saved avatar configuration directly from user profile
  const savedAvatarConfig = useMemo(() => {
    return normalizeRobotConfig(profile.avatarConfig || DEFAULT_AVATAR_CONFIG);
  }, [profile.avatarConfig]);

  // State to control opening the Avatar Studio editing room
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const shouldOpen = localStorage.getItem("aifluence_auto_open_avatar_studio");
      if (shouldOpen === "true") {
        localStorage.removeItem("aifluence_auto_open_avatar_studio");
        setIsStudioOpen(true);
      }
    } catch (e) {}
  }, []);

  // Friends & Auth integration
  const [isAddFriendsOpen, setIsAddFriendsOpen] = useState<boolean>(false);
  const [friendSearchInput, setFriendSearchInput] = useState<string>("");
  const { user, profile: authProfile } = useAuth();
  const [friendRequests, setFriendRequests] = useState<FriendRequestItem[]>([]);
  const [friendsList, setFriendsList] = useState<FriendProfile[]>([]);
  const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false);

  const displayUserCode =
    authProfile?.userCode ||
    gamification.userCode ||
    localStorage.getItem("aifluence_user_code") ||
    "AIF-3115";

  useEffect(() => {
    if (!user?.uid) return;
    const unsubReq = subscribeToFriendRequests(user.uid, (reqs) => {
      setFriendRequests(reqs);
    });
    const unsubFriends = subscribeToFriends(user.uid, (friends) => {
      setFriendsList(friends);
    });
    return () => {
      unsubReq();
      unsubFriends();
    };
  }, [user?.uid]);

  // Settings Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Name Change Pass Modal State
  const [isNameChangeModalOpen, setIsNameChangeModalOpen] = useState<boolean>(false);
  const [editingUsername, setEditingUsername] = useState<string>(
    profile.username || "Techno"
  );
  const [nameStatus, setNameStatus] = useState<NameChangeStatus>(() => getNameChangeStatus());

  // Viewing Other User Profile Modal State
  const [viewingUserProfile, setViewingUserProfile] = useState<{
    name: string;
    userCode: string;
    trophies: number;
    xp: number;
    level: number;
    league: string;
    clan: string;
    coursesCount: number;
    streakDays: number;
  } | null>(null);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selected Badge modal
  const [selectedItemDetail, setSelectedItemDetail] = useState<{
    title: string;
    description: string;
    icon: string;
    progress?: string;
    unlocked: boolean;
  } | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const displayName = profile.username || "Techno";
  const userHandle = `@${displayName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 14) || "techno"}`;

  // Current League derived from trophies
  const userTrophies = gamification?.trophies ?? 0;
  const currentLeague = getLeagueForTrophies(userTrophies);

  // Save Avatar from Avatar Studio
  const handleSaveAvatarFromStudio = (newConfig: AvatarConfig) => {
    const normalized = normalizeRobotConfig(newConfig);
    updateProfile({ avatarConfig: normalized, avatarCustomized: true } as any);
    setIsStudioOpen(false);
    showToast("✨ Avatar updated and saved to your profile!");
  };

  // Share profile
  const handleShare = () => {
    const link = `https://aistudio.google.com/profile/${userHandle.toLowerCase()}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    showToast("Profile link copied");
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(displayUserCode);
    }
    showToast("Code copied");
  };

  // Open Name Change Modal
  const handleOpenNameChange = () => {
    setNameStatus(getNameChangeStatus());
    setEditingUsername(displayName);
    setIsNameChangeModalOpen(true);
  };

  // Save username
  const handleSaveUsername = () => {
    const newName = editingUsername.trim();
    if (!newName) {
      showToast("Username cannot be empty");
      return;
    }
    if (newName === displayName) {
      setIsNameChangeModalOpen(false);
      setIsSettingsOpen(false);
      return;
    }

    const currentStatus = getNameChangeStatus();
    if (currentStatus.canChangeFree) {
      markInitialNameAsSet();
      updateProfile({ username: newName });
      setIsNameChangeModalOpen(false);
      setIsSettingsOpen(false);
      setNameStatus(getNameChangeStatus());
      showToast(`Handle updated to "${newName}"`);
    } else if (currentStatus.cardsOwned > 0) {
      const consumed = consumeNameChangeCard();
      if (consumed) {
        updateProfile({ username: newName });
        setIsNameChangeModalOpen(false);
        setIsSettingsOpen(false);
        setNameStatus(getNameChangeStatus());
        showToast("📜 Used 1 Name Change Card! Name updated.");
      }
    } else {
      showToast("🔒 Buy a Name Change Card for 50 💎 in Store.");
    }
  };

  // Direct buy card
  const handleBuyNameCardDirect = () => {
    const cost = 50;
    if (gamification.diamonds < cost) {
      showToast(`💎 Need ${cost - gamification.diamonds} more diamonds!`);
      return;
    }
    addNameChangeCard(1);
    setNameStatus(getNameChangeStatus());
    showToast("📜 Purchased 1 Name Change Card for 50 💎!");
  };

  // Real friends list from backend (no mock bots)
  const allFriends = useMemo(() => {
    return friendsList.map((f) => ({
      name: f.name,
      userCode: f.userCode,
      trophies: f.trophies || 800,
      xp: f.xp || 1500,
      level: 4,
      league: "Silver League",
      clan: "ByteKnights",
      streak: 3,
    }));
  }, [friendsList]);

  const filteredFriends = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allFriends;
    return allFriends.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.userCode.toLowerCase().includes(q)
    );
  }, [allFriends, searchQuery]);

  // Profile Checklist Tasks
  const [taskAvatarCustomized, setTaskAvatarCustomized] = useState<boolean>(() => {
    return Boolean((profile as any).avatarCustomized || localStorage.getItem("aifluence_task_avatar_done"));
  });
  const [taskFriendAdded, setTaskFriendAdded] = useState<boolean>(() => {
    return Boolean(friendsList.length > 0 || localStorage.getItem("aifluence_task_friend_done"));
  });

  const checklistTasks = useMemo(() => [
    {
      id: "avatar",
      title: "Customize Avatar",
      desc: "Design your personalized AI companion",
      btnText: "Customize",
      done: taskAvatarCustomized,
      action: () => setIsStudioOpen(true),
    },
    {
      id: "name",
      title: "Set Player Name",
      desc: "Your profile handle is established",
      btnText: "Completed",
      done: true,
      action: handleOpenNameChange,
    },
    {
      id: "course",
      title: "Choose First Course",
      desc: "Locked in track: Generative A.I",
      btnText: "Completed",
      done: true,
      action: () => {},
    },
    {
      id: "friend",
      title: "Add a Friend",
      desc: "Connect with other learners",
      btnText: "Add Friend",
      done: taskFriendAdded,
      action: () => setIsAddFriendsOpen(true),
    },
  ], [taskAvatarCustomized, taskFriendAdded]);

  const completedCount = checklistTasks.filter((t) => t.done).length;
  const progressPct = Math.round((completedCount / checklistTasks.length) * 100);

  // Level History
  const displayHistory = useMemo(() => {
    return gamification.levelHistory || [];
  }, [gamification.levelHistory]);

  return (
    <main className="prof-main select-none text-left">
      {/* Toast Notification */}
      <div className={`toast ${toastMessage ? "on" : ""}`} id="ts">
        {toastMessage}
      </div>

      {/* 1. TOP HEADER: NAME + EDIT + SHARE + SETTINGS */}
      <div className="prof-top fade in">
        <div className="prof-top-name-group">
          <h1
            className="hh"
            id="nm"
            title={displayName}
            style={{
              fontSize:
                displayName.length > 16
                  ? "clamp(1.1rem, 3.8vw, 1.5rem)"
                  : displayName.length > 11
                  ? "clamp(1.25rem, 4.6vw, 1.75rem)"
                  : displayName.length > 7
                  ? "clamp(1.45rem, 5.4vw, 2.2rem)"
                  : "clamp(1.9rem, 7.8vw, 2.9rem)",
            }}
          >
            {displayName}
          </h1>
          <button
            className="prof-ic p"
            id="ed"
            onClick={handleOpenNameChange}
            aria-label="Edit name"
            title="Edit Player Name"
          >
            ✎
          </button>
        </div>

        <div className="prof-top-actions">
          <button
            className="prof-ic"
            id="sh"
            onClick={handleShare}
            aria-label="Share"
            title="Share Profile"
          >
            ⤴
          </button>
          <button
            className="prof-ic"
            onClick={() => {
              if (onOpenSettings) {
                onOpenSettings();
              } else {
                setIsSettingsOpen(true);
              }
            }}
            aria-label="Settings"
            title="Settings"
          >
            ⚙
          </button>
        </div>
      </div>

      {/* 2. HERO AVATAR STAGE (Untouched proper robot avatar with floating glow) */}
      <div className="prof-bot fade in">
        <div style={{ animation: "fl 4s ease-in-out infinite" }}>
          <AIfluenceAvatar
            config={savedAvatarConfig}
            mood={savedAvatarConfig.customPose || "idle"}
            size={280}
            showBackground={false}
            animate={true}
          />
        </div>
      </div>

      {/* EDIT AVATAR BUTTON */}
      <div className="center fade in">
        <button
          className="prof-ghost"
          onClick={() => {
            setTaskAvatarCustomized(true);
            localStorage.setItem("aifluence_task_avatar_done", "true");
            setIsStudioOpen(true);
          }}
        >
          ✎ Edit Avatar
        </button>
      </div>

      {/* 3. USER META: @HANDLE · JOINED 2026 + CODE BADGE */}
      <div className="prof-meta fade in">
        <span id="un">
          {userHandle} · Joined 2026
        </span>
        <button className="prof-code" id="cp" onClick={handleCopyCode}>
          Code: {displayUserCode} ⧉
        </button>
      </div>

      {/* 4. TWO-COLUMN TROPHY & XP STATS */}
      <div className="prof-two fade in">
        <div className="prof-card">
          <b>🏆 {userTrophies.toLocaleString()}</b>
          <span>Trophies</span>
        </div>
        <div className="prof-card">
          <b>✨ {currentXP.toLocaleString()}</b>
          <span>XP</span>
        </div>
      </div>

      {/* 5. SEARCH BAR BY CODE OR NAME */}
      <label className="prof-search fade in">
        <span>🔍</span>
        <input
          id="q"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search user by code or name"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-zinc-400 hover:text-white text-xs p-1"
          >
            ✕
          </button>
        )}
      </label>

      {/* 6. FRIENDS LIST (White Card Section) */}
      <section className="prof-white fade in">
        <h2>
          <span id="fc">Friends ({filteredFriends.length})</span>
          <a
            onClick={() => setIsAddFriendsOpen(true)}
            role="button"
            tabIndex={0}
          >
            + Manage Friends
          </a>
        </h2>
        <div id="fl">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((f, i) => (
              <div key={f.name} className="prof-fr">
                <span className="n">{i + 1}.</span>
                <span className="nm">{f.name}</span>
                <button
                  onClick={() =>
                    setViewingUserProfile({
                      name: f.name,
                      userCode: f.userCode,
                      trophies: f.trophies,
                      xp: f.xp,
                      level: f.level,
                      league: f.league,
                      clan: f.clan,
                      coursesCount: 3,
                      streakDays: f.streak,
                    })
                  }
                >
                  View Profile
                </button>
              </div>
            ))
          ) : (
            <div className="prof-fr" style={{ opacity: 0.5 }}>
              No match found
            </div>
          )}
        </div>
      </section>

      {/* 7. PROFILE CHECKLIST CARD */}
      <section className="prof-sec fade in">
        <h2 className="hh">Profile Checklist</h2>
        <div className="prof-pr">
          <span id="pt">
            Progress: {completedCount} / {checklistTasks.length} completed
          </span>
          <b id="pp">{progressPct}%</b>
        </div>
        <div className="prof-bar">
          <i id="pb" style={{ width: `${progressPct}%` }} />
        </div>
        <div id="tl">
          {checklistTasks.map((t) => (
            <div
              key={t.id}
              className={`prof-task ${t.done ? "done" : ""}`}
            >
              <span className="prof-dot">{t.done ? "✓" : ""}</span>
              <div>
                <b>{t.title}</b>
                <small>{t.desc}</small>
              </div>
              <button
                onClick={() => {
                  if (!t.done) {
                    t.action();
                  }
                }}
              >
                {t.done ? "Completed" : t.btnText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 8. STREAK ENGINE ANALYTICS & CALENDAR */}
      <section className="prof-sec fade in my-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="hh text-base font-black text-white uppercase font-kanit">
              Learning Streak Engine
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300">
            🔥 {getStoredStreakData(user?.uid || "guest_user").currentStreak} DAY STREAK
          </span>
        </div>

        {/* 4-Stat Box Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#121418] border border-amber-400/30 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
              Current Streak
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-amber-300 flex items-center justify-center gap-1">
              <span>🔥</span>
              <span>{getStoredStreakData(user?.uid || "guest_user").currentStreak} Days</span>
            </div>
          </div>

          <div className="bg-[#121418] border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
              Longest Streak
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-amber-400 flex items-center justify-center gap-1">
              <span>🏆</span>
              <span>{getStoredStreakData(user?.uid || "guest_user").longestStreak} Days</span>
            </div>
          </div>

          <div className="bg-[#121418] border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
              Total Completed
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-400 flex items-center justify-center gap-1">
              <span>✅</span>
              <span>{getStoredStreakData(user?.uid || "guest_user").totalCompletedDays} Days</span>
            </div>
          </div>

          <div className="bg-[#121418] border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
              Learning Hours
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-sky-400 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{(14.5).toFixed(1)} hrs</span>
            </div>
          </div>
        </div>

        {/* Interactive 14-Day Streak Calendar */}
        <div className="bg-[#121418] border border-white/10 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-black uppercase text-slate-300">
            <span className="flex items-center gap-1.5 font-kanit">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>14-DAY STREAK CALENDAR</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">ACTIVE ROUTINE</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {Array.from({ length: 14 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (13 - i));
              const isToday = i === 13;
              const isCompleted = i >= 2 && i < 14; // Demo active days

              return (
                <div
                  key={i}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    isToday
                      ? "bg-amber-400/20 border-amber-400 text-amber-300 font-black shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                      : isCompleted
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold"
                      : "bg-[#090b0e] border-white/10 text-slate-500"
                  }`}
                >
                  <span className="text-[9px] block uppercase font-mono">
                    {d.toLocaleDateString("en-US", { weekday: "narrow" })}
                  </span>
                  <span className="text-xs font-black font-mono block mt-0.5">
                    {d.getDate()}
                  </span>
                  <span className="text-[10px] block mt-0.5">
                    {isCompleted ? "🔥" : "⚪"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Rewards Row */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300 block font-kanit">
            🏅 STREAK MILESTONE REWARDS
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[3, 7, 15, 30, 60, 100].map((m) => {
              const current = getStoredStreakData(user?.uid || "guest_user").currentStreak;
              const reached = current >= m;

              return (
                <div
                  key={m}
                  className={`p-2.5 rounded-2xl border text-center space-y-1 transition-all ${
                    reached
                      ? "bg-amber-400/15 border-amber-400/50 text-amber-300 shadow-md"
                      : "bg-[#121418] border-white/10 text-slate-500 opacity-60"
                  }`}
                >
                  <span className="text-base block">{reached ? "🏆" : "🔒"}</span>
                  <span className="text-xs font-black uppercase font-mono block">
                    {m} Days
                  </span>
                  <span className="text-[9px] font-bold uppercase block text-slate-400">
                    {reached ? "Unlocked" : `Need ${m - current}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. OVERVIEW STATS (2x2 GRID) */}
      <div className="prof-h3 fade in">Overview</div>
      <div className="prof-ov fade in">
        <div>🔥 {getStoredStreakData(user?.uid || "guest_user").currentStreak} days</div>
        <div>⚡ {gamification.xp || 800} XP</div>
        <div>🏆 {currentLeague.name || "Bronze"}</div>
        <div>🏅 0 top finishes</div>
      </div>

      {/* 9. LEVEL HISTORY SECTION */}
      <div className="prof-h3 fade in">
        <span>Level History</span>
        <span
          style={{
            color: "var(--b2)",
            border: "2px solid #0a2a66",
            borderRadius: "99px",
            padding: "4px 14px",
            fontSize: ".8rem",
          }}
        >
          {displayHistory.length} Played
        </span>
      </div>

      {displayHistory.length === 0 ? (
        <div className="prof-empty fade in">
          <div
            style={{
              fontSize: "2rem",
              border: "2px solid #0057E7",
              borderRadius: "20px",
              padding: "12px 18px",
              background: "#06142e",
            }}
          >
            🧭
          </div>
          <h4>No Level History Yet</h4>
          <p>
            Play and complete levels with at least 2 stars on your course learning map.
            Your stars, XP, and trophies will be recorded here!
          </p>
          <button
            className="btn"
            onClick={() => {
              if (onStartLearning) {
                onStartLearning();
              }
            }}
          >
            ▶ Start Learning
          </button>
        </div>
      ) : (
        <div className="space-y-2 mt-2">
          {displayHistory.slice(0, 5).map((h) => (
            <div
              key={h.id}
              className="p-3.5 rounded-2xl bg-[#0f1216] border border-white/10 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-sm text-white">{h.levelTitle || "Level"}</p>
                <p className="text-[11px] text-slate-400">{h.courseName || "DSA"} · Section {h.sectionNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-300 font-bold text-xs">⭐ {h.stars}</span>
                <span className="text-cyan-300 font-bold text-xs">+{h.xpGained} XP</span>
              </div>
            </div>
          ))}
          {displayHistory.length > 0 && (
            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  clearLevelPlayHistory();
                  showToast("Level history cleared");
                }}
                className="text-xs text-slate-500 hover:text-rose-400 cursor-pointer"
              >
                Clear History
              </button>
            </div>
          )}
        </div>
      )}

      {/* 10. MONTHLY BADGES SECTION */}
      <div className="prof-h3 fade in">
        <span>Monthly Badges</span>
        <span>›</span>
      </div>
      <div className="prof-badges fade in">
        <div
          className="prof-badge on cursor-pointer"
          onClick={() =>
            setSelectedItemDetail({
              title: "AI Companion Master",
              description: "Earned for customizing your personal AI robot companion.",
              icon: "🤖",
              unlocked: true,
            })
          }
        >
          🤖
        </div>
        <div
          className="prof-badge cursor-pointer"
          onClick={() =>
            setSelectedItemDetail({
              title: "Silver Clash Shield",
              description: "Reach Silver League in Clash of Code to unlock.",
              icon: "🔒",
              unlocked: false,
            })
          }
        >
          🔒
        </div>
        <div
          className="prof-badge cursor-pointer"
          onClick={() =>
            setSelectedItemDetail({
              title: "Streak Guardian",
              description: "Maintain a 14-day daily learning streak to unlock.",
              icon: "🔒",
              unlocked: false,
            })
          }
        >
          🔒
        </div>
        <div
          className="prof-badge cursor-pointer"
          onClick={() =>
            setSelectedItemDetail({
              title: "Algorithmic Overlord",
              description: "Complete all levels in Section 3 with 3 stars to unlock.",
              icon: "🔒",
              unlocked: false,
            })
          }
        >
          🔒
        </div>
      </div>

      {/* =========================================================================
          MODALS INTEGRATION
          ========================================================================= */}

      {/* 1. Add / Manage Friends Modal */}
      <AnimatePresence>
        {isAddFriendsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#111827] border border-white/20 p-5 shadow-2xl relative text-left"
            >
              <button
                onClick={() => setIsAddFriendsOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-black text-white mb-2">Manage Friends</h3>
              <p className="text-xs text-slate-300 mb-4">
                Connect with fellow scholars using their friend code.
              </p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter code (e.g. AIF-8821)"
                  value={friendSearchInput}
                  onChange={(e) => setFriendSearchInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() => {
                    if (friendSearchInput.trim()) {
                      showToast(`Friend request sent to ${friendSearchInput.trim()}!`);
                      setFriendSearchInput("");
                      setTaskFriendAdded(true);
                      localStorage.setItem("aifluence_task_friend_done", "true");
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Add
                </button>
              </div>

              {/* Share invite button */}
              <button
                onClick={() => {
                  handleShare();
                  setIsAddFriendsOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Your Invite Link</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Name Change Pass Modal */}
      <AnimatePresence>
        {isNameChangeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-amber-500/40 p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative text-left flex flex-col"
            >
              <button
                onClick={() => setIsNameChangeModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-lg shadow-inner">
                  📜
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">
                    Change Player Name
                  </h3>
                  <span className="text-[10px] font-mono text-amber-300">
                    {nameStatus.canChangeFree
                      ? "✨ 1st Name Change: FREE"
                      : `Cards Owned: ${nameStatus.cardsOwned}`}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                {nameStatus.canChangeFree
                  ? "You can set your initial username for free once. Future name changes will require a Name Change Card."
                  : nameStatus.cardsOwned > 0
                  ? "Changing your name will consume 1 Name Change Card from your inventory."
                  : "🔒 Name change is locked. Purchase a Name Change Card from the Store for 50 💎 to rename."}
              </p>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-wider">
                    New Display Name
                  </label>
                  <input
                    type="text"
                    value={editingUsername}
                    onChange={(e) => setEditingUsername(e.target.value)}
                    disabled={!nameStatus.canChangeFree && nameStatus.cardsOwned <= 0}
                    placeholder="Enter new scholar name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-sm focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>
              </div>

              {nameStatus.canChangeFree || nameStatus.cardsOwned > 0 ? (
                <button
                  onClick={handleSaveUsername}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:brightness-110 cursor-pointer transition-all active:scale-95"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>
                    {nameStatus.canChangeFree ? "Save Name (Free)" : "Use Card & Rename"}
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleBuyNameCardDirect}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 cursor-pointer transition-all active:scale-95"
                >
                  <Gem className="w-4 h-4 text-cyan-200" />
                  <span>Buy Card in Store (50 💎)</span>
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Quick Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#111827] border border-white/20 p-5 shadow-2xl relative text-left"
            >
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <SettingsIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">Profile Settings</h3>
              </div>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editingUsername}
                    onChange={(e) => setEditingUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>Sound Effects</span>
                  </div>
                  <span className="text-emerald-400 font-bold">ON</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Daily Streak Reminders</span>
                  </div>
                  <span className="text-emerald-400 font-bold">ON</span>
                </div>
              </div>

              <button
                onClick={handleSaveUsername}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Badge / Achievement Detail Popup */}
      <AnimatePresence>
        {selectedItemDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs rounded-3xl bg-[#111827] border border-white/20 p-5 shadow-2xl relative text-center flex flex-col items-center"
            >
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-3xl mb-3 shadow-md">
                {selectedItemDetail.icon}
              </div>

              <h3 className="text-base font-black text-white mb-1">
                {selectedItemDetail.title}
              </h3>

              <p className="text-xs text-slate-300 mb-4">
                {selectedItemDetail.description}
              </p>

              <button
                onClick={() => setSelectedItemDetail(null)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. User Profile Modal */}
      {viewingUserProfile && (
        <UserProfileModal
          isOpen={Boolean(viewingUserProfile)}
          onClose={() => setViewingUserProfile(null)}
          user={{
            id: `user-${viewingUserProfile.userCode}`,
            name: viewingUserProfile.name,
            userCode: viewingUserProfile.userCode,
            level: viewingUserProfile.level,
            xp: viewingUserProfile.xp,
            trophies: viewingUserProfile.trophies,
            league: viewingUserProfile.league,
            clanName: viewingUserProfile.clan,
            streak: viewingUserProfile.streakDays,
            lessonsCompleted: viewingUserProfile.level * 4 + 3,
            perfectQuizzes: Math.floor(viewingUserProfile.level * 2.5),
            joinedDate: "2026",
            avatarConfig: {
              ...DEFAULT_AVATAR_CONFIG,
              primaryColor: "#06b6d4",
              screenGlowColor: "#22d3ee",
            },
            isFriend: true,
          }}
          onSendFriendRequest={(u) => {
            showToast(`📨 Friend request sent to ${u.name}!`);
          }}
          onToggleFriend={(u) => {
            showToast(`👥 ${u.name} is in your friends list.`);
          }}
          onShowToast={showToast}
        />
      )}

      {/* 6. Avatar Studio Modal */}
      {isStudioOpen && (
        <AvatarStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          initialConfig={savedAvatarConfig}
          onSaveAvatar={handleSaveAvatarFromStudio}
          userName={displayName}
        />
      )}
    </main>
  );
};
