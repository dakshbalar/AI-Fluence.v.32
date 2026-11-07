import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { db, auth } from "../firebase";

/**
 * 1. Cloud-Synced Course & Lesson Progress Service
 */
export async function saveUserCourseProgress(
  userId: string,
  courseId: string,
  progressData: { currentSection: number; completedLevels: Record<string, any>; overallProgressPct: number }
): Promise<void> {
  const docRef = doc(db, "user_course_progress", `${userId}_${courseId}`);
  await setDoc(docRef, {
    userId,
    courseId,
    ...progressData,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function fetchUserCourseProgress(userId: string, courseId: string): Promise<any | null> {
  const docRef = doc(db, "user_course_progress", `${userId}_${courseId}`);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}

/**
 * 2. Cloud Code Snippet & Solution Vault Service
 */
export async function saveCodeSnippet(
  userId: string,
  snippet: { snippetId: string; title: string; language: string; code: string; tags: string[] }
): Promise<void> {
  const docRef = doc(db, "user_code_snippets", userId);
  const snap = await getDoc(docRef);
  let snippets = snap.exists() ? (snap.data().snippets || []) : [];
  
  const existingIdx = snippets.findIndex((s: any) => s.snippetId === snippet.snippetId);
  if (existingIdx >= 0) {
    snippets[existingIdx] = { ...snippet, updatedAt: new Date().toISOString() };
  } else {
    snippets.push({ ...snippet, updatedAt: new Date().toISOString() });
  }

  await setDoc(docRef, { userId, snippets, updatedAt: serverTimestamp() }, { merge: true });
}

export async function fetchCodeSnippets(userId: string): Promise<any[]> {
  const docRef = doc(db, "user_code_snippets", userId);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data().snippets || []) : [];
}

/**
 * 3. Server-Validated Achievement & Badge Registry Service
 */
export async function unlockUserAchievement(
  userId: string,
  badgeId: string,
  badgeMeta: { title: string; rarity: string; description: string }
): Promise<void> {
  const docRef = doc(db, "user_achievements", userId);
  const snap = await getDoc(docRef);
  let unlocked = snap.exists() ? (snap.data().unlockedBadges || []) : [];
  
  if (!unlocked.some((b: any) => b.badgeId === badgeId)) {
    unlocked.push({
      badgeId,
      ...badgeMeta,
      unlockedAt: new Date().toISOString()
    });
    await setDoc(docRef, { userId, unlockedBadges: unlocked, updatedAt: serverTimestamp() }, { merge: true });
  }
}

/**
 * 4. Detailed Quiz & Assessment Analytics Service
 */
export async function logQuizAttempt(
  userId: string,
  attemptData: { courseId: string; lessonId: string; scorePct: number; correctCount: number; incorrectCount: number }
): Promise<void> {
  await addDoc(collection(db, "user_quiz_attempts"), {
    userId,
    ...attemptData,
    timestamp: serverTimestamp()
  });
}

/**
 * 5. Real-Time Clan Chat & Activity Stream Service
 */
export async function sendClanMessage(
  clanCode: string,
  senderUid: string,
  senderName: string,
  messageText: string,
  type: "chat" | "achievement_share" = "chat"
): Promise<void> {
  await addDoc(collection(db, "clan_messages"), {
    clanCode,
    senderUid,
    senderName,
    messageText,
    type,
    timestamp: serverTimestamp()
  });
}

export function subscribeToClanMessages(clanCode: string, callback: (msgs: any[]) => void) {
  const q = query(
    collection(db, "clan_messages"),
    where("clanCode", "==", clanCode),
    orderBy("timestamp", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(msgs);
  }, (err) => {
    console.warn("Clan messages snapshot warning:", err);
    callback([]);
  });
}

/**
 * 6. Seasonal Tournaments & League History Service
 */
export async function getActiveTournament(): Promise<any | null> {
  const q = query(collection(db, "seasonal_tournaments"), where("active", "==", true));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  }
  return null;
}

/**
 * 7. Spaced Repetition / Flashcard Review Engine Service
 */
export async function saveSpacedRepetitionCard(
  userId: string,
  cardId: string,
  reviewResult: { intervalDays: number; easeFactor: number; repetitions: number; nextReviewDate: string }
): Promise<void> {
  const docRef = doc(db, "user_spaced_repetition", userId);
  const snap = await getDoc(docRef);
  let cards = snap.exists() ? (snap.data().cards || []) : [];
  
  const idx = cards.findIndex((c: any) => c.cardId === cardId);
  if (idx >= 0) {
    cards[idx] = { cardId, ...reviewResult, lastReviewedAt: new Date().toISOString() };
  } else {
    cards.push({ cardId, ...reviewResult, lastReviewedAt: new Date().toISOString() });
  }

  await setDoc(docRef, { userId, cards, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * 8. In-App Notification Center Service
 */
export async function sendUserNotification(
  userId: string,
  notification: { title: string; message: string; type: "friend" | "clan" | "energy" | "streak" }
): Promise<void> {
  await addDoc(collection(db, "user_notifications"), {
    userId,
    ...notification,
    read: false,
    createdAt: serverTimestamp()
  });
}

export function subscribeToUserNotifications(userId: string, callback: (notifs: any[]) => void) {
  const q = query(
    collection(db, "user_notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(notifs);
  }, (err) => {
    console.warn("Notifications snapshot warning:", err);
    callback([]);
  });
}

/**
 * 9. AI Mock Interview & Evaluation Logs Service
 */
export async function logInterviewSession(
  userId: string,
  sessionData: { roleTarget: string; questionsAnswered: number; overallScore: number; feedbackSummary: string }
): Promise<void> {
  await addDoc(collection(db, "user_interview_sessions"), {
    userId,
    ...sessionData,
    timestamp: serverTimestamp()
  });
}

/**
 * 10. Student Learning Telemetry & Engagement Logging Service
 */
export async function logTelemetryEvent(
  userId: string,
  eventType: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  await addDoc(collection(db, "user_telemetry_events"), {
    userId,
    eventType,
    metadata,
    timestamp: serverTimestamp()
  });
}
