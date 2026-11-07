import { FullBundleDefinition, FULL_BUNDLES } from "./avatarData";
import { AIDEN_CONFIG } from "./characters";

export interface AvatarSkinUnlock {
  bundleId: string;
  bundle: FullBundleDefinition;
  requiredSection: number;
  requiredLevel: number;
  unlockTitle: string;
  unlockConditionText: string;
  category: "Companion" | "Milestone" | "Boss" | "Mastery";
}

export const AVATAR_SKIN_UNLOCKS: AvatarSkinUnlock[] = [
  {
    bundleId: "aiden_mascot",
    bundle: FULL_BUNDLES.find((b) => b.id === "aiden_mascot") || FULL_BUNDLES[0],
    requiredSection: 1,
    requiredLevel: 0,
    unlockTitle: "Official Companion",
    unlockConditionText: "Unlocked by default as your primary AI partner",
    category: "Companion",
  },
  {
    bundleId: "cyber_ninja",
    bundle: FULL_BUNDLES.find((b) => b.id === "cyber_ninja") || FULL_BUNDLES[1],
    requiredSection: 1,
    requiredLevel: 1,
    unlockTitle: "Section 1 Novice",
    unlockConditionText: "Clear Level 1 in Section 1 (Optimal Algorithmic Methods)",
    category: "Milestone",
  },
  {
    bundleId: "lumi_mascot",
    bundle: FULL_BUNDLES.find((b) => b.id === "lumi_mascot") || FULL_BUNDLES[1],
    requiredSection: 1,
    requiredLevel: 2,
    unlockTitle: "Two Pointers Sage",
    unlockConditionText: "Clear Level 2 in Section 1 (Two Pointers & Hash Frequency)",
    category: "Companion",
  },
  {
    bundleId: "cyber_king",
    bundle: FULL_BUNDLES.find((b) => b.id === "cyber_king") || FULL_BUNDLES[3],
    requiredSection: 1,
    requiredLevel: 3,
    unlockTitle: "Algorithmic Royalty",
    unlockConditionText: "Clear Level 3 in Section 1 (Subarray Invariants)",
    category: "Milestone",
  },
  {
    bundleId: "military",
    bundle: FULL_BUNDLES.find((b) => b.id === "military") || FULL_BUNDLES[2],
    requiredSection: 1,
    requiredLevel: 4,
    unlockTitle: "Tactical Spec-Ops",
    unlockConditionText: "Clear Level 4 in Section 1 (Boyer-Moore Voting)",
    category: "Milestone",
  },
  {
    bundleId: "vex_mascot",
    bundle: FULL_BUNDLES.find((b) => b.id === "vex_mascot") || FULL_BUNDLES[2],
    requiredSection: 1,
    requiredLevel: 5,
    unlockTitle: "Section 1 Boss Victor",
    unlockConditionText: "Clear Level 5 (Section 1 Boss Challenge)",
    category: "Boss",
  },
  {
    bundleId: "terminator",
    bundle: FULL_BUNDLES.find((b) => b.id === "terminator") || FULL_BUNDLES[4],
    requiredSection: 2,
    requiredLevel: 6,
    unlockTitle: "Silicon Automaton",
    unlockConditionText: "Clear Section 2 (Array Pointer Architectures)",
    category: "Mastery",
  },
  {
    bundleId: "snow_military",
    bundle: FULL_BUNDLES.find((b) => b.id === "snow_military") || FULL_BUNDLES[3],
    requiredSection: 3,
    requiredLevel: 8,
    unlockTitle: "Sub-Zero Grandmaster",
    unlockConditionText: "Clear Section 3 (Binary Search & Divide/Conquer)",
    category: "Mastery",
  },
];

const ACTIVE_AVATAR_BUNDLE_KEY = "aifluence_active_bundle_v1";

export function getStoredActiveBundleId(): string {
  try {
    const stored = localStorage.getItem(ACTIVE_AVATAR_BUNDLE_KEY);
    if (stored && AVATAR_SKIN_UNLOCKS.some((u) => u.bundleId === stored)) {
      return stored;
    }
  } catch (e) {
    console.warn("Failed loading active bundle", e);
  }
  return "aiden_mascot";
}

export function persistActiveBundleId(bundleId: string): void {
  try {
    localStorage.setItem(ACTIVE_AVATAR_BUNDLE_KEY, bundleId);
  } catch (e) {
    console.warn("Failed saving active bundle", e);
  }
}

export function isAvatarSkinUnlocked(
  unlock: AvatarSkinUnlock,
  completedLevelsCount: number,
  currentSectionNumber: number = 1
): boolean {
  if (unlock.requiredLevel <= 0) return true;
  // Unlocked if user has completed enough levels or reached required section
  return (
    completedLevelsCount >= unlock.requiredLevel ||
    currentSectionNumber > unlock.requiredSection
  );
}
