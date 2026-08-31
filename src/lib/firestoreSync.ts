import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from "./firebase";

export interface UserProgressData {
  doneTasks: Record<string, boolean>;
  activeStageId?: string;
  finderAnswers?: Record<string, "yes" | "no">;
  updatedAt?: number;
  displayName?: string;
}

export type SyncStatus = "idle" | "saving" | "synced" | "offline" | "error";

const LOCAL_STORAGE_PROGRESS_KEY = "startup_roadmap_progress";
const LOCAL_STORAGE_TIMESTAMP_KEY = "startup_roadmap_last_saved";

export function getLocalLastSavedTimestamp(): number | null {
  try {
    const val = localStorage.getItem(LOCAL_STORAGE_TIMESTAMP_KEY);
    return val ? parseInt(val, 10) : null;
  } catch {
    return null;
  }
}

export async function saveUserProgress(
  uid: string,
  data: UserProgressData,
  onStatusChange?: (status: SyncStatus, timestamp?: number) => void
): Promise<void> {
  const now = Date.now();
  onStatusChange?.("saving");

  // Always update localStorage as fast cache / offline fallback
  try {
    localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(data));
    localStorage.setItem(LOCAL_STORAGE_TIMESTAMP_KEY, now.toString());
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }

  if (!isFirebaseConfigured || !db || !uid) {
    onStatusChange?.("offline", now);
    return;
  }

  const docPath = `users/${uid}/progress/current`;
  try {
    const docRef = doc(db, "users", uid, "progress", "current");
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: now,
      },
      { merge: true }
    );
    onStatusChange?.("synced", now);
  } catch (error) {
    console.warn("Firestore save progress error (non-fatal):", error);
    onStatusChange?.("error", now);
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

  let unsubscribeFn: (() => void) | null = null;
  let isCancelled = false;

  try {
    const docRef = doc(db, "users", uid, "progress", "current");
    unsubscribeFn = onSnapshot(
      docRef,
      (docSnap) => {
        if (isCancelled) return;
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProgressData;
          onUpdate(data);
        }
      },
      (error) => {
        if (!isCancelled) {
          console.warn("Firestore snapshot subscription error:", error);
        }
      }
    );
  } catch (e) {
    console.warn("Subscribe error:", e);
    return () => {};
  }

  return () => {
    isCancelled = true;
    if (typeof unsubscribeFn === "function") {
      try {
        unsubscribeFn();
      } catch (err) {
        console.warn("Error during Firestore unsubscribe:", err);
      }
      unsubscribeFn = null;
    }
  };
}
