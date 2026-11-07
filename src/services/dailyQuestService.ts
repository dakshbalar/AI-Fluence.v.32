import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp,
  arrayUnion
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { getTodayStr, getYesterdayStr } from "../utils/gamificationStore";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface FirebaseQuestItem {
  id: string;
  t: string; // Title
  d: string; // Description
  p: number; // Progress
  g: number; // Goal
  r: number; // Reward gems
  claimed?: boolean;
  isMandatory?: boolean;
  estimatedMinutes?: number;
  category?: string;
}

export interface StudentDailyQuestDoc {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  quests: FirebaseQuestItem[];
  allMandatoryCompleted: boolean;
  updatedAt?: any;
}

export interface DailyActivityDoc {
  id: string;
  userId: string;
  date: string;
  activeMinutes: number;
  assessmentCompleted: boolean;
  earnedXP: number;
  lessonsCompleted: number;
  updatedAt?: any;
}

export interface StudentStreakDoc {
  id: string;
  userId: string;
  currentStreak: number;
  highestStreak: number;
  lastCompletedDate: string;
  history: string[];
  updatedAt?: any;
}

/**
 * Generate personalized daily quests based on student course/level
 */
export function generatePersonalizedDailyQuests(
  userId: string,
  courseId?: string
): FirebaseQuestItem[] {
  const courseKey = (courseId || "").toLowerCase();
  const isDsa = courseKey.includes("dsa") || courseKey.includes("data");
  const isGenAI = courseKey.includes("genai") || courseKey.includes("generative");

  return [
    {
      id: `dq1_${userId}`,
      t: isDsa 
        ? "Solve 2 DSA Algorithm Challenges" 
        : isGenAI 
        ? "Complete 2 Generative AI Lessons" 
        : "Complete 2 Interactive Lessons",
      d: isDsa 
        ? "Master array and string manipulation problems. Est. 15m" 
        : isGenAI 
        ? "Build prompt pipelines and neural models. Est. 15m" 
        : "Finish any 2 guided interactive levels of your choice. Est. 15m",
      p: 0,
      g: 2,
      r: 15,
      isMandatory: true,
      estimatedMinutes: 15,
      category: "lessons"
    },
    {
      id: `dq2_${userId}`,
      t: "30 Minutes App Activity",
      d: "Spend at least 30 minutes learning and practicing today. Est. 30m",
      p: 0,
      g: 30,
      r: 25,
      isMandatory: true,
      estimatedMinutes: 30,
      category: "time"
    },
    {
      id: `dq3_${userId}`,
      t: "Score 90%+ in Daily Assessment",
      d: "Demonstrate high accuracy in your daily practice drill. Est. 10m",
      p: 0,
      g: 1,
      r: 20,
      isMandatory: true,
      estimatedMinutes: 10,
      category: "assessment"
    },
    {
      id: `dq4_${userId}`,
      t: "Review 10 Practice Flashcards",
      d: "Keep your concept memory sharp with a quick review round. Est. 5m",
      p: 0,
      g: 10,
      r: 10,
      isMandatory: false,
      estimatedMinutes: 5,
      category: "review"
    },
    {
      id: `dq5_${userId}`,
      t: "Share Streak to Class Feed",
      d: "Share your learning streak progress with your classmates. Est. 1m",
      p: 0,
      g: 1,
      r: 10,
      isMandatory: false,
      estimatedMinutes: 1,
      category: "social"
    }
  ];
}

/**
 * Fetch or initialize student daily quests from Firestore collection `student_daily_quests`
 */
export async function fetchOrCreateStudentDailyQuests(
  userId: string,
  courseId?: string
): Promise<StudentDailyQuestDoc> {
  const today = getTodayStr();
  const docId = `${userId}_${today}`;
  const path = `student_daily_quests/${docId}`;

  try {
    const docRef = doc(db, "student_daily_quests", docId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as StudentDailyQuestDoc;
    }

    // Generate personalized daily quests
    const quests = generatePersonalizedDailyQuests(userId, courseId);
    const newDoc: StudentDailyQuestDoc = {
      id: docId,
      userId,
      date: today,
      quests,
      allMandatoryCompleted: false,
      updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, newDoc, { merge: true });

    // Seed templates into global `daily_quests` pool
    for (const q of quests) {
      const globalRef = doc(db, "daily_quests", q.id);
      await setDoc(globalRef, {
        id: q.id,
        title: q.t,
        description: q.d,
        targetGoal: q.g,
        rewardGems: q.r,
        estimatedMinutes: q.estimatedMinutes || 15,
        category: q.category || "general",
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    }

    return newDoc;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
  }
}

/**
 * Save updated student daily quests list to Firestore
 */
export async function saveStudentDailyQuests(
  userId: string,
  quests: FirebaseQuestItem[]
): Promise<void> {
  const today = getTodayStr();
  const docId = `${userId}_${today}`;
  const path = `student_daily_quests/${docId}`;

  const allMandatoryDone = quests
    .filter((q) => q.isMandatory)
    .every((q) => q.p >= q.g);

  try {
    const docRef = doc(db, "student_daily_quests", docId);
    await setDoc(
      docRef,
      {
        id: docId,
        userId,
        date: today,
        quests,
        allMandatoryCompleted: allMandatoryDone,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch or initialize daily activity tracking in Firestore collection `daily_activity`
 */
export async function fetchOrCreateDailyActivity(
  userId: string
): Promise<DailyActivityDoc> {
  const today = getTodayStr();
  const docId = `${userId}_${today}`;
  const path = `daily_activity/${docId}`;

  try {
    const docRef = doc(db, "daily_activity", docId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as DailyActivityDoc;
    }

    const newDoc: DailyActivityDoc = {
      id: docId,
      userId,
      date: today,
      activeMinutes: 0, // Clean 0 initial active minutes
      assessmentCompleted: false,
      earnedXP: 0,
      lessonsCompleted: 0,
      updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, newDoc, { merge: true });
    return newDoc;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
  }
}

/**
 * Update student daily activity in Firestore
 */
export async function updateDailyActivityRecord(
  userId: string,
  update: Partial<DailyActivityDoc>
): Promise<void> {
  const today = getTodayStr();
  const docId = `${userId}_${today}`;
  const path = `daily_activity/${docId}`;

  try {
    const docRef = doc(db, "daily_activity", docId);
    await setDoc(
      docRef,
      {
        id: docId,
        userId,
        date: today,
        ...update,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch student streak record from Firestore collection `student_streaks`
 */
export async function fetchStudentStreak(userId: string): Promise<StudentStreakDoc> {
  const path = `student_streaks/${userId}`;
  try {
    const docRef = doc(db, "student_streaks", userId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as StudentStreakDoc;
    }

    const today = getTodayStr();
    const newStreakDoc: StudentStreakDoc = {
      id: userId,
      userId,
      currentStreak: 1,
      highestStreak: 1,
      lastCompletedDate: "",
      history: [],
      updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, newStreakDoc, { merge: true });
    return newStreakDoc;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
  }
}

/**
 * Verify daily completion logic and update student streak in `student_streaks` and `users`
 */
export async function verifyAndRecordDailyStreak(
  userId: string,
  quests: FirebaseQuestItem[],
  activeMinutes: number,
  assessmentCompleted: boolean
): Promise<{
  requirementsMet: boolean;
  streakUpdated: boolean;
  currentStreak: number;
  message: string;
}> {
  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  // 1. Mandatory quests check
  const mandatoryQuests = quests.filter((q) => q.isMandatory !== false);
  const mandatoryDone = mandatoryQuests.every((q) => q.p >= q.g);

  // 2. 30 minutes app activity check
  const activityDone = activeMinutes >= 30;

  // 3. Daily assessment check
  const assessmentDone = assessmentCompleted || quests.some((q) => q.category === "assessment" && q.p >= q.g);

  const requirementsMet = mandatoryDone && activityDone && assessmentDone;

  if (!requirementsMet) {
    return {
      requirementsMet: false,
      streakUpdated: false,
      currentStreak: 1,
      message: `Complete all mandatory tasks (Min 30m active time & Daily Assessment) to extend streak!`
    };
  }

  // Check existing streak in Firestore
  const streakData = await fetchStudentStreak(userId);

  // Prevent duplicate streak increment on the same date
  if (streakData.lastCompletedDate === today) {
    return {
      requirementsMet: true,
      streakUpdated: false,
      currentStreak: streakData.currentStreak,
      message: `🔥 Streak for today (${today}) is already verified!`
    };
  }

  let newStreak = 1;
  if (streakData.lastCompletedDate === yesterday) {
    newStreak = streakData.currentStreak + 1;
  } else if (streakData.currentStreak > 0 && streakData.lastCompletedDate === today) {
    newStreak = streakData.currentStreak;
  } else {
    newStreak = 1; // streak reset
  }

  const highestStreak = Math.max(streakData.highestStreak || 1, newStreak);
  const history = Array.isArray(streakData.history) ? [...streakData.history] : [];
  if (!history.includes(today)) {
    history.push(today);
  }

  const updatedStreakDoc: StudentStreakDoc = {
    id: userId,
    userId,
    currentStreak: newStreak,
    highestStreak,
    lastCompletedDate: today,
    history,
    updatedAt: new Date().toISOString()
  };

  // Write to student_streaks
  const streakPath = `student_streaks/${userId}`;
  try {
    await setDoc(doc(db, "student_streaks", userId), updatedStreakDoc, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, streakPath);
  }

  // Sync to users collection
  const userPath = `users/${userId}`;
  try {
    await setDoc(
      doc(db, "users", userId),
      {
        streak: newStreak,
        lastActiveDate: today,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, userPath);
  }

  return {
    requirementsMet: true,
    streakUpdated: true,
    currentStreak: newStreak,
    message: `🎉 Daily Streak Verified! Current streak: ${newStreak} days! 🔥`
  };
}

/**
 * Get exact total number of days in a given month and year
 * e.g., November (monthIndex 10) -> 30 days, December (monthIndex 11) -> 31 days, Feb -> 28/29
 */
export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export interface StudentMonthlyQuestDoc {
  id: string;
  userId: string;
  year: number;
  monthIndex: number;
  completedDaysCount: number;
  completedDates: string[];
  updatedAt?: any;
}

/**
 * Fetch or initialize student monthly quest progress for a specific month
 */
export async function fetchStudentMonthlyQuestProgress(
  userId: string,
  year: number,
  monthIndex: number
): Promise<{ completedDays: number; totalDays: number; completedDates: string[] }> {
  const totalDays = getDaysInMonth(year, monthIndex);
  const docId = `${userId}_${year}_${monthIndex}`;
  const path = `student_monthly_quests/${docId}`;

  try {
    const docRef = doc(db, "student_monthly_quests", docId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data() as StudentMonthlyQuestDoc;
      return {
        completedDays: data.completedDaysCount || (data.completedDates || []).length,
        totalDays,
        completedDates: data.completedDates || []
      };
    }

    // Fallback: derive completed dates in this month from student_streaks history
    const streakDoc = await fetchStudentStreak(userId);
    const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    const matchingDates = (streakDoc.history || []).filter((d) => d.startsWith(monthPrefix));

    const initialDoc: StudentMonthlyQuestDoc = {
      id: docId,
      userId,
      year,
      monthIndex,
      completedDaysCount: matchingDates.length,
      completedDates: matchingDates,
      updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, initialDoc, { merge: true }).catch(() => {});

    return {
      completedDays: matchingDates.length,
      totalDays,
      completedDates: matchingDates
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return { completedDays: 0, totalDays, completedDates: [] };
  }
}

/**
 * Increment monthly completed days when student satisfies all daily tasks
 */
export async function recordMonthlyQuestDayCompletion(
  userId: string,
  year: number,
  monthIndex: number,
  dateStr: string
): Promise<number> {
  const totalDays = getDaysInMonth(year, monthIndex);
  const docId = `${userId}_${year}_${monthIndex}`;

  try {
    const docRef = doc(db, "student_monthly_quests", docId);
    const snap = await getDoc(docRef);

    let completedDates: string[] = [];
    if (snap.exists()) {
      const data = snap.data() as StudentMonthlyQuestDoc;
      completedDates = data.completedDates || [];
    }

    if (!completedDates.includes(dateStr)) {
      completedDates.push(dateStr);
    }

    const newCount = Math.min(totalDays, completedDates.length);
    const updateData: StudentMonthlyQuestDoc = {
      id: docId,
      userId,
      year,
      monthIndex,
      completedDaysCount: newCount,
      completedDates,
      updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, updateData, { merge: true });
    return newCount;
  } catch (err) {
    console.warn("Failed to update monthly quest day completion:", err);
    return 0;
  }
}

