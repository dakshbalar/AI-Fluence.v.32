export interface LevelPlanLevel {
  level_id: string; // e.g. "PE-M1-L1"
  star_number: number; // 1, 2, 3... shown to user as Level N
  lesson_number_in_book: number;
  global_index: number;
  title: string;
}

export interface LevelPlanModule {
  module_id: string; // e.g. "PE-M1"
  module_number: number;
  module_name: string;
  levels: LevelPlanLevel[];
}

export interface LevelPlanBook {
  book_id: "PE" | "FT" | "RAG" | "AFE" | string;
  book_name: string;
  unit_word: "Module" | "Part" | string;
  modules: LevelPlanModule[];
}

export interface LevelPlanCourse {
  course_id: "genai" | "afe" | string;
  course_name: string;
  books: LevelPlanBook[];
}

export interface LevelPlanData {
  courses: LevelPlanCourse[];
}

export type QuizAngle =
  | "definition_recall"
  | "why_it_matters"
  | "compare_contrast"
  | "spot_the_mistake"
  | "apply_to_scenario"
  | "vocabulary_match"
  | "sequence_or_flow"
  | "true_false_nuance"
  | "fill_in_blank"
  | "analogy_check";

export interface LessonContextItem {
  level_id: string;
  course_id: "genai" | "afe" | string;
  book_id: "PE" | "FT" | "RAG" | "AFE" | string;
  book_name: string;
  module_id: string;
  module_number: number;
  module_name: string;
  star_number: number;
  title: string;
  source_excerpt: string;
  quiz_focus_rotation: QuizAngle[];
}

export interface GeneratedTheorySlide {
  slide_number: number;
  title: string;
  content: string[];
  key_takeaway?: string;
  analogy_or_scenario?: string;
  bullets?: string[];
  bridge_next?: string;
}

export interface GeneratedQuizQuestion {
  question_id: string;
  angle: QuizAngle;
  angle_label?: string;
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
  scenario?: string;
  question_hash?: string;
}

export interface GeneratedLevelDecks {
  level_id: string;
  title: string;
  theory_slides: GeneratedTheorySlide[];
  quiz_questions: GeneratedQuizQuestion[];
  generated_at: string;
  is_cached?: boolean;
}

export interface UsedQuestionRecord {
  question_hash: string;
  level_id: string;
  angle: QuizAngle;
  created_at: string;
}
