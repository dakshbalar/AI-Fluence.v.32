import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import {
  StudentProfile,
  LearningCommitment,
  DailyActivity,
  StreakRecord,
  EngagementTelemetry,
  DailyMissionStep
} from "../types/engagement";
import { DEFAULT_AVATAR_CONFIG } from "../data/avatarData";
import { getTodayStr, getYesterdayStr } from "./gamificationStore";
import { generatePersonalizedPath, generateAdaptiveDailyMissions } from "./pathGenerator";

const STUDENT_PROFILE_KEY = "aifluence_student_profile_v1";
const LEARNING_COMMITMENT_KEY = "aifluence_learning_commitment_v1";
const DAILY_ACTIVITY_KEY = "aifluence_daily_activity_v1";
const ENGAGEMENT_TELEMETRY_KEY = "aifluence_engagement_telemetry_v1";

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  userId: "guest_user",
  username: "Techno",
  profilePicture: "avatar_cyber_knight",
  avatarConfig: DEFAULT_AVATAR_CONFIG,
  codingExperience: "basics",
  techComfort: "tried_a_few",
  codingBackground: "a_little",
  primaryLanguage: "Python",
  secondaryLanguage: "JavaScript",
  thirdLanguage: "Java",
  learningGoal: "ai_dev",
  aiGoals: ["ai_dev", "building_projects"],
  aiInterests: ["coding", "automation", "content"],
  threeMonthVision: "Build and deploy my first autonomous AI copilot application",
  learningStyle: "combination",
  dailyTimePreference: "30",
  motivationFactors: ["building", "streaks", "xp_levels"],
  primaryFocusGoal: "Become an AI-Powered Developer",
  discoverySource: "college",
  onboardingCompleted: false,
  createdAt: new Date().toISOString()
};

export const DEFAULT_COMMITMENT: LearningCommitment = {
  userId: "guest_user",
  journeyDuration: "30",
  dailyTimeCommitment: "30",
  journeyStartDate: getTodayStr(),
  journeyEndDate: calculateEndDate(getTodayStr(), 30),
  dailyGoalXP: 50
};

export function calculateEndDate(startDateStr: string, days: number): string {
  const d = new Date(startDateStr);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj
      .map((item) => cleanFirestoreData(item))
      .filter((x) => x !== undefined) as unknown as T;
  }
  if (typeof obj === "object" && !(obj instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

export function generateDailyMissions(
  profile: StudentProfile,
  commitment: LearningCommitment
): DailyMissionStep[] {
  return generateAdaptiveDailyMissions(profile, commitment);
}

export function loadStoredStudentProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STUDENT_PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.onboardingCompleted = Boolean(parsed.onboardingCompleted);
      if (!parsed.personalizedPath) {
        parsed.personalizedPath = generatePersonalizedPath(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed loading student profile", e);
  }
  const defaultProf = { ...DEFAULT_STUDENT_PROFILE };
  defaultProf.personalizedPath = generatePersonalizedPath(defaultProf);
  return defaultProf;
}

export function loadStoredCommitment(): LearningCommitment {
  try {
    const raw = localStorage.getItem(LEARNING_COMMITMENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed loading learning commitment", e);
  }
  return DEFAULT_COMMITMENT;
}

export function loadStoredDailyActivity(
  profile: StudentProfile,
  commitment: LearningCommitment
): DailyActivity {
  const today = getTodayStr();
  try {
    const raw = localStorage.getItem(DAILY_ACTIVITY_KEY);
    if (raw) {
      const parsed: DailyActivity = JSON.parse(raw);
      if (parsed.date === today) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed loading daily activity", e);
  }

  // Calculate target XP based on time commitment
  let goalXp = 50;
  if (commitment.dailyTimeCommitment === "10") goalXp = 20;
  else if (commitment.dailyTimeCommitment === "20") goalXp = 35;
  else if (commitment.dailyTimeCommitment === "30") goalXp = 50;
  else if (commitment.dailyTimeCommitment === "45") goalXp = 70;
  else if (commitment.dailyTimeCommitment === "60" || commitment.dailyTimeCommitment === "90+") goalXp = 100;

  return {
    userId: profile.userId,
    date: today,
    loginRewardClaimed: false,
    dailyGoalXP: goalXp,
    earnedXP: 0,
    thinkingXP: 0,
    lessonsCompleted: 0,
    practiceCompleted: 0,
    quickThinkCompleted: 0,
    challengeCompleted: 0,
    goalCompleted: false,
    missions: generateDailyMissions(profile, commitment)
  };
}

export function loadStoredEngagement(): EngagementTelemetry {
  try {
    const raw = localStorage.getItem(ENGAGEMENT_TELEMETRY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed loading engagement telemetry", e);
  }
  return {
    userId: "guest_user",
    lastActivity: new Date().toISOString(),
    sessionsToday: 1,
    activitiesStarted: 0,
    activitiesCompleted: 0,
    activitiesSkipped: 0,
    questionsAttempted: 0,
    questionsCorrect: 0,
    questionsIncorrect: 0,
    adaptiveModeActive: false,
    difficultyLevel: "standard"
  };
}

export function getEngagementState() {
  const profile = loadStoredStudentProfile();
  const commitment = loadStoredCommitment();
  const dailyActivity = loadStoredDailyActivity(profile, commitment);
  const engagement = loadStoredEngagement();

  return {
    profile,
    commitment,
    dailyActivity,
    streakRecord: {
      currentStreak: 1,
      freezeActive: false,
      streakHistory: [getTodayStr()]
    },
    engagementTelemetry: {
      currentFatigueScore: engagement.activitiesSkipped > 1 ? 70 : 15,
      adaptiveModeActive: engagement.adaptiveModeActive
    }
  };
}

export function saveProfile(updated: Partial<StudentProfile>): StudentProfile {
  const current = loadStoredStudentProfile();
  const next: StudentProfile = { 
    ...current, 
    ...updated, 
    onboardingCompleted: updated.onboardingCompleted !== undefined 
      ? updated.onboardingCompleted 
      : (current.onboardingCompleted ?? false)
  };
  if (!next.personalizedPath) {
    next.personalizedPath = generatePersonalizedPath(next);
  }
  localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(next));

  if (auth.currentUser) {
    setDoc(doc(db, "users", auth.currentUser.uid), {
      studentProfile: cleanFirestoreData(next),
      updatedAt: serverTimestamp()
    }, { merge: true }).catch(console.warn);
  }
  return next;
}

export function saveCommitment(updated: Partial<LearningCommitment>): LearningCommitment {
  const current = loadStoredCommitment();
  const next: LearningCommitment = { 
    ...current, 
    ...updated, 
    journeyStartDate: current.journeyStartDate || getTodayStr(),
    journeyEndDate: calculateEndDate(getTodayStr(), parseInt(updated.journeyDuration || "30", 10))
  };
  if (next.journeyDuration !== "custom") {
    delete (next as any).customDurationDays;
  }
  localStorage.setItem(LEARNING_COMMITMENT_KEY, JSON.stringify(next));

  if (auth.currentUser) {
    setDoc(doc(db, "users", auth.currentUser.uid), {
      learningCommitment: cleanFirestoreData(next),
      updatedAt: serverTimestamp()
    }, { merge: true }).catch(console.warn);
  }
  return next;
}

export function recordMissionCompletion(
  stepId: "learn" | "practice" | "think" | "challenge",
  gainedXp: number = 20,
  gainedThinkingXp: number = 0
): { dailyActivity: DailyActivity; goalCompleted: boolean } {
  const profile = loadStoredStudentProfile();
  const commitment = loadStoredCommitment();
  const current = loadStoredDailyActivity(profile, commitment);

  const nextMissions = current.missions.map((m) =>
    m.id === stepId ? { ...m, completed: true } : m
  );

  const nextEarnedXp = current.earnedXP + gainedXp;
  const nextThinkingXp = current.thinkingXP + gainedThinkingXp;
  const allDone = nextMissions.every((m) => m.completed) || nextEarnedXp >= current.dailyGoalXP;

  const next: DailyActivity = {
    ...current,
    earnedXP: nextEarnedXp,
    thinkingXP: nextThinkingXp,
    missions: nextMissions,
    goalCompleted: allDone,
    lessonsCompleted: stepId === "learn" ? current.lessonsCompleted + 1 : current.lessonsCompleted,
    practiceCompleted: stepId === "practice" ? current.practiceCompleted + 1 : current.practiceCompleted,
    quickThinkCompleted: stepId === "think" ? current.quickThinkCompleted + 1 : current.quickThinkCompleted,
    challengeCompleted: stepId === "challenge" ? current.challengeCompleted + 1 : current.challengeCompleted,
  };

  localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(next));

  if (auth.currentUser) {
    setDoc(doc(db, "users", auth.currentUser.uid), {
      dailyActivity: cleanFirestoreData(next),
      updatedAt: serverTimestamp()
    }, { merge: true }).catch(console.warn);
  }

  return { dailyActivity: next, goalCompleted: allDone };
}

export function claimDailyDrop(xp: number = 15, credits: number = 5): { xp: number; credits: number } {
  const profile = loadStoredStudentProfile();
  const commitment = loadStoredCommitment();
  const current = loadStoredDailyActivity(profile, commitment);

  const next: DailyActivity = {
    ...current,
    loginRewardClaimed: true,
    earnedXP: current.earnedXP + xp
  };

  localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(next));

  if (auth.currentUser) {
    setDoc(doc(db, "users", auth.currentUser.uid), {
      dailyActivity: cleanFirestoreData(next),
      lastRewardClaimDate: getTodayStr(),
      updatedAt: serverTimestamp()
    }, { merge: true }).catch(console.warn);
  }

  return { xp, credits };
}

export function checkStreakHealth() {
  const profile = loadStoredStudentProfile();
  const commitment = loadStoredCommitment();
  const current = loadStoredDailyActivity(profile, commitment);
  return {
    streakCount: 1,
    freezeActive: false
  };
}

export function addXPAndThinkingXP(xp: number, thinkingXp: number) {
  const profile = loadStoredStudentProfile();
  const commitment = loadStoredCommitment();
  const current = loadStoredDailyActivity(profile, commitment);

  const next: DailyActivity = {
    ...current,
    earnedXP: current.earnedXP + xp,
    thinkingXP: current.thinkingXP + thinkingXp
  };

  localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(next));
  return next;
}

export function useEngagementStore() {
  const [profile, setProfile] = useState<StudentProfile>(loadStoredStudentProfile);
  const [commitment, setCommitment] = useState<LearningCommitment>(loadStoredCommitment);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity>(() => 
    loadStoredDailyActivity(loadStoredStudentProfile(), loadStoredCommitment())
  );
  const [engagement, setEngagement] = useState<EngagementTelemetry>(loadStoredEngagement);

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(LEARNING_COMMITMENT_KEY, JSON.stringify(commitment));
  }, [commitment]);

  useEffect(() => {
    localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(dailyActivity));
  }, [dailyActivity]);

  useEffect(() => {
    localStorage.setItem(ENGAGEMENT_TELEMETRY_KEY, JSON.stringify(engagement));
  }, [engagement]);

  // Sync from Cloud Firestore if authenticated
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.studentProfile) {
              setProfile((prev) => ({ 
                ...prev, 
                ...data.studentProfile, 
                onboardingCompleted: data.studentProfile.onboardingCompleted !== undefined 
                  ? Boolean(data.studentProfile.onboardingCompleted) 
                  : Boolean(prev.onboardingCompleted), 
                userId: currentUser.uid 
              }));
            } else {
              setProfile({ ...DEFAULT_STUDENT_PROFILE, userId: currentUser.uid, onboardingCompleted: false });
            }
            if (data.learningCommitment) {
              setCommitment((prev) => ({ ...prev, ...data.learningCommitment, userId: currentUser.uid }));
            }
            if (data.dailyActivity && data.dailyActivity.date === getTodayStr()) {
              setDailyActivity(data.dailyActivity);
            }
          } else {
            // Brand new user registration: reset state to onboarding-ready
            setProfile({ ...DEFAULT_STUDENT_PROFILE, userId: currentUser.uid, onboardingCompleted: false });
            setCommitment({ ...DEFAULT_COMMITMENT, userId: currentUser.uid });
          }
        } catch (e) {
          console.warn("Could not sync engagement data from Firestore:", e);
        }
      }
    });

    return () => unsub();
  }, []);

  // Update profile handler
  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(next));

      // Re-generate missions if primary language or goal changed
      if (updated.primaryLanguage || updated.learningGoal) {
        setDailyActivity((prevAct) => ({
          ...prevAct,
          missions: generateDailyMissions(next, commitment)
        }));
      }

      // Background cloud sync
      if (auth.currentUser) {
        setDoc(doc(db, "users", auth.currentUser.uid), {
          studentProfile: cleanFirestoreData(next),
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(console.warn);
      }
      return next;
    });
  };

  // Update commitment handler
  const updateCommitment = (updated: Partial<LearningCommitment>) => {
    setCommitment((prev) => {
      const next = { ...prev, ...updated };
      if (next.journeyDuration !== "custom") {
        delete (next as any).customDurationDays;
      }
      localStorage.setItem(LEARNING_COMMITMENT_KEY, JSON.stringify(next));

      setDailyActivity((prevAct) => {
        const nextMissions = generateDailyMissions(profile, next);
        return {
          ...prevAct,
          missions: nextMissions
        };
      });

      if (auth.currentUser) {
        setDoc(doc(db, "users", auth.currentUser.uid), {
          learningCommitment: cleanFirestoreData(next),
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(console.warn);
      }
      return next;
    });
  };

  // Complete a mission step
  const completeMissionStep = (stepId: "learn" | "practice" | "think" | "challenge", gainedXp: number = 20, gainedThinkingXp: number = 0) => {
    setDailyActivity((prev) => {
      const nextMissions = prev.missions.map((m) => 
        m.id === stepId ? { ...m, completed: true } : m
      );

      const nextEarnedXp = prev.earnedXP + gainedXp;
      const nextThinkingXp = prev.thinkingXP + gainedThinkingXp;
      const allDone = nextMissions.every((m) => m.completed) || nextEarnedXp >= prev.dailyGoalXP;

      const nextState: DailyActivity = {
        ...prev,
        earnedXP: nextEarnedXp,
        thinkingXP: nextThinkingXp,
        missions: nextMissions,
        goalCompleted: allDone,
        lessonsCompleted: stepId === "learn" ? prev.lessonsCompleted + 1 : prev.lessonsCompleted,
        practiceCompleted: stepId === "practice" ? prev.practiceCompleted + 1 : prev.practiceCompleted,
        quickThinkCompleted: stepId === "think" ? prev.quickThinkCompleted + 1 : prev.quickThinkCompleted,
        challengeCompleted: stepId === "challenge" ? prev.challengeCompleted + 1 : prev.challengeCompleted,
      };

      if (auth.currentUser) {
        setDoc(doc(db, "users", auth.currentUser.uid), {
          dailyActivity: cleanFirestoreData(nextState),
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(console.warn);
      }

      return nextState;
    });

    // Record engagement completion
    setEngagement((prev) => ({
      ...prev,
      activitiesCompleted: prev.activitiesCompleted + 1,
      questionsAttempted: prev.questionsAttempted + 1,
      questionsCorrect: prev.questionsCorrect + 1,
      adaptiveModeActive: false // clear fatigue if making progress
    }));
  };

  // Record Daily Drop Claim
  const claimDailyDropReward = (): { xp: number; credits: number } => {
    const today = getTodayStr();
    if (dailyActivity.loginRewardClaimed && dailyActivity.date === today) {
      return { xp: 0, credits: 0 };
    }

    const reward = { xp: 15, credits: 5 };

    setDailyActivity((prev) => {
      const next: DailyActivity = {
        ...prev,
        loginRewardClaimed: true,
        earnedXP: prev.earnedXP + reward.xp
      };

      if (auth.currentUser) {
        setDoc(doc(db, "users", auth.currentUser.uid), {
          dailyActivity: cleanFirestoreData(next),
          lastRewardClaimDate: today,
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(console.warn);
      }

      return next;
    });

    return reward;
  };

  // Adaptive engagement signals detector
  const recordEngagementSignal = (type: "skip" | "error" | "start" | "idle") => {
    setEngagement((prev) => {
      const next = { ...prev, lastActivity: new Date().toISOString() };

      if (type === "start") {
        next.activitiesStarted += 1;
      } else if (type === "skip") {
        next.activitiesSkipped += 1;
        // If multiple skips in a row, trigger adaptive mode
        if (next.activitiesSkipped >= 2) {
          next.adaptiveModeActive = true;
          next.difficultyLevel = "gentle";
        }
      } else if (type === "error") {
        next.questionsIncorrect += 1;
        next.questionsAttempted += 1;
        if (next.questionsIncorrect >= 3) {
          next.adaptiveModeActive = true;
          next.difficultyLevel = "gentle";
        }
      }

      return next;
    });
  };

  const dismissAdaptiveIntervention = () => {
    setEngagement((prev) => ({
      ...prev,
      adaptiveModeActive: false
    }));
  };

  return {
    profile,
    commitment,
    dailyActivity,
    engagement,
    updateProfile,
    updateCommitment,
    completeMissionStep,
    claimDailyDropReward,
    recordEngagementSignal,
    dismissAdaptiveIntervention
  };
}
