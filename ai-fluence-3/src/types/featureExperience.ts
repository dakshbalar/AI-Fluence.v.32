export type FeatureCharacter = "aiden" | "lumi" | "vex";

export interface FeatureExperienceConfig {
  id: string;
  title: string;
  subtitle?: string;
  character: FeatureCharacter;
}
