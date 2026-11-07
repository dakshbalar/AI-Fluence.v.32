import { CourseSection, CourseLevel } from "./coursesData";
import { LEVEL_PLAN_DATA } from "./levelPlanData";

const X_OFFSETS = [0, -22, -35, -12, 24, 35, 12, 0];

// Build 24 full sections for Generative AI (PE: 8 modules/40 levels, FT: 8 modules/41 levels, RAG: 8 modules/44 levels) = 125 levels
function buildGenAICourseSections(): CourseSection[] {
  const genaiCourse = LEVEL_PLAN_DATA.courses.find((c) => c.course_id === "genai");
  if (!genaiCourse) return [];

  const sections: CourseSection[] = [];
  let sectionCounter = 1;

  for (const book of genaiCourse.books) {
    for (const mod of book.modules) {
      const levels: CourseLevel[] = mod.levels.map((lvl, idx) => {
        const isFirstGlobal = lvl.global_index === 1;
        const isBoss = idx === mod.levels.length - 1;
        const levelType: CourseLevel["type"] = isFirstGlobal
          ? "star"
          : isBoss
          ? "rosette"
          : idx % 2 === 1
          ? "book"
          : "star";

        return {
          id: lvl.global_index,
          levelNumber: lvl.star_number,
          title: lvl.title,
          subtitle: mod.module_name,
          type: levelType,
          status: isFirstGlobal ? "current" : "locked",
          stars: 0,
          xpReward: 50,
          coinsReward: 10,
          xOffsetPercent: X_OFFSETS[idx % X_OFFSETS.length],
          level_id: lvl.level_id,
          theoryId: lvl.level_id,
          problemId: lvl.global_index,
          globalIndex: lvl.global_index,
        };
      });

      sections.push({
        sectionNumber: sectionCounter,
        sectionTitle: mod.module_name,
        unitNumber: sectionCounter,
        unitTitle: mod.module_name,
        unitDescription: `Explore ${mod.levels.length} guided levels covering key principles and practical mastery of ${mod.module_name}.`,
        theme: "blue",
        levels,
      });

      sectionCounter++;
    }
  }

  return sections;
}

export const GENAI_THEORY_COURSE_SECTIONS: CourseSection[] = buildGenAICourseSections();
export const GENAI_QUESTIONS_COURSE_SECTIONS: CourseSection[] = buildGenAICourseSections();

