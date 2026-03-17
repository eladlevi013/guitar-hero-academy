"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  STORAGE_EVENTS,
  STORAGE_KEYS,
  UPDATED_AT_KEYS,
  dispatchStorageEvent,
  readJson,
  safeStorageRemove,
  safeStorageSet,
  subscribeToStorage,
  touchUpdatedAt,
} from "@/lib/storage";

const EMPTY_FAVORITES: string[] = [];

let cachedFavoritesRaw = "";
let cachedFavorites: string[] = EMPTY_FAVORITES;

function uniqueFavorites(ids: string[]) {
  return [...new Set(ids.filter(Boolean))];
}

function readFavorites() {
  const next = uniqueFavorites(readJson<string[]>(STORAGE_KEYS.favoriteDrills, []));
  const rawKey = JSON.stringify(next);

  if (rawKey === cachedFavoritesRaw) return cachedFavorites;

  cachedFavoritesRaw = rawKey;
  cachedFavorites = next;
  return cachedFavorites;
}

function writeFavorites(favorites: string[]) {
  const next = uniqueFavorites(favorites);
  safeStorageSet(STORAGE_KEYS.favoriteDrills, JSON.stringify(next));
  touchUpdatedAt(UPDATED_AT_KEYS.favoriteDrills);
  dispatchStorageEvent(STORAGE_EVENTS.favoriteDrills);
}

export function useFavoriteDrills() {
  const favorites = useSyncExternalStore(
    (onStoreChange) => subscribeToStorage(STORAGE_EVENTS.favoriteDrills, onStoreChange),
    readFavorites,
    () => EMPTY_FAVORITES,
  );

  const isFavorite = useCallback(
    (levelId: string) => favorites.includes(levelId),
    [favorites],
  );

  const toggleFavorite = useCallback((levelId: string) => {
    const current = readFavorites();
    if (current.includes(levelId)) {
      writeFavorites(current.filter((id) => id !== levelId));
      return;
    }
    writeFavorites([...current, levelId]);
  }, []);

  const reset = useCallback(() => {
    safeStorageRemove(STORAGE_KEYS.favoriteDrills);
    cachedFavoritesRaw = "";
    cachedFavorites = EMPTY_FAVORITES;
    touchUpdatedAt(UPDATED_AT_KEYS.favoriteDrills);
    dispatchStorageEvent(STORAGE_EVENTS.favoriteDrills);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    reset,
  };
}
