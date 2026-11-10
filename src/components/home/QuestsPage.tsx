import React, { useState, useEffect, useMemo } from "react";
import { Clock, Flame, Gift, Award, Check, Sparkles } from "lucide-react";
import { useGamification, GamificationState } from "../../utils/gamificationStore";
import { auth } from "../../firebase";
import { loadStoredStudentProfile } from "../../utils/engagementStore";
import {
  fetchOrCreateStudentDailyQuests,
  saveStudentDailyQuests,
  fetchOrCreateDailyActivity,
  verifyAndRecordDailyStreak,
  getDaysInMonth,
  fetchStudentMonthlyQuestProgress,
  recordMonthlyQuestDayCompletion,
  FirebaseQuestItem
} from "../../services/dailyQuestService";

export interface QuestItem {
  id: string;
  t: string; // Title
  d: string; // Description
  p: number; // Current Progress
  g: number; // Goal Target
  r: number; // Reward Gems/Diamonds
  claimed?: boolean;
  isMandatory?: boolean;
  category?: string;
}

const STORAGE_KEY_DAILY = "aifluence_quests_daily_v5";
const STORAGE_KEY_LIFE = "aifluence_quests_life_v5";
const STORAGE_KEY_QP = "aifluence_monthly_qp_v5";

const DEFAULT_DAILY: QuestItem[] = [
  {
    id: "d1",
    t: "Complete 2 Learning Lessons",
    d: "Finish any 2 guided interactive levels of your choice. Est. 15m",
    p: 0,
    g: 2,
    r: 15,
    isMandatory: true,
    category: "lessons"
  },
  {
    id: "d2",
    t: "30 Minutes App Activity",
    d: "Spend at least 30 minutes learning and practicing today. Est. 30m",
    p: 0,
    g: 30,
    r: 25,
    isMandatory: true,
    category: "time"
  },
  {
    id: "d3",
    t: "Score 90%+ in Daily Assessment",
    d: "Demonstrate high accuracy in your daily practice drill. Est. 10m",
    p: 0,
    g: 1,
    r: 20,
    isMandatory: true,
    category: "assessment"
  },
  {
    id: "d4",
    t: "Review 10 Practice Flashcards",
    d: "Keep your concept memory sharp with a quick review round. Est. 5m",
    p: 0,
    g: 10,
    r: 10,
    isMandatory: false,
    category: "review"
  },
  {
    id: "d5",
    t: "Share Streak to Class Feed",
    d: "Share your learning streak progress with your classmates. Est. 1m",
    p: 0,
    g: 1,
    r: 10,
    isMandatory: false,
    category: "social"
  },
];

const DEFAULT_LIFETIME: QuestItem[] = [
  {
    id: "l1",
    t: "Complete 50 Lessons",
    d: "Reach the 50 lesson milestone across all courses.",
    p: 0,
    g: 50,
    r: 100,
  },
  {
    id: "l2",
    t: "7 Day Streak",
    d: "Study seven days in a row without missing one.",
    p: 0,
    g: 7,
    r: 50,
    claimed: false,
  },
  {
    id: "l3",
    t: "Perfect Score Master",
    d: "Earn 100% on ten different quiz drills.",
    p: 0,
    g: 10,
    r: 75,
  },
  {
    id: "l4",
    t: "Collect 1000 Gems",
    d: "Grow your gem collection to one thousand.",
    p: 0,
    g: 1000,
    r: 200,
  },
];

interface QuestsPageProps {
  courseId?: string;
  onSelectCourse?: (courseId: string) => void;
  onClaimReward?: (xp: number, diamonds: number, bonus?: string, trophies?: number) => void;
  onFindFriend?: () => void;
  onLaunchLesson?: (levelId?: string | number) => void;
  onLaunchQuiz?: () => void;
  onLaunchFlashcards?: () => void;
  onNavigateTab?: (tab: "home" | "quests" | "leaderboard" | "store" | "avatar") => void;
  themeColor?: string;
  diamonds?: number;
  onSpendDiamonds?: (amount: number) => boolean;
  onShowToast?: (msg: string) => void;
}

export const QuestsPage: React.FC<QuestsPageProps> = ({
  courseId,
  themeColor,
  onClaimReward,
  onLaunchLesson,
  onLaunchQuiz,
  onLaunchFlashcards,
  onNavigateTab,
  diamonds: propDiamonds = 360,
  onShowToast,
}) => {
  const { state: gamificationState, addDiamonds, updateState } = useGamification();
  const currentGems = gamificationState?.diamonds ?? propDiamonds;

  // Track key for theme styling: "genai" (Blue) | "everyone" (Yellow) | "dsa" (Purple)
  const trackKey = useMemo(() => {
    const key = (courseId || "").toLowerCase();
    if (key === "generative_ai" || key.includes("genai") || key.includes("generative")) return "genai";
    if (key === "ai_for_everyone" || key.includes("everyone")) return "everyone";
    if (themeColor === "yellow" || themeColor === "amber" || themeColor === "gold") return "everyone";
    if (themeColor === "purple" || themeColor === "dsa") return "dsa";
    if (themeColor === "blue" || themeColor === "cyan") return "genai";
    return "genai";
  }, [courseId, themeColor]);

  // Tabs: "daily" vs "life"
  const [activeTab, setActiveTab] = useState<"daily" | "life">("daily");

  // Diamonds bump animation
  const [isBumped, setIsBumped] = useState<boolean>(false);

  // Countdown timer string (Resets in Xh Ym Zs)
  const [resetCountdown, setResetCountdown] = useState<string>("");

  // Current authenticated student ID
  const currentUserId = useMemo(() => {
    return auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
  }, []);

  // Daily quests state synced with Firebase
  const [dailyQuests, setDailyQuests] = useState<QuestItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAILY);
      return saved ? JSON.parse(saved) : DEFAULT_DAILY;
    } catch {
      return DEFAULT_DAILY;
    }
  });

  // Daily Activity stats
  const [activeMinutes, setActiveMinutes] = useState<number>(0);
  const [assessmentCompleted, setAssessmentCompleted] = useState<boolean>(false);

  // Lifetime achievements state
  const [lifetimeQuests, setLifetimeQuests] = useState<QuestItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIFE);
      return saved ? JSON.parse(saved) : DEFAULT_LIFETIME;
    } catch {
      return DEFAULT_LIFETIME;
    }
  });

  // Monthly Quest Points for selected month (reflects completed streak days in current month)
  const [monthlyQP, setMonthlyQP] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QP);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Fetch or initialize personalised daily quests and activity stats from Firebase
  useEffect(() => {
    let isMounted = true;
    const initFirebaseDailyQuests = async () => {
      try {
        const studentQuestDoc = await fetchOrCreateStudentDailyQuests(currentUserId, courseId);
        const activityDoc = await fetchOrCreateDailyActivity(currentUserId);

        // Fetch monthly progress for current month (November 2026 = index 10)
        const monthProgress = await fetchStudentMonthlyQuestProgress(currentUserId, 2026, 10);

        if (isMounted) {
          setActiveMinutes(activityDoc.activeMinutes || 0);
          setAssessmentCompleted(Boolean(activityDoc.assessmentCompleted));
          setMonthlyQP(monthProgress.completedDays || 0);

          // Check local storage quest overrides if present
          let localQuests: QuestItem[] = [];
          try {
            const rawLocal = localStorage.getItem(STORAGE_KEY_DAILY);
            if (rawLocal) localQuests = JSON.parse(rawLocal);
          } catch (e) {}

          // Merge activity metrics & local progress into live daily quests progress
          const syncedQuests = (studentQuestDoc.quests || []).map((q) => {
            let currentP = q.p;
            const cat = (q.category || "").toLowerCase();
            const localMatch = localQuests.find((lq) => lq.id === q.id || lq.category === q.category);
            if (localMatch && localMatch.p > currentP) {
              currentP = localMatch.p;
            }

            if (cat === "time") {
              currentP = Math.max(currentP, activityDoc.activeMinutes || 0);
            } else if (cat === "lessons" && activityDoc.lessonsCompleted > 0) {
              currentP = Math.max(currentP, activityDoc.lessonsCompleted);
            } else if (cat === "assessment" && activityDoc.assessmentCompleted) {
              currentP = q.g;
            }

            return {
              id: q.id,
              t: q.t,
              d: q.d,
              p: Math.min(q.g, currentP),
              g: q.g,
              r: q.r,
              claimed: Boolean(q.claimed || localMatch?.claimed),
              isMandatory: Boolean(q.isMandatory),
              category: q.category
            };
          });

          setDailyQuests(syncedQuests);
          try {
            localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(syncedQuests));
          } catch {}

          // Automatically verify streak completion against requirements
          const streakCheck = await verifyAndRecordDailyStreak(
            currentUserId,
            syncedQuests,
            activityDoc.activeMinutes || 0,
            Boolean(activityDoc.assessmentCompleted)
          );

          if (streakCheck.streakUpdated) {
            updateState?.((prev: GamificationState) => ({
              ...prev,
              currentStreak: streakCheck.currentStreak
            }));
            onShowToast?.(`🔥 ${streakCheck.message}`);

            // Record monthly completed day
            const todayStr = new Date().toISOString().split("T")[0];
            recordMonthlyQuestDayCompletion(currentUserId, 2026, 10, todayStr).then((count) => {
              if (count > 0 && isMounted) setMonthlyQP(count);
            });
          }
        }
      } catch (err) {
        console.warn("Using offline / fallback daily quests:", err);
      }
    };

    initFirebaseDailyQuests();
    return () => {
      isMounted = false;
    };
  }, [currentUserId, courseId]);

  // Countdown timer ticking every second
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffSecs = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
      const hours = Math.floor(diffSecs / 3600);
      const mins = Math.floor((diffSecs % 3600) / 60);
      const secs = diffSecs % 60;
      setResetCountdown(`Resets in ${hours}h ${mins}m ${secs}s`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle claiming a quest reward
  const handleClaim = async (quest: QuestItem, isDaily: boolean) => {
    if (quest.claimed || quest.p < quest.g) return;

    const list = isDaily ? dailyQuests : lifetimeQuests;
    const updated = list.map((q: QuestItem) => (q.id === quest.id ? { ...q, claimed: true } : q));

    if (isDaily) {
      setDailyQuests(updated);
      try {
        localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(updated));
      } catch {}

      // Sync to Firebase
      saveStudentDailyQuests(currentUserId, updated).catch(console.warn);

      // Verify daily streak completion
      verifyAndRecordDailyStreak(
        currentUserId,
        updated,
        activeMinutes,
        assessmentCompleted
      ).then((res) => {
        if (res.streakUpdated) {
          updateState?.((prev: GamificationState) => ({
            ...prev,
            currentStreak: res.currentStreak
          }));
          onShowToast?.(`🔥 ${res.message}`);

          const todayStr = new Date().toISOString().split("T")[0];
          recordMonthlyQuestDayCompletion(currentUserId, 2026, 10, todayStr).then((count) => {
            if (count > 0) setMonthlyQP(count);
          });
        }
      }).catch(console.warn);
    } else {
      setLifetimeQuests(updated);
      try {
        localStorage.setItem(STORAGE_KEY_LIFE, JSON.stringify(updated));
      } catch {}
    }

    // Award gems / diamonds
    addDiamonds?.(quest.r);
    onClaimReward?.(25, quest.r, quest.t);

    // Bump gem counter
    setIsBumped(true);
    setTimeout(() => setIsBumped(false), 350);

    const msg = `+${quest.r} gems · Daily Quest Reward!`;
    onShowToast?.(msg);
  };

  // Handle starting / progressing a quest with real redirections & modal launches
  const handleStart = (quest: QuestItem, isDaily: boolean) => {
    const qTitle = quest.t.toLowerCase();
    const qCat = (quest.category || "").toLowerCase();

    if (qCat === "social" || qTitle.includes("share")) {
      // Execute Share to Class action
      const streakVal = gamificationState?.currentStreak || 1;
      const shareText = `🔥 I completed my Daily Quests & ${streakVal}-Day Streak on Scholar Battles!`;
      try {
        navigator.clipboard?.writeText(shareText);
      } catch {}

      const list = isDaily ? dailyQuests : lifetimeQuests;
      const updated = list.map((q: QuestItem) => (q.id === quest.id ? { ...q, p: q.g } : q));

      if (isDaily) {
        setDailyQuests(updated);
        try {
          localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(updated));
        } catch {}
        saveStudentDailyQuests(currentUserId, updated).catch(console.warn);
      }
      onShowToast?.(`📣 Shared to class feed! (${streakVal}-Day Streak)`);
      return;
    }

    if (qCat === "lessons" || qTitle.includes("lesson") || qTitle.includes("level") || qTitle.includes("generative") || qTitle.includes("dsa")) {
      if (onNavigateTab) onNavigateTab("home");
      if (onLaunchLesson) {
        onLaunchLesson();
      }
      onShowToast?.("🚀 Opening Generative AI Learning Level Map!");
      return;
    }

    if (qCat === "assessment" || qTitle.includes("assessment") || qTitle.includes("quiz") || qTitle.includes("drill")) {
      if (onNavigateTab) onNavigateTab("home");
      if (onLaunchQuiz) {
        onLaunchQuiz();
      } else if (onLaunchLesson) {
        onLaunchLesson();
      }
      onShowToast?.("⚡ Launching Daily Assessment practice drill!");
      return;
    }

    if (qCat === "review" || qTitle.includes("flashcard") || qTitle.includes("review")) {
      if (onNavigateTab) onNavigateTab("home");
      if (onLaunchFlashcards) {
        onLaunchFlashcards();
      } else if (onLaunchLesson) {
        onLaunchLesson();
      }
      onShowToast?.("📖 Opening Concept Review Flashcards!");
      return;
    }

    if (onLaunchLesson) {
      if (onNavigateTab) onNavigateTab("home");
      onLaunchLesson();
      return;
    }

    // Fallback simulated progress
    const list = isDaily ? dailyQuests : lifetimeQuests;
    const updated = list.map((q: QuestItem) => {
      if (q.id === quest.id) {
        const step = q.g > 10 ? Math.ceil(q.g / 4) : 1;
        return { ...q, p: Math.min(q.g, q.p + step) };
      }
      return q;
    });

    if (isDaily) {
      setDailyQuests(updated);
      try {
        localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(updated));
      } catch {}
      saveStudentDailyQuests(currentUserId, updated).catch(console.warn);
    } else {
      setLifetimeQuests(updated);
      try {
        localStorage.setItem(STORAGE_KEY_LIFE, JSON.stringify(updated));
      } catch {}
    }

    const currentQuest = updated.find((q: QuestItem) => q.id === quest.id);
    onShowToast?.(`Progress: ${currentQuest?.p}/${currentQuest?.g}`);
  };

  const activeList = activeTab === "daily" ? dailyQuests : lifetimeQuests;
  const isDaily = activeTab === "daily";

  // Chest SVG renderer with theme-aware gradient colors and ambient glow
  const renderChestSvg = (open: boolean) => {
    return (
      <svg viewBox="0 0 64 64" className="w-16 h-16 drop-shadow-[0_0_12px_rgba(var(--rgb),0.7)] transition-transform duration-300">
        <ellipse cx="32" cy="58" rx="22" ry="3" fill="#000" opacity=".5" />
        <rect
          x="8"
          y="28"
          width="48"
          height="28"
          rx="5"
          fill={open ? "var(--b2)" : "var(--b0)"}
          stroke="#D7E2EA"
          strokeWidth="2"
        />
        {open ? (
          <>
            <path d="M8 28 L14 10 H50 L56 28Z" fill="var(--b1)" stroke="#D7E2EA" strokeWidth="2" />
            <ellipse cx="32" cy="28" rx="20" ry="4" fill="#BBCCD7" />
          </>
        ) : (
          <path d="M8 28a24 18 0 0 1 48 0z" fill="var(--b2)" stroke="#D7E2EA" strokeWidth="2" />
        )}
        <rect x="14" y="26" width="6" height="30" fill="var(--b1)" opacity=".8" />
        <rect x="44" y="26" width="6" height="30" fill="var(--b1)" opacity=".8" />
        <rect x="27" y="30" width="10" height="12" rx="2" fill="#D7E2EA" />
        <circle cx="32" cy="35" r="2" fill="var(--b3)" />
      </svg>
    );
  };

  // Month themes definition matching HTML template with dynamic month lengths
  const MONTHS_DATA = useMemo(() => [
    {
      k: "nov",
      n: "November",
      th: "Hip-Hop Cypher",
      ev: "Block Party",
      ch: "★",
      sw: "linear-gradient(135deg,#FF2E88,#FFD400)",
      index: 10,
      year: 2026,
      dx: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="29" fill="#111" stroke="#FFD400" stroke-width="3"/><circle cx="32" cy="32" r="21" fill="none" stroke="#FFD400" stroke-opacity=".35"/><circle cx="32" cy="32" r="12" fill="#FF2E88"/><circle cx="32" cy="32" r="3" fill="#111"/><path d="M14 22a21 21 0 0 1 12-9" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none"/></svg>',
    },
    {
      k: "dec",
      n: "December",
      th: "Winter Christmas",
      ev: "Holiday Cheer",
      ch: "🎄",
      sw: "linear-gradient(135deg,#D7263D,#2E9E5B)",
      index: 11,
      year: 2026,
      dx: '<svg viewBox="0 0 64 64"><path d="M32 6l16 20H38l14 18H12l14-18H16z" fill="#2E9E5B"/><rect x="28" y="44" width="8" height="10" fill="#8B5A2B"/><path d="M32 2l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5z" fill="#F7CF62"/><circle cx="26" cy="30" r="3" fill="#D7263D"/><circle cx="38" cy="38" r="3" fill="#F7CF62"/><circle cx="24" cy="42" r="3" fill="#D7263D"/></svg>',
    },
    {
      k: "jan",
      n: "January",
      th: "Frost Frontier",
      ev: "Aurora Gala",
      ch: "❄",
      sw: "linear-gradient(135deg,#0284C7,#38BDF8)",
      index: 0,
      year: 2027,
      dx: '<svg viewBox="0 0 64 64"><polygon points="32,4 40,24 60,32 40,40 32,60 24,40 4,32 24,24" fill="#38BDF8"/><polygon points="32,14 37,27 50,32 37,37 32,50 27,37 14,32 27,27" fill="#BAE6FD"/><circle cx="32" cy="32" r="6" fill="#0284C7"/><line x1="32" y1="2" x2="32" y2="62" stroke="#E0F2FE" stroke-width="2"/><line x1="2" y1="32" x2="62" y2="32" stroke="#E0F2FE" stroke-width="2"/></svg>',
    },
  ], []);

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>("nov");
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState<boolean>(false);

  const selectedMonth = useMemo(() => {
    return MONTHS_DATA.find((m) => m.k === selectedMonthKey) || MONTHS_DATA[0];
  }, [selectedMonthKey, MONTHS_DATA]);

  // Total days in the selected month (e.g. November = 30, December = 31, January = 31, February = 28/29)
  const totalDaysInSelectedMonth = useMemo(() => {
    return getDaysInMonth(selectedMonth.year, selectedMonth.index);
  }, [selectedMonth]);

  const currentMonthIndex = 10; // November is current month
  const getMonthDaysLeft = (mIdx: number) => {
    const now = new Date();
    const y = now.getFullYear();
    if (mIdx === currentMonthIndex) {
      return Math.max(1, Math.ceil((new Date(y, mIdx + 1, 1).getTime() - now.getTime()) / 864e5)) + "d left";
    }
    if (mIdx === 11) {
      return "Starts in " + Math.max(1, Math.ceil((new Date(y, 11, 1).getTime() - now.getTime()) / 864e5)) + "d";
    }
    if (mIdx === 0) {
      return "Starts in " + Math.max(1, Math.ceil((new Date(y + 1, 0, 1).getTime() - now.getTime()) / 864e5)) + "d";
    }
    return "Upcoming";
  };

  const getTier = (p: number, maxDays: number) => {
    const ratio = p / maxDays;
    if (ratio >= 0.8) return "Gold";
    if (ratio >= 0.4) return "Silver";
    if (p > 0) return "Bronze";
    return "—";
  };

  return (
    <div
      className="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-kanit select-none relative overflow-x-hidden"
      data-track={trackKey}
    >
      {/* Dynamic Cosmic Stars & Smoke Ambient Glow Background matching 1st Page Map */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft radial smoke bursts in active course color */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[460px] rounded-full blur-[130px] opacity-35 transition-all duration-700"
          style={{ backgroundColor: "rgba(var(--rgb), 0.45)" }}
        />
        <div
          className="absolute -bottom-32 right-[-100px] w-[550px] h-[420px] rounded-full blur-[140px] opacity-25 transition-all duration-700"
          style={{ backgroundColor: "rgba(var(--rgb), 0.45)" }}
        />
      </div>

      <main className="qp-wrap relative z-10" data-track={trackKey} data-m={selectedMonthKey}>
        {/* Ambient Cosmic Sparkles & Floating Celestial Objects */}
        <div className="spark absolute top-6 left-3 text-[var(--b1)] animate-[tw_3s_ease-in-out_infinite] drop-shadow-[0_0_10px_rgba(var(--rgb),.85)] pointer-events-none z-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="spark absolute top-8 right-4 text-[var(--b1)] animate-[tw_3s_ease-in-out_infinite_1.4s] drop-shadow-[0_0_10px_rgba(var(--rgb),.85)] pointer-events-none z-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="spark absolute top-[440px] -right-2 text-[var(--b1)] animate-[tw_3s_ease-in-out_infinite_0.7s] drop-shadow-[0_0_8px_rgba(var(--rgb),.8)] pointer-events-none z-0">
          <Sparkles className="w-6 h-6" />
        </div>

        {/* Floating 3D Moon & Cube */}
        <div className="moon absolute -left-4 top-[320px] w-12 h-12 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#BBCCD7_40%,#4a5160)] shadow-[inset_-6px_-5px_12px_rgba(0,0,0,.5),0_0_20px_rgba(var(--rgb),.3)] opacity-35 animate-[fl_6s_ease-in-out_infinite] pointer-events-none z-0" />
        <div className="cube absolute -right-3 top-[580px] w-11 h-11 rounded-[22%] bg-gradient-to-br from-[var(--b1)] via-[var(--b2)] to-[var(--b0)] shadow-[inset_3px_3px_8px_rgba(255,255,255,.4),0_0_20px_rgba(var(--rgb),.4)] rotate-18 opacity-35 animate-[fl_7s_ease-in-out_infinite] pointer-events-none z-0" />

        {/* =========================================================================
            1. HEADER (Title, Countdown, Gems counter)
            ========================================================================= */}
        <header className="qp-header relative z-10">
          <div>
            <h1 className="qp-hero-heading text-2xl sm:text-4xl drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] font-kanit font-black uppercase">
              Quests &amp; Achievements
            </h1>
            <div className="qp-reset">
              <Clock className="w-4 h-4 stroke-[2.2] text-[var(--b1)] drop-shadow-[0_0_6px_rgba(var(--rgb),0.7)]" />
              <span>{resetCountdown || "Resets in 6h 33m 53s"}</span>
            </div>
          </div>

          {/* Gems counter pill (.qp-gems) */}
          <div className={`qp-gems ${isBumped ? "bump" : ""}`}>
            <svg className="w-5 h-5 flex-none drop-shadow-[0_0_8px_var(--b1)]" viewBox="0 0 24 24">
              <path d="M6 3h12l4 6-10 12L2 9z" fill="var(--b1)" />
              <path
                d="M2 9h20M9 3l-2 6 5 12 5-12-2-6"
                fill="none"
                stroke="#010B1F"
                strokeWidth="1.2"
              />
            </svg>
            <span className="font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{currentGems}</span>
          </div>
        </header>

        {/* =========================================================================
            2. BIG MONTHLY CARD (.qp-big)
            ========================================================================= */}
        <section className="qp-big text-left relative z-10">
          <div className="qp-top">
            <button
              onClick={() => setIsMonthDropdownOpen((prev) => !prev)}
              className="qp-tag flex items-center gap-2 cursor-pointer"
              aria-expanded={isMonthDropdownOpen}
            >
              <span>{selectedMonth.n} Track</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isMonthDropdownOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <span className="qp-ev">
              <Flame className="w-4 h-4 fill-current text-[var(--b1)] animate-pulse drop-shadow-[0_0_10px_rgba(var(--rgb),0.95)]" />
              <span>{selectedMonth.ev}</span>
            </span>
          </div>

          <h2 className="qp-month-heading">{selectedMonth.n.toUpperCase()} QUEST</h2>

          <div className="qp-left">
            <Clock className="w-4 h-4 stroke-[2] text-[var(--b1)]" />
            <span>{getMonthDaysLeft(selectedMonth.index)}</span>
          </div>

          {/* Theme Decoration SVG */}
          <div className="qp-deco" dangerouslySetInnerHTML={{ __html: selectedMonth.dx }} />

          {/* Month Picker Dropdown */}
          <div className={`qp-pick ${isMonthDropdownOpen ? "open" : ""}`}>
            <div>
              {MONTHS_DATA.map((m) => {
                const isSelected = m.k === selectedMonthKey;
                const mDays = getDaysInMonth(m.year, m.index);
                const pts = m.index === currentMonthIndex ? Math.min(mDays, monthlyQP) : 0;
                const statusLabel = m.index === currentMonthIndex ? "Current" : m.index > currentMonthIndex ? "Upcoming" : "Done";
                return (
                  <button
                    key={m.k}
                    onClick={() => {
                      setSelectedMonthKey(m.k);
                      setIsMonthDropdownOpen(false);
                      onShowToast?.(`Switched to ${m.n} Quest (${m.th})`);
                    }}
                    className={`qp-mrow ${isSelected ? "on" : ""}`}
                  >
                    <span className="qp-sw" style={{ background: m.sw }}>
                      {m.ch}
                    </span>
                    <span className="mi">
                      <b className="flex justify-between items-center text-white font-bold">
                        <span>{m.n}</span>
                        <em className="text-[var(--b1)] font-medium text-xs tracking-wider uppercase">{statusLabel}</em>
                      </b>
                      <small className="text-slate-300/80 text-xs">
                        {m.th} · {m.index > currentMonthIndex ? getMonthDaysLeft(m.index) : `${pts}/${mDays} pts · ${Math.round((pts / mDays) * 100)}% · ${getTier(pts, mDays)}`}
                      </small>
                      <div className="bar mt-1">
                        <i style={{ width: `${(pts / mDays) * 100}%` }} />
                      </div>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Box (.qp-pbox) */}
          <div className="qp-pbox">
            <div className="qp-prow">
              <span className="text-white font-medium">{totalDaysInSelectedMonth} Quest Points</span>
              <span>{Math.max(0, totalDaysInSelectedMonth - monthlyQP)} to go</span>
            </div>

            <div className="qp-bar">
              <i style={{ width: `${Math.min(100, (monthlyQP / totalDaysInSelectedMonth) * 100)}%` }} />
              <b>{monthlyQP} / {totalDaysInSelectedMonth}</b>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. TABS (.qp-tabs)
            ========================================================================= */}
        <div className="qp-tabs relative z-10">
          <button
            onClick={() => setActiveTab("daily")}
            className={`qp-tab ${activeTab === "daily" ? "on" : ""}`}
          >
            <Gift
              className={`w-4 h-4 stroke-[2.2] transition-all duration-300 ${
                activeTab === "daily"
                  ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.85)] animate-pulse"
                  : ""
              }`}
            />
            <span>Daily Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab("life")}
            className={`qp-tab ${activeTab === "life" ? "on" : ""}`}
          >
            <Award
              className={`w-4 h-4 stroke-[2.2] transition-all duration-300 ${
                activeTab === "life"
                  ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.85)] animate-pulse"
                  : ""
              }`}
            />
            <span>Lifetime</span>
          </button>
        </div>

        {/* =========================================================================
            4. QUESTS LIST (.qp-list)
            ========================================================================= */}
        <div className="qp-list relative z-10">
          {activeList.map((quest, index) => {
            const isDone = quest.p >= quest.g;
            const isClaimed = Boolean(quest.claimed);
            const pct = Math.min(100, Math.round((quest.p / quest.g) * 100));

            return (
              <div
                key={quest.id}
                className={`qp-card ${isDone && !isClaimed ? "ready" : ""} ${
                  isClaimed ? "done" : ""
                } transition-all duration-300`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* 3D Chest Graphic + Checkmark Badge */}
                <div className="qp-ico">
                  {renderChestSvg(isClaimed)}
                  {isClaimed && (
                    <span className="qp-ck">
                      <Check className="w-3.5 h-3.5 stroke-[3.5] text-white" />
                    </span>
                  )}
                </div>

                {/* Quest Info */}
                <div className="qp-info">
                  <h3 className="text-white font-semibold">{quest.t}</h3>
                  <p title={quest.d} className="text-slate-300/80">{quest.d}</p>
                  <div className="qp-mini">
                    <div className="bar">
                      <i style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-mono font-medium text-slate-300">
                      {Math.min(quest.p, quest.g)}/{quest.g}
                    </span>
                  </div>
                </div>

                {/* Right Action Button & Reward */}
                <div className="flex flex-col items-center shrink-0">
                  {isClaimed ? (
                    <button className="qp-act cl flex items-center justify-center gap-1" disabled>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Claimed</span>
                    </button>
                  ) : isDone ? (
                    <button
                      onClick={() => handleClaim(quest, isDaily)}
                      className="qp-act claim"
                    >
                      Claim
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStart(quest, isDaily)}
                      className="qp-act"
                    >
                      Start
                    </button>
                  )}

                  {/* Gem Reward Below Button */}
                  <div className="qp-rw">
                    <span>+{quest.r}</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path d="M6 3h12l4 6-10 12L2 9z" fill="var(--b1)" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
