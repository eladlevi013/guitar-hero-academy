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
   * beatMs is the exact same value useGameLoop uses to advance the tab rail —
   * passed in directly so both clocks share the identical float and are
   * mathematically locked with no BPM re-derivation.
   *
   * Pattern (4/4): kick beat 1, snare beat 3, hi-hat every beat + off-beat.
   * No per-note kicks — the groove is a steady bar pattern across the whole song.
   */
  const start = useCallback((beatMs: number, notes: TabNote[], leadInMs: number) => {
    stop();

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const outputLatency = (ctx as AudioContext & { outputLatency?: number }).outputLatency
                       ?? ctx.baseLatency
                       ?? 0;
    audioWallStartRef.current = performance.now() + Math.max(0, outputLatency * 1000);
    console.log("[BackingTrack] outputLatency:", outputLatency.toFixed(4), "s");

    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    masterRef.current = master;

    // Use the caller's beatMs directly — same float as the game loop clock.
    const beatSec     = beatMs / 1000;
    const leadInSec   = leadInMs / 1000;
    const leadInBeats = Math.round(leadInSec / beatSec); // = LEAD_IN_BEATS (4)
    const now         = ctx.currentTime;
    const safeT       = (t: number) => Math.max(ctx.currentTime + 0.001, t);

    const lastNote   = notes.length > 0 ? notes[notes.length - 1] : null;
    const songBeats  = lastNote ? lastNote.startBeat + lastNote.durationBeats + 4 : 8;
    const totalBeats = leadInBeats + songBeats;

    // ── Drums — strict 4/4 bar pattern ────────────────────────────────────────
    // Shift every event back by outputLatency so sound arrives at speakers in sync
    // with when the game loop expects the beat to land.
    for (let b = 0; b < totalBeats; b++) {
      const t       = safeT(now + b * beatSec - outputLatency);
      const barBeat = b % 4; // 0 = beat 1, 2 = beat 3

      if (barBeat === 0) playKick(ctx, master, t);   // beat 1
      if (barBeat === 2) playSnare(ctx, master, t);  // beat 3
      playHat(ctx, master, t);                        // every beat
      if (b < totalBeats - 1) {
        playHat(ctx, master, safeT(t + beatSec * 0.5), 0.09); // off-beat
      }
    }

    // Crash cymbal on the song downbeat (first note)
    if (notes.length > 0) {
      playCrash(ctx, master, safeT(now + leadInSec - outputLatency));
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
