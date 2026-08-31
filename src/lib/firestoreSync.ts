import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from "./firebase";

export interface UserProgressData {
  doneTasks: Record<string, boolean>;
  activeStageId?: string;
  finderAnswers?: Record<string, "yes" | "no">;
  updatedAt?: number;
  displayName?: string;
}

const LOCAL_STORAGE_PROGRESS_KEY = "startup_roadmap_progress";

export async function saveUserProgress(uid: string, data: UserProgressData): Promise<void> {
  // Always update localStorage as fast cache / offline fallback
  try {
    localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }

  if (!isFirebaseConfigured || !db || !uid) {
    return;
  }

  const docPath = `users/${uid}/progress/current`;
  try {
    const docRef = doc(db, "users", uid, "progress", "current");
    await setDoc(docRef, {
      ...data,
      updatedAt: Date.now(),
    }, { merge: true });
  } catch (error) {
    console.warn("Firestore save progress error (non-fatal):", error);
    // Don't crash the UI on background sync errors
  }
}

export async function getUserProgress(uid: string): Promise<UserProgressData | null> {
  // Try local storage first
  let localData: UserProgressData | null = null;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_PROGRESS_KEY);
    if (stored) {
      localData = JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Could not read from localStorage:", e);
  }

  if (!isFirebaseConfigured || !db || !uid) {
    return localData;
  }

  const docPath = `users/${uid}/progress/current`;
  try {
    const docRef = doc(db, "users", uid, "progress", "current");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserProgressData;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }

  return localData;
}

export function subscribeToUserProgress(
  uid: string,
  onUpdate: (data: UserProgressData) => void
): () => void {
  if (!isFirebaseConfigured || !db || !uid) {
    return () => {};
  }

  const docPath = `users/${uid}/progress/current`;
  try {
    const docRef = doc(db, "users", uid, "progress", "current");
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProgressData;
          onUpdate(data);
        }
      },
      (error) => {
        console.warn("Snapshot error:", error);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn("Subscribe error:", e);
    return () => {};
  }
}
