"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { yin, frequencyToNote, DetectedNote } from "@/lib/yin";

const BUFFER_SIZE = 2048;
const SAMPLE_RATE = 44100;
const MIN_VOLUME = 0.01; // silence gate — ignore very quiet signals

export interface PitchState {
  note: DetectedNote | null;
  frequency: number | null;
  volume: number;
  isListening: boolean;
  error: string | null;
}

export function usePitchDetection() {
  const [state, setState] = useState<PitchState>({
    note: null,
    frequency: null,
    volume: 0,
    isListening: false,
    error: null,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const bufferRef = useRef<Float32Array<ArrayBuffer>>(new Float32Array(BUFFER_SIZE));

  const stop = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    setState((s) => ({ ...s, isListening: false, note: null, frequency: null, volume: 0 }));
  }, []);

  const start = useCallback(async () => {
    if (state.isListening) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = BUFFER_SIZE;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      setState((s) => ({ ...s, isListening: true, error: null }));

      const tick = () => {
        analyser.getFloatTimeDomainData(bufferRef.current);

        // Volume RMS
        let sumSq = 0;
        for (let i = 0; i < bufferRef.current.length; i++) {
          sumSq += bufferRef.current[i] ** 2;
        }
        const volume = Math.sqrt(sumSq / bufferRef.current.length);

        if (volume < MIN_VOLUME) {
          setState((s) => ({ ...s, volume, note: null, frequency: null }));
        } else {
          const freq = yin(bufferRef.current, ctx.sampleRate);
          if (freq > 0 && freq >= 60 && freq <= 1400) {
            const note = frequencyToNote(freq);
            setState((s) => ({ ...s, volume, frequency: freq, note }));
          } else {
            setState((s) => ({ ...s, volume, note: null, frequency: null }));
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
