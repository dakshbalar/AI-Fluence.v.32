import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User as FirebaseUser 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { getOrGenerateUniqueUserCode } from "../services/userCodeService";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrors";

export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export interface UserProfile {
  uid?: string;
  userCode?: string;
  username?: string;
  playerName?: string;
  displayName?: string;
  email?: string;
  avatarId?: string;
  avatarConfig?: any;
  equippedItems?: Record<string, string>;
  xp?: number;
  diamonds?: number;
  plays?: number;
  trophies?: number;
  level?: number;
  currentLeagueId?: string;
  currentClanId?: string;
  streak?: number;
  learningInterests?: string[];
  experienceLevel?: string;
  createdAt?: any;
  updatedAt?: any;
  lastActiveTimestamp?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  setGuestMode: (val: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isGuest: true,
  setGuestMode: () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
  updateUserProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    try {
      return localStorage.getItem("pq_is_guest") !== "false";
    } catch {
      return true;
    }
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const cachedCode = localStorage.getItem("aifluence_user_code") || "AIF-7K4X9P";
    return {
      uid: "guest-player",
      email: "engineer@aifluence.ai",
      displayName: "Guest Engineer",
    };
  });

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const cachedCode = localStorage.getItem("aifluence_user_code") || "AIF-7K4X9P";
    return {
      uid: "guest-player",
      userCode: cachedCode,
      username: "Guest Engineer",
      playerName: "Guest Engineer",
      avatarId: "avatar_cyber_knight",
      xp: 450,
      diamonds: 25,
      plays: 5,
      trophies: 120,
      level: 5,
      streak: 3,
    };
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        setIsGuest(false);
        try {
          localStorage.setItem("pq_is_guest", "false");
        } catch {}

        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || "AI Fluence Coder",
          photoURL: fbUser.photoURL,
        });

        // Initialize / Sync Firestore profile
        const userRef = doc(db, "users", fbUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          let uniqueCode = "";

          if (!userSnap.exists() || !userSnap.data()?.userCode) {
            uniqueCode = await getOrGenerateUniqueUserCode(fbUser.uid);
            await setDoc(
              userRef,
              {
                uid: fbUser.uid,
                userCode: uniqueCode,
                playerName: fbUser.displayName || "AI Fluence Coder",
                displayName: fbUser.displayName || "AI Fluence Coder",
                email: fbUser.email || "",
                avatarId: "avatar_cyber_knight",
                xp: 100,
                diamonds: 20,
                plays: 5,
                trophies: 50,
                streak: 1,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          } else {
            uniqueCode = userSnap.data().userCode;
            try {
              localStorage.setItem("aifluence_user_code", uniqueCode);
            } catch {}
          }
        } catch (err) {
          console.warn("Could not bootstrap user profile in Firestore:", err);
        }

        // Real-time listener on user profile
        const unsubProfile = onSnapshot(
          userRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const d = docSnap.data();
              setProfile({
                uid: fbUser.uid,
                userCode: d.userCode || localStorage.getItem("aifluence_user_code") || "AIF-7K4X9P",
                username: d.playerName || d.displayName || fbUser.displayName || "AI Fluence Coder",
                playerName: d.playerName || d.displayName || "AI Fluence Coder",
                displayName: d.displayName || fbUser.displayName || "AI Fluence Coder",
                email: d.email || fbUser.email || "",
                avatarId: d.avatarId || "avatar_cyber_knight",
                equippedItems: d.equippedItems || {},
                xp: d.xp ?? 0,
                diamonds: d.diamonds ?? 0,
                plays: d.plays ?? 5,
                trophies: d.trophies ?? 0,
                level: Math.max(1, Math.floor((d.xp || 0) / 100) + 1),
                streak: d.streak ?? 0,
                currentLeagueId: d.currentLeagueId || "bronze",
                currentClanId: d.currentClanId,
                learningInterests: d.learningInterests || [],
                experienceLevel: d.experienceLevel || "beginner",
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
              });
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${fbUser.uid}`, fbUser);
          }
        );

        setLoading(false);
        return () => unsubProfile();
      } else {
        // Guest mode fallback
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("SignOut error:", e);
    }
    setIsGuest(true);
    try {
      localStorage.setItem("pq_is_guest", "true");
    } catch {}
  };

  const setGuestMode = (val: boolean) => {
    setIsGuest(val);
    try {
      localStorage.setItem("pq_is_guest", String(val));
    } catch {}
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (user && !isGuest && auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    } else {
      // Guest local state
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isGuest,
        setGuestMode,
        loginWithGoogle,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
