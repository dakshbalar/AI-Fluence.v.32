import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  ClanData,
  ClanMember,
  ClanMessage,
  ClanRole,
  ClanType,
  DEFAULT_CLANS,
} from "../data/clansData";
import {
  handleFirestoreError,
  OperationType,
} from "./dailyQuestService";
import { loadStoredStudentProfile, saveProfile, cleanFirestoreData } from "../utils/engagementStore";

/**
 * Recalculate total trophies of a clan as the sum of all members' trophies
 */
export function calculateClanTotalTrophies(members: ClanMember[]): number {
  if (!Array.isArray(members) || members.length === 0) return 0;
  return members.reduce((sum, m) => sum + (m.trophies || m.xp || 0), 0);
}

/**
 * Format raw clan type or join mode to standardized UI strings:
 * "OPEN" / "Open" -> "Anyone Can Join"
 * "INVITE_ONLY" / "Invite Only" -> "Invite Only"
 * "CLOSED" / "Closed" -> "Closed"
 */
export function formatClanTypeLabel(typeStr?: string): "Anyone Can Join" | "Invite Only" | "Closed" {
  if (!typeStr) return "Anyone Can Join";
  const normalized = typeStr.toLowerCase().trim();
  if (normalized.includes("invite")) return "Invite Only";
  if (normalized.includes("closed")) return "Closed";
  return "Anyone Can Join";
}

/**
 * Fetch all clans from Firestore collection `clans`
 * Filters out and removes any empty clans (0 members) from the database
 */
export async function fetchAllClansFromFirestore(): Promise<ClanData[]> {
  const path = "clans";
  try {
    const querySnapshot = await getDocs(collection(db, "clans"));
    const loadedClans: ClanData[] = [];

    if (!querySnapshot.empty) {
      for (const snap of querySnapshot.docs) {
        const data = snap.data() as ClanData;
        if (data && data.id) {
          const membersList = Array.isArray(data.members) ? data.members : [];
          // Rule: No clan can exist empty. If members count is 0, delete it from Firestore.
          if (membersList.length === 0) {
            deleteDoc(doc(db, "clans", snap.id)).catch(() => {});
            continue;
          }

          const computedTrophies = calculateClanTotalTrophies(membersList);
          loadedClans.push({
            ...data,
            members: membersList,
            totalTrophies: computedTrophies,
            totalXp: computedTrophies,
          });
        }
      }
    }

    return loadedClans;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

/**
 * Sync user profile's clan info in Firestore `users/{userId}`
 */
export async function syncUserClanInFirestore(
  userId: string,
  clanInfo: {
    clanId: string;
    clanName: string;
    clanTag: string;
    clanShieldColor: string;
    clanRole: string;
  } | null
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, "users", userId);
    if (clanInfo) {
      await setDoc(
        docRef,
        {
          clanId: clanInfo.clanId,
          clanName: clanInfo.clanName,
          clanTag: clanInfo.clanTag,
          clanShieldColor: clanInfo.clanShieldColor,
          clanRole: clanInfo.clanRole,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } else {
      await setDoc(
        docRef,
        {
          clanId: "",
          clanName: "",
          clanTag: "",
          clanShieldColor: "",
          clanRole: "",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Create a new clan in Firestore and assign current user as Leader
 */
export async function createClanInFirestore(
  userId: string,
  userName: string,
  userTrophies: number,
  newClanData: Omit<ClanData, "id" | "members" | "messages" | "totalTrophies" | "totalXp">
): Promise<ClanData> {
  const clanId = `clan_${Date.now()}`;
  const path = `clans/${clanId}`;

  const leaderMember: ClanMember = {
    id: userId,
    name: userName,
    role: "Leader",
    xp: userTrophies,
    trophies: userTrophies,
    donations: 0,
    leagueId: "gold",
    avatarType: "circle-letter",
    avatarBg: "#3b82f6",
    avatarLetter: userName.charAt(0).toUpperCase(),
    isCurrentUser: true,
  };

  const initialMembers = [leaderMember];
  const computedTrophies = calculateClanTotalTrophies(initialMembers);

  const fullClan: ClanData = {
    id: clanId,
    ...newClanData,
    totalTrophies: computedTrophies,
    totalXp: computedTrophies,
    members: initialMembers,
    messages: [
      {
        id: `msg_${Date.now()}`,
        senderName: "System",
        senderRole: "Leader",
        message: `Clan ${newClanData.name} created! Welcome, ${userName}! ⚔️`,
        timestamp: "Just now",
        isSystem: true,
      },
    ],
  };

  try {
    const docRef = doc(db, "clans", clanId);
    await setDoc(docRef, cleanFirestoreData(fullClan), { merge: true });

    // Sync to user profile in Firestore and localStorage
    await syncUserClanInFirestore(userId, {
      clanId: fullClan.id,
      clanName: fullClan.name,
      clanTag: fullClan.tag,
      clanShieldColor: fullClan.shieldColor,
      clanRole: "Leader",
    });

    saveProfile({ clanId: fullClan.id });

    return fullClan;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

/**
 * Join a clan in Firestore
 * Enforces single clan constraint, recalculates total trophies as sum of member trophies,
 * and deletes any previous clan if it becomes empty.
 */
export async function joinClanInFirestore(
  userId: string,
  userName: string,
  userTrophies: number,
  clanId: string,
  allClans: ClanData[]
): Promise<{ updatedClan: ClanData; updatedAllClans: ClanData[] }> {
  const path = `clans/${clanId}`;

  const targetClan = allClans.find((c) => c.id === clanId);
  if (!targetClan) {
    throw new Error("Clan not found");
  }

  // Build new member profile
  const newMember: ClanMember = {
    id: userId,
    name: userName,
    role: "Member",
    xp: userTrophies,
    trophies: userTrophies,
    donations: 0,
    leagueId: "gold",
    avatarType: "circle-letter",
    avatarBg: "#8b5cf6",
    avatarLetter: userName.charAt(0).toUpperCase(),
    isCurrentUser: true,
  };

  const nextAllClans: ClanData[] = [];

  for (const c of allClans) {
    if (c.id === clanId) {
      const filteredMembers = c.members.filter((m) => m.id !== userId && !m.isCurrentUser);
      const nextMembers = [...filteredMembers, newMember];
      const sumTrophies = calculateClanTotalTrophies(nextMembers);

      const updatedClanDoc: ClanData = {
        ...c,
        members: nextMembers,
        totalTrophies: sumTrophies,
        totalXp: sumTrophies,
        messages: [
          ...(c.messages || []),
          {
            id: `msg_${Date.now()}`,
            senderName: "System",
            senderRole: "Member",
            message: `${userName} joined the clan! Welcome! ⚔️`,
            timestamp: "Just now",
            isSystem: true,
          },
        ],
      };

      // Write updated target clan to Firestore
      setDoc(doc(db, "clans", clanId), cleanFirestoreData(updatedClanDoc), { merge: true }).catch(() => {});
      nextAllClans.push(updatedClanDoc);
    } else {
      // Remove user from any previous clan
      const filteredMembers = c.members.filter((m) => m.id !== userId && !m.isCurrentUser);
      if (filteredMembers.length === 0) {
        // If previous clan becomes empty, delete it from Firestore!
        deleteDoc(doc(db, "clans", c.id)).catch(() => {});
      } else {
        const sumTrophies = calculateClanTotalTrophies(filteredMembers);
        const updatedPreviousClan: ClanData = {
          ...c,
          members: filteredMembers,
          totalTrophies: sumTrophies,
          totalXp: sumTrophies,
        };
        setDoc(doc(db, "clans", c.id), cleanFirestoreData(updatedPreviousClan), { merge: true }).catch(() => {});
        nextAllClans.push(updatedPreviousClan);
      }
    }
  }

  const updatedTarget = nextAllClans.find((c) => c.id === clanId) || targetClan;

  // Sync to user profile in Firestore & localStorage
  await syncUserClanInFirestore(userId, {
    clanId: updatedTarget.id,
    clanName: updatedTarget.name,
    clanTag: updatedTarget.tag,
    clanShieldColor: updatedTarget.shieldColor,
    clanRole: "Member",
  });

  saveProfile({ clanId: updatedTarget.id });

  return { updatedClan: updatedTarget, updatedAllClans: nextAllClans };
}

/**
 * Leave current clan in Firestore
 * Deletes clan document from Firestore if member count drops to 0
 */
export async function leaveClanInFirestore(
  userId: string,
  clanId: string,
  allClans: ClanData[]
): Promise<ClanData[]> {
  const path = `clans/${clanId}`;

  const nextAllClans: ClanData[] = [];

  for (const c of allClans) {
    if (c.id === clanId) {
      const filteredMembers = c.members.filter((m) => m.id !== userId && !m.isCurrentUser);

      // Rule: If member count becomes 0, delete clan from Firestore!
      if (filteredMembers.length === 0) {
        deleteDoc(doc(db, "clans", clanId)).catch(() => {});
      } else {
        const sumTrophies = calculateClanTotalTrophies(filteredMembers);
        const updatedClanDoc: ClanData = {
          ...c,
          members: filteredMembers,
          totalTrophies: sumTrophies,
          totalXp: sumTrophies,
          messages: [
            ...(c.messages || []),
            {
              id: `msg_${Date.now()}`,
              senderName: "System",
              senderRole: "Member",
              message: `A member left the clan.`,
              timestamp: "Just now",
              isSystem: true,
            },
          ],
        };

        setDoc(doc(db, "clans", clanId), cleanFirestoreData(updatedClanDoc), { merge: true }).catch(() => {});
        nextAllClans.push(updatedClanDoc);
      }
    } else {
      nextAllClans.push(c);
    }
  }

  // Clear user profile clan association
  await syncUserClanInFirestore(userId, null);
  saveProfile({ clanId: "" });

  return nextAllClans;
}

/**
 * Send a chat message or join request to clan
 */
export async function sendClanMessageInFirestore(
  clanId: string,
  senderName: string,
  senderRole: ClanRole,
  messageText: string,
  isSystem: boolean = false
): Promise<ClanMessage> {
  const newMsg: ClanMessage = {
    id: `msg_${Date.now()}`,
    senderName,
    senderRole,
    message: messageText,
    timestamp: "Just now",
    isSystem,
  };

  try {
    const clanRef = doc(db, "clans", clanId);
    const snap = await getDoc(clanRef);
    if (snap.exists()) {
      const data = snap.data() as ClanData;
      const existingMsgs = data.messages || [];
      const updatedMsgs = [...existingMsgs, newMsg];
      await updateDoc(clanRef, { messages: updatedMsgs });
    }
  } catch (err) {
    console.warn("Failed to update clan chat in Firestore:", err);
  }

  return newMsg;
}

/**
 * Find a specific clan in Firestore by code (tag or id)
 */
export async function findClanByCodeInFirestore(code: string): Promise<ClanData | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  try {
    const querySnapshot = await getDocs(collection(db, "clans"));
    for (const snap of querySnapshot.docs) {
      const data = snap.data() as ClanData;
      if (data && data.id) {
        const clanTag = (data.tag || "").trim().toUpperCase();
        const clanId = (data.id || "").trim().toUpperCase();
        if (
          clanTag === normalized ||
          clanTag === `#${normalized}` ||
          clanId === normalized ||
          clanId === `CLAN_${normalized}`
        ) {
          const membersList = Array.isArray(data.members) ? data.members : [];
          if (membersList.length === 0) {
            deleteDoc(doc(db, "clans", snap.id)).catch(() => {});
            return null;
          }
          const computedTrophies = calculateClanTotalTrophies(membersList);
          return {
            ...data,
            members: membersList,
            totalTrophies: computedTrophies,
            totalXp: computedTrophies,
          };
        }
      }
    }
  } catch (err) {
    console.error("Error finding clan by code:", err);
  }
  return null;
}

