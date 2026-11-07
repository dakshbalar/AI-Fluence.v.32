import React, { useState, useEffect } from "react";
import {
  Settings,
  MessageSquare,
  LogOut,
  Search,
  UserPlus,
  Trophy,
  Shield,
  Users,
  Send,
  Check,
  Copy,
  Plus,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  Flame,
  Award,
  Swords,
  ChevronRight,
  Palette,
  Shapes,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ClanData,
  ClanMember,
  ClanRole,
  ClanType,
  DEFAULT_CLANS,
  getStoredCurrentClan,
  saveCurrentClan,
  getStoredAllClans,
  saveAllClans,
} from "../../data/clansData";
import {
  ClanShield,
  ClanShieldColor,
  ClanShieldSymbol,
  ClanShieldShape,
  ClanShieldPattern,
} from "./ClanShield";
import { LeagueEmblem } from "./LeagueEmblem";
import { getLeagueForTrophies } from "../../data/leaguesData";
import { tickClanXpSimulation } from "../../utils/botSimulationService";

interface ClanManagementViewProps {
  onShowToast?: (message: string) => void;
  currentUserXp?: number; // Trophies count
  onClanBannerColorChange?: (color: ClanShieldColor) => void;
  themeColor?: string;
}

/**
 * Generate clean circular initials from any username
 */
export const getInitials = (name: string): string => {
  if (!name) return "U";
  // Remove symbols and extra whitespace
  const cleaned = name.replace(/[^a-zA-Z0-9\s]/g, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.charAt(0).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * Generate a consistent avatar background color for initials
 */
export const getAvatarBg = (name: string): string => {
  const colors = [
    "#4f46e5", // Indigo
    "#0284c7", // Sky
    "#059669", // Emerald
    "#d97706", // Amber
    "#dc2626", // Red
    "#9333ea", // Purple
    "#0891b2", // Cyan
    "#ea580c", // Orange
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export interface ClanColorTheme {
  primaryBtn: string;
  secondaryBtn: string;
  cardBg: string;
  cardBorder: string;
  cardGlow: string;
  iconColor: string;
  badge: string;
  glowColor: string;
  bgGradient: string;
  highlightText: string;
  customHex: string;
}

export function getClanTheme(color: ClanShieldColor): ClanColorTheme {
  switch (color) {
    case "blue":
      return {
        primaryBtn: "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white border border-sky-300/80 shadow-[0_0_18px_rgba(56,189,248,0.45)] hover:brightness-110",
        secondaryBtn: "bg-sky-950/70 hover:bg-sky-900/80 border border-sky-400/50 hover:border-sky-300 text-sky-200 shadow-[0_0_14px_rgba(56,189,248,0.25)]",
        cardBg: "bg-gradient-to-b from-[#061528]/95 via-[#080f1d]/95 to-[#040812]",
        cardBorder: "border-sky-500/40",
        cardGlow: "shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_25px_rgba(56,189,248,0.18)]",
        iconColor: "text-sky-400",
        badge: "bg-sky-500/15 border-sky-400/30 text-sky-300",
        glowColor: "rgba(56, 189, 248, 0.22)",
        bgGradient: "radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.18) 0%, rgba(2,132,199,0.06) 45%, rgba(0,0,0,0) 80%), #000000",
        highlightText: "text-sky-300",
        customHex: "#0284c7",
      };
    case "cyan":
      return {
        primaryBtn: "bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white border border-cyan-300/80 shadow-[0_0_18px_rgba(6,182,212,0.45)] hover:brightness-110",
        secondaryBtn: "bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.25)]",
        cardBg: "bg-gradient-to-b from-[#041a24]/95 via-[#061219]/95 to-[#020a0f]",
        cardBorder: "border-cyan-500/40",
        cardGlow: "shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_25px_rgba(6,182,212,0.18)]",
        iconColor: "text-cyan-400",
        badge: "bg-cyan-500/15 border-cyan-400/30 text-cyan-300",
        glowColor: "rgba(6, 182, 212, 0.22)",
        bgGradient: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.18) 0%, rgba(8,145,178,0.06) 45%, rgba(0,0,0,0) 80%), #000000",
        highlightText: "text-cyan-300",
        customHex: "#06b6d4",
      };
    case "red":
      return {
        primaryBtn: "bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white border border-rose-300/80 shadow-[0_0_18px_rgba(244,63,94,0.45)] hover:brightness-110",
        secondaryBtn: "bg-rose-950/70 hover:bg-rose-900/80 border border-rose-400/50 hover:border-rose-300 text-rose-200 shadow-[0_0_14px_rgba(244,63,94,0.25)]",
        cardBg: "bg-gradient-to-b from-[#22070c]/95 via-[#120609]/95 to-[#0a0204]",
        cardBorder: "border-rose-500/40",
        cardGlow: "shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_25px_rgba(244,63,94,0.18)]",
        iconColor: "text-rose-400",
        badge: "bg-rose-500/15 border-rose-400/30 text-rose-300",
        glowColor: "rgba(244, 63, 94, 0.22)",
        bgGradient: "radial-gradient(ellipse at 50% 0%, rgba(244,63,94,0.18) 0%, rgba(220,38,38,0.06) 45%, rgba(0,0,0,0) 80%), #000000",
        highlightText: "text-rose-300",
        customHex: "#dc2626",
      };
    case "green":
      return {
        primaryBtn: "bg-gradient-to-r from-emerald-500 via-green-600 to-teal-700 text-white border border-emerald-300/80 shadow-[0_0_18px_rgba(16,185,129,0.45)] hover:brightness-110",
        secondaryBtn: "bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-400/50 hover:border-emerald-300 text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.25)]",
        cardBg: "bg-gradient-to-b from-[#051e14]/95 via-[#07130e]/95 to-[#020b07]",
        cardBorder: "border-emerald-500/40",
        cardGlow: "shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_25px_rgba(16,185,129,0.18)]",
        iconColor: "text-emerald-400",
        badge: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300",
        glowColor: "rgba(16, 185, 129, 0.22)",
        bgGradient: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.18) 0%, rgba(22,163,74,0.06) 45%, rgba(0,0,0,0) 80%), #000000",
        highlightText: "text-emerald-300",
        customHex: "#16a34a",
      };
    case "purple":
      return {
        primaryBtn: "bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-700 text-white border border-purple-300/80 shadow-[0_0_18px_rgba(168,85,247,0.45)] hover:brightness-110",
        secondaryBtn: "bg-purple-950/70 hover:bg-purple-900/80 border border-purple-400/50 hover:border-purple-300 text-purple-200 shadow-[0_0_14px_rgba(168,85,247,0.25)]",
        cardBg: "bg-gradient-to-b from-[#1c082e]/95 via-[#10071c]/95 to-[#090310]",
        cardBorder: "border-purple-500/40",
        cardGlow: "shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_25px_rgba(168,85,247,0.18)]",
        iconColor: "text-purple-400",
        badge: "bg-purple-500/15 border-purple-400/30 text-purple-300",
        glowColor: "rgba(168, 85, 247, 0.22)",
        bgGradient: "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.18) 0%, rgba(147,51,234,0.06) 45%, rgba(0,0,0,0) 80%), #000000",
        highlightText: "text-purple-300",
        customHex: "#9333ea",
      };
    case "gold":
      return {
        primaryBtn: "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black border border-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.5)] hover:brightness-110",
        secondaryBtn: "bg-amber-950/70 hover:bg-amber-900/80 border border-amber-400/50 hover:border-amber-300 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.25)]",
        cardBg: "bg-gradient-to-b from-[#221804]/95 via-[#140e03]/95 to-[#0b0801]",
        cardBorder: "border-amber-500/40",
        cardGlow: "shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_25px_rgba(245,158,11,0.18)]",
        iconColor: "text-amber-400",
        badge: "bg-amber-500/15 border-amber-400/30 text-amber-300",
        glowColor: "rgba(245, 158, 11, 0.22)",
        bgGradient: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.18) 0%, rgba(234,179,8,0.06) 45%, rgba(0,0,0,0) 80%), #000000",
        highlightText: "text-amber-300",
        customHex: "#eab308",
      };
    case "copper":
      return {
        primaryBtn: "bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 text-white border border-orange-300/80 shadow-[0_0_18px_rgba(234,88,12,0.45)] hover:brightness-110",
        secondaryBtn: "bg-orange-950/70 hover:bg-orange-900/80 border border-orange-400/50 hover:border-orange-300 text-orange-200 shadow-[0_0_14px_rgba(234,88,12,0.25)]",
        cardBg: "bg-gradient-to-b from-[#241006]/95 via-[#140903]/95 to-[#0a0501]",
        cardBorder: "border-orange-500/40",
        cardGlow: "shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_25px_rgba(244,88,12,0.18)]",
        iconColor: "text-orange-400",
        badge: "bg-orange-500/15 border-orange-400/30 text-orange-300",
        glowColor: "rgba(234, 88, 12, 0.22)",
        bgGradient: "radial-gradient(ellipse at 50% 0%, rgba(234,88,12,0.18) 0%, rgba(234,88,12,0.06) 45%, rgba(0,0,0,0) 80%), #000000",
        highlightText: "text-orange-300",
        customHex: "#ea580c",
      };
    case "black":
    default:
      return {
        primaryBtn: "bg-gradient-to-r from-slate-700 via-zinc-800 to-slate-900 text-white border border-slate-400/70 shadow-[0_0_18px_rgba(148,163,184,0.3)] hover:brightness-110",
        secondaryBtn: "bg-slate-900/80 hover:bg-slate-800/80 border border-slate-500/50 hover:border-slate-400 text-slate-200 shadow-[0_0_14px_rgba(148,163,184,0.2)]",
        cardBg: "bg-gradient-to-b from-[#14161f]/95 via-[#0c0d12]/95 to-[#06070a]",
        cardBorder: "border-slate-500/40",
        cardGlow: "shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_25px_rgba(148,163,184,0.18)]",
        iconColor: "text-slate-300",
        badge: "bg-slate-500/15 border-slate-400/30 text-slate-300",
        glowColor: "rgba(148, 163, 184, 0.15)",
        bgGradient: "radial-gradient(ellipse at 50% 0%, rgba(148,163,184,0.12) 0%, rgba(71,85,105,0.05) 45%, rgba(0,0,0,0) 80%), #000000",
        highlightText: "text-slate-200",
        customHex: "#475569",
      };
  }
}

export const ClanManagementView: React.FC<ClanManagementViewProps> = ({
  onShowToast = (_msg?: string) => {},
  currentUserXp = 0,
  onClanBannerColorChange,
  themeColor = "light-blue",
}) => {
  // Active clan state with persistence
  const [currentClan, setCurrentClan] = useState<ClanData | null>(getStoredCurrentClan);
  const [allClans, setAllClans] = useState<ClanData[]>(getStoredAllClans);

  const [clanSubTab, setClanSubTab] = useState<"clan" | "search" | "create">("clan");

  // Modals
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ClanMember | null>(null);

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // Create Clan form state with full Dynamic Shield Designer
  const [newClanName, setNewClanName] = useState("");
  const [newClanDescription, setNewClanDescription] = useState("");
  const [newClanShape, setNewClanShape] = useState<ClanShieldShape>("banner");
  const [newClanPattern, setNewClanPattern] = useState<ClanShieldPattern>("solid");
  const [newClanColor, setNewClanColor] = useState<ClanShieldColor>("blue");
  const [newClanSymbol, setNewClanSymbol] = useState<ClanShieldSymbol>("arrows");
  const [newClanType, setNewClanType] = useState<ClanType>("Open");
  const [newClanRequiredTrophies, setNewClanRequiredTrophies] = useState(1000);
  const [newClanLocation, setNewClanLocation] = useState("International");

  // Dynamic theme resolution for the chosen color (reactive across all 8 colors)
  const activeShieldColor: ClanShieldColor =
    clanSubTab === "create"
      ? newClanColor
      : (currentClan?.shieldColor || "blue");

  const clanTheme = getClanTheme(activeShieldColor);

  const isLightBlue =
    activeShieldColor === "blue" ||
    activeShieldColor === "cyan";

  // Shield editor active category in modals ("shape" | "pattern" | "color" | "symbol")
  const [activeShieldTab, setActiveShieldTab] = useState<"shape" | "pattern" | "color" | "symbol">("shape");

  // Keep localStorage updated and notify parent of banner color
  useEffect(() => {
    saveCurrentClan(currentClan);
    if (currentClan) {
      onClanBannerColorChange?.(currentClan.shieldColor);
    }
  }, [currentClan, onClanBannerColorChange]);

  useEffect(() => {
    saveAllClans(allClans);
  }, [allClans]);

  // Simulate gradual clan XP growth over time so clans feel active
  useEffect(() => {
    if (!currentClan) return;
    const newXp = tickClanXpSimulation(currentClan.totalXp);
    if (newXp !== currentClan.totalXp) {
      setCurrentClan((prev) => prev ? ({
        ...prev,
        totalXp: newXp,
        totalTrophies: newXp,
      }) : null);
    }

    const interval = setInterval(() => {
      setCurrentClan((prev) => {
        if (!prev) return null;
        const nextXp = tickClanXpSimulation(prev.totalXp);
        if (nextXp !== prev.totalXp) {
          return {
            ...prev,
            totalXp: nextXp,
            totalTrophies: nextXp,
          };
        }
        return prev;
      });
    }, 20000);

    return () => clearInterval(interval);
  }, [currentClan?.id]);

  // Join a clan
  const handleJoinClan = (targetClan: ClanData) => {
    const requiredTrophies = targetClan.requiredTrophies ?? targetClan.requiredXp;
    if (currentUserXp < requiredTrophies) {
      onShowToast(`⚠️ Requires ${requiredTrophies} 🏆 Trophies to join!`);
      return;
    }

    // Add user as member to targetClan, and strip isCurrentUser from any other clan
    const updatedMembers: ClanMember[] = [
      ...targetClan.members.filter((m) => !m.isCurrentUser),
      {
        id: `user-${Date.now()}`,
        name: "You (Coder)",
        role: "Member",
        xp: currentUserXp,
        trophies: currentUserXp,
        donations: 0,
        leagueId: getLeagueForTrophies(currentUserXp).id,
        avatarType: "circle-letter",
        avatarBg: "#8b5cf6",
        avatarLetter: "Y",
        isCurrentUser: true,
      },
    ];

    const updatedTargetClan: ClanData = {
      ...targetClan,
      members: updatedMembers,
    };

    const updatedAllClans = allClans.map((c) => {
      if (c.id === targetClan.id) {
        return updatedTargetClan;
      }
      return {
        ...c,
        members: c.members.filter((m) => !m.isCurrentUser),
      };
    });

    setAllClans(updatedAllClans);
    setCurrentClan(updatedTargetClan);
    saveCurrentClan(updatedTargetClan);
    saveAllClans(updatedAllClans);
    setClanSubTab("clan");
    onShowToast(`🛡️ Joined ${targetClan.name}!`);
  };

  // Create a brand new clan
  const handleCreateClanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClanName.trim()) {
      onShowToast("⚠️ Please enter a clan name!");
      return;
    }

    const newClan: ClanData = {
      id: `clan-${Date.now()}`,
      name: newClanName.trim().toUpperCase(),
      tag: `#CLAN${Math.floor(1000 + Math.random() * 9000)}`,
      description:
        newClanDescription.trim() ||
        "Active coding clan. Daily algorithmic battles, practice sessions & team growth!",
      shieldShape: newClanShape,
      shieldPattern: newClanPattern,
      shieldColor: newClanColor,
      shieldSymbol: newClanSymbol,
      totalTrophies: currentUserXp,
      totalXp: currentUserXp,
      requiredTrophies: newClanRequiredTrophies,
      requiredXp: newClanRequiredTrophies,
      donationsWeekly: 0,
      location: newClanLocation,
      type: newClanType,
      maxMembers: 50,
      members: [
        {
          id: "leader-user",
          name: "You (Coder)",
          role: "Leader",
          xp: currentUserXp,
          trophies: currentUserXp,
          donations: 0,
          leagueId: getLeagueForTrophies(currentUserXp).id,
          avatarType: "circle-letter",
          isCurrentUser: true,
        },
      ],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: "System",
          senderRole: "Leader",
          message: `Clan ${newClanName.toUpperCase()} has been formed! Welcome warriors! ⚔️`,
          timestamp: "Just now",
          isSystem: true,
        },
      ],
    };

    const updatedAllClans = [
      newClan,
      ...allClans.map((c) => ({
        ...c,
        members: c.members.filter((m) => !m.isCurrentUser),
      })),
    ];

    setAllClans(updatedAllClans);
    setCurrentClan(newClan);
    saveCurrentClan(newClan);
    saveAllClans(updatedAllClans);
    setClanSubTab("clan");
    onShowToast(`🎉 Clan ${newClan.name} successfully created!`);
  };

  // Save clan settings
  const handleSaveSettings = () => {
    setShowSettingsModal(false);
    onShowToast("✅ Clan settings and flag updated!");
  };

  // Leave clan
  const handleLeaveClan = () => {
    setShowLeaveConfirmModal(false);
    if (currentClan) {
      const updatedAllClans = allClans.map((c) => {
        if (c.id === currentClan.id) {
          return {
            ...c,
            members: c.members.filter((m) => !m.isCurrentUser),
          };
        }
        return c;
      });
      setAllClans(updatedAllClans);
      saveAllClans(updatedAllClans);
    }
    setCurrentClan(null);
    saveCurrentClan(null);
    setClanSubTab("search");
    onShowToast("🚪 You left the clan.");
  };

  // Promote / Demote / Kick member
  const handlePromoteMember = (member: ClanMember, newRole: ClanRole) => {
    if (!currentClan) return;
    const updatedMembers = currentClan.members.map((m) =>
      m.id === member.id ? { ...m, role: newRole } : m
    );
    const updated = { ...currentClan, members: updatedMembers };
    setCurrentClan(updated);
    saveCurrentClan(updated);
    setSelectedMember(null);
    onShowToast(`🎖️ ${member.name} promoted to ${newRole}!`);
  };

  const handleKickMember = (member: ClanMember) => {
    if (!currentClan) return;
    const updatedMembers = currentClan.members.filter((m) => m.id !== member.id);
    const updated = { ...currentClan, members: updatedMembers };
    setCurrentClan(updated);
    saveCurrentClan(updated);
    setSelectedMember(null);
    onShowToast(`👢 ${member.name} was removed from the clan.`);
  };

  // Filter clans for search
  const filteredClans = allClans.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SHAPES_LIST: { id: ClanShieldShape; label: string }[] = [
    { id: "banner", label: "Banner" },
    { id: "heater", label: "Heater" },
    { id: "pentagon", label: "Pentagon" },
    { id: "buckler", label: "Buckler" },
    { id: "diamond", label: "Diamond" },
    { id: "gothic", label: "Gothic" },
  ];

  const PATTERNS_LIST: { id: ClanShieldPattern; label: string }[] = [
    { id: "solid", label: "Solid" },
    { id: "split-vertical", label: "Vertical" },
    { id: "split-horizontal", label: "Horizontal" },
    { id: "diagonal-slash", label: "Sash" },
    { id: "chevron", label: "Chevron" },
    { id: "quarters", label: "Quarters" },
    { id: "rays", label: "War Rays" },
  ];

  const COLORS_LIST: { id: ClanShieldColor; hex: string; label: string }[] = [
    { id: "black", hex: "#1e293b", label: "Obsidian" },
    { id: "blue", hex: "#0284c7", label: "Sapphire" },
    { id: "red", hex: "#dc2626", label: "Crimson" },
    { id: "green", hex: "#16a34a", label: "Emerald" },
    { id: "purple", hex: "#9333ea", label: "Imperial" },
    { id: "gold", hex: "#eab308", label: "Gold" },
    { id: "cyan", hex: "#06b6d4", label: "Frost" },
    { id: "copper", hex: "#ea580c", label: "Forge" },
  ];

  const SYMBOLS_LIST: { id: ClanShieldSymbol; label: string }[] = [
    { id: "arrows", label: "Arrows" },
    { id: "swords", label: "Swords" },
    { id: "dragon", label: "Dragon" },
    { id: "skull", label: "Skull" },
    { id: "crown", label: "Crown" },
    { id: "lightning", label: "Lightning" },
    { id: "code", label: "Code" },
    { id: "star", label: "Star" },
    { id: "flame", label: "Flame" },
    { id: "axe", label: "Battleaxe" },
    { id: "shield", label: "Aegis" },
    { id: "tower", label: "Fortress" },
  ];

  const clanScore = currentClan ? (currentClan.totalTrophies ?? currentClan.totalXp) : 0;
  const clanReq = currentClan ? (currentClan.requiredTrophies ?? currentClan.requiredXp) : 0;

  return (
    <div className="w-full flex-1 flex flex-col select-none text-left text-white transition-colors duration-500 pb-12 relative min-h-screen">
      {/* Fixed immersive background so it remains anchored when scrolling */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-500"
        style={{
          backgroundImage: clanTheme.bgGradient,
        }}
      />

      {/* Sub-Tabs: My Clan vs Search Clans vs Create Clan */}
      <div className="px-4 pt-1 pb-3 relative z-10">
        <div className="bg-[#0b0b0e]/90 backdrop-blur-md p-1 rounded-xl border border-white/10 flex items-center gap-1 shadow-md">
          <button
            onClick={() => setClanSubTab("clan")}
            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              clanSubTab === "clan"
                ? clanTheme.primaryBtn
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
            id="tab-my-clan"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>My Clan</span>
          </button>

          <button
            onClick={() => setClanSubTab("search")}
            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              clanSubTab === "search"
                ? clanTheme.primaryBtn
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
            id="tab-search-clan"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>

          <button
            onClick={() => setClanSubTab("create")}
            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              clanSubTab === "create"
                ? clanTheme.primaryBtn
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
            id="tab-create-clan"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: MY CLAN (Dynamic Obsidian with Clan Color Theme)
          ========================================================================= */}
      {clanSubTab === "clan" && !currentClan && (
        <div className="space-y-4 px-4 relative z-10 text-center py-4">
          <div className="rounded-3xl p-8 border border-white/10 bg-gradient-to-b from-[#0b0f19] to-[#04060c] shadow-[0_4px_30px_rgba(0,0,0,0.8)] flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-4 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Shield className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              You Are Not in a Clan
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
              Join a clan to share prompts, compete in weekly Clan Wars, and unlock the legendary Clan Chest!
            </p>
            <div className="flex items-center gap-3 mt-6 w-full max-w-xs">
              <button
                onClick={() => setClanSubTab("search")}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_16px_rgba(6,182,212,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Find Clan</span>
              </button>
              <button
                onClick={() => setClanSubTab("create")}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-white active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {clanSubTab === "clan" && currentClan && (
        <div className="space-y-3 px-4 relative z-10">
          {/* Main Clan Card Frame - Obsidian with Themed Tint & Glow */}
          <div className={`rounded-2xl p-4.5 border transition-all duration-300 relative overflow-hidden space-y-4 ${clanTheme.cardBg} ${clanTheme.cardBorder} ${clanTheme.cardGlow}`}>
            {/* Top Identity Block */}
            <div className="flex items-center gap-4">
              {/* Clan Shield with ambient glow */}
              <div className="relative shrink-0 flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-40 -z-10"
                  style={{ backgroundColor: clanTheme.glowColor }}
                />
                <ClanShield
                  shape={currentClan.shieldShape || "banner"}
                  pattern={currentClan.shieldPattern || "solid"}
                  color={currentClan.shieldColor}
                  symbol={currentClan.shieldSymbol}
                  size="md"
                />
              </div>

              {/* Clan Title & Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-wider uppercase truncate font-sans">
                    {currentClan.name}
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.08] border border-white/10 text-zinc-300 shrink-0 font-bold">
                    {currentClan.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-300 border border-white/10">
                    {currentClan.type}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {currentClan.location}
                  </span>
                </div>

                {/* Motto */}
                {currentClan.description && (
                  <p className="text-xs text-zinc-300/90 leading-relaxed mt-1.5 line-clamp-1 italic">
                    "{currentClan.description}"
                  </p>
                )}
              </div>
            </div>

            {/* High-Impact Trophies & Clan Stats Hero Strip */}
            <div className="grid grid-cols-3 gap-2 bg-[#090a0e]/90 rounded-xl p-3 border border-white/10 items-center text-center backdrop-blur-sm">
              {/* Trophies - Clear, prominent, bold numbers */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[9px] font-black uppercase text-amber-400/90 tracking-widest block flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-400 fill-amber-400/40" />
                  TROPHIES
                </span>
                <span className="text-base sm:text-lg font-mono font-black text-amber-300 block mt-0.5 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]">
                  {clanScore.toLocaleString()}
                </span>
              </div>

              {/* Members */}
              <div className="border-x border-white/10 flex flex-col items-center justify-center">
                <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider block">
                  MEMBERS
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-white block mt-0.5">
                  {currentClan.members.length} / {currentClan.maxMembers}
                </span>
              </div>

              {/* Requirement */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider block">
                  REQUIRED
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-zinc-300 block mt-0.5">
                  {clanReq > 0 ? `${clanReq.toLocaleString()} 🏆` : "None"}
                </span>
              </div>
            </div>

            {/* Action Buttons with Dynamic Color from Selected Clan Theme */}
            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              {/* Invite */}
              <button
                onClick={() => setShowInviteModal(true)}
                className={`py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 relative overflow-hidden group/btn ${clanTheme.secondaryBtn}`}
                id="invite-clan-btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                <UserPlus className={`w-4 h-4 shrink-0 ${clanTheme.iconColor}`} />
                <span>Invite Members</span>
              </button>

              {/* Settings / Flag */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className={`py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 relative overflow-hidden group/btn ${clanTheme.secondaryBtn}`}
                id="clan-settings-btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                <Settings className={`w-4 h-4 shrink-0 ${clanTheme.iconColor}`} />
                <span>Edit Flag & Info</span>
              </button>
            </div>

            {/* Leave Clan Link / Discreet Button */}
            <div className="flex items-center justify-end pt-0.5">
              <button
                onClick={() => setShowLeaveConfirmModal(true)}
                className="text-[11px] text-zinc-500 hover:text-rose-400 font-bold hover:underline cursor-pointer flex items-center gap-1 transition-colors"
                id="clan-leave-btn"
              >
                <LogOut className="w-3 h-3" />
                <span>Leave Clan</span>
              </button>
            </div>
          </div>

          {/* Members List Container Header */}
          <div className="flex items-center justify-between px-1 text-xs font-black uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-white">
              <Users className="w-4 h-4 text-amber-400" />
              MEMBERS {currentClan.members.length}/{currentClan.maxMembers}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Ranked by Trophies 🏆
            </span>
          </div>

          {/* Members List Cards */}
          <div className="space-y-2">
            {currentClan.members
              .slice()
              .sort((a, b) => {
                const aVal = a.isCurrentUser ? currentUserXp : (a.trophies ?? a.xp ?? 0);
                const bVal = b.isCurrentUser ? currentUserXp : (b.trophies ?? b.xp ?? 0);
                return bVal - aVal;
              })
              .map((member, index) => {
                const rankNum = index + 1;
                const isLeader = member.role === "Leader";
                const isCoLeader = member.role === "Co-Leader";
                const isElder = member.role === "Elder";
                const memberTrophies = member.isCurrentUser ? currentUserXp : (member.trophies ?? member.xp ?? 0);

                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className={`rounded-2xl p-2.5 sm:p-3 border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md ${
                      member.isCurrentUser
                        ? "bg-amber-400/10 border-amber-400/40 hover:border-amber-400"
                        : "bg-[#0b0b0e] hover:bg-[#111116] border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Left: Rank pill + Initials Avatar + Name & Role */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank pill */}
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border ${
                          rankNum === 1
                            ? "bg-amber-400 border-amber-300 text-slate-950 shadow-sm"
                            : rankNum === 2
                            ? "bg-slate-300 border-white text-slate-950"
                            : rankNum === 3
                            ? "bg-amber-600 border-amber-500 text-white"
                            : "bg-[#111116] border-white/10 text-slate-400"
                        }`}
                      >
                        {rankNum}
                      </div>

                      {/* Pure Initials Avatar (No Bots / Clipart) */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs text-white border border-white/20 shrink-0 shadow-inner"
                        style={{
                          backgroundColor:
                            member.avatarBg || getAvatarBg(member.name),
                        }}
                      >
                        {getInitials(member.name)}
                      </div>

                      {/* Name & Role */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs sm:text-sm font-extrabold truncate ${
                              member.isCurrentUser
                                ? "text-amber-300"
                                : "text-white"
                            }`}
                          >
                            {member.name}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold block uppercase tracking-wide ${
                            isLeader
                              ? "text-amber-400"
                              : isCoLeader
                              ? "text-purple-300"
                              : isElder
                              ? "text-sky-300"
                              : "text-slate-400"
                          }`}
                        >
                          {member.role}
                        </span>
                      </div>
                    </div>

                    {/* Right: League Badge + Donations count + Trophy counter */}
                    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                      {/* League Crest */}
                      <LeagueEmblem leagueId={member.leagueId} size="xs" />

                      {/* Donation count */}
                      <div
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono font-bold text-slate-300"
                        title="Weekly Code Reviews Donated"
                      >
                        <span className="text-sky-400 text-xs">⤴</span>
                        <span>{member.donations}</span>
                      </div>

                      {/* Trophy Score */}
                      <div className="flex items-center gap-1 font-mono font-black text-xs sm:text-sm text-amber-300 min-w-[70px] justify-end">
                        <span className="text-amber-400">🏆</span>
                        <span>{memberTrophies}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: SEARCH & BROWSE CLANS (Obsidian Black)
          ========================================================================= */}
      {clanSubTab === "search" && (
        <div className="space-y-3 px-4 relative z-10">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search clans by name or tag (#)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0b0e] border border-white/15 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400 px-1">
            <span>RECOMMENDED CLANS ({filteredClans.length})</span>
            <span className="text-[10px] text-amber-400">Global Ranks</span>
          </div>

          <div className="space-y-2.5">
            {filteredClans.map((clan) => {
              const isCurrent = currentClan ? clan.id === currentClan.id : false;
              const score = clan.totalTrophies ?? clan.totalXp;
              const req = clan.requiredTrophies ?? clan.requiredXp;

              return (
                <div
                  key={clan.id}
                  className={`rounded-2xl p-3.5 border transition-all flex flex-col gap-2.5 shadow-md ${
                    isCurrent
                      ? "bg-amber-400/10 border-amber-400/40"
                      : "bg-[#0b0b0e] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="shrink-0">
                        <ClanShield
                          shape={clan.shieldShape || "banner"}
                          pattern={clan.shieldPattern || "solid"}
                          color={clan.shieldColor}
                          symbol={clan.shieldSymbol}
                          size="sm"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="text-sm font-black text-white truncate">
                            {clan.name}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {clan.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5">
                          {clan.description}
                        </p>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white/[0.08] border border-white/20 text-zinc-300 font-black text-[10px] uppercase whitespace-nowrap">
                        JOINED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleJoinClan(clan)}
                        className={`shrink-0 px-4 py-2 min-w-[76px] rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-95 relative overflow-hidden flex items-center justify-center whitespace-nowrap group/btn ${clanTheme.primaryBtn}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                        <span className="relative z-10">JOIN</span>
                      </button>
                    )}
                  </div>

                  {/* Stats Footer */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5">
                    <span className="flex items-center gap-1 text-white">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      {clan.members.length}/{clan.maxMembers}
                    </span>
                    <span className="text-amber-300 flex items-center gap-1">
                      🏆 {score.toLocaleString()}
                    </span>
                    <span>Req: {req} 🏆</span>
                    <span className="text-slate-300">{clan.location}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: CREATE CLAN (Dynamic Shield Designer + Obsidian Black Box)
          ========================================================================= */}
      {clanSubTab === "create" && (
        <div className="space-y-3 px-4 relative z-10">
          <form
            onSubmit={handleCreateClanSubmit}
            className="bg-[#0b0b0e] border border-white/15 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.85)] space-y-4 text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  Create New Clan
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Custom Crest</span>
              </div>
            </div>

            {/* Dynamic Clan Shield Designer Box */}
            <div className="bg-[#111116] rounded-2xl p-3 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex flex-col items-center shrink-0">
                <ClanShield
                  shape={newClanShape}
                  pattern={newClanPattern}
                  color={newClanColor}
                  symbol={newClanSymbol}
                  size="lg"
                />
                <span className="text-[10px] font-black uppercase text-amber-400 mt-1.5 tracking-wider">
                  Live Preview
                </span>
              </div>

              {/* Interactive Selector Tabs: Shape | Pattern | Color | Symbol */}
              <div className="flex-1 w-full space-y-2.5">
                {/* Category Switcher Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10">
                  {(
                    [
                      { id: "shape", label: "Shape" },
                      { id: "pattern", label: "Pattern" },
                      { id: "color", label: "Color" },
                      { id: "symbol", label: "Emblem" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveShieldTab(tab.id)}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                        activeShieldTab === tab.id
                          ? "bg-white/20 text-white font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Sub-Panel: SHAPES */}
                {activeShieldTab === "shape" && (
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Select Shield Shape
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {SHAPES_LIST.map((sh) => (
                        <button
                          key={sh.id}
                          type="button"
                          onClick={() => setNewClanShape(sh.id)}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-black uppercase border transition-all cursor-pointer ${
                            newClanShape === sh.id
                              ? "bg-amber-400 text-slate-950 border-amber-300"
                              : "bg-[#0b0b0e] text-slate-300 border-white/10 hover:border-white/25"
                          }`}
                        >
                          {sh.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-Panel: PATTERNS */}
                {activeShieldTab === "pattern" && (
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Select Heraldic Pattern
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {PATTERNS_LIST.map((pt) => (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => setNewClanPattern(pt.id)}
                          className={`py-1.5 px-1.5 rounded-xl text-[9px] font-black uppercase border transition-all cursor-pointer truncate ${
                            newClanPattern === pt.id
                              ? "bg-amber-400 text-slate-950 border-amber-300"
                              : "bg-[#0b0b0e] text-slate-300 border-white/10 hover:border-white/25"
                          }`}
                        >
                          {pt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-Panel: COLORS */}
                {activeShieldTab === "color" && (
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Select Primary Color
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {COLORS_LIST.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setNewClanColor(c.id);
                            onClanBannerColorChange?.(c.id);
                          }}
                          title={c.label}
                          className={`w-7 h-7 rounded-xl border-2 transition-all cursor-pointer ${
                            newClanColor === c.id
                              ? "border-white scale-110 shadow-md"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-Panel: EMBLEM SYMBOL */}
                {activeShieldTab === "symbol" && (
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Select Emblem Symbol
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {SYMBOLS_LIST.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setNewClanSymbol(s.id)}
                          className={`py-1 px-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer border truncate ${
                            newClanSymbol === s.id
                              ? "bg-amber-400 text-slate-950 border-amber-300"
                              : "bg-[#0b0b0e] text-slate-300 border-white/10 hover:border-white/25"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clan Name */}
            <div>
              <label className="text-xs font-black uppercase text-slate-300 block mb-1">
                Clan Name *
              </label>
              <input
                type="text"
                placeholder="e.g. BYTE_RAIDERS, ALGO_TITANS"
                value={newClanName}
                onChange={(e) => setNewClanName(e.target.value)}
                maxLength={24}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#060608] border border-white/20 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Clan Description */}
            <div>
              <label className="text-xs font-black uppercase text-slate-300 block mb-1">
                Description / Clan Motto
              </label>
              <textarea
                placeholder="Tell fellow programmers about your clan goals, code war schedule, and vibe..."
                value={newClanDescription}
                onChange={(e) => setNewClanDescription(e.target.value)}
                rows={2}
                maxLength={140}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#060608] border border-white/20 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Grid: Clan Type & Required Trophies */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black uppercase text-slate-300 block mb-1">
                  Clan Type
                </label>
                <select
                  value={newClanType}
                  onChange={(e) => setNewClanType(e.target.value as ClanType)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#060608] border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="Open">Open (Anyone)</option>
                  <option value="Invite Only">Invite Only</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-300 block mb-1">
                  Required Trophies
                </label>
                <select
                  value={newClanRequiredTrophies}
                  onChange={(e) => setNewClanRequiredTrophies(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#060608] border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value={0}>0 🏆 Trophies</option>
                  <option value={500}>500 🏆 Trophies</option>
                  <option value={1000}>1,000 🏆 Trophies</option>
                  <option value={2000}>2,000 🏆 Trophies</option>
                  <option value={3000}>3,000 🏆 Trophies</option>
                  <option value={5000}>5,000 🏆 Trophies</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-black uppercase text-slate-300 block mb-1">
                Clan Location
              </label>
              <select
                value={newClanLocation}
                onChange={(e) => setNewClanLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#060608] border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="International">International (Global)</option>
                <option value="North America">North America</option>
                <option value="India">India</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 relative overflow-hidden group/btn ${clanTheme.primaryBtn}`}
              id="submit-create-clan"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
              <Shield className="w-4 h-4 shrink-0 fill-current" />
              <span>Create Clan (Free)</span>
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          MODAL: CLAN SETTINGS & FLAG DESIGNER (Black Theme Box - User Requested!)
          ========================================================================= */}
      <AnimatePresence>
        {showSettingsModal && currentClan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="w-full max-w-md bg-[#0b0b0e] border border-white/15 rounded-3xl p-5 shadow-2xl text-left space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-black text-white uppercase">
                    Clan Settings & Flag
                  </h3>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="w-7 h-7 rounded-lg bg-black/40 text-slate-300 flex items-center justify-center hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Clan Shield Customizer inside Settings */}
              <div className="bg-[#111116] rounded-2xl p-3 border border-white/10 flex flex-col items-center gap-3">
                <ClanShield
                  shape={currentClan.shieldShape || "banner"}
                  pattern={currentClan.shieldPattern || "solid"}
                  color={currentClan.shieldColor}
                  symbol={currentClan.shieldSymbol}
                  size="md"
                />
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Edit Clan Crest
                </span>

                {/* Shield Shape Buttons */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                    Shape
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {SHAPES_LIST.map((sh) => (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() =>
                          setCurrentClan({ ...currentClan, shieldShape: sh.id })
                        }
                        className={`py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${
                          (currentClan.shieldShape || "banner") === sh.id
                            ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                            : "bg-[#060608] text-slate-300 border-white/10"
                        }`}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shield Pattern Buttons */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                    Pattern
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {PATTERNS_LIST.map((pt) => (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() =>
                          setCurrentClan({ ...currentClan, shieldPattern: pt.id })
                        }
                        className={`py-1 rounded-lg text-[8px] font-black uppercase border transition-all truncate ${
                          (currentClan.shieldPattern || "solid") === pt.id
                            ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                            : "bg-[#060608] text-slate-300 border-white/10"
                        }`}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shield Color Circles */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                    Color
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {COLORS_LIST.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCurrentClan({ ...currentClan, shieldColor: c.id });
                          onClanBannerColorChange?.(c.id);
                        }}
                        className={`w-6 h-6 rounded-lg border-2 transition-all cursor-pointer ${
                          currentClan.shieldColor === c.id
                            ? "border-white scale-110 shadow-md"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Shield Symbol Options */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                    Emblem Symbol
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {SYMBOLS_LIST.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() =>
                          setCurrentClan({ ...currentClan, shieldSymbol: s.id })
                        }
                        className={`py-1 rounded-lg text-[8px] font-black uppercase border transition-all truncate ${
                          currentClan.shieldSymbol === s.id
                            ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                            : "bg-[#060608] text-slate-300 border-white/10"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clan Description */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Clan Motto / Description
                </label>
                <textarea
                  value={currentClan.description}
                  onChange={(e) =>
                    setCurrentClan({
                      ...currentClan,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-[#060608] border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Required Trophies */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Required Trophies 🏆
                </label>
                <input
                  type="number"
                  value={currentClan.requiredTrophies ?? currentClan.requiredXp}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCurrentClan({
                      ...currentClan,
                      requiredTrophies: val,
                      requiredXp: val,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#060608] border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 relative overflow-hidden group/btn ${clanTheme.primaryBtn}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                <span>Save Changes</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL: INVITE TO CLAN (Black Theme)
          ========================================================================= */}
      <AnimatePresence>
        {showInviteModal && currentClan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="w-full max-w-sm bg-[#0b0b0e] border border-white/15 rounded-3xl p-5 shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white uppercase">
                    Invite to Clan
                  </h3>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="w-7 h-7 rounded-lg bg-black/40 text-slate-300 flex items-center justify-center hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Share this tag or invitation link with fellow students or friends
                to recruit them into{" "}
                <strong className="text-white">{currentClan.name}</strong>!
              </p>

              <div className="p-3 bg-[#111116] rounded-2xl border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">
                    Clan Tag
                  </span>
                  <span className="text-sm font-mono font-black text-amber-300">
                    {currentClan.tag}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(currentClan.tag);
                    onShowToast("📋 Clan tag copied to clipboard!");
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  title="Copy Tag"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `Join my coding clan ${currentClan.name} using tag ${currentClan.tag}!`
                  );
                  onShowToast("🔗 Shareable invite copied!");
                  setShowInviteModal(false);
                }}
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 relative overflow-hidden group/btn ${clanTheme.primaryBtn}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                <Copy className="w-4 h-4 shrink-0 fill-current" />
                <span>Copy Invite Message</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL: LEAVE CLAN CONFIRMATION
          ========================================================================= */}
      <AnimatePresence>
        {showLeaveConfirmModal && currentClan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="w-full max-w-sm bg-[#0b0b0e] border border-rose-500/30 rounded-2xl p-5 shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center gap-2 text-rose-400">
                <LogOut className="w-5 h-5" />
                <h3 className="text-sm font-black text-white uppercase">
                  Leave Clan?
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to leave{" "}
                <strong className="text-white">{currentClan.name}</strong>? You
                will forfeit active clan war rewards and weekly donation stats.
              </p>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowLeaveConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 font-bold text-xs cursor-pointer transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveClan}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white border border-rose-500/30 font-black text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-95"
                >
                  Leave Clan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL: MEMBER ACTION POPOVER (Black Theme Box)
          ========================================================================= */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="w-full max-w-sm bg-[#0b0b0e] border border-white/15 rounded-3xl p-5 shadow-2xl text-left space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white border border-white/20 shrink-0"
                    style={{
                      backgroundColor:
                        selectedMember.avatarBg || getAvatarBg(selectedMember.name),
                    }}
                  >
                    {getInitials(selectedMember.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      {selectedMember.name}
                    </h3>
                    <span className="text-[10px] font-bold text-amber-400 uppercase">
                      {selectedMember.role} • 🏆 {selectedMember.isCurrentUser ? currentUserXp : (selectedMember.trophies ?? selectedMember.xp ?? 0)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-7 h-7 rounded-lg bg-black/40 text-slate-300 flex items-center justify-center hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onShowToast(`⚔️ Sent friendly coding challenge to ${selectedMember.name}!`);
                    setSelectedMember(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.20] backdrop-blur-md border border-white/20 hover:border-white/40 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_14px_rgba(0,0,0,0.6)] relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                  <Swords className="w-4 h-4 text-amber-400" />
                  <span>Friendly Coding Battle</span>
                </button>

                {!selectedMember.isCurrentUser && (
                  <>
                    <button
                      onClick={() => handlePromoteMember(selectedMember, "Elder")}
                      className="w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-xs uppercase cursor-pointer transition-all active:scale-95"
                    >
                      Promote to Elder
                    </button>
                    <button
                      onClick={() => handlePromoteMember(selectedMember, "Co-Leader")}
                      className="w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-xs uppercase cursor-pointer transition-all active:scale-95"
                    >
                      Promote to Co-Leader
                    </button>
                    <button
                      onClick={() => handleKickMember(selectedMember)}
                      className="w-full py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs uppercase border border-rose-500/30 cursor-pointer transition-all active:scale-95"
                    >
                      Kick from Clan
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
