import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
  updateProfile,
  linkWithPopup,
  type User,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  displayName: string;
  isAnonymous: boolean;
  email?: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  rawUser: User | null;
  loading: boolean;
  isConfigured: boolean;
  error: string | null;
  signInAnonymouslyWithName: (name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserDisplayName: (name: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  clearError: () => void;
}

const LOCAL_STORAGE_USER_KEY = "startup_roadmap_offline_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [rawUser, setRawUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Offline fallback mode
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Could not load local offline user:", e);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setRawUser(firebaseUser);
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? "Anonymous Founder" : "Founder"),
          isAnonymous: firebaseUser.isAnonymous,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setRawUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInAnonymouslyWithName = async (name: string) => {
    setError(null);
    const trimmedName = name.trim() || "Anonymous Founder";

    if (!isFirebaseConfigured || !auth) {
      // Fallback offline user
      const offlineUser: UserProfile = {
        uid: "local-" + Math.random().toString(36).substring(2, 9),
        displayName: trimmedName,
        isAnonymous: true,
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(offlineUser));
      setUser(offlineUser);
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInAnonymously(auth);
      if (userCredential.user) {
        try {
          await updateProfile(userCredential.user, {
            displayName: trimmedName,
          });
        } catch (profileErr) {
          console.warn("Could not update Firebase profile name:", profileErr);
        }
        setRawUser(userCredential.user);
        setUser({
          uid: userCredential.user.uid,
          displayName: trimmedName,
          isAnonymous: true,
          email: null,
          photoURL: null,
        });
      }
    } catch (err: unknown) {
      console.warn("Firebase Anonymous Sign-In failed, falling back to local founder mode:", err);
      const fallbackUser: UserProfile = {
        uid: "local-" + Math.random().toString(36).substring(2, 9),
        displayName: trimmedName,
        isAnonymous: true,
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      setError("Firebase sync unavailable (running in local storage mode). Progress is safely saved on this device.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setError("Firebase configuration is missing in environment variables. Running in offline demo mode.");
      return;
    }

    try {
      setLoading(true);
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        // Link anonymous account with Google
        try {
          const linkResult = await linkWithPopup(auth.currentUser, googleProvider);
          const u = linkResult.user;
          setRawUser(u);
          setUser({
            uid: u.uid,
            displayName: u.displayName || "Founder",
            isAnonymous: false,
            email: u.email,
            photoURL: u.photoURL,
          });
          return;
        } catch (linkErr: unknown) {
          console.warn("Account link failed, attempting standard sign-in:", linkErr);
        }
      }

      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      setRawUser(u);
      setUser({
        uid: u.uid,
        displayName: u.displayName || "Founder",
        isAnonymous: false,
        email: u.email,
        photoURL: u.photoURL,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google Sign-In failed";
      setError(msg);
      console.warn("Google Sign-In Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserDisplayName = async (name: string) => {
    setError(null);
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (!isFirebaseConfigured || !auth || !auth.currentUser) {
      if (user) {
        const updated: UserProfile = { ...user, displayName: trimmedName };
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
        setUser(updated);
      }
      return;
    }

    try {
      await updateProfile(auth.currentUser, { displayName: trimmedName });
      setUser((prev) => (prev ? { ...prev, displayName: trimmedName } : null));
    } catch (err: unknown) {
      console.warn("Update Profile Error on server, updating local:", err);
      if (user) {
        const updated: UserProfile = { ...user, displayName: trimmedName };
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
        setUser(updated);
      }
    }
  };

  const signOutUser = async () => {
    setError(null);
    if (!isFirebaseConfigured || !auth) {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setRawUser(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign out";
      setError(msg);
      console.error("Sign Out Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        rawUser,
        loading,
        isConfigured: isFirebaseConfigured,
        error,
        signInAnonymouslyWithName,
        signInWithGoogle,
        updateUserDisplayName,
        signOutUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
