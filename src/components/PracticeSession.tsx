"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePitchDetection } from "@/hooks/usePitchDetection";
import { NoteStatus, useGameLoop } from "@/hooks/useGameLoop";
import { useBackingTrack } from "@/hooks/useBackingTrack";
import { useProgress } from "@/hooks/useProgress";
import TabRail from "@/components/TabRail";
import { Level } from "@/types/tab";
import { useAchievements } from "@/hooks/useAchievements";
import { usePracticeSettings } from "@/hooks/usePracticeSettings";
import { useSessionHistory } from "@/hooks/useSessionHistory";

const IN_TUNE_CENTS = 15;
const CLOSE_CENTS   = 40;

const STRING_ACCENT: Record<number, string> = {
  1: "#6a9ee8", 2: "#e8a840", 3: "#7ac85a",
  4: "#5abcaa", 5: "#b07ae8", 6: "#e8553d",
};

const NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
function noteNameFromFreq(f: number) {
  const midi = 12 * Math.log2(f / 440) + 69;
  const r    = Math.round(midi);
  return NOTE_NAMES[((r % 12) + 12) % 12] + (Math.floor(r / 12) - 1);
}

type SessionFeedback = {
  focusArea: string;
  tips: string[];
  topMissedNotes: string[];
};

type PracticeSegment = "full" | "frontHalf" | "backHalf" | "finalStretch";

const SEGMENT_OPTIONS: Array<{ id: PracticeSegment; label: string; short: string }> = [
  { id: "full", label: "Full level", short: "Full" },
  { id: "frontHalf", label: "Front half", short: "Front" },
  { id: "backHalf", label: "Back half", short: "Back" },
  { id: "finalStretch", label: "Last 8 notes", short: "Last 8" },
];

function buildSegmentLevel(level: Level, segment: PracticeSegment) {
  const totalNotes = level.notes.length;

  let picked = level.notes;
  let label = "Full level";

  if (segment === "frontHalf") {
    picked = level.notes.slice(0, Math.max(1, Math.ceil(totalNotes / 2)));
    label = "Front half";
  } else if (segment === "backHalf") {
    picked = level.notes.slice(Math.max(0, Math.floor(totalNotes / 2)));
    label = "Back half";
  } else if (segment === "finalStretch") {
    picked = level.notes.slice(Math.max(0, totalNotes - 8));
    label = "Last 8 notes";
  }

  const firstBeat = picked[0]?.startBeat ?? 0;
  const notes = picked.map((note) => ({
    ...note,
    startBeat: Math.max(0, note.startBeat - firstBeat),
  }));

  return {
    isFull: segment === "full",
    label,
    level: {
      ...level,
      id: segment === "full" ? level.id : `${level.id}__${segment}`,
      title: segment === "full" ? level.title : `${level.title} · ${label}`,
      notes,
    },
  };
}

function buildSessionFeedback(
  level: Level,
  noteStatuses: ReadonlyMap<string, NoteStatus>,
  missLabels: ReadonlyMap<string, string>,
  hits: number,
  maxCombo: number,
): SessionFeedback {
  const total = level.notes.length;
  const missedNotes = level.notes.filter((note) => noteStatuses.get(note.id) === "missed");
  const missCounts = new Map<string, number>();
  const stringMissCounts = new Map<number, number>();

  missedNotes.forEach((note) => {
    const missLabel = missLabels.get(note.id);
    if (missLabel && missLabel !== "silent") {
      missCounts.set(missLabel, (missCounts.get(missLabel) ?? 0) + 1);
    }
    stringMissCounts.set(note.string, (stringMissCounts.get(note.string) ?? 0) + 1);
  });

  const topMissedNotes = [...missCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([note]) => note);

  const topMissedString = [...stringMissCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const accuracy = total > 0 ? hits / total : 0;

  const tips: string[] = [];
  if (accuracy < 0.6) {
    tips.push("Drop the speed and reconnect the line cleanly before pushing tempo.");
  } else if (accuracy < 0.85) {
    tips.push("Stay at this tempo until the phrase feels connected for longer stretches.");
  } else {
    tips.push("The line is stable now, so the next win is keeping the same touch at a higher speed.");
  }

  if (topMissedString !== null) {
    tips.push(`Watch your picking path on string ${topMissedString}; that is where most misses showed up.`);
  } else if (topMissedNotes[0]) {
    tips.push(`Give ${topMissedNotes[0]} one extra listening pass before you play it.`);
  }

  if (maxCombo < Math.max(4, Math.floor(total / 3))) {
    tips.push("Aim for one calmer, longer combo instead of forcing every note with the same attack.");
  } else if (level.focus) {
    tips.push(`Technique goal: ${level.focus}.`);
  }

  const focusArea = topMissedString !== null
    ? `String ${topMissedString} accuracy`
    : topMissedNotes[0]
      ? `Pitch lock on ${topMissedNotes[0]}`
      : level.focus ?? "General note accuracy";

  return {
    focusArea,
    tips: tips.slice(0, 3),
    topMissedNotes,
  };
}

// ── Cents bar ─────────────────────────────────────────────────────────────────
function CentsBar({ cents }: { cents: number | null }) {
  const abs    = cents !== null ? Math.abs(cents) : null;
  const inTune = abs !== null && abs <= IN_TUNE_CENTS;
  const close  = abs !== null && abs <= CLOSE_CENTS;
  const color  = cents === null ? "rgba(200,180,140,0.5)" : inTune ? "#7ac85a" : close ? "#e8a840" : "#e8553d";
  const pct    = cents !== null ? 50 + Math.max(-50, Math.min(50, cents / 2)) : 50;
  const fillL  = Math.min(pct, 50);
  const fillW  = Math.abs(pct - 50);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 8, fontSize: 13, fontWeight: 700, color, minHeight: 18 }}>
        {cents === null
          ? "Play the highlighted note…"
          : inTune ? "✓  Perfect!"
          : cents > 0 ? `+${Math.round(cents)}¢  sharp`
          : `${Math.round(cents)}¢  flat`}
      </div>
      <div style={{ position: "relative", height: 14, borderRadius: 7, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ position: "absolute", left: "42%", right: "42%", top: 0, bottom: 0, background: "rgba(122,200,90,0.12)", borderRadius: 7 }} />
        {cents !== null && (
          <div style={{
            position: "absolute", left: `${fillL}%`, width: `${fillW}%`,
            top: 0, bottom: 0, background: color, borderRadius: 7, opacity: 0.65,
            transition: "all .07s linear",
          }} />
        )}
        <div style={{ position: "absolute", left: "50%", top: -2, bottom: -2, width: 2, background: "rgba(255,255,255,0.2)", transform: "translateX(-50%)", borderRadius: 1 }} />
        <div style={{
          position: "absolute", left: `${pct}%`, top: "50%",
          width: 20, height: 20, borderRadius: "50%",
          background: cents === null ? "rgba(255,255,255,0.12)" : color,
          border: "3px solid rgba(255,255,255,0.9)",
          transform: "translate(-50%,-50%)",
          transition: "left .07s linear, background .15s",
          boxShadow: inTune ? `0 0 0 4px ${color}44` : "0 2px 8px rgba(0,0,0,0.4)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "rgba(200,180,140,0.4)" }}>
        <span>flat</span><span>sharp</span>
      </div>
    </div>
  );
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ count, accent, animate: doAnimate }: { count: 0|1|2|3; accent: string; animate?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center", fontSize: 32 }}>
      {[1,2,3].map(i => (
        <span key={i} style={{
          color: i <= count ? accent : "rgba(255,255,255,0.1)",
          filter: i <= count ? `drop-shadow(0 0 8px ${accent}99)` : "none",
          transition: "color .3s, filter .3s",
          animation: doAnimate && i <= count ? `scorePop 0.45s ease-out ${(i-1)*0.13}s both` : "none",
        }}>★</span>
      ))}
    </div>
  );
}

// ── Combo badge ───────────────────────────────────────────────────────────────
function ComboBadge({ combo, accent }: { combo: number; accent: string }) {
  if (combo < 2) return null;
  const isHot  = combo >= 10;
  const isWarm = combo >= 5;
  const label  = isHot ? "🔥 COMBO" : isWarm ? "⚡ COMBO" : "COMBO";
  const bg     = isHot  ? "linear-gradient(135deg, #ff6b35, #ff9500)"
               : isWarm ? "linear-gradient(135deg, #5c8a42, #7ab857)"
                        : `linear-gradient(135deg, ${accent}cc, ${accent})`;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      animation: "comboAppear 0.22s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <div style={{
        background: bg,
        borderRadius: 20, padding: "2px 10px",
        fontSize: 9, fontWeight: 900, color: "white",
        letterSpacing: "0.18em", marginBottom: 1,
        boxShadow: isHot ? "0 0 16px rgba(255,100,30,0.7)" : "none",
      }}>{label}</div>
      <div style={{
        fontSize: 26, fontWeight: 900, lineHeight: 1,
        color: isHot ? "#ff6b35" : isWarm ? "#7ac85a" : accent,
        textShadow: isHot ? "0 0 20px rgba(255,107,53,0.9)" : "none",
      }}>×{combo}</div>
    </div>
  );
}

// ── Floating hit text ─────────────────────────────────────────────────────────
function HitFloater({ triggerKey }: { triggerKey: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggerKey === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
      fontSize: 18, fontWeight: 900, color: "#22c55e",
      textShadow: "0 0 16px rgba(34,197,94,0.9)",
      animation: "hitFloat 0.6s ease-out forwards",
      pointerEvents: "none", zIndex: 30, whiteSpace: "nowrap",
    }}>✓ HIT!</div>
  );
}

// ── Beat countdown during lead-in ─────────────────────────────────────────────
function BeatCountdown({ elapsedRef, beatMs, leadInMs, isListening }: {
  elapsedRef: React.MutableRefObject<number>;
  beatMs: number;
  leadInMs: number;
  isListening: boolean;
}) {
  const [beat, setBeat] = useState<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isListening) { setBeat(null); return; }

    let last = -1;
    function tick() {
      const elapsed = elapsedRef.current;
      if (elapsed >= leadInMs) {
        setBeat(null);
        return;
      }
      const msLeft   = leadInMs - elapsed;
      const beatLeft = Math.ceil(msLeft / beatMs);
      const clamped  = Math.min(beatLeft, 4);
      if (clamped !== last) { last = clamped; setBeat(clamped); }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isListening, elapsedRef, beatMs, leadInMs]);

  if (beat === null || !isListening) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none", zIndex: 40,
    }}>
      <div key={beat} style={{
        fontSize: 72, fontWeight: 900, color: "white",
        textShadow: "0 0 40px rgba(200,85,61,0.9), 0 4px 20px rgba(0,0,0,0.6)",
        animation: "beatPop 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        lineHeight: 1,
      }}>
        {beat}
      </div>
    </div>
  );
}

// ── Confetti burst on 3 stars ──────────────────────────────────────────────────
const CONFETTI_COLOURS = ["#c8553d","#c47c2a","#f0c060","#7ac85a","#6a9ee8","#b07ae8","#ff6b4a"];
function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 50 }}>
      {pieces.map(i => {
        const left  = 10 + Math.abs((i * 37 + 13) % 80);
        const delay = (i * 0.09) % 1.4;
        const dur   = 1.2 + (i % 5) * 0.18;
        const color = CONFETTI_COLOURS[i % CONFETTI_COLOURS.length];
        const size  = 6 + (i % 4) * 3;
        return (
          <div key={i} style={{
            position: "absolute", top: 0, left: `${left}%`,
            width: size, height: size,
            background: color,
            borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? 2 : 0,
            animation: `confettiFall ${dur}s ${delay}s ease-in forwards,
                        confettiDrift ${dur * 0.6}s ${delay}s ease-in-out infinite alternate`,
            opacity: 0,
          }} />
        );
      })}
    </div>
  );
}

// ── Level complete ─────────────────────────────────────────────────────────────
function LevelComplete({ level, levelNum, hits, total, stars, maxCombo, accent, onRestart, nextLevelId }: {
  level: Level; levelNum: number; hits: number; total: number; stars: 0|1|2|3;
  maxCombo: number; accent: string; onRestart: () => void; nextLevelId?: string;
}) {
  const pct     = Math.round(hits / total * 100);
  const message = stars === 3 ? "Flawless! 🔥" : stars === 2 ? "Great job! ⚡" : stars === 1 ? "Keep going!" : "Try again!";

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      {stars === 3 && <Confetti />}
      {/* Background orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-8%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${accent}22 0%, transparent 65%)` }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(110,40,180,0.18) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div style={{
        background: "rgba(10,5,28,0.97)",
        borderRadius: 28,
        border: `1px solid ${accent}30`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${accent}18`,
        padding: "44px 34px", textAlign: "center",
        maxWidth: 420, width: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        position: "relative", zIndex: 1,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: "0.2em", marginBottom: 6 }}>
            LEVEL {levelNum} COMPLETE
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0, color: "#f0e8d8" }}>{message}</h2>
        </div>

        <Stars count={stars} accent={accent} animate />

        {/* Score bar */}
        <div style={{ width: "100%", background: "rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden", height: 8 }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent}, #7ac85a)`,
            borderRadius: 10, transition: "width 1.2s ease-out",
            boxShadow: `0 0 12px ${accent}66`,
          }} />
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 20, fontSize: 14, color: "rgba(200,180,140,0.6)", fontWeight: 600, flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ color: "#7ac85a" }}>✓ {hits} hit</span>
          <span style={{ color: "#e8553d" }}>✗ {total - hits} missed</span>
          <span style={{ color: accent }}>{pct}%</span>
          {maxCombo >= 3 && <span style={{ color: "#e8a840" }}>🔥 ×{maxCombo} best</span>}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
          {nextLevelId && (
            <Link href={`/practice/${nextLevelId}`} style={{
              padding: "15px", borderRadius: 14, fontWeight: 800, fontSize: 16,
              textDecoration: "none", textAlign: "center", display: "block",
              background: "linear-gradient(135deg, #5c8a42, #3d6028)",
              color: "white",
              boxShadow: "0 4px 0 #2a4a18, 0 8px 28px rgba(92,138,66,0.4)",
            }}>Next Level →</Link>
          )}
          <button onClick={onRestart} style={{
            padding: "13px", borderRadius: 14, fontWeight: 600, fontSize: 15, cursor: "pointer",
            background: "rgba(255,255,255,0.07)", color: "#f0e8d8",
            border: "1.5px solid rgba(255,255,255,0.12)",
          }}>Try Again</button>
          <Link href="/practice" style={{
            padding: "13px", borderRadius: 14, fontWeight: 600, fontSize: 15,
            textDecoration: "none", textAlign: "center",
            background: "transparent", color: "rgba(200,180,140,0.55)",
            border: "1.5px solid rgba(255,255,255,0.08)", display: "block",
          }}>World Map</Link>
        </div>
      </div>
    </div>
  );
}

// ── Onboarding Modal ──────────────────────────────────────────────────────────
function SessionCompletePanel({
  level,
  levelNum,
  completionLabel,
  segmentLabel,
  isFullLevel,
  hits,
  total,
  stars,
  maxCombo,
  accent,
  feedback,
  onRestart,
  onRetrySlower,
  onSwitchToPractice,
  nextLevelId,
}: {
  level: Level;
  levelNum: number;
  completionLabel: string;
  segmentLabel: string;
  isFullLevel: boolean;
  hits: number;
  total: number;
  stars: 0 | 1 | 2 | 3;
  maxCombo: number;
  accent: string;
  feedback: SessionFeedback;
  onRestart: () => void;
  onRetrySlower: () => void;
  onSwitchToPractice: () => void;
  nextLevelId?: string;
}) {
  const pct = Math.round(hits / total * 100);
  const message = stars === 3 ? "Flawless run!" : stars === 2 ? "Great job!" : stars === 1 ? "Keep going!" : "Try again!";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {stars === 3 && <Confetti />}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-8%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${accent}22 0%, transparent 65%)` }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(110,40,180,0.18) 0%, transparent 65%)" }} />
      </div>

      <div
        style={{
          background: "rgba(10,5,28,0.97)",
          borderRadius: 28,
          border: `1px solid ${accent}30`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${accent}18`,
          padding: "44px 34px",
          textAlign: "center",
          maxWidth: 470,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: "0.2em", marginBottom: 6 }}>
            {completionLabel}
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0, color: "#f0e8d8" }}>{message}</h2>
          {!isFullLevel && (
            <div style={{ fontSize: 12, color: "rgba(240,232,216,0.58)", marginTop: 8 }}>
              Segment practiced: {segmentLabel}
            </div>
          )}
        </div>

        <Stars count={stars} accent={accent} animate />

        <div style={{ width: "100%", background: "rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden", height: 8 }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${accent}, #7ac85a)`,
              borderRadius: 10,
              transition: "width 1.2s ease-out",
              boxShadow: `0 0 12px ${accent}66`,
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 20, fontSize: 14, color: "rgba(200,180,140,0.6)", fontWeight: 600, flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ color: "#7ac85a" }}>Hit {hits}</span>
          <span style={{ color: "#e8553d" }}>Missed {total - hits}</span>
          <span style={{ color: accent }}>{pct}%</span>
          {maxCombo >= 3 && <span style={{ color: "#e8a840" }}>Best combo x{maxCombo}</span>}
        </div>

        <div
          style={{
            width: "100%",
            borderRadius: 18,
            padding: "16px 16px 14px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: accent, marginBottom: 8 }}>SESSION FEEDBACK</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#f0e8d8", marginBottom: 10 }}>{feedback.focusArea}</div>
          {level.focus && (
            <div style={{ fontSize: 12, color: "rgba(240,232,216,0.62)", marginBottom: 10 }}>
              Technique goal: {level.focus}
            </div>
          )}
          <div style={{ display: "grid", gap: 8 }}>
            {feedback.tips.map((tip) => (
              <div key={tip} style={{ fontSize: 13, color: "rgba(240,232,216,0.72)", lineHeight: 1.55 }}>
                {tip}
              </div>
            ))}
          </div>
          {feedback.topMissedNotes.length > 0 && (
            <div style={{ fontSize: 12, color: "#f0c040", marginTop: 10 }}>
              Most common misses: {feedback.topMissedNotes.join(", ")}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
          {nextLevelId && isFullLevel && (
            <Link
              href={`/practice/${nextLevelId}`}
              style={{
                padding: "15px",
                borderRadius: 14,
                fontWeight: 800,
                fontSize: 16,
                textDecoration: "none",
                textAlign: "center",
                display: "block",
                background: "linear-gradient(135deg, #5c8a42, #3d6028)",
                color: "white",
                boxShadow: "0 4px 0 #2a4a18, 0 8px 28px rgba(92,138,66,0.4)",
              }}
            >
              Next Level
            </Link>
          )}
          <button
            onClick={onRetrySlower}
            style={{
              padding: "13px",
              borderRadius: 14,
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              background: "rgba(58,122,107,0.12)",
              color: "#b7e6dd",
              border: "1.5px solid rgba(58,122,107,0.28)",
            }}
          >
            Retry slower
          </button>
          <button
            onClick={onSwitchToPractice}
            style={{
              padding: "13px",
              borderRadius: 14,
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              background: "rgba(106,158,232,0.12)",
              color: "#bfd7ff",
              border: "1.5px solid rgba(106,158,232,0.28)",
            }}
          >
            Open practice mode
          </button>
          <button
            onClick={onRestart}
            style={{
              padding: "13px",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              background: "rgba(255,255,255,0.07)",
              color: "#f0e8d8",
              border: "1.5px solid rgba(255,255,255,0.12)",
            }}
          >
            Try Again
          </button>
          <Link
            href="/practice"
            style={{
              padding: "13px",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              textAlign: "center",
              background: "transparent",
              color: "rgba(200,180,140,0.55)",
              border: "1.5px solid rgba(255,255,255,0.08)",
              display: "block",
            }}
          >
            World Map
          </Link>
        </div>
      </div>
    </div>
  );
}

const ONBOARD_KEY = "gha-v1-onboarded";

function MiniRailPreview() {
  return (
    <div style={{
      width: "100%", height: 80,
      background: "linear-gradient(180deg, #100c1e 0%, #1a1030 100%)",
      borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)",
      position: "relative", overflow: "hidden", flexShrink: 0,
    }}>
      <div style={{ position: "absolute", left: 90, top: 8, bottom: 8, width: 2, borderRadius: 2, background: "rgba(255,255,255,0.85)" }} />
      {/* Hit note */}
      <div style={{
        position: "absolute", left: 70, top: "50%", marginTop: -14,
        width: 28, height: 28, borderRadius: "50%",
        background: "#22c55e", border: "2px solid #16a34a",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 900, color: "white",
        boxShadow: "0 0 12px rgba(34,197,94,0.7)",
      }}>5</div>
      <div style={{
        position: "absolute", left: 61, top: "50%", marginTop: 16,
        fontSize: 8, fontWeight: 700, color: "rgba(34,197,94,0.7)",
        background: "rgba(20,5,20,0.6)", padding: "1px 4px", borderRadius: 3,
      }}>HIT</div>
      {/* Miss note */}
      <div style={{
        position: "absolute", left: 180, top: "28%", marginTop: -14,
        width: 28, height: 28, borderRadius: "50%",
        background: "rgba(239,68,68,0.12)", border: "1.5px solid rgba(239,68,68,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 900, color: "rgba(239,68,68,0.5)",
      }}>7</div>
      <div style={{
        position: "absolute", left: 171, top: "28%", marginTop: 16,
        fontSize: 8, fontWeight: 700, color: "rgba(239,68,68,0.65)",
        background: "rgba(20,5,20,0.6)", padding: "1px 4px", borderRadius: 3,
      }}>G#3</div>
    </div>
  );
}

function OnboardingModal({ onDone }: { onDone: () => void }) {
  const [screen, setScreen] = useState(0);

  const screens = [
    {
      icon: "🎸",
      title: "Play near your mic or plug in",
      body: "Use your phone, laptop mic, or a direct input — whatever gets your guitar signal in.",
    },
    {
      icon: "🎤",
      title: "Allow microphone when prompted",
      body: "When you tap Start, your browser will ask for mic access. Allow it to enable pitch detection.",
    },
    {
      icon: null,
      title: "Hit the notes as they scroll",
      body: "Notes come from the right. Play each one as it reaches the white line.",
    },
  ];

  function dismiss() {
    try { localStorage.setItem(ONBOARD_KEY, "1"); } catch {}
    onDone();
  }

  const current = screens[screen];
  const isLast  = screen === screens.length - 1;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(4,2,10,0.92)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: "rgba(14,8,32,0.98)",
        border: "1px solid rgba(200,85,61,0.3)",
        borderRadius: 28,
        boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,85,61,0.1)",
        padding: "36px 28px",
        maxWidth: 360, width: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 22,
        animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Step dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {screens.map((_, i) => (
            <div key={i} style={{
              width: i === screen ? 20 : 6, height: 6, borderRadius: 3,
              background: i === screen ? "#c8553d" : "rgba(255,255,255,0.15)",
              transition: "all .25s",
            }} />
          ))}
        </div>

        {/* Visual */}
        {screen === 2
          ? <MiniRailPreview />
          : <div style={{ fontSize: 52, lineHeight: 1 }}>{current.icon}</div>
        }

        {/* Text */}
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 19, fontWeight: 900, color: "#f0e8d8", marginBottom: 10, lineHeight: 1.3 }}>
            {current.title}
          </h2>
          <p style={{ fontSize: 13, color: "rgba(200,180,140,0.6)", lineHeight: 1.6, margin: 0 }}>
            {current.body}
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
          <button
            onClick={isLast ? dismiss : () => setScreen(s => s + 1)}
            style={{
              padding: "14px", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer",
              background: "linear-gradient(135deg, #c8553d, #9a3821)",
              color: "white", border: "none",
              boxShadow: "0 4px 0 rgba(154,56,33,0.6), 0 8px 24px rgba(200,85,61,0.35)",
            }}
          >{isLast ? "Got it" : "Next →"}</button>
          <button
            onClick={dismiss}
            style={{
              padding: "11px", borderRadius: 14, fontWeight: 600, fontSize: 13, cursor: "pointer",
              background: "transparent", color: "rgba(200,180,140,0.35)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >Skip</button>
        </div>
      </div>
    </div>
  );
}

// ── Inner session ─────────────────────────────────────────────────────────────
function InnerSession({ level, levelNum, worldNum, nextLevelId, onRestart }: {
  level: Level; levelNum: number; worldNum: number;
  nextLevelId?: string; onRestart: () => void;
}) {
  const { markComplete } = useProgress();
  const pitchData = usePitchDetection();
  const { note, volume, isListening, error, start, stop } = pitchData;
  const backing = useBackingTrack();
  const { unlock, newest, dismissNewest } = useAchievements();
  const { settings, setSpeedMultiplier, setMode, setDrumVolume, setTimingOffsetMs } = usePracticeSettings();
  const { addSession } = useSessionHistory();
  const [isStarting,       setIsStarting]       = useState(false);
  const [segment, setSegment] = useState<PracticeSegment>("full");
  const speedMultiplier = settings.speedMultiplier;
  const isPractice = settings.mode === "practice";
  const segmentState = useMemo(() => buildSegmentLevel(level, segment), [level, segment]);
  const workingLevel = segmentState.level;
  const { noteStatuses, missLabels, activeNote, score, stars, hits, isComplete,
          elapsedRef, beatMs, leadInMs, centsOffset,
          combo, maxCombo, lastHitAt } = useGameLoop(
    workingLevel, pitchData, backing.audioClockRef, speedMultiplier, isPractice ? "practice" : "timed", settings.timingOffsetMs,
  );

  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    try { if (!localStorage.getItem(ONBOARD_KEY)) setShowOnboarding(true); } catch {}
  }, []);

  const total   = workingLevel.notes.length;
  const played  = [...noteStatuses.values()].filter(s => s === "hit" || s === "missed").length;
  const accent  = activeNote ? STRING_ACCENT[activeNote.string] : "#c8553d";
  const volPct  = Math.min(100, volume * 800);
  const feedback = useMemo(
    () => buildSessionFeedback(workingLevel, noteStatuses, missLabels, hits, maxCombo),
    [workingLevel, noteStatuses, missLabels, hits, maxCombo],
  );
  const savedSessionRef = useRef(false);

  const [hitKey, setHitKey] = useState(0);
  const prevHitsRef = useRef(0);
  useEffect(() => {
    if (hits > prevHitsRef.current) {
      prevHitsRef.current = hits;
      setHitKey(k => k + 1);
    }
  }, [hits]);

  // When mic starts/errors, clear the loading spinner
  useEffect(() => { if (isListening || error) setIsStarting(false); }, [isListening, error]);
  useEffect(() => { backing.setVolume(settings.drumVolume); }, [settings.drumVolume]); // eslint-disable-line

  // Mark complete with the actual star rating
  useEffect(() => { if (isComplete && segmentState.isFull) markComplete(level.id, stars); }, [isComplete, segmentState.isFull]); // eslint-disable-line
  useEffect(() => {
    if (!isComplete || savedSessionRef.current) return;
    savedSessionRef.current = true;
    addSession({
      levelId: level.id,
      levelTitle: level.title,
      levelSubtitle: level.subtitle,
      segmentLabel: segmentState.label,
      worldNum,
      levelNum,
      mode: isPractice ? "practice" : "timed",
      speedMultiplier,
      bpm: Math.round(level.bpm * speedMultiplier),
      score,
      stars,
      hits,
      total,
      misses: total - hits,
      maxCombo,
      topMissedNotes: feedback.topMissedNotes,
      focusArea: feedback.focusArea,
    });
  }, [isComplete, addSession, level, worldNum, levelNum, isPractice, speedMultiplier, score, stars, hits, total, maxCombo, feedback, segmentState.label]); // eslint-disable-line
  useEffect(() => {
    if (isComplete && backing.isPlaying) backing.stop();
  }, [isComplete]); // eslint-disable-line
  useEffect(() => {
    if (isListening && !backing.isPlaying && !isPractice) backing.start(beatMs, workingLevel.notes, leadInMs);
    if (!isListening && backing.isPlaying) backing.stop();
  }, [isListening, workingLevel.notes]); // eslint-disable-line
  useEffect(() => () => { backing.stop(); }, []); // eslint-disable-line

  // Achievement: first note
  useEffect(() => {
    if (hits === 1) unlock("first-note");
  }, [hits, unlock]);

  // Achievement: combo milestones
  useEffect(() => {
    if (combo >= 5)  unlock("on-a-roll");
    if (combo >= 10) unlock("unstoppable");
  }, [combo, unlock]);

  // Achievement: on level complete
  useEffect(() => {
    if (!isComplete) return;
    if (segmentState.isFull) unlock("first-level");
    if (segmentState.isFull && stars === 3) unlock("hat-trick");
    if (segmentState.isFull && hits === workingLevel.notes.length) unlock("perfect");
  }, [isComplete, stars, hits, workingLevel.notes.length, unlock, segmentState.isFull]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  const SPEED_KEYS: Record<string, 0.5 | 0.75 | 1 | 1.25 | 1.5> = {
    "Digit1": 0.5, "Digit2": 0.75, "Digit3": 1, "Digit4": 1.25, "Digit5": 1.5,
  };
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (isListening) { stop(); }
        else if (!isStarting) { setIsStarting(true); start(); }
      }
      if (e.code === "KeyR" && !isListening) { onRestart(); }
      if (e.code === "Escape") { stop(); window.location.href = "/practice"; }
      if (!isListening) {
        if (SPEED_KEYS[e.code] !== undefined) setSpeedMultiplier(SPEED_KEYS[e.code]);
        if (e.code === "KeyM") setMode(isPractice ? "timed" : "practice");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isListening, isStarting, start, stop, onRestart]); // eslint-disable-line

  function retrySlower() {
    setMode("timed");
    setSpeedMultiplier(speedMultiplier <= 0.75 ? 0.5 : 0.75);
    onRestart();
  }

  function switchToPracticeMode() {
    setMode("practice");
    onRestart();
  }

  if (isComplete && !isPractice) {
    return (
      <SessionCompletePanel level={level} levelNum={levelNum} completionLabel={segmentState.isFull ? `LEVEL ${levelNum} COMPLETE` : "SECTION COMPLETE"}
        segmentLabel={segmentState.label} isFullLevel={segmentState.isFull} hits={hits} total={total}
        stars={stars} maxCombo={maxCombo} accent={accent} feedback={feedback}
        onRestart={onRestart} onRetrySlower={retrySlower} onSwitchToPractice={switchToPracticeMode}
        nextLevelId={nextLevelId} />
    );
  }

  if (isComplete && isPractice) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
        padding: 24,
      }}>
        <div style={{
          background: "rgba(10,5,28,0.97)", borderRadius: 28,
          border: `1px solid ${accent}30`, padding: "44px 34px", textAlign: "center",
          maxWidth: 380, width: "100%",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
        }}>
          <div style={{ fontSize: 48 }}>🎸</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: "0.2em", marginBottom: 6 }}>
              {segmentState.isFull ? "PRACTICE COMPLETE" : "SECTION PRACTICE COMPLETE"}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0, color: "#f0e8d8" }}>Nice work!</h2>
            <p style={{ fontSize: 13, color: "rgba(200,180,140,0.55)", marginTop: 8, marginBottom: 0 }}>
              You played through all {total} notes in the {segmentState.label.toLowerCase()}.
            </p>
          </div>
          <div style={{
            width: "100%",
            borderRadius: 16,
            padding: "14px 14px 12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "left",
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: accent, letterSpacing: "0.16em", marginBottom: 8 }}>NEXT FOCUS</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#f0e8d8", marginBottom: 8 }}>{feedback.focusArea}</div>
            {feedback.tips.map((tip) => (
              <div key={tip} style={{ fontSize: 13, color: "rgba(240,232,216,0.68)", lineHeight: 1.5, marginBottom: 6 }}>
                {tip}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
            <button onClick={onRestart} style={{
              padding: "14px", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer",
              background: `linear-gradient(135deg, ${accent}dd, ${accent}99)`,
              color: "white", border: "none",
              boxShadow: `0 4px 0 ${accent}55, 0 8px 24px ${accent}44`,
            }}>Practice Again</button>
            <button onClick={() => { setMode("timed"); onRestart(); }} style={{
              padding: "13px", borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: "pointer",
              background: "rgba(58,122,107,0.12)", color: "#b7e6dd",
              border: "1.5px solid rgba(58,122,107,0.28)",
            }}>Return to timed mode</button>
            <Link href="/practice" style={{
              padding: "13px", borderRadius: 14, fontWeight: 600, fontSize: 15,
              textDecoration: "none", textAlign: "center",
              background: "rgba(255,255,255,0.07)", color: "#f0e8d8",
              border: "1.5px solid rgba(255,255,255,0.12)", display: "block",
            }}>World Map</Link>
          </div>
        </div>
      </div>
    );
  }

  const targetName = activeNote ? noteNameFromFreq(activeNote.targetFrequency) : "—";
  const isHot = combo >= 10;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
      position: "relative",
    }}>

      {/* No animated orbs or dot-grid on the game screen — they cause large
          repaint areas that compete with the 60 fps tab-scroll rAF loop */}

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 20,
          background: isHot ? "rgba(20,4,1,0.99)" : "rgba(4,2,10,0.99)",
          borderBottomWidth: isHot ? 2 : 1,
          borderBottomStyle: "solid",
          borderBottomColor: `${isHot ? "#ff6b35" : accent}40`,
          padding: "0 20px", height: 52, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "border-color .4s, background .4s",
        }}>
          <Link href="/practice" style={{ fontSize: 13, fontWeight: 600, color: "rgba(200,180,140,0.6)", textDecoration: "none" }}>← Map</Link>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: isHot ? "#ff9500" : accent, letterSpacing: "0.15em", transition: "color .4s" }}>
              WORLD {worldNum} · LEVEL {levelNum}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f0e8d8" }}>{level.title}</div>
            {!segmentState.isFull && (
              <div style={{ fontSize: 10, color: "rgba(240,232,216,0.48)", marginTop: 2 }}>{segmentState.label}</div>
            )}
          </div>
          {isListening && combo >= 2
            ? <ComboBadge combo={combo} accent={accent} />
            : <div style={{
                background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "3px 10px",
                fontSize: 12, fontWeight: 700, color: "rgba(200,180,140,0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>{played}/{total}</div>
          }
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)" }}>
          <div style={{
            height: "100%", width: `${(played / total) * 100}%`,
            background: `linear-gradient(90deg, ${accent}, #7ac85a)`,
            transition: "width .4s ease",
            boxShadow: `0 0 8px ${accent}88`,
          }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 960, margin: "0 auto", width: "100%", padding: "16px 20px", gap: 14 }}>

          {/* Note card */}
          <div style={{
            borderRadius: 20, overflow: "hidden",
            boxShadow: `0 8px 40px ${accent}30, 0 2px 8px rgba(0,0,0,0.4)`,
            display: "flex", minHeight: 120, transition: "box-shadow .5s",
            border: `1px solid ${accent}25`,
          }}>
            {/* Left: target note */}
            <div style={{
              flex: "0 0 55%",
              background: `linear-gradient(135deg, ${accent}dd 0%, ${accent}88 100%)`,
              padding: "16px 20px",
              display: "flex", flexDirection: "column", justifyContent: "center",
              transition: "background .5s",
              position: "relative", overflow: "hidden",
            }}>
              {/* Subtle inner shine */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
              <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.18em", marginBottom: 2 }}>
                {!isListening ? "TAP START MIC"
                  : activeNote ? "PLAY NOW ▶"
                  : played < total ? "COMING UP…"
                  : "DONE!"}
              </div>
              <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, color: "white", letterSpacing: "-0.03em", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
                {targetName}
              </div>
              {activeNote && (
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <span style={{ background: "rgba(0,0,0,0.25)", color: "white", padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, backdropFilter: "blur(4px)" }}>
                    String {activeNote.string}
                  </span>
                  <span style={{ background: "rgba(0,0,0,0.25)", color: "white", padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, backdropFilter: "blur(4px)" }}>
                    {activeNote.fret === 0 ? "Open" : `Fret ${activeNote.fret}`}
                  </span>
                </div>
              )}
            </div>

            {/* Right: hearing + score */}
            <div style={{
              flex: 1,
              background: "rgba(10,5,28,0.92)",
              padding: "14px 14px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
              borderLeft: `1px solid ${accent}20`,
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(200,180,140,0.45)", letterSpacing: "0.15em", marginBottom: 3 }}>HEARING</div>
                <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: note ? "#f0e8d8" : "rgba(255,255,255,0.1)", transition: "color .15s" }}>
                  {note?.name ?? "—"}
                </div>
              </div>
              {isPractice ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(200,180,140,0.45)", letterSpacing: "0.12em", marginBottom: 4 }}>PRACTICE</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: accent, lineHeight: 1 }}>{hits}/{total}</div>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(200,180,140,0.45)", letterSpacing: "0.12em", marginBottom: 2 }}>SCORE</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: accent, lineHeight: 1, textShadow: `0 0 16px ${accent}66` }}>{score}%</div>
                  <Stars count={stars} accent={accent} />
                </div>
              )}
            </div>
          </div>

          {/* Animated Tab Rail — with beat countdown overlay */}
          <div style={{ position: "relative" }}>
            <TabRail
              notes={level.notes}
              noteStatuses={noteStatuses}
              missLabels={missLabels}
              elapsedRef={elapsedRef}
              beatMs={beatMs}
              leadInMs={leadInMs}
              lastHitAt={lastHitAt}
              combo={combo}
            />
            <BeatCountdown
              elapsedRef={elapsedRef}
              beatMs={beatMs}
              leadInMs={leadInMs}
              isListening={isListening}
            />
            <div style={{ position: "absolute", top: 10, left: 0, right: 0, pointerEvents: "none" }}>
              <HitFloater triggerKey={hitKey} />
            </div>
          </div>

          {/* Cents meter */}
          <div style={{
            background: "rgba(10,5,28,0.88)",
            borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            padding: "13px 20px",
            border: `1px solid ${accent}20`,
          }}>
            <CentsBar cents={centsOffset} />
          </div>

          {/* ── Control Dock ───────────────────────────────────────────────────── */}
          <div style={{
            background: "rgba(10,5,28,0.92)",
            borderRadius: 20,
            border: `1px solid ${accent}20`,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}>

            {/* Settings panel — shown only when not playing */}
            {!isListening && (
              <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", flexDirection: "column", gap: 16,
              }}>

                {level.focus && (
                  <div style={{
                    borderRadius: 14,
                    padding: "12px 14px",
                    background: "rgba(58,122,107,0.12)",
                    border: "1px solid rgba(58,122,107,0.18)",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "#b7e6dd", letterSpacing: "0.15em", marginBottom: 5 }}>TECHNIQUE GOAL</div>
                    <div style={{ fontSize: 13, color: "rgba(240,232,216,0.76)", lineHeight: 1.55 }}>{level.focus}</div>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ minWidth: 52, flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(200,180,140,0.65)", letterSpacing: "0.15em" }}>SECTION</div>
                    <div style={{ fontSize: 8, color: "rgba(200,180,140,0.3)", marginTop: 1 }}>practice slice</div>
                  </div>
                  <div style={{
                    display: "flex", background: "rgba(255,255,255,0.05)",
                    borderRadius: 10, padding: 3, gap: 2,
                    border: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap",
                  }}>
                    {SEGMENT_OPTIONS.map(option => (
                      <button key={option.id} onClick={() => setSegment(option.id)} style={{
                        padding: "5px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700,
                        cursor: "pointer", transition: "background .12s, color .12s, box-shadow .12s",
                        border: "none",
                        background: segment === option.id ? accent : "transparent",
                        color: segment === option.id ? "white" : "rgba(200,180,140,0.5)",
                        boxShadow: segment === option.id ? `0 0 10px ${accent}55` : "none",
                      }}>{option.short}</button>
                    ))}
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 800, color: "rgba(200,180,140,0.75)",
                    background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                    {segmentState.label}
                  </span>
                </div>

                {/* SPEED row */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ minWidth: 52, flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(200,180,140,0.65)", letterSpacing: "0.15em" }}>SPEED</div>
                    <div style={{ fontSize: 8, color: "rgba(200,180,140,0.3)", marginTop: 1 }}>keys 1–5</div>
                  </div>
                  {/* Segmented control */}
                  <div style={{
                    display: "flex", background: "rgba(255,255,255,0.05)",
                    borderRadius: 10, padding: 3, gap: 2,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>
                    {([0.5, 0.75, 1, 1.25, 1.5] as const).map(s => (
                      <button key={s} onClick={() => setSpeedMultiplier(s)} style={{
                        padding: "5px 9px", borderRadius: 7, fontSize: 11, fontWeight: 700,
                        cursor: "pointer", transition: "background .12s, color .12s, box-shadow .12s",
                        border: "none",
                        background: speedMultiplier === s ? accent : "transparent",
                        color: speedMultiplier === s ? "white" : "rgba(200,180,140,0.5)",
                        boxShadow: speedMultiplier === s ? `0 0 10px ${accent}55` : "none",
                      }}>{s === 1 ? "1×" : `${s}×`}</button>
                    ))}
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 800, color: "rgba(200,180,140,0.75)",
                    background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                    {Math.round(level.bpm * speedMultiplier)} BPM
                  </span>
                </div>

                {/* MODE row */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ minWidth: 52, flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(200,180,140,0.65)", letterSpacing: "0.15em" }}>MODE</div>
                    <div style={{ fontSize: 8, color: "rgba(200,180,140,0.3)", marginTop: 1 }}>key M</div>
                  </div>
                  {/* Segmented control */}
                  <div style={{
                    display: "flex", background: "rgba(255,255,255,0.05)",
                    borderRadius: 10, padding: 3, gap: 2,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>
                    {(["timed", "practice"] as const).map(m => (
                      <button key={m} onClick={() => setMode(m)} style={{
                        padding: "5px 14px", borderRadius: 7, fontSize: 11, fontWeight: 700,
                        cursor: "pointer", transition: "background .12s, color .12s, box-shadow .12s",
                        border: "none",
                        background: (m === "practice") === isPractice ? accent : "transparent",
                        color: (m === "practice") === isPractice ? "white" : "rgba(200,180,140,0.5)",
                        boxShadow: (m === "practice") === isPractice ? `0 0 10px ${accent}55` : "none",
                      }}>{m === "timed" ? "Timed" : "Practice"}</button>
                    ))}
                  </div>
                  {isPractice && (
                    <span style={{ fontSize: 10, color: "rgba(200,180,140,0.32)", fontStyle: "italic" }}>no score</span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ minWidth: 52, flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(200,180,140,0.65)", letterSpacing: "0.15em" }}>SYNC</div>
                    <div style={{ fontSize: 8, color: "rgba(200,180,140,0.3)", marginTop: 1 }}>device timing</div>
                  </div>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={10}
                    value={settings.timingOffsetMs}
                    onChange={e => setTimingOffsetMs(parseInt(e.target.value, 10))}
                    style={{ width: 140, accentColor: accent, cursor: "pointer" }}
                  />
                  <span style={{
                    fontSize: 12, fontWeight: 800, color: "rgba(200,180,140,0.75)",
                    background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 8px",
                    border: "1px solid rgba(255,255,255,0.08)", minWidth: 56, textAlign: "center",
                  }}>
                    {settings.timingOffsetMs > 0 ? `+${settings.timingOffsetMs}` : settings.timingOffsetMs} ms
                  </span>
                  <button onClick={() => setTimingOffsetMs(0)} style={{
                    padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                    cursor: "pointer", border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)", color: "rgba(240,232,216,0.7)",
                  }}>Reset</button>
                </div>
              </div>
            )}

            {/* Transport row — always visible */}
            <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 14 }}>

              {/* Mic level */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(200,180,140,0.38)", letterSpacing: "0.1em" }}>MIC</span>
                <div style={{ width: 52, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    width: `${volPct}%`, height: "100%", borderRadius: 3,
                    background: isListening ? "#7ac85a" : "rgba(200,180,140,0.2)",
                    transition: "width .05s, background .3s",
                    boxShadow: isListening ? "0 0 6px rgba(122,200,90,0.5)" : "none",
                  }} />
                </div>
              </div>

              {/* Drum volume — only in timed mode */}
              {!isPractice && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(200,180,140,0.38)", letterSpacing: "0.1em" }}>DRUMS</span>
                  <input type="range" min={0} max={1} step={0.05}
                    value={settings.drumVolume}
                    onChange={e => { const value = parseFloat(e.target.value); setDrumVolume(value); backing.setVolume(value); }}
                    style={{ width: 60, accentColor: accent, cursor: "pointer" }}
                  />
                </div>
              )}

              <div style={{ flex: 1 }} />

              {error && <span style={{ fontSize: 11, color: "#e8553d", flexShrink: 0 }}>{error}</span>}

              {/* Start / Stop */}
              <button
                onClick={() => {
                  if (isListening) { stop(); }
                  else if (!isStarting) { setIsStarting(true); start(); }
                }}
                disabled={isStarting}
                style={{
                  padding: "11px 26px", borderRadius: 12, fontWeight: 800, fontSize: 14,
                  cursor: isStarting ? "default" : "pointer", transition: "all .15s",
                  opacity: isStarting ? 0.6 : 1, letterSpacing: "0.04em", flexShrink: 0,
                  ...(isListening
                    ? { background: "rgba(232,85,61,0.12)", color: "#e8553d", border: "1.5px solid rgba(232,85,61,0.28)" }
                    : { background: `linear-gradient(135deg, ${accent}dd, ${accent}99)`, color: "white", border: "none", boxShadow: `0 4px 0 ${accent}55, 0 6px 20px ${accent}44` }),
                }}
              >
                {isListening ? "◼  Stop" : isStarting ? "…" : "▶  Start"}
              </button>
            </div>

            {/* Live stats bar — shown when playing */}
            {isListening && (
              <div style={{
                padding: "8px 20px 12px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex", gap: 12, justifyContent: "center", alignItems: "center",
                fontSize: 12, color: "rgba(200,180,140,0.45)", fontWeight: 600, flexWrap: "wrap",
              }}>
                <span style={{ color: "#7ac85a" }}>✓ {hits}</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span style={{ color: "#e8553d" }}>✗ {played - hits}</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span>{total - played} left</span>
                {maxCombo >= 3 && (
                  <><span style={{ opacity: 0.3 }}>·</span><span style={{ color: "#e8a840" }}>🔥 ×{maxCombo}</span></>
                )}
              </div>
            )}
          </div>

          {/* Keyboard hints — only when not playing */}
          {!isListening && (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", paddingBottom: 8, flexWrap: "wrap" }}>
              {[
                { key: "Space", label: "Start" },
                { key: "R",     label: "Restart" },
                { key: "Esc",   label: "Map" },
                { key: "1–5",   label: "Speed" },
                { key: "M",     label: "Mode" },
              ].map(({ key, label }) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "rgba(255,255,255,0.18)" }}>
                  <kbd style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4, padding: "1px 5px", fontSize: 9, fontFamily: "monospace",
                    color: "rgba(255,255,255,0.25)",
                  }}>{key}</kbd>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* First-time onboarding */}
      {showOnboarding && <OnboardingModal onDone={() => setShowOnboarding(false)} />}

      {/* Achievement toast */}
      {newest && (
        <div
          onClick={dismissNewest}
          style={{
            position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
            background: "rgba(10,5,28,0.97)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(240,192,60,0.4)",
            borderRadius: 20, padding: "12px 20px",
            display: "flex", alignItems: "center", gap: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(240,192,60,0.15)",
            zIndex: 200, cursor: "pointer", maxWidth: 320,
            animation: "comboAppear 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <span style={{ fontSize: 28 }}>{newest.icon}</span>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#f0c040", letterSpacing: "0.18em", marginBottom: 2 }}>
              ACHIEVEMENT UNLOCKED
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#f0e8d8" }}>{newest.title}</div>
            <div style={{ fontSize: 11, color: "rgba(200,180,140,0.6)", marginTop: 1 }}>{newest.description}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────
export default function PracticeSession({ level, levelNum, worldNum, totalLevels, nextLevelId }: {
  level: Level; levelNum: number; worldNum: number; totalLevels: number; nextLevelId?: string;
}) {
  const [restartKey, setRestartKey] = useState(0);
  // Include level.id in the key so InnerSession fully remounts (resetting all state)
  // whenever the user navigates to a different level, not just on restart.
  return (
    <InnerSession key={`${level.id}-${restartKey}`} level={level} levelNum={levelNum} worldNum={worldNum}
      nextLevelId={nextLevelId} onRestart={() => setRestartKey(k => k + 1)} />
  );
}
