import { AvatarConfig, CharacterMood } from "./avatar";

export type CharacterId = "aiden" | "lumi" | "vex";

export type CharacterRole = "learn" | "create" | "challenge";

export type CharacterScenario = 
  | "greeting"
  | "lesson_intro"
  | "hint_thinking"
  | "correct_celebration"
  | "incorrect_guidance"
  | "streak_milestone"
  | "challenge_start"
  | "victory"
  | "defeat"
  | "idle_chat"
  | "idea_spark";

export interface CharacterDialogueItem {
  text: string;
  mood: CharacterMood;
  audioTone?: string;
}

export interface CharacterPoseProfile {
  id: CharacterMood;
  name: string;
  badge: string;
  description: string;
  actionPrompt: string;
}

export interface CharacterColorPalette {
  primary: string;
  accent: string;
  glow: string;
  secondaryGlow: string;
  darkSurface: string;
  metalTrim: string;
  backgroundGrad: string;
}

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  codename: string;
  role: CharacterRole;
  roleTitle: string;
  tagline: string;
  archetype: string;
  badge: string;
  badgeColor: string;
  themeColor: string;
  quote: string;
  personalityTraits: string[];
  designBio: string;
  mechanicsDescription: string;
  palette: CharacterColorPalette;
  baseConfig: AvatarConfig;
  signaturePoses: CharacterPoseProfile[];
  dialogueBank: Record<CharacterScenario, CharacterDialogueItem[]>;
}
