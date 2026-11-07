import { AvatarConfig } from "./avatar";

export type CodingExperience = 
  | "beginner"
  | "basics"
  | "small_programs"
  | "intermediate"
  | "advanced";

export type TechComfort =
  | "complete_beginner"
  | "tried_a_few"
  | "fairly_comfortable"
  | "advanced";

export type CodingBackground =
  | "never"
  | "a_little"
  | "yes_regularly"
  | "already_developer";

export type LearningGoal = 
  | "academics"
  | "placements"
  | "dsa_interviews"
  | "building_projects"
  | "competitive_programming"
  | "general_programming"
  | "career_change"
  | "ai_dev"
  | "freelancing"
  | "business"
  | "content_creation"
  | "productivity"
  | "explore_ai";

export type LearningStylePreference =
  | "projects"
  | "short_explanations"
  | "games_challenges"
  | "demonstrations"
  | "combination";

export type DiscoverySource = 
  | "instagram"
  | "youtube"
  | "google"
  | "friend"
  | "college"
  | "linkedin"
  | "other";

export type JourneyDuration = "7" | "14" | "30" | "60" | "90" | "custom";

export type DailyTimeCommitment = "10" | "20" | "30" | "45" | "60" | "90+";

export interface PathNode {
  id: string;
  title: string;
  subtitle: string;
  category: "foundation" | "language" | "ai_core" | "practice" | "project" | "boss_challenge" | "mastery";
  status: "completed" | "current" | "unlocked" | "locked";
  xp: number;
  estimatedMinutes: number;
  icon: string;
  description: string;
  regionId: string;
  regionName: string;
  guideCharacter: "aiden" | "lumi" | "vex";
  characterQuote: string;
  actionType: "lesson" | "practice" | "quiz" | "project" | "interview" | "boss";
  actionTarget?: string; // e.g. "html-adv", "py-qst", "dsa-bld", "ai-bld"
  skills: string[];
}

export interface PathRegion {
  id: string;
  name: string;
  order: number;
  status: "unlocked" | "current" | "locked";
  description: string;
  badge: string;
  accentColor: string;
  nodes: PathNode[];
}

export interface PersonalizedPathPlan {
  pathId: string;
  title: string;
  targetRole: string;
  tagline: string;
  summary: string;
  currentRegionIndex: number;
  regions: PathRegion[];
  generatedAt: string;
  primaryLanguage: string;
  dailyMinutes: number;
  totalNodes: number;
  completedNodes: number;
}

export interface StudentProfile {
  userId: string;
  username: string;
  profilePicture: string; // Avatar ID, preset key or custom image URL
  avatarConfig?: AvatarConfig;
  codingExperience: CodingExperience;
  techComfort?: TechComfort;
  codingBackground?: CodingBackground;
  languagePriorities?: string[];
  primaryLanguage: string;
  secondaryLanguage?: string;
  thirdLanguage?: string;
  learningGoal: LearningGoal;
  aiGoals?: string[];
  aiInterests?: string[];
  threeMonthVision?: string;
  learningStyle?: LearningStylePreference;
  dailyTimePreference?: DailyTimeCommitment;
  motivationFactors?: string[];
  primaryFocusGoal?: string;
  personalizedPath?: PersonalizedPathPlan;
  discoverySource: DiscoverySource;
  onboardingCompleted: boolean;
  clanId?: string;
  createdAt: string;
}

export interface LearningCommitment {
  userId: string;
  journeyDuration: JourneyDuration;
  customDurationDays?: number;
  dailyTimeCommitment: DailyTimeCommitment;
  journeyStartDate: string; // YYYY-MM-DD
  journeyEndDate: string; // YYYY-MM-DD
  dailyGoalXP: number;
}

export interface DailyMissionStep {
  id: "learn" | "practice" | "think" | "challenge";
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  xpReward: number;
  thinkingXpReward?: number;
  completed: boolean;
  actionRoute?: string;
}

export interface DailyActivity {
  userId: string;
  date: string; // YYYY-MM-DD
  loginRewardClaimed: boolean;
  dailyGoalXP: number;
  earnedXP: number;
  thinkingXP: number;
  lessonsCompleted: number;
  practiceCompleted: number;
  quickThinkCompleted: number;
  challengeCompleted: number;
  goalCompleted: boolean;
  missions: DailyMissionStep[];
}

export interface StreakRecord {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalLoginDays: number;
  lastRewardClaimDate?: string;
}

export interface EngagementTelemetry {
  userId: string;
  lastActivity: string;
  sessionsToday: number;
  activitiesStarted: number;
  activitiesCompleted: number;
  activitiesSkipped: number;
  questionsAttempted: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  adaptiveModeActive: boolean; // Triggers low-friction intervention
  difficultyLevel: "gentle" | "standard" | "advanced";
}

export interface QuickThinkQuestion {
  id: string;
  language: string;
  topic: string;
  premise: string;
  question: string;
  codeSnippet?: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
  }[];
  correctExplanation: string;
  interactiveSimulation: {
    title: string;
    description: string;
    steps: {
      stepNumber: number;
      caption: string;
      codeHighlight?: number[];
      variablesState?: Record<string, string | number | boolean>;
      outputLine?: string;
    }[];
  };
  thinkingXp: number;
  learningXp: number;
}
