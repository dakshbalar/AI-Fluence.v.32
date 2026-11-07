import React from "react";
import { BookOpen, ChevronRight, ChevronLeft, ChevronDown, Code2 } from "lucide-react";
import { motion } from "motion/react";

export type UnitBannerTheme = "purple" | "green" | "red" | "blue" | "emerald" | "cyan" | "amber" | "yellow";

export interface SectionSummaryItem {
  sectionNumber: number;
  sectionTitle: string;
  unitNumber: number;
  unitTitle: string;
  levelCount?: number;
}

interface UnitBannerProps {
  sectionNumber: number;
  totalSections?: number;
  unitNumber: number;
  unitTitle: string;
  courseName: string;
  themeColor?: UnitBannerTheme;
  allSections?: SectionSummaryItem[];
  activeTrack?: "theory" | "questions";
  hasBothTracks?: boolean;
  activeSubjectName?: string;
  onSelectTrack?: (track: "theory" | "questions") => void;
  onSelectSection?: (sectionNumber: number) => void;
  onNextSection?: () => void;
  onPrevSection?: () => void;
  onOpenGuidebook?: () => void;
  onOpenSections?: () => void;
}

export const UnitBanner: React.FC<UnitBannerProps> = ({
  sectionNumber = 1,
  totalSections = 3,
  unitNumber = 1,
  unitTitle,
  courseName,
  themeColor = "purple",
  allSections = [],
  activeTrack = "questions",
  hasBothTracks = false,
  activeSubjectName,
  onSelectTrack,
  onSelectSection,
  onNextSection,
  onPrevSection,
  onOpenGuidebook,
  onOpenSections,
}) => {

  // Slide style gradient boxes with robust contrast and tactile 3D borders
  const colorMap: Record<string, {
    bg: string;
    border: string;
    glow: string;
    text: string;
    subText: string;
    badgeBg: string;
    btnBg: string;
    btnBorder: string;
    activeRing: string;
  }> = {
    purple: {
      bg: "bg-gradient-to-r from-[#9333ea] via-[#7e22ce] to-[#6b21a8]",
      border: "border-[#581c87]",
      glow: "shadow-[0_8px_30px_rgba(147,51,234,0.35)]",
      text: "text-white",
      subText: "text-purple-100",
      badgeBg: "bg-purple-950/60 border-purple-300/40 text-purple-200",
      btnBg: "bg-white/20 hover:bg-white/30 text-white",
      btnBorder: "border-white/30",
      activeRing: "border-purple-400 bg-purple-500/20 text-purple-300",
    },
    green: {
      bg: "bg-gradient-to-r from-[#16a34a] via-[#15803d] to-[#166534]",
      border: "border-[#14532d]",
      glow: "shadow-[0_8px_30px_rgba(22,163,74,0.35)]",
      text: "text-white",
      subText: "text-emerald-100",
      badgeBg: "bg-emerald-950/60 border-emerald-300/40 text-emerald-200",
      btnBg: "bg-white/20 hover:bg-white/30 text-white",
      btnBorder: "border-white/30",
      activeRing: "border-emerald-400 bg-emerald-500/20 text-emerald-300",
    },
    red: {
      bg: "bg-gradient-to-r from-[#dc2626] via-[#b91c1c] to-[#991b1b]",
      border: "border-[#7f1d1d]",
      glow: "shadow-[0_8px_30px_rgba(220,38,38,0.35)]",
      text: "text-white",
      subText: "text-rose-100",
      badgeBg: "bg-rose-950/60 border-rose-300/40 text-rose-200",
      btnBg: "bg-white/20 hover:bg-white/30 text-white",
      btnBorder: "border-white/30",
      activeRing: "border-rose-400 bg-rose-500/20 text-rose-300",
    },
    blue: {
      bg: "bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#1e40af]",
      border: "border-[#1e3a8a]",
      glow: "shadow-[0_8px_30px_rgba(37,99,235,0.35)]",
      text: "text-white",
      subText: "text-blue-100",
      badgeBg: "bg-blue-950/60 border-blue-300/40 text-blue-200",
      btnBg: "bg-white/20 hover:bg-white/30 text-white",
      btnBorder: "border-white/30",
      activeRing: "border-blue-400 bg-blue-500/20 text-blue-300",
    },
    emerald: {
      bg: "bg-gradient-to-r from-[#16a34a] via-[#15803d] to-[#166534]",
      border: "border-[#14532d]",
      glow: "shadow-[0_8px_30px_rgba(22,163,74,0.35)]",
      text: "text-white",
      subText: "text-emerald-100",
      badgeBg: "bg-emerald-950/60 border-emerald-300/40 text-emerald-200",
      btnBg: "bg-white/20 hover:bg-white/30 text-white",
      btnBorder: "border-white/30",
      activeRing: "border-emerald-400 bg-emerald-500/20 text-emerald-300",
    },
    cyan: {
      bg: "bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#075985]",
      border: "border-[#0c4a6e]",
      glow: "shadow-[0_8px_30px_rgba(2,132,199,0.35)]",
      text: "text-white",
      subText: "text-cyan-100",
      badgeBg: "bg-cyan-950/60 border-cyan-300/40 text-cyan-200",
      btnBg: "bg-white/20 hover:bg-white/30 text-white",
      btnBorder: "border-white/30",
      activeRing: "border-cyan-400 bg-cyan-500/20 text-cyan-300",
    },
    amber: {
      bg: "bg-gradient-to-r from-[#d97706] via-[#b45309] to-[#92400e]",
      border: "border-[#78350f]",
      glow: "shadow-[0_8px_30px_rgba(217,119,6,0.35)]",
      text: "text-white",
      subText: "text-amber-100",
      badgeBg: "bg-amber-950/60 border-amber-300/40 text-amber-200",
      btnBg: "bg-white/20 hover:bg-white/30 text-white",
      btnBorder: "border-white/30",
      activeRing: "border-amber-400 bg-amber-500/20 text-amber-300",
    },
    yellow: {
      bg: "bg-gradient-to-r from-[#eab308] via-[#ca8a04] to-[#a16207]",
      border: "border-[#854d0e]",
      glow: "shadow-[0_8px_30px_rgba(234,179,8,0.4)]",
      text: "text-slate-950 font-black",
      subText: "text-yellow-950 font-bold",
      badgeBg: "bg-yellow-950/70 border-yellow-300/50 text-yellow-200",
      btnBg: "bg-black/25 hover:bg-black/40 text-white",
      btnBorder: "border-yellow-200/50",
      activeRing: "border-yellow-400 bg-yellow-400/20 text-yellow-200",
    },
  };

  const currentTheme = colorMap[themeColor] || colorMap.purple;

  // Track button active styling dynamically matching the course's theme
  const trackThemeConfig = {
    purple: {
      activeTheory: "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-[0_3px_14px_rgba(168,85,247,0.5)] border border-purple-300/70",
      activeAcademy: "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_3px_14px_rgba(168,85,247,0.5)] border border-purple-300/70",
      iconColor: "text-purple-200",
    },
    green: {
      activeTheory: "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-[0_3px_14px_rgba(16,185,129,0.5)] border border-emerald-300/70",
      activeAcademy: "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-[0_3px_14px_rgba(16,185,129,0.5)] border border-emerald-300/70",
      iconColor: "text-emerald-200",
    },
    red: {
      activeTheory: "bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white shadow-[0_3px_14px_rgba(244,63,94,0.5)] border border-rose-300/70",
      activeAcademy: "bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white shadow-[0_3px_14px_rgba(244,63,94,0.5)] border border-rose-300/70",
      iconColor: "text-rose-200",
    },
    blue: {
      activeTheory: "bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-[0_3px_14px_rgba(59,130,246,0.5)] border border-sky-300/70",
      activeAcademy: "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-[0_3px_14px_rgba(59,130,246,0.5)] border border-sky-300/70",
      iconColor: "text-sky-200",
    },
    cyan: {
      activeTheory: "bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white shadow-[0_3px_14px_rgba(6,182,212,0.5)] border border-cyan-300/70",
      activeAcademy: "bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white shadow-[0_3px_14px_rgba(6,182,212,0.5)] border border-cyan-300/70",
      iconColor: "text-cyan-200",
    },
    white: {
      activeTheory: "bg-gradient-to-r from-zinc-200 to-white text-black shadow-[0_3px_14px_rgba(255,255,255,0.4)] border border-white",
      activeAcademy: "bg-gradient-to-r from-zinc-200 to-white text-black shadow-[0_3px_14px_rgba(255,255,255,0.4)] border border-white",
      iconColor: "text-black",
    },
    yellow: {
      activeTheory: "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-slate-950 font-black shadow-[0_3px_14px_rgba(234,179,8,0.5)] border border-yellow-200",
      activeAcademy: "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 text-slate-950 font-black shadow-[0_3px_14px_rgba(234,179,8,0.5)] border border-yellow-200",
      iconColor: "text-amber-950",
    },
  }[themeColor] || {
    activeTheory: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_3px_14px_rgba(168,85,247,0.5)] border border-purple-300/70",
    activeAcademy: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_3px_14px_rgba(168,85,247,0.5)] border border-purple-300/70",
    iconColor: "text-purple-200",
  };

  return (
    <div className="w-full px-4 pt-3 pb-2 select-none relative z-20">
      <div className="max-w-md mx-auto">
        {/* Track Switcher (Questions vs Theory) */}
        {hasBothTracks && (
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#090e1a]/95 border border-white/20 backdrop-blur-xl mb-2.5 shadow-lg">
            <button
              onClick={() => onSelectTrack?.("questions")}
              id="btn-switch-track-questions"
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden active:translate-y-0.5 ${
                activeTrack === "questions"
                  ? trackThemeConfig.activeAcademy
                  : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              {activeTrack === "questions" && (
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-t-xl" />
              )}
              <Code2 className={`w-3.5 h-3.5 relative z-10 ${activeTrack === "questions" ? trackThemeConfig.iconColor : "text-slate-400"}`} />
              <span className="relative z-10 font-sans font-black">QUESTIONS</span>
            </button>

            <button
              onClick={() => onSelectTrack?.("theory")}
              id="btn-switch-track-theory"
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden active:translate-y-0.5 ${
                activeTrack === "theory"
                  ? trackThemeConfig.activeTheory
                  : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              {activeTrack === "theory" && (
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-t-xl" />
              )}
              <BookOpen className={`w-3.5 h-3.5 relative z-10 ${activeTrack === "theory" ? trackThemeConfig.iconColor : "text-slate-400"}`} />
              <span className="relative z-10 font-sans font-black">THEORY</span>
            </button>
          </div>
        )}

        {/* Main Coloured Button / Section Header */}
        <div
          className={`${currentTheme.bg} rounded-2xl p-3.5 sm:p-4 ${currentTheme.glow} flex items-center justify-between gap-2.5 relative overflow-hidden transition-all duration-300 border-b-4 ${currentTheme.border} border-t border-l border-r border-white/20 shadow-lg`}
        >
          {/* Subtle Ambient Shimmer Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />

          {/* Left Arrow: Switch to previous section */}
          {sectionNumber > 1 && onPrevSection && (
            <motion.button
              onClick={onPrevSection}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className={`w-8 h-8 rounded-lg ${currentTheme.btnBg} ${currentTheme.btnBorder} border flex items-center justify-center transition-all cursor-pointer shrink-0 shadow relative z-10`}
              title="Previous Section"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </motion.button>
          )}

          {/* Center Text & Section Switcher trigger (opens curriculum page) */}
          <motion.button
            onClick={() => {
              if (onOpenSections) {
                onOpenSections();
              } else if (onOpenGuidebook) {
                onOpenGuidebook();
              }
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="flex-1 text-left relative z-10 cursor-pointer group flex flex-col justify-center"
            title="Click to view & change sections"
            id="unit-banner-section-btn"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={`text-[9px] sm:text-[10px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${currentTheme.badgeBg}`}
              >
                <span>
                  {activeSubjectName ? `${activeSubjectName.toUpperCase()} • ` : (hasBothTracks ? (activeTrack === "theory" ? "THEORY • " : "QUESTIONS • ") : "")}
                  SECTION {sectionNumber} OF {totalSections}
                </span>
                <ChevronDown className="w-3 h-3 opacity-70 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </div>
            <h2
              className={`text-base sm:text-lg font-black leading-tight tracking-tight ${currentTheme.text} flex items-center gap-1.5`}
            >
              <span className="truncate">{unitTitle}</span>
            </h2>
          </motion.button>

          {/* Right Arrow: Switch to next section */}
          {sectionNumber < totalSections && onNextSection && (
            <motion.button
              onClick={onNextSection}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className={`w-8 h-8 rounded-lg ${currentTheme.btnBg} ${currentTheme.btnBorder} border flex items-center justify-center transition-all cursor-pointer shrink-0 shadow relative z-10`}
              title="Next Section"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </motion.button>
          )}

          {/* Right Action Button: Guidebook */}
          {onOpenGuidebook && (
            <motion.button
              onClick={onOpenGuidebook}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className={`w-10 h-10 rounded-xl ${currentTheme.btnBg} ${currentTheme.btnBorder} border flex items-center justify-center transition-all cursor-pointer shrink-0 shadow relative z-10 ml-1`}
              title="Academy Curriculum: Topics & Grades"
              id="unit-guidebook-btn"
            >
              <BookOpen className="w-4 h-4 text-white" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
