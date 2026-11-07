import {
  GENAI_THEORY_COURSE_SECTIONS,
  GENAI_QUESTIONS_COURSE_SECTIONS,
} from "./allCoursesTracksData";
import {
  AI_FOR_EVERYONE_THEORY_SECTIONS,
  AI_FOR_EVERYONE_QUESTIONS_SECTIONS,
} from "./aiForEveryoneData";
import {
  CPP_THEORY_COURSE_SECTIONS,
  DSA_QUESTIONS_COURSE_SECTIONS,
} from "./dsaTracksData";

export type CourseTheme = "purple" | "green" | "red" | "blue" | "yellow";

export interface CourseLevel {
  id: number;
  levelNumber: number;
  title: string;
  subtitle: string;
  type: "star" | "book" | "audio" | "chest" | "rosette" | "boss";
  status: "completed" | "current" | "locked";
  stars: number;
  xpReward: number;
  coinsReward?: number;
  xOffsetPercent: number; // -40 to +40 from center
  theoryId?: string;
  theoryData?: any;
  problemId?: number;
  problemData?: any;
  level_id?: string;
  globalIndex?: number;
}

export interface CourseSection {
  sectionNumber: number;
  sectionTitle: string;
  unitNumber: number;
  unitTitle: string;
  unitDescription: string;
  theme: CourseTheme;
  levels: CourseLevel[];
}

export interface CourseDefinition {
  id: string;
  code: string;
  name: string;
  shortName?: string;
  category: string;
  score: number;
  nextScore: number;
  progressPercent: number;
  theme: CourseTheme;
  sectionNumber: number;
  unitNumber: number;
  unitTitle: string;
  unitDescription: string;
  sections: CourseSection[];
  theorySections?: CourseSection[];
  questionsSections?: CourseSection[];
  isNew?: boolean;
  guidebook: {
    keyRules: { title: string; desc: string }[];
    syntaxSnippet: string;
    syntaxLanguage: string;
  };
}

export const COURSES_CATALOG: CourseDefinition[] = [
  {
    id: "dsa",
    code: "dsa",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    category: "Algorithmic Engineering & Problem Solving",
    score: 0,
    nextScore: 1,
    progressPercent: 0,
    theme: "purple",
    sectionNumber: 1,
    unitNumber: 1,
    unitTitle: "Algorithmic Complexity & Optimal Problem Solving",
    unitDescription: "Master LeetCode patterns, two pointers, sliding windows, arrays, trees, dynamic programming, and interview challenges.",
    theorySections: CPP_THEORY_COURSE_SECTIONS,
    questionsSections: DSA_QUESTIONS_COURSE_SECTIONS,
    sections: DSA_QUESTIONS_COURSE_SECTIONS,
    guidebook: {
      keyRules: [
        {
          title: "Boyer-Moore Voting Algorithm",
          desc: "Maintains a candidate and counter. When count is 0, pick current element. When current element matches candidate, increment count, else decrement.",
        },
        {
          title: "Two Pointers Technique",
          desc: "For sorted arrays, place pointers at opposite ends and move inward based on comparison against target sum, achieving O(N) linear time.",
        },
        {
          title: "Sliding Window Maximum",
          desc: "Use a monotonically decreasing deque storing indices to achieve O(N) window tracking.",
        },
      ],
      syntaxSnippet: `// Boyer-Moore Majority Element Algorithm in C++
int majorityElement(vector<int>& nums) {
    int candidate = 0, count = 0;
    for (int num : nums) {
        if (count == 0) candidate = num;
        count += (num == candidate) ? 1 : -1;
    }
    return candidate;
}`,
      syntaxLanguage: "cpp",
    },
  },
  {
    id: "generative_ai",
    code: "generative_ai",
    name: "Generative A.I",
    shortName: "Gen AI",
    category: "Generative Artificial Intelligence",
    score: 0,
    nextScore: 1,
    progressPercent: 0,
    theme: "blue",
    sectionNumber: 1,
    unitNumber: 1,
    unitTitle: "Prompt Engineering & Foundation Models",
    unitDescription: "AI Fluence 101: 3 Sub-sections (Prompt Engineering, Fine-Tuning LLM, RAG) with Duolingo-style slide learning.",
    theorySections: GENAI_THEORY_COURSE_SECTIONS,
    questionsSections: GENAI_QUESTIONS_COURSE_SECTIONS,
    sections: GENAI_THEORY_COURSE_SECTIONS,
    guidebook: {
      keyRules: [
        {
          title: "Vector Embeddings & Cosine Similarity",
          desc: "Text is converted to dense high-dimensional vectors (e.g., 768 or 1536 dims). Cosine similarity (dot product of normalized vectors) measures semantic closeness.",
        },
        {
          title: "Temperature & Top-P Sampling",
          desc: "Temperature scales logit variance: 0.0 creates deterministic output, while 0.7-1.0 promotes creativity. Top-P (nucleus) limits candidate tokens to cumulative probability P.",
        },
        {
          title: "RAG over Fine-Tuning for Dynamic Knowledge",
          desc: "Use Retrieval-Augmented Generation (RAG) when facts change frequently or require provenance citations; reserve fine-tuning (LoRA) for behavioral syntax adaptation.",
        },
      ],
      syntaxSnippet: `// Cosine Similarity Computation for Embedding Search
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}`,
      syntaxLanguage: "typescript",
    },
  },
  {
    id: "ai_for_everyone",
    code: "ai_for_everyone",
    name: "AI for Everyone",
    shortName: "AI 101",
    category: "AI Foundations & Real-World Impact",
    score: 0,
    nextScore: 1,
    progressPercent: 0,
    theme: "yellow",
    sectionNumber: 1,
    unitNumber: 1,
    unitTitle: "Demystifying Artificial Intelligence & Machine Learning",
    unitDescription: "Understand what AI actually is, how it differs from traditional code, and how machines learn from patterns.",
    theorySections: AI_FOR_EVERYONE_THEORY_SECTIONS,
    questionsSections: AI_FOR_EVERYONE_QUESTIONS_SECTIONS,
    sections: AI_FOR_EVERYONE_THEORY_SECTIONS,
    guidebook: {
      keyRules: [
        {
          title: "Rules vs. Statistical Learning",
          desc: "Traditional software handcodes if-else rules. Machine Learning inspects historical inputs and outputs to deduce the underlying mathematical rules automatically.",
        },
        {
          title: "Artificial Neurons & Weights",
          desc: "Each neuron computes an affine combination of inputs and weights, adjusted iteratively via gradient descent to minimize prediction loss.",
        },
        {
          title: "Multimodal Embeddings",
          desc: "Photos, audio, and language are all represented as dense vector coordinates, enabling semantic comparison across modalities.",
        },
      ],
      syntaxSnippet: `// The Machine Learning Paradigm Shift
// Rules + Data -> Answers (Traditional Programming)
// Data + Answers -> Rules / Model (Machine Learning)

const model = await trainModel(trainingDataset);
const prediction = model.predict(unseenFeatureVector);`,
      syntaxLanguage: "typescript",
    },
  },
];

export const DEFAULT_COURSE_ID = "generative_ai";
export const DEFAULT_ENROLLED_COURSES: string[] = ["generative_ai"];

const STORAGE_SELECTED_KEY = "aifluence_selected_course_v2";
const STORAGE_ENROLLED_KEY = "aifluence_enrolled_courses_v2";

/**
 * Gets the persisted course ID from localStorage.
 * Defaults strictly to "generative_ai" if nothing is stored or if value is invalid.
 */
export function getStoredCourseId(): string {
  try {
    const saved = localStorage.getItem(STORAGE_SELECTED_KEY);
    if (saved && COURSES_CATALOG.some((c) => c.id === saved)) {
      return saved;
    }
  } catch (err) {
    console.warn("Could not read stored course from localStorage:", err);
  }
  return DEFAULT_COURSE_ID;
}

/**
 * Persists the selected course ID durably into localStorage.
 */
export function persistCourseId(courseId: string): void {
  try {
    if (COURSES_CATALOG.some((c) => c.id === courseId)) {
      localStorage.setItem(STORAGE_SELECTED_KEY, courseId);
    }
  } catch (err) {
    console.warn("Could not persist course to localStorage:", err);
  }
}

/**
 * Gets the persisted enrolled course IDs from localStorage.
 * Defaults to [] for a new account.
 */
export function getStoredEnrolledCourseIds(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_ENROLLED_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter((id) => COURSES_CATALOG.some((c) => c.id === id));
        return valid;
      }
    }
  } catch (err) {
    console.warn("Could not read enrolled courses from localStorage:", err);
  }
  return [...DEFAULT_ENROLLED_COURSES];
}

/**
 * Persists the list of enrolled course IDs into localStorage.
 */
export function persistEnrolledCourseIds(courseIds: string[]): void {
  try {
    const valid = courseIds.filter((id) => COURSES_CATALOG.some((c) => c.id === id));
    localStorage.setItem(STORAGE_ENROLLED_KEY, JSON.stringify(valid));
  } catch (err) {
    console.warn("Could not persist enrolled courses to localStorage:", err);
  }
}

/**
 * Enrolls into a course, persists to localStorage, and returns the updated array.
 */
export function enrollInCourse(courseId: string): string[] {
  const current = getStoredEnrolledCourseIds();
  if (!current.includes(courseId) && COURSES_CATALOG.some((c) => c.id === courseId)) {
    const updated = [...current, courseId];
    persistEnrolledCourseIds(updated);
    persistCourseId(courseId);
    return updated;
  }
  persistCourseId(courseId);
  return current;
}
