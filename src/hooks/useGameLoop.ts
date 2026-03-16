"use client";

import { useEffect, useRef, useState } from "react";
import { Level, TabNote } from "@/types/tab";
import { PitchState } from "@/hooks/usePitchDetection";
import type { BackingTrackClock } from "@/hooks/useBackingTrack";

// ── Timing constants ──────────────────────────────────────────────────────────
const CENTS_THRESHOLD  = 75;   // ±75¢ = close enough to count as a hit
const LEAD_IN_BEATS    = 4;    // exactly 4 drum beats before note-0 hits the playhead
const HIT_PADDING_MS   = 600;  // generous window: covers output latency + mic buffer + pitch detection + reaction time

function centsOff(detected: number, target: number) {
  return 1200 * Math.log2(detected / target);
}

const NOTE_NAMES_GL = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
function freqToNoteName(f: number): string {
  const midi = 12 * Math.log2(f / 440) + 69;
  const r    = Math.round(midi);
  return NOTE_NAMES_GL[((r % 12) + 12) % 12] + (Math.floor(r / 12) - 1);
}

// ── Types ─────────────────────────────────────────────────────────────────────
export type NoteStatus = "pending" | "active" | "hit" | "missed";

export interface GameLoopReturn {
  noteStatuses : ReadonlyMap<string, NoteStatus>;
  missLabels   : ReadonlyMap<string, string>;   // noteId → note name played, or "silent"
  activeNote   : TabNote | null;   // note currently in its hit window
  score        : number;           // 0–100 percentage
  stars        : 0 | 1 | 2 | 3;
  hits         : number;
  isComplete   : boolean;
  elapsedRef   : React.MutableRefObject<number>; // read by TabRail rAF (no re-renders)
  beatMs       : number;
  leadInMs     : number;
  centsOffset  : number | null;    // for the cents meter
  combo        : number;           // current consecutive hit streak
  maxCombo     : number;           // best streak in this attempt
  lastHitAt    : React.MutableRefObject<number>; // rAF timestamp of last hit (for flash)
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useGameLoop(
  level             : Level,
  pitchData         : PitchState,
  audioClockRef     : React.MutableRefObject<BackingTrackClock>,
  bpmMultiplier     : number = 1,
  mode              : "timed" | "practice" = "timed",
): GameLoopReturn {
  const beatMs   = 60000 / (level.bpm * bpmMultiplier);
  const leadInMs = LEAD_IN_BEATS * beatMs; // always an exact whole number of beats

  // ── Refs — updated every rAF frame, never trigger re-renders ─────────────
  const elapsedRef        = useRef(0);
  const startTimeRef      = useRef<number | null>(null);
  const statusesRef       = useRef<Map<string, NoteStatus>>(new Map());
  const pitchFreqRef      = useRef<number | null>(null);
  const requireReleaseRef = useRef(false);
  const lastHitFreqRef    = useRef<number | null>(null);
  const hitsRef           = useRef(0);
  const comboRef          = useRef(0);
  const maxComboRef       = useRef(0);
  const lastHitAt             = useRef(0);  // rAF timestamp, read by TabRail for flash
  const practiceIdxRef        = useRef(0);  // current note index in practice mode
  const missLabelsRef         = useRef<Map<string, string>>(new Map());
  const activeNoteLastFreqRef = useRef<Map<string, number>>(new Map());

  // ── React state — updated only on meaningful events ───────────────────────
  const [noteStatuses, setNoteStatuses] = useState<Map<string, NoteStatus>>(new Map());
  const [missLabels,   setMissLabels]   = useState<Map<string, string>>(new Map());
  const [hits,         setHits]         = useState(0);
  const [isComplete,   setIsComplete]   = useState(false);
  const [combo,        setCombo]        = useState(0);
  const [maxCombo,     setMaxCombo]     = useState(0);

  // Keep pitch ref current
  useEffect(() => { pitchFreqRef.current = pitchData.frequency; }, [pitchData.frequency]);

  // ── Reset on level change ─────────────────────────────────────────────────
  useEffect(() => {
    const fresh = new Map(level.notes.map(n => [n.id, "pending" as NoteStatus]));
    statusesRef.current             = fresh;
    startTimeRef.current            = null;
    elapsedRef.current              = 0;
    requireReleaseRef.current       = false;
    lastHitFreqRef.current          = null;
    hitsRef.current                 = 0;
    comboRef.current                = 0;
    maxComboRef.current             = 0;
    lastHitAt.current               = 0;
    practiceIdxRef.current          = 0;
    missLabelsRef.current           = new Map();
    activeNoteLastFreqRef.current   = new Map();
    setNoteStatuses(new Map(fresh));
    setMissLabels(new Map());
    setHits(0);
    setCombo(0);
    setMaxCombo(0);
    setIsComplete(false);
  }, [level.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── rAF game loop — starts when mic is on ────────────────────────────────
  useEffect(() => {
    if (!pitchData.isListening) return;

    // Fresh reset at start of each listening session
    const fresh = new Map(level.notes.map(n => [n.id, "pending" as NoteStatus]));
    statusesRef.current             = fresh;
    startTimeRef.current            = null; // set on first audio-clock tick from audioClockRef
    elapsedRef.current              = 0;
    requireReleaseRef.current       = false;
    lastHitFreqRef.current          = null;
    hitsRef.current                 = 0;
    comboRef.current                = 0;
    maxComboRef.current             = 0;
    lastHitAt.current               = 0;
    practiceIdxRef.current          = 0;
    missLabelsRef.current           = new Map();
    activeNoteLastFreqRef.current   = new Map();
    setNoteStatuses(new Map(fresh));
    setMissLabels(new Map());
    setHits(0);
    setCombo(0);
    setMaxCombo(0);
    setIsComplete(false);

    let cancelled = false;

    function tick(ts: number) {
      if (cancelled) return;

      // ── Practice mode — note-index driven, no misses, smooth tab scroll ──
      if (mode === "practice") {
        // Release detector
        if (requireReleaseRef.current) {
          const f = pitchFreqRef.current;
          if (!f) {
            requireReleaseRef.current = false;
          } else if (lastHitFreqRef.current && Math.abs(centsOff(f, lastHitFreqRef.current)) > 150) {
            requireReleaseRef.current = false;
          }
        }

        const idx   = practiceIdxRef.current;
        const notes = level.notes;

        if (idx >= notes.length) { setIsComplete(true); return; }

        const targetNote    = notes[idx];
        const targetElapsed = targetNote.startBeat * beatMs + leadInMs;

        // Lerp elapsedRef toward the current note's position for smooth scroll
        const cur  = elapsedRef.current;
        const diff = targetElapsed - cur;
        elapsedRef.current = Math.abs(diff) < 1 ? targetElapsed : cur + diff * 0.10;

        let changed = false;

        // Ensure current note is marked active
        if (statusesRef.current.get(targetNote.id) === "pending") {
          statusesRef.current.set(targetNote.id, "active");
          changed = true;
        }

        // Check pitch match
        const freq = pitchFreqRef.current;
        if (freq && !requireReleaseRef.current) {
          const cents = centsOff(freq, targetNote.targetFrequency);
          if (Math.abs(cents) <= CENTS_THRESHOLD) {
            statusesRef.current.set(targetNote.id, "hit");
            requireReleaseRef.current = true;
            lastHitFreqRef.current    = targetNote.targetFrequency;
            hitsRef.current++;
            comboRef.current++;
            if (comboRef.current > maxComboRef.current) maxComboRef.current = comboRef.current;
            lastHitAt.current = ts;
            practiceIdxRef.current++;
            changed = true;
          }
        }

        if (changed) {
          setNoteStatuses(new Map(statusesRef.current));
          setHits(hitsRef.current);
          setCombo(comboRef.current);
          setMaxCombo(maxComboRef.current);
        }

        if (practiceIdxRef.current >= notes.length) { setIsComplete(true); return; }
        requestAnimationFrame(tick);
        return;
      }
      // Timed mode: drive gameplay from the same audio clock as the drums.
      const audioClock = audioClockRef.current;
      if (!audioClock.ctx || audioClock.startAtSec === null) {
        elapsedRef.current = 0;
        requestAnimationFrame(tick);
        return;
      }
      if (startTimeRef.current === null) {
        startTimeRef.current = (audioClock.startAtSec + audioClock.outputLatencySec) * 1000;
      }
      const elapsed = Math.max(0, audioClock.ctx.currentTime * 1000 - startTimeRef.current);
      elapsedRef.current = elapsed;


      let changed      = false;
      let resolvedCount = 0;

      // ── Release detector: prevents the same sustained pitch instantly ──────
      // triggering the next note. Player must go silent or play a new note.
      if (requireReleaseRef.current) {
        const freq = pitchFreqRef.current;
        if (!freq) {
          requireReleaseRef.current = false;               // silence = released
        } else if (lastHitFreqRef.current) {
          if (Math.abs(centsOff(freq, lastHitFreqRef.current)) > 150) {
            requireReleaseRef.current = false;             // different pitch = released
          }
        }
      }

      // ── Score each note by time ───────────────────────────────────────────
      for (const note of level.notes) {
        const cur = statusesRef.current.get(note.id)!;

        if (cur === "hit")    { resolvedCount++; continue; }
        if (cur === "missed") { resolvedCount++; continue; }

        const tStart   = note.startBeat * beatMs + leadInMs;
        const tEnd     = (note.startBeat + note.durationBeats) * beatMs + leadInMs;
        const winStart = tStart - HIT_PADDING_MS;
        const winEnd   = tEnd   + HIT_PADDING_MS;

        if (elapsed > winEnd) {
          statusesRef.current.set(note.id, "missed");
          const lastFreq = activeNoteLastFreqRef.current.get(note.id);
          missLabelsRef.current.set(note.id, lastFreq ? freqToNoteName(lastFreq) : "silent");
          // Break combo on miss
          comboRef.current = 0;
          resolvedCount++;
          changed = true;
        } else if (elapsed >= winStart) {
          if (cur === "pending") {
            statusesRef.current.set(note.id, "active");
            changed = true;
          }
          const freq = pitchFreqRef.current;
          // Track last detected freq for miss label (in case this note is missed)
          if (freq) activeNoteLastFreqRef.current.set(note.id, freq);
          if (freq && !requireReleaseRef.current) {
            const cents = centsOff(freq, note.targetFrequency);
            if (Math.abs(cents) <= CENTS_THRESHOLD) {
              statusesRef.current.set(note.id, "hit");
              requireReleaseRef.current = true;
              lastHitFreqRef.current    = note.targetFrequency;
              hitsRef.current++;
              comboRef.current++;
              if (comboRef.current > maxComboRef.current) {
                maxComboRef.current = comboRef.current;
              }
              lastHitAt.current = ts;
              resolvedCount++;
              changed = true;
            }
          }
        }
      }

      if (changed) {
        setNoteStatuses(new Map(statusesRef.current));
        setMissLabels(new Map(missLabelsRef.current));
        setHits(hitsRef.current);
        setCombo(comboRef.current);
        setMaxCombo(maxComboRef.current);
      }

      // ── End-of-level ──────────────────────────────────────────────────────
      const lastNote  = level.notes[level.notes.length - 1];
      const gameEndMs = (lastNote.startBeat + lastNote.durationBeats) * beatMs
                      + leadInMs + HIT_PADDING_MS;
      const allDone   = resolvedCount === level.notes.length;

      if (allDone || elapsed > gameEndMs) {
        let extra = false;
        for (const note of level.notes) {
          const s = statusesRef.current.get(note.id)!;
          if (s === "pending" || s === "active") {
            statusesRef.current.set(note.id, "missed");
            const lastFreq = activeNoteLastFreqRef.current.get(note.id);
            missLabelsRef.current.set(note.id, lastFreq ? freqToNoteName(lastFreq) : "silent");
            extra = true;
          }
        }
        if (extra) {
          setNoteStatuses(new Map(statusesRef.current));
          setMissLabels(new Map(missLabelsRef.current));
        }
        setIsComplete(true);
        return;
      }

      requestAnimationFrame(tick);
    }

    const rafId = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(rafId); };
  }, [pitchData.isListening, level.id, bpmMultiplier, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived values ────────────────────────────────────────────────────────
  const total   = level.notes.length;
  const score   = total ? Math.round(hits / total * 100) : 0;
  // Stars: 3★=80%, 2★=60%, 1★=40% (more achievable & encouraging)
  const stars: 0|1|2|3 = score >= 80 ? 3 : score >= 60 ? 2 : score >= 40 ? 1 : 0;
  const activeNote = level.notes.find(n => noteStatuses.get(n.id) === "active") ?? null;
  const centsOffset = activeNote && pitchData.frequency
    ? centsOff(pitchData.frequency, activeNote.targetFrequency)
    : null;

  return { noteStatuses, missLabels, activeNote, score, stars, hits, isComplete,
           elapsedRef, beatMs, leadInMs: leadInMs, centsOffset,
           combo, maxCombo, lastHitAt };
}
