import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { loadStoredStudentProfile } from "../utils/engagementStore";
import { getTodayStr } from "../utils/gamificationStore";
import { handleFirestoreError, OperationType, updateDailyActivityRecord } from "./dailyQuestService";

const INACTIVITY_TIMEOUT_MS = 60000; // 60 seconds inactivity threshold
const SYNC_INTERVAL_MS = 10000; // Sync to Firestore every 10 seconds

export interface ActiveTimeState {
  activeSeconds: number;
  requiredSeconds: number;
  completed: boolean;
  platform: 'web' | 'mobile';
  formattedTime: string;
}

class ActiveTimeTracker {
  private activeSeconds: number = 0;
  private requiredSeconds: number = 1800; // 30 minutes
  private isTracking: boolean = false;
  private lastActivityTime: number = Date.now();
  private inactivityTimer: NodeJS.Timeout | null = null;
  private syncTimer: NodeJS.Timeout | null = null;
  private currentUserId: string = "";
  private platform: 'web' | 'mobile' = 'web';
  private listenersAttached: boolean = false;
  private onTimeUpdateCallbacks: Array<(state: ActiveTimeState) => void> = [];

  constructor() {
    this.detectPlatform();
  }

  private detectPlatform() {
    const ua = navigator.userAgent || "";
    this.platform = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
      ? 'mobile'
      : 'web';
  }

  public init(userId?: string) {
    const targetUid = userId || auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
    if (this.currentUserId === targetUid && this.isTracking) return;

    this.currentUserId = targetUid;
    this.attachActivityListeners();
    this.loadTodayActivity();
    this.startTracking();
  }

  private attachActivityListeners() {
    if (this.listenersAttached) return;
    this.listenersAttached = true;

    const onUserInteraction = () => {
      this.recordUserInteraction();
    };

    window.addEventListener("mousemove", onUserInteraction, { passive: true });
    window.addEventListener("keydown", onUserInteraction, { passive: true });
    window.addEventListener("touchstart", onUserInteraction, { passive: true });
    window.addEventListener("scroll", onUserInteraction, { passive: true });
    window.addEventListener("click", onUserInteraction, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseTracking("tab_hidden");
      } else {
        this.recordUserInteraction();
        this.startTracking();
      }
    });

    window.addEventListener("blur", () => this.pauseTracking("window_blur"));
    window.addEventListener("focus", () => {
      this.recordUserInteraction();
      this.startTracking();
    });
  }

  private recordUserInteraction() {
    this.lastActivityTime = Date.now();
    if (!this.isTracking && !document.hidden) {
      this.startTracking();
    }
    this.resetInactivityTimer();
  }

  private resetInactivityTimer() {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.pauseTracking("inactivity_timeout");
    }, INACTIVITY_TIMEOUT_MS);
  }

  private notifyCallbacks() {
    const state = this.getState();
    this.onTimeUpdateCallbacks.forEach((cb) => cb(state));
  }

  private startTracking() {
    if (this.isTracking || document.hidden) return;
    this.isTracking = true;
    this.resetInactivityTimer();

    if (!this.syncTimer) {
      this.syncTimer = setInterval(() => {
        if (this.isTracking) {
          this.activeSeconds += 1;
          this.notifyCallbacks();
          
          // Sync every 10 seconds or when milestone reached
          if (this.activeSeconds % 10 === 0) {
            this.syncToFirestore();
          }
        }
      }, 1000);
    }
  }

  private pauseTracking(reason: string) {
    if (!this.isTracking) return;
    this.isTracking = false;
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    this.syncToFirestore();
  }

  private async loadTodayActivity() {
    if (!this.currentUserId) return;
    const today = getTodayStr();
    const docId = `${this.currentUserId}_${today}`;
    const path = `daily_activity/${docId}`;

    try {
      const docRef = doc(db, "daily_activity", docId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        this.activeSeconds = data.activeSeconds ?? (data.activeMinutes ? data.activeMinutes * 60 : 0);
      } else {
        this.activeSeconds = 0;
      }
      this.notifyCallbacks();
    } catch (e) {
      console.warn("Error loading daily activity:", e);
    }
  }

  private async syncToFirestore() {
    if (!this.currentUserId) return;
    const today = getTodayStr();
    const docId = `${this.currentUserId}_${today}`;
    const path = `daily_activity/${docId}`;
    const isCompleted = this.activeSeconds >= this.requiredSeconds;

    try {
      const activeMins = Math.floor(this.activeSeconds / 60);
      await updateDailyActivityRecord(this.currentUserId, {
        activeMinutes: activeMins,
        updatedAt: new Date().toISOString()
      });

      const docRef = doc(db, "daily_activity", docId);
      await setDoc(
        docRef,
        {
          userId: this.currentUserId,
          date: today,
          activeSeconds: this.activeSeconds,
          requiredSeconds: this.requiredSeconds,
          completed: isCompleted,
          platforms: {
            [this.platform]: this.activeSeconds
          },
          lastActiveAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Failed to sync active time:", e);
    }
  }

  public subscribe(callback: (state: ActiveTimeState) => void): () => void {
    this.onTimeUpdateCallbacks.push(callback);
    callback(this.getState());
    return () => {
      this.onTimeUpdateCallbacks = this.onTimeUpdateCallbacks.filter((cb) => cb !== callback);
    };
  }

  public getState(): ActiveTimeState {
    const mins = Math.floor(this.activeSeconds / 60);
    const secs = this.activeSeconds % 60;
    const formattedTime = `${mins}m ${secs}s`;
    return {
      activeSeconds: this.activeSeconds,
      requiredSeconds: this.requiredSeconds,
      completed: this.activeSeconds >= this.requiredSeconds,
      platform: this.platform,
      formattedTime
    };
  }

  public getActiveSeconds(): number {
    return this.activeSeconds;
  }

  public getActiveMinutes(): number {
    return Math.floor(this.activeSeconds / 60);
  }
}

export const activeTimeTracker = new ActiveTimeTracker();
