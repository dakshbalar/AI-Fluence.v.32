import React from "react";
import { ChevronDown, Home, Gift, Trophy, ShoppingBag, Bot, Settings, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { BottomNavTab } from "./BottomNavBar";
import {
  GemSvg,
  HeartSvg,
  ShieldStreakSvg,
  TrophySvg,
  WheelSvg,
} from "./StoreIcons";

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
  // Course Visual representation in the capsule
  const renderCourseVisual = (code: string, shortName?: string) => {
    const clean = (code || "").toLowerCase();
    switch (clean) {
      case "generative_ai":
      case "genai":
        return <span className="text-sm">✨</span>;
      case "ai_for_everyone":
      case "ai_101":
        return <span className="text-sm">🤖</span>;
      case "dsa":
        return <span className="text-sm">⚡</span>;
      case "html":
        return <span className="text-xs font-mono font-bold text-emerald-400">&lt;/&gt;</span>;
      case "java":
        return <span className="text-sm">☕</span>;
      case "cpp":
        return <span className="text-xs font-mono font-bold text-blue-400">C++</span>;
      default:
        return <span className="text-xs font-mono font-bold text-blue-300">{(shortName || code || "AI").slice(0, 3).toUpperCase()}</span>;
    }
  };

  return (
    <header className="w-full bg-[#0C0C0C]/95 backdrop-blur-xl border-b border-[rgba(215,226,234,0.18)] px-2.5 sm:px-4 py-2 z-40 relative select-none font-['Kanit',sans-serif]">
      <style>{`
        .i { display: inline-block; flex: none; vertical-align: middle; }
        .i svg, svg { width: 100% !important; height: 100% !important; display: block; }
      `}</style>
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left Side: Back button + Course Selector Capsule */}
        <div className="flex items-center gap-2 shrink-0">
          {onBackToApp && (
            <motion.button
              onClick={onBackToApp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#111418] border-2 border-[rgba(215,226,234,0.35)] hover:border-[#1D6BFF] text-[#D7E2EA] hover:text-white transition-colors cursor-pointer"
              title="Back to Dashboard"
              id="status-bar-back-button"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </motion.button>
          )}

          {/* Course Selector Capsule Button */}
          <div className="relative">
            <motion.button
              onClick={onToggleCourseDropdown}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 transition-all cursor-pointer bg-[#111418] ${
                isCourseDropdownOpen
                  ? "border-[#1D6BFF] text-[#4FA3FF] shadow-[0_0_12px_rgba(29,107,255,0.35)]"
                  : "border-[rgba(215,226,234,0.35)] text-[#D7E2EA] hover:border-[#1D6BFF]"
              }`}
              title="Switch Course"
              id="course-dropdown-trigger"
            >
              <div className="flex items-center justify-center">
                {renderCourseVisual(currentCourseCode, currentCourseShortName)}
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Lvl {currentLevel}
              </span>
              <span className="hidden sm:inline-block max-w-[120px] truncate text-xs font-semibold text-slate-300">
                {currentCourseShortName || currentCourseName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isCourseDropdownOpen ? "rotate-180 text-[#4FA3FF]" : ""
                }`}
              />
            </motion.button>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs in Capsule Switch Container */}
        {onSelectNavTab && (
          <nav
            aria-label="Desktop primary navigation"
            className="hidden md:flex items-center gap-1 p-1 rounded-full border-2 border-[rgba(215,226,234,0.35)] bg-[#111418]"
          >
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
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "text-white bg-[linear-gradient(123deg,#010B1F_7%,#0057E7_37%,#1D6BFF_72%,#4FA3FF_100%)] shadow-[inset_4px_4px_12px_#2170F1]"
                      : "text-[rgba(215,226,234,0.7)] hover:text-white hover:bg-white/5"
                  }`}
                  id={`desktop-nav-${tabItem.id}`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{tabItem.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Side: Capsule Badges for Diamonds, Lives, Trophies, Streak, and Spin */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 1. Diamonds Capsule Pill (.pill.g style with electric glow) */}
          <motion.button
            onClick={onOpenDiamonds}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border-2 border-[#1D6BFF] bg-[#111418] text-[#4FA3FF] font-bold text-xs sm:text-sm cursor-pointer shadow-[0_0_10px_rgba(29,107,255,0.25)] hover:brightness-110 transition-all"
            title={`Diamonds: ${diamondsCount.toLocaleString()}`}
            id="pg"
          >
            <GemSvg size={18} />
            <span className="font-mono tracking-tight font-bold">{diamondsCount}</span>
          </motion.button>

          {/* 2. Lives / Energy Capsule Pill */}
          <motion.button
            onClick={onOpenPlays}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border-2 border-[rgba(215,226,234,0.35)] bg-[#111418] text-[#D7E2EA] font-bold text-xs sm:text-sm hover:border-[#1D6BFF] cursor-pointer transition-all"
            title={`Energy Lives: ${playsCount}/5`}
            id="ph"
          >
            <HeartSvg size={18} />
            <span className="font-mono tracking-tight font-bold">{playsCount}/5</span>
          </motion.button>

          {/* 3. Trophies Capsule Pill */}
          <motion.button
            onClick={onOpenTrophies}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="hidden xs:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border-2 border-[rgba(215,226,234,0.35)] bg-[#111418] text-[#D7E2EA] font-bold text-xs sm:text-sm hover:border-[#1D6BFF] cursor-pointer transition-all"
            title={`Trophies: ${trophiesCount.toLocaleString()}`}
            id="px"
          >
            <TrophySvg size={18} />
            <span className="font-mono tracking-tight font-bold text-amber-300">
              {trophiesCount.toLocaleString()}
            </span>
          </motion.button>

          {/* 4. Streak Shield Capsule Pill */}
          {streakDays > 0 && (
            <motion.button
              onClick={onOpenStreak}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border-2 border-[rgba(215,226,234,0.35)] bg-[#111418] text-[#D7E2EA] font-bold text-xs sm:text-sm hover:border-[#1D6BFF] cursor-pointer transition-all"
              title={`Streak: ${streakDays} Day${streakDays > 1 ? "s" : ""}`}
              id="ps"
            >
              <ShieldStreakSvg size={18} />
              <span className="font-mono tracking-tight font-bold">{streakDays}</span>
            </motion.button>
          )}

          {/* 5. Daily Spin Wheel Capsule Pill */}
          {onOpenSpinWheel && (
            <motion.button
              onClick={onOpenSpinWheel}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border-2 border-[rgba(215,226,234,0.35)] bg-[#111418] text-[#D7E2EA] font-bold text-xs sm:text-sm hover:border-[#1D6BFF] hover:text-[#4FA3FF] cursor-pointer transition-all"
              title="Spin the Daily Wheel"
              id="status-bar-spin-wheel"
            >
              <WheelSvg size={18} />
              <span className="uppercase text-[11px] sm:text-xs tracking-wider">Spin</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
};
