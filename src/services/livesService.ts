import { doc, getDoc, setDoc, runTransaction } from "firebase/firestore";
import { db, auth } from "../firebase";
import { loadStoredStudentProfile } from "../utils/engagementStore";
import { handleFirestoreError, OperationType } from "./dailyQuestService";

export const MAX_LIVES = 5;
export const REGEN_INTERVAL_SECONDS = 1800; // 30 minutes per life

export interface UserLivesDoc {
  userId: string;
  currentLives: number;
  maxLives: number;
  regenerationInterval: number;
  lastLifeConsumedAt: string | null;
  nextLifeAt: string | null;
  lastUpdatedAt: string;
}

export interface UserLivesState {
  currentLives: number;
  maxLives: number;
  isFull: boolean;
  secondsUntilNextLife: number;
  formattedCountdown: string;
  lastLifeConsumedAt: string | null;
}

export interface LifeTransactionRecord {
  id?: string;
  userId: string;
  type: 'consume' | 'regeneration' | 'ad_reward' | 'admin_adjustment';
  amount: number;
  reason: string;
  levelId?: string;
  timestamp: string;
}

export interface AdRewardRecord {
  id?: string;
  userId: string;
  rewardType: 'life';
  amount: number;
  status: 'verified' | 'failed' | 'cancelled';
  adNetwork: string;
  timestamp: string;
}

export interface LevelEntryRecord {
  id?: string;
  userId: string;
  levelId: string;
  lifeConsumed: number;
  entryStatus: 'launched' | 'failed' | 'refused';
  timestamp: string;
}

/**
 * Calculate offline & server-timestamp derived lives regeneration state
 */
export function calculateRegeneratedLives(data: Partial<UserLivesDoc>): UserLivesState {
  const currentLives = data.currentLives ?? MAX_LIVES;
  const maxLives = data.maxLives ?? MAX_LIVES;

  if (currentLives >= maxLives) {
    return {
      currentLives: maxLives,
      maxLives,
      isFull: true,
      secondsUntilNextLife: 0,
      formattedCountdown: "FULL ENERGY",
      lastLifeConsumedAt: data.lastLifeConsumedAt ?? null,
    };
  }

  const lastConsumedTime = data.lastLifeConsumedAt ? new Date(data.lastLifeConsumedAt).getTime() : Date.now();
  const now = Date.now();
  const elapsedSecs = Math.max(0, Math.floor((now - lastConsumedTime) / 1000));
  const livesGained = Math.floor(elapsedSecs / REGEN_INTERVAL_SECONDS);

  const calculatedLives = Math.min(maxLives, currentLives + livesGained);

  if (calculatedLives >= maxLives) {
    return {
      currentLives: maxLives,
      maxLives,
      isFull: true,
      secondsUntilNextLife: 0,
      formattedCountdown: "FULL ENERGY",
      lastLifeConsumedAt: null,
    };
  }

  const remainderSecs = elapsedSecs % REGEN_INTERVAL_SECONDS;
  const secondsUntilNextLife = REGEN_INTERVAL_SECONDS - remainderSecs;

  const mins = Math.floor(secondsUntilNextLife / 60);
  const secs = secondsUntilNextLife % 60;
  const formattedCountdown = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return {
    currentLives: calculatedLives,
    maxLives,
    isFull: false,
    secondsUntilNextLife,
    formattedCountdown,
    lastLifeConsumedAt: data.lastLifeConsumedAt ?? null,
  };
}

/**
 * Fetch or initialize student lives document in Firestore
 */
export async function fetchOrCreateUserLives(userId: string): Promise<UserLivesState> {
  const targetUid = userId || auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
  const docRef = doc(db, "user_lives", targetUid);
  const path = `user_lives/${targetUid}`;

  try {
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const rawData = snap.data() as UserLivesDoc;
      const state = calculateRegeneratedLives(rawData);

      // If lives were gained via offline passive regeneration, sync back to Firestore
      if (state.currentLives > rawData.currentLives) {
        await setDoc(
          docRef,
          {
            currentLives: state.currentLives,
            lastLifeConsumedAt: state.isFull
              ? null
              : new Date(Date.now() - (REGEN_INTERVAL_SECONDS - state.secondsUntilNextLife) * 1000).toISOString(),
            lastUpdatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch(() => {});
      }

      return state;
    }

    // Initialize new student lives document with default 5 full lives
    const newDoc: UserLivesDoc = {
      userId: targetUid,
      currentLives: MAX_LIVES,
      maxLives: MAX_LIVES,
      regenerationInterval: REGEN_INTERVAL_SECONDS,
      lastLifeConsumedAt: null,
      nextLifeAt: null,
      lastUpdatedAt: new Date().toISOString(),
    };

    await setDoc(docRef, newDoc, { merge: true });
    return calculateRegeneratedLives(newDoc);
  } catch (error) {
    console.warn("Using offline lives fallback:", error);
    return {
      currentLives: MAX_LIVES,
      maxLives: MAX_LIVES,
      isFull: true,
      secondsUntilNextLife: 0,
      formattedCountdown: "FULL ENERGY",
      lastLifeConsumedAt: null,
    };
  }
}

/**
 * Atomically consume 1 life to authorize level launch
 */
export async function consumeLifeForLevel(
  userId: string,
  levelId: string
): Promise<{ success: boolean; state: UserLivesState; message: string }> {
  const targetUid = userId || auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
  const docRef = doc(db, "user_lives", targetUid);
  const path = `user_lives/${targetUid}`;

  try {
    const result = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(docRef);
      let rawData: UserLivesDoc;

      if (!snap.exists()) {
        rawData = {
          userId: targetUid,
          currentLives: MAX_LIVES,
          maxLives: MAX_LIVES,
          regenerationInterval: REGEN_INTERVAL_SECONDS,
          lastLifeConsumedAt: null,
          nextLifeAt: null,
          lastUpdatedAt: new Date().toISOString(),
        };
      } else {
        rawData = snap.data() as UserLivesDoc;
      }

      // Calculate lives after passive regeneration
      const currentState = calculateRegeneratedLives(rawData);

      if (currentState.currentLives <= 0) {
        throw new Error("INSUFFICIENT_LIVES");
      }

      const newLives = currentState.currentLives - 1;
      const nowIso = new Date().toISOString();
      // If we were previously at max 5 lives, set lastLifeConsumedAt to right now to start 30m regen timer
      const newConsumedAt = currentState.isFull ? nowIso : currentState.lastLifeConsumedAt || nowIso;

      const updatedDoc: Partial<UserLivesDoc> = {
        userId: targetUid,
        currentLives: newLives,
        maxLives: MAX_LIVES,
        regenerationInterval: REGEN_INTERVAL_SECONDS,
        lastLifeConsumedAt: newConsumedAt,
        lastUpdatedAt: nowIso,
      };

      transaction.set(docRef, updatedDoc, { merge: true });

      return {
        newLives,
        lastLifeConsumedAt: newConsumedAt,
      };
    });

    const nowIso = new Date().toISOString();
    const txId = `tx_${targetUid}_${Date.now()}`;
    const entryId = `entry_${targetUid}_${Date.now()}`;

    // Record Life Transaction log
    setDoc(doc(db, "life_transactions", txId), {
      userId: targetUid,
      type: "consume",
      amount: 1,
      reason: "level_entry",
      levelId,
      timestamp: nowIso,
    }).catch(() => {});

    // Record Level Entry log
    setDoc(doc(db, "level_entries", entryId), {
      userId: targetUid,
      levelId,
      lifeConsumed: 1,
      entryStatus: "launched",
      timestamp: nowIso,
    }).catch(() => {});

    const newState = calculateRegeneratedLives({
      currentLives: result.newLives,
      maxLives: MAX_LIVES,
      lastLifeConsumedAt: result.lastLifeConsumedAt,
    });

    return {
      success: true,
      state: newState,
      message: `⚡ Life consumed. Level ${levelId} Authorized! (${newState.currentLives}/5 Lives Left)`,
    };
  } catch (error: any) {
    if (error?.message === "INSUFFICIENT_LIVES") {
      const currentState = await fetchOrCreateUserLives(targetUid);
      return {
        success: false,
        state: currentState,
        message: "❌ Out of Lives! Refill or watch a rewarded ad to get +1 Life.",
      };
    }
    console.warn("Failed transaction, attempting fallback life deduction:", error);
    const currentState = await fetchOrCreateUserLives(targetUid);
    return {
      success: false,
      state: currentState,
      message: "⚠️ Transaction failed. Please check internet connection.",
    };
  }
}

/**
 * Grant +1 Life upon verified rewarded advertisement watching
 */
export async function grantAdRewardLife(
  userId: string,
  adNetwork: string = "admob"
): Promise<{ success: boolean; state: UserLivesState; message: string }> {
  const targetUid = userId || auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
  const docRef = doc(db, "user_lives", targetUid);

  try {
    const currentState = await fetchOrCreateUserLives(targetUid);

    if (currentState.currentLives >= MAX_LIVES) {
      return {
        success: false,
        state: currentState,
        message: "❤️ Energy is already full (5/5 Lives)!",
      };
    }

    const newLives = Math.min(MAX_LIVES, currentState.currentLives + 1);
    const nowIso = new Date().toISOString();

    const isNowFull = newLives >= MAX_LIVES;
    const updatedData: Partial<UserLivesDoc> = {
      userId: targetUid,
      currentLives: newLives,
      maxLives: MAX_LIVES,
      lastLifeConsumedAt: isNowFull ? null : currentState.lastLifeConsumedAt,
      lastUpdatedAt: nowIso,
    };

    await setDoc(docRef, updatedData, { merge: true });

    const rewardId = `ad_${targetUid}_${Date.now()}`;
    const txId = `tx_${targetUid}_${Date.now()}`;

    // Record Ad Reward Log
    setDoc(doc(db, "ad_rewards", rewardId), {
      userId: targetUid,
      rewardType: "life",
      amount: 1,
      status: "verified",
      adNetwork,
      timestamp: nowIso,
    }).catch(() => {});

    // Record Life Transaction Log
    setDoc(doc(db, "life_transactions", txId), {
      userId: targetUid,
      type: "ad_reward",
      amount: 1,
      reason: "rewarded_ad",
      timestamp: nowIso,
    }).catch(() => {});

    const updatedState = calculateRegeneratedLives({
      currentLives: newLives,
      maxLives: MAX_LIVES,
      lastLifeConsumedAt: isNowFull ? null : currentState.lastLifeConsumedAt,
    });

    return {
      success: true,
      state: updatedState,
      message: `🎬 Rewarded Ad Verified! Granted +1 Life (${newLives}/5 Lives)!`,
    };
  } catch (error) {
    console.warn("Failed ad reward grant:", error);
    const fallbackState = await fetchOrCreateUserLives(targetUid);
    return {
      success: false,
      state: fallbackState,
      message: "⚠️ Could not verify ad reward.",
    };
  }
}

/**
 * Grant direct lives from store purchases or items
 */
export async function grantDirectLives(
  userId: string,
  count: number = 1
): Promise<{ success: boolean; state: UserLivesState; message: string }> {
  const targetUid = userId || auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
  const docRef = doc(db, "user_lives", targetUid);

  try {
    const currentState = await fetchOrCreateUserLives(targetUid);
    const newLives = Math.min(MAX_LIVES, currentState.currentLives + count);
    const nowIso = new Date().toISOString();
    const isNowFull = newLives >= MAX_LIVES;

    const updatedData: Partial<UserLivesDoc> = {
      userId: targetUid,
      currentLives: newLives,
      maxLives: MAX_LIVES,
      lastLifeConsumedAt: isNowFull ? null : currentState.lastLifeConsumedAt,
      lastUpdatedAt: nowIso,
    };

    await setDoc(docRef, updatedData, { merge: true });

    const txId = `tx_${targetUid}_${Date.now()}`;
    setDoc(doc(db, "life_transactions", txId), {
      userId: targetUid,
      type: "admin_adjustment",
      amount: count,
      reason: "store_refill",
      timestamp: nowIso,
    }).catch(() => {});

    const updatedState = calculateRegeneratedLives({
      currentLives: newLives,
      maxLives: MAX_LIVES,
      lastLifeConsumedAt: isNowFull ? null : currentState.lastLifeConsumedAt,
    });

    return {
      success: true,
      state: updatedState,
      message: `❤️ Refilled +${count} Life (${newLives}/5 Lives)!`,
    };
  } catch (error) {
    console.warn("Failed direct life grant:", error);
    const fallbackState = await fetchOrCreateUserLives(targetUid);
    return {
      success: false,
      state: fallbackState,
      message: "⚠️ Could not refill life.",
    };
  }
}
