import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Share2,
  Settings as SettingsIcon,
  UserPlus,
  Flame,
  Zap,
  Trophy,
  Medal,
  ChevronRight,
  Edit3,
  Check,
  X,
  Lock,
  Sparkles,
  Copy,
  Search,
  BookOpen,
  Volume2,
  Bell,
  Code2,
  ScanFace,
  Star,
  History as HistoryIcon,
  Clock,
  Trash2,
  PlayCircle,
  Compass,
  Dices,
} from "lucide-react";
import { CornerStarsAndSmokeBackground } from "../onboarding-animations/shared/CornerStarsAndSmokeBackground";
import { AIfluenceAvatar, normalizeRobotConfig } from "../avatar/AIfluenceAvatar";
import { AvatarStudioModal } from "../avatar/AvatarStudioModal";
import { useEngagementStore } from "../../utils/engagementStore";
import { useGamification } from "../../utils/gamificationStore";
import { AvatarConfig } from "../../types/avatar";
import { DEFAULT_AVATAR_CONFIG } from "../../data/avatarData";
import { getStoredEnrolledCourseIds, COURSES_CATALOG } from "../../data/coursesData";
import { useAuth } from "../../context/AuthContext";
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

interface AvatarProfilePageProps {
  themeColor?: string;
  courseId?: string;
  onSelectCourse?: (courseId: string) => void;
  onOpenSettings?: () => void;
}

export const AvatarProfilePage: React.FC<AvatarProfilePageProps> = ({
  themeColor = "purple",
  courseId,
  onSelectCourse,
  onOpenSettings,
}) => {
  const { profile, updateProfile } = useEngagementStore();
  const { state: gamification, clearLevelPlayHistory } = useGamification();
  const [historyLimit, setHistoryLimit] = useState<number>(5);

  // Derive consolidated level history (combining recorded history and any legacy completed levels)
  const displayHistory = useMemo(() => {
    const rawHistory = gamification.levelHistory || [];
    if (rawHistory.length > 0) {
      return rawHistory;
    }

    // Fallback synthesis for existing completed levels if explicit history array is not yet filled
    const completedKeys = Object.keys(gamification.completedLevels || {}).filter(k => gamification.completedLevels[k]);
    if (completedKeys.length === 0) return [];

    const synthesized: typeof rawHistory = [];
    completedKeys.forEach((key, idx) => {
      const numId = parseInt(key, 10);
      if (!isNaN(numId) && numId >= 700) {
        const sectionNum = numId >= 900 ? 3 : numId >= 800 ? 2 : 1;
        const levelNum = numId % 100;
        const rawStars = gamification.levelStars[key];
        const starCount = Array.isArray(rawStars) ? rawStars.filter(Boolean).length : typeof rawStars === "number" ? rawStars : 2;

        synthesized.push({
          id: `synth_${key}`,
          courseId: "generative_ai",
          courseName: "Generative AI",
          sectionNumber: sectionNum,
          sectionTitle: `Section ${sectionNum}`,
          levelNumber: levelNum,
          levelTitle: `Level ${levelNum}`,
          levelId: key,
          stars: starCount,
          xpGained: 50 + starCount * 15,
          trophiesGained: starCount >= 2 ? 25 : 10,
          diamondsGained: 5,
          timestamp: new Date().toISOString(),
          playedAt: Date.now() - idx * 1000 * 60 * 15,
        });
      }
    });

    return synthesized;
  }, [gamification.levelHistory, gamification.completedLevels, gamification.levelStars]);

  // Active saved avatar configuration directly from user profile
  const savedAvatarConfig = useMemo(() => {
    return normalizeRobotConfig(profile.avatarConfig || DEFAULT_AVATAR_CONFIG);
  }, [profile.avatarConfig]);

  // Dynamic glow color derived from character's background color (falling back to screen glow/primary)
  const characterBgColor = useMemo(() => {
    if (
      savedAvatarConfig.backgroundColor &&
      savedAvatarConfig.backgroundColor !== "#000000" &&
      savedAvatarConfig.backgroundColor !== "transparent" &&
      savedAvatarConfig.backgroundColor !== "#18181B" &&
      savedAvatarConfig.backgroundColor !== "#0F172A"
    ) {
      return savedAvatarConfig.backgroundColor;
    }
    return savedAvatarConfig.screenGlowColor || savedAvatarConfig.primaryColor || "#00E5FF";
  }, [savedAvatarConfig]);

  // Face zoom state for the avatar stage
  const [isFaceZoom, setIsFaceZoom] = useState<boolean>(false);

  // State to control opening the already-made Avatar Studio editing room
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);

  // Add Friends Modal
  const [isAddFriendsOpen, setIsAddFriendsOpen] = useState<boolean>(false);
  const [friendSearch, setFriendSearch] = useState<string>("");
  const { user, profile: authProfile } = useAuth();
  const [friendRequests, setFriendRequests] = useState<FriendRequestItem[]>([]);
  const [friendsList, setFriendsList] = useState<FriendProfile[]>([]);
  const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false);
  const [requestFeedback, setRequestFeedback] = useState<string | null>(null);

  const displayUserCode = authProfile?.userCode || gamification.userCode || localStorage.getItem("aifluence_user_code") || "AIF-7K4X9P";

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

  // Settings Modal (top right gear)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [editingUsername, setEditingUsername] = useState<string>(
    profile.username || "AXSPECT YouTube"
  );

  // Selected Badge / Achievement detail modal
  const [selectedItemDetail, setSelectedItemDetail] = useState<{
    title: string;
    description: string;
    icon: string;
    progress?: string;
    unlocked: boolean;
  } | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Enrolled courses list for the 3-column stats bar
  const enrolledCourses = useMemo(() => {
    const enrolledIds = getStoredEnrolledCourseIds();
    const list = COURSES_CATALOG.filter((c) =>
      enrolledIds.length > 0 ? enrolledIds.includes(c.id) : c.id === "dsa"
    );
    return list.length > 0 ? list : [COURSES_CATALOG[0]];
  }, []);

  const displayName = profile.username || "AXSPECT YouTube";
  const userHandle = `@${displayName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10) || "AXSPECTYOU"}`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Save Avatar from the Avatar Studio editing room
  const handleSaveAvatarFromStudio = (newConfig: AvatarConfig) => {
    const normalized = normalizeRobotConfig(newConfig);
    updateProfile({ avatarConfig: normalized });
    setIsStudioOpen(false);
    showToast("✨ Avatar updated and saved to your profile!");
  };

  // Share profile
  const handleShare = () => {
    const link = `https://aistudio.google.com/profile/${userHandle.toLowerCase()}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    showToast("🔗 Profile link copied!");
  };

  // Save username from settings modal
  const handleSaveUsername = () => {
    if (editingUsername.trim()) {
      updateProfile({ username: editingUsername.trim() });
      setIsSettingsOpen(false);
      showToast("👤 Username updated!");
    }
  };

  const bgTheme =
    themeColor === "green"
      ? "green"
      : themeColor === "red"
      ? "red"
      : themeColor === "blue"
      ? "blue"
      : "purple";

  return (
    <div className="w-full flex flex-col bg-black min-h-full pb-28 select-none text-left relative overflow-hidden">
      {/* Floating Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-black/90 backdrop-blur-xl border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold shadow-[0_8px_30px_rgba(6,182,212,0.4)] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col">
        {/* =========================================================================
            1. TOP BAR (Duolingo format: Name on left, Share & Settings on right)
            ========================================================================= */}
        <div className="w-full px-5 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight truncate max-w-[200px]">
              {displayName}
            </h1>
            <button
              onClick={() => {
                const coolNames = ["TechnoCoder", "CyberNinja", "AIWizard", "QuantumDev", "MatrixMaster", "ByteStorm", "NexusHacker", "VortexAI", "NeuralCoder", "CodePhantom"];
                const randomName = coolNames[Math.floor(Math.random() * coolNames.length)];
                updateProfile({ username: randomName });
                showToast(`🎲 Randomized Name to ${randomName}!`);
              }}
              className="p-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-cyan-300 transition-all cursor-pointer shadow-inner active:scale-95"
              title="Randomize Name (Dice)"
            >
              <Dices className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-share-profile"
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              title="Share profile"
            >
              <Share2 className="w-6 h-6 stroke-[2.2]" />
            </button>
            <button
              id="btn-profile-settings"
              onClick={() => {
                if (onOpenSettings) {
                  onOpenSettings();
                } else {
                  setIsSettingsOpen(true);
                }
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              title="Settings"
            >
              <SettingsIcon className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. HERO AVATAR STAGE (Duolingo format: Centered character + Edit & Face Zoom)
            ========================================================================= */}
        <div className="w-full relative px-4 pt-2 pb-1 flex flex-col items-center justify-center">
          {/* Subtle ground contact shadow */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-44 h-3 rounded-full pointer-events-none bg-black/60 blur-sm" />

          {/* Centered Avatar Canvas (Final Saved Avatar with optional Face Zoom) */}
          <div className="relative z-10 flex flex-col items-center">
            <AIfluenceAvatar
              config={savedAvatarConfig}
              mood={savedAvatarConfig.customPose || "idle"}
              size={isFaceZoom ? 225 : 210}
              showBackground={false}
              animate={true}
              faceZoom={isFaceZoom}
            />

            {/* OPTIONS BESIDE EDIT: Edit & Face Zoom in Store Glass Style */}
            <div className="mt-3 flex items-center gap-2">
              <button
                id="btn-edit-avatar"
                onClick={() => setIsStudioOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.20] active:scale-95 border border-white/20 hover:border-white/35 backdrop-blur-md text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_14px_rgba(0,0,0,0.6)]"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-300" />
                <span>Edit</span>
              </button>

              <button
                id="btn-face-zoom"
                onClick={() => setIsFaceZoom((prev) => !prev)}
                className={`px-4 py-1.5 rounded-xl active:scale-95 border backdrop-blur-md font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_4px_14px_rgba(0,0,0,0.6)] ${
                  isFaceZoom
                    ? "bg-white/[0.18] border-white/40 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                    : "bg-white/[0.08] hover:bg-white/[0.14] border-white/20 hover:border-white/35 text-zinc-300 hover:text-white"
                }`}
                title={isFaceZoom ? "Switch back to Full Body view" : "Zoom into Avatar Face"}
              >
                <ScanFace className={`w-3.5 h-3.5 ${isFaceZoom ? "text-cyan-300" : "text-zinc-400"}`} />
                <span>{isFaceZoom ? "Full Body" : "Face Zoom"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. USER HANDLE & JOIN DATE (Duolingo format: @HANDLE · JOINED 2026)
            ========================================================================= */}
        <div className="w-full px-5 mt-4 text-left flex items-center justify-between">
          <p className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
            {userHandle} · JOINED 2026
          </p>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(displayUserCode);
                showToast(`📋 Friend Code ${displayUserCode} copied!`);
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-black transition-all cursor-pointer shadow-sm active:scale-95"
            title="Click to copy your unique friend code"
          >
            <span className="text-[10px] text-cyan-400 font-sans font-bold">CODE:</span>
            <span>{displayUserCode}</span>
            <Copy className="w-3 h-3 text-cyan-400" />
          </button>
        </div>

        {/* =========================================================================
            4. 3-COLUMN STATS BAR (Duolingo format: Courses | Following | Followers)
            ========================================================================= */}
        <div className="w-full px-5 mt-4 grid grid-cols-3 gap-2 text-left">
          {/* Column 1: Courses */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 h-7">
              {enrolledCourses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCourse?.(c.id)}
                  className={`w-7 h-5 rounded-md flex items-center justify-center font-black text-[10px] shadow-sm border transition-transform hover:scale-110 active:scale-95 cursor-pointer ${
                    c.theme === "purple"
                      ? "bg-purple-600/30 border-purple-400/50 text-purple-300"
                      : c.theme === "green"
                      ? "bg-emerald-600/30 border-emerald-400/50 text-emerald-300"
                      : c.theme === "red"
                      ? "bg-rose-600/30 border-rose-400/50 text-rose-300"
                      : "bg-cyan-600/30 border-cyan-400/50 text-cyan-300"
                  }`}
                  title={`${c.name} (Click to open)`}
                >
                  {c.shortName.slice(0, 3)}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400 mt-1">Courses</span>
          </div>

          {/* Column 2: Following */}
          <div className="flex flex-col">
            <div className="h-7 flex items-center">
              <span className="text-lg font-black text-white leading-none">0</span>
            </div>
            <span className="text-xs font-bold text-slate-400 mt-1">Following</span>
          </div>

          {/* Column 3: Followers */}
          <div className="flex flex-col">
            <div className="h-7 flex items-center">
              <span className="text-lg font-black text-white leading-none">0</span>
            </div>
            <span className="text-xs font-bold text-slate-400 mt-1">Followers</span>
          </div>
        </div>

        {/* =========================================================================
            5. FULL-WIDTH "+ ADD FRIENDS" BUTTON (Duolingo format)
            ========================================================================= */}
        <div className="w-full px-5 mt-4">
          <button
            id="btn-add-friends"
            onClick={() => setIsAddFriendsOpen(true)}
            className="w-full py-3 rounded-2xl border-2 border-white/20 bg-white/5 hover:bg-white/10 active:scale-[0.99] text-white font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span className="tracking-wide">ADD FRIENDS</span>
          </button>
        </div>

        {/* =========================================================================
            6. "Finish your profile!" CARD (Duolingo format with mascot + CONTINUE)
            ========================================================================= */}
        <div className="w-full px-5 mt-6">
          <div className="w-full rounded-2xl bg-[#0b0b0e] border border-white/15 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.85)] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-black text-white leading-tight">
                  Finish your profile!
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wide">
                  1 STEP LEFT
                </p>
              </div>

              {/* Duolingo Mascot illustration in our AI style */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shadow-inner">
                  <span className="text-3xl select-none animate-bounce">🦉</span>
                </div>
              </div>
            </div>

            <button
              id="btn-continue-profile"
              onClick={() => {
                setIsStudioOpen(true);
              }}
              className="w-full mt-3 py-3 rounded-xl bg-[#1cb0f6] hover:bg-[#1899d6] active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              CONTINUE
            </button>
          </div>
        </div>

        {/* =========================================================================
            7. OVERVIEW SECTION (Duolingo format: 2x2 grid with streak, xp, league, top finishes)
            ========================================================================= */}
        <div className="w-full px-5 mt-7">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            OVERVIEW
          </h2>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {/* Streak */}
            <div className="flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 shrink-0" />
              <span className="text-sm font-black text-white">
                {gamification.currentStreak} days
              </span>
            </div>

            {/* Total XP */}
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
              <span className="text-sm font-black text-white">
                {gamification.xp} XP
              </span>
            </div>

            {/* League */}
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-600 fill-amber-600 shrink-0" />
              <span className="text-sm font-black text-white">Bronze</span>
            </div>

            {/* Top Finishes */}
            <div className="flex items-center gap-2.5">
              <Medal className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="text-sm font-black text-white">0 top finishes</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            7.5 LEVEL PLAY HISTORY SECTION (Requested: Record of recent levels, stars, XP & trophies)
            ========================================================================= */}
        <div id="section-level-history" className="w-full px-5 mt-7">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-sm">
                <HistoryIcon className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
                LEVEL HISTORY
              </h2>
              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-cyan-500/30">
                {displayHistory.length} PLAYED
              </span>
            </div>

            {displayHistory.length > 0 && (
              <button
                id="btn-clear-history"
                onClick={() => {
                  if (window.confirm("Clear your level play history? (Your earned XP, stars, and level unlocks will be preserved)")) {
                    clearLevelPlayHistory();
                  }
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear history logs"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {displayHistory.length > 0 ? (
            <div className="space-y-2.5">
              {displayHistory.slice(0, historyLimit).map((item, index) => {
                const playedDate = item.playedAt ? new Date(item.playedAt) : new Date(item.timestamp || Date.now());
                const timeAgo = (() => {
                  const diffMs = Date.now() - playedDate.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMins / 60);
                  const diffDays = Math.floor(diffHours / 24);
                  if (diffMins < 1) return "Just now";
                  if (diffMins < 60) return `${diffMins}m ago`;
                  if (diffHours < 24) return `${diffHours}h ago`;
                  if (diffDays === 1) return "Yesterday";
                  return `${diffDays}d ago`;
                })();

                return (
                  <motion.div
                    key={item.id || `history_${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                    className="w-full rounded-2xl bg-[#0b0b0e] border border-white/15 hover:border-cyan-500/30 p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.85)] transition-all text-left"
                  >
                    {/* Top Row: Course & Section Header with Time */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono">
                          {item.courseName || "Generative AI"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          Sec {item.sectionNumber || 1} · Level {item.levelNumber || 1}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1 shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        {timeAgo}
                      </span>
                    </div>

                    {/* Middle Row: Level Title */}
                    <h4 className="text-sm font-black text-white leading-snug truncate">
                      {item.levelTitle || `Level ${item.levelNumber || 1}`}
                    </h4>

                    {/* Bottom Row: Stars and Rewards Gained */}
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
                      {/* 3-Star Rating Indicator */}
                      <div className="flex items-center gap-1" title={`${item.stars} of 3 Stars Earned`}>
                        {[0, 1, 2].map((starIdx) => {
                          const isFilled = starIdx < item.stars;
                          return (
                            <Star
                              key={starIdx}
                              className={`w-4 h-4 ${
                                isFilled
                                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                                  : "text-slate-700 fill-slate-850 opacity-40"
                              }`}
                            />
                          );
                        })}
                        <span className="text-xs font-black text-amber-300 ml-1">
                          {item.stars}★
                        </span>
                      </div>

                      {/* Gained Badges: XP + Trophies + Diamonds */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* XP Badge */}
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-black">
                          <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>+{item.xpGained || 50} XP</span>
                        </div>

                        {/* Trophies Badge */}
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-600/15 border border-amber-600/30 text-amber-200 text-[11px] font-black">
                          <Trophy className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>+{item.trophiesGained || 25}</span>
                        </div>

                        {/* Diamonds Badge (if any) */}
                        {(item.diamondsGained || 0) > 0 && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-black">
                            <span className="text-[10px]">💎</span>
                            <span>+{item.diamondsGained}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* View More / View Less Toggle Buttons */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {displayHistory.length > historyLimit && (
                  <button
                    id="btn-history-more"
                    onClick={() => setHistoryLimit((prev) => prev + 5)}
                    className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Show More ({displayHistory.length - historyLimit} remaining)
                  </button>
                )}
                {historyLimit > 5 && (
                  <button
                    id="btn-history-less"
                    onClick={() => setHistoryLimit(5)}
                    className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-xs font-bold transition-all cursor-pointer"
                  >
                    Show Less
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Empty State Card */
            <div className="w-full rounded-2xl bg-[#0b0b0e] border border-white/15 p-5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center mb-3">
                <Compass className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-sm font-black text-white mb-1">
                No Level History Yet
              </h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
                Play and complete levels with at least 2 stars on your course learning map. Your stars, XP, and trophies will be recorded here!
              </p>
              {onSelectCourse && (
                <button
                  id="btn-explore-courses-history"
                  onClick={() => onSelectCourse(courseId || "generative_ai")}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Learning</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* =========================================================================
            8. MONTHLY BADGES SECTION (Duolingo format: Horizontal row with 4 circular badges)
            ========================================================================= */}
        <div className="w-full px-5 mt-7">
          <div
            onClick={() =>
              setSelectedItemDetail({
                title: "September Cyber Quest",
                description: "Complete 30 daily academy quests to forge this exclusive badge.",
                icon: "🛡️",
                progress: "12 / 30 Quests",
                unlocked: false,
              })
            }
            className="flex items-center justify-between mb-3 cursor-pointer group"
          >
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
              MONTHLY BADGES
            </h2>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* 1. Current Monthly Badge */}
            <div
              onClick={() =>
                setSelectedItemDetail({
                  title: "September Cyber Quest",
                  description: "Complete 30 daily quests to unlock the September Master badge.",
                  icon: "🤖",
                  progress: "12 / 30 Quests completed",
                  unlocked: false,
                })
              }
              className="w-16 h-16 rounded-full bg-slate-800/80 border-2 border-cyan-400/40 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md relative"
              title="September Badge"
            >
              <span className="text-2xl filter drop-shadow">🤖</span>
            </div>

            {/* 2. Locked Badge Slot */}
            <div
              onClick={() =>
                setSelectedItemDetail({
                  title: "October Quest Badge",
                  description: "Unlocks on October 1st. Participate in next month's challenge.",
                  icon: "🔒",
                  unlocked: false,
                })
              }
              className="w-16 h-16 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center cursor-pointer hover:border-white/20 transition-all opacity-60"
            >
              <Lock className="w-5 h-5 text-slate-500" />
            </div>

            {/* 3. Locked Badge Slot */}
            <div
              onClick={() =>
                setSelectedItemDetail({
                  title: "November Quest Badge",
                  description: "Unlocks on November 1st. Seasonal mastery awaits.",
                  icon: "🔒",
                  unlocked: false,
                })
              }
              className="w-16 h-16 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center cursor-pointer hover:border-white/20 transition-all opacity-60"
            >
              <Lock className="w-5 h-5 text-slate-500" />
            </div>

            {/* 4. Locked Badge Slot */}
            <div
              onClick={() =>
                setSelectedItemDetail({
                  title: "December Quest Badge",
                  description: "Unlocks on December 1st. Winter championship season.",
                  icon: "🔒",
                  unlocked: false,
                })
              }
              className="w-16 h-16 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center cursor-pointer hover:border-white/20 transition-all opacity-60"
            >
              <Lock className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            9. ACHIEVEMENTS SECTION (Duolingo format: Horizontal row with 4 circular badges)
            ========================================================================= */}
        <div className="w-full px-5 mt-7 pb-6">
          <div
            onClick={() =>
              setSelectedItemDetail({
                title: "Wildfire Streak & Mastery",
                description: "Level up your achievements by mastering daily coding challenges.",
                icon: "⚡",
                unlocked: true,
              })
            }
            className="flex items-center justify-between mb-3 cursor-pointer group"
          >
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
              ACHIEVEMENTS
            </h2>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Achievement 1: Wildfire 250 XP */}
            <div
              onClick={() =>
                setSelectedItemDetail({
                  title: "Wildfire Mastery",
                  description: "Earn 250 XP in a single learning session.",
                  icon: "🔥",
                  progress: `${gamification.xp} / 250 XP`,
                  unlocked: gamification.xp >= 250,
                })
              }
              className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 p-0.5 flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <div className="w-full h-full rounded-full bg-[#1b1c2b] flex items-center justify-center overflow-hidden relative">
                <span className="text-2xl">🔥</span>
                <span className="absolute -bottom-0.5 text-[9px] font-black text-white bg-red-600 px-1.5 rounded-full border border-white/20">
                  250
                </span>
              </div>
            </div>

            {/* Achievement 2: Sharpshooter Bow & Arrow */}
            <div
              onClick={() =>
                setSelectedItemDetail({
                  title: "Sharpshooter",
                  description: "Complete 10 lesson levels with 100% accuracy.",
                  icon: "🏹",
                  progress: "1 / 1 Completed",
                  unlocked: true,
                })
              }
              className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <div className="w-full h-full rounded-full bg-[#172223] flex items-center justify-center overflow-hidden relative">
                <span className="text-2xl">🏹</span>
                <span className="absolute -bottom-0.5 text-[9px] font-black text-black bg-emerald-300 px-1.5 rounded-full font-mono">
                  1
                </span>
              </div>
            </div>

            {/* Achievement 3: Scholar Level 10 (Silhouette) */}
            <div
              onClick={() =>
                setSelectedItemDetail({
                  title: "Cyber Scholar",
                  description: "Complete 10 course units across all academies.",
                  icon: "🛡️",
                  progress: "3 / 10 Units",
                  unlocked: false,
                })
              }
              className="relative w-16 h-16 rounded-full bg-slate-900 border-2 border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-all opacity-60"
            >
              <span className="text-2xl filter grayscale opacity-40">🛡️</span>
              <span className="absolute -bottom-0.5 text-[9px] font-black text-slate-400 bg-slate-800 px-1.5 rounded-full">
                10
              </span>
            </div>

            {/* Achievement 4: Night Owl Level 5 (Silhouette) */}
            <div
              onClick={() =>
                setSelectedItemDetail({
                  title: "Night Owl",
                  description: "Complete 5 midnight lessons between 10 PM and 2 AM.",
                  icon: "🦉",
                  progress: "1 / 5 Lessons",
                  unlocked: false,
                })
              }
              className="relative w-16 h-16 rounded-full bg-slate-900 border-2 border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-all opacity-60"
            >
              <span className="text-2xl filter grayscale opacity-40">🦉</span>
              <span className="absolute -bottom-0.5 text-[9px] font-black text-slate-400 bg-slate-800 px-1.5 rounded-full">
                5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          10. ADD FRIENDS MODAL
          ========================================================================= */}
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

              <div className="flex items-center gap-2 mb-3">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">Add Friends</h3>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Learn together, compare streaks, and compete on the weekly leaderboard!
              </p>

              {/* Search / Add input */}
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter friend code (e.g. AIF-XXXXXX)..."
                    value={friendSearch}
                    onChange={(e) => setFriendSearch(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs font-mono uppercase focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  disabled={!friendSearch.trim() || isSendingRequest}
                  onClick={async () => {
                    if (!friendSearch.trim()) return;
                    setIsSendingRequest(true);
                    setRequestFeedback(null);
                    try {
                      const res = await sendFriendRequestByCode(
                        user?.uid || "guest-player",
                        displayUserCode,
                        displayName,
                        friendSearch.trim()
                      );
                      setRequestFeedback(res.message);
                      if (res.success) {
                        setFriendSearch("");
                        showToast(res.message);
                      }
                    } catch {
                      setRequestFeedback("Could not send friend request.");
                    } finally {
                      setIsSendingRequest(false);
                    }
                  }}
                  className="px-3 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-black text-xs transition-all cursor-pointer shadow-md shrink-0"
                >
                  {isSendingRequest ? "Sending..." : "Send"}
                </button>
              </div>

              {requestFeedback && (
                <p className="text-[11px] text-cyan-300 font-bold mb-3 px-1">
                  {requestFeedback}
                </p>
              )}

              {/* Pending Incoming Friend Requests */}
              {friendRequests.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Pending Requests ({friendRequests.length})
                  </h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {friendRequests.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs"
                      >
                        <div>
                          <p className="text-white font-bold">{req.senderName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{req.senderCode}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={async () => {
                              await acceptFriendRequest(req.id);
                              showToast(`Accepted friend request!`);
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[10px] cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={async () => {
                              await rejectFriendRequest(req.id);
                            }}
                            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmed Friends List */}
              {friendsList.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Your Friends ({friendsList.length})
                  </h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {friendsList.map((fr) => (
                      <div
                        key={fr.uid}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-xs">
                            🤖
                          </div>
                          <div>
                            <p className="text-white font-bold">{fr.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{fr.userCode} · 🏆 {fr.trophies}</p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (user?.uid) {
                              await removeFriend(user.uid, fr.uid);
                              showToast(`Removed friend`);
                            }
                          }}
                          className="text-slate-500 hover:text-rose-400 text-[10px] cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share invite button */}
              <button
                onClick={() => {
                  handleShare();
                  setIsAddFriendsOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Friend Invite Link</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          11. QUICK SETTINGS MODAL (Top-right gear icon)
          ========================================================================= */}
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

      {/* =========================================================================
          12. BADGE / ACHIEVEMENT DETAIL POPUP
          ========================================================================= */}
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

              <p className="text-xs text-slate-300 mb-3">
                {selectedItemDetail.description}
              </p>

              {selectedItemDetail.progress && (
                <div className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 font-bold mb-4">
                  {selectedItemDetail.progress}
                </div>
              )}

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

      {/* =========================================================================
          13. THE ALREADY-MADE AVATAR EDITING ROOM (AvatarStudioModal)
          Opens when tapping the single "Edit" button, and saves the final avatar
          ========================================================================= */}
      {isStudioOpen && (
        <AvatarStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          initialConfig={savedAvatarConfig}
          onSaveAvatar={handleSaveAvatarFromStudio}
          userName={displayName}
        />
      )}
    </div>
  );
};
