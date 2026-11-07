import { FeatureCharacter } from "../../types/featureExperience";
import { CharacterMood } from "../../types/avatar";

export type OnboardingSceneId =
  | "A1_WELCOME"
  | "A2_MEET_AIDEN"
  | "A3_MEET_LUMI"
  | "A4_MEET_VEX"
  | "A5_COMPLETE"
  | "B1_LEARNING_GOAL"
  | "B2_FIRST_PROMPT"
  | "B3_FIRST_LESSON";

export type OnboardingCategory = "SIMPLE" | "COMPLEX";

export interface OnboardingSceneDefinition {
  id: OnboardingSceneId;
  category: OnboardingCategory;
  code: string; // e.g. "A1", "B2"
  title: string;
  subtitle: string;
  character: FeatureCharacter;
  description: string;
  features: string[];
}

export interface SceneComponentProps {
  onContinue: () => void;
  onPrev?: () => void;
  onDismiss?: () => void;
  onReplay?: () => void;
  isStandalone?: boolean;
  userName?: string;
}
