import { CourseSection, CourseLevel } from "./coursesData";
import { PROMPT_ENGINEERING_LESSONS, GenAILesson } from "./genaiPromptEngineeringData";
import { FINE_TUNING_LESSONS } from "./genaiFineTuningData";
import { RAG_LESSONS } from "./genaiRagData";

// Helper to find any lesson across all 3 sub-sections
export function getGenAILessonById(id: number): GenAILesson | undefined {
  if (id >= 700 && id < 800) {
    return PROMPT_ENGINEERING_LESSONS.find((l) => l.id === id);
  }
  if (id >= 800 && id < 900) {
    return FINE_TUNING_LESSONS.find((l) => l.id === id);
  }
  if (id >= 900 && id < 1000) {
    return RAG_LESSONS.find((l) => l.id === id);
  }
  return undefined;
}

export type GenAISubjectId = "prompt_engineering" | "fine_tuning" | "rag";

export interface GenAISubjectMeta {
  id: GenAISubjectId;
  name: string;
  shortName: string;
  badgeSymbol: string;
  icon: string;
  tagline: string;
  description: string;
  sectionsCount: number;
  lessonsCount: number;
  sections: CourseSection[];
}

// Build CourseLevels for a single chapter where 1 Lesson = 1 Level, plus a chapter reward chest
function buildChapterLevels(
  lessons: GenAILesson[],
  chapterNum: number,
  baseChestId: number,
  isUnlockedByDefault: boolean = false,
  startLevelNumber: number = 1
): CourseLevel[] {
  const levels: CourseLevel[] = [];
  const xOffsets = [0, -22, -35, -12, 24, 35, 12, -18];

  lessons.forEach((lesson, idx) => {
    let type: CourseLevel["type"] = "book";
    if (idx === 0) type = "star";
    else if (idx === lessons.length - 1) type = "rosette";
    else if (idx % 2 === 1) type = "star";

    // All levels start locked from the beginning; only level 1 of chapter 1 is current
    let status: CourseLevel["status"] = "locked";
    if (chapterNum === 1 && idx === 0 && startLevelNumber === 1) {
      status = "current";
    }

    levels.push({
      id: lesson.id,
      levelNumber: startLevelNumber + idx,
      title: lesson.title,
      subtitle: lesson.subtitle,
      type,
      status,
      stars: 0,
      xpReward: lesson.xpReward || 35,
      coinsReward: 10,
      xOffsetPercent: xOffsets[idx % xOffsets.length],
      theoryId: `genai-theory-${lesson.id}`,
      theoryData: {
        genaiLesson: lesson,
        bookModule: lesson.moduleName,
        centralIdea: lesson.centralIdea,
        whyItMatters: lesson.whyItMatters,
        keyTakeaway: lesson.keyTakeaway,
      },
    });
  });

  // Ending Reward Chest for the Chapter!
  const chestId = baseChestId + chapterNum * 10;
  levels.push({
    id: chestId,
    levelNumber: startLevelNumber + lessons.length,
    title: `Chapter ${chapterNum} Reward Chest`,
    subtitle: "Bonus XP & Diamonds for mastering this chapter",
    type: "chest",
    status: "locked",
    stars: 0,
    xpReward: 50,
    coinsReward: 25,
    xOffsetPercent: 0,
    theoryId: `reward-chest-${chestId}`,
    theoryData: {
      isChestReward: true,
      bonusXp: 50,
      bonusCoins: 25,
    },
  });

  return levels;
}

// Build 8 Chapter Sections for a subject from its lessons
function buildSubjectChapterSections(
  lessons: GenAILesson[],
  subjectName: string,
  baseChestId: number,
  isFirstSubject: boolean = false
): CourseSection[] {
  const modulesMap = new Map<number, GenAILesson[]>();
  lessons.forEach((l) => {
    const mod = l.moduleNumber || 1;
    if (!modulesMap.has(mod)) {
      modulesMap.set(mod, []);
    }
    modulesMap.get(mod)!.push(l);
  });

  const sections: CourseSection[] = [];
  const sortedModNums = Array.from(modulesMap.keys()).sort((a, b) => a - b);

  let cumulativeLevelNum = 1;
  sortedModNums.forEach((modNum) => {
    const modLessons = modulesMap.get(modNum)!;
    const rawModName = modLessons[0]?.moduleName || `Module ${modNum}`;
    const cleanTitle = rawModName.replace(/^Module\s+\d+:\s*/i, "");

    const isFirstChapter = isFirstSubject && modNum === 1;
    const levels = buildChapterLevels(
      modLessons,
      modNum,
      baseChestId,
      isFirstChapter,
      cumulativeLevelNum
    );
    cumulativeLevelNum += modLessons.length;

    sections.push({
      sectionNumber: modNum,
      sectionTitle: `Chapter ${modNum}: ${cleanTitle}`,
      unitNumber: modNum,
      unitTitle: cleanTitle,
      unitDescription: `${subjectName} • ${modLessons.length} Lessons from the book.`,
      theme: "blue",
      levels,
    });
  });

  return sections;
}

// 8 Chapters for Prompt Engineering (42 Lessons total)
export const PROMPT_ENGINEERING_SECTIONS: CourseSection[] = buildSubjectChapterSections(
  PROMPT_ENGINEERING_LESSONS,
  "Prompt Engineering",
  7100,
  true
);

// 8 Chapters for Fine-Tuning LLM (43 Lessons total)
export const FINE_TUNING_SECTIONS: CourseSection[] = buildSubjectChapterSections(
  FINE_TUNING_LESSONS,
  "Fine-Tuning LLM",
  8100,
  false
);

// 8 Chapters for RAG (45 Lessons total)
export const RAG_SECTIONS: CourseSection[] = buildSubjectChapterSections(
  RAG_LESSONS,
  "RAG (Retrieval-Augmented Generation)",
  9100,
  false
);

// Metadata Map for the 3 Major Subjects
export const GENAI_SUBJECTS_MAP: Record<GenAISubjectId, GenAISubjectMeta> = {
  prompt_engineering: {
    id: "prompt_engineering",
    name: "Prompt Engineering",
    shortName: "Prompting",
    badgeSymbol: "🎯",
    icon: "🎯",
    tagline: "Foundations, Control, Techniques & Verification",
    description: "8 Chapters • 42 Interactive Lessons from the Prompt Engineering book.",
    sectionsCount: PROMPT_ENGINEERING_SECTIONS.length,
    lessonsCount: PROMPT_ENGINEERING_LESSONS.length,
    sections: PROMPT_ENGINEERING_SECTIONS,
  },
  fine_tuning: {
    id: "fine_tuning",
    name: "Fine-Tuning LLM",
    shortName: "Fine-Tuning",
    badgeSymbol: "⚙️",
    icon: "⚙️",
    tagline: "PEFT, Quantization, LoRA & QLoRA In-Depth",
    description: "8 Chapters • 43 Interactive Lessons from the Fine-Tuning LLM book.",
    sectionsCount: FINE_TUNING_SECTIONS.length,
    lessonsCount: FINE_TUNING_LESSONS.length,
    sections: FINE_TUNING_SECTIONS,
  },
  rag: {
    id: "rag",
    name: "RAG 101",
    shortName: "RAG",
    badgeSymbol: "🔍",
    icon: "🔍",
    tagline: "Ingestion, Chunking, Embeddings & Vector Stores",
    description: "8 Chapters • 44 Interactive Lessons from the RAG book.",
    sectionsCount: RAG_SECTIONS.length,
    lessonsCount: RAG_LESSONS.length,
    sections: RAG_SECTIONS,
  },
};

// Helper to retrieve sections for any of the 3 subjects
export function getGenAISectionsForSubject(subjectId: GenAISubjectId): CourseSection[] {
  return GENAI_SUBJECTS_MAP[subjectId]?.sections || PROMPT_ENGINEERING_SECTIONS;
}

// Default export sections for backward compatibility (defaults to active subject: Prompt Engineering)
export const GENAI_3_SUBSECTIONS: CourseSection[] = PROMPT_ENGINEERING_SECTIONS;

