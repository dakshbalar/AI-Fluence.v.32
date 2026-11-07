import { CourseSection, CourseLevel } from "./coursesData";
import { LEVEL_PLAN_DATA } from "./levelPlanData";

const X_OFFSETS = [0, -22, -35, -12, 24, 35, 12, 0];

// Build 4 full sections for AI for Everyone (Part 1 to Part 4 = 28 levels)
function buildAIForEveryoneSections(): CourseSection[] {
  const afeCourse = LEVEL_PLAN_DATA.courses.find((c) => c.course_id === "afe");
  if (!afeCourse) return [];

  const sections: CourseSection[] = [];
  let sectionCounter = 1;

  for (const book of afeCourse.books) {
    for (const mod of book.modules) {
      const levels: CourseLevel[] = mod.levels.map((lvl, idx) => {
        const isFirstGlobal = idx === 0 && sectionCounter === 1;
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
          subtitle: `${book.book_name} • ${mod.module_name}`,
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
        unitDescription: `Explore ${mod.levels.length} foundational levels understanding ${mod.module_name}.`,
        theme: "yellow",
        levels,
      });

      sectionCounter++;
    }
  }

  return sections;
}

export const AI_FOR_EVERYONE_THEORY_SECTIONS: CourseSection[] = buildAIForEveryoneSections();
export const AI_FOR_EVERYONE_QUESTIONS_SECTIONS: CourseSection[] = buildAIForEveryoneSections();

