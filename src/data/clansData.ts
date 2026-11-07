import {
  ClanShieldColor,
  ClanShieldSymbol,
  ClanShieldShape,
  ClanShieldPattern,
} from "../components/home/ClanShield";
import { LeagueId } from "./leaguesData";

export type ClanRole = "Leader" | "Co-Leader" | "Elder" | "Member";
export type ClanType = "Open" | "Invite Only" | "Closed";

export interface ClanMember {
  id: string;
  name: string;
  role: ClanRole;
  trophies?: number; // Core Ranking metric
  xp: number; // Trophies / XP value
  donations: number; // Weekly code reviews given
  leagueId: LeagueId;
  avatarType?: "circle-letter" | "custom" | string;
  avatarBg?: string;
  avatarLetter?: string;
  isCurrentUser?: boolean;
}

export interface ClanMessage {
  id: string;
  senderName: string;
  senderRole: ClanRole;
  message: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface ClanData {
  id: string;
  name: string;
  tag: string;
  description: string;
  shieldShape?: ClanShieldShape;
  shieldPattern?: ClanShieldPattern;
  shieldColor: ClanShieldColor;
  shieldSymbol: ClanShieldSymbol;
  level?: number;
  totalTrophies?: number;
  totalXp: number; // Clan score / trophies
  requiredTrophies?: number;
  requiredXp: number;
  donationsWeekly: number;
  location: string;
  type: ClanType;
  maxMembers: number;
  members: ClanMember[];
  messages: ClanMessage[];
}

export const DEFAULT_CLANS: ClanData[] = [];

const LOCAL_STORAGE_KEY_CURRENT_CLAN = "aifluence_active_clan";
const LOCAL_STORAGE_KEY_ALL_CLANS = "aifluence_all_clans";

/**
 * Load user's active clan, fallback to default LARGEGAMER.COM clan matching screenshot
 */
export function getStoredCurrentClan(): ClanData | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_CLAN);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) return parsed;
    }
  } catch (e) {
    console.error("Error reading stored clan:", e);
  }
  return null;
}

export function saveCurrentClan(clan: ClanData | null): void {
  try {
    if (clan) {
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_CLAN, JSON.stringify(clan));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_CLAN);
    }
  } catch (e) {
    console.error("Error saving current clan:", e);
  }
}

export function getStoredAllClans(): ClanData[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ALL_CLANS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading all clans:", e);
  }
  return DEFAULT_CLANS;
}

export function saveAllClans(clans: ClanData[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_ALL_CLANS, JSON.stringify(clans));
  } catch (e) {
    console.error("Error saving all clans:", e);
  }
}
