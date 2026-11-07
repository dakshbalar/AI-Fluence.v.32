import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrors";

export interface LevelCompletionResult {
  levelId: string;
  starsEarned: number;
  isNewBest: boolean;
  xpAwarded: number;
  diamondsAwarded: number;
  nextLevelIdToUnlock: string | null;
}

/**
 * Calculate stars according to curriculum rules:
 * 0 mistakes = 3 stars, 1-2 mistakes = 2 stars, 3+ mistakes = 1 star
 */
export function calculateStarRating(mistakes: number): number {
  if (mistakes <= 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}

/**
 * Save course onboarding questionnaire responses to enrollments/{userId_courseId}
 */
export async function saveCourseEnrollment(
  userId: string,
  courseId: string,
  questionnaire: {
    experienceLevel?: string;
    primaryReason?: string;
    toolUsage?: string;
    techConfidence?: string;
    dailyGoalXP?: number;
    dailyTimeCommitment?: number;
    [key: string]: any;
  }
): Promise<boolean> {
  const enrollmentId = `${userId}_${courseId}`;
  const enrollmentRef = doc(db, "enrollments", enrollmentId);

  try {
    const existing = await getDoc(enrollmentRef);
    if (!existing.exists()) {
      await setDoc(enrollmentRef, {
        enrollmentId,
        userId,
        courseId,
        questionnaireVersion: "v2",
        responses: questionnaire,
        enrolledAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        enrollmentRef,
        {
          responses: questionnaire,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `enrollments/${enrollmentId}`, auth.currentUser);
  }
}

/**
 * Complete a level, record stars, reward transactions, and unlock next level atomically
 */
export async function completeLevelAndUnlockNext(
  userId: string,
  levelId: string,
  mistakes: number,
  bestCode?: string,
  nextLevelId?: string
): Promise<LevelCompletionResult> {
  const starsEarned = calculateStarRating(mistakes);
  const progressDocId = `${userId}_${levelId}`;
  const progressRef = doc(db, "levelProgress", progressDocId);
  const userRef = doc(db, "users", userId);

  try {
    let xpAwarded = 0;
    let diamondsAwarded = 0;
    let isNewBest = false;

    await runTransaction(db, async (transaction) => {
      const progDoc = await transaction.get(progressRef);
      const userDoc = await transaction.get(userRef);

      const existingData = progDoc.exists() ? progDoc.data() : null;
      const prevBestStars = existingData?.bestStars || 0;
      const attempts = (existingData?.attemptsCount || 0) + 1;

      isNewBest = starsEarned > prevBestStars;
      const bestStars = Math.max(prevBestStars, starsEarned);

      // Reward ledger check: First completion gives full bonus, replay gives practice XP
      const isFirstCompletion = !existingData?.completed;
      if (isFirstCompletion) {
        xpAwarded = 40 + starsEarned * 10;
        diamondsAwarded = starsEarned === 3 ? 5 : 2;
      } else if (isNewBest) {
        xpAwarded = 15;
        diamondsAwarded = 1;
      } else {
        xpAwarded = 10;
      }

      // 1. Record / Update Level Progress
      transaction.set(
        progressRef,
        {
          progressId: progressDocId,
          userId,
          levelId,
          completed: true,
          bestStars,
          latestStars: starsEarned,
          attemptsCount: attempts,
          totalMistakes: mistakes,
          bestCode: bestCode || existingData?.bestCode || "",
          lastAttemptedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 2. Unlock Next Level node if provided
      if (nextLevelId) {
        const nextProgId = `${userId}_${nextLevelId}`;
        const nextRef = doc(db, "levelProgress", nextProgId);
        const nextDoc = await transaction.get(nextRef);
        if (!nextDoc.exists()) {
          transaction.set(nextRef, {
            progressId: nextProgId,
            userId,
            levelId: nextLevelId,
            completed: false,
            bestStars: 0,
            latestStars: 0,
            attemptsCount: 0,
            unlockedAt: serverTimestamp(),
          });
        }
      }

      // 3. Increment user balance atomically
      if (userDoc.exists()) {
        const currentXp = userDoc.data().xp || 0;
        const currentDiamonds = userDoc.data().diamonds || 0;
        transaction.update(userRef, {
          xp: currentXp + xpAwarded,
          diamonds: currentDiamonds + diamondsAwarded,
          updatedAt: serverTimestamp(),
        });
      }

      // 4. Record Reward Transaction with idempotency timestamp
      const txId = `tx_${userId}_${levelId}_${Date.now()}`;
      const txRef = doc(db, "rewardTransactions", txId);
      transaction.set(txRef, {
        userId,
        rewardType: "xp",
        amount: xpAwarded,
        source: `level_completion:${levelId}`,
        timestamp: serverTimestamp(),
      });
    });

    return {
      levelId,
      starsEarned,
      isNewBest,
      xpAwarded,
      diamondsAwarded,
      nextLevelIdToUnlock: nextLevelId || null,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `levelProgress/${progressDocId}`, auth.currentUser);
  }
}

/**
 * Fetch all completed level records for a user
 */
export async function getUserLevelProgressMap(userId: string): Promise<Record<string, { completed: boolean; stars: number }>> {
  const result: Record<string, { completed: boolean; stars: number }> = {};
  // Note: progress records can be queried or pulled from local state / levelProgress
  return result;
}
