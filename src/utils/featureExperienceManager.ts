import { useState, useCallback } from "react";

export interface FeatureExperience {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  characterId?: "aiden" | "lumi" | "vex";
  data?: any;
}

export function useFeatureExperience() {
  const [activeExperience, setActiveExperience] = useState<FeatureExperience | null>(null);

  const closeExperience = useCallback(() => {
    setActiveExperience(null);
  }, []);

  const launchExperience = useCallback((exp: FeatureExperience) => {
    setActiveExperience(exp);
  }, []);

  return {
    activeExperience,
    closeExperience,
    launchExperience,
  };
}

export function triggerFeatureExperience(_exp: any) {}

export function generateContextualWelcomeBack(opts: { userName?: string; forcedReason?: string }): FeatureExperience {
  return {
    id: "welcome-back",
    type: "welcome_back",
    title: `Welcome back, ${opts.userName || "Engineer"}!`,
    subtitle: "Ready to conquer your next algorithm milestone?",
    characterId: "aiden",
    data: opts,
  };
}

export function generateDailyBonusExperience(opts: any): FeatureExperience {
  return {
    id: "daily-bonus",
    type: "daily_bonus",
    title: "Daily Focus Bonus",
    subtitle: "Your algorithmic streak multiplier is active!",
    characterId: "lumi",
    data: opts,
  };
}
