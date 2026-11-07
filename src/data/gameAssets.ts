import React from "react";
import {
  DiamondIllustration,
  GoldTrophyIllustration,
  SilverTrophyIllustration,
  BronzeTrophyIllustration,
  RuneStoneIllustration,
  XpPotionIllustration,
  StreakShieldIllustration,
  NameCardIllustration,
} from "../components/illustrations/StoreItemIllustrations";

export const GAME_ASSETS = {
  runeStone: RuneStoneIllustration,
  xpPotion: XpPotionIllustration,
  streakShield: StreakShieldIllustration,
  nameChangeCard: NameCardIllustration,
  diamond: DiamondIllustration,
  cards: {
    nameChangeCard: NameCardIllustration,
    magicCard: NameCardIllustration,
    doubleXpCard: NameCardIllustration,
  },
  stones: {
    manaStone: RuneStoneIllustration,
    evolutionStone: RuneStoneIllustration,
    diamondGem: DiamondIllustration,
  },
  potions: {
    xpFlask: XpPotionIllustration,
    energyFlask: XpPotionIllustration,
  },
  shields: {
    streakShield: StreakShieldIllustration,
  },
  trophies: {
    gold: GoldTrophyIllustration,
    silver: SilverTrophyIllustration,
    bronze: BronzeTrophyIllustration,
    legend: GoldTrophyIllustration,
    crystal: SilverTrophyIllustration,
    master: GoldTrophyIllustration,
    platinum: SilverTrophyIllustration,
  },
};

export const getTrophyIllustration = (trophiesCount: number) => {
  if (trophiesCount >= 1000) return GoldTrophyIllustration;
  if (trophiesCount >= 500) return SilverTrophyIllustration;
  return BronzeTrophyIllustration;
};

export const getTrophyImage = (trophiesCount: number): string => {
  return "";
};
