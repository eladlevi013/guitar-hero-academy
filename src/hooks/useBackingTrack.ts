"use client";

import { useRef, useState, useCallback } from "react";
import { TabNote } from "@/types/tab";

// ── Kick drum ──────────────────────────────────────────────────────────────────
function playKick(ctx: AudioContext, dest: AudioNode, t: number) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(160, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
  gain.gain.setValueAtTime(1.0, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  osc.connect(gain); gain.connect(dest);
  osc.start(t); osc.stop(t + 0.4);
}

// ── Snare ──────────────────────────────────────────────────────────────────────
function playSnare(ctx: AudioContext, dest: AudioNode, t: number) {
  const len  = Math.floor(ctx.sampleRate * 0.15);
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 0.8);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass"; hpf.frequency.value = 1800;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.55, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  src.connect(hpf); hpf.connect(g); g.connect(dest);
  src.start(t); src.stop(t + 0.18);
  // Body tone
  const osc = ctx.createOscillator();
  const og  = ctx.createGain();
  osc.frequency.value = 180;
  og.gain.setValueAtTime(0.3, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
  osc.connect(og); og.connect(dest);
  osc.start(t); osc.stop(t + 0.08);
}

// ── Hi-hat ─────────────────────────────────────────────────────────────────────
function playHat(ctx: AudioContext, dest: AudioNode, t: number, vol = 0.18) {
  const len  = Math.floor(ctx.sampleRate * 0.04);
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass"; hpf.frequency.value = 8000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
  src.connect(hpf); hpf.connect(g); g.connect(dest);
  src.start(t); src.stop(t + 0.045);
}

// ── Crash — marks the first note ──────────────────────────────────────────────
function playCrash(ctx: AudioContext, dest: AudioNode, t: number) {
  const len  = Math.floor(ctx.sampleRate * 1.0);
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 0.35);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass"; hpf.frequency.value = 4000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.28, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
  src.connect(hpf); hpf.connect(g); g.connect(dest);
  src.start(t); src.stop(t + 1.0);
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useBackingTrack() {
  const ctxRef            = useRef<AudioContext | null>(null);
  const timerRef          = useRef<number | null>(null);
  const masterRef         = useRef<GainNode | null>(null);
  const audioWallStartRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolState]     = useState(0.7);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    ctxRef.current?.close().catch(() => {});
    ctxRef.current    = null;
    masterRef.current = null;
    setIsPlaying(false);
  }, []);

  /**
   * Start the drum backing track.
   *
   * Drums only — no bass, no pad, no guide melody.  Clean and clear so the
   * player's own guitar is the only pitched sound they hear.
   *
   * The kick fires on every note's exact start beat so the drum literally says
   * "play this note NOW."  The snare provides backbeat groove on bar-beat 3.
   *
   * Timing: audioWallStartRef is shifted forward by the audio output latency so
   * the game's visual playhead lines up with when the player HEARS the kick,
   * not when it was scheduled.
   */
  const start = useCallback((bpm: number, notes: TabNote[], leadInMs: number, userLatencyOffsetMs = 100) => {
    stop();

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // Shift the game-clock reference by output latency so the note hits the
    // visual playhead exactly when the player HEARS the kick drum.
    //
    // browser.outputLatency is unreliable (often 0 on Windows Chrome/Edge).
    // userLatencyOffsetMs is a user-adjustable correction — default 100ms
    // covers the typical Windows Chrome case where outputLatency = 0 but
    // real hardware latency is 80–200 ms.
    const rawLatency = (ctx as AudioContext & { outputLatency?: number }).outputLatency
                    ?? ctx.baseLatency
                    ?? 0;
    const detectedMs = Math.max(0, rawLatency * 1000);
    audioWallStartRef.current = performance.now() + detectedMs + userLatencyOffsetMs;

    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    masterRef.current = master;

    const beatSec     = 60 / bpm;
    const leadInSec   = leadInMs / 1000;
    const leadInBeats = Math.round(leadInSec / beatSec); // = LEAD_IN_BEATS (4)
    const now         = ctx.currentTime;

    const lastNote   = notes.length > 0 ? notes[notes.length - 1] : null;
    const songBeats  = lastNote ? lastNote.startBeat + lastNote.durationBeats + 4 : 8;
    const totalBeats = leadInBeats + songBeats;

    // Set of song-beat positions where notes start
    const noteStartBeats = new Set(notes.map(n => n.startBeat));

    // ── Drums ─────────────────────────────────────────────────────────────────
    // Count-in: steady kick every 4 beats, snare on beat 3, hat every beat.
    // Song:     kick on every note's start beat, snare on bar-beat 3, hat every beat.
    for (let b = 0; b < totalBeats; b++) {
      const t        = now + b * beatSec;
      const songBeat = b - leadInBeats; // negative = count-in

      const isNotebeat = songBeat >= 0 && noteStartBeats.has(songBeat);
      const isCountIn  = songBeat < 0;

      // Kick
      if (isNotebeat || (isCountIn && b % 4 === 0)) {
        playKick(ctx, master, t);
      }

      // Snare: bar beat 3 (backbeat)
      if (b % 4 === 2) {
        playSnare(ctx, master, t);
      }

      // Hi-hat on every beat
      playHat(ctx, master, t);

      // Lighter off-beat hi-hat
      if (b < totalBeats - 1) {
        playHat(ctx, master, t + beatSec * 0.5, 0.09);
      }
    }

    // Crash on the first note (song downbeat)
    if (notes.length > 0) {
      playCrash(ctx, master, now + leadInSec);
    }

    setIsPlaying(true);
    const totalMs = (totalBeats * beatSec + 2) * 1000;
    timerRef.current = window.setTimeout(() => stop(), totalMs);
  }, [volume, stop]); // eslint-disable-line

  const setVolume = useCallback((v: number) => {
    setVolState(v);
    if (masterRef.current) masterRef.current.gain.value = v;
  }, []);

  return { isPlaying, start, stop, volume, setVolume, audioWallStartRef };
}
