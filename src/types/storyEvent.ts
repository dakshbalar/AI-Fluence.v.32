import React from "react";
import { CharacterMood } from "./avatar";

export type StorySpeaker = "aiden" | "lumi" | "vex" | string;

export interface StoryInteractiveChoice {
  id: string;
  label: string;
  actionType?: string;
  responseLine?: {
    speaker: StorySpeaker;
    text: string;
    headline?: string;
    subtext?: string;
    mood?: CharacterMood;
  };
  [key: string]: any;
}

export interface StoryObjectiveTarget {
  icon: string | React.ReactNode;
  title: string;
  subtitle?: string;
}

export interface StoryDialogueStep {
  speaker: StorySpeaker;
  text: string;
  headline?: string;
  subtext?: string;
  mood?: CharacterMood;
  specialEffect?: "xp_burst" | "streak_fire" | string;
  xpAmount?: number;
  streakCount?: number;
  targetObjectives?: StoryObjectiveTarget[];
  interactiveChoices?: StoryInteractiveChoice[];
  visibleCharacters?: ("aiden" | "lumi" | "vex")[];
  companionMoods?: Record<string, CharacterMood>;
}

export interface StoryEventDefinition {
  id: string;
  title: string;
  steps: StoryDialogueStep[];
  rewardXp?: number;
}
