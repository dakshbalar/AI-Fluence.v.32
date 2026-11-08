import React from "react";
import {
  Home,
  Gift,
  Trophy,
  ShoppingBag,
  Bot,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "motion/react";

export type BottomNavTab =
  | "home"
  | "quests"
  | "leaderboard"
  | "store"
  | "avatar"
  | "more"
  | "curriculum";

interface BottomNavBarProps {
  activeTab: BottomNavTab;
  onSelectTab: (tab: BottomNavTab) => void;
  themeColor?: string;
  isNoGlowActive?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  themeColor = "purple",
  isNoGlowActive,
}) => {
  const noGlow =
    isNoGlowActive !== undefined
      ? isNoGlowActive
      : activeTab === "store" || activeTab === "quests";

  // Theme-reactive visual tokens (background gradient, border, glow, highlight, active button)
  const themeStyles = noGlow
    ? {
        bg: "bg-[#09090b]",
        border: "border-t border-white/10",
        glow: "transparent",
        topHighlight: "from-transparent via-white/10 to-transparent",
        activePill: "bg-white/[0.12] border border-white/30 text-white shadow-none scale-105",
        activeGlow: "from-transparent to-transparent",
        inactiveHover: "hover:bg-white/5",
      }
    : {
    purple: {
      bg: "bg-[#140a2a]/95 bg-gradient-to-t from-[#1c0d3a]/95 via-[#130826]/95 to-[#0c051a]/95",
      border: "border-t border-purple-500/20",
      glow: "rgba(168, 85, 247, 0.18)",
      topHighlight: "from-transparent via-purple-300/20 to-transparent",
      activePill: "bg-purple-500/25 border border-purple-400/60 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)] scale-105",
      activeGlow: "from-purple-400/20 to-transparent",
      inactiveHover: "hover:bg-purple-500/10",
    },
    green: {
      bg: "bg-[#061812]/95 bg-gradient-to-t from-[#092b1f]/95 via-[#061812]/95 to-[#030e0b]/95",
      border: "border-t border-emerald-500/20",
      glow: "rgba(34, 197, 94, 0.18)",
      topHighlight: "from-transparent via-emerald-300/20 to-transparent",
      activePill: "bg-emerald-500/25 border border-emerald-400/60 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)] scale-105",
      activeGlow: "from-emerald-400/20 to-transparent",
      inactiveHover: "hover:bg-emerald-500/10",
    },
    red: {
      bg: "bg-[#18080b]/95 bg-gradient-to-t from-[#2b0c12]/95 via-[#18080b]/95 to-[#0e0406]/95",
      border: "border-t border-rose-500/20",
      glow: "rgba(239, 68, 68, 0.18)",
      topHighlight: "from-transparent via-rose-300/20 to-transparent",
      activePill: "bg-rose-500/25 border border-rose-400/60 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)] scale-105",
      activeGlow: "from-rose-400/20 to-transparent",
      inactiveHover: "hover:bg-rose-500/10",
    },
    blue: {
      bg: "bg-[#071328]/95 bg-gradient-to-t from-[#0e274e]/95 via-[#071328]/95 to-[#030e0b]/95",
      border: "border-t border-sky-500/20",
      glow: "rgba(59, 130, 246, 0.18)",
      topHighlight: "from-transparent via-sky-300/20 to-transparent",
      activePill: "bg-sky-500/25 border border-sky-400/60 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)] scale-105",
      activeGlow: "from-sky-400/20 to-transparent",
      inactiveHover: "hover:bg-sky-500/10",
    },
    cyan: {
      bg: "bg-[#04141d]/95 bg-gradient-to-t from-[#072738]/95 via-[#04141d]/95 to-[#020b10]/95",
      border: "border-t border-cyan-500/20",
      glow: "rgba(6, 182, 212, 0.18)",
      topHighlight: "from-transparent via-cyan-300/20 to-transparent",
      activePill: "bg-cyan-500/25 border border-cyan-400/60 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)] scale-105",
      activeGlow: "from-cyan-400/20 to-transparent",
      inactiveHover: "hover:bg-cyan-500/10",
    },
    yellow: {
      bg: "bg-[#140e03]/95 bg-gradient-to-t from-[#261904]/95 via-[#140e03]/95 to-[#080501]/95",
      border: "border-t border-amber-500/30",
      glow: "rgba(234, 179, 8, 0.25)",
      topHighlight: "from-transparent via-yellow-400/25 to-transparent",
      activePill: "bg-yellow-500/30 border border-yellow-400/70 text-yellow-100 shadow-[0_0_12px_rgba(234,179,8,0.4)] scale-105",
      activeGlow: "from-yellow-400/30 to-transparent",
      inactiveHover: "hover:bg-yellow-500/15",
    },
    white: {
      bg: "bg-black/95 bg-gradient-to-t from-[#141414]/95 via-black/95 to-black/95",
      border: "border-t border-white/15",
      glow: "rgba(255, 255, 255, 0.10)",
      topHighlight: "from-transparent via-white/20 to-transparent",
      activePill: "bg-white/20 border border-white/60 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)] scale-105",
      activeGlow: "from-white/20 to-transparent",
      inactiveHover: "hover:bg-white/10",
    },
    bronze: {
      bg: "bg-[#0c0805]/95 bg-gradient-to-t from-[#1b1008]/95 via-[#0d0905]/95 to-[#050302]/95",
      border: "border-t border-[#cd7f32]/35",
      glow: "rgba(205, 127, 50, 0.35)",
      topHighlight: "from-transparent via-[#cd7f32]/35 to-transparent",
      activePill: "bg-[#cd7f32]/25 border border-[#cd7f32]/60 text-amber-200 shadow-[0_0_12px_rgba(205,127,50,0.38)] scale-105",
      activeGlow: "from-[#cd7f32]/25 to-transparent",
      inactiveHover: "hover:bg-[#cd7f32]/10",
    },
    "light-blue": {
      bg: "bg-[#030d17]/95 bg-gradient-to-t from-[#061b30]/95 via-[#03101c]/95 to-[#01060b]/95",
      border: "border-t border-sky-400/35",
      glow: "rgba(56, 189, 248, 0.35)",
      topHighlight: "from-transparent via-sky-300/35 to-transparent",
      activePill: "bg-sky-500/25 border border-sky-400/60 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.38)] scale-105",
      activeGlow: "from-sky-400/25 to-transparent",
      inactiveHover: "hover:bg-sky-500/10",
    },
    gold: {
      bg: "bg-[#140e03]/95 bg-gradient-to-t from-[#241a05]/95 via-[#140e03]/95 to-[#080501]/95",
      border: "border-t border-amber-400/35",
      glow: "rgba(245, 158, 11, 0.35)",
      topHighlight: "from-transparent via-amber-300/35 to-transparent",
      activePill: "bg-amber-500/25 border border-amber-400/60 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.38)] scale-105",
      activeGlow: "from-amber-400/25 to-transparent",
      inactiveHover: "hover:bg-amber-500/10",
    },
    silver: {
      bg: "bg-[#0c0d10]/95 bg-gradient-to-t from-[#181a20]/95 via-[#0c0d10]/95 to-[#050608]/95",
      border: "border-t border-slate-400/35",
      glow: "rgba(203, 213, 225, 0.30)",
      topHighlight: "from-transparent via-slate-300/35 to-transparent",
      activePill: "bg-slate-400/25 border border-slate-300/60 text-slate-200 shadow-[0_0_12px_rgba(203,213,225,0.35)] scale-105",
      activeGlow: "from-slate-300/20 to-transparent",
      inactiveHover: "hover:bg-slate-400/10",
    },
    black: {
      bg: "bg-[#090a0f]/95 bg-gradient-to-t from-[#14161f]/95 via-[#090a0f]/95 to-[#040507]/95",
      border: "border-t border-slate-500/40",
      glow: "rgba(148, 163, 184, 0.28)",
      topHighlight: "from-transparent via-slate-400/35 to-transparent",
      activePill: "bg-slate-700/40 border border-slate-400/60 text-slate-100 shadow-[0_0_12px_rgba(148,163,184,0.35)] scale-105",
      activeGlow: "from-slate-400/20 to-transparent",
      inactiveHover: "hover:bg-slate-700/20",
    },
    orange: {
      bg: "bg-[#140802]/95 bg-gradient-to-t from-[#260f04]/95 via-[#140802]/95 to-[#080301]/95",
      border: "border-t border-orange-500/40",
      glow: "rgba(234, 88, 12, 0.38)",
      topHighlight: "from-transparent via-orange-400/40 to-transparent",
      activePill: "bg-orange-500/25 border border-orange-400/65 text-orange-200 shadow-[0_0_12px_rgba(234,88,12,0.45)] scale-105",
      activeGlow: "from-orange-400/25 to-transparent",
      inactiveHover: "hover:bg-orange-500/10",
    },
    copper: {
      bg: "bg-[#140802]/95 bg-gradient-to-t from-[#260f04]/95 via-[#140802]/95 to-[#080301]/95",
      border: "border-t border-orange-500/40",
      glow: "rgba(234, 88, 12, 0.38)",
      topHighlight: "from-transparent via-orange-400/40 to-transparent",
      activePill: "bg-orange-500/25 border border-orange-400/65 text-orange-200 shadow-[0_0_12px_rgba(234,88,12,0.45)] scale-105",
      activeGlow: "from-orange-400/25 to-transparent",
      inactiveHover: "hover:bg-orange-500/10",
    },
  }[themeColor as string] || {
    bg: "bg-[#140a2a]/95 bg-gradient-to-t from-[#1c0d3a]/95 via-[#130826]/95 to-[#0c051a]/95",
    border: "border-t border-purple-500/20",
    glow: "rgba(168, 85, 247, 0.18)",
    topHighlight: "from-transparent via-purple-300/20 to-transparent",
    activePill: "bg-purple-500/25 border border-purple-400/60 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)] scale-105",
    activeGlow: "from-purple-400/20 to-transparent",
    inactiveHover: "hover:bg-purple-500/10",
  };

  const navItems: {
    id: BottomNavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    hasBadge?: boolean;
    color?: string;
  }[] = [
    { id: "home", label: "Home", icon: Home, color: "text-[#ffd233]" },
    { id: "quests", label: "Quests", icon: Gift, hasBadge: true, color: "text-[#ff9600]" },
    { id: "leaderboard", label: "Ranks", icon: Trophy, color: "text-[#ce82ff]" },
    { id: "store", label: "Store", icon: ShoppingBag, color: "text-[#fbbf24]" },
    { id: "avatar", label: "Lumi", icon: Bot, color: "text-[#1cb0f6]" },
    { id: "more", label: "More", icon: MoreHorizontal, hasBadge: true, color: "text-[#afafaf]" },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden ${themeStyles.bg} backdrop-blur-2xl ${themeStyles.border} px-2 py-2.5 safe-area-bottom select-none transition-all duration-300 overflow-hidden`}
      style={{
        boxShadow: isNoGlowActive
          ? "0 -4px 14px rgba(0,0,0,0.8)"
          : `0 -6px 20px rgba(0,0,0,0.7), inset 0 0 12px ${themeStyles.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      {/* Top subtle sheen highlight */}
      <div className={`absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r ${themeStyles.topHighlight} pointer-events-none`} />

      <div className="max-w-md mx-auto flex items-center justify-around relative z-10">
        {navItems.map((item) => {
          const isSelected = activeTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl transition-all cursor-pointer relative focus:outline-none overflow-hidden ${
                isSelected
                  ? themeStyles.activePill
                  : `text-slate-400 hover:text-white ${themeStyles.inactiveHover}`
              }`}
              id={`bottom-nav-${item.id}`}
              title={item.label}
            >
              {isSelected && (
                <div className={`absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b ${themeStyles.activeGlow} pointer-events-none rounded-t-2xl`} />
              )}

              {/* Icon container */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                    isSelected ? `scale-110 ${item.color || "text-[#ffd233]"}` : "text-slate-400"
                  }`}
                />

                {/* Red dot badge with glow */}
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ff4b4b] border-2 border-black shadow-[0_0_8px_#ff4b4b]" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
