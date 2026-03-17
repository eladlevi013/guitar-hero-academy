"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  STORAGE_EVENTS,
  STORAGE_KEYS,
  UPDATED_AT_KEYS,
  dispatchStorageEvent,
  readJson,
  safeStorageRemove,
  safeStorageSet,
  subscribeToStorage,
  touchUpdatedAt,
} from "@/lib/storage";

type StarCount = 0 | 1 | 2 | 3;

type ProgressSnapshot = {
  completed: string[];
  bestStars: Record<string, StarCount>;
};

const EMPTY_PROGRESS: ProgressSnapshot = {
  completed: [],
  bestStars: {},
};

let cachedProgressRaw = "";
let cachedProgressSnapshot: ProgressSnapshot = EMPTY_PROGRESS;

function readProgress(): ProgressSnapshot {
  const completedRaw = readJson<string[]>(STORAGE_KEYS.progress, []);
  const starsRaw = readJson<Record<string, StarCount>>(STORAGE_KEYS.stars, {});
  const rawKey = JSON.stringify([completedRaw, starsRaw]);

  if (rawKey === cachedProgressRaw) return cachedProgressSnapshot;

  cachedProgressRaw = rawKey;
  cachedProgressSnapshot = {
    completed: completedRaw,
    bestStars: starsRaw,
  };
  return cachedProgressSnapshot;
}

function writeProgress(progress: ProgressSnapshot) {
  safeStorageSet(STORAGE_KEYS.progress, JSON.stringify(progress.completed));
  safeStorageSet(STORAGE_KEYS.stars, JSON.stringify(progress.bestStars));
  touchUpdatedAt(UPDATED_AT_KEYS.progress);
  dispatchStorageEvent(STORAGE_EVENTS.progress);
}

export function useProgress() {
  const { completed, bestStars } = useSyncExternalStore(
    (onStoreChange) => subscribeToStorage(STORAGE_EVENTS.progress, onStoreChange),
    readProgress,
    () => EMPTY_PROGRESS,
  );

  /** Mark a level complete and persist its best star rating. */
  const markComplete = useCallback((levelId: string, stars: StarCount = 1) => {
    const current = readProgress();
    const nextCompleted = current.completed.includes(levelId)
      ? current.completed
      : [...current.completed, levelId];
    const existingStars = current.bestStars[levelId] ?? 0;
    const nextStars =
      stars > existingStars
        ? { ...current.bestStars, [levelId]: stars }
        : current.bestStars;

    if (nextCompleted === current.completed && nextStars === current.bestStars) return;

    writeProgress({
      completed: nextCompleted,
      bestStars: nextStars,
    });
  }, []);

  const isCompleted = useCallback(
    (levelId: string) => completed.includes(levelId),
    [completed],
  );

  const getBestStars = useCallback(
    (levelId: string): StarCount => (bestStars[levelId] ?? 0) as StarCount,
    [bestStars],
  );

  const isUnlocked = useCallback(
    (levelIndex: number, levelIds: string[]) =>
      levelIndex === 0 || completed.includes(levelIds[levelIndex - 1]),
    [completed],
  );

  const reset = useCallback(() => {
    safeStorageRemove(STORAGE_KEYS.progress);
    safeStorageRemove(STORAGE_KEYS.stars);
    cachedProgressRaw = "";
    cachedProgressSnapshot = EMPTY_PROGRESS;
    touchUpdatedAt(UPDATED_AT_KEYS.progress);
    dispatchStorageEvent(STORAGE_EVENTS.progress);
  }, []);

  return { completed, markComplete, isCompleted, getBestStars, isUnlocked, reset };
}
