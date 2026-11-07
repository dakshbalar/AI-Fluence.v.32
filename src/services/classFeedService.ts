import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { cleanFirestoreData, loadStoredStudentProfile } from "../utils/engagementStore";
import { getTodayDateStr } from "./activeLearningTracker";

export interface ClassFeedPost {
  postId: string;
  uid: string;
  studentName: string;
  avatarBg: string;
  classId: string;
  type: "Streak Completion" | "Milestone Victory" | "Badge Unlocked";
  streakCount: number;
  questsCompleted: number;
  learningMinutes: number;
  xpEarned: number;
  createdAt: string;
  likesCount: number;
  likesMap: Record<string, boolean>; // uid -> true
  reactions: Record<string, number>; // "🔥" -> count, "👏" -> count, "🚀" -> count, "💡" -> count
}

export interface ClassmateStreakInfo {
  uid: string;
  studentName: string;
  avatarBg: string;
  currentStreak: number;
  todayQuestsCompleted: number;
  todayActiveMinutes: number;
  isTodayCompleted: boolean;
  xpEarnedToday: number;
}

export interface ClassStreakBoardStats {
  classId: string;
  className: string;
  totalStudents: number;
  todayCompletedCount: number;
  todayInProgressCount: number;
  completionPercentage: number;
  todayTotalClassXp: number;
  topStreaks: ClassmateStreakInfo[];
  recentCompletions: ClassmateStreakInfo[];
}

const DEFAULT_CLASS_ID = "ai_pioneers_bootcamp_class_1";

const DEMO_CLASSMATES: ClassmateStreakInfo[] = [
  {
    uid: "classmate_1",
    studentName: "Daksh Balar",
    avatarBg: "#0284c7",
    currentStreak: 12,
    todayQuestsCompleted: 5,
    todayActiveMinutes: 30,
    isTodayCompleted: true,
    xpEarnedToday: 150,
  },
  {
    uid: "classmate_2",
    studentName: "CyberScholar",
    avatarBg: "#4f46e5",
    currentStreak: 15,
    todayQuestsCompleted: 5,
    todayActiveMinutes: 32,
    isTodayCompleted: true,
    xpEarnedToday: 160,
  },
  {
    uid: "classmate_3",
    studentName: "PromptMaster",
    avatarBg: "#059669",
    currentStreak: 9,
    todayQuestsCompleted: 4,
    todayActiveMinutes: 26,
    isTodayCompleted: false,
    xpEarnedToday: 120,
  },
  {
    uid: "classmate_4",
    studentName: "AlgoTitan",
    avatarBg: "#d97706",
    currentStreak: 14,
    todayQuestsCompleted: 5,
    todayActiveMinutes: 30,
    isTodayCompleted: true,
    xpEarnedToday: 150,
  },
  {
    uid: "classmate_5",
    studentName: "NeuralNinja",
    avatarBg: "#9333ea",
    currentStreak: 6,
    todayQuestsCompleted: 3,
    todayActiveMinutes: 18,
    isTodayCompleted: false,
    xpEarnedToday: 90,
  },
];

const INITIAL_DEMO_POSTS: ClassFeedPost[] = [
  {
    postId: "post_demo_1",
    uid: "classmate_2",
    studentName: "CyberScholar",
    avatarBg: "#4f46e5",
    classId: DEFAULT_CLASS_ID,
    type: "Streak Completion",
    streakCount: 15,
    questsCompleted: 5,
    learningMinutes: 32,
    xpEarned: 160,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likesCount: 8,
    likesMap: { classmate_1: true },
    reactions: { "🔥": 6, "👏": 4, "🚀": 3, "💡": 2 },
  },
  {
    postId: "post_demo_2",
    uid: "classmate_4",
    studentName: "AlgoTitan",
    avatarBg: "#d97706",
    classId: DEFAULT_CLASS_ID,
    type: "Streak Completion",
    streakCount: 14,
    questsCompleted: 5,
    learningMinutes: 30,
    xpEarned: 150,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likesCount: 5,
    likesMap: {},
    reactions: { "🔥": 4, "👏": 3, "🚀": 2 },
  },
];

export async function publishStreakVictoryToClassFeed(
  streakCount: number,
  questsCompleted: number,
  learningMinutes: number,
  xpEarned: number
): Promise<ClassFeedPost> {
  const profile = loadStoredStudentProfile();
  const uid = auth.currentUser?.uid || "guest_user";
  const postId = `streak_post_${uid}_${getTodayDateStr()}_${Date.now()}`;

  const newPost: ClassFeedPost = {
    postId,
    uid,
    studentName: profile.username || "Daksh Balar",
    avatarBg: "#0284c7",
    classId: DEFAULT_CLASS_ID,
    type: "Streak Completion",
    streakCount,
    questsCompleted,
    learningMinutes,
    xpEarned,
    createdAt: new Date().toISOString(),
    likesCount: 1,
    likesMap: { [uid]: true },
    reactions: { "🔥": 1, "👏": 1, "🚀": 1 },
  };

  // 1. Save locally
  try {
    const existing = getStoredClassFeedPosts();
    const updated = [newPost, ...existing.filter((p) => p.postId !== postId)];
    localStorage.setItem("scholar_class_feed_posts", JSON.stringify(updated));
  } catch (e) {}

  // 2. Save to Firestore
  if (uid && uid !== "guest_user") {
    setDoc(doc(db, "class_feed", postId), cleanFirestoreData(newPost), { merge: true }).catch(
      console.warn
    );
  }

  return newPost;
}

export function getStoredClassFeedPosts(): ClassFeedPost[] {
  try {
    const raw = localStorage.getItem("scholar_class_feed_posts");
    if (raw) {
      const parsed: ClassFeedPost[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_DEMO_POSTS;
}

export function toggleLikeClassFeedPost(postId: string): ClassFeedPost[] {
  const uid = auth.currentUser?.uid || "guest_user";
  const posts = getStoredClassFeedPosts();

  const updated = posts.map((post) => {
    if (post.postId === postId) {
      const likesMap = { ...(post.likesMap || {}) };
      const isLiked = Boolean(likesMap[uid]);
      if (isLiked) {
        delete likesMap[uid];
      } else {
        likesMap[uid] = true;
      }
      const newCount = Object.keys(likesMap).length;
      const updatedPost = { ...post, likesMap, likesCount: newCount };

      if (uid && uid !== "guest_user") {
        setDoc(doc(db, "class_feed", postId), cleanFirestoreData(updatedPost), { merge: true }).catch(
          console.warn
        );
      }
      return updatedPost;
    }
    return post;
  });

  try {
    localStorage.setItem("scholar_class_feed_posts", JSON.stringify(updated));
  } catch (e) {}

  return updated;
}

export function addReactionToClassFeedPost(postId: string, emoji: string): ClassFeedPost[] {
  const posts = getStoredClassFeedPosts();

  const updated = posts.map((post) => {
    if (post.postId === postId) {
      const reactions = { ...(post.reactions || {}) };
      reactions[emoji] = (reactions[emoji] || 0) + 1;
      const updatedPost = { ...post, reactions };

      if (auth.currentUser?.uid) {
        setDoc(doc(db, "class_feed", postId), cleanFirestoreData(updatedPost), { merge: true }).catch(
          console.warn
        );
      }
      return updatedPost;
    }
    return post;
  });

  try {
    localStorage.setItem("scholar_class_feed_posts", JSON.stringify(updated));
  } catch (e) {}

  return updated;
}

export function getClassStreakBoardStats(): ClassStreakBoardStats {
  const completed = DEMO_CLASSMATES.filter((c) => c.isTodayCompleted);
  const inProgress = DEMO_CLASSMATES.filter((c) => !c.isTodayCompleted);
  const total = DEMO_CLASSMATES.length;
  const percentage = Math.round((completed.length / Math.max(1, total)) * 100);

  const topStreaks = [...DEMO_CLASSMATES].sort((a, b) => b.currentStreak - a.currentStreak).slice(0, 3);
  const totalXp = DEMO_CLASSMATES.reduce((acc, curr) => acc + curr.xpEarnedToday, 0);

  return {
    classId: DEFAULT_CLASS_ID,
    className: "AI Pioneers Spring 2026 Bootcamp",
    totalStudents: total,
    todayCompletedCount: completed.length,
    todayInProgressCount: inProgress.length,
    completionPercentage: percentage,
    todayTotalClassXp: totalXp,
    topStreaks,
    recentCompletions: completed,
  };
}
