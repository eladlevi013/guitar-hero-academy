"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ACHIEVEMENTS_KEY = "gha-v1-achievements";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first-note",    title: "First Note",      icon: "🎵", description: "Hit your very first note."                            },
  { id: "first-level",   title: "Level Complete",  icon: "✅", description: "Finish any level."                                   },
  { id: "hat-trick",     title: "Hat Trick",        icon: "⭐", description: "Earn 3 stars on any level."                         },
  { id: "perfect",       title: "Perfect Run",      icon: "💎", description: "Hit 100% of notes in one level."                    },
  { id: "on-a-roll",     title: "On a Roll",        icon: "🔥", description: "Hit 5 notes in a row."                              },
  { id: "unstoppable",   title: "Unstoppable",      icon: "⚡", description: "Hit 10 notes in a row."                             },
  { id: "world1-done",   title: "Foundations",      icon: "🏆", description: "Complete all 6 levels of World 1."                 },
  { id: "world2-done",   title: "Scale Scholar",    icon: "🎓", description: "Complete all 6 levels of World 2."                 },
  { id: "world3-done",   title: "Technique Lord",   icon: "👑", description: "Complete all 6 levels of World 3."                 },
  { id: "all-worlds",    title: "Guitar Hero",      icon: "🌟", description: "Complete all 18 levels across all 3 worlds."       },
  { id: "daily-done",    title: "Daily Grind",      icon: "📅", description: "Complete a daily challenge."                        },
  { id: "daily-perfect", title: "Daily Legend",     icon: "🏅", description: "Get 3 stars on a daily challenge."                 },
];

export function useAchievements() {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [newest, setNewest]     = useState<Achievement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (raw) setUnlocked(JSON.parse(raw));
    } catch {}
  }, []);

  const unlock = useCallback((id: string) => {
    setUnlocked(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try { localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(next)); } catch {}
      const achievement = ALL_ACHIEVEMENTS.find(a => a.id === id) ?? null;
      if (achievement) {
        setNewest(achievement);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setNewest(null), 3500);
      }
      return next;
    });
  }, []);

  const isUnlocked = useCallback((id: string) => unlocked.includes(id), [unlocked]);

  const dismissNewest = useCallback(() => {
    setNewest(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { unlocked, unlock, isUnlocked, newest, dismissNewest };
}
