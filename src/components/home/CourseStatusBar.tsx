import React from "react";
import { motion } from "motion/react";
import { StoreIcon } from "./StoreIcons";
import { BottomNavTab } from "./BottomNavBar";

interface CourseStatusBarProps {
  currentCourseName?: string;
  currentCourseCode?: string;
  currentCourseShortName?: string;
  currentLevel?: number;
  streakDays?: number;
  trophiesCount?: number;
  diamondsCount?: number;
  playsCount?: number;
  xpCount?: number;
  themeColor?: string;
  isStoreActive?: boolean;
  isCourseDropdownOpen?: boolean;
  onToggleCourseDropdown?: () => void;
  onOpenStreak?: () => void;
  onOpenTrophies?: () => void;
  onOpenPlays?: () => void;
  onOpenDiamonds?: () => void;
  onOpenXp?: () => void;
  onBackToApp?: () => void;
  activeNavTab?: BottomNavTab;
  onSelectNavTab?: (tab: BottomNavTab) => void;
  onOpenSpinWheel?: () => void;
  courses?: any[];
  selectedCourseId?: string;
  onSelectCourse?: (courseId: string) => void;
}

export const CourseStatusBar: React.FC<CourseStatusBarProps> = ({
  trophiesCount = 0,
  diamondsCount = 0,
  playsCount = 0,
  xpCount = 0,
  themeColor = "blue",
  isStoreActive = false,
  onOpenTrophies,
  onOpenPlays,
  onOpenDiamonds,
  onOpenXp,
}) => {
// Theme configurations with dynamic background, glowing border, outer shadow, and radial glow
const THEME_CONFIG: Record<
  string,
  {
    bg: string;
    border: string;
    shadow: string;
    radial: string;
  }
> = {
  magenta: {
    bg: "bg-gradient-to-b from-[#2e0926] via-[#1a0518] to-[#0c020b]",
    border: "border-b border-[rgba(244,63,94,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(236,72,153,0.35)",
    radial: "rgba(244,63,142,0.28)",
  },
  pink: {
    bg: "bg-gradient-to-b from-[#2e0926] via-[#1a0518] to-[#0c020b]",
    border: "border-b border-[rgba(244,63,94,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(236,72,153,0.35)",
    radial: "rgba(244,63,142,0.28)",
  },
  cyan: {
    bg: "bg-gradient-to-b from-[#041d2d] via-[#02131e] to-[#01090f]",
    border: "border-b border-[rgba(6,182,212,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(6,182,212,0.35)",
    radial: "rgba(6,182,212,0.28)",
  },
  blue: {
    bg: "bg-gradient-to-b from-[#0a1b3f] to-[#050c1c]",
    border: "border-b border-[rgba(79,163,255,0.4)]",
    shadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 30px rgba(0,87,231,0.3)",
    radial: "rgba(79,163,255,0.22)",
  },
  purple: {
    bg: "bg-gradient-to-b from-[#1c0d3a] to-[#0c051a]",
    border: "border-b border-[rgba(168,85,247,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(168,85,247,0.35)",
    radial: "rgba(168,85,247,0.28)",
  },
  green: {
    bg: "bg-gradient-to-b from-[#092b1f] to-[#030e0b]",
    border: "border-b border-[rgba(52,211,153,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(16,185,129,0.35)",
    radial: "rgba(52,211,153,0.28)",
  },
  emerald: {
    bg: "bg-gradient-to-b from-[#092b1f] to-[#030e0b]",
    border: "border-b border-[rgba(52,211,153,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(16,185,129,0.35)",
    radial: "rgba(52,211,153,0.28)",
  },
  red: {
    bg: "bg-gradient-to-b from-[#2b0c12] to-[#0e0406]",
    border: "border-b border-[rgba(244,63,94,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(225,29,72,0.35)",
    radial: "rgba(244,63,94,0.28)",
  },
  yellow: {
    bg: "bg-gradient-to-b from-[#241a05] to-[#080501]",
    border: "border-b border-[rgba(251,191,36,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(245,158,11,0.35)",
    radial: "rgba(251,191,36,0.28)",
  },
  amber: {
    bg: "bg-gradient-to-b from-[#241a05] to-[#080501]",
    border: "border-b border-[rgba(251,191,36,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(245,158,11,0.35)",
    radial: "rgba(251,191,36,0.28)",
  },
  gold: {
    bg: "bg-gradient-to-b from-[#241a05] to-[#080501]",
    border: "border-b border-[rgba(251,191,36,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(245,158,11,0.35)",
    radial: "rgba(251,191,36,0.28)",
  },
  bronze: {
    bg: "bg-gradient-to-b from-[#231409] to-[#0a0502]",
    border: "border-b border-[rgba(205,127,50,0.5)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(205,127,50,0.35)",
    radial: "rgba(205,127,50,0.28)",
  },
  silver: {
    bg: "bg-gradient-to-b from-[#181a20] to-[#050608]",
    border: "border-b border-[rgba(203,213,225,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(148,163,184,0.3)",
    radial: "rgba(226,232,240,0.24)",
  },
  "light-blue": {
    bg: "bg-gradient-to-b from-[#061b30] to-[#01060b]",
    border: "border-b border-[rgba(56,189,248,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(14,165,233,0.35)",
    radial: "rgba(56,189,248,0.28)",
  },
  copper: {
    bg: "bg-gradient-to-b from-[#261006] to-[#0a0301]",
    border: "border-b border-[rgba(249,115,22,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(234,88,12,0.35)",
    radial: "rgba(249,115,22,0.28)",
  },
  orange: {
    bg: "bg-gradient-to-b from-[#261006] to-[#0a0301]",
    border: "border-b border-[rgba(249,115,22,0.45)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 30px rgba(234,88,12,0.35)",
    radial: "rgba(249,115,22,0.28)",
  },
  black: {
    bg: "bg-gradient-to-b from-[#141417] to-[#040405]",
    border: "border-b border-[rgba(100,116,139,0.4)]",
    shadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 25px rgba(51,65,85,0.25)",
    radial: "rgba(148,163,184,0.18)",
  },
  white: {
    bg: "bg-gradient-to-b from-[#1a1a1f] to-[#0a0a0d]",
    border: "border-b border-[rgba(255,255,255,0.3)]",
    shadow: "0 1px 0 rgba(255,255,255,0.1) inset, 0 8px 25px rgba(255,255,255,0.18)",
    radial: "rgba(255,255,255,0.18)",
  },
};

  const currentTheme = THEME_CONFIG[themeColor as string] || THEME_CONFIG.blue;

  return (
    <header
      className={`tb sticky top-0 z-30 flex gap-2 items-center w-full px-2.5 py-1.5 ${currentTheme.bg} ${currentTheme.border} select-none transition-all duration-300 overflow-hidden`}
      style={{
        paddingTop: "calc(6px + env(safe-area-inset-top, 0px))",
        paddingBottom: "6px",
        boxShadow: currentTheme.shadow,
      }}
      id="tb"
    >
      {/* Radial ellipse glow overlay matching current theme */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(ellipse at 50% 0, ${currentTheme.radial}, transparent 70%)`,
        }}
      />

      {/* Trophies Pill (.st.tr) */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenTrophies}
        className="st tr flex-1 min-w-0 flex items-center justify-center gap-1 h-[50px] rounded-full border-2 border-[color-mix(in_srgb,#FFC62E_40%,transparent)] bg-[radial-gradient(circle_at_50%_0,color-mix(in_srgb,#FFC62E_28%,transparent),transparent_75%)] bg-[#0a1226] shadow-[0_0_18px_rgba(255,198,46,0.3),inset_0_-6px_12px_rgba(0,0,0,.35)] font-bold text-[clamp(.75rem,3.2vw,1rem)] text-[#D7E2EA] cursor-pointer px-2 z-10"
        style={{ "--g": "#FFC62E" } as any}
        title={`Trophies: ${trophiesCount.toLocaleString()}`}
        id="tp"
      >
        <i className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
          <StoreIcon id="trophy" size={22} />
        </i>
        <span className="font-kanit font-bold tracking-tighter whitespace-nowrap">{trophiesCount.toLocaleString()}</span>
      </motion.button>

      {/* Gems / Diamonds Pill (.st.gm) */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenDiamonds}
        className="st gm flex-1 min-w-0 flex items-center justify-center gap-1 h-[50px] rounded-full border-2 border-[color-mix(in_srgb,#4FA3FF_40%,transparent)] bg-[radial-gradient(circle_at_50%_0,color-mix(in_srgb,#4FA3FF_28%,transparent),transparent_75%)] bg-[#0a1226] shadow-[0_0_18px_rgba(79,163,255,0.3),inset_0_-6px_12px_rgba(0,0,0,.35)] font-bold text-[clamp(.75rem,3.2vw,1rem)] text-[#D7E2EA] cursor-pointer px-2 z-10"
        style={{ "--g": "#4FA3FF" } as any}
        title={`Gems: ${diamondsCount.toLocaleString()}`}
        id="pg"
      >
        <i className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
          <StoreIcon id="gem" size={22} />
        </i>
        <span className="font-kanit font-bold tracking-tighter whitespace-nowrap">{diamondsCount.toLocaleString()}</span>
      </motion.button>

      {/* Lives / Heart Pill (.st.hr) */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenPlays}
        className="st hr flex-1 min-w-0 flex items-center justify-center gap-1 h-[50px] rounded-full border-2 border-[color-mix(in_srgb,#FF4B5C_40%,transparent)] bg-[radial-gradient(circle_at_50%_0,color-mix(in_srgb,#FF4B5C_28%,transparent),transparent_75%)] bg-[#0a1226] shadow-[0_0_18px_rgba(255,75,92,0.3),inset_0_-6px_12px_rgba(0,0,0,.35)] font-bold text-[clamp(.75rem,3.2vw,1rem)] text-[#D7E2EA] cursor-pointer px-2 z-10"
        style={{ "--g": "#FF4B5C" } as any}
        title={`Lives: ${playsCount}/5`}
        id="ph"
      >
        <i className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
          <StoreIcon id="heart" size={22} />
        </i>
        <span className="font-kanit font-bold tracking-tighter whitespace-nowrap">{playsCount}/5</span>
      </motion.button>

      {/* XP Pill (.st.xp) */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenXp}
        className="st xp flex-1 min-w-0 flex items-center justify-center gap-1 h-[50px] rounded-full border-2 border-[color-mix(in_srgb,#2f7bff_40%,transparent)] bg-[radial-gradient(circle_at_50%_0,color-mix(in_srgb,#2f7bff_28%,transparent),transparent_75%)] bg-[#0a1226] shadow-[0_0_18px_rgba(47,123,255,0.3),inset_0_-6px_12px_rgba(0,0,0,.35)] font-bold text-[clamp(.75rem,3.2vw,1rem)] text-[#D7E2EA] cursor-pointer px-2 z-10"
        style={{ "--g": "#2f7bff" } as any}
        title={`XP: ${xpCount.toLocaleString()}`}
        id="px"
      >
        <i className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
          <StoreIcon id="xp" size={22} />
        </i>
        <span className="font-kanit font-bold tracking-tighter whitespace-nowrap">{xpCount.toLocaleString()}</span>
      </motion.button>
    </header>
  );
};
