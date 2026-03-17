"use client";

import { useSyncExternalStore } from "react";
import {
  STORAGE_EVENTS,
  STORAGE_KEYS,
  UPDATED_AT_KEYS,
  dispatchStorageEvent,
  safeStorageGet,
  safeStorageRemove,
  safeStorageSet,
  subscribeToStorage,
  touchUpdatedAt,
} from "@/lib/storage";

function readAutoAdvance() {
  return safeStorageGet(STORAGE_KEYS.autoAdvance) === "true";
}

function writeAutoAdvance(value: boolean) {
  safeStorageSet(STORAGE_KEYS.autoAdvance, String(value));
  touchUpdatedAt(UPDATED_AT_KEYS.autoAdvance);
  dispatchStorageEvent(STORAGE_EVENTS.autoAdvance);
}

export function useAutoAdvance() {
  const autoAdvance = useSyncExternalStore(
    (onStoreChange) => subscribeToStorage(STORAGE_EVENTS.autoAdvance, onStoreChange),
    readAutoAdvance,
    () => false,
  );

  return {
    autoAdvance,
    setAutoAdvance: writeAutoAdvance,
    reset: () => {
      safeStorageRemove(STORAGE_KEYS.autoAdvance);
      touchUpdatedAt(UPDATED_AT_KEYS.autoAdvance);
      dispatchStorageEvent(STORAGE_EVENTS.autoAdvance);
    },
  };
}
