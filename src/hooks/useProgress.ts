"use client";

import { useCallback, useEffect, useState } from "react";

const COMPLETED_KEY = "gha-v1-progress";
const STARS_KEY     = "gha-v1-stars";

type StarCount = 0 | 1 | 2 | 3;

export function useProgress() {
  const [completed,  setCompleted]  = useState<string[]>([]);
  const [bestStars,  setBestStars]  = useState<Record<string, StarCount>>({});

  // Load both stores from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      if (raw) setCompleted(JSON.parse(raw));
    } catch {}
    try {
      const raw = localStorage.getItem(STARS_KEY);
      if (raw) setBestStars(JSON.parse(raw));
    } catch {}
  }, []);

  /** Mark a level complete and persist its best star rating. */
  const markComplete = useCallback((levelId: string, stars: StarCount = 1) => {
    // Persist completion
    setCompleted((prev) => {
      if (prev.includes(levelId)) return prev;
      const next = [...prev, levelId];
      try { localStorage.setItem(COMPLETED_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    // Persist stars — only update if the new score is better
    setBestStars((prev) => {
      const current = (prev[levelId] ?? 0) as StarCount;
      if (stars <= current) return prev;
      const next = { ...prev, [levelId]: stars };
      try { localStorage.setItem(STARS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const isCompleted = useCallback(
    (levelId: string) => completed.includes(levelId),
    [completed]
  );

  /** Returns the best star count (0–3) ever achieved for a level. */
  const getBestStars = useCallback(
    (levelId: string): StarCount => (bestStars[levelId] ?? 0) as StarCount,
    [bestStars]
  );

  // Level at index i is unlocked if i === 0 OR if level[i-1] is completed
  const isUnlocked = useCallback(
    (levelIndex: number, levelIds: string[]) =>
      levelIndex === 0 || completed.includes(levelIds[levelIndex - 1]),
    [completed]
  );

  const reset = useCallback(() => {
    setCompleted([]);
    setBestStars({});
    try {
      localStorage.removeItem(COMPLETED_KEY);
      localStorage.removeItem(STARS_KEY);
    } catch {}
  }, []);

  return { completed, markComplete, isCompleted, getBestStars, isUnlocked, reset };
}
