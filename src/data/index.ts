export interface Course {
  id: number;
  title: string;
  description: string;
  category: "course" | "workshop" | "certification";
  gradient: string;
  badge?: string;
  duration?: string;
  lessonsCount?: number;
  progress?: number;
  image?: string;
  tags?: string[];
}

export interface Toolkit {
  id: number | string;
  title: string;
  description: string;
  category?: string;
  tag?: string;
  year?: number | string;
}

export const coursesData: Course[] = [
  {
    id: 10,
    title: "Generative AI Engineering",
    description: "Master prompt engineering, fine-tuning LLMs, and RAG pipelines.",
    category: "course",
    gradient: "from-[#2563eb] to-[#7c3aed]",
    badge: "Hot",
    duration: "18h",
    lessonsCount: 42,
    progress: 15,
  },
  {
    id: 11,
    title: "Data Structures & Algorithms in C++",
    description: "Conquer LeetCode patterns with optimal time and space complexity.",
    category: "course",
    gradient: "from-[#9333ea] to-[#c026d3]",
    badge: "Popular",
    duration: "25h",
    lessonsCount: 50,
    progress: 10,
  },
  {
    id: 12,
    title: "AI for Everyone: Foundations",
    description: "Intuitive mental models of neural networks and machine learning.",
    category: "workshop",
    gradient: "from-[#eab308] to-[#f97316]",
    badge: "Beginner",
    duration: "8h",
    lessonsCount: 20,
    progress: 0,
  },
];

export const toolkitsData: Toolkit[] = [
  {
    id: "tk-1",
    title: "Modern AI Engineering Playbook",
    description: "Production guidelines for latency, caching, and evaluation harnesses.",
    category: "Handbook",
    tag: "AI",
    year: 2025,
  },
  {
    id: "tk-2",
    title: "DSA Cheat Sheet & Patterns",
    description: "Instant algorithmic reference for high-frequency technical interviews.",
    category: "CheatSheet",
    tag: "DSA",
    year: 2025,
  },
];
