import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { getOrGenerateUniqueUserCode } from "../services/userCodeService";
import { completeLevelAndUnlockNext, saveCourseEnrollment } from "../services/progressionService";
import { getOrCreateUserCode } from "./userCodeGenerator";

export interface FriendItem {
  userCode: string;
  name: string;
  trophies: number;
  avatarBg: string;
  online: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: "chest" | "shield" | "stone" | "elixir" | "skin";
  count: number;
  icon: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

export interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  unlockedAt: string;
  category: "monthly" | "streak" | "accuracy" | "mastery";
}

export interface LevelPlayHistoryItem {
  id: string;
  courseId: string;
  courseName: string;
  sectionNumber: number;
  sectionTitle: string;
  levelNumber: number;
  levelTitle: string;
  levelId: string | number;
  stars: number; // 0, 1, 2, 3
  xpGained: number;
  trophiesGained: number;
  diamondsGained: number;
  timestamp: string;
  playedAt: number;
}

export interface CourseEnrollmentSurvey {
  courseId: string;
  enrolledAt: string;
  experienceLevel: string;
  learningGoal: string;
  dailyPace: string;
}

export interface GamificationState {
  xp: number;
  diamonds: number;
  plays: number;
  maxPlays: number;
  currentStreak: number;
  longestStreak: number;
  trophies: number;
  userCode: string;
  clan?: {
    clanId: string;
    clanName: string;
    clanTag: string;
    role: string;
    shieldColor: string;
  };
  friends: FriendItem[];
  inventory: InventoryItem[];
  badges: BadgeItem[];
  enrolledCourses: Record<string, CourseEnrollmentSurvey>;
  lastActivityDate: string; // YYYY-MM-DD
  dailyXP: number;
  dailyGoal: number; // default 50
  dailyGoalClaimed: boolean;
  completedLevels: Record<string, boolean>; // map of levelId -> true
  levelStars: Record<string, [boolean, boolean, boolean]>;
  levelHistory: LevelPlayHistoryItem[];
  achievements: string[];
  activityDates: Record<string, boolean>; // YYYY-MM-DD -> true
  claimedRewards: Record<string, boolean>; // YYYY-MM-DD -> true
  activityHistory: Record<string, number>; // YYYY-MM-DD -> XP earned
}

const STORAGE_KEY = "pq_gamification_state_v9_clean_zero_start";

export function calculateStars(mistakes: number): [boolean, boolean, boolean] {
  if (mistakes <= 0) return [true, true, true]; // 0 mistakes = 3 stars
  if (mistakes === 1) return [true, true, false]; // 1 mistake = 2 stars
  return [true, false, false]; // 2+ mistakes = 1 star
}

export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const DEFAULT_FRIENDS: FriendItem[] = [];

const DEFAULT_INVENTORY: InventoryItem[] = [];

const DEFAULT_BADGES: BadgeItem[] = [];

const DEFAULT_STATE: GamificationState = {
  xp: 0,
  diamonds: 0,
  plays: 0,
  maxPlays: 5,
  currentStreak: 0,
  longestStreak: 0,
  trophies: 0,
  userCode: getOrCreateUserCode(),
  clan: undefined,
  friends: [],
  inventory: [],
  badges: [],
  enrolledCourses: {},
  lastActivityDate: getTodayStr(),
  dailyXP: 0,
  dailyGoal: 50,
  dailyGoalClaimed: false,
  completedLevels: {},
  levelStars: {},
  levelHistory: [],
  achievements: [],
  activityDates: {},
  claimedRewards: {},
  activityHistory: {}
};

export function loadGamificationState(): GamificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const userCode = getOrCreateUserCode();

    if (raw) {
      const parsed = JSON.parse(raw);
      const today = getTodayStr();
      const yesterday = getYesterdayStr();
      
      let streak = parsed.currentStreak || 0;
      if (parsed.lastActivityDate && parsed.lastActivityDate !== today && parsed.lastActivityDate !== yesterday) {
        // Missed a day -> reset streak
        streak = 0;
      }

      return {
        ...DEFAULT_STATE,
        ...parsed,
        userCode: parsed.userCode || userCode,
        friends: Array.isArray(parsed.friends) ? parsed.friends : [],
        inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
        badges: Array.isArray(parsed.badges) ? parsed.badges : [],
        enrolledCourses: parsed.enrolledCourses || {},
        clan: parsed.clan,
        xp: parsed.xp ?? 0,
        diamonds: parsed.diamonds ?? 0,
        trophies: parsed.trophies ?? 0,
        levelHistory: Array.isArray(parsed.levelHistory) ? parsed.levelHistory : [],
        currentStreak: streak,
        dailyXP: parsed.lastActivityDate === today ? (parsed.dailyXP || 0) : 0,
        dailyGoalClaimed: parsed.lastActivityDate === today ? (parsed.dailyGoalClaimed || false) : false,
      };
    }
  } catch (e) {
    console.error("Error loading local gamification state", e);
  }
  return { ...DEFAULT_STATE };
}

export function saveGamificationState(state: GamificationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem("pq_xp", state.xp.toString());
    setTimeout(() => {
      window.dispatchEvent(new Event("pq_gamification_updated"));
    }, 0);
  } catch (e) {
    console.error("Error saving local gamification state", e);
  }
}

// Sync helper to write update to Firebase Firestore if logged in
async function syncToFirebase(updatedFields: Partial<GamificationState>) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const docRef = doc(db, "users", user.uid);
    
    // Map fields cleanly for Firestore
    const payload: Record<string, any> = {
      updatedAt: serverTimestamp()
    };

    if (updatedFields.xp !== undefined) payload.xp = updatedFields.xp;
    if (updatedFields.diamonds !== undefined) {
      payload.diamonds = updatedFields.diamonds;
      payload.credits = updatedFields.diamonds;
    }
    if (updatedFields.trophies !== undefined) payload.trophies = updatedFields.trophies;
    if (updatedFields.userCode !== undefined) payload.userCode = updatedFields.userCode;
    if (updatedFields.clan !== undefined) payload.clan = updatedFields.clan;
    if (updatedFields.friends !== undefined) payload.friends = updatedFields.friends;
    if (updatedFields.inventory !== undefined) payload.inventory = updatedFields.inventory;
    if (updatedFields.badges !== undefined) payload.badges = updatedFields.badges;
    if (updatedFields.enrolledCourses !== undefined) payload.enrolledCourses = updatedFields.enrolledCourses;
    if (updatedFields.levelHistory !== undefined) payload.levelHistory = updatedFields.levelHistory.slice(0, 30);
    if (updatedFields.plays !== undefined) payload.plays = updatedFields.plays;
    if (updatedFields.maxPlays !== undefined) payload.maxPlays = updatedFields.maxPlays;
    if (updatedFields.currentStreak !== undefined) payload.streak = updatedFields.currentStreak;
    if (updatedFields.longestStreak !== undefined) payload.longestStreak = updatedFields.longestStreak;
    if (updatedFields.lastActivityDate !== undefined) payload.lastActivityDate = updatedFields.lastActivityDate;
    if (updatedFields.activityDates !== undefined) payload.activityDates = updatedFields.activityDates;
    if (updatedFields.completedLevels !== undefined) payload.completedLevels = updatedFields.completedLevels;
    if (updatedFields.levelStars !== undefined) payload.levelStars = updatedFields.levelStars;
    if (updatedFields.claimedRewards !== undefined) payload.claimedRewards = updatedFields.claimedRewards;
    if (updatedFields.achievements !== undefined) payload.achievements = updatedFields.achievements;
    if (updatedFields.activityHistory !== undefined) payload.activityHistory = updatedFields.activityHistory;

    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.warn("Firebase sync background warning:", err);
  }
}

export function useGamification() {
  const [state, setState] = useState<GamificationState>(loadGamificationState);

  // Subscribe to Firebase user doc in real time
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const authUnsub = auth.onAuthStateChanged((user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        unsubscribe = onSnapshot(
          docRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              const today = getTodayStr();
              const yesterday = getYesterdayStr();

              const fbXp = typeof data.xp === "number" ? data.xp : 0;
              const fbDiamonds = typeof data.diamonds === "number" ? data.diamonds : (typeof data.credits === "number" ? data.credits : 150);
              const fbPlays = typeof data.plays === "number" ? data.plays : 5;
              const fbMaxPlays = typeof data.maxPlays === "number" ? data.maxPlays : 5;
              let fbStreak = typeof data.streak === "number" ? data.streak : 0;
              const fbLongest = typeof data.longestStreak === "number" ? data.longestStreak : fbStreak;
              const lastDate = data.lastActivityDate || "";

              // Check streak continuity
              if (lastDate && lastDate !== today && lastDate !== yesterday) {
                fbStreak = 0;
              }

              // Normalizing completedLevels map
              let completedLevelsMap: Record<string, boolean> = {};
              if (Array.isArray(data.completedLevels)) {
                data.completedLevels.forEach((id: string) => { completedLevelsMap[id] = true; });
              } else if (data.completedLevels && typeof data.completedLevels === "object") {
                completedLevelsMap = data.completedLevels;
              }

              const newState: GamificationState = {
                xp: fbXp,
                diamonds: fbDiamonds,
                plays: fbPlays,
                maxPlays: fbMaxPlays,
                currentStreak: fbStreak,
                longestStreak: fbLongest,
                trophies: typeof data.trophies === "number" ? data.trophies : 0,
                userCode: data.userCode || getOrCreateUserCode(),
                clan: data.clan || DEFAULT_STATE.clan,
                friends: Array.isArray(data.friends) && data.friends.length > 0 ? data.friends : DEFAULT_FRIENDS,
                inventory: Array.isArray(data.inventory) && data.inventory.length > 0 ? data.inventory : DEFAULT_INVENTORY,
                badges: Array.isArray(data.badges) && data.badges.length > 0 ? data.badges : DEFAULT_BADGES,
                enrolledCourses: data.enrolledCourses || DEFAULT_STATE.enrolledCourses,
                lastActivityDate: lastDate || today,
                dailyXP: lastDate === today ? (data.dailyXP || 0) : 0,
                dailyGoal: data.dailyGoal || 50,
                dailyGoalClaimed: lastDate === today ? (data.dailyGoalClaimed || false) : false,
                completedLevels: completedLevelsMap,
                levelStars: data.levelStars || {},
                levelHistory: Array.isArray(data.levelHistory) ? data.levelHistory : [],
                achievements: data.achievements || ["first_level"],
                activityDates: data.activityDates || { [today]: true },
                claimedRewards: data.claimedRewards || {},
                activityHistory: data.activityHistory || {}
              };

              setState(newState);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
                localStorage.setItem("pq_xp", newState.xp.toString());
              } catch (e) {}
            }
          },
          (err) => {
            console.warn("Firestore snapshot error:", err);
          }
        );
      } else {
        setState(loadGamificationState());
      }
    });

    const handleUpdate = () => {
      if (!auth.currentUser) {
        setState(loadGamificationState());
      }
    };

    window.addEventListener("pq_gamification_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      authUnsub();
      if (unsubscribe) unsubscribe();
      window.removeEventListener("pq_gamification_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateState = (updater: (prev: GamificationState) => GamificationState) => {
    setState((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        localStorage.setItem("pq_xp", next.xp.toString());
      } catch (e) {}
      setTimeout(() => {
        window.dispatchEvent(new Event("pq_gamification_updated"));
        syncToFirebase(next);
      }, 0);
      return next;
    });
  };

  // Add XP central function
  const addXp = (amount: number, reason: string = "activity") => {
    const today = getTodayStr();
    const yesterday = getYesterdayStr();

    updateState((prev) => {
      const newXp = prev.xp + amount;
      const newDailyXp = prev.dailyXP + amount;
      const todayHistory = (prev.activityHistory[today] || 0) + amount;

      let newStreak = prev.currentStreak;
      if (prev.lastActivityDate !== today) {
        if (prev.lastActivityDate === yesterday) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      const newLongestStreak = Math.max(newStreak, prev.longestStreak);
      const newActivityDates = { ...prev.activityDates, [today]: true };

      // Achievements
      const newAchievements = [...prev.achievements];
      if (newXp >= 1000 && !newAchievements.includes("xp_1000")) newAchievements.push("xp_1000");
      if (newXp >= 5000 && !newAchievements.includes("xp_5000")) newAchievements.push("xp_5000");
      if (newStreak >= 7 && !newAchievements.includes("week_warrior")) newAchievements.push("week_warrior");

      return {
        ...prev,
        xp: newXp,
        dailyXP: newDailyXp,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
        achievements: newAchievements,
        activityDates: newActivityDates,
        activityHistory: {
          ...prev.activityHistory,
          [today]: todayHistory
        }
      };
    });
  };

  // Add Diamonds
  const addDiamonds = (amount: number) => {
    updateState((prev) => {
      const newDiamonds = prev.diamonds + amount;
      const newAchievements = [...prev.achievements];
      if (newDiamonds >= 100 && !newAchievements.includes("diamond_100")) {
        newAchievements.push("diamond_100");
      }
      return {
        ...prev,
        diamonds: newDiamonds,
        achievements: newAchievements
      };
    });
  };

  // Consume 1 Play (returns true if successful, false if 0 plays)
  const consumePlay = (): boolean => {
    if (state.plays <= 0) return false;

    updateState((prev) => {
      if (prev.plays <= 0) return prev;
      return {
        ...prev,
        plays: Math.max(0, prev.plays - 1)
      };
    });
    return true;
  };

  // Refill Plays using Diamonds (default 20 diamonds)
  const refillPlays = (costDiamonds: number = 20): boolean => {
    if (state.diamonds < costDiamonds && costDiamonds > 0) return false;

    updateState((prev) => {
      if (prev.diamonds < costDiamonds && costDiamonds > 0) return prev;
      return {
        ...prev,
        diamonds: Math.max(0, prev.diamonds - costDiamonds),
        plays: prev.maxPlays || 5
      };
    });
    return true;
  };

  // Complete level with atomic check:
  // ONLY award completion Diamonds if level was NOT previously completed!
  const completeLevelState = (
    levelId: string,
    stars: [boolean, boolean, boolean] | number,
    xpReward: number = 50,
    nextLevelId?: string,
    historyInfo?: {
      courseId?: string;
      courseName?: string;
      sectionNumber?: number;
      sectionTitle?: string;
      levelNumber?: number;
      levelTitle?: string;
      trophiesGained?: number;
      diamondsGained?: number;
    }
  ) => {
    const today = getTodayStr();
    const yesterday = getYesterdayStr();

    const normalizedStars: [boolean, boolean, boolean] = Array.isArray(stars)
      ? stars
      : stars >= 3
      ? [true, true, true]
      : stars === 2
      ? [true, true, false]
      : stars === 1
      ? [true, false, false]
      : [false, false, false];

    const starCount = normalizedStars.filter(Boolean).length;

    // Compute target keys for consistent lookup scoped to this specific level
    const targetKeys: string[] = [levelId];
    const numId = parseInt(levelId, 10);
    if (!isNaN(numId)) {
      if (numId >= 700 && numId < 800) {
        targetKeys.push(`generative_ai_s1_l${numId - 700}`);
        targetKeys.push(String(numId));
      } else if (numId >= 800 && numId < 900) {
        targetKeys.push(`generative_ai_s2_l${numId - 800}`);
        targetKeys.push(String(numId));
      } else if (numId >= 900 && numId < 1000) {
        targetKeys.push(`generative_ai_s3_l${numId - 900}`);
        targetKeys.push(String(numId));
      }
    }

    if (historyInfo?.courseId && historyInfo?.sectionNumber && historyInfo?.levelNumber) {
      targetKeys.push(`${historyInfo.courseId}_s${historyInfo.sectionNumber}_l${historyInfo.levelNumber}`);
      targetKeys.push(`${historyInfo.courseId}_s${historyInfo.sectionNumber}_l${levelId}`);
    }

    if (auth.currentUser) {
      const mistakes = normalizedStars.every(Boolean) ? 0 : (normalizedStars[1] ? 1 : 3);
      completeLevelAndUnlockNext(auth.currentUser.uid, levelId, mistakes, undefined, nextLevelId).catch((err) => {
        console.warn("Error completing level in Firestore:", err);
      });
    }

    updateState((prev) => {
      const isNewCompletion = !targetKeys.some(k => prev.completedLevels[k]);
      
      const newCompletedLevels = {
        ...prev.completedLevels,
      };
      const newStarsMap = {
        ...prev.levelStars,
      };

      for (const k of targetKeys) {
        newCompletedLevels[k] = true;
        // Keep highest star rating if previously completed with higher
        const existingStars = prev.levelStars[k];
        let existingCount = 0;
        if (existingStars) {
          existingCount = Array.isArray(existingStars)
            ? existingStars.filter(Boolean).length
            : typeof existingStars === "number"
            ? existingStars
            : 0;
        }
        if (starCount >= existingCount || !existingStars) {
          newStarsMap[k] = normalizedStars;
        }
      }

      // Rules:
      // If NEW completion: award full XP + 10 Diamonds
      // If ALREADY completed: award 0 completion Diamonds and half practice XP
      const earnedXp = isNewCompletion ? xpReward : Math.round(xpReward / 2);
      const earnedDiamonds = historyInfo?.diamondsGained !== undefined ? historyInfo.diamondsGained : (isNewCompletion ? 10 : 0);
      const earnedTrophies = historyInfo?.trophiesGained !== undefined ? historyInfo.trophiesGained : (starCount >= 2 ? 25 : 10);

      const newXp = prev.xp + earnedXp;
      const newDiamonds = prev.diamonds + earnedDiamonds;
      const newTrophies = prev.trophies + earnedTrophies;
      const newDailyXp = prev.dailyXP + earnedXp;

      let newStreak = prev.currentStreak;
      if (prev.lastActivityDate !== today) {
        if (prev.lastActivityDate === yesterday) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }
      const newLongestStreak = Math.max(newStreak, prev.longestStreak);

      // Construct history item
      const courseId = historyInfo?.courseId || (numId >= 700 ? "generative_ai" : "dsa");
      const courseName = historyInfo?.courseName || (courseId === "generative_ai" ? "Generative AI" : "Data Structures & Algorithms");
      const sectionNum = historyInfo?.sectionNumber || (numId >= 900 ? 3 : numId >= 800 ? 2 : numId >= 700 ? 1 : 1);
      const sectionTitle = historyInfo?.sectionTitle || `Section ${sectionNum}`;
      const levelNum = historyInfo?.levelNumber || (numId >= 700 ? (numId % 100) : (numId || 1));
      const levelTitle = historyInfo?.levelTitle || `Level ${levelNum}`;

      const newHistoryItem: LevelPlayHistoryItem = {
        id: `play_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        courseId,
        courseName,
        sectionNumber: sectionNum,
        sectionTitle,
        levelNumber: levelNum,
        levelTitle,
        levelId,
        stars: starCount,
        xpGained: earnedXp,
        trophiesGained: earnedTrophies,
        diamondsGained: earnedDiamonds,
        timestamp: new Date().toISOString(),
        playedAt: Date.now(),
      };

      const updatedHistory = [newHistoryItem, ...(prev.levelHistory || [])].slice(0, 50);

      // Achievements
      const newAchievements = [...prev.achievements];
      if (isNewCompletion && !newAchievements.includes("first_level")) newAchievements.push("first_level");
      if (Object.keys(newCompletedLevels).length >= 5 && !newAchievements.includes("speed_learner")) newAchievements.push("speed_learner");
      if (normalizedStars.every(Boolean) && !newAchievements.includes("perfect_run")) newAchievements.push("perfect_run");

      return {
        ...prev,
        xp: newXp,
        diamonds: newDiamonds,
        trophies: newTrophies,
        dailyXP: newDailyXp,
        completedLevels: newCompletedLevels,
        levelStars: newStarsMap,
        levelHistory: updatedHistory,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
        achievements: newAchievements,
        activityDates: {
          ...prev.activityDates,
          [today]: true
        },
        activityHistory: {
          ...prev.activityHistory,
          [today]: (prev.activityHistory[today] || 0) + earnedXp
        }
      };
    });
  };

  // Manual history recorder helper
  const recordLevelPlayHistory = (item: Omit<LevelPlayHistoryItem, "id" | "playedAt" | "timestamp">) => {
    updateState((prev) => {
      const newHistoryItem: LevelPlayHistoryItem = {
        ...item,
        id: `play_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        playedAt: Date.now(),
      };
      return {
        ...prev,
        levelHistory: [newHistoryItem, ...(prev.levelHistory || [])].slice(0, 50)
      };
    });
  };

  // Clear level history
  const clearLevelPlayHistory = () => {
    updateState((prev) => ({
      ...prev,
      levelHistory: []
    }));
  };

  // Claim Daily Goal Reward
  const claimDailyGoalReward = () => {
    updateState((prev) => {
      if (prev.dailyGoalClaimed) return prev;
      return {
        ...prev,
        dailyGoalClaimed: true,
        xp: prev.xp + 50,
        diamonds: prev.diamonds + 10
      };
    });
  };

  // Claim Daily Streak Reward
  const claimDailyStreakReward = (dateStr: string = getTodayStr()): boolean => {
    if (state.claimedRewards[dateStr]) return false; // Already claimed

    updateState((prev) => {
      if (prev.claimedRewards[dateStr]) return prev;
      return {
        ...prev,
        claimedRewards: {
          ...prev.claimedRewards,
          [dateStr]: true
        },
        xp: prev.xp + 50,
        diamonds: prev.diamonds + 15
      };
    });
    return true;
  };

  // Add Trophies
  const addTrophies = (amount: number) => {
    updateState((prev) => ({
      ...prev,
      trophies: Math.max(0, prev.trophies + amount)
    }));
  };

  // Add Friend with friend code
  const addFriend = (code: string, name?: string) => {
    if (!code) return;
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) return;
    updateState((prev) => {
      const exists = prev.friends.some((f) => f.userCode.replace(/[^A-Z0-9]/g, "") === cleanCode.replace(/[^A-Z0-9]/g, ""));
      if (exists) return prev;

      const randomColors = ["#4f46e5", "#059669", "#dc2626", "#d97706", "#9333ea", "#0284c7"];
      const newFriend: FriendItem = {
        userCode: cleanCode.startsWith("#") ? cleanCode : `#${cleanCode}`,
        name: name || `Hacker_${cleanCode.replace(/[^A-Z0-9]/g, "").slice(-4) || "Coder"}`,
        trophies: Math.floor(Math.random() * 500) + 2200,
        avatarBg: randomColors[Math.floor(Math.random() * randomColors.length)],
        online: Math.random() > 0.4
      };

      return {
        ...prev,
        friends: [newFriend, ...prev.friends]
      };
    });
  };

  // Enroll Course with Experience & Goals Survey
  const enrollCourse = (courseId: string, survey: Omit<CourseEnrollmentSurvey, "courseId" | "enrolledAt">) => {
    if (auth.currentUser) {
      saveCourseEnrollment(auth.currentUser.uid, courseId, survey).catch((err) => {
        console.warn("Error saving course enrollment in Firestore:", err);
      });
    }

    updateState((prev) => ({
      ...prev,
      enrolledCourses: {
        ...prev.enrolledCourses,
        [courseId]: {
          courseId,
          enrolledAt: new Date().toISOString(),
          ...survey
        }
      }
    }));
  };

  // Add Item to Inventory
  const addInventoryItem = (item: InventoryItem) => {
    updateState((prev) => {
      const existingIdx = prev.inventory.findIndex((i) => i.id === item.id);
      if (existingIdx >= 0) {
        const updated = [...prev.inventory];
        updated[existingIdx] = {
          ...updated[existingIdx],
          count: updated[existingIdx].count + (item.count || 1)
        };
        return { ...prev, inventory: updated };
      }
      return { ...prev, inventory: [...prev.inventory, item] };
    });
  };

  // Unlock Badge
  const unlockBadge = (badge: BadgeItem) => {
    updateState((prev) => {
      if (prev.badges.some((b) => b.id === badge.id)) return prev;
      return { ...prev, badges: [badge, ...prev.badges] };
    });
  };

  return {
    state,
    addXp,
    addDiamonds,
    addTrophies,
    addFriend,
    enrollCourse,
    addInventoryItem,
    unlockBadge,
    consumePlay,
    refillPlays,
    completeLevelState,
    recordLevelPlayHistory,
    clearLevelPlayHistory,
    claimDailyGoalReward,
    claimDailyStreakReward
  };
}
