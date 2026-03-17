"use client";

import { useSyncExternalStore } from "react";
import { UPDATED_AT_KEYS, touchUpdatedAt } from "@/lib/storage";

export type PracticeMode = "timed" | "practice";
export type SpeedMultiplier = 0.5 | 0.75 | 1 | 1.25 | 1.5;

const SETTINGS_KEY = "gha-v1-practice-settings";
const SETTINGS_EVENT = "gha:practice-settings";

export interface PracticeSettings {
  speedMultiplier: SpeedMultiplier;
  mode: PracticeMode;
  drumVolume: number;
  timingOffsetMs: number;
}

export const DEFAULT_SETTINGS: PracticeSettings = {
  speedMultiplier: 1,
  mode: "timed",
  drumVolume: 0.7,
  timingOffsetMs: 0,
};

let cachedSettingsRaw: string | null | undefined;
let cachedSettings: PracticeSettings = DEFAULT_SETTINGS;

function clampVolume(volume: unknown) {
  if (typeof volume !== "number" || Number.isNaN(volume)) return DEFAULT_SETTINGS.drumVolume;
  return Math.min(1, Math.max(0, volume));
}

function isSpeedMultiplier(value: unknown): value is SpeedMultiplier {
  return value === 0.5 || value === 0.75 || value === 1 || value === 1.25 || value === 1.5;
}

function clampTimingOffset(offset: unknown) {
  if (typeof offset !== "number" || Number.isNaN(offset)) return DEFAULT_SETTINGS.timingOffsetMs;
  return Math.min(180, Math.max(-180, Math.round(offset)));
}

function readSettings(): PracticeSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (raw === cachedSettingsRaw) return cachedSettings;
    if (!raw) {
      cachedSettingsRaw = raw;
      cachedSettings = DEFAULT_SETTINGS;
      return cachedSettings;
    }
    const parsed = JSON.parse(raw) as Partial<PracticeSettings>;
    cachedSettingsRaw = raw;
    cachedSettings = {
      speedMultiplier: isSpeedMultiplier(parsed.speedMultiplier) ? parsed.speedMultiplier : DEFAULT_SETTINGS.speedMultiplier,
      mode: parsed.mode === "practice" ? "practice" : "timed",
      drumVolume: clampVolume(parsed.drumVolume),
      timingOffsetMs: clampTimingOffset(parsed.timingOffsetMs),
    };
    return cachedSettings;
  } catch {
    cachedSettingsRaw = null;
    cachedSettings = DEFAULT_SETTINGS;
    return cachedSettings;
  }
}

function writeSettings(settings: PracticeSettings) {
  if (typeof window === "undefined") return;

  try {
    const raw = JSON.stringify(settings);
    cachedSettingsRaw = raw;
    cachedSettings = settings;
    window.localStorage.setItem(SETTINGS_KEY, raw);
    touchUpdatedAt(UPDATED_AT_KEYS.practiceSettings);
    window.dispatchEvent(new Event(SETTINGS_EVENT));
  } catch {}
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(SETTINGS_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(SETTINGS_EVENT, handler);
  };
}

export function usePracticeSettings() {
  const settings = useSyncExternalStore(subscribe, readSettings, () => DEFAULT_SETTINGS);

  return {
    settings,
    setSpeedMultiplier: (speedMultiplier: SpeedMultiplier) => writeSettings({ ...settings, speedMultiplier }),
    setMode: (mode: PracticeMode) => writeSettings({ ...settings, mode }),
    setDrumVolume: (drumVolume: number) => writeSettings({ ...settings, drumVolume: clampVolume(drumVolume) }),
    setTimingOffsetMs: (timingOffsetMs: number) => writeSettings({ ...settings, timingOffsetMs: clampTimingOffset(timingOffsetMs) }),
    reset: () => writeSettings(DEFAULT_SETTINGS),
  };
}
