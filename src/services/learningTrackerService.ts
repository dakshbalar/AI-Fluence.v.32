import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { getTodayStr } from "../utils/gamificationStore";
import {
  fetchOrCreateDailyActivity,
  fetchOrCreateStudentDailyQuests,
  saveStudentDailyQuests,
  updateDailyActivityRecord,
  FirebaseQuestItem,
} from "./dailyQuestService";
import { cleanFirestoreData } from "../utils/engagementStore";

export interface LevelAttemptRecord {
  attemptId: string;
  userId: string;
  courseId: string;
  levelId: string;
  levelTitle: string;
  stars: number;
  completed: boolean;
  scorePercent: number;
  mistakes: number;
  livesUsed: number;
  flashcardsViewed: number;
  date: string; // YYYY-MM-DD
  timestamp: string;
}

const LOCAL_STORAGE_KEY_ATTEMPTS = "scholar_level_attempts_log_v1";
const LOCAL_STORAGE_KEY_DAILY_QUESTS = "aifluence_quests_daily_v5";

/**
 * Helper to retrieve currently stored student ID
 */
function getActiveUserId(): string {
  return auth.currentUser?.uid || "guest_user";
}

/**
 * Record a level attempt and completion in Firestore & localStorage,
 * and update Daily Quests progress (2 Generative AI levels, 90%+ score, 10 flashcards).
 */
export async function recordLevelAttemptAndCompletion(params: {
  courseId?: string;
  levelId: string;
  levelTitle?: string;
  stars: number;
  completed: boolean;
  scorePercent?: number;
  mistakes?: number;
  livesUsed?: number;
  flashcardsViewed?: number;
}): Promise<void> {
  const userId = getActiveUserId();
  const today = getTodayStr();
  const courseId = params.courseId || "generative_ai";
  const levelTitle = params.levelTitle || `Level ${params.levelId}`;
  const mistakes = params.mistakes ?? (params.stars === 3 ? 0 : params.stars === 2 ? 1 : 3);
  const scorePercent =
    params.scorePercent !== undefined
      ? params.scorePercent
      : params.stars === 3
      ? 100
      : params.stars === 2
      ? 80
      : params.stars === 1
      ? 60
      : 40;
  const livesUsed = params.livesUsed ?? 1;
  const flashcardsViewed = params.flashcardsViewed ?? 0;

  const attemptId = `att_${userId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const record: LevelAttemptRecord = {
    attemptId,
    userId,
    courseId,
    levelId: params.levelId,
    levelTitle,
    stars: params.stars,
    completed: params.completed,
    scorePercent,
    mistakes,
    livesUsed,
    flashcardsViewed,
    date: today,
    timestamp: new Date().toISOString(),
  };

  // 1. Store locally in localStorage attempts log
  try {
    const rawLog = localStorage.getItem(`${LOCAL_STORAGE_KEY_ATTEMPTS}_${userId}`);
    const log: LevelAttemptRecord[] = rawLog ? JSON.parse(rawLog) : [];
    log.unshift(record);
    // Keep last 100 attempts
    localStorage.setItem(`${LOCAL_STORAGE_KEY_ATTEMPTS}_${userId}`, JSON.stringify(log.slice(0, 100)));
  } catch (e) {
    console.warn("Could not save level attempt locally:", e);
  }

  // 2. Save attempt to Firestore collection `level_attempts`
  if (userId && userId !== "guest_user") {
    setDoc(doc(db, "level_attempts", attemptId), cleanFirestoreData({ ...record, createdAt: serverTimestamp() }), {
      merge: true,
    }).catch(console.warn);
  }

  // 3. Update Daily Activity stats
  try {
    const activity = await fetchOrCreateDailyActivity(userId);
    const newLessonsCount = (activity.lessonsCompleted || 0) + (params.completed ? 1 : 0);
    const isHighAccuracy = scorePercent >= 90 || params.stars >= 3 || mistakes <= 0;

    await updateDailyActivityRecord(userId, {
      lessonsCompleted: newLessonsCount,
      assessmentCompleted: activity.assessmentCompleted || isHighAccuracy,
    });

    // 4. Update Daily Quests progress in Firestore and Local Storage
    const questDoc = await fetchOrCreateStudentDailyQuests(userId, courseId);
    let questsUpdated = false;

    const updatedQuests: FirebaseQuestItem[] = (questDoc.quests || []).map((q) => {
      let nextP = q.p;
      const cat = (q.category || "").toLowerCase();
      const titleLower = q.t.toLowerCase();

      // Quest 1: Complete 2 Lessons (Generative AI / Interactive)
      if (cat === "lessons" || titleLower.includes("lesson") || titleLower.includes("level") || titleLower.includes("generative")) {
        if (params.completed) {
          nextP = Math.min(q.g, Math.max(q.p + 1, newLessonsCount));
          questsUpdated = true;
        }
      }

      // Quest 3: 90%+ Score in Assessment
      if (cat === "assessment" || titleLower.includes("assessment") || titleLower.includes("90%") || titleLower.includes("score")) {
        if (isHighAccuracy) {
          nextP = q.g; // Mark as 1/1 completed
          questsUpdated = true;
        }
      }

      // Quest 4: Review Flashcards
      if (cat === "review" || titleLower.includes("flashcard") || titleLower.includes("review")) {
        if (flashcardsViewed > 0) {
          nextP = Math.min(q.g, q.p + flashcardsViewed);
          questsUpdated = true;
        }
      }

      return {
        ...q,
        p: nextP,
      };
    });

    if (questsUpdated) {
      await saveStudentDailyQuests(userId, updatedQuests);

      // Sync to local storage for instant UI response in QuestsPage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_DAILY_QUESTS, JSON.stringify(updatedQuests));
        localStorage.setItem(`scholar_daily_quests_${userId}_${today}`, JSON.stringify(updatedQuests));
      } catch (e) {}
    }
  } catch (err) {
    console.warn("Could not update daily quests from level attempt:", err);
  }
}

/**
 * Record viewing of flashcards/theory slides to advance Quest d4 ("Review 10 Practice Flashcards")
 */
export async function recordFlashcardReview(count: number = 1, courseId: string = "generative_ai"): Promise<void> {
  const userId = getActiveUserId();
  const today = getTodayStr();

  try {
    const questDoc = await fetchOrCreateStudentDailyQuests(userId, courseId);
    let updated = false;

    const updatedQuests = (questDoc.quests || []).map((q) => {
      const cat = (q.category || "").toLowerCase();
      const titleLower = q.t.toLowerCase();

      if (cat === "review" || titleLower.includes("flashcard") || titleLower.includes("review")) {
        const nextP = Math.min(q.g, q.p + count);
        if (nextP !== q.p) {
          updated = true;
          return { ...q, p: nextP };
        }
      }
      return q;
    });

    if (updated) {
      await saveStudentDailyQuests(userId, updatedQuests);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_DAILY_QUESTS, JSON.stringify(updatedQuests));
        localStorage.setItem(`scholar_daily_quests_${userId}_${today}`, JSON.stringify(updatedQuests));
      } catch (e) {}
    }
  } catch (err) {
    console.warn("Could not record flashcard review:", err);
  }
}

/**
 * Record life usage event when starting or retrying a level
 */
export async function recordLifeUsageEvent(levelId: string, courseId: string = "generative_ai"): Promise<void> {
  const userId = getActiveUserId();
  const logId = `life_${userId}_${Date.now()}`;
  const record = {
    logId,
    userId,
    levelId,
    courseId,
    date: getTodayStr(),
    timestamp: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(`scholar_lives_used_log_${userId}`);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(record);
    localStorage.setItem(`scholar_lives_used_log_${userId}`, JSON.stringify(list.slice(0, 50)));
  } catch (e) {}

  if (userId && userId !== "guest_user") {
    setDoc(doc(db, "lives_logs", logId), cleanFirestoreData(record), { merge: true }).catch(console.warn);
  }
}
