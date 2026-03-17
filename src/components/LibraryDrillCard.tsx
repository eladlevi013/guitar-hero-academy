"use client";

import type { ReactNode } from "react";
import type { DrillCatalogEntry } from "@/types/library";

function prettyLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "accent" }) {
  return (
    <span
      style={{
        borderRadius: 999,
        padding: "6px 10px",
        background: tone === "accent" ? "rgba(106,158,232,0.14)" : "rgba(255,255,255,0.05)",
        border: tone === "accent" ? "1px solid rgba(106,158,232,0.22)" : "1px solid rgba(255,255,255,0.08)",
        color: tone === "accent" ? "#bfd7ff" : "rgba(240,232,216,0.76)",
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(200,180,140,0.48)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.35 }}>{value}</div>
    </div>
  );
}

export default function LibraryDrillCard({
  entry,
  stars,
  completed,
  isFavorite,
  onToggleFavorite,
  onStart,
  secondaryActionLabel,
  onSecondaryAction,
  highlightLabel,
}: {
  entry: DrillCatalogEntry;
  stars: number;
  completed: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStart: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  highlightLabel?: string;
}) {
  return (
    <div
      className="ui-glow-panel ui-lift-card"
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        padding: 20,
        boxShadow: "0 14px 38px rgba(0,0,0,0.28)",
      }}
    >
      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: entry.worldAccentColor, marginBottom: 6 }}>
            WORLD {entry.worldNumber} · {entry.worldTitle.toUpperCase()}
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900 }}>{entry.level.title}</div>
          {entry.level.subtitle && (
            <div style={{ color: "rgba(240,232,216,0.58)", fontSize: 13, marginTop: 4 }}>{entry.level.subtitle}</div>
          )}
        </div>
        <div style={{ textAlign: "right", minWidth: 74 }}>
          {highlightLabel && (
            <div style={{ color: "#b895ff", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", marginBottom: 6 }}>
              {highlightLabel.toUpperCase()}
            </div>
          )}
          <div style={{ color: completed ? "#7ac85a" : "#f0c040", fontSize: 12, fontWeight: 800 }}>
            {completed ? "Done" : `${stars}/3`}
          </div>
          <div style={{ color: "rgba(200,180,140,0.42)", fontSize: 10, marginTop: 6 }}>
            {entry.level.bpm} BPM
          </div>
        </div>
      </div>

      <div style={{ borderRadius: 16, background: "rgba(106,158,232,0.08)", border: "1px solid rgba(106,158,232,0.16)", padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ color: "#bfd7ff", fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", marginBottom: 4 }}>
          {entry.vibeTitle.toUpperCase()}
        </div>
        <div style={{ color: "rgba(240,232,216,0.72)", fontSize: 13, lineHeight: 1.6 }}>{entry.vibeLine}</div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <Tag tone="accent">{prettyLabel(entry.scaleFamily)}</Tag>
        {entry.genreTags.slice(0, 2).map((tag) => <Tag key={tag}>{prettyLabel(tag)}</Tag>)}
        {entry.techniqueTags.slice(0, 2).map((tag) => <Tag key={tag}>{prettyLabel(tag)}</Tag>)}
      </div>

      <div style={{ color: "rgba(240,232,216,0.6)", fontSize: 13, lineHeight: 1.65, marginBottom: 14 }}>
        {entry.level.description}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 14 }}>
        <MiniStat label="Focus" value={entry.level.focus ?? "Lead practice"} />
        <MiniStat label="Difficulty" value={(entry.level.difficulty ?? "medium").toUpperCase()} />
        <MiniStat label="Notes" value={String(entry.level.notes.length)} />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          className="ui-solid-button"
          onClick={onStart}
          style={{
            flex: 1,
            border: "none",
            borderRadius: 14,
            background: `linear-gradient(135deg, ${entry.worldAccentColor}, ${entry.worldAccentColor}aa)`,
            color: "white",
            fontWeight: 800,
            padding: "13px 14px",
            cursor: "pointer",
          }}
        >
          Start drill
        </button>
        <button
          className="ui-soft-button"
          onClick={onToggleFavorite}
          style={{
            borderRadius: 14,
            border: isFavorite ? "1px solid rgba(240,192,60,0.26)" : "1px solid rgba(255,255,255,0.12)",
            background: isFavorite ? "rgba(240,192,60,0.12)" : "rgba(255,255,255,0.05)",
            color: isFavorite ? "#f0c040" : "#f0e8d8",
            fontWeight: 700,
            padding: "13px 14px",
            cursor: "pointer",
          }}
        >
          {isFavorite ? "Saved" : "Save"}
        </button>
        {secondaryActionLabel && onSecondaryAction && (
          <button
            className="ui-soft-button"
            onClick={onSecondaryAction}
            style={{
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              color: "#f0e8d8",
              fontWeight: 700,
              padding: "13px 14px",
              cursor: "pointer",
            }}
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
