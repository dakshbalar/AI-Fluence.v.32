import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { cleanFirestoreData, loadStoredStudentProfile, saveProfile } from "../utils/engagementStore";
import { getTodayDateStr, activeLearningTracker, DailyActivityData } from "./activeLearningTracker";
import { fetchOrCreateStudentDailyQuests, StudentQuestAssignment } from "./dailyQuestGenerator";

export type StreakState = "Not Started" | "In Progress" | "Almost There" | "Completed" | "Missed";

export interface StudentStreakData {
  uid: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletedDays: number;
  lastCompletedDate: string; // YYYY-MM-DD
  streakStartDate: string;
  lastUpdated: string;
}

export interface StreakHistoryEntry {
  date: string; // YYYY-MM-DD
  isCompleted: boolean;
  activeMinutes: number;
  questsCompleted: number;
  totalQuests: number;
  xpEarned: number;
  completedAt?: string;
}

export interface DailyStreakEvaluation {
  date: string;
  questsCompleted: number;
  totalQuests: number;
  allQuestsCompleted: boolean;
  activeMinutes: number;
  targetMinutes: number; // 30
  timeTargetReached: boolean;
  assessmentCompleted: boolean;
  allConditionsMet: boolean;
  streakState: StreakState;
  percentProgress: number; // 0 - 100
  isAlreadyClaimedToday: boolean;
  currentStreak: number;
  longestStreak: number;
}

const STREAK_MILESTONES = [3, 7, 15, 30, 60, 100];

export function getYesterdayDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function evaluateDailyStreakStatus(): Promise<DailyStreakEvaluation> {
  const dateStr = getTodayDateStr();
  const uid = auth.currentUser?.uid || "guest_user";

  const quests: StudentQuestAssignment[] = await fetchOrCreateStudentDailyQuests();
  const activity: DailyActivityData = activeLearningTracker.getDailyActivityData();

  const completedQuests = quests.filter((q) => q.status === "Completed");
  const questsCompleted = completedQuests.length;
  const totalQuests = quests.length;
  const allQuestsCompleted = questsCompleted >= totalQuests;

  const activeMinutes = activity.activeMinutes;
  const targetMinutes = 30;
  const timeTargetReached = activeMinutes >= targetMinutes;

  const assessmentQuest = quests.find((q) => q.category === "Assessment");
  const assessmentCompleted = assessmentQuest ? assessmentQuest.status === "Completed" : allQuestsCompleted;

  // Streak is completed if quests >= totalQuests AND activeMinutes >= 30 AND assessment is completed
  const allConditionsMet = allQuestsCompleted && timeTargetReached && assessmentCompleted;

  // Calculate Progress Percentage (50% from quests, 50% from time)
  const questPercent = (questsCompleted / Math.max(1, totalQuests)) * 50;
  const timePercent = Math.min(1, activeMinutes / targetMinutes) * 50;
  const percentProgress = Math.min(100, Math.round(questPercent + timePercent));

  let streakState: StreakState = "Not Started";
  if (allConditionsMet) {
    streakState = "Completed";
  } else if (percentProgress >= 80) {
    streakState = "Almost There";
  } else if (percentProgress > 0) {
    streakState = "In Progress";
  }

  // Load stored streak info
  const streakData = getStoredStreakData(uid);
  const isAlreadyClaimedToday = streakData.lastCompletedDate === dateStr;

  return {
    date: dateStr,
    questsCompleted,
    totalQuests,
    allQuestsCompleted,
    activeMinutes,
    targetMinutes,
    timeTargetReached,
    assessmentCompleted,
    allConditionsMet,
    streakState: isAlreadyClaimedToday ? "Completed" : streakState,
    percentProgress: isAlreadyClaimedToday ? 100 : percentProgress,
    isAlreadyClaimedToday,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
  };
}

export function getStoredStreakData(uid: string): StudentStreakData {
  const defaultStreak: StudentStreakData = {
    uid,
    currentStreak: 12, // Starting demo streak for AI Pioneers
    longestStreak: 15,
    totalCompletedDays: 24,
    lastCompletedDate: getYesterdayDateStr(),
    streakStartDate: getTodayDateStr(),
    lastUpdated: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(`scholar_streak_data_${uid}`);
    if (raw) {
      const parsed: StudentStreakData = JSON.parse(raw);
      // Validate day rollover: if missed yesterday & today, reset or mark missed
      const yesterday = getYesterdayDateStr();
      const today = getTodayDateStr();
      if (
        parsed.lastCompletedDate &&
        parsed.lastCompletedDate !== today &&
        parsed.lastCompletedDate !== yesterday
      ) {
        // Streak broken if gap is > 1 day
        parsed.currentStreak = 0;
      }
      return parsed;
    }
  } catch (e) {}

  return defaultStreak;
}

export function saveStoredStreakData(uid: string, data: StudentStreakData) {
  try {
    localStorage.setItem(`scholar_streak_data_${uid}`, JSON.stringify(data));
  } catch (e) {}

  // Sync to Firestore
  if (uid && uid !== "guest_user") {
    setDoc(doc(db, "student_streaks", uid), cleanFirestoreData(data), { merge: true }).catch(
      console.warn
    );
    // Sync to user profile as well
    setDoc(
      doc(db, "users", uid),
      cleanFirestoreData({
        currentStreak: data.currentStreak,
        longestStreak: data.longestStreak,
        totalStreakDays: data.totalCompletedDays,
        lastStreakDate: data.lastCompletedDate,
      }),
      { merge: true }
    ).catch(console.warn);
  }
}

export async function processStreakCompletionIfEligible(): Promise<{
  newStreakCount: number;
  xpEarned: number;
  isFirstTimeToday: boolean;
}> {
  const uid = auth.currentUser?.uid || "guest_user";
  const dateStr = getTodayDateStr();

  const evalResult = await evaluateDailyStreakStatus();

  if (!evalResult.allConditionsMet) {
    return {
      newStreakCount: evalResult.currentStreak,
      xpEarned: 0,
      isFirstTimeToday: false,
    };
  }

  const streakData = getStoredStreakData(uid);

  // If already completed today, return current state
  if (streakData.lastCompletedDate === dateStr) {
    return {
      newStreakCount: streakData.currentStreak,
      xpEarned: 0,
      isFirstTimeToday: false,
    };
  }

  // Increment streak by 1!
  const newCurrentStreak = streakData.currentStreak + 1;
  const newLongestStreak = Math.max(streakData.longestStreak, newCurrentStreak);
  const newTotalDays = streakData.totalCompletedDays + 1;

  const updatedStreakData: StudentStreakData = {
    ...streakData,
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    totalCompletedDays: newTotalDays,
    lastCompletedDate: dateStr,
    lastUpdated: new Date().toISOString(),
  };

  saveStoredStreakData(uid, updatedStreakData);

  // Save to history subcollection
  const historyEntry: StreakHistoryEntry = {
    date: dateStr,
    isCompleted: true,
    activeMinutes: evalResult.activeMinutes,
    questsCompleted: evalResult.questsCompleted,
    totalQuests: evalResult.totalQuests,
    xpEarned: 150,
    completedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(`scholar_streak_history_${uid}_${dateStr}`, JSON.stringify(historyEntry));
  } catch (e) {}

  if (uid && uid !== "guest_user") {
    setDoc(
      doc(db, "student_streaks", uid, "history", dateStr),
      cleanFirestoreData(historyEntry),
      { merge: true }
    ).catch(console.warn);
  }

  return {
    newStreakCount: newCurrentStreak,
    xpEarned: 150,
    isFirstTimeToday: true,
  };
}

export function getStreakMilestones(): { milestone: number; reached: boolean }[] {
  const uid = auth.currentUser?.uid || "guest_user";
  const data = getStoredStreakData(uid);
  return STREAK_MILESTONES.map((m) => ({
    milestone: m,
    reached: data.currentStreak >= m || data.longestStreak >= m,
  }));
}
