import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrors";
import { lookupUserByCode } from "./userCodeService";

export interface FriendRequestItem {
  id: string;
  senderUid: string;
  senderCode: string;
  senderName?: string;
  receiverUid: string;
  status: "pending" | "accepted" | "rejected";
  createdAt?: any;
}

export interface FriendProfile {
  uid: string;
  userCode: string;
  name: string;
  avatarBg?: string;
  trophies: number;
  xp?: number;
  online?: boolean;
}

/**
 * Send a friend request using the recipient's user code
 */
export async function sendFriendRequestByCode(
  senderUid: string,
  senderCode: string,
  senderName: string,
  targetCode: string
): Promise<{ success: boolean; message: string }> {
  const normalizedTargetCode = targetCode.trim().toUpperCase();

  if (senderCode && normalizedTargetCode === senderCode.toUpperCase()) {
    return { success: false, message: "You cannot send a friend request to your own code." };
  }

  const target = await lookupUserByCode(normalizedTargetCode);
  if (!target) {
    return { success: false, message: `No user found with code ${normalizedTargetCode}.` };
  }

  if (target.uid === senderUid) {
    return { success: false, message: "You cannot add yourself as a friend." };
  }

  // Check if friendship already exists
  const friendshipId1 = `${senderUid}_${target.uid}`;
  const friendshipId2 = `${target.uid}_${senderUid}`;
  
  try {
    const f1 = await getDoc(doc(db, "friendships", friendshipId1));
    const f2 = await getDoc(doc(db, "friendships", friendshipId2));
    if (f1.exists() || f2.exists()) {
      return { success: false, message: "You are already friends with this user!" };
    }

    // Check for existing pending request
    const reqId = `${senderUid}_${target.uid}`;
    const reqRef = doc(db, "friendRequests", reqId);
    const existingReq = await getDoc(reqRef);

    if (existingReq.exists() && existingReq.data()?.status === "pending") {
      return { success: false, message: "A friend request is already pending for this user." };
    }

    await setDoc(reqRef, {
      senderUid,
      senderCode,
      senderName,
      receiverUid: target.uid,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return { success: true, message: `Friend request sent to ${target.playerName || targetCode}!` };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "friendRequests", auth.currentUser);
  }
}

/**
 * Accept an incoming friend request
 */
export async function acceptFriendRequest(requestId: string): Promise<boolean> {
  const reqRef = doc(db, "friendRequests", requestId);
  try {
    const reqSnap = await getDoc(reqRef);
    if (!reqSnap.exists()) return false;

    const data = reqSnap.data();
    const friendshipId = `${data.senderUid}_${data.receiverUid}`;
    const friendshipRef = doc(db, "friendships", friendshipId);

    // Create confirmed friendship
    await setDoc(friendshipRef, {
      user1Uid: data.senderUid,
      user2Uid: data.receiverUid,
      createdAt: serverTimestamp(),
    });

    // Delete or mark request accepted
    await deleteDoc(reqRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "friendships", auth.currentUser);
  }
}

/**
 * Reject / Delete an incoming friend request
 */
export async function rejectFriendRequest(requestId: string): Promise<boolean> {
  const reqRef = doc(db, "friendRequests", requestId);
  try {
    await deleteDoc(reqRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `friendRequests/${requestId}`, auth.currentUser);
  }
}

/**
 * Remove an existing friendship
 */
export async function removeFriend(user1Uid: string, user2Uid: string): Promise<boolean> {
  const friendshipId1 = `${user1Uid}_${user2Uid}`;
  const friendshipId2 = `${user2Uid}_${user1Uid}`;

  try {
    await deleteDoc(doc(db, "friendships", friendshipId1)).catch(() => {});
    await deleteDoc(doc(db, "friendships", friendshipId2)).catch(() => {});
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, "friendships", auth.currentUser);
  }
}

/**
 * Real-time subscription to incoming friend requests for a user
 */
export function subscribeToFriendRequests(
  userId: string,
  callback: (requests: FriendRequestItem[]) => void
) {
  const q = query(
    collection(db, "friendRequests"),
    where("receiverUid", "==", userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: FriendRequestItem[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (d.status === "pending") {
          items.push({
            id: docSnap.id,
            senderUid: d.senderUid,
            senderCode: d.senderCode,
            senderName: d.senderName || "AI Fluence Explorer",
            receiverUid: d.receiverUid,
            status: d.status,
            createdAt: d.createdAt,
          });
        }
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "friendRequests", auth.currentUser);
    }
  );
}

/**
 * Real-time subscription to confirmed friends for a user
 */
export function subscribeToFriends(
  userId: string,
  callback: (friends: FriendProfile[]) => void
) {
  const q1 = query(collection(db, "friendships"), where("user1Uid", "==", userId));
  const q2 = query(collection(db, "friendships"), where("user2Uid", "==", userId));

  let f1: string[] = [];
  let f2: string[] = [];

  const updateCombinedFriends = async () => {
    const friendUids = Array.from(new Set([...f1, ...f2]));
    if (friendUids.length === 0) {
      callback([]);
      return;
    }

    try {
      const friendProfiles: FriendProfile[] = [];
      for (const fUid of friendUids.slice(0, 20)) {
        const uSnap = await getDoc(doc(db, "users", fUid));
        if (uSnap.exists()) {
          const d = uSnap.data();
          friendProfiles.push({
            uid: fUid,
            userCode: d.userCode || "AIF-????",
            name: d.playerName || d.displayName || "Friend",
            trophies: d.trophies || 0,
            xp: d.xp || 0,
            avatarBg: d.avatarId || "avatar_cyber_knight",
            online: true,
          });
        }
      }
      callback(friendProfiles);
    } catch (err) {
      console.warn("Could not fetch friend profiles:", err);
    }
  };

  const unsub1 = onSnapshot(q1, (snap) => {
    f1 = snap.docs.map((d) => d.data().user2Uid);
    updateCombinedFriends();
  });

  const unsub2 = onSnapshot(q2, (snap) => {
    f2 = snap.docs.map((d) => d.data().user1Uid);
    updateCombinedFriends();
  });

  return () => {
    unsub1();
    unsub2();
  };
}
