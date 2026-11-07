import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { cleanFirestoreData } from "../utils/engagementStore";

export interface DailyActivityData {
  activityId: string;
  uid: string;
  date: string; // YYYY-MM-DD
  activeSeconds: number;
  activeMinutes: number;
  questsCompleted: number;
  sessionsCount: number;
  lastActiveAt: string;
  dailyTargetMinutes: number; // 30
  isTargetReached: boolean;
}

const IDLE_TIMEOUT_MS = 30000; // 30 seconds idle threshold
const HEARTBEAT_INTERVAL_MS = 10000; // 10 seconds heartbeat interval
const TARGET_MINUTES = 30;

export function getTodayDateStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

type ActivityListener = (data: DailyActivityData) => void;

class ActiveLearningTracker {
  private activeSeconds = 0;
  private lastActivityTimestamp = Date.now();
  private isUserActive = true;
  private heartbeatTimer: number | null = null;
  private idleCheckTimer: number | null = null;
  private listeners: Set<ActivityListener> = new Set();
  private currentDateStr = getTodayDateStr();
  private initialized = false;

  constructor() {
    this.loadInitialState();
  }

  public init() {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;

    // Attach user activity event listeners
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((evt) => {
      window.addEventListener(evt, this.onUserInteraction, { passive: true });
    });

    window.addEventListener("visibilitychange", this.onVisibilityChange);
    window.addEventListener("focus", this.onFocus);
    window.addEventListener("blur", this.onBlur);

    // Start heartbeat and idle loops
    this.startHeartbeat();
  }

  private onUserInteraction = () => {
    this.lastActivityTimestamp = Date.now();
    if (!this.isUserActive) {
      this.isUserActive = true;
    }
  };

  private onVisibilityChange = () => {
    if (document.hidden) {
      this.isUserActive = false;
    } else {
      this.lastActivityTimestamp = Date.now();
      this.isUserActive = true;
    }
  };

  private onFocus = () => {
    this.lastActivityTimestamp = Date.now();
    this.isUserActive = true;
  };

  private onBlur = () => {
    this.isUserActive = false;
  };

  private startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);

    this.heartbeatTimer = window.setInterval(() => {
      const now = Date.now();
      const today = getTodayDateStr();

      // Check if day rolled over
      if (today !== this.currentDateStr) {
        this.currentDateStr = today;
        this.activeSeconds = 0;
      }

      // Check idle state
      if (now - this.lastActivityTimestamp > IDLE_TIMEOUT_MS) {
        this.isUserActive = false;
      }

      // If active and visible, add heartbeat duration (10s)
      if (this.isUserActive && !document.hidden) {
        this.activeSeconds += HEARTBEAT_INTERVAL_MS / 1000;
        this.saveCurrentState();
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  public addManualActiveSeconds(seconds: number) {
    this.activeSeconds += seconds;
    this.saveCurrentState();
  }

  public getActiveMinutes(): number {
    return Math.floor(this.activeSeconds / 60);
  }

  public getActiveSeconds(): number {
    return this.activeSeconds;
  }

  public getDailyActivityData(): DailyActivityData {
    const activeMins = this.getActiveMinutes();
    const userId = auth.currentUser?.uid || "guest_user";
    return {
      activityId: `${userId}_${this.currentDateStr}`,
      uid: userId,
      date: this.currentDateStr,
      activeSeconds: this.activeSeconds,
      activeMinutes: activeMins,
      questsCompleted: this.getCompletedQuestsCount(),
      sessionsCount: 1,
      lastActiveAt: new Date().toISOString(),
      dailyTargetMinutes: TARGET_MINUTES,
      isTargetReached: activeMins >= TARGET_MINUTES,
    };
  }

  private getCompletedQuestsCount(): number {
    try {
      const raw = localStorage.getItem(`scholar_completed_quests_${this.currentDateStr}`);
      return raw ? JSON.parse(raw).length : 0;
    } catch {
      return 0;
    }
  }

  private loadInitialState() {
    try {
      const today = getTodayDateStr();
      const localKey = `scholar_active_seconds_${today}`;
      const saved = localStorage.getItem(localKey);
      if (saved) {
        this.activeSeconds = parseInt(saved, 10) || 0;
      }
    } catch (err) {
      console.warn("Error loading active learning state:", err);
    }
  }

  private async saveCurrentState() {
    const today = getTodayDateStr();
    const data = this.getDailyActivityData();

    // 1. Save locally
    try {
      localStorage.setItem(`scholar_active_seconds_${today}`, String(this.activeSeconds));
      localStorage.setItem(`scholar_daily_activity_${today}`, JSON.stringify(data));
    } catch (e) {}

    // 2. Notify in-app subscribers
    this.notifyListeners(data);

    // 3. Sync to Firestore asynchronously if authenticated
    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        const docRef = doc(db, "daily_activity", `${uid}_${today}`);
        await setDoc(docRef, cleanFirestoreData(data), { merge: true });
      } catch (err) {
        // Silently handle firestore errors (network issues/offline)
      }
    }
  }

  public subscribe(listener: ActivityListener): () => void {
    this.listeners.add(listener);
    listener(this.getDailyActivityData());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(data: DailyActivityData) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (e) {
        console.error("Error in activity tracker listener", e);
      }
    });
  }

  public cleanup() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (typeof window !== "undefined") {
      const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
      events.forEach((evt) => window.removeEventListener(evt, this.onUserInteraction));
      window.removeEventListener("visibilitychange", this.onVisibilityChange);
      window.removeEventListener("focus", this.onFocus);
      window.removeEventListener("blur", this.onBlur);
    }
    this.initialized = false;
  }
}

export const activeLearningTracker = new ActiveLearningTracker();
