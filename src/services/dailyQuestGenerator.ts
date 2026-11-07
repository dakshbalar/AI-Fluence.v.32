import { doc, getDoc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { cleanFirestoreData, loadStoredStudentProfile } from "../utils/engagementStore";
import { getTodayDateStr } from "./activeLearningTracker";

export interface StudentQuestAssignment {
  assignmentId: string;
  uid: string;
  questId: string;
  date: string; // YYYY-MM-DD
  questNumber: number; // 1 to 5
  title: string;
  description: string;
  category: "Theory" | "Lesson" | "Challenge" | "Practical" | "Assessment";
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedMinutes: number;
  actualMinutes: number;
  xpReward: number;
  status: "Locked" | "Available" | "In Progress" | "Completed";
  completedAt?: string;
  isMandatory: boolean;
  actionRoute?: string;
}

const COURSE_QUEST_MAP: Record<string, { topic: string; practicalTitle: string; challengeTitle: string }> = {
  generative_ai: {
    topic: "LLM Prompting & Transformer Attention",
    practicalTitle: "Craft an Autonomous System Prompt",
    challengeTitle: "Fix Prompt Injection Vulnerability",
  },
  ai_for_everyone: {
    topic: "Neural Network Fundamentals & AI Ethics",
    practicalTitle: "Build a Machine Learning Classifier",
    challengeTitle: "Solve the AI Model Bias Quiz",
  },
  dsa: {
    topic: "Binary Search Trees & Graph Traversal",
    practicalTitle: "Implement Dijkstra's Shortest Path",
    challengeTitle: "Solve Time Complexity Challenge",
  },
  default: {
    topic: "Core AI Concepts & Agentic Workflows",
    practicalTitle: "Build & Test an AI Assistant Pipeline",
    challengeTitle: "Master Daily Knowledge Drill",
  },
};

export function generateDailyQuestSetForStudent(
  uid: string,
  dateStr: string = getTodayDateStr(),
  courseId: string = "generative_ai"
): StudentQuestAssignment[] {
  const profile = loadStoredStudentProfile();
  const config = COURSE_QUEST_MAP[courseId] || COURSE_QUEST_MAP.default;

  return [
    {
      assignmentId: `${uid}_${dateStr}_q1`,
      uid,
      questId: "q1_concept",
      date: dateStr,
      questNumber: 1,
      title: `Quest 01: Learn Today's AI Concept`,
      description: `Study ${config.topic} in interactive theory slides.`,
      category: "Theory",
      difficulty: "Easy",
      estimatedMinutes: 8,
      actualMinutes: 0,
      xpReward: 30,
      status: "Available",
      isMandatory: true,
      actionRoute: "home",
    },
    {
      assignmentId: `${uid}_${dateStr}_q2`,
      uid,
      questId: "q2_lesson",
      date: dateStr,
      questNumber: 2,
      title: `Quest 02: Complete an Interactive Lesson`,
      description: `Work through guided step-by-step code exercises and concept decks.`,
      category: "Lesson",
      difficulty: "Medium",
      estimatedMinutes: 7,
      actualMinutes: 0,
      xpReward: 30,
      status: "Available",
      isMandatory: true,
      actionRoute: "home",
    },
    {
      assignmentId: `${uid}_${dateStr}_q3`,
      uid,
      questId: "q3_challenge",
      date: dateStr,
      questNumber: 3,
      title: `Quest 03: ${config.challengeTitle}`,
      description: `Test your problem-solving accuracy in today's timed drill.`,
      category: "Challenge",
      difficulty: "Hard",
      estimatedMinutes: 7,
      actualMinutes: 0,
      xpReward: 40,
      status: "Available",
      isMandatory: true,
      actionRoute: "home",
    },
    {
      assignmentId: `${uid}_${dateStr}_q4`,
      uid,
      questId: "q4_practical",
      date: dateStr,
      questNumber: 4,
      title: `Quest 04: ${config.practicalTitle}`,
      description: `Execute hands-on prompt engineering and tool building in Lumi studio.`,
      category: "Practical",
      difficulty: "Medium",
      estimatedMinutes: 5,
      actualMinutes: 0,
      xpReward: 30,
      status: "Available",
      isMandatory: true,
      actionRoute: "avatar",
    },
    {
      assignmentId: `${uid}_${dateStr}_q5`,
      uid,
      questId: "q5_assessment",
      date: dateStr,
      questNumber: 5,
      title: `Quest 05: Daily Knowledge Assessment`,
      description: `Take the mandatory 3-minute end-of-day knowledge check to complete your streak.`,
      category: "Assessment",
      difficulty: "Easy",
      estimatedMinutes: 3,
      actualMinutes: 0,
      xpReward: 20,
      status: "Available",
      isMandatory: true,
      actionRoute: "quests",
    },
  ];
}

export async function fetchOrCreateStudentDailyQuests(
  courseId: string = "generative_ai"
): Promise<StudentQuestAssignment[]> {
  const dateStr = getTodayDateStr();
  const uid = auth.currentUser?.uid || "guest_user";
  const localKey = `scholar_daily_quests_${uid}_${dateStr}`;

  // 1. Try loading from localStorage first
  try {
    const rawLocal = localStorage.getItem(localKey);
    if (rawLocal) {
      const parsed: StudentQuestAssignment[] = JSON.parse(rawLocal);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  // 2. Try loading from Firestore if online
  if (uid && uid !== "guest_user") {
    try {
      const q = query(
        collection(db, "student_daily_quests"),
        where("uid", "==", uid),
        where("date", "==", dateStr)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const loaded: StudentQuestAssignment[] = [];
        snap.forEach((docSnap) => {
          loaded.push(docSnap.data() as StudentQuestAssignment);
        });
        loaded.sort((a, b) => a.questNumber - b.questNumber);
        localStorage.setItem(localKey, JSON.stringify(loaded));
        return loaded;
      }
    } catch (e) {
      console.warn("Could not query Firestore for student daily quests:", e);
    }
  }

  // 3. Otherwise generate fresh daily quests for today
  const freshQuests = generateDailyQuestSetForStudent(uid, dateStr, courseId);
  try {
    localStorage.setItem(localKey, JSON.stringify(freshQuests));
  } catch (e) {}

  // Save to Firestore asynchronously
  if (uid && uid !== "guest_user") {
    for (const qItem of freshQuests) {
      setDoc(doc(db, "student_daily_quests", qItem.assignmentId), cleanFirestoreData(qItem), {
        merge: true,
      }).catch(console.warn);
    }
  }

  return freshQuests;
}

export async function updateQuestStatus(
  assignmentId: string,
  newStatus: "In Progress" | "Completed",
  actualMinutesSpent?: number
): Promise<StudentQuestAssignment[]> {
  const dateStr = getTodayDateStr();
  const uid = auth.currentUser?.uid || "guest_user";
  const localKey = `scholar_daily_quests_${uid}_${dateStr}`;

  let currentQuests: StudentQuestAssignment[] = await fetchOrCreateStudentDailyQuests();

  const updatedQuests = currentQuests.map((q) => {
    if (q.assignmentId === assignmentId) {
      return {
        ...q,
        status: newStatus,
        completedAt: newStatus === "Completed" ? new Date().toISOString() : q.completedAt,
        actualMinutes: actualMinutesSpent !== undefined ? actualMinutesSpent : q.estimatedMinutes,
      };
    }
    return q;
  });

  try {
    localStorage.setItem(localKey, JSON.stringify(updatedQuests));
  } catch (e) {}

  // Update in Firestore
  const targetQuest = updatedQuests.find((q) => q.assignmentId === assignmentId);
  if (targetQuest && uid && uid !== "guest_user") {
    setDoc(doc(db, "student_daily_quests", assignmentId), cleanFirestoreData(targetQuest), {
      merge: true,
    }).catch(console.warn);
  }

  return updatedQuests;
}
