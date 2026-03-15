"use client";

import { useRef, useState, useCallback } from "react";
import { TabNote } from "@/types/tab";

// ── Drum synthesis ─────────────────────────────────────────────────────────────

function playKick(ctx: AudioContext, dest: AudioNode, t: number) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.08);
  gain.gain.setValueAtTime(0.9, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  osc.connect(gain); gain.connect(dest);
  osc.start(t); osc.stop(t + 0.3);
}

function playSnare(ctx: AudioContext, dest: AudioNode, t: number) {
  const len  = Math.floor(ctx.sampleRate * 0.12);
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass"; hpf.frequency.value = 2200;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.5, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
  src.connect(hpf); hpf.connect(g); g.connect(dest);
  src.start(t); src.stop(t + 0.15);
  const osc = ctx.createOscillator();
  const og  = ctx.createGain();
  osc.frequency.value = 190;
  og.gain.setValueAtTime(0.28, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  osc.connect(og); og.connect(dest);
  osc.start(t); osc.stop(t + 0.09);
}

function playHat(ctx: AudioContext, dest: AudioNode, t: number, vol = 0.13) {
  const len  = Math.floor(ctx.sampleRate * 0.045);
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass"; hpf.frequency.value = 9000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  src.connect(hpf); hpf.connect(g); g.connect(dest);
  src.start(t); src.stop(t + 0.05);
}

// ── Guitar pluck synthesis ─────────────────────────────────────────────────────
// Sawtooth + subtle square for harmonic richness, low-pass filter swept down
// to simulate the natural brightness→mellow decay of a plucked string.
function playPluck(
  ctx: AudioContext, dest: AudioNode,
  freq: number, t: number, durBeats: number, beatSec: number
) {
  const attackSec  = 0.008;
  const sustainSec = Math.min(durBeats * beatSec * 0.85, 1.6);

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const o2g  = ctx.createGain();
  const filt = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc1.type = "sawtooth"; osc1.frequency.value = freq;
  osc2.type = "square";   osc2.frequency.value = freq;
  o2g.gain.value = 0.08;

  filt.type = "lowpass";
  filt.frequency.setValueAtTime(3200, t);
  filt.frequency.exponentialRampToValueAtTime(600, t + attackSec + sustainSec * 0.4);
  filt.Q.value = 0.7;

  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.38, t + attackSec);
  gain.gain.exponentialRampToValueAtTime(0.12, t + attackSec + sustainSec * 0.35);
  gain.gain.exponentialRampToValueAtTime(0.001, t + attackSec + sustainSec);

  osc1.connect(filt);
  osc2.connect(o2g); o2g.connect(filt);
  filt.connect(gain); gain.connect(dest);

  const end = t + attackSec + sustainSec + 0.02;
  osc1.start(t); osc1.stop(end);
  osc2.start(t); osc2.stop(end);
}

// Warm sub-octave bass for low-register notes
function playBass(ctx: AudioContext, dest: AudioNode, freq: number, t: number, beatSec: number) {
  const osc  = ctx.createOscillator();
  const filt = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  osc.type = "sawtooth"; osc.frequency.value = freq / 2;
  filt.type = "lowpass"; filt.frequency.value = 380; filt.Q.value = 1.2;
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.28, t + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.001, t + Math.min(beatSec * 0.9, 1.1));
  osc.connect(filt); filt.connect(gain); gain.connect(dest);
  osc.start(t); osc.stop(t + Math.min(beatSec * 0.95, 1.2));
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useBackingTrack() {
  const ctxRef    = useRef<AudioContext | null>(null);
  const timerRef  = useRef<number | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolState]     = useState(0.55);

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
   * Start the backing track.
   *
   * @param bpm      Beats per minute of the level
   * @param notes    The level's note array — each note is synthesised as a guitar
   *                 pluck and fires at the EXACT same audio time it crosses the hit
   *                 line on screen, giving perfect music-tab synchronisation.
   * @param leadInMs Lead-in period in ms (drums-only count-in before beat 0).
   */
  const start = useCallback((bpm: number, notes: TabNote[], leadInMs: number) => {
    stop();

    const ctx    = new AudioContext();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    masterRef.current = master;

    const beatSec   = 60 / bpm;
    const leadInSec = leadInMs / 1000;
    const now       = ctx.currentTime;

    const lastNote   = notes.length > 0 ? notes[notes.length - 1] : null;
    const songBeats  = lastNote ? lastNote.startBeat + lastNote.durationBeats + 2 : 8;
    const totalBeats = Math.ceil(leadInSec / beatSec) + songBeats + 2;

    // ── Drums ─────────────────────────────────────────────────────────────────
    for (let b = 0; b < totalBeats; b++) {
      const t   = now + b * beatSec;
      const mod = b % 4;
      if (mod === 0) playKick(ctx, master, t);
      if (mod === 2) playSnare(ctx, master, t);
      playHat(ctx, master, t);
      // Lighter off-beat hi-hat
      if (b < totalBeats - 1) playHat(ctx, master, t + beatSec * 0.5, 0.07);
    }

    setIsPlaying(true);
    const totalMs = (totalBeats * beatSec + 1.5) * 1000;
    timerRef.current = window.setTimeout(() => stop(), totalMs);
  }, [volume, stop]); // eslint-disable-line

  const setVolume = useCallback((v: number) => {
    setVolState(v);
    if (masterRef.current) masterRef.current.gain.value = v;
  }, []);

  return { isPlaying, start, stop, volume, setVolume };
}
