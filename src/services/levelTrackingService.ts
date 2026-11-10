import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  fetchOrCreateStudentDailyQuests,
  saveStudentDailyQuests,
  fetchOrCreateDailyActivity,
  updateDailyActivityRecord,
  FirebaseQuestItem,
} from "./dailyQuestService";
import { getTodayStr } from "../utils/gamificationStore";
import { loadStoredStudentProfile } from "../utils/engagementStore";

export interface LevelAttemptRecord {
  id?: string;
  userId: string;
  courseId: string;
  courseName: string;
  levelId: string;
  levelTitle: string;
  lifeConsumed: boolean;
  starsEarned: number;
  scorePercent: number;
  completed: boolean;
  mistakesCount: number;
  date: string;
  timestamp: string;
}

/**
 * Record a level launch/attempt when a life is used
 */
export async function recordLevelLaunchWithLife(
  levelId: string,
  courseId: string = "generative_ai",
  levelTitle: string = ""
): Promise<void> {
  const userId = auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
  const today = getTodayStr();
  const attemptId = `attempt_${userId}_${levelId}_${Date.now()}`;

  const record: LevelAttemptRecord = {
    id: attemptId,
    userId,
    courseId,
    courseName: courseId.includes("genai") || courseId.includes("generative")
      ? "Generative AI"
      : courseId.includes("dsa")
      ? "Data Structures & Algorithms"
      : "AI for Everyone",
    levelId: String(levelId),
    levelTitle: levelTitle || `Level ${levelId}`,
    lifeConsumed: true,
    starsEarned: 0,
    scorePercent: 0,
    completed: false,
    mistakesCount: 0,
    date: today,
    timestamp: new Date().toISOString(),
  };

  // 1. Save to LocalStorage history
  try {
    const key = `scholar_level_attempts_${userId}`;
    const raw = localStorage.getItem(key);
    const existing: LevelAttemptRecord[] = raw ? JSON.parse(raw) : [];
    existing.unshift(record);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 100)));
  } catch (e) {}

  // 2. Save to Firestore
  if (userId && userId !== "guest_user") {
    try {
      await setDoc(doc(db, "level_attempts", attemptId), record, { merge: true });
    } catch (e) {
      console.warn("Error saving level attempt to Firestore:", e);
    }
  }
}

/**
 * Record level completion, stars, accuracy, and update daily quests & activity
 */
export async function recordLevelCompletionProgress(params: {
  levelId: string;
  courseId?: string;
  courseName?: string;
  levelTitle?: string;
  starsEarned: number;
  scorePercent?: number;
  mistakesCount?: number;
  lifeConsumed?: boolean;
}): Promise<void> {
  const userId = auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
  const today = getTodayStr();

  const cId = params.courseId || "generative_ai";
  const cName = params.courseName || (cId.includes("genai") || cId.includes("generative")
    ? "Generative AI"
    : cId.includes("dsa")
    ? "Data Structures & Algorithms"
    : "AI for Everyone");
  const lTitle = params.levelTitle || `Level ${params.levelId}`;
  const mistakes = params.mistakesCount ?? (params.starsEarned >= 3 ? 0 : params.starsEarned === 2 ? 1 : 3);
  const scorePct = params.scorePercent ?? (params.starsEarned >= 3 ? 100 : params.starsEarned === 2 ? 80 : 60);

  // 1. Save Level Attempt / Completion Record in Backend & Local Storage
  const attemptId = `attempt_${userId}_${params.levelId}_${Date.now()}`;
  const record: LevelAttemptRecord = {
    id: attemptId,
    userId,
    courseId: cId,
    courseName: cName,
    levelId: String(params.levelId),
    levelTitle: lTitle,
    lifeConsumed: params.lifeConsumed ?? true,
    starsEarned: params.starsEarned,
    scorePercent: scorePct,
    completed: true,
    mistakesCount: mistakes,
    date: today,
    timestamp: new Date().toISOString(),
  };

  try {
    const key = `scholar_level_attempts_${userId}`;
    const raw = localStorage.getItem(key);
    const existing: LevelAttemptRecord[] = raw ? JSON.parse(raw) : [];
    existing.unshift(record);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 100)));
  } catch (e) {}

  if (userId && userId !== "guest_user") {
    setDoc(doc(db, "level_attempts", attemptId), record, { merge: true }).catch(console.warn);
  }

  // 2. Update Daily Activity in Firestore
  try {
    const activity = await fetchOrCreateDailyActivity(userId);
    const newLessonsCount = (activity.lessonsCompleted || 0) + 1;
    const is90PlusAccuracy = scorePct >= 90 || params.starsEarned >= 3 || mistakes <= 1;
    const isAssessmentDone = activity.assessmentCompleted || is90PlusAccuracy;

    await updateDailyActivityRecord(userId, {
      lessonsCompleted: newLessonsCount,
      assessmentCompleted: isAssessmentDone,
    });

    // 3. Update Student Daily Quests (Firestore + localStorage sync)
    const questDoc = await fetchOrCreateStudentDailyQuests(userId, cId);
    let anyQuestChanged = false;

    const updatedQuests: FirebaseQuestItem[] = (questDoc.quests || []).map((q) => {
      let newP = q.p;

      // Lesson / Generative AI level completion quest (e.g. "Complete 2 Generative AI Lessons" or "Complete 2 Learning Lessons")
      if (
        q.category === "lessons" ||
        q.t.toLowerCase().includes("lesson") ||
        q.t.toLowerCase().includes("generative") ||
        q.t.toLowerCase().includes("level") ||
        q.t.toLowerCase().includes("interactive") ||
        q.id.includes("d1") ||
        q.id.includes("dq1")
      ) {
        newP = Math.min(q.g, (q.p || 0) + 1);
        if (newP !== q.p) anyQuestChanged = true;
      }

      // 90%+ Accuracy Assessment Quest
      if (
        (q.category === "assessment" || q.t.includes("90%") || q.t.toLowerCase().includes("assessment")) &&
        is90PlusAccuracy
      ) {
        newP = q.g; // Mark completed (1/1)
        if (newP !== q.p) anyQuestChanged = true;
      }

      return {
        ...q,
        p: newP,
      };
    });

    if (anyQuestChanged) {
      await saveStudentDailyQuests(userId, updatedQuests);

      // Sync both localStorage keys for instant UI response
      try {
        localStorage.setItem("aifluence_quests_daily_v5", JSON.stringify(updatedQuests));
        localStorage.setItem(`scholar_daily_quests_${userId}_${today}`, JSON.stringify(updatedQuests));
      } catch (e) {}
    }
  } catch (e) {
    console.warn("Error updating daily quest progress on lesson completion:", e);
  }
}

/**
 * Record viewing flashcard slides in theory levels
 */
export async function recordFlashcardProgress(count: number = 1): Promise<void> {
  const userId = auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
  const today = getTodayStr();

  try {
    const questDoc = await fetchOrCreateStudentDailyQuests(userId);
    let anyQuestChanged = false;

    const updatedQuests: FirebaseQuestItem[] = (questDoc.quests || []).map((q) => {
      if (
        q.category === "review" ||
        q.t.toLowerCase().includes("flashcard") ||
        q.t.toLowerCase().includes("review") ||
        q.id.includes("d4") ||
        q.id.includes("dq4")
      ) {
        const newP = Math.min(q.g, (q.p || 0) + count);
        if (newP !== q.p) {
          anyQuestChanged = true;
          return { ...q, p: newP };
        }
      }
      return q;
    });

    if (anyQuestChanged) {
      await saveStudentDailyQuests(userId, updatedQuests);
      try {
        localStorage.setItem("aifluence_quests_daily_v5", JSON.stringify(updatedQuests));
        localStorage.setItem(`scholar_daily_quests_${userId}_${today}`, JSON.stringify(updatedQuests));
      } catch (e) {}
    }
  } catch (e) {
    console.warn("Error recording flashcard progress:", e);
  }
}
