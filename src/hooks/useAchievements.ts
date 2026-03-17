"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import {
  STORAGE_EVENTS,
  STORAGE_KEYS,
  UPDATED_AT_KEYS,
  dispatchStorageEvent,
  readJson,
  safeStorageSet,
  subscribeToStorage,
  touchUpdatedAt,
} from "@/lib/storage";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first-note", title: "First Note", icon: "ðŸŽµ", description: "Hit your very first note." },
  { id: "first-level", title: "Level Complete", icon: "âœ…", description: "Finish any level." },
  { id: "hat-trick", title: "Hat Trick", icon: "â­", description: "Earn 3 stars on any level." },
  { id: "perfect", title: "Perfect Run", icon: "ðŸ’Ž", description: "Hit 100% of notes in one level." },
  { id: "on-a-roll", title: "On a Roll", icon: "ðŸ”¥", description: "Hit 5 notes in a row." },
  { id: "unstoppable", title: "Unstoppable", icon: "âš¡", description: "Hit 10 notes in a row." },
  { id: "world1-done", title: "Foundations", icon: "ðŸ†", description: "Complete all 6 levels of World 1." },
  { id: "world2-done", title: "Scale Scholar", icon: "ðŸŽ“", description: "Complete all 6 levels of World 2." },
  { id: "world3-done", title: "Technique Lord", icon: "ðŸ‘‘", description: "Complete all 6 levels of World 3." },
  { id: "all-worlds", title: "Guitar Hero", icon: "ðŸŒŸ", description: "Complete all 18 levels across all 3 worlds." },
  { id: "daily-done", title: "Daily Grind", icon: "ðŸ“…", description: "Complete a daily challenge." },
  { id: "daily-perfect", title: "Daily Legend", icon: "ðŸ…", description: "Get 3 stars on a daily challenge." },
];

const EMPTY_UNLOCKED: string[] = [];
let cachedAchievementsRaw = "";
let cachedAchievementsSnapshot: string[] = EMPTY_UNLOCKED;

function readAchievements() {
  const unlocked = readJson<string[]>(STORAGE_KEYS.achievements, EMPTY_UNLOCKED);
  const rawKey = JSON.stringify(unlocked);
  if (rawKey === cachedAchievementsRaw) return cachedAchievementsSnapshot;
  cachedAchievementsRaw = rawKey;
  cachedAchievementsSnapshot = unlocked;
  return cachedAchievementsSnapshot;
}

export function useAchievements() {
  const unlocked = useSyncExternalStore(
    (onStoreChange) => subscribeToStorage(STORAGE_EVENTS.achievements, onStoreChange),
    readAchievements,
    () => EMPTY_UNLOCKED,
  );
  const [newest, setNewest] = useState<Achievement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unlock = useCallback((id: string) => {
    const current = readJson<string[]>(STORAGE_KEYS.achievements, []);
    if (current.includes(id)) return;

    safeStorageSet(STORAGE_KEYS.achievements, JSON.stringify([...current, id]));
    touchUpdatedAt(UPDATED_AT_KEYS.achievements);
    dispatchStorageEvent(STORAGE_EVENTS.achievements);

    const achievement = ALL_ACHIEVEMENTS.find((item) => item.id === id) ?? null;
    if (achievement) {
      setNewest(achievement);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setNewest(null), 3500);
    }
  }, []);

  const isUnlocked = useCallback((id: string) => unlocked.includes(id), [unlocked]);

  const dismissNewest = useCallback(() => {
    setNewest(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { unlocked, unlock, isUnlocked, newest, dismissNewest };
}
