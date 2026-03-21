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
  { id: "first-note", title: "First Note", icon: "Note", description: "Hit your very first note." },
  { id: "first-level", title: "Level Clear", icon: "Done", description: "Finish any level." },
  { id: "hat-trick", title: "Hat Trick", icon: "3*", description: "Earn 3 stars on any level." },
  { id: "perfect", title: "Perfect Run", icon: "100%", description: "Hit 100% of notes in one level." },
  { id: "accuracy-star", title: "Sharp Shooter", icon: "Aim", description: "Score 90%+ accuracy on any level." },
  { id: "on-a-roll", title: "On a Roll", icon: "Hot", description: "Hit 5 notes in a row." },
  { id: "unstoppable", title: "Unstoppable", icon: "Zap", description: "Hit 10 notes in a row." },
  { id: "flow-state", title: "Flow State", icon: "Flow", description: "Hit 20 notes in a row." },
  { id: "speed-demon", title: "Speed Demon", icon: "Fast", description: "Complete a level at 1.25x speed or faster." },
  { id: "world1-done", title: "Hook Finder", icon: "W1", description: "Complete all 8 levels of World 1." },
  { id: "world2-done", title: "Song Driver", icon: "W2", description: "Complete all 8 levels of World 2." },
  { id: "world3-done", title: "Stage Ready", icon: "W3", description: "Complete all 8 levels of World 3." },
  { id: "all-worlds", title: "Full Set", icon: "All", description: "Complete all 24 levels across the 3-world path." },
  { id: "world1-ace", title: "Picking Pro", icon: "A1", description: "Earn 3 stars on any World 1 level." },
  { id: "world2-ace", title: "Songline Star", icon: "A2", description: "Earn 3 stars on any World 2 level." },
  { id: "world3-ace", title: "Stage Spark", icon: "A3", description: "Earn 3 stars on any World 3 level." },
  { id: "daily-done", title: "Daily Grind", icon: "Day", description: "Complete a daily challenge." },
  { id: "daily-perfect", title: "Daily Legend", icon: "Win", description: "Get 3 stars on a daily challenge." },
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
