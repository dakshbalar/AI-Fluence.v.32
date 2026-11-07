import React, { useState, useEffect, useRef } from "react";
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
  Crown,
  Share2,
  Lock,
  Unlock,
  Mail,
  Globe,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  Eye,
  Hash,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ClanData,
  ClanMember,
  ClanMessage,
  ClanRole,
  ClanType,
  DEFAULT_CLANS,
  getStoredCurrentClan,
  saveCurrentClan,
  getStoredAllClans,
  saveAllClans,
} from "../../data/clansData";
import { auth, db } from "../../firebase";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
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
import { useGamification } from "../../utils/gamificationStore";
import {
  saveProfile,
  cleanFirestoreData,
  loadStoredStudentProfile,
} from "../../utils/engagementStore";
import {
  fetchAllClansFromFirestore,
  createClanInFirestore,
  joinClanInFirestore,
  leaveClanInFirestore,
  sendClanMessageInFirestore,
  formatClanTypeLabel,
  calculateClanTotalTrophies,
  findClanByCodeInFirestore,
} from "../../services/clanService";

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
  const cleaned = name.replace(/[^a-zA-Z0-9\s]/g, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.charAt(0).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const calculateClanLevel = (clan: ClanData): number => {
  if (clan.level && clan.level >= 1 && clan.level <= 20) return clan.level;
  const trophies = clan.totalTrophies ?? clan.totalXp ?? 0;
  return Math.min(20, Math.max(1, Math.floor(trophies / 500) + 1));
};

/**
 * Consistent avatar background color for initials
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
        primaryBtn: "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white border border-sky-300/80 shadow-[0_4px_18px_rgba(56,189,248,0.45)] hover:brightness-110",
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
        primaryBtn: "bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white border border-cyan-300/80 shadow-[0_4px_18px_rgba(6,182,212,0.45)] hover:brightness-110",
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
        primaryBtn: "bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white border border-rose-300/80 shadow-[0_4px_18px_rgba(244,63,94,0.45)] hover:brightness-110",
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
        primaryBtn: "bg-gradient-to-r from-emerald-500 via-green-600 to-teal-700 text-white border border-emerald-300/80 shadow-[0_4px_18px_rgba(16,185,129,0.45)] hover:brightness-110",
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
        primaryBtn: "bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-700 text-white border border-purple-300/80 shadow-[0_4px_18px_rgba(168,85,247,0.45)] hover:brightness-110",
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
        primaryBtn: "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black border border-amber-200 shadow-[0_4px_18px_rgba(245,158,11,0.5)] hover:brightness-110",
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
        primaryBtn: "bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 text-white border border-orange-300/80 shadow-[0_4px_18px_rgba(234,88,12,0.45)] hover:brightness-110",
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
        primaryBtn: "bg-gradient-to-r from-slate-700 via-zinc-800 to-slate-900 text-white border border-slate-400/70 shadow-[0_4px_18px_rgba(148,163,184,0.3)] hover:brightness-110",
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
  const { setClan } = useGamification();

  // Active clan state with persistence
  const [currentClan, setCurrentClan] = useState<ClanData | null>(getStoredCurrentClan);
  const [allClans, setAllClans] = useState<ClanData[]>(getStoredAllClans);

  // Subtabs: Roster vs Chat vs Search/Explore vs Create
  const [clanSubTab, setClanSubTab] = useState<"clan" | "chat" | "search" | "create">(() => currentClan ? "clan" : "search");

  // Chat message input state
  const [newChatText, setNewChatText] = useState("");

  // Modals
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ClanMember | null>(null);
  const [inspectedClan, setInspectedClan] = useState<ClanData | null>(null);
  const [inviteClan, setInviteClan] = useState<ClanData | null>(null);
  const [requestedClanIds, setRequestedClanIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("scholar_clan_join_requests");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Search query & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<"all" | "open" | "qualified" | "top">("all");

  // Join by clan code state
  const [joinClanCodeInput, setJoinClanCodeInput] = useState("");

  const handleJoinByCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinClanCodeInput.trim();
    if (!code) {
      onShowToast("⚠️ Please enter a valid clan code or tag!");
      return;
    }
    const found = await findClanByCodeInFirestore(code);
    if (found) {
      setInspectedClan(found);
      onShowToast(`🛡️ Found clan "${found.name}"!`);
    } else {
      onShowToast(`⚠️ No clan found with code/tag "${code}". Check the code and try again.`);
    }
  };

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

  // Dynamic theme resolution for the chosen color
  const activeShieldColor: ClanShieldColor =
    clanSubTab === "create"
      ? newClanColor
      : (currentClan?.shieldColor || "blue");

  const clanTheme = getClanTheme(activeShieldColor);

  // Shield editor active category in modals ("shape" | "pattern" | "color" | "symbol")
  const [activeShieldTab, setActiveShieldTab] = useState<"shape" | "pattern" | "color" | "symbol">("shape");

  const setClanRef = useRef(setClan);
  setClanRef.current = setClan;
  const onColorChangeRef = useRef(onClanBannerColorChange);
  onColorChangeRef.current = onClanBannerColorChange;

  // Keep localStorage updated and notify parent of banner color
  useEffect(() => {
    saveCurrentClan(currentClan);
    if (currentClan) {
      onColorChangeRef.current?.(currentClan.shieldColor);
      setClanRef.current?.({
        clanId: currentClan.id || currentClan.tag,
        clanName: currentClan.name,
        clanTag: currentClan.tag,
        role: "Leader",
        shieldColor: currentClan.shieldColor,
      });
    } else {
      onColorChangeRef.current?.("blue");
      setClanRef.current?.(undefined);
    }
  }, [currentClan?.id, currentClan?.shieldColor]);

  useEffect(() => {
    saveAllClans(allClans);
  }, [allClans]);

  // Synchronize clans table with Firestore and link user's active clanId
  useEffect(() => {
    let isMounted = true;
    const syncClansWithFirestore = async () => {
      try {
        const loadedClans = await fetchAllClansFromFirestore();
        if (isMounted) {
          setAllClans(loadedClans);
          saveAllClans(loadedClans);
          const storedProfile = loadStoredStudentProfile();
          if (storedProfile?.clanId) {
            const matched = loadedClans.find((c) => c.id === storedProfile.clanId);
            if (matched) {
              setCurrentClan(matched);
              saveCurrentClan(matched);
            } else {
              setCurrentClan(null);
              saveCurrentClan(null);
            }
          } else {
            setCurrentClan((prev) => {
              if (prev && !loadedClans.some((c) => c.id === prev.id)) {
                saveCurrentClan(null);
                return null;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.warn("Firestore clans sync error, using local state:", err);
      }
    };
    syncClansWithFirestore();
    return () => {
      isMounted = false;
    };
  }, []);

  // Simulate gradual clan XP growth over time
  useEffect(() => {
    if (!currentClan?.id) return;

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
    }, 30000);

    return () => clearInterval(interval);
  }, [currentClan?.id]);

  // Join a clan (enforcing 1 clan at a time per user & sum of trophies)
  const handleJoinClan = async (targetClan: ClanData) => {
    if (currentClan && currentClan.id !== targetClan.id) {
      onShowToast(`⚠️ You are already in ${currentClan.name}! Leave your current clan first to join another.`);
      return;
    }

    const requiredTrophies = targetClan.requiredTrophies ?? targetClan.requiredXp ?? 0;
    if (currentUserXp < requiredTrophies) {
      onShowToast(`⚠️ Requires ${requiredTrophies.toLocaleString()} 🏆 Trophies to join!`);
      return;
    }

    const currentProfile = loadStoredStudentProfile();
    const currentUserId = currentProfile?.userId || auth.currentUser?.uid || `user-${Date.now()}`;
    const currentUserName = currentProfile?.username || "You (Coder)";

    try {
      const { updatedClan, updatedAllClans } = await joinClanInFirestore(
        currentUserId,
        currentUserName,
        currentUserXp,
        targetClan.id,
        allClans
      );

      setAllClans(updatedAllClans);
      setCurrentClan(updatedClan);
      saveCurrentClan(updatedClan);
      saveAllClans(updatedAllClans);

      onClanBannerColorChange?.(updatedClan.shieldColor);
      setClanSubTab("clan");
      onShowToast(`🛡️ Joined ${updatedClan.name}! Total trophies: ${(updatedClan.totalTrophies ?? 0).toLocaleString()} 🏆`);
    } catch (err) {
      onShowToast(`⚠️ Failed to join clan. Please try again.`);
    }
  };

  // Request / Ask to join an Invite Only clan
  const handleAskToJoin = async (clan: ClanData) => {
    if (currentClan && currentClan.id !== clan.id) {
      onShowToast(`⚠️ You are already in ${currentClan.name}! Leave it first before requesting to join another.`);
      return;
    }

    const requiredTrophies = clan.requiredTrophies ?? clan.requiredXp ?? 0;
    if (currentUserXp < requiredTrophies) {
      onShowToast(`⚠️ Requires ${requiredTrophies.toLocaleString()} 🏆 Trophies to request to join!`);
      return;
    }

    if (requestedClanIds.includes(clan.id)) {
      onShowToast(`⏳ You have already submitted a join request to ${clan.name}!`);
      return;
    }

    const currentProfile = loadStoredStudentProfile();
    const currentUserName = currentProfile?.username || "You";

    try {
      await sendClanMessageInFirestore(
        clan.id,
        currentUserName,
        "Member",
        `✉️ ${currentUserName} requested to join the clan (${currentUserXp.toLocaleString()} 🏆).`,
        true
      );

      const updatedRequests = [...requestedClanIds, clan.id];
      setRequestedClanIds(updatedRequests);
      try {
        localStorage.setItem("scholar_clan_join_requests", JSON.stringify(updatedRequests));
      } catch {}

      onShowToast(`📨 Request sent to join ${clan.name}! Clan leadership will review your application.`);
    } catch (e) {
      onShowToast(`⚠️ Error sending join request.`);
    }
  };

  // Create a brand new clan
  const handleCreateClanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentClan) {
      onShowToast(`⚠️ You are already in ${currentClan.name}! Leave your current clan first to create a new one.`);
      return;
    }

    if (!newClanName.trim()) {
      onShowToast("⚠️ Please enter a clan name!");
      return;
    }

    const currentProfile = loadStoredStudentProfile();
    const currentUserId = currentProfile?.userId || auth.currentUser?.uid || `user-${Date.now()}`;
    const currentUserName = currentProfile?.username || "You (Coder)";

    try {
      const createdClan = await createClanInFirestore(currentUserId, currentUserName, currentUserXp, {
        name: newClanName.trim().toUpperCase(),
        tag: `#CLAN${Math.floor(1000 + Math.random() * 9000)}`,
        description:
          newClanDescription.trim() ||
          "Active coding clan. Daily algorithmic battles, practice sessions & team growth!",
        shieldShape: newClanShape,
        shieldPattern: newClanPattern,
        shieldColor: newClanColor,
        shieldSymbol: newClanSymbol,
        requiredTrophies: newClanRequiredTrophies,
        requiredXp: newClanRequiredTrophies,
        donationsWeekly: 0,
        location: newClanLocation,
        type: newClanType,
        maxMembers: 50,
      });

      const updatedAllClans = [createdClan, ...allClans];
      setAllClans(updatedAllClans);
      setCurrentClan(createdClan);
      saveCurrentClan(createdClan);
      saveAllClans(updatedAllClans);

      onClanBannerColorChange?.(createdClan.shieldColor);
      setClanSubTab("clan");
      onShowToast(`🎉 Clan ${createdClan.name} successfully created!`);
    } catch (err) {
      onShowToast(`⚠️ Could not create clan. Please try again.`);
    }
  };

  // Save clan settings
  const handleSaveSettings = () => {
    setShowSettingsModal(false);
    if (currentClan) {
      setDoc(doc(db, "clans", currentClan.id), cleanFirestoreData(currentClan), { merge: true }).catch(console.warn);
      onClanBannerColorChange?.(currentClan.shieldColor);
    }
    onShowToast("✅ Clan settings and crest updated!");
  };

  // Leave clan
  const handleLeaveClan = async () => {
    setShowLeaveConfirmModal(false);
    if (!currentClan) return;

    const currentProfile = loadStoredStudentProfile();
    const currentUserId = currentProfile?.userId || auth.currentUser?.uid || "";

    try {
      const updatedAllClans = await leaveClanInFirestore(currentUserId, currentClan.id, allClans);
      setAllClans(updatedAllClans);
      saveAllClans(updatedAllClans);
      setCurrentClan(null);
      saveCurrentClan(null);
      onClanBannerColorChange?.("blue");

      setClanSubTab("search");
      onShowToast("🚪 You left the clan. You can now join or create another clan!");
    } catch (err) {
      onShowToast("⚠️ Could not leave clan. Please try again.");
    }
  };

  // Send Clan Chat message
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || newChatText).trim();
    if (!text || !currentClan) return;

    const currentProfile = loadStoredStudentProfile();
    const currentUserName = currentProfile?.username || "You";

    const userMember = currentClan.members.find((m) => m.isCurrentUser);
    const userRole = userMember ? userMember.role : "Member";

    const newMsg: ClanMessage = {
      id: `msg-${Date.now()}`,
      senderName: currentUserName,
      senderRole: userRole,
      message: text,
      timestamp: "Just now",
      isSystem: false,
    };

    const updatedMessages = [...(currentClan.messages || []), newMsg];
    const updatedClan = { ...currentClan, messages: updatedMessages };

    setCurrentClan(updatedClan);
    saveCurrentClan(updatedClan);
    setNewChatText("");

    setDoc(doc(db, "clans", currentClan.id), cleanFirestoreData(updatedClan), { merge: true }).catch(console.warn);
    onShowToast("💬 Message sent to clan!");
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

  // Filter & sort clans for search/explore
  const filteredClans = allClans
    .filter((c) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.tag.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      if (searchFilter === "open") return c.type === "Open";
      if (searchFilter === "qualified") {
        const req = c.requiredTrophies ?? c.requiredXp ?? 0;
        return currentUserXp >= req;
      }
      return true;
    })
    .sort((a, b) => {
      const aScore = a.totalTrophies ?? a.totalXp ?? 0;
      const bScore = b.totalTrophies ?? b.totalXp ?? 0;
      return bScore - aScore;
    });

  const SHAPES_LIST: { id: ClanShieldShape; label: string; desc: string }[] = [
    { id: "banner", label: "Banner", desc: "Pennant Crest" },
    { id: "heater", label: "Crusader", desc: "Curved Knight" },
    { id: "pentagon", label: "Citadel", desc: "Fortress Shield" },
    { id: "buckler", label: "Buckler", desc: "Round War Plate" },
    { id: "diamond", label: "Rhombus", desc: "Diamond Plate" },
    { id: "gothic", label: "Gothic", desc: "Winged Shield" },
  ];

  const PATTERNS_LIST: { id: ClanShieldPattern; label: string; desc: string }[] = [
    { id: "solid", label: "Solid", desc: "Pure Sheen" },
    { id: "split-vertical", label: "Vertical", desc: "Dual Split" },
    { id: "split-horizontal", label: "Horizon", desc: "Halved Split" },
    { id: "diagonal-slash", label: "Sash", desc: "Warrior Bend" },
    { id: "chevron", label: "Chevron", desc: "Tactical V" },
    { id: "quarters", label: "Quarters", desc: "4 Quadrants" },
    { id: "rays", label: "War Rays", desc: "Solar Flare" },
  ];

  const COLORS_LIST: { id: ClanShieldColor; hex: string; label: string; ringClass: string }[] = [
    { id: "blue", hex: "#0284c7", label: "Sapphire", ringClass: "ring-sky-400" },
    { id: "cyan", hex: "#06b6d4", label: "Frost", ringClass: "ring-cyan-400" },
    { id: "red", hex: "#dc2626", label: "Crimson", ringClass: "ring-rose-500" },
    { id: "green", hex: "#16a34a", label: "Emerald", ringClass: "ring-emerald-400" },
    { id: "purple", hex: "#9333ea", label: "Imperial", ringClass: "ring-purple-400" },
    { id: "gold", hex: "#eab308", label: "Solar Gold", ringClass: "ring-amber-300" },
    { id: "copper", hex: "#ea580c", label: "Forge", ringClass: "ring-orange-400" },
    { id: "black", hex: "#1e293b", label: "Obsidian", ringClass: "ring-slate-400" },
  ];

  const SYMBOLS_LIST: { id: ClanShieldSymbol; label: string; icon: string }[] = [
    { id: "swords", label: "Swords", icon: "⚔️" },
    { id: "crown", label: "Crown", icon: "👑" },
    { id: "dragon", label: "Dragon", icon: "🐉" },
    { id: "skull", label: "Skull", icon: "💀" },
    { id: "lightning", label: "Lightning", icon: "⚡" },
    { id: "code", label: "Code", icon: "💻" },
    { id: "star", label: "Star", icon: "⭐" },
    { id: "flame", label: "Flame", icon: "🔥" },
    { id: "axe", label: "Battleaxe", icon: "🪓" },
    { id: "shield", label: "Aegis", icon: "🛡️" },
    { id: "tower", label: "Fortress", icon: "🏰" },
    { id: "arrows", label: "War Bow", icon: "🏹" },
  ];

  const clanScore = currentClan ? (currentClan.totalTrophies ?? currentClan.totalXp) : 0;
  const clanReq = currentClan ? (currentClan.requiredTrophies ?? currentClan.requiredXp) : 0;

  // Sorted members
  const sortedMembers = currentClan
    ? currentClan.members.slice().sort((a, b) => {
        const aVal = a.isCurrentUser ? currentUserXp : (a.trophies ?? a.xp ?? 0);
        const bVal = b.isCurrentUser ? currentUserXp : (b.trophies ?? b.xp ?? 0);
        return bVal - aVal;
      })
    : [];

  return (
    <div className="w-full flex-1 flex flex-col select-none text-left text-white transition-colors duration-500 pb-12 relative min-h-screen">
      {/* =========================================================================
          HERO CLAN HEADER CARD (Styled matching the exact .league from Leaderboard.html)
          ========================================================================= */}
      {currentClan ? (
        <div
          className="league-card fade in"
          style={{
            borderColor: clanTheme.customHex,
            background: "#121418",
          }}
        >
          {/* Ambient radial glow top right corner */}
          <div
            className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none opacity-40 blur-3xl"
            style={{ background: clanTheme.customHex }}
          />

          <div className="lrow">
            {/* Tilted Crest Badge with Clan Shield */}
            <div
              className="badge-crest relative"
              style={{
                background: `linear-gradient(135deg, ${clanTheme.customHex}, #000000)`,
                boxShadow: `0 0 35px ${clanTheme.glowColor}, inset 4px 4px 10px rgba(255,255,255,.4), inset -6px -6px 12px rgba(0,0,0,.5)`,
              }}
            >
              <div className="transform -rotate-12">
                <ClanShield
                  shape={currentClan.shieldShape || "banner"}
                  pattern={currentClan.shieldPattern || "solid"}
                  color={currentClan.shieldColor}
                  symbol={currentClan.shieldSymbol}
                  size="sm"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px] border border-amber-200 shadow-md">
                LVL {calculateClanLevel(currentClan)}
              </div>
            </div>

            {/* Clan Title & Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <small className="k text-[0.7rem] uppercase tracking-widest text-slate-400 font-bold block">
                  YOUR CLAN · LVL {calculateClanLevel(currentClan)} · {currentClan.type}
                </small>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-bold border border-white/15">
                    {currentClan.tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(currentClan.tag);
                      onShowToast("📋 Copied Clan Tag!");
                    }}
                    title="Copy Clan Tag"
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all active:scale-95"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="lname font-extrabold uppercase text-white truncate text-xl sm:text-2xl mt-0.5 tracking-tight">
                {currentClan.name}
              </div>

              <div className="lmeta text-xs sm:text-sm text-slate-300 uppercase tracking-wider mt-1">
                <b className="font-bold text-amber-300">
                  {currentClan.members.length}
                </b>{" "}
                members ·{" "}
                <b className="font-bold text-amber-400">
                  {clanScore.toLocaleString()}
                </b>{" "}
                trophies · {currentClan.location}
              </div>
            </div>
          </div>

          {/* Clan Motto */}
          {currentClan.description && (
            <p className="text-xs text-slate-300/80 italic mt-3 line-clamp-1 border-t border-white/10 pt-2.5">
              "{currentClan.description}"
            </p>
          )}

          {/* Clan War Progress Bar */}
          <div className="prog mt-3.5">
            <div className="top flex justify-between text-[0.72rem] uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
              <span>Weekly Clan Chest Tier III</span>
              <span className="text-amber-300 font-mono">
                {Math.min(100, Math.round((clanScore / 6000) * 100))}% (
                {Math.max(0, 6000 - clanScore)} to go)
              </span>
            </div>
            <div className="bar-lb">
              <i
                style={{
                  width: `${Math.min(100, Math.max(8, Math.round((clanScore / 6000) * 100)))}%`,
                  background: `linear-gradient(90deg, ${clanTheme.customHex}, #fbbf24)`,
                }}
              />
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-1 border-t border-white/10">
            <button
              onClick={() => setShowInviteModal(true)}
              className="py-2.5 px-2 rounded-full font-black text-[11px] uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>Invite</span>
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="py-2.5 px-2 rounded-full font-black text-[11px] uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Settings className="w-3.5 h-3.5 text-sky-400" />
              <span>Crest</span>
            </button>
            <button
              onClick={() => setShowLeaveConfirmModal(true)}
              className="py-2.5 px-2 rounded-full font-black text-[11px] uppercase tracking-wider bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Leave</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty State (Not in a Clan) - Default Blue Theme & Glow */
        <div
          className="league-card fade in text-center py-8 relative overflow-hidden"
          style={{
            borderColor: clanTheme.customHex,
            background: "#121418",
          }}
        >
          {/* Ambient radial glow top right corner */}
          <div
            className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none opacity-40 blur-3xl"
            style={{ background: clanTheme.customHex }}
          />

          <div
            className="w-16 h-16 mx-auto rounded-3xl border-2 flex items-center justify-center mb-4 transition-colors"
            style={{
              backgroundColor: "rgba(2, 132, 199, 0.12)",
              borderColor: clanTheme.customHex,
              color: clanTheme.customHex,
              boxShadow: `0 0 30px ${clanTheme.glowColor}`,
            }}
          >
            <Shield className="w-8 h-8 stroke-[1.8]" />
          </div>
          <small className="k text-slate-400 font-bold uppercase tracking-widest block">
            CLAN SYSTEM
          </small>
          <h2 className="lname text-2xl font-black uppercase text-white mt-1">
            You Are Not in a Clan
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
            Join forces with fellow scholars to conquer weekly clan wars, unlock the collective Clan Chest, and share tips!
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 max-w-xs mx-auto">
            <button
              onClick={() => setClanSubTab("search")}
              className="lb-btn !mt-0 !py-3 !px-5 text-xs font-black"
            >
              Find a Clan
            </button>
            <button
              onClick={() => setClanSubTab("create")}
              className="py-3 px-5 rounded-full border-2 border-white/20 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
            >
              Create New
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TABS SWITCHER (Exact .pills and .pill styling from Leaderboard.html)
          ========================================================================= */}
      <div className="seg my-4 flex items-center justify-center">
        <div className="pills flex items-center gap-1 p-1 rounded-full border-2 border-white/15 bg-[#121418] max-w-full overflow-x-auto shadow-lg">
          {currentClan && (
            <>
              <button
                onClick={() => setClanSubTab("clan")}
                className={`pill ${clanSubTab === "clan" ? "on" : ""}`}
                id="tab-my-clan"
              >
                ROSTER
              </button>
              <button
                onClick={() => setClanSubTab("chat")}
                className={`pill ${clanSubTab === "chat" ? "on" : ""}`}
                id="tab-clan-chat"
              >
                CHAT
              </button>
            </>
          )}
          <button
            onClick={() => setClanSubTab("search")}
            className={`pill ${clanSubTab === "search" ? "on" : ""}`}
            id="tab-search-clan"
          >
            JOIN BY CODE
          </button>
          <button
            onClick={() => setClanSubTab("create")}
            className={`pill ${clanSubTab === "create" ? "on" : ""}`}
            id="tab-create-clan"
          >
            CREATE
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: ROSTER & MEMBERS (Game-Ready Dark UI with League Emblems & Full Info)
          ========================================================================= */}
      {clanSubTab === "clan" && currentClan && (
        <div className="space-y-4">
          {/* THE ROSTER CARD: APP GAMING STYLE */}
          <div
            className="rounded-[32px] p-4 sm:p-6 border-2 shadow-2xl space-y-4 transition-all"
            style={{
              backgroundColor: "#121418",
              borderColor: clanTheme.customHex,
              boxShadow: `0 4px 24px rgba(0,0,0,0.85), 0 0 20px ${clanTheme.glowColor}`,
            }}
          >
            {/* Top Bar with Member count & Invite action */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="font-black text-sm uppercase tracking-wider text-white font-kanit">
                  CLAN ROSTER ({currentClan.members.length}/{currentClan.maxMembers})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-300 hidden sm:inline">
                  🏆 {clanScore.toLocaleString()} Total Trophies
                </span>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="text-xs font-black text-sky-400 hover:text-sky-300 tracking-wide uppercase cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Invite</span>
                </button>
              </div>
            </div>

            {/* Member List items with full information density */}
            <div className="space-y-2.5">
              {sortedMembers.map((member, index) => {
                const rankNum = index + 1;
                const memberTrophies = member.isCurrentUser
                  ? currentUserXp
                  : (member.trophies ?? member.xp ?? 0);
                const leagueTier = getLeagueForTrophies(memberTrophies);
                const isTop1 = rankNum === 1;
                const isTop2 = rankNum === 2;
                const isTop3 = rankNum === 3;

                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className="group rounded-2xl p-3 sm:p-3.5 bg-[#161a22] hover:bg-[#1c222c] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center gap-3 sm:gap-4"
                  >
                    {/* Podium Rank Badge */}
                    <div className="shrink-0 flex items-center justify-center">
                      {isTop1 ? (
                        <div
                          className="w-8 h-8 rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.6)] border border-amber-200"
                          title="Rank #1 Leaderboard"
                        >
                          👑
                        </div>
                      ) : isTop2 ? (
                        <div
                          className="w-8 h-8 rounded-xl bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-[0_0_10px_rgba(203,213,225,0.4)] border border-white"
                          title="Rank #2"
                        >
                          2
                        </div>
                      ) : isTop3 ? (
                        <div
                          className="w-8 h-8 rounded-xl bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 text-amber-100 font-black text-xs sm:text-sm flex items-center justify-center shadow-[0_0_10px_rgba(180,83,9,0.4)] border border-amber-600"
                          title="Rank #3"
                        >
                          3
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-white/5 text-slate-400 font-black text-xs flex items-center justify-center border border-white/10 font-mono">
                          {rankNum}
                        </div>
                      )}
                    </div>

                    {/* Member Avatar with online status */}
                    <div className="relative shrink-0">
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm text-white shadow-md border-2 border-white/15"
                        style={{
                          backgroundColor:
                            member.avatarBg || getAvatarBg(member.name),
                        }}
                      >
                        {getInitials(member.name)}
                      </div>
                      {/* Active status pulse dot */}
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#161a22]" />
                    </div>

                    {/* Member Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-black text-sm sm:text-base uppercase text-white truncate font-kanit">
                          {member.name}
                        </h3>
                        {member.isCurrentUser && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                            YOU
                          </span>
                        )}
                        {/* Distinct Colored Role Badge */}
                        {member.role === "Leader" ? (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                            <Crown className="w-2.5 h-2.5" />
                            <span>LEADER</span>
                          </span>
                        ) : member.role === "Co-Leader" ? (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center gap-1">
                            <Swords className="w-2.5 h-2.5" />
                            <span>CO-LEADER</span>
                          </span>
                        ) : member.role === "Elder" ? (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5" />
                            <span>ELDER</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
                            MEMBER
                          </span>
                        )}
                      </div>

                      {/* Donations & Activity */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-slate-300">
                          <MessageSquare className="w-3 h-3 text-sky-400" />
                          <span>{member.donations} reviews donated</span>
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-emerald-400/90 font-medium">
                          Active today
                        </span>
                      </div>
                    </div>

                    {/* League Emblem & League Tier */}
                    <div className="hidden sm:flex items-center gap-2 shrink-0 px-2 py-1 rounded-xl bg-black/40 border border-white/5">
                      <LeagueEmblem
                        leagueId={leagueTier.id}
                        subTier={leagueTier.subTier}
                        size="sm"
                      />
                      <div className="text-left">
                        <span
                          className="text-[11px] font-black uppercase tracking-wide block leading-tight font-kanit"
                          style={{ color: leagueTier.badgeColor }}
                        >
                          {leagueTier.fullName}
                        </span>
                        <span className="text-[9px] text-slate-500 uppercase font-mono">
                          +{leagueTier.bonusPercentage}% XP Bonus
                        </span>
                      </div>
                    </div>

                    {/* Trophies & View Profile Button */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
                        <div className="font-mono font-black text-sm sm:text-base text-amber-300 flex items-center justify-end gap-1">
                          <span>🏆</span>
                          <span>{memberTrophies.toLocaleString()}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">
                          Trophies
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMember(member);
                        }}
                        className="rounded-xl bg-white/10 hover:bg-white/20 active:translate-y-0.5 border border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white cursor-pointer transition-all shrink-0"
                      >
                        VIEW
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CLAN CHECKLIST & WAR PERKS: EXACT STYLE OF PROFILE CHECKLIST FROM USER SCREENSHOT */}
          <div className="rounded-[32px] p-5 sm:p-6 border border-white/10 bg-[#121418] shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm uppercase tracking-wider text-white">
                CLAN PERKS & WAR GOALS
              </h3>
              <span className="text-xs font-black text-sky-400 font-mono">
                PROGRESS: 3 / 4 COMPLETED (75%)
              </span>
            </div>

            {/* Sleek Blue Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden my-3">
              <div className="h-full rounded-full bg-sky-500 w-[75%] shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
            </div>

            {/* Checklist Items with Rounded Inner Cards */}
            <div className="space-y-2 mt-4">
              {/* Item 1 */}
              <div className="rounded-2xl p-3 bg-[#1a1d24] border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-white">
                      CUSTOM HERALDIC CREST
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Custom banner & colors for leaderboards
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">
                  COMPLETED
                </span>
              </div>

              {/* Item 2 */}
              <div className="rounded-2xl p-3 bg-[#1a1d24] border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-white">
                      XP MULTIPLIER BOOST
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      +15% bonus experience earned in practice
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">
                  COMPLETED
                </span>
              </div>

              {/* Item 3 */}
              <div className="rounded-2xl p-3 bg-[#1a1d24] border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-white">
                      PEER CODE REVIEWS
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Donations and review requests active
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">
                  COMPLETED
                </span>
              </div>

              {/* Item 4 */}
              <div className="rounded-2xl p-3 bg-[#1a1d24] border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-white/20 shrink-0" />
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-white">
                      LEGENDARY WAR CHEST
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Reach 6,000 trophies to open season vault
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onShowToast("⚔️ Play practice matches to earn trophies for the chest!")}
                  className="rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3 py-1 text-[10px] font-black uppercase tracking-wider hover:bg-sky-500/30 cursor-pointer"
                >
                  BATTLE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: CLAN CHAT & ACTIVITY (Interactive Esports Room)
          ========================================================================= */}
      {clanSubTab === "chat" && currentClan && (
        <div className="space-y-3">
          <div className="rounded-[32px] p-4 sm:p-5 border border-white/10 bg-[#121418] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span className="font-black text-sm uppercase tracking-wider text-white">
                  CLAN ROOM · {currentClan.name}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {currentClan.members.length} Online
              </span>
            </div>

            {/* Quick Preset Reactions */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                "GG! 🔥",
                "Pushing trophies! 🏆",
                "Code battle? ⚔️",
                "Code review needed! 💻",
                "Clash war ready! 🛡️",
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSendMessage(preset)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 cursor-pointer active:scale-95 transition-all"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Messages Feed */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {(currentClan.messages && currentClan.messages.length > 0) ? (
                currentClan.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.isSystem
                        ? "bg-amber-400/10 border border-amber-400/30 text-amber-200"
                        : "bg-[#1a1d24] border border-white/5 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold uppercase text-white">
                          {msg.senderName}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                          {msg.senderRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{msg.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No messages yet. Send a shoutout to your clan!
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 pt-2 border-t border-white/10"
            >
              <input
                type="text"
                placeholder="Type a message to clan members..."
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-full bg-[#1a1d24] border border-white/15 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-400 font-sans"
              />
              <button
                type="submit"
                disabled={!newChatText.trim()}
                className="px-4 py-2.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-300 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: JOIN CLAN BY UNIQUE CODE (Backend Stored Unique ID / Tag)
          ========================================================================= */}
      {clanSubTab === "search" && (
        <div className="space-y-4">
          <div
            className="rounded-[32px] p-6 sm:p-8 border-2 shadow-2xl space-y-5 text-center relative overflow-hidden"
            style={{
              backgroundColor: "#121418",
              borderColor: clanTheme.customHex,
              boxShadow: `0 4px 24px rgba(0,0,0,0.85), 0 0 20px ${clanTheme.glowColor}`,
            }}
          >
            {/* Ambient radial glow */}
            <div
              className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none opacity-40 blur-3xl"
              style={{ background: clanTheme.customHex }}
            />

            <div
              className="w-16 h-16 mx-auto rounded-3xl border-2 flex items-center justify-center mb-2 relative z-10"
              style={{
                backgroundColor: "rgba(2, 132, 199, 0.12)",
                borderColor: clanTheme.customHex,
                color: clanTheme.customHex,
              }}
            >
              <Hash className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-kanit">
                JOIN CLAN BY UNIQUE CODE
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                Every clan has a unique code/tag stored securely in the backend (e.g. <strong className="text-amber-300 font-mono">#2Y9VLL8Q</strong>). Enter the exact code below to open and join the clan!
              </p>
            </div>

            <form onSubmit={handleJoinByCodeSubmit} className="max-w-md mx-auto space-y-3.5 pt-2 relative z-10">
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                <input
                  type="text"
                  placeholder="Enter Clan Code or Tag (e.g. #2Y9VLL8Q)"
                  value={joinClanCodeInput}
                  onChange={(e) => setJoinClanCodeInput(e.target.value.toUpperCase())}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#161a22] border-2 border-white/20 text-white placeholder:text-slate-500 font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 border-b-4 border-amber-700 active:translate-y-0.5 text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_18px_rgba(245,158,11,0.4)] transition-all"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>FIND & OPEN CLAN</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: CREATE CLAN (App Style with Hero Crest Studio & Tactile Controls)
          ========================================================================= */}
      {clanSubTab === "create" && (
        <form
          onSubmit={handleCreateClanSubmit}
          className="rounded-[36px] p-5 sm:p-7 border-2 shadow-2xl space-y-5 transition-all text-left"
          style={{
            backgroundColor: "#121418",
            borderColor: clanTheme.customHex,
            boxShadow: `0 8px 32px rgba(0,0,0,0.85), 0 0 25px ${clanTheme.glowColor}`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-md"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderColor: clanTheme.customHex,
                  color: clanTheme.customHex,
                }}
              >
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-kanit leading-tight">
                  CLAN CREATION FORGE
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  Design your crest & assemble your algorithmic squad
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
              ✨ 100% Free
            </span>
          </div>

          {/* =========================================================================
              HERO CREST STUDIO SHOWCASE (Live 3D Pedestal Stage)
              ========================================================================= */}
          <div
            className="rounded-3xl p-5 sm:p-6 border border-white/15 relative overflow-hidden flex flex-col items-center gap-5"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${clanTheme.customHex}25 0%, #0d1017 75%)`,
            }}
          >
            {/* Ambient Background Glow Behind Shield */}
            <div
              className="absolute w-44 h-44 rounded-full pointer-events-none blur-3xl opacity-50"
              style={{ backgroundColor: clanTheme.customHex }}
            />

            {/* Pedestal & Shield */}
            <div className="relative flex flex-col items-center z-10">
              <div className="transform transition-transform hover:scale-105 duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                <ClanShield
                  shape={newClanShape}
                  pattern={newClanPattern}
                  color={newClanColor}
                  symbol={newClanSymbol}
                  size="xl"
                  showGlow={true}
                />
              </div>

              {/* Clan Name Live Badge */}
              <div className="mt-3 text-center">
                <h4 className="font-black text-lg sm:text-xl uppercase text-white tracking-wide font-kanit drop-shadow-md">
                  {newClanName.trim().toUpperCase() || "YOUR CLAN NAME"}
                </h4>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15">
                    #CLAN-PREVIEW
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {newClanType} · {newClanLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Studio Navigation Pills: Shape, Pattern, Color, Emblem */}
            <div className="w-full space-y-3 z-10">
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/60 border border-white/15 shadow-inner">
                {(
                  [
                    { id: "shape", label: "Shape", icon: Shapes },
                    { id: "pattern", label: "Pattern", icon: Layers },
                    { id: "color", label: "Color", icon: Palette },
                    { id: "symbol", label: "Emblem", icon: Crown },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeShieldTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveShieldTab(tab.id)}
                      className={`flex-1 py-2 px-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                        isActive
                          ? "bg-amber-400 text-slate-950 font-black shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 1. SHAPES PICKER */}
              {activeShieldTab === "shape" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SHAPES_LIST.map((sh) => {
                    const isSelected = newClanShape === sh.id;
                    return (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() => setNewClanShape(sh.id)}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black"
                            : "bg-[#161a22] hover:bg-[#1d232e] text-white border-white/10 hover:border-white/20"
                        }`}
                      >
                        <ClanShield
                          shape={sh.id}
                          pattern={newClanPattern}
                          color={newClanColor}
                          symbol={newClanSymbol}
                          size="xs"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-black uppercase truncate font-kanit">
                            {sh.label}
                          </span>
                          <span
                            className={`block text-[10px] truncate ${
                              isSelected ? "text-slate-800" : "text-slate-400"
                            }`}
                          >
                            {sh.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. PATTERNS PICKER */}
              {activeShieldTab === "pattern" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PATTERNS_LIST.map((pt) => {
                    const isSelected = newClanPattern === pt.id;
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => setNewClanPattern(pt.id)}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black"
                            : "bg-[#161a22] hover:bg-[#1d232e] text-white border-white/10 hover:border-white/20"
                        }`}
                      >
                        <ClanShield
                          shape={newClanShape}
                          pattern={pt.id}
                          color={newClanColor}
                          symbol={newClanSymbol}
                          size="xs"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-black uppercase truncate font-kanit">
                            {pt.label}
                          </span>
                          <span
                            className={`block text-[9px] truncate ${
                              isSelected ? "text-slate-800" : "text-slate-400"
                            }`}
                          >
                            {pt.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. COLORS PICKER */}
              {activeShieldTab === "color" && (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {COLORS_LIST.map((c) => {
                    const isSelected = newClanColor === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setNewClanColor(c.id);
                          onClanBannerColorChange?.(c.id);
                        }}
                        className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white/15 border-white shadow-lg scale-105"
                            : "bg-[#161a22] border-white/10 hover:border-white/20 hover:scale-102"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl shadow-md border-2 border-white/30 ${
                            isSelected ? "ring-2 ring-white" : ""
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[10px] font-black uppercase text-slate-300 truncate">
                          {c.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 4. EMBLEMS PICKER */}
              {activeShieldTab === "symbol" && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {SYMBOLS_LIST.map((s) => {
                    const isSelected = newClanSymbol === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setNewClanSymbol(s.id)}
                        className={`p-2 rounded-2xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black"
                            : "bg-[#161a22] hover:bg-[#1d232e] text-white border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span className="text-base">{s.icon}</span>
                        <span className="text-xs font-black uppercase truncate font-kanit">
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              FORM FIELDS: NAME, MOTTO, TYPE, REQUIRED TROPHIES, LOCATION
              ========================================================================= */}
          <div className="space-y-4 pt-2">
            {/* Clan Name Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>CLAN NAME *</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {newClanName.length} / 24 characters
                </span>
              </div>
              <input
                type="text"
                placeholder="e.g. BYTE RAIDERS, ALGO TITANS, MATRIX REBELS"
                value={newClanName}
                onChange={(e) => setNewClanName(e.target.value.toUpperCase())}
                maxLength={24}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#161a22] border-2 border-white/15 text-white text-sm font-kanit uppercase placeholder:normal-case placeholder:text-slate-500 focus:outline-none focus:border-amber-400 shadow-inner"
              />
            </div>

            {/* Clan Motto / Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  <span>CLAN MOTTO & DESCRIPTION</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {newClanDescription.length} / 140 characters
                </span>
              </div>
              <textarea
                placeholder="Tell fellow scholars about your clan's goals, daily algorithm practice schedules, and friendly coding battles..."
                value={newClanDescription}
                onChange={(e) => setNewClanDescription(e.target.value)}
                rows={2}
                maxLength={140}
                className="w-full px-4 py-3 rounded-2xl bg-[#161a22] border-2 border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none font-sans shadow-inner"
              />
            </div>

            {/* Clan Type Selector (3 Visual Cards) */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-2">
                CLAN TYPE & ADMISSION
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(
                  [
                    {
                      id: "Open",
                      title: "Open",
                      desc: "Anyone can join immediately",
                      icon: Unlock,
                    },
                    {
                      id: "Invite Only",
                      title: "Invite Only",
                      desc: "Requires leader approval",
                      icon: Mail,
                    },
                    {
                      id: "Closed",
                      title: "Closed",
                      desc: "New members not accepted",
                      icon: Lock,
                    },
                  ] as const
                ).map((t) => {
                  const Icon = t.icon;
                  const isSelected = newClanType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewClanType(t.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black"
                          : "bg-[#161a22] hover:bg-[#1c222c] text-white border-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-black uppercase font-kanit">
                          {t.title}
                        </span>
                      </div>
                      <span
                        className={`block text-[10px] leading-tight ${
                          isSelected ? "text-slate-800" : "text-slate-400"
                        }`}
                      >
                        {t.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid: Required Trophies & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Required Trophies */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>REQUIRED TROPHIES</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[0, 500, 1000, 2000, 3000, 5000].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewClanRequiredTrophies(num)}
                      className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer font-mono ${
                        newClanRequiredTrophies === num
                          ? "bg-amber-400 text-slate-950 shadow-md"
                          : "bg-[#161a22] text-slate-300 border border-white/10 hover:border-white/25"
                      }`}
                    >
                      {num === 0 ? "0 (Any)" : `${num.toLocaleString()} 🏆`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clan Location / Region */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>CLAN REGION</span>
                </label>
                <select
                  value={newClanLocation}
                  onChange={(e) => setNewClanLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#161a22] border-2 border-white/15 text-white text-xs font-medium focus:outline-none focus:border-amber-400 shadow-inner"
                >
                  <option value="International">🌐 International (Global)</option>
                  <option value="North America">🇺🇸 North America</option>
                  <option value="Europe">🇪🇺 Europe</option>
                  <option value="Asia-Pacific">🌏 Asia-Pacific</option>
                  <option value="Latin America">🌎 Latin America</option>
                  <option value="Middle East & Africa">🌍 Middle East & Africa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Create Button with app's 3D tactile button styling */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 border-b-4 border-amber-700 active:translate-y-0.5 text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-[0_6px_20px_rgba(245,158,11,0.4)] transition-all mt-4"
            id="submit-create-clan"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>CREATE CLAN (FREE)</span>
          </button>
        </form>
      )}

      {/* =========================================================================
          MODALS
          ========================================================================= */}

      {/* MODAL 1: SETTINGS & CREST CUSTOMIZER */}
      <AnimatePresence>
        {showSettingsModal && currentClan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="w-full max-w-lg bg-[#121418] border-2 border-white/15 rounded-[36px] p-5 sm:p-6 shadow-2xl text-left space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-kanit">
                    CLAN SETTINGS & CREST FORGE
                  </h3>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Clan Crest Editor */}
              <div className="bg-[#161a22] rounded-3xl p-4 border border-white/10 flex flex-col items-center gap-3">
                <ClanShield
                  shape={currentClan.shieldShape || "banner"}
                  pattern={currentClan.shieldPattern || "solid"}
                  color={currentClan.shieldColor}
                  symbol={currentClan.shieldSymbol}
                  size="lg"
                  showGlow={true}
                />
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Live Crest Preview
                </span>

                {/* Shape Picker */}
                <div className="w-full">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                    Shape
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {SHAPES_LIST.map((sh) => (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() =>
                          setCurrentClan({ ...currentClan, shieldShape: sh.id })
                        }
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-black uppercase border transition-all cursor-pointer ${
                          (currentClan.shieldShape || "banner") === sh.id
                            ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                            : "bg-[#0b0b0e] text-slate-300 border-white/10 hover:border-white/20"
                        }`}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pattern Picker */}
                <div className="w-full">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                    Pattern
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PATTERNS_LIST.map((pt) => (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() =>
                          setCurrentClan({ ...currentClan, shieldPattern: pt.id })
                        }
                        className={`py-1.5 px-1 rounded-xl text-[9px] font-black uppercase border transition-all cursor-pointer truncate ${
                          (currentClan.shieldPattern || "solid") === pt.id
                            ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                            : "bg-[#0b0b0e] text-slate-300 border-white/10 hover:border-white/20"
                        }`}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div className="w-full">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
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
                        className={`w-7 h-7 rounded-xl border-2 transition-all cursor-pointer ${
                          currentClan.shieldColor === c.id
                            ? "border-white scale-110 shadow-md ring-2 ring-white"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Symbol Picker */}
                <div className="w-full">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                    Emblem Symbol
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SYMBOLS_LIST.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() =>
                          setCurrentClan({ ...currentClan, shieldSymbol: s.id })
                        }
                        className={`py-1.5 px-1.5 rounded-xl text-[9px] font-black uppercase border transition-all truncate cursor-pointer flex items-center justify-center gap-1 ${
                          currentClan.shieldSymbol === s.id
                            ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                            : "bg-[#0b0b0e] text-slate-300 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span>{s.icon}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clan Description */}
              <div>
                <label className="text-xs font-black uppercase text-slate-300 block mb-1">
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
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#161a22] border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400 font-sans resize-none"
                />
              </div>

              {/* Required Trophies */}
              <div>
                <label className="text-xs font-black uppercase text-slate-300 block mb-1">
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
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#161a22] border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border-b-4 border-amber-700 active:translate-y-0.5 text-slate-950 cursor-pointer shadow-md transition-all"
              >
                Save Changes & Apply Crest
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: INVITE TO CLAN */}
      <AnimatePresence>
        {showInviteModal && (inviteClan || currentClan) && (() => {
          const activeClan = inviteClan || currentClan!;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                className="w-full max-w-sm bg-[#121418] border-2 border-white/15 rounded-[36px] p-5 sm:p-6 shadow-2xl text-left space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black text-white uppercase font-kanit">
                      INVITE SCHOLARS
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteClan(null);
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <ClanShield
                    shape={activeClan.shieldShape || "banner"}
                    pattern={activeClan.shieldPattern || "solid"}
                    color={activeClan.shieldColor}
                    symbol={activeClan.shieldSymbol}
                    size="xs"
                  />
                  <div className="min-w-0">
                    <h4 className="font-black text-sm text-white uppercase font-kanit truncate">
                      {activeClan.name}
                    </h4>
                    <span className="text-[10px] font-mono text-amber-300 font-bold">
                      🏆 {(activeClan.totalTrophies ?? activeClan.totalXp ?? 0).toLocaleString()} Trophies
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Recruit teammates into{" "}
                  <strong className="text-white">{activeClan.name}</strong> to push leaderboard ranks!
                </p>

                <div className="p-3.5 bg-[#1a1d24] rounded-2xl border border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Clan Tag
                    </span>
                    <span className="text-sm font-mono font-black text-amber-300">
                      {activeClan.tag}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(activeClan.tag);
                      onShowToast(`📋 Clan tag ${activeClan.tag} copied!`);
                    }}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer active:scale-95 transition-all"
                    title="Copy Tag"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `Join my coding clan "${activeClan.name}" using tag ${activeClan.tag} in Scholar Battles!`
                    );
                    onShowToast("🔗 Shareable invite copied!");
                    setShowInviteModal(false);
                    setInviteClan(null);
                  }}
                  className="lb-btn w-full !py-3 font-black text-xs uppercase"
                >
                  Copy Invite Message
                </button>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* MODAL 3: LEAVE CLAN CONFIRMATION */}
      <AnimatePresence>
        {showLeaveConfirmModal && currentClan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="w-full max-w-sm bg-[#121418] border-2 border-rose-500/40 rounded-[36px] p-5 sm:p-6 shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center gap-2 text-rose-400">
                <LogOut className="w-5 h-5" />
                <h3 className="text-sm font-black text-white uppercase font-kanit">
                  LEAVE CLAN?
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to leave{" "}
                <strong className="text-white">{currentClan.name}</strong>? You
                will forfeit active clan war perks and collective chest rewards.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowLeaveConfirmModal(false)}
                  className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveClan}
                  className="flex-1 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                >
                  Leave Clan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: MEMBER ACTION POPOVER */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="w-full max-w-sm bg-[#121418] border-2 border-white/15 rounded-[36px] p-5 sm:p-6 shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs text-white shrink-0"
                    style={{
                      backgroundColor:
                        selectedMember.avatarBg || getAvatarBg(selectedMember.name),
                    }}
                  >
                    {getInitials(selectedMember.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white font-kanit">
                      {selectedMember.name}
                    </h3>
                    <span className="text-[10px] font-bold text-amber-400 uppercase">
                      {selectedMember.role} • 🏆 {selectedMember.isCurrentUser ? currentUserXp : (selectedMember.trophies ?? selectedMember.xp ?? 0)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onShowToast(`⚔️ Friendly coding challenge sent to ${selectedMember.name}!`);
                    setSelectedMember(null);
                  }}
                  className="lb-btn w-full !py-3 !mt-0 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  <span>Friendly Coding Battle</span>
                </button>

                {!selectedMember.isCurrentUser && (
                  <>
                    <button
                      onClick={() => handlePromoteMember(selectedMember, "Elder")}
                      className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-black text-xs uppercase cursor-pointer transition-all active:scale-95"
                    >
                      Promote to Elder
                    </button>
                    <button
                      onClick={() => handlePromoteMember(selectedMember, "Co-Leader")}
                      className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-black text-xs uppercase cursor-pointer transition-all active:scale-95"
                    >
                      Promote to Co-Leader
                    </button>
                    <button
                      onClick={() => handleKickMember(selectedMember)}
                      className="w-full py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-black text-xs uppercase border border-rose-500/30 cursor-pointer transition-all active:scale-95"
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

      {/* =========================================================================
          MODAL 5: CR / COC STYLE CLAN PROFILE INSPECTION MODAL
          ========================================================================= */}
      <AnimatePresence>
        {inspectedClan && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 pb-24 sm:pb-6 bg-black/95 backdrop-blur-md overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="w-full max-w-2xl bg-[#121418] border-2 rounded-[28px] sm:rounded-[36px] shadow-2xl text-left overflow-hidden max-h-[calc(100dvh-6.5rem)] sm:max-h-[86vh] flex flex-col my-auto"
              style={{
                borderColor: getClanTheme(inspectedClan.shieldColor).customHex,
                boxShadow: `0 8px 36px rgba(0,0,0,0.9), 0 0 30px ${getClanTheme(inspectedClan.shieldColor).glowColor}`,
              }}
            >
              {/* Header Banner - Clash Royale Style with Crest Backdrop & Shield */}
              <div
                className="relative p-6 sm:p-8 border-b border-white/10 flex flex-col items-center text-center overflow-hidden"
                style={{
                  background: `radial-gradient(ellipse at 50% 20%, ${getClanTheme(inspectedClan.shieldColor).glowColor} 0%, rgba(18,20,24,0.95) 75%), #121418`,
                }}
              >
                {/* Top Left Clan Tag with Quick Copy */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15">
                    {inspectedClan.tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(inspectedClan.tag);
                      onShowToast(`📋 Copied ${inspectedClan.tag}`);
                    }}
                    title="Copy Clan Tag"
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Top Right Close Button */}
                <button
                  type="button"
                  onClick={() => setInspectedClan(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Hero 3D Clan Crest */}
                <div className="mb-3 transform hover:scale-105 transition-transform duration-300 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                  <ClanShield
                    shape={inspectedClan.shieldShape || "banner"}
                    pattern={inspectedClan.shieldPattern || "solid"}
                    color={inspectedClan.shieldColor}
                    symbol={inspectedClan.shieldSymbol}
                    size="lg"
                    showGlow={true}
                  />
                </div>

                {/* Clan Title */}
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-kanit drop-shadow-md">
                  {inspectedClan.name}
                </h2>

                {/* Badges Row: Type & Region */}
                <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                      inspectedClan.type === "Open"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : inspectedClan.type === "Invite Only"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    }`}
                  >
                    {inspectedClan.type === "Open" ? (
                      <Unlock className="w-3 h-3" />
                    ) : inspectedClan.type === "Invite Only" ? (
                      <Mail className="w-3 h-3" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    <span>{inspectedClan.type}</span>
                  </span>

                  <span className="text-[11px] font-semibold text-slate-300 bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Globe className="w-3 h-3 text-sky-400" />
                    <span>{inspectedClan.location}</span>
                  </span>
                </div>
              </div>

              {/* Scrollable Content: Stats Grid, Motto, and Full Roster */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* 4-Box Key Stats Grid (Authentic CR/COC Clan Profile Bar) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-[#161a22] border border-white/10 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                      Clan Trophies
                    </span>
                    <div className="text-base sm:text-lg font-black font-mono text-amber-300 flex items-center justify-center gap-1">
                      <span>🏆</span>
                      <span>{(inspectedClan.totalTrophies ?? inspectedClan.totalXp ?? 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-[#161a22] border border-white/10 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                      Required
                    </span>
                    <div className="text-base sm:text-lg font-black font-mono text-white flex items-center justify-center gap-1">
                      <span>🏆</span>
                      <span>{(inspectedClan.requiredTrophies ?? inspectedClan.requiredXp ?? 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-[#161a22] border border-white/10 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                      Members
                    </span>
                    <div className="text-base sm:text-lg font-black font-mono text-sky-400 flex items-center justify-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{inspectedClan.members.length} / {inspectedClan.maxMembers}</span>
                    </div>
                  </div>

                  <div className="bg-[#161a22] border border-white/10 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                      Weekly War XP
                    </span>
                    <div className="text-base sm:text-lg font-black font-mono text-emerald-400 flex items-center justify-center gap-1">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span>{inspectedClan.donationsWeekly?.toLocaleString() ?? 0}</span>
                    </div>
                  </div>
                </div>

                {/* Clan Motto / Description Quote */}
                {inspectedClan.description && (
                  <div className="bg-[#161a22] border border-white/10 rounded-2xl p-3.5 relative">
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>CLAN MOTTO & OBJECTIVES</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed pl-2 border-l-2 border-amber-400/60">
                      "{inspectedClan.description}"
                    </p>
                  </div>
                )}

                {/* Clan Roster Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-sky-400" />
                      <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider font-kanit">
                        CLAN ROSTER ({inspectedClan.members.length} / {inspectedClan.maxMembers})
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      RANKED BY TROPHIES 🏆
                    </span>
                  </div>

                  {/* Members list sorted by trophies */}
                  <div className="space-y-2">
                    {inspectedClan.members
                      .slice()
                      .sort((a, b) => {
                        const aScore = a.isCurrentUser ? currentUserXp : (a.trophies ?? a.xp ?? 0);
                        const bScore = b.isCurrentUser ? currentUserXp : (b.trophies ?? b.xp ?? 0);
                        return bScore - aScore;
                      })
                      .map((member, idx) => {
                        const memberScore = member.isCurrentUser ? currentUserXp : (member.trophies ?? member.xp ?? 0);
                        const league = getLeagueForTrophies(memberScore);
                        const isRank1 = idx === 0;
                        const isRank2 = idx === 1;
                        const isRank3 = idx === 2;

                        return (
                          <div
                            key={member.id}
                            className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all ${
                              member.isCurrentUser
                                ? "bg-amber-400/10 border-amber-400/40"
                                : "bg-[#161a22] border-white/10 hover:border-white/20"
                            }`}
                          >
                            {/* Left: Rank, Avatar, Name & Role */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-6 text-center font-mono font-black text-xs">
                                {isRank1 ? "👑" : isRank2 ? "🥈" : isRank3 ? "🥉" : `#${idx + 1}`}
                              </span>

                              {/* Member Avatar */}
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white shrink-0 border border-white/20 shadow-sm"
                                style={{
                                  backgroundColor:
                                    member.avatarBg || getAvatarBg(member.name),
                                }}
                              >
                                {getInitials(member.name)}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-black text-xs sm:text-sm text-white truncate">
                                    {member.name}
                                  </span>
                                  {member.isCurrentUser && (
                                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span
                                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full border ${
                                      member.role === "Leader"
                                        ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                                        : member.role === "Co-Leader"
                                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                        : member.role === "Elder"
                                        ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                                        : "bg-white/5 text-slate-400 border-white/10"
                                    }`}
                                  >
                                    {member.role === "Leader" && "👑 "}
                                    {member.role === "Co-Leader" && "⚔️ "}
                                    {member.role === "Elder" && "🛡️ "}
                                    {member.role}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    ⚡ {member.donations} XP
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Right: League Emblem & Trophies */}
                            <div className="flex items-center gap-2 shrink-0">
                              <LeagueEmblem leagueId={league.id} size="xs" showGlow={false} />
                              <div className="text-right">
                                <div className="font-mono font-black text-xs sm:text-sm text-amber-300 flex items-center justify-end gap-1">
                                  <span>🏆</span>
                                  <span>{memberScore.toLocaleString()}</span>
                                </div>
                                <span className="text-[9px] text-slate-400 font-mono uppercase block">
                                  {league.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0c0e12] flex items-center justify-between gap-2 shrink-0 z-20">
                <button
                  type="button"
                  onClick={() => setInspectedClan(null)}
                  className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  Close
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end min-w-0">
                  {/* Invite button */}
                  <button
                    type="button"
                    onClick={() => {
                      setInviteClan(inspectedClan);
                      setShowInviteModal(true);
                      navigator.clipboard?.writeText(
                        `Join the clan "${inspectedClan.name}" with Clan Tag ${inspectedClan.tag} in Scholar Battles!`
                      );
                      onShowToast(`🔗 Copied invite for ${inspectedClan.name}!`);
                    }}
                    className="px-3 sm:px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Invite</span>
                  </button>

                  {/* Join / Ask to Join action */}
                  {currentClan?.id === inspectedClan.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        setInspectedClan(null);
                        setClanSubTab("clan");
                      }}
                      className="px-4 sm:px-5 py-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Your Clan</span>
                    </button>
                  ) : inspectedClan.members.length >= inspectedClan.maxMembers ? (
                    <span className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-white/5 text-slate-500 border border-white/10 font-black text-xs uppercase tracking-wider cursor-not-allowed shrink-0">
                      Clan Full (50/50)
                    </span>
                  ) : inspectedClan.type === "Closed" ? (
                    <span className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black text-xs uppercase tracking-wider cursor-not-allowed shrink-0">
                      Closed
                    </span>
                  ) : currentUserXp >= (inspectedClan.requiredTrophies ?? inspectedClan.requiredXp ?? 0) ? (
                    inspectedClan.type === "Invite Only" ? (
                      requestedClanIds.includes(inspectedClan.id) ? (
                        <span className="px-4 sm:px-5 py-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Request Sent</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAskToJoin(inspectedClan)}
                          className="px-4 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 border-b-4 border-amber-800 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 cursor-pointer active:translate-y-0.5 transition-all shadow-[0_4px_18px_rgba(245,158,11,0.4)] shrink-0"
                        >
                          <Mail className="w-4 h-4 stroke-[2.5]" />
                          <span>Ask to Join</span>
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          handleJoinClan(inspectedClan);
                          setInspectedClan(null);
                        }}
                        className="px-4 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 border-b-4 border-teal-800 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 cursor-pointer active:translate-y-0.5 transition-all shadow-[0_4px_18px_rgba(16,185,129,0.4)] shrink-0"
                      >
                        <Sparkles className="w-4 h-4 stroke-[2.5]" />
                        <span>Join Clan</span>
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onShowToast(
                          `⚠️ You need ${((inspectedClan.requiredTrophies ?? inspectedClan.requiredXp ?? 0) - currentUserXp).toLocaleString()} more 🏆 to join ${inspectedClan.name}!`
                        )
                      }
                      className="px-3.5 py-2.5 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/30 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Req: {(inspectedClan.requiredTrophies ?? inspectedClan.requiredXp ?? 0).toLocaleString()} 🏆</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
