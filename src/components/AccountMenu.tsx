"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCloud } from "@/components/CloudProvider";

function formatSyncTime(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getAccountLabel(
  enabled: boolean,
  ready: boolean,
  user: ReturnType<typeof useCloud>["user"],
) {
  if (!enabled) return "Cloud Off";
  if (!ready) return "Loading";
  if (!user || user.isAnonymous) return "Local";
  return user.displayName || user.email || "Google";
}

export default function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { enabled, ready, user, signInWithGoogle, signOut, resetData, syncStatus, syncError, lastSyncedAt } = useCloud();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const syncedAt = formatSyncTime(lastSyncedAt);
  const statusText = !enabled
    ? "Add Firebase env vars to enable cloud sync."
    : !ready
      ? "Preparing account services..."
      : !user || user.isAnonymous
        ? "Your progress is staying on this device until you link Google."
        : syncStatus === "syncing"
          ? "Syncing progress to Firestore..."
          : syncStatus === "error"
            ? syncError ?? "Cloud sync hit an error."
            : syncedAt
              ? `Last synced ${syncedAt}.`
              : "Connected to Firestore.";

  const indicatorColor =
    !enabled ? "#7a4a8a" :
    !ready ? "#f0c040" :
    !user || user.isAnonymous ? "#c47c2a" :
    syncStatus === "error" ? "#ff7a59" :
    syncStatus === "syncing" ? "#6a9ee8" :
    "#7ac85a";

  async function handleAuthAction() {
    setBusy(true);
    try {
      if (user && !user.isAnonymous) {
        await signOut();
      } else {
        await signInWithGoogle();
      }
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    if (!confirm("Reset all progress, achievements, and session history? This cannot be undone.")) return;
    setResetting(true);
    try {
      await resetData();
    } finally {
      setResetting(false);
    }
  }

  const label = getAccountLabel(enabled, ready, user);

  return (
    <div ref={rootRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen((value) => !value)}
        className="ui-soft-button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.12)",
          background: open
            ? "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.08))"
            : "linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))",
          color: "#f0e8d8",
          padding: compact ? "7px 11px" : "9px 14px",
          cursor: "pointer",
          minHeight: compact ? 34 : 38,
          boxShadow: open ? "0 12px 28px rgba(0,0,0,0.24)" : "0 6px 16px rgba(0,0,0,0.12)",
          backdropFilter: "blur(10px)",
        }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: indicatorColor,
            boxShadow: `0 0 10px ${indicatorColor}88`,
            flexShrink: 0,
          }}
        />
        <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
          <span style={{ fontSize: compact ? 11 : 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(200,180,140,0.56)" }}>
            ACCOUNT
          </span>
          {!compact && (
            <span style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.1 }}>
              {label}
            </span>
          )}
        </span>
        {compact && (
          <span style={{ fontSize: 12, fontWeight: 800, lineHeight: 1 }}>
            {label}
          </span>
        )}
      </button>

      {open && (
        <div
          className="ui-glow-panel"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 296,
            maxWidth: "min(296px, calc(100vw - 24px))",
            background: "rgba(10,5,28,0.98)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20,
            padding: 16,
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
            backdropFilter: "blur(16px)",
            zIndex: 500,
          }}
          role="menu"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, rgba(106,158,232,0.22), rgba(200,85,61,0.2))",
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: 14,
                fontWeight: 900,
                color: "#f0e8d8",
                boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
              }}
            >
              {label.slice(0, 1).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#f0e8d8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user && !user.isAnonymous ? user.displayName || user.email || "Google account" : "Local player profile"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(200,180,140,0.5)", marginTop: 2 }}>
                {enabled ? (user && !user.isAnonymous ? "Cloud sync ready" : "Local-first mode") : "Firebase not configured"}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, lineHeight: 1.55, color: "rgba(240,232,216,0.68)", marginBottom: 12 }}>
            {statusText}
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <Link
              href="/player"
              onClick={() => setOpen(false)}
              style={{
                textDecoration: "none",
                borderRadius: 14,
                padding: "11px 12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#f0e8d8",
                fontSize: 12,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Open Player Hub
            </Link>

            {enabled && ready && (
              <button
                onClick={() => void handleAuthAction()}
                disabled={busy}
                className="ui-solid-button"
                style={{
                  border: "none",
                  borderRadius: 14,
                  padding: "11px 12px",
                  background:
                    user && !user.isAnonymous
                      ? "rgba(255,255,255,0.08)"
                      : "linear-gradient(135deg, #6a9ee8, #3a5a8a)",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: busy ? "default" : "pointer",
                  opacity: busy ? 0.75 : 1,
                }}
              >
                {busy ? "Working..." : user && !user.isAnonymous ? "Sign out" : "Connect Google"}
              </button>
            )}

            <button
              onClick={() => void handleReset()}
              disabled={resetting}
              style={{
                border: "1px solid rgba(255,100,80,0.3)",
                borderRadius: 14,
                padding: "11px 12px",
                background: "rgba(255,80,60,0.1)",
                color: "rgba(255,140,120,0.9)",
                fontSize: 12,
                fontWeight: 700,
                cursor: resetting ? "default" : "pointer",
                opacity: resetting ? 0.75 : 1,
              }}
            >
              {resetting ? "Resetting..." : "Reset all data"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
