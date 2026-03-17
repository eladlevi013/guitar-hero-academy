"use client";

import { useState } from "react";
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

export default function CloudAccountDock() {
  const { enabled, ready, user, signInWithGoogle, signOut, syncStatus, syncError, lastSyncedAt } = useCloud();
  const [busy, setBusy] = useState(false);
  const syncedAt = formatSyncTime(lastSyncedAt);
  const subtitle = !enabled
    ? "Add Firebase env vars to turn on Google sign-in and cloud sync."
    : !ready
      ? "Preparing account services..."
      : !user || user.isAnonymous
        ? "Progress stays local until you link Google."
        : syncStatus === "syncing"
          ? "Syncing your progress to Firestore..."
          : syncStatus === "error"
            ? syncError ?? "Cloud sync hit an error."
            : syncedAt
              ? `Last synced ${syncedAt}`
              : "Connected to Firestore.";

  async function handleSignIn() {
    setBusy(true);
    try {
      await signInWithGoogle();
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 300,
        width: "min(320px, calc(100vw - 24px))",
        background: "rgba(10,5,28,0.94)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: "14px 14px 12px",
        boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
        backdropFilter: "blur(16px)",
        color: "#f0e8d8",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "#bfd7ff", marginBottom: 4 }}>
            CLOUD ACCOUNT
          </div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>
            {!enabled
              ? "Firebase not configured"
              : !ready
                ? "Connecting..."
                : !user || user.isAnonymous
                  ? "Local player"
                  : user.displayName || user.email || "Google account"}
          </div>
        </div>
        {enabled && ready && (
          <button
            onClick={user && !user.isAnonymous ? () => void handleSignOut() : () => void handleSignIn()}
            disabled={busy}
            style={{
              border: "none",
              borderRadius: 12,
              background:
                user && !user.isAnonymous
                  ? "rgba(255,255,255,0.08)"
                  : "linear-gradient(135deg, #6a9ee8, #3a5a8a)",
              color: "white",
              padding: "10px 12px",
              fontSize: 12,
              fontWeight: 800,
              cursor: busy ? "default" : "pointer",
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? "..." : user && !user.isAnonymous ? "Sign out" : "Google sign-in"}
          </button>
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: "rgba(240,232,216,0.64)", lineHeight: 1.5 }}>
        {subtitle}
      </div>

      {enabled && (
        <div style={{ marginTop: 10, fontSize: 11, color: "rgba(200,180,140,0.44)", lineHeight: 1.5 }}>
          Timing calibration and setup checks stay on this device.
        </div>
      )}
    </div>
  );
}
