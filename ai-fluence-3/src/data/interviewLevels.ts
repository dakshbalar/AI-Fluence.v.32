export interface InterviewLevel {
  id: number;
  title: string;
  subtitle: string;
  role: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface InterviewChapter {
  id: number;
  title: string;
  levels: InterviewLevel[];
}

export const INTERVIEW_CHAPTERS: InterviewChapter[] = [
  {
    id: 1,
    title: "Algorithmic Screening Round",
    levels: [
      { id: 1, title: "Array & Pointer Mastery", subtitle: "Two Sum & Kadane's", role: "Software Engineer", difficulty: "Easy" },
      { id: 2, title: "Sliding Window Maximum", subtitle: "Bounded subarray optimization", role: "Software Engineer", difficulty: "Medium" },
    ],
  },
  {
    id: 2,
    title: "System & AI Architecture Round",
    levels: [
      { id: 3, title: "Scalable Vector Search", subtitle: "RAG index design", role: "AI Engineer", difficulty: "Hard" },
      { id: 4, title: "Low-Latency Caching", subtitle: "Redis cluster topology", role: "Staff Engineer", difficulty: "Medium" },
    ],
  },
];
