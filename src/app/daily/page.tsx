"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePitchDetection } from "@/hooks/usePitchDetection";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useBackingTrack } from "@/hooks/useBackingTrack";
import TabRail from "@/components/TabRail";
import { useAchievements } from "@/hooks/useAchievements";
import world1 from "@/data/world1";
import world2 from "@/data/world2";
import world3 from "@/data/world3";
import type { Level } from "@/types/tab";

// All levels from all worlds, in order
const ALL_LEVELS: Level[] = [
  ...world1.levels,
  ...world2.levels,
  ...world3.levels,
];

// Pick today's challenge based on UTC date
function getTodayChallenge(): { level: Level; dayNumber: number } {
  const MS_PER_DAY = 86400000;
  const EPOCH = new Date("2025-01-01").getTime();
  const dayNumber = Math.floor((Date.now() - EPOCH) / MS_PER_DAY);
  const level = ALL_LEVELS[dayNumber % ALL_LEVELS.length];
  return { level, dayNumber };
}

function buildShareText(dayNumber: number, levelTitle: string, stars: 0|1|2|3, score: number, hits: number, total: number) {
  const starStr = ["☆☆☆","★☆☆","★★☆","★★★"][stars];
  const hitBar  = Array.from({ length: Math.min(total, 10) }, (_, i) =>
    i < Math.round(hits / total * Math.min(total, 10)) ? "🟩" : "🟥"
  ).join("");
  return `🎸 Guitar Hero Academy — Daily Challenge #${dayNumber}\n\n🎯 ${levelTitle}\n${starStr} · ${score}%\n${hitBar}\n\nCan you beat me? guitar-hero-academy.vercel.app/daily`;
}

export default function DailyPage() {
  const [result, setResult]   = useState<{ stars: 0|1|2|3; score: number; hits: number; total: number } | null>(null);
  const [copied, setCopied]   = useState(false);
  const [key, setKey]         = useState(0);

  const { level, dayNumber } = getTodayChallenge();
  const { unlock } = useAchievements();

  const pitchData = usePitchDetection();
  const { note, isListening, error, start, stop } = pitchData;
  const backing    = useBackingTrack();

  const { noteStatuses, activeNote, score, stars, hits, isComplete,
          elapsedRef, beatMs, leadInMs, centsOffset, combo, maxCombo, lastHitAt }
    = useGameLoop(level, pitchData, backing.audioWallStartRef);

  const total  = level.notes.length;
  const played = [...noteStatuses.values()].filter(s => s === "hit" || s === "missed").length;

  useEffect(() => {
    if (isListening && !backing.isPlaying) backing.start(level.bpm, level.notes, leadInMs);
    if (!isListening && backing.isPlaying)  backing.stop();
  }, [isListening]); // eslint-disable-line

  useEffect(() => {
    if (isComplete && backing.isPlaying) backing.stop();
    if (isComplete && !result) {
      setResult({ stars, score, hits, total });
      unlock("daily-done");
      if (stars === 3) unlock("daily-perfect");
    }
  }, [isComplete]); // eslint-disable-line

  useEffect(() => () => { backing.stop(); }, []); // eslint-disable-line

  const NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  function noteNameFromFreq(f: number) {
    const midi = 12 * Math.log2(f / 440) + 69;
    const r    = Math.round(midi);
    return NOTE_NAMES[((r % 12) + 12) % 12] + (Math.floor(r / 12) - 1);
  }

  const accent     = "#f0c040";
  const targetName = activeNote ? noteNameFromFreq(activeNote.targetFrequency) : "—";

  const shareText = result
    ? buildShareText(dayNumber, level.title, result.stars, result.score, result.hits, result.total)
    : "";

  function handleShare() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener");
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleRestart() {
    setResult(null);
    setKey(k => k + 1);
    stop();
  }

  return (
    <div key={key} style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
      fontFamily: "var(--font-inter)",
    }}>
      {/* Header */}
      <header style={{
        background: "rgba(6,3,16,0.92)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(240,192,60,0.2)",
        padding: "0 28px", height: 56, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none", fontSize: 13, fontWeight: 600, color: "rgba(220,196,160,0.55)" }}>← Home</Link>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: accent, letterSpacing: "0.2em" }}>DAILY CHALLENGE</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#f0e8d8" }}>#{dayNumber} · {level.title}</div>
        </div>
        <Link href="/practice" style={{ textDecoration: "none", fontSize: 12, fontWeight: 600, color: "rgba(220,196,160,0.45)" }}>Map</Link>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 680, margin: "0 auto", width: "100%", padding: "20px 20px", gap: 14 }}>

        {/* Challenge badge */}
        <div style={{
          background: "rgba(240,192,60,0.08)", border: "1px solid rgba(240,192,60,0.2)",
          borderRadius: 14, padding: "10px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: accent, letterSpacing: "0.15em" }}>TODAY'S SCALE</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f0e8d8", marginTop: 2 }}>{level.title}</div>
            <div style={{ fontSize: 11, color: "rgba(200,180,140,0.5)", marginTop: 2 }}>{level.bpm} BPM · {total} notes</div>
          </div>
          <div style={{ fontSize: 32 }}>📅</div>
        </div>

        {/* Result card (shown after completion) */}
        {result && (
          <div style={{
            background: "rgba(10,5,28,0.97)", border: `1px solid ${accent}40`,
            borderRadius: 24, padding: "28px 24px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: "0.2em" }}>CHALLENGE COMPLETE</div>
            <div style={{ display: "flex", gap: 4, fontSize: 36 }}>
              {[1,2,3].map(i => <span key={i} style={{ color: i <= result.stars ? "#f0c040" : "rgba(255,255,255,0.12)", filter: i <= result.stars ? "drop-shadow(0 0 8px #f0c04099)" : "none" }}>★</span>)}
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#f0e8d8" }}>{result.score}%</div>
            <div style={{ fontSize: 12, color: "rgba(200,180,140,0.5)" }}>{result.hits} / {result.total} notes hit</div>

            {/* Share preview */}
            <div style={{
              background: "rgba(255,255,255,0.04)", borderRadius: 12,
              padding: "12px 16px", width: "100%",
              fontFamily: "monospace", fontSize: 12, color: "rgba(200,180,140,0.7)",
              whiteSpace: "pre-wrap", lineHeight: 1.6,
            }}>
              {shareText}
            </div>

            <div style={{ display: "flex", gap: 10, width: "100%", flexWrap: "wrap" }}>
              <button onClick={handleShare} style={{
                flex: 1, padding: "13px", borderRadius: 12, fontWeight: 800, fontSize: 14,
                cursor: "pointer", border: "none",
                background: "linear-gradient(135deg, #1d9bf0, #0d7bc4)", color: "white",
              }}>Share on X</button>
              <button onClick={handleCopy} style={{
                flex: 1, padding: "13px", borderRadius: 12, fontWeight: 700, fontSize: 14,
                cursor: "pointer", background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)", color: "#f0e8d8",
              }}>{copied ? "Copied!" : "Copy"}</button>
            </div>
            <button onClick={handleRestart} style={{
              width: "100%", padding: "11px", borderRadius: 12, fontWeight: 600, fontSize: 13,
              cursor: "pointer", background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)", color: "rgba(200,180,140,0.5)",
            }}>Try Again</button>
          </div>
        )}

        {/* Game area (shown while playing) */}
        {!result && (
          <>
            {/* Note card */}
            <div style={{
              borderRadius: 18, overflow: "hidden", display: "flex", minHeight: 110,
              border: "1px solid rgba(240,192,60,0.2)",
              boxShadow: "0 8px 32px rgba(240,192,60,0.1)",
            }}>
              <div style={{
                flex: "0 0 50%", background: `linear-gradient(135deg, ${accent}cc, ${accent}77)`,
                padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "center",
              }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(0,0,0,0.6)", letterSpacing: "0.15em" }}>
                  {!isListening ? "TAP START" : activeNote ? "PLAY NOW" : played < total ? "COMING…" : "DONE!"}
                </div>
                <div style={{ fontSize: 56, fontWeight: 900, color: "rgba(0,0,0,0.85)", lineHeight: 1 }}>{targetName}</div>
                {activeNote && (
                  <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
                    <span style={{ background: "rgba(0,0,0,0.2)", color: "rgba(0,0,0,0.7)", padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>String {activeNote.string}</span>
                    <span style={{ background: "rgba(0,0,0,0.2)", color: "rgba(0,0,0,0.7)", padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>{activeNote.fret === 0 ? "Open" : `Fret ${activeNote.fret}`}</span>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, background: "rgba(10,5,28,0.92)", padding: "14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", borderLeft: "1px solid rgba(240,192,60,0.15)" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(200,180,140,0.45)", letterSpacing: "0.12em", marginBottom: 2 }}>HEARING</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: note ? "#f0e8d8" : "rgba(255,255,255,0.1)" }}>{note?.name ?? "—"}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: accent }}>{score}%</div>
                  <div style={{ display: "flex", gap: 2, fontSize: 20 }}>
                    {[1,2,3].map(i => <span key={i} style={{ color: i <= stars ? "#f0c040" : "rgba(255,255,255,0.1)" }}>★</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab rail */}
            <TabRail notes={level.notes} noteStatuses={noteStatuses} elapsedRef={elapsedRef} beatMs={beatMs} leadInMs={leadInMs} lastHitAt={lastHitAt} combo={combo} />

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ fontSize: 11, color: "rgba(200,180,140,0.4)" }}>{played}/{total}</div>
              {error && <p style={{ fontSize: 12, color: "#e8553d", margin: 0 }}>{error}</p>}
              <button
                onClick={() => { if (isListening) stop(); else start(); }}
                style={isListening
                  ? { padding: "13px 32px", borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: "pointer", background: "rgba(255,255,255,0.08)", color: "#f0e8d8", border: "1px solid rgba(255,255,255,0.12)" }
                  : { padding: "13px 32px", borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: "pointer", border: "none", background: `linear-gradient(135deg, ${accent}dd, ${accent}99)`, color: "rgba(0,0,0,0.85)" }
                }
              >{isListening ? "Stop" : "Start Mic"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
