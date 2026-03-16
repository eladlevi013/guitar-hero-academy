"use client";

import { useEffect, useState } from "react";

export type PracticeMode = "timed" | "practice";
export type SpeedMultiplier = 0.5 | 0.75 | 1 | 1.25 | 1.5;

const SETTINGS_KEY = "gha-v1-practice-settings";

interface PracticeSettings {
  speedMultiplier: SpeedMultiplier;
  mode: PracticeMode;
  drumVolume: number;
}

const DEFAULT_SETTINGS: PracticeSettings = {
  speedMultiplier: 1,
  mode: "timed",
  drumVolume: 0.7,
};

function clampVolume(volume: unknown) {
  if (typeof volume !== "number" || Number.isNaN(volume)) return DEFAULT_SETTINGS.drumVolume;
  return Math.min(1, Math.max(0, volume));
}

function isSpeedMultiplier(value: unknown): value is SpeedMultiplier {
  return value === 0.5 || value === 0.75 || value === 1 || value === 1.25 || value === 1.5;
}

function readSettings(): PracticeSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<PracticeSettings>;
    return {
      speedMultiplier: isSpeedMultiplier(parsed.speedMultiplier) ? parsed.speedMultiplier : DEFAULT_SETTINGS.speedMultiplier,
      mode: parsed.mode === "practice" ? "practice" : "timed",
      drumVolume: clampVolume(parsed.drumVolume),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function usePracticeSettings() {
  const [settings, setSettings] = useState<PracticeSettings>(readSettings);

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  return {
    settings,
    setSpeedMultiplier: (speedMultiplier: SpeedMultiplier) => setSettings(prev => ({ ...prev, speedMultiplier })),
    setMode: (mode: PracticeMode) => setSettings(prev => ({ ...prev, mode })),
    setDrumVolume: (drumVolume: number) => setSettings(prev => ({ ...prev, drumVolume: clampVolume(drumVolume) })),
  };
}
