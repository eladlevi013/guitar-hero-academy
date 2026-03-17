"use client";

import { useState } from "react";

const STORAGE_KEY = "gha-anon-id";

export function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function useAnonymousId(): string {
  const [id] = useState(() => getAnonymousId());
  return id;
}
