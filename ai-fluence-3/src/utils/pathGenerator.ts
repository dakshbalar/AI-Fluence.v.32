import {
  StudentProfile,
  LearningCommitment,
  PersonalizedPathPlan,
  DailyMissionStep,
  PathRegion,
  PathNode,
} from "../types/engagement";

export function generatePersonalizedPath(profile: StudentProfile): PersonalizedPathPlan {
  const lang = profile.primaryLanguage || "Python";
  const goal = profile.primaryFocusGoal || "AI & Algorithmic Developer";

  const regions: PathRegion[] = [
    {
      id: "region-1",
      name: "Algorithmic Foundations",
      order: 1,
      status: "current",
      description: "Master baseline syntax, control structures, and array indexing.",
      badge: "🌱",
      accentColor: "#00E5FF",
      nodes: [
        {
          id: "node-101",
          title: `${lang} Essentials`,
          subtitle: "Core syntax, variables & memory models",
          category: "foundation",
          status: "current",
          xp: 40,
          estimatedMinutes: 15,
          icon: "code",
          description: `Learn foundational syntax and semantics in ${lang}.`,
          regionId: "region-1",
          regionName: "Algorithmic Foundations",
          guideCharacter: "aiden",
          characterQuote: "Every great engineer begins with clean foundations!",
          actionType: "lesson",
          actionTarget: "py-qst",
          skills: [lang, "Variables", "Control Flow"],
        },
        {
          id: "node-102",
          title: "Arrays & Iterators",
          subtitle: "Linear data layouts and complexity analysis",
          category: "language",
          status: "locked",
          xp: 50,
          estimatedMinutes: 20,
          icon: "layers",
          description: "Traverse contiguous buffers and analyze time complexities.",
          regionId: "region-1",
          regionName: "Algorithmic Foundations",
          guideCharacter: "lumi",
          characterQuote: "Notice the geometric patterns inside iteration!",
          actionType: "practice",
          actionTarget: "dsa-bld",
          skills: ["Arrays", "Pointers", "Big-O"],
        },
      ],
    },
    {
      id: "region-2",
      name: "Neural & Generative Frontiers",
      order: 2,
      status: "locked",
      description: "Embeddings, prompt architecture, and foundation model APIs.",
      badge: "✨",
      accentColor: "#FF2A8D",
      nodes: [
        {
          id: "node-201",
          title: "Prompt Engineering",
          subtitle: "System instructions, few-shot prompting, schema outputs",
          category: "ai_core",
          status: "locked",
          xp: 60,
          estimatedMinutes: 25,
          icon: "sparkles",
          description: "Direct autoregressive LLMs with zero-shot and few-shot context.",
          regionId: "region-2",
          regionName: "Neural & Generative Frontiers",
          guideCharacter: "lumi",
          characterQuote: "Language is the newest compiled runtime!",
          actionType: "lesson",
          actionTarget: "ai-bld",
          skills: ["Prompts", "Context Windows", "Transformers"],
        },
        {
          id: "node-202",
          title: "Vector Search & RAG",
          subtitle: "Embeddings, nearest-neighbor recall, grounded citations",
          category: "project",
          status: "locked",
          xp: 80,
          estimatedMinutes: 30,
          icon: "database",
          description: "Connect external knowledge retrieval pipelines to transformer models.",
          regionId: "region-2",
          regionName: "Neural & Generative Frontiers",
          guideCharacter: "vex",
          characterQuote: "Ground your AI models with deterministic retrieval!",
          actionType: "project",
          actionTarget: "ai-bld",
          skills: ["RAG", "Embeddings", "Vector DB"],
        },
      ],
    },
  ];

  return {
    pathId: `path-${Date.now()}`,
    title: `${lang} to ${goal}`,
    targetRole: goal,
    tagline: "Tailored Algorithmic & Generative Curriculum",
    summary: `Personalized curriculum optimized for ${lang} with daily practice targets.`,
    currentRegionIndex: 0,
    regions,
    generatedAt: new Date().toISOString(),
    primaryLanguage: lang,
    dailyMinutes: parseInt(profile.dailyTimePreference || "30", 10) || 30,
    totalNodes: 4,
    completedNodes: 0,
  };
}

export function generateAdaptiveDailyMissions(
  _profile: StudentProfile,
  commitment: LearningCommitment
): DailyMissionStep[] {
  const goalXp = commitment.dailyGoalXP || 50;

  return [
    {
      id: "learn",
      title: "Complete 1 Algorithm Lesson",
      subtitle: "Section 1 core foundation",
      estimatedMinutes: 15,
      xpReward: Math.round(goalXp * 0.4),
      completed: false,
      actionRoute: "lesson",
    },
    {
      id: "practice",
      title: "Solve 2 Code Puzzles",
      subtitle: "Two pointers or array traversal",
      estimatedMinutes: 20,
      xpReward: Math.round(goalXp * 0.35),
      completed: false,
      actionRoute: "practice",
    },
    {
      id: "think",
      title: "Quick Think AI Check",
      subtitle: "Verify prompt or complexity concepts",
      estimatedMinutes: 5,
      xpReward: Math.round(goalXp * 0.25),
      completed: false,
      actionRoute: "think",
    },
  ];
}
