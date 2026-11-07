import { 
  doc, 
  getDoc, 
  setDoc, 
  runTransaction,
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrors";

const CODE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Ambiguity-free charset

export function generateRandomCodeCandidate(): string {
  let result = "";
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * CODE_CHARS.length);
    result += CODE_CHARS[idx];
  }
  return `AIF-${result}`;
}

/**
 * Atomically generates and reserves a unique AIF-XXXXXX code in Firestore
 */
export async function getOrGenerateUniqueUserCode(userId: string): Promise<string> {
  const userRef = doc(db, "users", userId);
  
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data()?.userCode) {
      const existingCode = userSnap.data().userCode;
      // Cache locally for instant UI access
      try {
        localStorage.setItem("aifluence_user_code", existingCode);
      } catch {}
      return existingCode;
    }
  } catch (err) {
    console.warn("Could not check existing user code, proceeding to generate", err);
  }

  // Attempt atomic reservation with up to 5 retries in case of rare collision
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateRandomCodeCandidate();
    const codeRef = doc(db, "userCodes", candidate);

    try {
      const codeAssigned = await runTransaction(db, async (transaction) => {
        const codeDoc = await transaction.get(codeRef);
        if (codeDoc.exists()) {
          return null; // Collision, try next candidate
        }

        // Reserve code
        transaction.set(codeRef, {
          uid: userId,
          userCode: candidate,
          createdAt: serverTimestamp(),
        });

        // Link to user profile
        transaction.set(
          userRef,
          {
            uid: userId,
            userCode: candidate,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        return candidate;
      });

      if (codeAssigned) {
        try {
          localStorage.setItem("aifluence_user_code", codeAssigned);
        } catch {}
        return codeAssigned;
      }
    } catch (error) {
      console.warn(`User code generation attempt ${attempt + 1} failed:`, error);
    }
  }

  // Fallback if network or quota issue
  const fallback = `AIF-${Math.floor(100000 + Math.random() * 900000)}`;
  try {
    localStorage.setItem("aifluence_user_code", fallback);
  } catch {}
  return fallback;
}

/**
 * Lookup a user by their unique user code
 */
export async function lookupUserByCode(code: string): Promise<{ uid: string; playerName?: string; avatarId?: string; trophies?: number } | null> {
  const normalized = code.trim().toUpperCase();
  const codeRef = doc(db, "userCodes", normalized);

  try {
    const codeSnap = await getDoc(codeRef);
    if (!codeSnap.exists()) {
      return null;
    }

    const uid = codeSnap.data().uid;
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        uid,
        playerName: data.playerName || data.displayName || "AI Fluence Coder",
        avatarId: data.avatarId || "avatar_cyber_knight",
        trophies: data.trophies || 0,
      };
    }

    return { uid, playerName: "AI Fluence Coder" };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `userCodes/${normalized}`, auth.currentUser);
  }
}
