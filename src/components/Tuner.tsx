"use client";

import { usePitchDetection } from "@/hooks/usePitchDetection";

const CENTS_RANGE = 50;

function CentsMeter({ cents }: { cents: number }) {
  // clamp to -50..+50
  const clamped = Math.max(-CENTS_RANGE, Math.min(CENTS_RANGE, cents));
  const pct = ((clamped + CENTS_RANGE) / (CENTS_RANGE * 2)) * 100;
  const inTune = Math.abs(cents) <= 10;

  return (
    <div className="w-full max-w-xs">
      <div className="relative h-4 rounded-full bg-gray-700 overflow-hidden">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-500 -translate-x-1/2 z-10" />
        {/* Needle */}
        <div
          className="absolute top-1 h-2 w-2 rounded-full -translate-x-1/2 transition-all duration-75"
          style={{
            left: `${pct}%`,
            backgroundColor: inTune ? "#22c55e" : Math.abs(cents) <= 25 ? "#eab308" : "#ef4444",
            boxShadow: inTune ? "0 0 8px #22c55e" : "none",
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
        <span>-50¢</span>
        <span>0</span>
        <span>+50¢</span>
      </div>
    </div>
  );
}

function VolumeMeter({ volume }: { volume: number }) {
  const pct = Math.min(1, volume * 10) * 100;
  return (
    <div className="w-full max-w-xs">
      <div className="h-1.5 rounded-full bg-gray-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-75"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-0.5 text-right">mic</p>
    </div>
  );
}

export default function Tuner() {
  const { note, volume, isListening, error, start, stop } = usePitchDetection();

  // cents is inside note
  const noteCents = note?.cents ?? 0;
  const inTune = note !== null && Math.abs(noteCents) <= 10;

  return (
    <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl w-full max-w-sm">
      <h2 className="text-lg font-semibold text-gray-300 tracking-widest uppercase">Tuner</h2>

      {/* Main note display */}
      <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-4 transition-all duration-150"
        style={{
          borderColor: !note ? "#374151" : inTune ? "#22c55e" : "#ef4444",
          boxShadow: !note ? "none" : inTune ? "0 0 30px #22c55e55" : "0 0 20px #ef444433",
        }}
      >
        {note ? (
          <div className="text-center">
            <p
              className="text-5xl font-bold tracking-tight transition-all"
              style={{ color: inTune ? "#22c55e" : "#f9fafb" }}
            >
              {note.name}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {note.frequency.toFixed(1)} Hz
            </p>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">{isListening ? "Play a note…" : "—"}</p>
        )}
      </div>

      {/* Cents meter */}
      {note && (
        <div className="flex flex-col items-center gap-1 w-full">
          <p className="text-sm text-gray-400">
            {noteCents > 0 ? `+${noteCents}¢ sharp` : noteCents < 0 ? `${noteCents}¢ flat` : "In tune!"}
          </p>
          <CentsMeter cents={noteCents} />
        </div>
      )}

      {/* Volume meter */}
      {isListening && <VolumeMeter volume={volume} />}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      {/* Controls */}
      <button
        onClick={isListening ? stop : start}
        className="px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: isListening ? "#374151" : "#22c55e",
          color: isListening ? "#9ca3af" : "#fff",
          boxShadow: isListening ? "none" : "0 0 20px #22c55e55",
        }}
      >
        {isListening ? "Stop Listening" : "Start Tuner"}
      </button>

      <p className="text-xs text-gray-600 text-center">
        Detects guitar range (E2–E6) · YIN algorithm
      </p>
    </div>
  );
}
