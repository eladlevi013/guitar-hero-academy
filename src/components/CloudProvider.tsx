"use client";

import {
  GoogleAuthProvider,
  User,
  linkWithPopup,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PracticeSettings } from "@/hooks/usePracticeSettings";
import type { PracticeSessionRecord } from "@/hooks/useSessionHistory";
import {
  STORAGE_EVENTS,
  STORAGE_KEYS,
  UPDATED_AT_KEYS,
  dispatchStorageEvent,
  getUpdatedAt,
  readJson,
  safeStorageGet,
  safeStorageRemove,
  safeStorageSet,
  setUpdatedAt,
} from "@/lib/storage";
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";

type PracticeMode = PracticeSettings["mode"];
type SpeedMultiplier = PracticeSettings["speedMultiplier"];

type SyncedPreferences = {
  speedMultiplier: SpeedMultiplier;
  mode: PracticeMode;
  drumVolume: number;
  autoAdvance: boolean;
};

type ProgressSnapshot = {
  completed: string[];
  stars: Record<string, 0 | 1 | 2 | 3>;
  updatedAt: string | null;
};

type AchievementsSnapshot = {
  unlocked: string[];
  updatedAt: string | null;
};

type SessionsSnapshot = {
  items: PracticeSessionRecord[];
  updatedAt: string | null;
};

type PreferencesSnapshot = {
  data: SyncedPreferences;
  updatedAt: string | null;
};

type FavoritesSnapshot = {
  ids: string[];
  updatedAt: string | null;
};

type CloudDocument = {
  version: 1;
  syncedAt: string;
  legacyAnonymousId: string;
  progress: ProgressSnapshot;
  achievements: AchievementsSnapshot;
  sessions: SessionsSnapshot;
  favorites: FavoritesSnapshot;
  preferences: PreferencesSnapshot;
};

type LocalBundle = {
  legacyAnonymousId: string;
  progress: ProgressSnapshot;
  achievements: AchievementsSnapshot;
  sessions: SessionsSnapshot;
  favorites: FavoritesSnapshot;
  preferences: PreferencesSnapshot;
};

type CloudContextValue = {
  enabled: boolean;
  ready: boolean;
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetData: () => Promise<void>;
  resetProgressOnly: () => Promise<void>;
  syncStatus: "disabled" | "idle" | "syncing" | "error";
  syncError: string | null;
  lastSyncedAt: string | null;
};

const DEFAULT_PREFERENCES: SyncedPreferences = {
  speedMultiplier: 1,
  mode: "timed",
  drumVolume: 0.7,
  autoAdvance: false,
};

const CloudContext = createContext<CloudContextValue>({
  enabled: false,
  ready: true,
  user: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  resetData: async () => {},
  resetProgressOnly: async () => {},
  syncStatus: "disabled",
  syncError: null,
  lastSyncedAt: null,
});

function toIsoOrNull(value: unknown) {
  return typeof value === "string" ? value : null;
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function parseStarRecord(value: unknown): Record<string, 0 | 1 | 2 | 3> {
  if (!value || typeof value !== "object") return {};
  const entries = Object.entries(value as Record<string, unknown>).map(([key, raw]) => {
    const num = typeof raw === "number" ? raw : 0;
    const clamped = Math.max(0, Math.min(3, Math.round(num))) as 0 | 1 | 2 | 3;
    return [key, clamped] as const;
  });
  return Object.fromEntries(entries);
}

function isSpeedMultiplier(value: unknown): value is SpeedMultiplier {
  return value === 0.5 || value === 0.75 || value === 1 || value === 1.25 || value === 1.5;
}

function clampDrumVolume(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) return DEFAULT_PREFERENCES.drumVolume;
  return Math.min(1, Math.max(0, value));
}

function compareUpdatedAt(left: string | null, right: string | null) {
  if (!left && !right) return 0;
  if (!left) return -1;
  if (!right) return 1;
  return new Date(left).getTime() - new Date(right).getTime();
}

function readLocalBundle(): LocalBundle {
  const settings = readJson<PracticeSettings>(STORAGE_KEYS.practiceSettings, {
    speedMultiplier: 1,
    mode: "timed",
    drumVolume: 0.7,
    timingOffsetMs: 0,
  });

  return {
    legacyAnonymousId: safeStorageGet(STORAGE_KEYS.anonymousId) ?? "",
    progress: {
      completed: uniqueStrings(readJson<string[]>(STORAGE_KEYS.progress, [])),
      stars: parseStarRecord(readJson<Record<string, unknown>>(STORAGE_KEYS.stars, {})),
      updatedAt: getUpdatedAt(UPDATED_AT_KEYS.progress),
    },
    achievements: {
      unlocked: uniqueStrings(readJson<string[]>(STORAGE_KEYS.achievements, [])),
      updatedAt: getUpdatedAt(UPDATED_AT_KEYS.achievements),
    },
    sessions: {
      items: readJson<PracticeSessionRecord[]>(STORAGE_KEYS.sessionHistory, []),
      updatedAt: getUpdatedAt(UPDATED_AT_KEYS.sessionHistory),
    },
    favorites: {
      ids: uniqueStrings(readJson<string[]>(STORAGE_KEYS.favoriteDrills, [])),
      updatedAt: getUpdatedAt(UPDATED_AT_KEYS.favoriteDrills),
    },
    preferences: {
      data: {
        speedMultiplier: isSpeedMultiplier(settings.speedMultiplier)
          ? settings.speedMultiplier
          : DEFAULT_PREFERENCES.speedMultiplier,
        mode: settings.mode === "practice" ? "practice" : "timed",
        drumVolume: clampDrumVolume(settings.drumVolume),
        autoAdvance: safeStorageGet(STORAGE_KEYS.autoAdvance) === "true",
      },
      updatedAt:
        compareUpdatedAt(
          getUpdatedAt(UPDATED_AT_KEYS.practiceSettings),
          getUpdatedAt(UPDATED_AT_KEYS.autoAdvance),
        ) >= 0
          ? getUpdatedAt(UPDATED_AT_KEYS.practiceSettings)
          : getUpdatedAt(UPDATED_AT_KEYS.autoAdvance),
    },
  };
}

function sanitizeSessions(items: PracticeSessionRecord[]) {
  return items
    .filter((item) => item && typeof item.id === "string" && typeof item.timestamp === "string")
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
    .slice(0, 80);
}

function parseRemoteDocument(data: Record<string, unknown> | undefined): CloudDocument | null {
  if (!data) return null;

  const progressRaw = (data.progress ?? {}) as Record<string, unknown>;
  const achievementsRaw = (data.achievements ?? {}) as Record<string, unknown>;
  const sessionsRaw = (data.sessions ?? {}) as Record<string, unknown>;
  const favoritesRaw = (data.favorites ?? {}) as Record<string, unknown>;
  const preferencesRaw = (data.preferences ?? {}) as Record<string, unknown>;
  const preferencesDataRaw = (preferencesRaw.data ?? {}) as Record<string, unknown>;

  return {
    version: 1,
    syncedAt: typeof data.syncedAt === "string" ? data.syncedAt : new Date().toISOString(),
    legacyAnonymousId:
      typeof data.legacyAnonymousId === "string" ? data.legacyAnonymousId : "",
    progress: {
      completed: uniqueStrings(Array.isArray(progressRaw.completed) ? (progressRaw.completed as string[]) : []),
      stars: parseStarRecord(progressRaw.stars),
      updatedAt: toIsoOrNull(progressRaw.updatedAt),
    },
    achievements: {
      unlocked: uniqueStrings(
        Array.isArray(achievementsRaw.unlocked) ? (achievementsRaw.unlocked as string[]) : [],
      ),
      updatedAt: toIsoOrNull(achievementsRaw.updatedAt),
    },
    sessions: {
      items: sanitizeSessions(
        Array.isArray(sessionsRaw.items) ? (sessionsRaw.items as PracticeSessionRecord[]) : [],
      ),
      updatedAt: toIsoOrNull(sessionsRaw.updatedAt),
    },
    favorites: {
      ids: uniqueStrings(
        Array.isArray(favoritesRaw.ids) ? (favoritesRaw.ids as string[]) : [],
      ),
      updatedAt: toIsoOrNull(favoritesRaw.updatedAt),
    },
    preferences: {
      data: {
        speedMultiplier: isSpeedMultiplier(preferencesDataRaw.speedMultiplier)
          ? preferencesDataRaw.speedMultiplier
          : DEFAULT_PREFERENCES.speedMultiplier,
        mode: preferencesDataRaw.mode === "practice" ? "practice" : "timed",
        drumVolume: clampDrumVolume(preferencesDataRaw.drumVolume),
        autoAdvance: preferencesDataRaw.autoAdvance === true,
      },
      updatedAt: toIsoOrNull(preferencesRaw.updatedAt),
    },
  };
}

function mergeStars(
  localStars: Record<string, 0 | 1 | 2 | 3>,
  remoteStars: Record<string, 0 | 1 | 2 | 3>,
) {
  const merged: Record<string, 0 | 1 | 2 | 3> = { ...localStars };
  for (const [levelId, stars] of Object.entries(remoteStars)) {
    const current = merged[levelId] ?? 0;
    merged[levelId] = (stars > current ? stars : current) as 0 | 1 | 2 | 3;
  }
  return merged;
}

function mergeSessions(localItems: PracticeSessionRecord[], remoteItems: PracticeSessionRecord[]) {
  const byId = new Map<string, PracticeSessionRecord>();
  for (const item of [...localItems, ...remoteItems]) {
    const current = byId.get(item.id);
    if (!current || new Date(item.timestamp).getTime() > new Date(current.timestamp).getTime()) {
      byId.set(item.id, item);
    }
  }
  return sanitizeSessions([...byId.values()]);
}

function mergeBundle(local: LocalBundle, remote: CloudDocument | null): CloudDocument {
  if (!remote) {
    return {
      version: 1,
      syncedAt: "",
      ...local,
    };
  }

  const useLocalPreferences =
    compareUpdatedAt(local.preferences.updatedAt, remote.preferences.updatedAt) >= 0;

  return {
    version: 1,
    syncedAt: remote.syncedAt,
    legacyAnonymousId: local.legacyAnonymousId || remote.legacyAnonymousId,
    progress: {
      completed: uniqueStrings([...local.progress.completed, ...remote.progress.completed]),
      stars: mergeStars(local.progress.stars, remote.progress.stars),
      updatedAt:
        compareUpdatedAt(local.progress.updatedAt, remote.progress.updatedAt) >= 0
          ? local.progress.updatedAt
          : remote.progress.updatedAt,
    },
    achievements: {
      unlocked: uniqueStrings([...local.achievements.unlocked, ...remote.achievements.unlocked]),
      updatedAt:
        compareUpdatedAt(local.achievements.updatedAt, remote.achievements.updatedAt) >= 0
          ? local.achievements.updatedAt
          : remote.achievements.updatedAt,
    },
    sessions: {
      items: mergeSessions(local.sessions.items, remote.sessions.items),
      updatedAt:
        compareUpdatedAt(local.sessions.updatedAt, remote.sessions.updatedAt) >= 0
          ? local.sessions.updatedAt
          : remote.sessions.updatedAt,
    },
    favorites: {
      ids: uniqueStrings([...local.favorites.ids, ...remote.favorites.ids]),
      updatedAt:
        compareUpdatedAt(local.favorites.updatedAt, remote.favorites.updatedAt) >= 0
          ? local.favorites.updatedAt
          : remote.favorites.updatedAt,
    },
    preferences: {
      data: useLocalPreferences ? local.preferences.data : remote.preferences.data,
      updatedAt: useLocalPreferences
        ? local.preferences.updatedAt
        : remote.preferences.updatedAt,
    },
  };
}

function applyBundleToLocal(bundle: CloudDocument) {
  safeStorageSet(STORAGE_KEYS.progress, JSON.stringify(bundle.progress.completed));
  setUpdatedAt(UPDATED_AT_KEYS.progress, bundle.progress.updatedAt ?? new Date().toISOString());
  dispatchStorageEvent(STORAGE_EVENTS.progress);

  safeStorageSet(STORAGE_KEYS.stars, JSON.stringify(bundle.progress.stars));
  dispatchStorageEvent(STORAGE_EVENTS.progress);

  safeStorageSet(STORAGE_KEYS.achievements, JSON.stringify(bundle.achievements.unlocked));
  setUpdatedAt(
    UPDATED_AT_KEYS.achievements,
    bundle.achievements.updatedAt ?? new Date().toISOString(),
  );
  dispatchStorageEvent(STORAGE_EVENTS.achievements);

  safeStorageSet(STORAGE_KEYS.sessionHistory, JSON.stringify(bundle.sessions.items));
  setUpdatedAt(UPDATED_AT_KEYS.sessionHistory, bundle.sessions.updatedAt ?? new Date().toISOString());
  dispatchStorageEvent(STORAGE_EVENTS.sessionHistory);

  safeStorageSet(STORAGE_KEYS.favoriteDrills, JSON.stringify(bundle.favorites.ids));
  setUpdatedAt(
    UPDATED_AT_KEYS.favoriteDrills,
    bundle.favorites.updatedAt ?? new Date().toISOString(),
  );
  dispatchStorageEvent(STORAGE_EVENTS.favoriteDrills);

  const currentSettings = readJson<PracticeSettings>(STORAGE_KEYS.practiceSettings, {
    speedMultiplier: 1,
    mode: "timed",
    drumVolume: 0.7,
    timingOffsetMs: 0,
  });
  const mergedSettings: PracticeSettings = {
    ...currentSettings,
    speedMultiplier: bundle.preferences.data.speedMultiplier,
    mode: bundle.preferences.data.mode,
    drumVolume: bundle.preferences.data.drumVolume,
  };
  safeStorageSet(STORAGE_KEYS.practiceSettings, JSON.stringify(mergedSettings));
  setUpdatedAt(
    UPDATED_AT_KEYS.practiceSettings,
    bundle.preferences.updatedAt ?? new Date().toISOString(),
  );
  dispatchStorageEvent(STORAGE_EVENTS.practiceSettings);

  safeStorageSet(STORAGE_KEYS.autoAdvance, String(bundle.preferences.data.autoAdvance));
  setUpdatedAt(
    UPDATED_AT_KEYS.autoAdvance,
    bundle.preferences.updatedAt ?? new Date().toISOString(),
  );
  dispatchStorageEvent(STORAGE_EVENTS.autoAdvance);
}

function bundleFingerprint(bundle: CloudDocument) {
  const { syncedAt, ...stableBundle } = bundle;
  void syncedAt;
  return JSON.stringify(stableBundle);
}

function normalizeError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong while talking to Firebase.";
}

export function CloudProvider({ children }: { children: React.ReactNode }) {
  const enabled = isFirebaseConfigured();
  const [ready, setReady] = useState(!enabled);
  const [user, setUser] = useState<User | null>(null);
  const [syncStatus, setSyncStatus] = useState<CloudContextValue["syncStatus"]>(
    enabled ? "idle" : "disabled",
  );
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const remoteRef = useRef<CloudDocument | null>(null);
  const uploadTimeoutRef = useRef<number | null>(null);
  const remoteReadyRef = useRef(false);
  const applyingRemoteRef = useRef(false);
  const lastUploadedFingerprintRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const auth = getFirebaseAuth();
    if (!auth) return;

    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setReady(true);
      setSyncError(null);

      if (!nextUser) {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          setSyncStatus("error");
          setSyncError(normalizeError(error));
        }
        return;
      }

      setSyncStatus(nextUser.isAnonymous ? "idle" : "syncing");
    });
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !user || user.isAnonymous) {
      remoteRef.current = null;
      remoteReadyRef.current = false;
      if (user?.isAnonymous) {
        setLastSyncedAt(null);
        setSyncStatus("idle");
      }
      return;
    }

    const db = getFirebaseDb();
    if (!db) return;

    setSyncStatus("syncing");
    setSyncError(null);

    return onSnapshot(
      doc(db, "users", user.uid),
      async (snapshot) => {
        try {
          const remote = parseRemoteDocument(snapshot.data() as Record<string, unknown> | undefined);
          remoteRef.current = remote;
          remoteReadyRef.current = true;

          const merged = mergeBundle(readLocalBundle(), remote);
          const fingerprint = bundleFingerprint(merged);
          const remoteFingerprint = remote ? bundleFingerprint(remote) : null;

          applyingRemoteRef.current = true;
          applyBundleToLocal(merged);
          applyingRemoteRef.current = false;

          if (fingerprint !== remoteFingerprint) {
            const payload = { ...merged, syncedAt: new Date().toISOString() };
            await setDoc(doc(db, "users", user.uid), payload, { merge: true });
            remoteRef.current = payload;
            lastUploadedFingerprintRef.current = fingerprint;
            setLastSyncedAt(payload.syncedAt);
          } else {
            lastUploadedFingerprintRef.current = fingerprint;
            setLastSyncedAt(remote?.syncedAt ?? null);
          }
          setSyncStatus("idle");
        } catch (error) {
          applyingRemoteRef.current = false;
          setSyncStatus("error");
          setSyncError(normalizeError(error));
        }
      },
      (error) => {
        setSyncStatus("error");
        setSyncError(normalizeError(error));
      },
    );
  }, [enabled, user]);

  useEffect(() => {
    if (!enabled || !user || user.isAnonymous) return;

    const db = getFirebaseDb();
    if (!db) return;

    const scheduleUpload = () => {
      if (!remoteReadyRef.current || applyingRemoteRef.current) return;

      if (uploadTimeoutRef.current) window.clearTimeout(uploadTimeoutRef.current);
      uploadTimeoutRef.current = window.setTimeout(async () => {
        try {
          setSyncStatus("syncing");
          const merged = mergeBundle(readLocalBundle(), remoteRef.current);
          const fingerprint = bundleFingerprint(merged);
          if (fingerprint === lastUploadedFingerprintRef.current) {
            setSyncStatus("idle");
            return;
          }

          const payload = { ...merged, syncedAt: new Date().toISOString() };
          await setDoc(doc(db, "users", user.uid), payload, { merge: true });
          remoteRef.current = payload;
          lastUploadedFingerprintRef.current = fingerprint;
          setLastSyncedAt(payload.syncedAt);
          setSyncStatus("idle");
        } catch (error) {
          setSyncStatus("error");
          setSyncError(normalizeError(error));
        }
      }, 500);
    };

    const events = [
      STORAGE_EVENTS.progress,
      STORAGE_EVENTS.achievements,
      STORAGE_EVENTS.sessionHistory,
      STORAGE_EVENTS.favoriteDrills,
      STORAGE_EVENTS.practiceSettings,
      STORAGE_EVENTS.autoAdvance,
    ] as const;

    const handleStorage = () => scheduleUpload();

    window.addEventListener("storage", handleStorage);
    for (const eventName of events) {
      window.addEventListener(eventName, handleStorage);
    }

    return () => {
      if (uploadTimeoutRef.current) window.clearTimeout(uploadTimeoutRef.current);
      window.removeEventListener("storage", handleStorage);
      for (const eventName of events) {
        window.removeEventListener(eventName, handleStorage);
      }
    };
  }, [enabled, user]);

  const value = useMemo<CloudContextValue>(() => {
    const auth = getFirebaseAuth();

    return {
      enabled,
      ready,
      user,
      syncStatus,
      syncError,
      lastSyncedAt,
      signInWithGoogle: async () => {
        if (!enabled || !auth) return;

        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
          setSyncError(null);
          if (auth.currentUser?.isAnonymous) {
            try {
              await linkWithPopup(auth.currentUser, provider);
            } catch (error) {
              const code =
                typeof error === "object" && error && "code" in error
                  ? String((error as { code?: unknown }).code)
                  : "";
              if (code === "auth/credential-already-in-use") {
                await signInWithPopup(auth, provider);
              } else {
                throw error;
              }
            }
          } else {
            await signInWithPopup(auth, provider);
          }
        } catch (error) {
          const message = normalizeError(error);
          setSyncStatus("error");
          setSyncError(message);
          throw error;
        }
      },
      signOut: async () => {
        if (!enabled || !auth) return;
        await firebaseSignOut(auth);
      },
      resetData: async () => {
        // Block uploads immediately so the scheduler can't re-upload old remote data
        remoteRef.current = null;
        remoteReadyRef.current = false;
        lastUploadedFingerprintRef.current = null;
        if (uploadTimeoutRef.current) {
          window.clearTimeout(uploadTimeoutRef.current);
          uploadTimeoutRef.current = null;
        }

        // Clear all local storage keys
        for (const key of Object.values(STORAGE_KEYS)) {
          safeStorageRemove(key);
        }
        for (const key of Object.values(UPDATED_AT_KEYS)) {
          safeStorageRemove(key);
        }

        // Clear Firestore document if signed in
        if (enabled && user && !user.isAnonymous) {
          const db = getFirebaseDb();
          if (db) {
            await deleteDoc(doc(db, "users", user.uid));
          }
        }

        // Dispatch events last so UI re-renders with already-empty storage
        for (const event of Object.values(STORAGE_EVENTS)) {
          dispatchStorageEvent(event);
        }

        setLastSyncedAt(null);
        setSyncStatus(enabled ? "idle" : "disabled");
        setSyncError(null);
      },
      resetProgressOnly: async () => {
        // Block the upload scheduler immediately — prevents it from re-uploading
        // stale remote data while the async Firestore write is in flight.
        if (uploadTimeoutRef.current) {
          window.clearTimeout(uploadTimeoutRef.current);
          uploadTimeoutRef.current = null;
        }
        remoteReadyRef.current = false;

        // Give the remote snapshot an empty progress with a *current* timestamp so
        // that any merge that happens afterward picks empty over any cached remote.
        const emptyProgress = { completed: [], stars: {}, updatedAt: new Date().toISOString() };
        if (remoteRef.current) {
          remoteRef.current = { ...remoteRef.current, progress: emptyProgress };
        }

        // Clear localStorage progress + stars
        safeStorageRemove(STORAGE_KEYS.progress);
        safeStorageRemove(STORAGE_KEYS.stars);
        safeStorageRemove(UPDATED_AT_KEYS.progress);

        // Persist the empty progress to Firestore if signed in.
        // After setDoc, onSnapshot fires and sets remoteReadyRef back to true.
        if (enabled && user && !user.isAnonymous) {
          const db = getFirebaseDb();
          if (db) {
            await setDoc(
              doc(db, "users", user.uid),
              { progress: { completed: [], stars: {}, updatedAt: emptyProgress.updatedAt } },
              { merge: true },
            );
          }
        } else {
          // Not signed in — no onSnapshot will fire, so re-enable manually.
          remoteReadyRef.current = true;
        }

        dispatchStorageEvent(STORAGE_EVENTS.progress);
      },
    };
  }, [enabled, lastSyncedAt, ready, syncError, syncStatus, user]);

  return <CloudContext.Provider value={value}>{children}</CloudContext.Provider>;
}

export function useCloud() {
  return useContext(CloudContext);
}
