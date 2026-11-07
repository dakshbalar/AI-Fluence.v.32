import React from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

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
          <div className="px-1.5 h-4 rounded-sm bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-[9px] font-mono font-black text-white leading-none shadow-sm border border-cyan-300/50">
            {shortName || "GenAI"}
          </div>
        );
      case "prompt_engineering":
      case "prompts":
        return (
          <div className="px-1.5 h-4 rounded-sm bg-gradient-to-r from-cyan-600 to-teal-600 flex items-center justify-center text-[9px] font-mono font-black text-white leading-none shadow-sm border border-cyan-300/60">
            {shortName || "Prompts"}
          </div>
        );
      case "dsa":
        return (
          <div className="px-1.5 h-4 rounded-sm bg-[#9333ea] flex items-center justify-center text-[9px] font-mono font-black text-white leading-none shadow-sm border border-purple-300/40">
            DSA
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

      <div className="max-w-md mx-auto flex items-center justify-between gap-1.5 sm:gap-2 relative z-10">
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
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
          </motion.button>

          {/* Upward Notch/Triangle pointing to the button when open */}
          {isCourseDropdownOpen && (
            <div className="absolute -bottom-2.5 left-4 z-50 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-black" />
          )}
        </div>

        {/* 2. Clash of Clans Style Trophies Badge (3D Golden Trophy & Plinth) */}
        <motion.button
          onClick={onOpenTrophies || onOpenStreak}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#2b1f07] via-[#1c1303] to-[#0d0901] border-t border-l border-amber-400/60 border-b-2 border-r-2 border-black/90 hover:brightness-110 transition-all cursor-pointer group shadow-[0_3px_8px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,215,0,0.3)] relative overflow-hidden"
          title={`Trophies: ${trophiesCount.toLocaleString()}`}
          id="status-bar-trophies"
          data-id="status-bar-streak"
        >
          {/* Beveled Top Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-300/50 to-transparent pointer-events-none" />
          
          {/* 3D CoC Golden Trophy Crest */}
          <div className="relative w-4 h-5 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-4.5 sm:h-4.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] filter">
              {/* Handles */}
              <path
                d="M4 6 C2 6 1 8 1 11 C1 14 3 16 6 16 L6 14 C4 14 3 13 3 11 C3 9 4 8 5 8 Z"
                fill="url(#trophyGoldHandles)"
              />
              <path
                d="M20 6 C22 6 23 8 23 11 C23 14 21 16 18 16 L18 14 C20 14 21 13 21 11 C21 9 20 8 19 8 Z"
                fill="url(#trophyGoldHandles)"
              />
              {/* Cup Body */}
              <path
                d="M5 4 L19 4 L17.5 13 C16.5 16.5 13.5 18 12 18 C10.5 18 7.5 16.5 6.5 13 Z"
                fill="url(#trophyGoldBody)"
              />
              {/* Inner Cup Depth */}
              <ellipse cx="12" cy="4.5" rx="6.5" ry="1.5" fill="#78350f" opacity="0.6" />
              {/* Cup Rim Highlight */}
              <path d="M5 4 C7 5 17 5 19 4" stroke="#fef08a" strokeWidth="1" fill="none" />
              {/* Specular Front Highlight Glint */}
              <path
                d="M8 7 L9.5 14 C10.2 15.5 11 16 11.5 16 L10 7 Z"
                fill="#ffffff"
                opacity="0.45"
              />
              {/* Stem */}
              <path d="M10.5 17.5 L13.5 17.5 L13 20 L11 20 Z" fill="url(#trophyGoldStem)" />
              {/* Base Plinth */}
              <polygon points="7,23 17,23 16,20 8,20" fill="url(#trophyGoldBase)" />
              <rect x="8" y="21" width="8" height="1.5" fill="#fef08a" opacity="0.75" />
              <defs>
                <linearGradient id="trophyGoldBody" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <linearGradient id="trophyGoldHandles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <linearGradient id="trophyGoldStem" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="50%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <linearGradient id="trophyGoldBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="30%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <span className="text-sm font-black font-mono text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-tight">
            {trophiesCount.toLocaleString()}
          </span>
        </motion.button>

        {/* 3. Clash of Clans Style Gem Stone (3D Cut Faceted Gemstone) */}
        <motion.button
          onClick={onOpenDiamonds}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#061e24] via-[#041419] to-[#020b0e] border-t border-l border-cyan-400/50 border-b-2 border-r-2 border-black/90 hover:brightness-110 transition-all cursor-pointer group shadow-[0_3px_8px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(100,230,255,0.25)] relative overflow-hidden"
          title="Stones & Diamonds (Clash Style)"
          id="status-bar-diamonds"
        >
          {/* Beveled Top Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />

          {/* 3D CoC Cut Gemstone */}
          <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {/* Backing Depth */}
              <polygon points="6,2 18,2 23,9 12,22 1,9" fill="#063545" />
              {/* Upper Left Facet */}
              <polygon points="6,2 1,9 7,9" fill="#0891b2" />
              {/* Upper Right Facet */}
              <polygon points="18,2 23,9 17,9" fill="#0e7490" />
              {/* Center Upper Table */}
              <polygon points="6,2 18,2 17,9 7,9" fill="#38bdf8" />
              {/* Lower Center Facet */}
              <polygon points="7,9 17,9 12,22" fill="#06b6d4" />
              {/* Lower Left Facet */}
              <polygon points="1,9 7,9 12,22" fill="#0284c7" />
              {/* Lower Right Facet */}
              <polygon points="23,9 17,9 12,22" fill="#0369a1" />
              {/* Top Specular Glint Highlight */}
              <polygon points="8,3 12,3 10,7" fill="#ffffff" opacity="0.75" />
              <circle cx="9" cy="4" r="1" fill="#ffffff" />
            </svg>
          </div>

          <span className="text-sm font-black font-sans text-cyan-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-tight">
            {diamondsCount}
          </span>
        </motion.button>

        {/* 4. Clash of Clans Style XP & Energy (3D Star Shield / Elixir Core) */}
        <motion.button
          onClick={onOpenPlays}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#240812] via-[#16040a] to-[#0d0206] border-t border-l border-rose-500/50 border-b-2 border-r-2 border-black/90 hover:brightness-110 transition-all cursor-pointer group shadow-[0_3px_8px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,120,160,0.25)] relative overflow-hidden"
          title="XP Energy (Clash Style)"
          id="status-bar-plays"
        >
          {/* Beveled Top Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-300/40 to-transparent pointer-events-none" />

          {/* 3D CoC Shield / Star Rune */}
          <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {/* Shield Base */}
              <path
                d="M12 2 L21 5 V12 C21 17.5 17 21.5 12 23 C7 21.5 3 17.5 3 12 V5 Z"
                fill="url(#cocShieldGrad)"
                stroke="#fda4af"
                strokeWidth="1"
              />
              {/* Inner Inset Rim */}
              <path
                d="M12 4 L19 6.5 V12 C19 16 16 19.5 12 20.8 C8 19.5 5 16 5 12 V6.5 Z"
                fill="#881337"
              />
              {/* Center Lightning / Star Emblem */}
              <path
                d="M13 5 L8 13 H12 L11 19 L16 11 H12 Z"
                fill="#ffe4e6"
              />
              <defs>
                <linearGradient id="cocShieldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#4c0519" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <span className="text-xs font-black font-mono text-rose-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {playsCount}
          </span>
        </motion.button>
      </div>
    </header>
  );
};
