import React from "react";
import {
  ChevronDown,
  Sparkles,
  Cpu,
  Code2,
  Home,
  Gift,
  Trophy,
  ShoppingBag,
  Bot,
  Settings,
} from "lucide-react";
import { motion } from "motion/react";
import { BottomNavTab } from "./BottomNavBar";
import { StoreIcon } from "./ScholarStoreIcons";

export interface StatusBarCourseInfo {
  id: string;
  name: string;
  code: string;
  flag?: string;
  score: number;
}

interface CourseStatusBarProps {
  currentCourseName: string;
  currentCourseCode: string;
  currentCourseShortName?: string;
  currentLevel: number;
  streakDays?: number;
  trophiesCount?: number;
  diamondsCount?: number;
  playsCount?: number;
  themeColor?: string;
  isStoreActive?: boolean;
  isCourseDropdownOpen: boolean;
  onToggleCourseDropdown: () => void;
  onOpenStreak?: () => void;
  onOpenTrophies?: () => void;
  onOpenPlays?: () => void;
  onOpenDiamonds?: () => void;
  onBackToApp?: () => void;
  activeNavTab?: BottomNavTab;
  onSelectNavTab?: (tab: BottomNavTab) => void;
  onOpenSpinWheel?: () => void;
}

export const CourseStatusBar: React.FC<CourseStatusBarProps> = ({
  currentCourseName,
  currentCourseCode,
  currentCourseShortName,
  currentLevel,
  streakDays = 0,
  trophiesCount = 0,
  diamondsCount = 0,
  playsCount = 0,
  themeColor = "purple",
  isStoreActive = false,
  isCourseDropdownOpen,
  onToggleCourseDropdown,
  onOpenStreak,
  onOpenTrophies,
  onOpenPlays,
  onOpenDiamonds,
  onBackToApp,
  activeNavTab,
  onSelectNavTab,
  onOpenSpinWheel,
}) => {
  // Theme-reactive visual tokens (background gradient, border, glow, highlight, button styles)
  const themeStyles = isStoreActive
    ? {
        bg: "bg-[#09090b]",
        border: "border-b border-white/10",
        glow: "transparent",
        topHighlight: "from-transparent via-white/10 to-transparent",
        dropdownButton: "bg-white/[0.06] border-white/15 hover:bg-white/10 text-white shadow-none",
        dropdownButtonActive: "bg-white/[0.12] border-white/30 text-white shadow-none",
      }
    : {
    purple: {
      bg: "bg-[#140a2a]/95 bg-gradient-to-b from-[#1c0d3a]/95 via-[#130826]/95 to-[#0c051a]/95",
      border: "border-b border-purple-500/20",
      glow: "rgba(168, 85, 247, 0.18)",
      topHighlight: "from-transparent via-purple-300/20 to-transparent",
      dropdownButton: "bg-purple-950/40 border-purple-400/25 hover:bg-purple-900/40 text-white shadow-[0_0_8px_rgba(168,85,247,0.15)]",
      dropdownButtonActive: "bg-purple-600/25 border-purple-300/50 text-white shadow-[0_0_10px_rgba(168,85,247,0.25)]",
    },
    green: {
      bg: "bg-[#061812]/95 bg-gradient-to-b from-[#092b1f]/95 via-[#061812]/95 to-[#030e0b]/95",
      border: "border-b border-emerald-500/20",
      glow: "rgba(34, 197, 94, 0.18)",
      topHighlight: "from-transparent via-emerald-300/20 to-transparent",
      dropdownButton: "bg-emerald-950/40 border-emerald-400/25 hover:bg-emerald-900/40 text-white shadow-[0_0_8px_rgba(34,197,94,0.15)]",
      dropdownButtonActive: "bg-emerald-600/25 border-emerald-300/50 text-white shadow-[0_0_10px_rgba(34,197,94,0.25)]",
    },
    red: {
      bg: "bg-[#18080b]/95 bg-gradient-to-b from-[#2b0c12]/95 via-[#18080b]/95 to-[#0e0406]/95",
      border: "border-b border-rose-500/20",
      glow: "rgba(239, 68, 68, 0.18)",
      topHighlight: "from-transparent via-rose-300/20 to-transparent",
      dropdownButton: "bg-rose-950/40 border-rose-400/25 hover:bg-rose-900/40 text-white shadow-[0_0_8px_rgba(239,68,68,0.15)]",
      dropdownButtonActive: "bg-rose-600/25 border-rose-300/50 text-white shadow-[0_0_10px_rgba(239,68,68,0.25)]",
    },
    blue: {
      bg: "bg-[#071328]/95 bg-gradient-to-b from-[#0e274e]/95 via-[#071328]/95 to-[#030814]/95",
      border: "border-b border-sky-500/20",
      glow: "rgba(59, 130, 246, 0.18)",
      topHighlight: "from-transparent via-sky-300/20 to-transparent",
      dropdownButton: "bg-sky-950/40 border-sky-400/25 hover:bg-sky-900/40 text-white shadow-[0_0_8px_rgba(59,130,246,0.15)]",
      dropdownButtonActive: "bg-sky-600/25 border-sky-300/50 text-white shadow-[0_0_10px_rgba(59,130,246,0.25)]",
    },
    cyan: {
      bg: "bg-[#04141d]/95 bg-gradient-to-b from-[#072738]/95 via-[#04141d]/95 to-[#020b10]/95",
      border: "border-b border-cyan-500/20",
      glow: "rgba(6, 182, 212, 0.18)",
      topHighlight: "from-transparent via-cyan-300/20 to-transparent",
      dropdownButton: "bg-cyan-950/40 border-cyan-400/25 hover:bg-cyan-900/40 text-white shadow-[0_0_8px_rgba(6,182,212,0.15)]",
      dropdownButtonActive: "bg-cyan-600/25 border-cyan-300/50 text-white shadow-[0_0_10px_rgba(6,182,212,0.25)]",
    },
    yellow: {
      bg: "bg-[#140e03]/95 bg-gradient-to-b from-[#241a05]/95 via-[#140e03]/95 to-[#080501]/95",
      border: "border-b border-amber-500/30",
      glow: "rgba(234, 179, 8, 0.25)",
      topHighlight: "from-transparent via-yellow-400/25 to-transparent",
      dropdownButton: "bg-yellow-950/50 border-yellow-500/30 hover:bg-yellow-900/50 text-yellow-100 shadow-[0_0_8px_rgba(234,179,8,0.2)]",
      dropdownButtonActive: "bg-yellow-600/30 border-yellow-400/60 text-white shadow-[0_0_12px_rgba(234,179,8,0.35)]",
    },
    white: {
      bg: "bg-black/95 bg-gradient-to-b from-[#141414]/95 via-black/95 to-black/95",
      border: "border-b border-white/15",
      glow: "rgba(255, 255, 255, 0.10)",
      topHighlight: "from-transparent via-white/20 to-transparent",
      dropdownButton: "bg-white/10 border-white/15 hover:bg-white/15 text-white shadow-[0_0_8px_rgba(255,255,255,0.1)]",
      dropdownButtonActive: "bg-white/20 border-white/40 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]",
    },
    bronze: {
      bg: "bg-[#0c0805]/95 bg-gradient-to-b from-[#1b1008]/95 via-[#0d0905]/95 to-[#050302]/95",
      border: "border-b border-[#cd7f32]/35",
      glow: "rgba(205, 127, 50, 0.35)",
      topHighlight: "from-transparent via-[#cd7f32]/35 to-transparent",
      dropdownButton: "bg-[#201108]/60 border-[#cd7f32]/40 hover:bg-[#2e190b]/60 text-amber-200 shadow-[0_0_12px_rgba(205,127,50,0.25)]",
      dropdownButtonActive: "bg-[#cd7f32]/30 border-[#f59e0b]/70 text-white shadow-[0_0_16px_rgba(205,127,50,0.45)]",
    },
    "light-blue": {
      bg: "bg-[#030d17]/95 bg-gradient-to-b from-[#061b30]/95 via-[#03101c]/95 to-[#01060b]/95",
      border: "border-b border-sky-400/35",
      glow: "rgba(56, 189, 248, 0.35)",
      topHighlight: "from-transparent via-sky-300/35 to-transparent",
      dropdownButton: "bg-sky-950/60 border-sky-400/40 hover:bg-sky-900/60 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]",
      dropdownButtonActive: "bg-sky-600/30 border-sky-300/70 text-white shadow-[0_0_16px_rgba(56,189,248,0.45)]",
    },
    gold: {
      bg: "bg-[#140e03]/95 bg-gradient-to-b from-[#241a05]/95 via-[#140e03]/95 to-[#080501]/95",
      border: "border-b border-amber-400/35",
      glow: "rgba(245, 158, 11, 0.35)",
      topHighlight: "from-transparent via-amber-300/35 to-transparent",
      dropdownButton: "bg-amber-950/60 border-amber-400/40 hover:bg-amber-900/60 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
      dropdownButtonActive: "bg-amber-600/30 border-amber-300/70 text-white shadow-[0_0_16px_rgba(245,158,11,0.45)]",
    },
    silver: {
      bg: "bg-[#0c0d10]/95 bg-gradient-to-b from-[#181a20]/95 via-[#0c0d10]/95 to-[#050608]/95",
      border: "border-b border-slate-400/35",
      glow: "rgba(203, 213, 225, 0.30)",
      topHighlight: "from-transparent via-slate-300/35 to-transparent",
      dropdownButton: "bg-slate-900/60 border-slate-400/40 hover:bg-slate-800/60 text-slate-200 shadow-[0_0_12px_rgba(203,213,225,0.20)]",
      dropdownButtonActive: "bg-slate-500/30 border-slate-300/70 text-white shadow-[0_0_16px_rgba(203,213,225,0.40)]",
    },
    copper: {
      bg: "bg-[#140803]/95 bg-gradient-to-b from-[#240e06]/95 via-[#140803]/95 to-[#080301]/95",
      border: "border-b border-orange-500/35",
      glow: "rgba(234, 88, 12, 0.35)",
      topHighlight: "from-transparent via-orange-300/35 to-transparent",
      dropdownButton: "bg-orange-950/60 border-orange-400/40 hover:bg-orange-900/60 text-orange-200 shadow-[0_0_12px_rgba(234,88,12,0.25)]",
      dropdownButtonActive: "bg-orange-600/30 border-orange-300/70 text-white shadow-[0_0_16px_rgba(234,88,12,0.45)]",
    },
    black: {
      bg: "bg-[#09090b]/95 bg-gradient-to-b from-[#141417]/95 via-[#09090b]/95 to-[#040405]/95",
      border: "border-b border-slate-500/35",
      glow: "rgba(148, 163, 184, 0.20)",
      topHighlight: "from-transparent via-slate-400/25 to-transparent",
      dropdownButton: "bg-slate-900/60 border-slate-400/40 hover:bg-slate-800/60 text-slate-200 shadow-[0_0_12px_rgba(148,163,184,0.15)]",
      dropdownButtonActive: "bg-slate-600/30 border-slate-300/70 text-white shadow-[0_0_16px_rgba(148,163,184,0.35)]",
    },
  }[themeColor as string] || {
    bg: "bg-[#140a2a]/95 bg-gradient-to-b from-[#1c0d3a]/95 via-[#130826]/95 to-[#0c051a]/95",
    border: "border-b border-purple-500/20",
    glow: "rgba(168, 85, 247, 0.18)",
    topHighlight: "from-transparent via-purple-300/20 to-transparent",
    dropdownButton: "bg-purple-950/40 border-purple-400/25 hover:bg-purple-900/40 text-white shadow-[0_0_8px_rgba(168,85,247,0.15)]",
    dropdownButtonActive: "bg-purple-600/25 border-purple-300/50 text-white shadow-[0_0_10px_rgba(168,85,247,0.25)]",
  };

  // Render Flag or Vector Icon for the active course (GenAI, DSA, HTML, Java, C++, Prompt Engineering)
  const renderCourseVisual = (code: string, shortName?: string) => {
    const clean = (code || "").toLowerCase();
    switch (clean) {
      case "generative_ai":
      case "genai":
        return (
          <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#1e40af] to-[#172554] border-2 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)] flex flex-col items-center justify-center relative overflow-hidden">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            </div>
          </div>
        );
      case "ai_for_everyone":
      case "ai_101":
        return (
          <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#854d0e] to-[#422006] border-2 border-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)] flex flex-col items-center justify-center relative overflow-hidden">
              <Cpu className="w-3.5 h-3.5 text-yellow-300" />
            </div>
          </div>
        );
      case "dsa":
        return (
          <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#6b21a8] to-[#3b0764] border-2 border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)] flex flex-col items-center justify-center relative overflow-hidden">
              <Code2 className="w-3.5 h-3.5 text-purple-300" />
            </div>
          </div>
        );
      case "html":
        return (
          <div className="px-1.5 h-4 rounded-sm bg-[#16a34a] flex items-center justify-center text-[9px] font-mono font-black text-white leading-none shadow-sm border border-emerald-300/40">
            &lt;/&gt;
          </div>
        );
      case "java":
        return (
          <div className="px-1.5 h-4 rounded-sm bg-[#dc2626] flex items-center justify-center text-[9px] font-mono font-black text-white leading-none shadow-sm border border-rose-300/40">
            ☕
          </div>
        );
      case "cpp":
        return (
          <div className="px-1.5 h-4 rounded-sm bg-[#2563eb] flex items-center justify-center text-[9px] font-mono font-black text-white leading-none shadow-sm border border-blue-300/40">
            C++
          </div>
        );
      default:
        return (
          <div className="px-1.5 h-4 rounded-sm bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-[9px] font-mono font-black text-white leading-none shadow-sm border border-white/40">
            {(shortName || code || "AI").slice(0, 5).toUpperCase()}
          </div>
        );
    }
  };

  return (
    <header
      className={`w-full ${themeStyles.bg} backdrop-blur-2xl ${themeStyles.border} px-3 py-2.5 z-40 relative select-none transition-all duration-300 overflow-hidden`}
      style={{
        boxShadow: isStoreActive
          ? "none"
          : `0 4px 18px rgba(0,0,0,0.6), inset 0 0 12px ${themeStyles.glow}, inset 0 -1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      {/* Top subtle sheen highlight */}
      <div className={`absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r ${themeStyles.topHighlight} pointer-events-none`} />

      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-2 sm:px-4 lg:px-6 relative z-10">
        {/* Left Side: Back button + Course Selector Dropdown Button + Desktop Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Back to Student Dashboard Button */}
          {onBackToApp && (
            <motion.button
              onClick={onBackToApp}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-md border border-white/20 cursor-pointer shrink-0"
              title="Back to Student Dashboard"
              id="status-bar-back-button"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </motion.button>
          )}

          {/* 1. Course Selector Dropdown Button */}
          <div className="relative">
            <motion.button
              onClick={onToggleCourseDropdown}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer group shadow-md relative overflow-hidden ${
                isCourseDropdownOpen
                  ? themeStyles.dropdownButtonActive
                  : themeStyles.dropdownButton
              }`}
              title="Switch Course (Dropdown)"
              id="course-dropdown-trigger"
            >
              {/* Gloss shine */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-2xl" />

              {/* Flag / Course Glyph Box */}
              <div className="flex items-center justify-center">
                {renderCourseVisual(currentCourseCode, currentCourseShortName)}
              </div>

              <span className="text-sm font-bold font-sans text-white tracking-tight">
                {currentLevel}
              </span>
              <span className="hidden sm:inline-block max-w-[140px] truncate text-xs font-bold text-slate-200">
                {currentCourseShortName || currentCourseName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
            </motion.button>

            {/* Upward Notch/Triangle pointing to the button when open */}
            {isCourseDropdownOpen && (
              <div className="absolute -bottom-2.5 left-4 z-50 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-black" />
            )}
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Visible on md and above) */}
        {onSelectNavTab && (
          <nav aria-label="Desktop primary navigation" className="hidden md:flex items-center gap-1 lg:gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10 shadow-inner">
            {[
              { id: "home", label: "Learn", icon: Home },
              { id: "quests", label: "Quests", icon: Gift },
              { id: "leaderboard", label: "Leagues", icon: Trophy },
              { id: "store", label: "Store", icon: ShoppingBag },
              { id: "avatar", label: "Profile", icon: Bot },
              { id: "more", label: "Settings", icon: Settings },
            ].map((tabItem) => {
              const isSelected = activeNavTab === tabItem.id;
              const IconComponent = tabItem.icon;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => onSelectNavTab(tabItem.id as BottomNavTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? "bg-white/15 text-white shadow-sm border border-white/20 font-black"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  id={`desktop-nav-${tabItem.id}`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isSelected ? "text-amber-300" : "text-slate-400"}`} />
                  <span>{tabItem.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Side: Capsule HUD Stats Pills matching HTML & Screenshot */}
        <div className="bar flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Gem Capsule Pill (id="pg") */}
          <motion.button
            onClick={onOpenDiamonds}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="pill g flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#1D6BFF] bg-[#111418] text-[#4FA3FF] font-bold text-xs sm:text-sm font-kanit shadow-[0_0_12px_rgba(29,107,255,0.3)] transition-all cursor-pointer"
            title={`Diamonds / Gems: ${diamondsCount.toLocaleString()}`}
            id="pg"
          >
            <StoreIcon id="gem" size={20} />
            <span>{diamondsCount.toLocaleString()}</span>
          </motion.button>

          {/* Heart / Energy Lives Capsule Pill (id="ph") */}
          <motion.button
            onClick={onOpenPlays}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="pill flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border-2 border-[rgba(215,226,234,0.35)] bg-[#111418] text-[#D7E2EA] font-bold text-xs sm:text-sm font-kanit transition-all cursor-pointer"
            title={`Energy Lives: ${playsCount}/5`}
            id="ph"
          >
            <StoreIcon id="heart" size={20} />
            <span>{playsCount}/5</span>
          </motion.button>

          {/* XP Capsule Pill (id="px") */}
          <motion.button
            onClick={onOpenTrophies || onOpenStreak}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="pill flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border-2 border-[rgba(215,226,234,0.35)] bg-[#111418] text-[#D7E2EA] font-bold text-xs sm:text-sm font-kanit transition-all cursor-pointer"
            title={`Course Trophies: ${trophiesCount.toLocaleString()}`}
            id="px"
          >
            <StoreIcon id="xp" size={20} />
            <span>{trophiesCount.toLocaleString()}</span>
          </motion.button>

          {/* Shield / Streak Capsule Pill (id="ps") */}
          <motion.button
            onClick={onOpenStreak}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="pill flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border-2 border-[rgba(215,226,234,0.35)] bg-[#111418] text-[#D7E2EA] font-bold text-xs sm:text-sm font-kanit transition-all cursor-pointer"
            title={`Daily Streak: ${streakDays} Days`}
            id="ps"
          >
            <StoreIcon id="shield_streak" size={20} />
            <span>{streakDays}</span>
          </motion.button>

          {/* Daily Spin Wheel Capsule Pill */}
          {onOpenSpinWheel && (
            <motion.button
              onClick={onOpenSpinWheel}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="pill flex items-center justify-center gap-1 px-2.5 py-1 rounded-full border-2 border-[rgba(215,226,234,0.35)] bg-[#111418] text-[#FFE27A] font-bold text-xs sm:text-sm font-kanit transition-all cursor-pointer"
              title="Daily Luck Wheel"
              id="pw"
            >
              <StoreIcon id="wheel" size={20} />
              <span className="hidden sm:inline">Spin</span>
            </motion.button>
          )}
        </div>

      </div>
    </header>
  );
};
