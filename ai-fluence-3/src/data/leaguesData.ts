export type LeagueId =
  | "bronze"
  | "silver"
  | "gold"
  | "crystal"
  | "master"
  | "champion"
  | "titan"
  | "legend";

export interface LeagueTier {
  id: LeagueId;
  name: string;
  subTier?: "III" | "II" | "I";
  fullName: string;
  minTrophies: number;
  maxTrophies: number;
  minXp: number; // backward-compatibility alias
  maxXp: number; // backward-compatibility alias
  badgeColor: string;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  bonusPercentage: number;
  dailyGemsBonus: number;
  description: string;
}

export const COC_LEAGUES: LeagueTier[] = [
  {
    id: "bronze",
    name: "Bronze",
    subTier: "III",
    fullName: "Bronze League III",
    minTrophies: 0,
    maxTrophies: 499,
    minXp: 0,
    maxXp: 499,
    badgeColor: "#cd7f32",
    accentColor: "#b45309",
    borderColor: "border-amber-800",
    glowColor: "rgba(205, 127, 50, 0.4)",
    bonusPercentage: 0,
    dailyGemsBonus: 1,
    description: "Beginning your coding journey. Master fundamental syntax.",
  },
  {
    id: "bronze",
    name: "Bronze",
    subTier: "II",
    fullName: "Bronze League II",
    minTrophies: 500,
    maxTrophies: 699,
    minXp: 500,
    maxXp: 699,
    badgeColor: "#cd7f32",
    accentColor: "#b45309",
    borderColor: "border-amber-800",
    glowColor: "rgba(205, 127, 50, 0.4)",
    bonusPercentage: 5,
    dailyGemsBonus: 1,
    description: "Advancing through basic arrays and simple conditionals.",
  },
  {
    id: "bronze",
    name: "Bronze",
    subTier: "I",
    fullName: "Bronze League I",
    minTrophies: 700,
    maxTrophies: 999,
    minXp: 700,
    maxXp: 999,
    badgeColor: "#cd7f32",
    accentColor: "#b45309",
    borderColor: "border-amber-800",
    glowColor: "rgba(205, 127, 50, 0.5)",
    bonusPercentage: 8,
    dailyGemsBonus: 2,
    description: "Ready to cross the threshold into competitive Silver rankings.",
  },
  {
    id: "silver",
    name: "Silver",
    subTier: "III",
    fullName: "Silver League III",
    minTrophies: 1000,
    maxTrophies: 1249,
    minXp: 1000,
    maxXp: 1249,
    badgeColor: "#cbd5e1",
    accentColor: "#94a3b8",
    borderColor: "border-slate-400",
    glowColor: "rgba(203, 213, 225, 0.4)",
    bonusPercentage: 10,
    dailyGemsBonus: 2,
    description: "Tackling 2-pointer techniques and string manipulation drills.",
  },
  {
    id: "silver",
    name: "Silver",
    subTier: "II",
    fullName: "Silver League II",
    minTrophies: 1250,
    maxTrophies: 1499,
    minXp: 1250,
    maxXp: 1499,
    badgeColor: "#cbd5e1",
    accentColor: "#94a3b8",
    borderColor: "border-slate-400",
    glowColor: "rgba(203, 213, 225, 0.45)",
    bonusPercentage: 12,
    dailyGemsBonus: 3,
    description: "Sliding window and fast & slow pointers mastered.",
  },
  {
    id: "silver",
    name: "Silver",
    subTier: "I",
    fullName: "Silver League I",
    minTrophies: 1500,
    maxTrophies: 1799,
    minXp: 1500,
    maxXp: 1799,
    badgeColor: "#e2e8f0",
    accentColor: "#64748b",
    borderColor: "border-slate-300",
    glowColor: "rgba(226, 232, 240, 0.5)",
    bonusPercentage: 15,
    dailyGemsBonus: 3,
    description: "Peak Silver division! Promotion into prestigious Gold awaits.",
  },
  {
    id: "gold",
    name: "Gold",
    subTier: "III",
    fullName: "Gold League III",
    minTrophies: 1800,
    maxTrophies: 2099,
    minXp: 1800,
    maxXp: 2099,
    badgeColor: "#facc15",
    accentColor: "#ca8a04",
    borderColor: "border-amber-400",
    glowColor: "rgba(250, 204, 21, 0.45)",
    bonusPercentage: 18,
    dailyGemsBonus: 4,
    description: "Binary search, recursion, and linked list re-linking.",
  },
  {
    id: "gold",
    name: "Gold",
    subTier: "II",
    fullName: "Gold League II",
    minTrophies: 2100,
    maxTrophies: 2399,
    minXp: 2100,
    maxXp: 2399,
    badgeColor: "#fbbf24",
    accentColor: "#d97706",
    borderColor: "border-amber-400",
    glowColor: "rgba(251, 191, 36, 0.5)",
    bonusPercentage: 20,
    dailyGemsBonus: 5,
    description: "Trees, binary search trees, and DFS/BFS traversals.",
  },
  {
    id: "gold",
    name: "Gold",
    subTier: "I",
    fullName: "Gold League I",
    minTrophies: 2400,
    maxTrophies: 2699,
    minXp: 2400,
    maxXp: 2699,
    badgeColor: "#f59e0b",
    accentColor: "#b45309",
    borderColor: "border-amber-500",
    glowColor: "rgba(245, 158, 11, 0.55)",
    bonusPercentage: 25,
    dailyGemsBonus: 6,
    description: "Approaching Crystal League! Solving Medium LeetCode problems easily.",
  },
  {
    id: "crystal",
    name: "Crystal",
    subTier: "III",
    fullName: "Crystal League III",
    minTrophies: 2700,
    maxTrophies: 2999,
    minXp: 2700,
    maxXp: 2999,
    badgeColor: "#c084fc",
    accentColor: "#9333ea",
    borderColor: "border-purple-500",
    glowColor: "rgba(192, 132, 252, 0.5)",
    bonusPercentage: 30,
    dailyGemsBonus: 8,
    description: "Heaps, priority queues, and graph shortest paths.",
  },
  {
    id: "crystal",
    name: "Crystal",
    subTier: "II",
    fullName: "Crystal League II",
    minTrophies: 3000,
    maxTrophies: 3399,
    minXp: 3000,
    maxXp: 3399,
    badgeColor: "#a855f7",
    accentColor: "#7e22ce",
    borderColor: "border-purple-600",
    glowColor: "rgba(168, 85, 247, 0.55)",
    bonusPercentage: 35,
    dailyGemsBonus: 9,
    description: "Dynamic programming memoization and bottom-up tables.",
  },
  {
    id: "crystal",
    name: "Crystal",
    subTier: "I",
    fullName: "Crystal League I",
    minTrophies: 3400,
    maxTrophies: 3799,
    minXp: 3400,
    maxXp: 3799,
    badgeColor: "#9333ea",
    accentColor: "#6b21a8",
    borderColor: "border-purple-700",
    glowColor: "rgba(147, 51, 234, 0.6)",
    bonusPercentage: 40,
    dailyGemsBonus: 10,
    description: "Trie data structures and backtracking optimization.",
  },
  {
    id: "master",
    name: "Master",
    subTier: "III",
    fullName: "Master League III",
    minTrophies: 3800,
    maxTrophies: 4199,
    minXp: 3800,
    maxXp: 4199,
    badgeColor: "#f43f5e",
    accentColor: "#be123c",
    borderColor: "border-rose-500",
    glowColor: "rgba(244, 63, 94, 0.55)",
    bonusPercentage: 45,
    dailyGemsBonus: 12,
    description: "Advanced graph theory (Dijkstra, Tarjan, Topo-sort).",
  },
  {
    id: "master",
    name: "Master",
    subTier: "II",
    fullName: "Master League II",
    minTrophies: 4200,
    maxTrophies: 4599,
    minXp: 4200,
    maxXp: 4599,
    badgeColor: "#e11d48",
    accentColor: "#9f1239",
    borderColor: "border-rose-600",
    glowColor: "rgba(225, 29, 72, 0.6)",
    bonusPercentage: 50,
    dailyGemsBonus: 14,
    description: "Bit manipulation, segment trees, and disjoint-set union.",
  },
  {
    id: "master",
    name: "Master",
    subTier: "I",
    fullName: "Master League I",
    minTrophies: 4600,
    maxTrophies: 4999,
    minXp: 4600,
    maxXp: 4999,
    badgeColor: "#be123c",
    accentColor: "#881337",
    borderColor: "border-rose-700",
    glowColor: "rgba(190, 18, 60, 0.65)",
    bonusPercentage: 55,
    dailyGemsBonus: 16,
    description: "Peak Master! Near-instant problem analysis and O(N) optimizations.",
  },
  {
    id: "champion",
    name: "Champion",
    fullName: "Champion League",
    minTrophies: 5000,
    maxTrophies: 5799,
    minXp: 5000,
    maxXp: 5799,
    badgeColor: "#f97316",
    accentColor: "#c2410c",
    borderColor: "border-orange-500",
    glowColor: "rgba(249, 115, 22, 0.65)",
    bonusPercentage: 65,
    dailyGemsBonus: 20,
    description: "Elite competitive programmers capable of conquering Hard interviews.",
  },
  {
    id: "titan",
    name: "Titan",
    fullName: "Titan League",
    minTrophies: 5800,
    maxTrophies: 6599,
    minXp: 5800,
    maxXp: 6599,
    badgeColor: "#38bdf8",
    accentColor: "#0284c7",
    borderColor: "border-sky-400",
    glowColor: "rgba(56, 189, 248, 0.7)",
    bonusPercentage: 80,
    dailyGemsBonus: 25,
    description: "Titan tier: Architecting distributed systems and solving multi-state DP.",
  },
  {
    id: "legend",
    name: "Legend",
    fullName: "Legend League",
    minTrophies: 6600,
    maxTrophies: 999999,
    minXp: 6600,
    maxXp: 999999,
    badgeColor: "#818cf8",
    accentColor: "#4338ca",
    borderColor: "border-indigo-400",
    glowColor: "rgba(129, 140, 248, 0.8)",
    bonusPercentage: 100,
    dailyGemsBonus: 35,
    description: "The Hall of Coding Legends! Recognized among the best in the world.",
  },
];

/**
 * Given a Trophy count, resolve the corresponding CoC League Tier
 */
export function getLeagueForTrophies(trophies: number): LeagueTier {
  const safeTrophies = Math.max(0, trophies);
  const matched = COC_LEAGUES.find(
    (league) => safeTrophies >= league.minTrophies && safeTrophies <= league.maxTrophies
  );
  return matched || COC_LEAGUES[COC_LEAGUES.length - 1];
}

/**
 * Backward compatibility helper
 */
export function getLeagueForXp(xp: number): LeagueTier {
  return getLeagueForTrophies(xp);
}

/**
 * Returns the next higher league tier, or null if already in Legend League
 */
export function getNextLeague(currentLeague: LeagueTier): LeagueTier | null {
  const idx = COC_LEAGUES.findIndex(
    (l) => l.fullName === currentLeague.fullName
  );
  if (idx === -1 || idx === COC_LEAGUES.length - 1) return null;
  return COC_LEAGUES[idx + 1];
}
