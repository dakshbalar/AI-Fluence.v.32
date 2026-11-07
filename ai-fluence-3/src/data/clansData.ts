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

export const DEFAULT_CLANS: ClanData[] = [
  {
    id: "clan-largegamer",
    name: "LARGEGAMER.COM",
    tag: "#2Y9VLL8Q",
    description:
      "We treat players with respect 🫡 We kick inactive accounts, we expect you to participate to War ⚔️ Apart from that we Chill 😎",
    shieldColor: "blue",
    shieldSymbol: "arrows",
    totalXp: 2019,
    requiredXp: 7000,
    donationsWeekly: 1312,
    location: "International",
    type: "Open",
    maxMembers: 50,
    members: [
      {
        id: "m-1",
        name: "OR30Ma$t3R DOLO",
        role: "Co-Leader",
        xp: 9000,
        donations: 16,
        leagueId: "champion",
        avatarType: "beard-guy",
      },
      {
        id: "m-2",
        name: "TaNguita®",
        role: "Member",
        xp: 9000,
        donations: 0,
        leagueId: "master",
        avatarType: "circle-letter",
        avatarBg: "#0284c7",
        avatarLetter: "T",
      },
      {
        id: "m-3",
        name: "GUILTYちゃん",
        role: "Member",
        xp: 9000,
        donations: 16,
        leagueId: "master",
        avatarType: "glasses-girl",
      },
      {
        id: "m-4",
        name: "Rigo",
        role: "Elder",
        xp: 8900,
        donations: 32,
        leagueId: "master",
        avatarType: "circle-letter",
        avatarBg: "#10b981",
        avatarLetter: "R",
      },
      {
        id: "m-user-npc",
        name: "ZenithCoder",
        role: "Member",
        xp: 2450,
        donations: 8,
        leagueId: "gold",
        avatarType: "circle-letter",
        avatarBg: "#8b5cf6",
        avatarLetter: "Z",
      },
      {
        id: "m-5",
        name: "Apex_Dev",
        role: "Leader",
        xp: 8850,
        donations: 45,
        leagueId: "champion",
        avatarType: "beard-guy",
      },
      {
        id: "m-6",
        name: "MatrixCoder",
        role: "Co-Leader",
        xp: 8700,
        donations: 24,
        leagueId: "master",
        avatarType: "circle-letter",
        avatarBg: "#ef4444",
        avatarLetter: "M",
      },
      {
        id: "m-7",
        name: "ByteKnight",
        role: "Elder",
        xp: 8600,
        donations: 18,
        leagueId: "master",
        avatarType: "glasses-girl",
      },
      {
        id: "m-8",
        name: "AlgoQueen",
        role: "Member",
        xp: 8450,
        donations: 12,
        leagueId: "crystal",
        avatarType: "circle-letter",
        avatarBg: "#ec4899",
        avatarLetter: "A",
      },
      {
        id: "m-9",
        name: "ZeroBug",
        role: "Member",
        xp: 8100,
        donations: 10,
        leagueId: "crystal",
        avatarType: "circle-letter",
        avatarBg: "#f59e0b",
        avatarLetter: "Z",
      },
      {
        id: "m-10",
        name: "ShadowDev",
        role: "Member",
        xp: 7900,
        donations: 6,
        leagueId: "crystal",
        avatarType: "circle-letter",
        avatarBg: "#6366f1",
        avatarLetter: "S",
      },
    ],
    messages: [
      {
        id: "msg-1",
        senderName: "Apex_Dev",
        senderRole: "Leader",
        message:
          "Welcome everyone to LARGEGAMER.COM! Keep participating in Clan War drills and donate code reviews! ⚔️",
        timestamp: "2h ago",
        isSystem: false,
      },
      {
        id: "msg-2",
        senderName: "OR30Ma$t3R DOLO",
        senderRole: "Co-Leader",
        message:
          "Just finished 5 graph dynamic programming problems. Feel free to request code review hints!",
        timestamp: "45m ago",
        isSystem: false,
      },
      {
        id: "msg-3",
        senderName: "System",
        senderRole: "Leader",
        message: "Clan War Day begins in 14 hours! Prepare your algorithm decks.",
        timestamp: "20m ago",
        isSystem: true,
      },
    ],
  },
  {
    id: "clan-byte-raiders",
    name: "BYTE_RAIDERS.DEV",
    tag: "#9QL8902P",
    description:
      "Competitive DSA clan. Top 50 Global. Daily practice and mock interview battles.",
    shieldColor: "purple",
    shieldSymbol: "swords",
    totalXp: 38400,
    requiredXp: 5000,
    donationsWeekly: 2450,
    location: "Global",
    type: "Open",
    maxMembers: 50,
    members: [
      {
        id: "br-1",
        name: "CipherMaster",
        role: "Leader",
        xp: 12400,
        donations: 55,
        leagueId: "titan",
        avatarType: "beard-guy",
      },
    ],
    messages: [],
  },
  {
    id: "clan-algo-warriors",
    name: "ALGO_WARRIORS",
    tag: "#880KP39A",
    description:
      "Chill and friendly clan for all skill levels. Learn data structures together!",
    shieldColor: "green",
    shieldSymbol: "dragon",
    totalXp: 18900,
    requiredXp: 1000,
    donationsWeekly: 890,
    location: "International",
    type: "Open",
    maxMembers: 50,
    members: [
      {
        id: "aw-1",
        name: "GreenNode",
        role: "Leader",
        xp: 6800,
        donations: 40,
        leagueId: "master",
        avatarType: "circle-letter",
        avatarBg: "#10b981",
        avatarLetter: "G",
      },
    ],
    messages: [],
  },
  {
    id: "clan-leetcode-titans",
    name: "LEETCODE_TITANS",
    tag: "#TITAN001",
    description:
      "Aiming for FAANG / Top Tech tier. Daily LeetCode contest debriefs and Hard problem grinds.",
    shieldColor: "gold",
    shieldSymbol: "crown",
    totalXp: 49500,
    requiredXp: 8000,
    donationsWeekly: 3120,
    location: "North America",
    type: "Invite Only",
    maxMembers: 50,
    members: [
      {
        id: "lt-1",
        name: "GraphGod",
        role: "Leader",
        xp: 16200,
        donations: 80,
        leagueId: "legend",
        avatarType: "glasses-girl",
      },
    ],
    messages: [],
  },
  {
    id: "clan-code-assassins",
    name: "SYNTAX_ASSASSINS",
    tag: "#ASSN9988",
    description:
      "Fastest speed-coders in Python & C++. Zero runtime warnings, maximum execution speed.",
    shieldColor: "red",
    shieldSymbol: "lightning",
    totalXp: 29800,
    requiredXp: 3000,
    donationsWeekly: 1780,
    location: "Europe",
    type: "Open",
    maxMembers: 50,
    members: [
      {
        id: "ca-1",
        name: "RedPointer",
        role: "Leader",
        xp: 9400,
        donations: 30,
        leagueId: "champion",
        avatarType: "beard-guy",
      },
    ],
    messages: [],
  },
];

const LOCAL_STORAGE_KEY_CURRENT_CLAN = "aifluence_active_clan";
const LOCAL_STORAGE_KEY_ALL_CLANS = "aifluence_all_clans";

/**
 * Load user's active clan, fallback to default LARGEGAMER.COM clan matching screenshot
 */
export function getStoredCurrentClan(): ClanData {
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
