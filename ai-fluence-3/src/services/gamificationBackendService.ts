import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  runTransaction,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrors";

export interface SystemAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tierMax: number;
  category: "monthly" | "streak" | "accuracy" | "mastery";
}

export const SYSTEM_ACHIEVEMENTS: SystemAchievement[] = [
  {
    id: "first_algorithm",
    title: "First Algorithm",
    description: "Successfully complete your first code challenge level.",
    icon: "⚡",
    tierMax: 1,
    category: "mastery",
  },
  {
    id: "sharpshooter",
    title: "Sharpshooter",
    description: "Complete 10 lesson levels with 100% accuracy (0 mistakes).",
    icon: "🏹",
    tierMax: 10,
    category: "accuracy",
  },
  {
    id: "cyber_scholar",
    title: "Cyber Scholar",
    description: "Complete 10 course units across all academies.",
    icon: "🛡️",
    tierMax: 10,
    category: "mastery",
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Complete 5 midnight lessons between 10 PM and 2 AM.",
    icon: "🦉",
    tierMax: 5,
    category: "streak",
  },
];

/**
 * Unlock or increment achievement progress in Firestore
 */
export async function updateAchievementProgress(
  userId: string,
  achievementId: string,
  progress: number
): Promise<boolean> {
  const docId = `${userId}_${achievementId}`;
  const ref = doc(db, "userAchievements", docId);

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        userId,
        achievementId,
        progress,
        unlockedAt: serverTimestamp(),
      });
    } else {
      const current = snap.data().progress || 0;
      await updateDoc(ref, {
        progress: Math.max(current, progress),
        updatedAt: serverTimestamp(),
      });
    }
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `userAchievements/${docId}`, auth.currentUser);
  }
}

/**
 * Buy an inventory item with diamonds and persist to userInventory & users
 */
export async function buyInventoryItem(
  userId: string,
  itemId: string,
  priceInDiamonds: number
): Promise<{ success: boolean; message: string }> {
  const userRef = doc(db, "users", userId);
  const itemDocId = `${userId}_${itemId}`;
  const invRef = doc(db, "userInventory", itemDocId);

  try {
    return await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        return { success: false, message: "User not found." };
      }

      const diamonds = userDoc.data().diamonds || 0;
      if (diamonds < priceInDiamonds) {
        return { success: false, message: "Not enough diamonds!" };
      }

      // Deduct diamonds
      transaction.update(userRef, {
        diamonds: diamonds - priceInDiamonds,
        updatedAt: serverTimestamp(),
      });

      // Add to inventory
      transaction.set(
        invRef,
        {
          userId,
          itemId,
          equipped: false,
          acquiredAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Record transaction
      const txRef = doc(db, "rewardTransactions", `tx_buy_${userId}_${itemId}_${Date.now()}`);
      transaction.set(txRef, {
        userId,
        rewardType: "diamonds",
        amount: -priceInDiamonds,
        source: `store_buy:${itemId}`,
        timestamp: serverTimestamp(),
      });

      return { success: true, message: "Item purchased successfully!" };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "userInventory", auth.currentUser);
  }
}

/**
 * Equip an avatar skin or accessory
 */
export async function equipAvatarItem(
  userId: string,
  itemType: "skin" | "accessory" | "banner",
  itemId: string
): Promise<boolean> {
  const userRef = doc(db, "users", userId);
  try {
    await setDoc(
      userRef,
      {
        [`equippedItems.${itemType}`]: itemId,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`, auth.currentUser);
  }
}

/**
 * Claim daily quest rewards with double-claim prevention
 */
export async function claimQuestReward(
  userId: string,
  questId: string,
  reward: { xp?: number; diamonds?: number }
): Promise<{ success: boolean; message: string }> {
  const docId = `${userId}_${questId}`;
  const questRef = doc(db, "userQuests", docId);
  const userRef = doc(db, "users", userId);

  try {
    return await runTransaction(db, async (transaction) => {
      const qDoc = await transaction.get(questRef);
      if (qDoc.exists() && qDoc.data().claimed) {
        return { success: false, message: "Reward already claimed!" };
      }

      const userDoc = await transaction.get(userRef);
      const currentXp = userDoc.exists() ? userDoc.data().xp || 0 : 0;
      const currentDiamonds = userDoc.exists() ? userDoc.data().diamonds || 0 : 0;

      transaction.set(
        questRef,
        {
          userId,
          questId,
          completed: true,
          claimed: true,
          claimedAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (userDoc.exists()) {
        transaction.update(userRef, {
          xp: currentXp + (reward.xp || 0),
          diamonds: currentDiamonds + (reward.diamonds || 0),
          updatedAt: serverTimestamp(),
        });
      }

      return { success: true, message: "Quest reward claimed!" };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `userQuests/${docId}`, auth.currentUser);
  }
}

/**
 * Join or create a Clan in Firestore
 */
export async function joinClan(
  userId: string,
  clanId: string,
  clanName: string,
  clanTag: string
): Promise<boolean> {
  const userRef = doc(db, "users", userId);
  const clanRef = doc(db, "clans", clanId);
  const memberRef = doc(db, "clanMembers", `${clanId}_${userId}`);

  try {
    await runTransaction(db, async (transaction) => {
      const cDoc = await transaction.get(clanRef);
      if (!cDoc.exists()) {
        transaction.set(clanRef, {
          clanId,
          name: clanName,
          tag: clanTag,
          xp: 100,
          memberCount: 1,
          createdAt: serverTimestamp(),
        });
      } else {
        const count = cDoc.data().memberCount || 1;
        transaction.update(clanRef, {
          memberCount: count + 1,
        });
      }

      transaction.set(memberRef, {
        clanId,
        userId,
        role: "member",
        joinedAt: serverTimestamp(),
      });

      transaction.update(userRef, {
        currentClanId: clanId,
        clan: {
          clanId,
          clanName,
          clanTag,
          role: "member",
        },
        updatedAt: serverTimestamp(),
      });
    });

    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `clans/${clanId}`, auth.currentUser);
  }
}
