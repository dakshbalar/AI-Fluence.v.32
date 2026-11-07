import json

with open("level_plan.json", "r", encoding="utf-8") as f:
    plan_data = json.load(f)

pe_contexts = json.load(open("lesson_context_PE.json", "r", encoding="utf-8"))
ft_contexts = json.load(open("lesson_context_FT.json", "r", encoding="utf-8"))
rag_contexts = json.load(open("lesson_context_RAG.json", "r", encoding="utf-8"))
afe_contexts = json.load(open("lesson_context_AFE.json", "r", encoding="utf-8"))

all_contexts = pe_contexts + ft_contexts + rag_contexts + afe_contexts

# 1. Write src/data/levelPlanData.ts
ts_plan = f"""import {{ LevelPlanData, LevelPlanCourse, LevelPlanBook, LevelPlanModule, LevelPlanLevel }} from "../types/curriculum";

export const LEVEL_PLAN_DATA: LevelPlanData = {json.dumps(plan_data, indent=2)};

export const ALL_COURSES: LevelPlanCourse[] = LEVEL_PLAN_DATA.courses;

export function getCourseById(courseId: string): LevelPlanCourse | undefined {{
  return ALL_COURSES.find((c) => c.course_id === courseId);
}}

export function getBookById(courseId: string, bookId: string): LevelPlanBook | undefined {{
  const course = getCourseById(courseId);
  return course?.books.find((b) => b.book_id === bookId);
}}

export function getModuleById(moduleId: string): LevelPlanModule | undefined {{
  for (const course of ALL_COURSES) {{
    for (const book of course.books) {{
      const mod = book.modules.find((m) => m.module_id === moduleId);
      if (mod) return mod;
    }}
  }}
  return undefined;
}}

export function getLevelById(levelId: string): {{ level: LevelPlanLevel; module: LevelPlanModule; book: LevelPlanBook; course: LevelPlanCourse }} | undefined {{
  for (const course of ALL_COURSES) {{
    for (const book of course.books) {{
      for (const mod of book.modules) {{
        const lvl = mod.levels.find((l) => l.level_id === levelId);
        if (lvl) {{
          return {{ level: lvl, module: mod, book, course }};
        }}
      }}
    }}
  }}
  return undefined;
}}

export function getTotalLevelCount(): number {{
  let total = 0;
  for (const course of ALL_COURSES) {{
    for (const book of course.books) {{
      for (const mod of book.modules) {{
        total += mod.levels.length;
      }}
    }}
  }}
  return total;
}}
"""

with open("src/data/levelPlanData.ts", "w", encoding="utf-8") as f:
    f.write(ts_plan)

# 2. Write src/data/allLessonContexts.ts
ts_contexts = f"""import {{ LessonContextItem }} from "../types/curriculum";

export const ALL_LESSON_CONTEXTS: LessonContextItem[] = {json.dumps(all_contexts, indent=2)};

export const LESSON_CONTEXT_MAP: Record<string, LessonContextItem> = ALL_LESSON_CONTEXTS.reduce((acc, item) => {{
  acc[item.level_id] = item;
  return acc;
}}, {{}} as Record<string, LessonContextItem>);

export function getLessonContextByLevelId(levelId: string): LessonContextItem | undefined {{
  return LESSON_CONTEXT_MAP[levelId];
}}
"""

with open("src/data/allLessonContexts.ts", "w", encoding="utf-8") as f:
    f.write(ts_contexts)

print("Wrote src/data/levelPlanData.ts and src/data/allLessonContexts.ts")
