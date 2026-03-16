"use client";

import { memo, useEffect, useRef } from "react";
import { TabNote } from "@/types/tab";
import { NoteStatus } from "@/hooks/useGameLoop";

// ── Layout constants ──────────────────────────────────────────────────────────
const PX_PER_MS   = 0.10;   // pixels per millisecond — lower = slower scroll, easier to read
const PLAYHEAD_X  = 150;    // px from left edge to playhead
const RAIL_H      = 220;
const PAD_T       = 26;
const PAD_B       = 26;
const NOTE_R      = 18;

const STRING_COLORS: Record<number, string> = {
  1: "#c7d2fe",  2: "#fde68a",  3: "#6ee7b7",
  4: "#93c5fd",  5: "#d8b4fe",  6: "#fca5a5",
};
const STRING_LABEL: Record<number, string> = { 1:"e", 2:"B", 3:"G", 4:"D", 5:"A", 6:"E" };

function stringY(s: number) {
  return PAD_T + ((s - 1) / 5) * (RAIL_H - PAD_T - PAD_B);
}

interface Props {
  notes        : TabNote[];
  noteStatuses : ReadonlyMap<string, NoteStatus>;
  missLabels  ?: ReadonlyMap<string, string>;       // noteId → note name played or "silent"
  elapsedRef   : React.MutableRefObject<number>;
  beatMs       : number;
  leadInMs     : number;
  lastHitAt    ?: React.MutableRefObject<number>;  // rAF timestamp of last hit
  combo        ?: number;                           // current streak (for rail color)
}

function TabRailInner({ notes, noteStatuses, missLabels, elapsedRef, beatMs, leadInMs, lastHitAt, combo }: Props) {
  const trackRef    = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);
  const hitFlashRef = useRef<HTMLDivElement>(null);

  const notePositions = notes.map(note => ({
    note,
    cx: PLAYHEAD_X + (note.startBeat * beatMs + leadInMs) * PX_PER_MS,
    cy: stringY(note.string),
  }));

  const lastNote   = notes[notes.length - 1];
  const trackWidth = PLAYHEAD_X + (lastNote.startBeat * beatMs + lastNote.durationBeats * beatMs + leadInMs + 3000) * PX_PER_MS;

  const totalBeats = Math.ceil(lastNote.startBeat + lastNote.durationBeats + 2);
  const beatXs: number[] = [];
  for (let i = 0; i <= totalBeats; i++) {
    beatXs.push(PLAYHEAD_X + (i * beatMs + leadInMs) * PX_PER_MS);
  }

  // DOM-based animation — no React state, no re-renders per frame
  useEffect(() => {
    let rafId: number;
    let lastRecordedHit = 0;

    function animate(ts: number) {
      const elapsed = elapsedRef.current;

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-elapsed * PX_PER_MS}px)`;
      }

      const phase  = (elapsed % beatMs) / beatMs;
      const onBeat = phase < 0.12;
      if (playheadRef.current) {
        playheadRef.current.style.opacity = onBeat ? "1" : "0.55";
        playheadRef.current.style.boxShadow = onBeat
          ? "0 0 0 3px rgba(255,255,255,0.25), 0 0 18px rgba(255,255,255,0.5)"
          : "0 0 8px rgba(255,255,255,0.18)";
      }
      if (glowRef.current) {
        glowRef.current.style.opacity = onBeat ? "1" : "0.4";
      }

      // Hit flash: fire for 300ms after last hit
      if (hitFlashRef.current && lastHitAt) {
        const msSinceHit = ts - lastHitAt.current;
        if (lastHitAt.current > 0 && lastHitAt.current !== lastRecordedHit && msSinceHit < 300) {
          const progress = msSinceHit / 300;  // 0→1
          const opacity  = 1 - progress;
          const scale    = 1 + progress * 1.5;
          hitFlashRef.current.style.opacity   = String(opacity);
          hitFlashRef.current.style.transform = `scale(${scale})`;
          if (lastHitAt.current !== lastRecordedHit) lastRecordedHit = lastHitAt.current;
        } else if (msSinceHit >= 300) {
          hitFlashRef.current.style.opacity = "0";
        }
      }

      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [elapsedRef, beatMs, lastHitAt]);

  // Combo-based rail color glow
  const comboGlow = (combo ?? 0) >= 10
    ? "rgba(255,200,50,0.18)"
    : (combo ?? 0) >= 5
    ? "rgba(92,255,150,0.13)"
    : (combo ?? 0) >= 3
    ? "rgba(140,180,255,0.10)"
    : "transparent";

  return (
    <div style={{
      position: "relative", width: "100%", height: RAIL_H,
      background: `linear-gradient(180deg, #100c1e 0%, #1a1030 100%)`,
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.07)",
      boxShadow: `0 6px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 0 1000px ${comboGlow}`,
      overflow: "hidden",
      transition: "box-shadow 0.4s ease",
    }}>

      {/* Left fade */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: PLAYHEAD_X - NOTE_R,
        background: "linear-gradient(to right, #100c1e 0%, transparent 100%)",
        zIndex: 20, pointerEvents: "none",
      }} />

      {/* Right fade */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 70,
        background: "linear-gradient(to left, #1a1030 0%, transparent 100%)",
        zIndex: 20, pointerEvents: "none",
      }} />

      {/* Hit-zone glow */}
      <div ref={glowRef} style={{
        position: "absolute", left: PLAYHEAD_X - 36, top: 0, bottom: 0, width: 72,
        background: "radial-gradient(ellipse at center, rgba(255,255,255,0.09) 0%, transparent 70%)",
        zIndex: 4, pointerEvents: "none", transition: "opacity 0.08s",
      }} />

      {/* Hit flash ring — expands + fades on hit */}
      <div ref={hitFlashRef} style={{
        position: "absolute",
        left: PLAYHEAD_X - 40, top: "50%",
        width: 80, height: 80,
        marginTop: -40,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(92,255,150,0.55) 0%, transparent 70%)",
        zIndex: 15, pointerEvents: "none",
        opacity: 0,
        transform: "scale(1)",
        transformOrigin: "center center",
      }} />

      {/* Playhead */}
      <div ref={playheadRef} style={{
        position: "absolute", left: PLAYHEAD_X - 1.5, top: 10, bottom: 10,
        width: 3, borderRadius: 2,
        background: "rgba(255,255,255,0.9)",
        zIndex: 25, transition: "opacity 0.08s, box-shadow 0.08s",
      }} />

      {/* String labels — pinned in the visible area */}
      {[1,2,3,4,5,6].map(s => (
        <div key={`lbl-${s}`} style={{
          position: "absolute", left: 6, top: stringY(s) - 7,
          fontSize: 9, fontWeight: 800,
          color: STRING_COLORS[s], opacity: 0.55,
          zIndex: 22, userSelect: "none",
        }}>{STRING_LABEL[s]}</div>
      ))}

      {/* ── Scrolling track ─────────────────────────────────────────────── */}
      <div ref={trackRef} style={{
        position: "absolute", top: 0, left: 0,
        height: "100%", width: trackWidth,
        willChange: "transform",
        /* transform set by rAF — React won't touch it */
      }}>

        {/* String guide lines */}
        {[1,2,3,4,5,6].map(s => (
          <div key={s} style={{
            position: "absolute", left: 0, right: 0, top: stringY(s), height: 1,
            background: `linear-gradient(to right, transparent 0%, ${STRING_COLORS[s]}22 8%, ${STRING_COLORS[s]}22 92%, transparent 100%)`,
          }} />
        ))}

        {/* Beat ticks */}
        {beatXs.map((bx, i) => (
          <div key={i} style={{
            position: "absolute", left: bx - 0.5, top: 6,
            width: 1, height: 10,
            background: "rgba(255,255,255,0.07)", borderRadius: 1,
          }} />
        ))}

        {/* Notes */}
        {notePositions.map(({ note, cx, cy }) => {
          const status   = noteStatuses.get(note.id) ?? "pending";
          const color    = STRING_COLORS[note.string];
          const isActive = status === "active";
          const isHit    = status === "hit";
          const isMissed = status === "missed";

          const r = isActive ? NOTE_R * 1.28 : NOTE_R;

          const bg     = isHit    ? "#22c55e"
                       : isMissed ? "rgba(239,68,68,0.12)"
                       : isActive ? color
                                  : "rgba(255,255,255,0.04)";
          const bd     = isHit    ? "2px solid #16a34a"
                       : isMissed ? "1.5px solid rgba(239,68,68,0.25)"
                       : isActive ? `2px solid ${color}`
                                  : `1.5px solid ${color}55`;
          const fg     = isHit    ? "white"
                       : isMissed ? "rgba(239,68,68,0.35)"
                       : isActive ? "#0d0a1a"
                                  : color;
          const sh     = isHit    ? "0 0 14px rgba(34,197,94,0.7)"
                       : isActive ? `0 0 18px ${color}cc, 0 0 36px ${color}44`
                                  : "none";

          const missLabel = isMissed && missLabels ? missLabels.get(note.id) : undefined;

          return (
            <div key={note.id} style={{
              position: "absolute",
              left: cx - r, top: cy - r,
              width: r * 2, height: r * 2,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: isActive ? 13 : 11,
              background: bg, border: bd, color: fg, boxShadow: sh,
              animation: isHit ? "noteHitPop 0.4s ease-out" : "none",
              overflow: "visible",
            }}>
              {note.fret === 0 ? "O" : note.fret}
              {missLabel !== undefined && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  marginTop: 3,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  color: missLabel === "silent"
                    ? "rgba(200,180,140,0.38)"
                    : "rgba(239,68,68,0.72)",
                  animation: "missLabelFade 2s ease-out forwards",
                  pointerEvents: "none",
                  userSelect: "none",
                  whiteSpace: "nowrap",
                }}>
                  {missLabel}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Memo: only re-render when note statuses change (not on every pitch detection update)
const TabRail = memo(TabRailInner);
export default TabRail;
