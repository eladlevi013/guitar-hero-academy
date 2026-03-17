"use client";

import { useMemo, useSyncExternalStore } from "react";

const SETUP_KEY = "gha-v1-setup-progress";
const SETUP_EVENT = "gha:setup-progress";

export interface SetupProgress {
  micChecked: boolean;
  tunerChecked: boolean;
  audioChecked: boolean;
  completedAt: string | null;
}

const DEFAULT_PROGRESS: SetupProgress = {
  micChecked: false,
  tunerChecked: false,
  audioChecked: false,
  completedAt: null,
};

let cachedSetupRaw: string | null | undefined;
let cachedSetup: SetupProgress = DEFAULT_PROGRESS;

function readSetupProgress(): SetupProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const raw = window.localStorage.getItem(SETUP_KEY);
    if (raw === cachedSetupRaw) return cachedSetup;
    if (!raw) {
      cachedSetupRaw = raw;
      cachedSetup = DEFAULT_PROGRESS;
      return cachedSetup;
    }
    const parsed = JSON.parse(raw) as Partial<SetupProgress>;
    cachedSetupRaw = raw;
    cachedSetup = {
      micChecked: parsed.micChecked === true,
      tunerChecked: parsed.tunerChecked === true,
      audioChecked: parsed.audioChecked === true,
      completedAt: typeof parsed.completedAt === "string" ? parsed.completedAt : null,
    };
    return cachedSetup;
  } catch {
    cachedSetupRaw = null;
    cachedSetup = DEFAULT_PROGRESS;
    return cachedSetup;
  }
}

function withCompletion(next: SetupProgress): SetupProgress {
  if (next.micChecked && next.tunerChecked && next.audioChecked && !next.completedAt) {
    return { ...next, completedAt: new Date().toISOString() };
  }
  if (!(next.micChecked && next.tunerChecked && next.audioChecked)) {
    return { ...next, completedAt: null };
  }
  return next;
}

function writeSetupProgress(progress: SetupProgress) {
  if (typeof window === "undefined") return;

  try {
    const raw = JSON.stringify(progress);
    cachedSetupRaw = raw;
    cachedSetup = progress;
    window.localStorage.setItem(SETUP_KEY, raw);
    window.dispatchEvent(new Event(SETUP_EVENT));
  } catch {}
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(SETUP_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(SETUP_EVENT, handler);
  };
}

export function useSetupProgress() {
  const progress = useSyncExternalStore(subscribe, readSetupProgress, () => DEFAULT_PROGRESS);

  const isReady = useMemo(
    () => progress.micChecked && progress.tunerChecked && progress.audioChecked,
    [progress],
  );

  return {
    progress,
    isReady,
    setMicChecked: (micChecked: boolean) => writeSetupProgress(withCompletion({ ...progress, micChecked })),
    setTunerChecked: (tunerChecked: boolean) => writeSetupProgress(withCompletion({ ...progress, tunerChecked })),
    setAudioChecked: (audioChecked: boolean) => writeSetupProgress(withCompletion({ ...progress, audioChecked })),
    reset: () => writeSetupProgress(DEFAULT_PROGRESS),
  };
}
