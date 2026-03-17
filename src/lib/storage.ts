"use client";

export const STORAGE_KEYS = {
  anonymousId: "gha-anon-id",
  progress: "gha-v1-progress",
  stars: "gha-v1-stars",
  achievements: "gha-v1-achievements",
  sessionHistory: "gha-v1-session-history",
  setupProgress: "gha-v1-setup-progress",
  practiceSettings: "gha-v1-practice-settings",
  autoAdvance: "gha-v1-auto-advance",
} as const;

export const STORAGE_EVENTS = {
  progress: "gha:progress",
  achievements: "gha:achievements",
  sessionHistory: "gha:session-history",
  setupProgress: "gha:setup-progress",
  practiceSettings: "gha:practice-settings",
  autoAdvance: "gha:auto-advance",
} as const;

export const UPDATED_AT_KEYS = {
  progress: "gha-v1-progress-updated-at",
  achievements: "gha-v1-achievements-updated-at",
  sessionHistory: "gha-v1-session-history-updated-at",
  practiceSettings: "gha-v1-practice-settings-updated-at",
  autoAdvance: "gha-v1-auto-advance-updated-at",
} as const;

export function safeStorageGet(key: string) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeStorageSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

export function safeStorageRemove(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {}
}

export function readJson<T>(key: string, fallback: T): T {
  const raw = safeStorageGet(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function dispatchStorageEvent(eventName: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(eventName));
}

export function subscribeToStorage(eventName: string, onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(eventName, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(eventName, handler);
  };
}

export function getUpdatedAt(key: string) {
  return safeStorageGet(key);
}

export function setUpdatedAt(key: string, value = new Date().toISOString()) {
  safeStorageSet(key, value);
  return value;
}

export function touchUpdatedAt(key: string) {
  return setUpdatedAt(key);
}
