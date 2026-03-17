"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

const SESSION_HISTORY_KEY = "gha-v1-session-history";
const SESSION_HISTORY_EVENT = "gha:session-history";
const MAX_SESSIONS = 80;
const EMPTY_SESSIONS: PracticeSessionRecord[] = [];

export interface PracticeSessionRecord {
  id: string;
  timestamp: string;
  levelId: string;
  levelTitle: string;
  levelSubtitle?: string;
  segmentLabel?: string;
  worldNum: number;
  levelNum: number;
  mode: "timed" | "practice";
  speedMultiplier: number;
  bpm: number;
  score: number;
  stars: 0 | 1 | 2 | 3;
  hits: number;
  total: number;
  misses: number;
  maxCombo: number;
  topMissedNotes: string[];
  focusArea: string;
}

let cachedHistoryRaw: string | null | undefined;
let cachedHistory: PracticeSessionRecord[] = EMPTY_SESSIONS;

function readSessionHistory(): PracticeSessionRecord[] {
  if (typeof window === "undefined") return EMPTY_SESSIONS;

  try {
    const raw = window.localStorage.getItem(SESSION_HISTORY_KEY);
    if (raw === cachedHistoryRaw) return cachedHistory;
    if (!raw) {
      cachedHistoryRaw = raw;
      cachedHistory = EMPTY_SESSIONS;
      return cachedHistory;
    }
    const parsed = JSON.parse(raw);
    cachedHistoryRaw = raw;
    cachedHistory = Array.isArray(parsed) ? (parsed as PracticeSessionRecord[]) : EMPTY_SESSIONS;
    return cachedHistory;
  } catch {
    cachedHistoryRaw = null;
    cachedHistory = EMPTY_SESSIONS;
    return cachedHistory;
  }
}

function writeSessionHistory(sessions: PracticeSessionRecord[]) {
  if (typeof window === "undefined") return;

  try {
    const raw = JSON.stringify(sessions);
    cachedHistoryRaw = raw;
    cachedHistory = sessions;
    window.localStorage.setItem(SESSION_HISTORY_KEY, raw);
    window.dispatchEvent(new Event(SESSION_HISTORY_EVENT));
  } catch {}
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(SESSION_HISTORY_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(SESSION_HISTORY_EVENT, handler);
  };
}

function getDayKey(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
}

export function useSessionHistory() {
  const sessions = useSyncExternalStore(subscribe, readSessionHistory, () => EMPTY_SESSIONS);
  const [capturedNow] = useState(() => Date.now());

  const addSession = useCallback((session: Omit<PracticeSessionRecord, "id" | "timestamp">) => {
    const next: PracticeSessionRecord[] = [
      {
        ...session,
        id: `${session.levelId}-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
      ...readSessionHistory(),
    ].slice(0, MAX_SESSIONS);

    writeSessionHistory(next);
  }, []);

  const summary = useMemo(() => {
    const timedSessions = sessions.filter((session) => session.mode === "timed");
    const recent7 = sessions.filter((session) => {
      const elapsed = capturedNow - new Date(session.timestamp).getTime();
      return elapsed <= 7 * 24 * 60 * 60 * 1000;
    });

    const avgAccuracy = timedSessions.length
      ? Math.round(timedSessions.reduce((sum, session) => sum + session.score, 0) / timedSessions.length)
      : 0;

    const practiceMinutes = Math.round(
      sessions.reduce((sum, session) => sum + (session.total * (60000 / Math.max(session.bpm, 1))) / 60000, 0),
    );

    const streakDays = (() => {
      if (!sessions.length) return 0;
      const uniqueDays = Array.from(new Set(sessions.map((session) => getDayKey(new Date(session.timestamp))))).sort().reverse();
      let streak = 0;
      const cursor = new Date();
      cursor.setHours(0, 0, 0, 0);
      for (const day of uniqueDays) {
        if (day !== cursor.toISOString()) break;
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      }
      return streak;
    })();

    const recommendedFocus = (() => {
      if (!recent7.length) return "Start with a clean scale run to build momentum.";
      const focusCounts = new Map<string, number>();
      for (const session of recent7) {
        focusCounts.set(session.focusArea, (focusCounts.get(session.focusArea) ?? 0) + 1);
      }
      const [focus] = [...focusCounts.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
      return focus ?? "Keep building consistency across the whole routine.";
    })();

    return {
      totalSessions: sessions.length,
      recent7Count: recent7.length,
      avgAccuracy,
      practiceMinutes,
      streakDays,
      recommendedFocus,
    };
  }, [sessions, capturedNow]);

  return {
    sessions,
    addSession,
    summary,
    reset: () => writeSessionHistory([]),
  };
}
