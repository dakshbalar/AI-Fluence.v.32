export interface CurriculumTopicItem {
  id: string;
  sectionNumber: number;
  title: string;
  description: string;
  unitsCount: number;
  badgeSymbol: string;
  badgeBg?: string;
  lessonsCount?: number;
  status?: "completed" | "current" | "locked";
}

export interface CurriculumGradeItem {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface CourseCurriculumData {
  academyName: string;
  topics: CurriculumTopicItem[];
  theoryTopics: CurriculumTopicItem[];
  questionsTopics: CurriculumTopicItem[];
  grades?: CurriculumGradeItem[];
}

export function getCurriculumForCourse(
  courseId: string,
  courseName?: string,
  _themeColor?: string
): CourseCurriculumData {
  const name = courseName || (courseId === "dsa" ? "Data Structures & Algorithms" : courseId === "generative_ai" ? "Generative A.I" : "AI Academy");

  const theoryTopics: CurriculumTopicItem[] = [
    {
      id: "th-1",
      sectionNumber: 1,
      title: "Foundations & Asymptotic Analysis",
      description: "Big-O, time & space complexity, memory layouts, arrays and dynamic buffers.",
      unitsCount: 12,
      badgeSymbol: "📐",
      lessonsCount: 12,
      status: "current",
    },
    {
      id: "th-2",
      sectionNumber: 2,
      title: "Two Pointers & Sliding Windows",
      description: "Linear optimization techniques, multi-index traversal, bounded subarrays.",
      unitsCount: 14,
      badgeSymbol: "⚡",
      lessonsCount: 14,
      status: "locked",
    },
    {
      id: "th-3",
      sectionNumber: 3,
      title: "Hashing, Bit Manipulation & Heaps",
      description: "Hash maps, collision resolution, bitwise arithmetic, priority queues.",
      unitsCount: 10,
      badgeSymbol: "🗝️",
      lessonsCount: 10,
      status: "locked",
    },
    {
      id: "th-4",
      sectionNumber: 4,
      title: "Trees, Graphs & Dynamic Programming",
      description: "Binary search trees, DFS/BFS graph traversals, memoization, state transitions.",
      unitsCount: 16,
      badgeSymbol: "🌳",
      lessonsCount: 16,
      status: "locked",
    },
  ];

  const questionsTopics: CurriculumTopicItem[] = [
    {
      id: "qu-1",
      sectionNumber: 1,
      title: "Array & String Manipulation Challenges",
      description: "Core coding problems testing edge cases, in-place swaps, and string parsing.",
      unitsCount: 15,
      badgeSymbol: "⚔️",
      lessonsCount: 15,
      status: "current",
    },
    {
      id: "qu-2",
      sectionNumber: 2,
      title: "Algorithmic Problem Solving (LeetCode Patterns)",
      description: "Master two-sum variants, sliding window maximums, and binary searches.",
      unitsCount: 18,
      badgeSymbol: "🎯",
      lessonsCount: 18,
      status: "locked",
    },
    {
      id: "qu-3",
      sectionNumber: 3,
      title: "Recursive Backtracking & Tree Inversion",
      description: "Graph cycles, recursive state exploration, path-sum validation.",
      unitsCount: 14,
      badgeSymbol: "🔥",
      lessonsCount: 14,
      status: "locked",
    },
  ];

  return {
    academyName: name,
    topics: theoryTopics,
    theoryTopics,
    questionsTopics,
    grades: [
      { id: "g-1", title: "Novice Coder", description: "Completed Section 1", unlocked: true },
      { id: "g-2", title: "Algorithmic Practitioner", description: "Completed Section 2", unlocked: false },
      { id: "g-3", title: "Competitive Master", description: "Completed All Sections", unlocked: false },
    ],
  };
}
