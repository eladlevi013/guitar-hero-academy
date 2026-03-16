"use client";

import { useCallback, useRef, useState } from "react";
import { TabNote } from "@/types/tab";

const SCHEDULE_AHEAD_SEC = 0.12;

function playKick(ctx: AudioContext, dest: AudioNode, t: number) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(160, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
  gain.gain.setValueAtTime(1.0, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(t);
  osc.stop(t + 0.4);
}

function playSnare(ctx: AudioContext, dest: AudioNode, t: number) {
  const len  = Math.floor(ctx.sampleRate * 0.15);
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 0.8);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 1800;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.55, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  src.connect(hpf);
  hpf.connect(g);
  g.connect(dest);
  src.start(t);
  src.stop(t + 0.18);

  const osc = ctx.createOscillator();
  const og  = ctx.createGain();
  osc.frequency.value = 180;
  og.gain.setValueAtTime(0.3, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
  osc.connect(og);
  og.connect(dest);
  osc.start(t);
  osc.stop(t + 0.08);
}

function playHat(ctx: AudioContext, dest: AudioNode, t: number, vol = 0.18) {
  const len  = Math.floor(ctx.sampleRate * 0.04);
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 8000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
  src.connect(hpf);
  hpf.connect(g);
  g.connect(dest);
  src.start(t);
  src.stop(t + 0.045);
}

function playCrash(ctx: AudioContext, dest: AudioNode, t: number) {
  const len  = Math.floor(ctx.sampleRate * 1.0);
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 0.35);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 4000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.28, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
  src.connect(hpf);
  hpf.connect(g);
  g.connect(dest);
  src.start(t);
  src.stop(t + 1.0);
}

export interface BackingTrackClock {
  ctx: AudioContext | null;
  startAtSec: number | null;
  outputLatencySec: number;
}

const EMPTY_CLOCK: BackingTrackClock = {
  ctx: null,
  startAtSec: null,
  outputLatencySec: 0,
};

export function useBackingTrack() {
  const ctxRef        = useRef<AudioContext | null>(null);
  const timerRef      = useRef<number | null>(null);
  const masterRef     = useRef<GainNode | null>(null);
  const audioClockRef = useRef<BackingTrackClock>({ ...EMPTY_CLOCK });

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolState]     = useState(0.7);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    masterRef.current = null;
    audioClockRef.current = { ...EMPTY_CLOCK };
    setIsPlaying(false);
  }, []);

  const start = useCallback((beatMs: number, notes: TabNote[], leadInMs: number) => {
    stop();

    const ctx = new AudioContext();
    void ctx.resume().catch(() => {});
    ctxRef.current = ctx;

    const outputLatencySec = (ctx as AudioContext & { outputLatency?: number }).outputLatency
                          ?? ctx.baseLatency
                          ?? 0;
    const startAtSec = ctx.currentTime + SCHEDULE_AHEAD_SEC;
    audioClockRef.current = { ctx, startAtSec, outputLatencySec };

    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    masterRef.current = master;

    const beatSec     = beatMs / 1000;
    const leadInSec   = leadInMs / 1000;
    const leadInBeats = Math.round(leadInSec / beatSec);
    const lastNote    = notes.length > 0 ? notes[notes.length - 1] : null;
    const songBeats   = lastNote ? lastNote.startBeat + lastNote.durationBeats + 4 : 8;
    const totalBeats  = leadInBeats + songBeats;

    for (let b = 0; b < totalBeats; b++) {
      const t       = startAtSec + b * beatSec;
      const barBeat = b % 4;

      if (barBeat === 0) playKick(ctx, master, t);
      if (barBeat === 2) playSnare(ctx, master, t);
      playHat(ctx, master, t);
      if (b < totalBeats - 1) {
        playHat(ctx, master, t + beatSec * 0.5, 0.09);
      }
    }

    if (notes.length > 0) {
      playCrash(ctx, master, startAtSec + leadInSec);
    }

    setIsPlaying(true);
    const totalMs = ((startAtSec - ctx.currentTime) + totalBeats * beatSec + 2) * 1000;
    timerRef.current = window.setTimeout(() => stop(), totalMs);
  }, [volume, stop]);

  const setVolume = useCallback((v: number) => {
    setVolState(v);
    if (masterRef.current) masterRef.current.gain.value = v;
  }, []);

  return { isPlaying, start, stop, volume, setVolume, audioClockRef };
}
