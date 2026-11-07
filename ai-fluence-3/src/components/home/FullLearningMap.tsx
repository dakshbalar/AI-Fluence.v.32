import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  Lock,
  Play,
  Crown,
  Gift,
  X,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
  Bot,
  Target,
  Check,
  CalendarCheck,
} from "lucide-react";
import { CourseSection, CourseLevel, CourseTheme } from "../../data/coursesData";
import { CornerStarsAndSmokeBackground } from "../onboarding-animations/shared/CornerStarsAndSmokeBackground";
import {
  AvatarSkinUnlock,
  AVATAR_SKIN_UNLOCKS,
  getStoredActiveBundleId,
  persistActiveBundleId,
  isAvatarSkinUnlocked,
} from "../../data/avatarSkinsData";
import { AvatarPlatformMascot } from "./AvatarPlatformMascot";
import { ChestPlatformReward } from "./ChestPlatformReward";
import { PixelChestGraphic } from "./PixelChestGraphic";
import { StonePlatformReward, StoneDuration } from "./StonePlatformReward";
import { XpPlatformReward } from "./XpPlatformReward";
import { DiamondsPlatformReward } from "./DiamondsPlatformReward";
import { AvatarSkinsModal } from "./AvatarSkinsModal";
import { AidenDailyGoalsSlide } from "./AidenDailyGoalsSlide";
import {
  loadStoredDailyActivity,
  loadStoredStudentProfile,
  loadStoredCommitment,
} from "../../utils/engagementStore";

interface FullLearningMapProps {
  courseId: string;
  courseTitle: string;
  themeColor?: CourseTheme | "emerald" | "cyan" | "amber";
  sections?: CourseSection[];
  activeSectionNumber?: number;
  onSelectSection?: (sectionNumber: number) => void;
  onLaunchLesson: (levelId: number, courseId: string) => void;
  onOpenChestReward?: () => void;
  onClaimXp?: (amount: number) => void;
  onClaimDiamonds?: (amount: number) => void;
  onActivateUnlimitedLives?: (hours: number) => void;
  unitBanner?: React.ReactNode;
}

export const FullLearningMap: React.FC<FullLearningMapProps> = ({
  courseId,
  courseTitle,
  themeColor = "purple",
  sections = [],
  activeSectionNumber = 1,
  onSelectSection,
  onLaunchLesson,
  onOpenChestReward,
  onClaimXp,
  onClaimDiamonds,
  onActivateUnlimitedLives,
  unitBanner,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | null>(null);
  const [activeBundleId, setActiveBundleId] = useState<string>(() => getStoredActiveBundleId());
  const [isSkinsModalOpen, setIsSkinsModalOpen] = useState<boolean>(false);
  const [isDailyGoalsOpen, setIsDailyGoalsOpen] = useState<boolean>(false);

  // Normalize active section
  const currentSection: CourseSection = useMemo(() => {
    if (!sections || sections.length === 0) {
      return {
        sectionNumber: 1,
        sectionTitle: "Section 1",
        unitNumber: 1,
        unitTitle: "Core Foundations",
        unitDescription: "Fundamental concepts and interactive coding levels.",
        theme: themeColor as CourseTheme,
        levels: [],
      };
    }
    return (
      sections.find((s) => s.sectionNumber === activeSectionNumber) ||
      sections[0]
    );
  }, [sections, activeSectionNumber, themeColor]);

  const completedLevelsCount = useMemo(() => {
    return (currentSection.levels || []).filter((l) => l.status === "completed").length;
  }, [currentSection.levels]);

  const totalLevelsCount = useMemo(() => {
    return (currentSection.levels || []).length;
  }, [currentSection.levels]);

  const isMascotUnlocked = useMemo(() => {
    return totalLevelsCount > 0 && completedLevelsCount >= totalLevelsCount;
  }, [totalLevelsCount, completedLevelsCount]);

  const activeSkinUnlock = useMemo(() => {
    return (
      AVATAR_SKIN_UNLOCKS.find((u) => u.bundleId === activeBundleId) ||
      AVATAR_SKIN_UNLOCKS[0]
    );
  }, [activeBundleId]);

  const availableSkinsCount = useMemo(() => {
    return AVATAR_SKIN_UNLOCKS.filter((u) =>
      isAvatarSkinUnlocked(u, completedLevelsCount, currentSection.sectionNumber)
    ).length;
  }, [completedLevelsCount, currentSection.sectionNumber]);

  // Today's tasks completion status
  const dailyTasksState = useMemo(() => {
    try {
      const profile = loadStoredStudentProfile();
      const commitment = loadStoredCommitment();
      const act = loadStoredDailyActivity(profile, commitment);
      if (act?.missions && act.missions.length > 0) {
        const done = act.missions.filter((m) => m.completed).length;
        const total = act.missions.length;
        return { done, total, pct: Math.round((done / total) * 100) };
      }
    } catch (e) {
      // fallback
    }
    return { done: 2, total: 4, pct: 50 };
  }, [isDailyGoalsOpen]);

  // Pattern of X percentages matching Duolingo / Academy winding Candy Crush zigzag roadmap
  // Left curve around node 1-2 provides prime open space on the right (74%) for the 3D isometric mascot platform!
  const X_PATTERN = [50, 32, 24, 46, 72, 78, 54, 34];

  // Colors adapted to course theme for SVG road and level buttons
  const themeColors = useMemo(() => {
    switch (themeColor) {
      case "green":
      case "emerald":
        return {
          glow: "rgba(34, 197, 94, 0.35)",
          base: "rgba(74, 222, 128, 0.4)",
          dots: "rgba(52, 211, 153, 0.9)",
          active: "#22c55e",
          pingHex: "rgba(34, 197, 94, 0.8)",
          accentBg: "from-emerald-400 via-green-500 to-teal-600",
          shadowColor: "#14532d",
          titleHover: "group-hover:text-emerald-300",
          activeLevelButton:
            "border-[3.5px] border-emerald-100 bg-gradient-to-b from-[#4ade80] via-[#16a34a] to-[#14532d] text-white shadow-[0_8px_0_#052e16,0_12px_24px_rgba(22,163,74,0.6)] animate-pixel-bounce",
          textColor: "text-white",
        };
      case "red":
        return {
          glow: "rgba(239, 68, 68, 0.35)",
          base: "rgba(248, 113, 113, 0.4)",
          dots: "rgba(251, 113, 133, 0.9)",
          active: "#ef4444",
          pingHex: "rgba(239, 68, 68, 0.8)",
          accentBg: "from-rose-400 via-red-500 to-rose-700",
          shadowColor: "#7f1d1d",
          titleHover: "group-hover:text-rose-300",
          activeLevelButton:
            "border-[3.5px] border-rose-100 bg-gradient-to-b from-[#fb7185] via-[#e11d48] to-[#9f1239] text-white shadow-[0_8px_0_#4c0519,0_12px_24px_rgba(225,29,72,0.6)] animate-pixel-bounce",
          textColor: "text-white",
        };
      case "yellow":
      case "amber":
        return {
          glow: "rgba(234, 179, 8, 0.45)",
          base: "rgba(250, 204, 21, 0.45)",
          dots: "rgba(253, 224, 71, 0.95)",
          active: "#eab308",
          pingHex: "rgba(234, 179, 8, 0.9)",
          accentBg: "from-amber-400 via-yellow-500 to-amber-600",
          shadowColor: "#854d0e",
          titleHover: "group-hover:text-amber-300",
          activeLevelButton:
            "border-[3.5px] border-amber-100 bg-gradient-to-b from-[#fde047] via-[#eab308] to-[#ca8a04] text-slate-950 shadow-[0_8px_0_#713f12,0_12px_24px_rgba(234,179,8,0.6)] animate-pixel-bounce",
          textColor: "text-slate-950",
        };
      case "purple":
        return {
          glow: "rgba(168, 85, 247, 0.35)",
          base: "rgba(192, 132, 252, 0.4)",
          dots: "rgba(236, 72, 153, 0.9)",
          active: "#a855f7",
          pingHex: "rgba(168, 85, 247, 0.8)",
          accentBg: "from-purple-500 via-fuchsia-500 to-indigo-600",
          shadowColor: "#4c1d95",
          titleHover: "group-hover:text-fuchsia-300",
          activeLevelButton:
            "border-[3.5px] border-fuchsia-200 bg-gradient-to-b from-[#c084fc] via-[#9333ea] to-[#581c87] text-white shadow-[0_8px_0_#3b0764,0_12px_24px_rgba(147,51,234,0.6)] animate-pixel-bounce",
          textColor: "text-white",
        };
      case "blue":
      case "cyan":
      default:
        return {
          glow: "rgba(59, 130, 246, 0.35)",
          base: "rgba(96, 165, 250, 0.4)",
          dots: "rgba(56, 189, 248, 0.9)",
          active: "#3b82f6",
          pingHex: "rgba(59, 130, 246, 0.8)",
          accentBg: "from-sky-400 via-blue-500 to-indigo-700",
          shadowColor: "#1e3a8a",
          titleHover: "group-hover:text-cyan-300",
          activeLevelButton:
            "border-[3.5px] border-cyan-100 bg-gradient-to-b from-[#38bdf8] via-[#2563eb] to-[#1d4ed8] text-white shadow-[0_8px_0_#1e3a8a,0_12px_24px_rgba(37,99,235,0.6)] animate-pixel-bounce",
          textColor: "text-white",
        };
    }
  }, [themeColor]);

  // Layout level nodes with consistent, generous spacing (VERTICAL_STEP = 200) to eliminate any box or tooltip overlap
  const layout = useMemo(() => {
    const levels = currentSection.levels || [];
    let currentY = 125;
    const placedLevels: { level: CourseLevel; x: number; y: number }[] = [];
    const VERTICAL_STEP = 200;

    levels.forEach((level, idx) => {
      const x = X_PATTERN[idx % X_PATTERN.length];
      placedLevels.push({ level, x, y: currentY });
      currentY += VERTICAL_STEP;
    });

    // Generous bottom height ensures theme background and smoke extend completely to bottom behind nav bar
    const roadHeight = currentY + 185;
    const bannerHeight = unitBanner ? 95 : 0;
    const totalHeight = roadHeight + bannerHeight;
    return { placedLevels, roadHeight, totalHeight };
  }, [currentSection.levels, unitBanner]);

  // Smooth cubic bezier path connecting all levels
  const pathD = useMemo(() => {
    if (layout.placedLevels.length === 0) return "";
    const pts = layout.placedLevels.map((p) => ({ x: p.x, y: p.y }));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const midY = (prev.y + curr.y) / 2;
      d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [layout.placedLevels]);

  // Progress path connecting cleared levels
  const progressD = useMemo(() => {
    let lastCompletedIdx = -1;
    layout.placedLevels.forEach((p, i) => {
      if (p.level.status === "completed") lastCompletedIdx = i;
    });
    if (lastCompletedIdx < 0) return "";
    const pts = layout.placedLevels
      .slice(0, lastCompletedIdx + 1)
      .map((p) => ({ x: p.x, y: p.y }));
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const midY = (prev.y + curr.y) / 2;
      d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [layout.placedLevels]);

  const nextSection = sections.find(
    (s) => s.sectionNumber === currentSection.sectionNumber + 1
  );

  // Section-based level numbering: each module / section displays its own star_number (1..N)
  const getEffectiveLevelNumber = (lvl: CourseLevel) => {
    return lvl.levelNumber;
  };

  // Dynamic section rewards mapping following user sequence:
  // chests, xps, stone(1h/3h/6h/24h), xps, diamonds, and skin as the last reward!
  type PlatformRewardType = "chest" | "xp" | "stone" | "diamonds" | "skin";
  interface PlatformRewardConfig {
    type: PlatformRewardType;
    threshold: number;
    xpAmount?: number;
    stoneDuration?: StoneDuration;
    diamondsAmount?: number;
  }
  interface SectionRewardsConfig {
    upper: PlatformRewardConfig;
    lower: PlatformRewardConfig;
  }

  const sectionRewards: SectionRewardsConfig = useMemo(() => {
    const secNum = currentSection.sectionNumber || 1;
    const totalSecs = sections.length || 6;
    const isFinalSection = secNum === totalSecs || secNum === 6;

    if (isFinalSection) {
      return {
        upper: { type: "chest", threshold: 3 },
        lower: { type: "skin", threshold: 5 },
      };
    }

    switch (secNum) {
      case 1:
        return {
          upper: { type: "chest", threshold: 3 },
          lower: { type: "xp", xpAmount: 200, threshold: 5 },
        };
      case 2:
        return {
          upper: { type: "stone", stoneDuration: "1h", threshold: 3 },
          lower: { type: "xp", xpAmount: 350, threshold: 5 },
        };
      case 3:
        return {
          upper: { type: "chest", threshold: 3 },
          lower: { type: "stone", stoneDuration: "3h", threshold: 5 },
        };
      case 4:
        return {
          upper: { type: "diamonds", diamondsAmount: 50, threshold: 3 },
          lower: { type: "stone", stoneDuration: "6h", threshold: 5 },
        };
      case 5:
        return {
          upper: { type: "diamonds", diamondsAmount: 100, threshold: 3 },
          lower: { type: "stone", stoneDuration: "24h", threshold: 5 },
        };
      default:
        const cycle = (secNum - 1) % 5;
        if (cycle === 0) return { upper: { type: "chest", threshold: 3 }, lower: { type: "xp", xpAmount: 250, threshold: 5 } };
        if (cycle === 1) return { upper: { type: "stone", stoneDuration: "1h", threshold: 3 }, lower: { type: "xp", xpAmount: 350, threshold: 5 } };
        if (cycle === 2) return { upper: { type: "chest", threshold: 3 }, lower: { type: "stone", stoneDuration: "3h", threshold: 5 } };
        if (cycle === 3) return { upper: { type: "diamonds", diamondsAmount: 50, threshold: 3 }, lower: { type: "stone", stoneDuration: "6h", threshold: 5 } };
        return { upper: { type: "diamonds", diamondsAmount: 100, threshold: 3 }, lower: { type: "stone", stoneDuration: "24h", threshold: 5 } };
    }
  }, [currentSection.sectionNumber, sections.length]);

  return (
    <div
      className="relative w-full overflow-hidden select-none bg-black flex flex-col items-center"
      style={{ minHeight: `${layout.totalHeight}px` }}
    >
      {/* 1. SLIDE BG WITH BORDER GLOW AND CORNER STARS (Master reference) */}
      <CornerStarsAndSmokeBackground
        theme={
          themeColor === "purple"
            ? "purple"
            : themeColor === "green"
            ? "green"
            : themeColor === "red"
            ? "red"
            : themeColor === "yellow" || themeColor === "amber"
            ? "yellow"
            : "blue"
        }
        topStarsClassName={unitBanner ? "top-36" : "top-4"}
        bottomStarsClassName="bottom-24"
      />

      {/* 2. SECTION & UNIT BANNER (Framed by continuous theme slide background) */}
      {unitBanner && (
        <div className="w-full relative z-20">
          {unitBanner}
        </div>
      )}

      {/* 3. ROADMAP CONTAINER */}
      <div
        className="relative w-full flex flex-col items-center"
        style={{ height: `${layout.roadHeight}px` }}
      >
        {/* SVG ROAD (Connecting Path from DSA Academy template) */}
        <svg
          className="absolute inset-0 w-full pointer-events-none"
          style={{ zIndex: 2, height: `${layout.roadHeight}px` }}
          viewBox={`0 0 100 ${layout.roadHeight}`}
          preserveAspectRatio="none"
        >
        <defs>
          <filter id="academy-theme-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="academy-active-pulse" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer path glow */}
        <path
          d={pathD}
          stroke={themeColors.glow}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          filter="url(#academy-theme-glow)"
        />

        {/* Base path line */}
        <path
          d={pathD}
          stroke={themeColors.base}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Animated flow dots */}
        <path
          d={pathD}
          stroke={themeColors.dots}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="4, 10"
          style={{ animation: "dash-flow 2s linear infinite" }}
        />

        {/* Cleared progress path */}
        {progressD && (
          <path
            d={progressD}
            stroke={themeColors.active}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            filter="url(#academy-active-pulse)"
          />
        )}
        {progressD && (
          <path
            d={progressD}
            stroke="#38bdf8"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="3, 6"
            style={{ animation: "dash-flow 1.5s linear infinite" }}
          />
        )}
      </svg>

      {/* LEVEL NODES (Exact Academy Candy Crush 3D Node Template) */}
      <div
        className="relative w-full"
        style={{ height: `${layout.roadHeight}px`, zIndex: 10 }}
      >
        {/* =========================================================================
            UPPER OPEN BEND PLATFORM REWARD (TOP RIGHT BEND AT ~76%, ~295px)
            Positioned opposite levels 2-3 (which curve left) with zero path overlap
            ========================================================================= */}
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: "76%",
            top: `${layout.placedLevels.length >= 3 ? Math.round((layout.placedLevels[1].y + layout.placedLevels[2].y) / 2) : 295}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {sectionRewards.upper.type === "chest" && (
            <ChestPlatformReward
              themeColor={themeColor}
              completedLevelsCount={completedLevelsCount}
              unlockLevelThreshold={sectionRewards.upper.threshold}
              sectionNumber={currentSection.sectionNumber}
              onOpenChestReward={onOpenChestReward}
            />
          )}
          {sectionRewards.upper.type === "stone" && (
            <StonePlatformReward
              themeColor={themeColor}
              completedLevelsCount={completedLevelsCount}
              unlockLevelThreshold={sectionRewards.upper.threshold}
              sectionNumber={currentSection.sectionNumber}
              duration={sectionRewards.upper.stoneDuration || "1h"}
              onActivateUnlimitedLives={onActivateUnlimitedLives}
            />
          )}
          {sectionRewards.upper.type === "diamonds" && (
            <DiamondsPlatformReward
              themeColor={themeColor}
              completedLevelsCount={completedLevelsCount}
              unlockLevelThreshold={sectionRewards.upper.threshold}
              sectionNumber={currentSection.sectionNumber}
              diamondsAmount={sectionRewards.upper.diamondsAmount || 50}
              onClaimDiamonds={onClaimDiamonds}
            />
          )}
          {sectionRewards.upper.type === "xp" && (
            <XpPlatformReward
              themeColor={themeColor}
              completedLevelsCount={completedLevelsCount}
              unlockLevelThreshold={sectionRewards.upper.threshold}
              sectionNumber={currentSection.sectionNumber}
              xpAmount={sectionRewards.upper.xpAmount || 200}
              onClaimXp={onClaimXp}
            />
          )}
        </div>

        {/* =========================================================================
            LOWER OPEN BEND PLATFORM REWARD (LEFT BEND AT ~22%, BETWEEN LEVELS 3 & 4)
            Positioned opposite the right-curving levels 4-5 with zero path or badge overlap
            ========================================================================= */}
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: "22%",
            top: `${
              layout.placedLevels.length >= 5
                ? Math.round((layout.placedLevels[3].y + layout.placedLevels[4].y) / 2)
                : layout.placedLevels.length >= 4
                ? Math.round((layout.placedLevels[2].y + layout.placedLevels[3].y) / 2)
                : 548
            }px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {sectionRewards.lower.type === "skin" && (
            <AvatarPlatformMascot
              skinUnlock={activeSkinUnlock}
              themeColor={themeColor}
              completedLevelsCount={completedLevelsCount}
              totalLevelsCount={sectionRewards.lower.threshold}
              isLocked={completedLevelsCount < sectionRewards.lower.threshold}
              onOpenSkinsModal={() => setIsSkinsModalOpen(true)}
            />
          )}
          {sectionRewards.lower.type === "xp" && (
            <XpPlatformReward
              themeColor={themeColor}
              completedLevelsCount={completedLevelsCount}
              unlockLevelThreshold={sectionRewards.lower.threshold}
              sectionNumber={currentSection.sectionNumber}
              xpAmount={sectionRewards.lower.xpAmount || 200}
              onClaimXp={onClaimXp}
            />
          )}
          {sectionRewards.lower.type === "stone" && (
            <StonePlatformReward
              themeColor={themeColor}
              completedLevelsCount={completedLevelsCount}
              unlockLevelThreshold={sectionRewards.lower.threshold}
              sectionNumber={currentSection.sectionNumber}
              duration={sectionRewards.lower.stoneDuration || "3h"}
              onActivateUnlimitedLives={onActivateUnlimitedLives}
            />
          )}
          {sectionRewards.lower.type === "diamonds" && (
            <DiamondsPlatformReward
              themeColor={themeColor}
              completedLevelsCount={completedLevelsCount}
              unlockLevelThreshold={sectionRewards.lower.threshold}
              sectionNumber={currentSection.sectionNumber}
              diamondsAmount={sectionRewards.lower.diamondsAmount || 100}
              onClaimDiamonds={onClaimDiamonds}
            />
          )}
          {sectionRewards.lower.type === "chest" && (
            <ChestPlatformReward
              themeColor={themeColor}
              completedLevelsCount={completedLevelsCount}
              unlockLevelThreshold={sectionRewards.lower.threshold}
              sectionNumber={currentSection.sectionNumber}
              onOpenChestReward={onOpenChestReward}
            />
          )}
        </div>

        {layout.placedLevels.map((p) => {
          const lvl = p.level;
          const status = lvl.status; // "completed" | "current" | "locked"
          const locked = status === "locked";
          const isCurrent = status === "current";
          const isBoss = lvl.type === "rosette" || lvl.levelNumber % 5 === 0;
          const isChest = lvl.type === "chest";
          const starsVal = lvl.stars || (status === "completed" ? 3 : 0);
          const size = isBoss
            ? "h-22 w-22 sm:h-24 sm:w-24 rounded-[30px]"
            : "h-18 w-18 sm:h-20 sm:w-20 rounded-[26px]";

          // Academy 3D button accent classes
          let accentClass =
            "border-[3.5px] border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 text-slate-500 shadow-[0_6px_0_#0f172a]";

          if (isCurrent) {
            accentClass = themeColors.activeLevelButton;
          } else if (status === "completed") {
            // Golden level head on completion as requested by user
            accentClass =
              starsVal >= 3
                ? "border-[3.5px] border-amber-200 bg-gradient-to-b from-[#ffe066] via-[#f59e0b] to-[#b45309] text-slate-950 shadow-[0_8px_0_#78350f,0_12px_24px_rgba(245,158,11,0.6)] animate-pixel-sparkle glow-yellow ring-2 ring-amber-300/60"
                : starsVal === 2
                ? "border-[3.5px] border-amber-300 bg-gradient-to-b from-[#fcd34d] via-[#d97706] to-[#92400e] text-slate-950 shadow-[0_8px_0_#78350f,0_10px_20px_rgba(217,119,6,0.5)] glow-yellow"
                : "border-[3.5px] border-amber-400/80 bg-gradient-to-b from-[#fbbf24] via-[#b45309] to-[#78350f] text-slate-950 shadow-[0_8px_0_#451a03,0_10px_20px_rgba(180,83,9,0.4)]";
          }

          return (
            <motion.div
              key={lvl.id}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}px`,
                x: "-50%",
                y: "-50%",
              }}
              initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
              animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
              whileHover={{ scale: 1.08, zIndex: 30 }}
              transition={{
                scale: { type: "spring", stiffness: 220, damping: 15 },
                opacity: { duration: 0.3 },
              }}
            >
              <div
                onClick={() => {
                  if (isChest) {
                    if (onOpenChestReward) onOpenChestReward();
                  } else {
                    setSelectedLevel(lvl);
                  }
                }}
                className={`relative flex flex-col items-center group select-none ${
                  locked ? "cursor-pointer opacity-75 hover:opacity-100" : "cursor-pointer"
                }`}
              >
                {/* Available level pulsing halo aura & floating START badge */}
                {isCurrent && (
                  <>
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-25 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${themeColors.pingHex} 0%, transparent 70%)`,
                        width: "160%",
                        height: "160%",
                        margin: "-30%",
                      }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#facc15] border-2 border-black px-2.5 py-0.5 rounded-md flex items-center gap-1.5 z-30 shadow-[2px_2px_0_#000000] whitespace-nowrap">
                      <Play size={9} className="fill-black text-black" />
                      <span className="font-pixel text-[9px] font-black text-black tracking-wider">
                        START
                      </span>
                    </div>
                  </>
                )}

                {/* 3D Candy Crush tactile button */}
                <div
                  className={`relative grid place-items-center font-pixel font-bold transition-all duration-200 active:translate-y-1 active:shadow-none ${size} ${accentClass}`}
                >
                  {/* Shiny top gloss reflection */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[22px] bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

                  {locked ? (
                    <Lock size={18} className="text-slate-400 drop-shadow" />
                  ) : isBoss ? (
                    <Crown
                      size={26}
                      className="text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-pulse"
                    />
                  ) : isChest ? (
                    <div className="flex items-center justify-center -mt-1">
                      <PixelChestGraphic
                        status={status === "completed" ? "open" : "closed"}
                        size={32}
                      />
                    </div>
                  ) : (
                    <span
                      className={`text-2xl sm:text-3xl font-pixel font-black select-none pixel-text-shadow leading-none ${
                        status === "completed"
                          ? "text-slate-950 font-black"
                          : isCurrent
                          ? themeColors.textColor
                          : "text-white"
                      }`}
                    >
                      {getEffectiveLevelNumber(lvl)}
                    </span>
                  )}
                </div>

                {/* Star rating (exact academy 3-star container reflecting earned stars) */}
                {!isChest && (
                  <div className="mt-2 flex items-center gap-1 bg-[#0a1128]/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-amber-400/30 shadow-md">
                    {[1, 2, 3].map((s) => {
                      const active = (status === "completed" || starsVal > 0) && starsVal >= s;
                      return (
                        <Star
                          key={s}
                          size={12}
                          className={`transition-transform duration-300 ${
                            active
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_1px_4px_rgba(245,158,11,0.95)] scale-110"
                              : "fill-transparent text-slate-600 stroke-[1.5]"
                          }`}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Concise level title badge */}
                <div className={`mt-1.5 max-w-[130px] sm:max-w-[155px] text-center bg-[#060b19]/95 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 text-[9px] font-pixel text-white ${themeColors.titleHover} transition-colors shadow-xl truncate tracking-wide`}>
                  {lvl.title}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* 4. SECTION COMPLETION & NEXT SECTION MILESTONE BUTTON */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 w-[90%] max-w-xs text-center"
          style={{ top: `${layout.roadHeight - 115}px` }}
        >
          {nextSection && onSelectSection ? (
            <button
              onClick={() => onSelectSection(nextSection.sectionNumber)}
              className={`w-full py-3.5 px-4 rounded-2xl font-sans font-black text-xs uppercase tracking-wider text-white border-2 border-white/20 shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 bg-gradient-to-r ${themeColors.accentBg}`}
              style={{
                boxShadow: `0 8px 25px ${themeColors.glow}, 0 4px 0 ${themeColors.shadowColor}`,
              }}
            >
              <span>PROCEED TO SECTION {nextSection.sectionNumber}</span>
              <ChevronRight className="w-4 h-4 animate-pulse" />
            </button>
          ) : (
            <div className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-400/40 text-yellow-200 text-xs font-sans font-bold flex items-center justify-center gap-2 shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
              <span>COURSE SECTION COMPLETED!</span>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* =========================================================================
          LEVEL PREVIEW / LAUNCH MODAL (Interactive Launch Popover)
          ========================================================================= */}
      <AnimatePresence>
        {selectedLevel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-sm bg-[#0d121d] border-2 border-white/20 rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-white relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedLevel(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {selectedLevel.status === "locked" ? (
                <>
                  {/* LOCKED LEVEL MODAL STATE */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-400/40 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-rose-400" />
                      LEVEL {getEffectiveLevelNumber(selectedLevel)} • LOCKED
                    </span>
                  </div>

                  <div className="w-16 h-16 mx-auto my-3 rounded-2xl bg-rose-950/40 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
                    <Lock className="w-8 h-8 text-rose-400 animate-pulse" />
                  </div>

                  <h3 className="text-lg font-black text-center text-white mb-1">
                    {selectedLevel.title}
                  </h3>
                  <p className="text-xs text-rose-200/80 text-center mb-4 leading-relaxed">
                    This level is locked. You must earn at least 2 Stars (★★) in Level {Math.max(1, getEffectiveLevelNumber(selectedLevel) - 1)} to unlock this challenge!
                  </p>

                  {/* Requirement Box */}
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-rose-500/30 mb-5 flex items-center justify-between text-xs font-mono">
                    <div className="text-slate-400 font-sans">Requirement:</div>
                    <div className="text-amber-400 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>2+ Stars in Level {Math.max(1, getEffectiveLevelNumber(selectedLevel) - 1)}</span>
                    </div>
                  </div>

                  {/* Disabled locked button */}
                  <button
                    disabled
                    className="w-full py-3.5 rounded-2xl font-sans font-black text-xs uppercase tracking-wider text-slate-400 bg-slate-800/80 border border-slate-700/60 shadow-none cursor-not-allowed flex items-center justify-center gap-2 select-none"
                  >
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>LOCKED (EARN 2★ IN PREVIOUS LEVEL)</span>
                  </button>
                </>
              ) : (
                <>
                  {/* UNLOCKED / ACTIVE LEVEL MODAL STATE */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/30">
                      LEVEL {getEffectiveLevelNumber(selectedLevel)}
                    </span>
                    {selectedLevel.status === "completed" && (
                      <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                        <CheckCircle2 className="w-3 h-3" />
                        CLEARED ({selectedLevel.stars || 3}★)
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black leading-tight text-white mb-1">
                    {selectedLevel.title}
                  </h3>
                  <p className="text-xs text-slate-300 mb-4">
                    {selectedLevel.subtitle || "Master this interactive level with hands-on coding challenges."}
                  </p>

                  {/* Rewards Box */}
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 flex items-center justify-around mb-5">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-yellow-300">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span>+{selectedLevel.xpReward || 20} XP</span>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300">
                      <Flame className="w-4 h-4 text-cyan-400" />
                      <span>Streak +1</span>
                    </div>
                  </div>

                  {/* Launch / Start Button */}
                  <button
                    onClick={() => {
                      const id = selectedLevel.id;
                      setSelectedLevel(null);
                      onLaunchLesson(id, courseId);
                    }}
                    className={`w-full py-3.5 rounded-2xl font-sans font-black text-sm uppercase tracking-wider text-white border-2 border-white/20 shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 bg-gradient-to-r ${themeColors.accentBg}`}
                    style={{
                      boxShadow: `0 6px 0 ${themeColors.shadowColor}`,
                    }}
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{selectedLevel.status === "completed" ? "REPLAY CHALLENGE" : "START CHALLENGE"}</span>
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}

        {/* =========================================================================
            AVATAR SKINS & BUNDLES WARDROBE MODAL
            ========================================================================= */}
        {isSkinsModalOpen && (
          <AvatarSkinsModal
            isOpen={isSkinsModalOpen}
            onClose={() => setIsSkinsModalOpen(false)}
            activeBundleId={activeBundleId}
            onSelectUnlock={(unlock) => {
              setActiveBundleId(unlock.bundleId);
              persistActiveBundleId(unlock.bundleId);
            }}
            completedLevelsCount={completedLevelsCount}
            currentSectionNumber={currentSection.sectionNumber}
            themeColor={themeColor}
          />
        )}

        {/* =========================================================================
            AIDEN TODAY'S GOALS ANIMATION SLIDE
            ========================================================================= */}
        {isDailyGoalsOpen && (
          <AidenDailyGoalsSlide
            isOpen={isDailyGoalsOpen}
            onClose={() => setIsDailyGoalsOpen(false)}
            onOpenSkinsModal={() => {
              setIsDailyGoalsOpen(false);
              setIsSkinsModalOpen(true);
            }}
            onStartTask={(task) => {
              setIsDailyGoalsOpen(false);
              const firstLevel = currentSection.levels?.[0];
              if (firstLevel) {
                onLaunchLesson(firstLevel.id, courseId);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* FLOATING TODAY'S TASKS BUTTON (Positioned in the right bottom corner as requested) */}
      <div className="fixed bottom-24 right-3 sm:right-5 z-40 pointer-events-auto select-none">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDailyGoalsOpen(true)}
          className="relative px-3 py-2 rounded-2xl border-2 border-sky-300 bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 text-white shadow-[0_4px_0_#1e3a8a,0_0_15px_rgba(56,189,248,0.3)] active:translate-y-1 active:shadow-none flex items-center gap-2 transition-all cursor-pointer overflow-hidden group"
          title="Today's Tasks & Goals"
        >
          {/* Top gloss reflection matching level buttons */}
          <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

          <span className="text-base leading-none drop-shadow-sm">🎯</span>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-sans font-black text-sky-200 tracking-wider uppercase leading-tight">
              TASKS
            </span>
            <span className="text-[11px] font-sans font-black text-white leading-none whitespace-nowrap">
              {dailyTasksState.done}/{dailyTasksState.total} DONE
            </span>
          </div>
        </motion.button>
      </div>
    </div>
  );
};
