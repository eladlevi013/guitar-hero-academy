"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { yin, frequencyToNote, DetectedNote } from "@/lib/yin";

// ── Audio constants ───────────────────────────────────────────────────────────
// 4096 samples @ 44100 Hz = ~93 ms window.
// Low E (82 Hz) has a period of ~537 samples → ~3.8 cycles per buffer — enough
// for reliable YIN detection. Halving from 8192 cuts YIN cost 4× (O(n²)).
const BUFFER_SIZE    = 4096;
const SAMPLE_RATE    = 44100;
// Very low silence gate — acoustic guitars are naturally quiet, especially
// when the mic isn't right in front of the soundhole.
const MIN_VOLUME     = 0.0018;
// Skip pitch detection for the first N frames (~300 ms @ 60 fps).
// The analyser's 4096-sample buffer takes ~93 ms to fill with real mic data;
// any ambient noise hitting YIN before that produces garbage frequencies.
const WARMUP_FRAMES  = 18;

export interface PitchState {
  note: DetectedNote | null;
  frequency: number | null;
  volume: number;
  isListening: boolean;
  error: string | null;
}

export function usePitchDetection() {
  const [state, setState] = useState<PitchState>({
    note: null, frequency: null, volume: 0, isListening: false, error: null,
  });

  const audioCtxRef    = useRef<AudioContext | null>(null);
  const analyserRef    = useRef<AnalyserNode | null>(null);
  const sourceRef      = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef      = useRef<MediaStream | null>(null);
  const animFrameRef   = useRef<number | null>(null);
  const bufferRef      = useRef<Float32Array<ArrayBuffer>>(new Float32Array(BUFFER_SIZE));
  const frameCountRef  = useRef(0); // throttle: only run YIN every 3rd frame

  const stop = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    sourceRef.current   = null;
    streamRef.current   = null;
    setState((s) => ({ ...s, isListening: false, note: null, frequency: null, volume: 0 }));
  }, []);

  const start = useCallback(async () => {
    if (state.isListening) return;

    try {
      // Disable ALL browser audio processing — these actively destroy guitar signal:
      //   echoCancellation → treats a sustained note's ring as echo and removes it
      //   noiseSuppression → classifies guitar harmonics as background noise
      //   autoGainControl  → constantly adjusts level, mangling attack/decay
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl:  false,
          sampleRate:       SAMPLE_RATE,
        },
        video: false,
      });
      streamRef.current = stream;

      const ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
      // iOS Safari requires explicit resume() after creation — AudioContext
      // starts in "suspended" state until a user gesture resumes it.
      await ctx.resume();
      audioCtxRef.current = ctx;

      // ── Signal chain ──────────────────────────────────────────────────────
      // source → compressor → gain → analyser
      //
      // DynamicsCompressor: normalises acoustic guitar's wide dynamic range.
      // Quiet notes (soft pick, far mic) get boosted; loud notes get tamed.
      // This is the single biggest improvement for acoustic detection.
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -24;  // start compressing at -24 dB
      compressor.knee.value      = 12;   // soft knee
      compressor.ratio.value     = 12;   // 12:1 — near-limiting, keeps level consistent
      compressor.attack.value    = 0.002; // 2 ms — fast enough to catch pick attack
      compressor.release.value   = 0.12;  // 120 ms release

      // Gain node: lift the compressed signal so it's well above the silence gate
      const gain = ctx.createGain();
      gain.gain.value = 4;               // ×4 (≈ +12 dB) boost

      const analyser = ctx.createAnalyser();
      analyser.fftSize              = BUFFER_SIZE;
      analyser.smoothingTimeConstant = 0; // raw, unsmoothed time-domain data for YIN
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(compressor);
      compressor.connect(gain);
      gain.connect(analyser);
      sourceRef.current = source;

      setState((s) => ({ ...s, isListening: true, error: null }));

      frameCountRef.current = 0;

      const tick = () => {
        frameCountRef.current++;

        // Warmup: let the audio subsystem stabilise before running YIN.
        if (frameCountRef.current <= WARMUP_FRAMES) {
          animFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        // Run YIN every 3rd frame (~20 fps) — the algorithm is O(n²) on 8192
        // samples so calling it every 60fps frame burns ~1B ops/sec and causes lag.
        // 20fps is more than fast enough for guitar note detection.
        if (frameCountRef.current % 3 === 0) {
          analyser.getFloatTimeDomainData(bufferRef.current);

          // RMS volume (measured before applying threshold)
          let sumSq = 0;
          for (let i = 0; i < bufferRef.current.length; i++) {
            sumSq += bufferRef.current[i] ** 2;
          }
          const volume = Math.sqrt(sumSq / bufferRef.current.length);

          if (volume < MIN_VOLUME) {
            setState((s) => ({ ...s, volume, note: null, frequency: null }));
          } else {
            const freq = yin(bufferRef.current, ctx.sampleRate);
            // Guitar range: low E2 (82 Hz) to high frets on e string (~1300 Hz)
            if (freq > 0 && freq >= 60 && freq <= 1500) {
              const note = frequencyToNote(freq);
              setState((s) => ({ ...s, volume, frequency: freq, note }));
            } else {
              setState((s) => ({ ...s, volume, note: null, frequency: null }));
            }
          }
        }

        animFrameRef.current = requestAnimationFrame(tick);
      };

      animFrameRef.current = requestAnimationFrame(tick);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Microphone access denied";
      setState((s) => ({ ...s, error: msg, isListening: false }));
    }
  }, [state.isListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      sourceRef.current?.disconnect();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close();
    };
  }, []);

  return { ...state, start, stop };
}
