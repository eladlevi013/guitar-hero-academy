"use client";

import { useState } from "react";
import { useCloud } from "@/components/CloudProvider";

export default function CloudSyncCallout({
  title = "Play instantly, connect when you want backup",
  compact = false,
}: {
  title?: string;
  compact?: boolean;
}) {
  const { enabled, ready, user, signInWithGoogle } = useCloud();
  const [busy, setBusy] = useState(false);

  const connected = Boolean(user && !user.isAnonymous);
  const subtitle = !enabled
    ? "Firebase is not configured yet, so this build is currently local-only."
    : !ready
      ? "Preparing sign-in and sync services..."
      : "You can keep using the app without an account. Connect Google when you want backup, restore, and cross-device sync.";

  if (connected) return null;

  async function handleConnect() {
    setBusy(true);
    try {
      await signInWithGoogle();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      style={{
        background: connected
          ? "linear-gradient(145deg, rgba(58,122,107,0.18), rgba(255,255,255,0.04))"
          : "linear-gradient(145deg, rgba(106,158,232,0.16), rgba(255,255,255,0.04))",
        border: connected
          ? "1px solid rgba(58,122,107,0.28)"
          : "1px solid rgba(106,158,232,0.22)",
        borderRadius: compact ? 20 : 24,
        padding: compact ? "18px 18px" : "22px 22px",
        boxShadow: "0 18px 48px rgba(0,0,0,0.24)",
      }}
    >
      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0, flex: "1 1 320px" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.16em",
              color: "#bfd7ff",
              marginBottom: 8,
            }}
          >
            OPTIONAL GOOGLE BACKUP
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: compact ? 24 : 28, fontWeight: 900, marginBottom: 8 }}>{title}</div>
          <div style={{ color: "rgba(240,232,216,0.7)", fontSize: 14, lineHeight: 1.7, maxWidth: 720 }}>
            {subtitle}
          </div>
        </div>

        {enabled && ready && (
          <button
            onClick={() => void handleConnect()}
            disabled={busy}
            style={{
              border: "none",
              borderRadius: 14,
              background: "linear-gradient(135deg, #6a9ee8, #3a5a8a)",
              color: "white",
              padding: "13px 16px",
              fontWeight: 800,
              fontSize: 13,
              cursor: busy ? "default" : "pointer",
              opacity: busy ? 0.75 : 1,
              minWidth: 170,
            }}
          >
            {busy ? "Connecting..." : "Connect Google"}
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: compact ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))",
          gap: 10,
          marginTop: 16,
        }}
      >
        <BenefitPill
          label="No lock-in"
          value="Use the full app without login"
        />
        <BenefitPill
          label="Why connect"
          value="Save progress across browser and device changes"
        />
        {!compact && (
          <BenefitPill
            label="Safety"
            value="Avoid losing streaks and setup if local data disappears"
          />
        )}
      </div>
    </section>
  );
}

function BenefitPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "12px 13px",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(200,180,140,0.48)", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#f0e8d8", lineHeight: 1.45 }}>
        {value}
      </div>
    </div>
  );
}
