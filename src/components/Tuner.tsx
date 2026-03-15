"use client";

import { usePitchDetection } from "@/hooks/usePitchDetection";

const CENTS_RANGE = 50;

function CentsMeter({ cents }: { cents: number }) {
  const clamped = Math.max(-CENTS_RANGE, Math.min(CENTS_RANGE, cents));
  const pct     = ((clamped + CENTS_RANGE) / (CENTS_RANGE * 2)) * 100;
  const inTune  = Math.abs(cents) <= 10;
  const color   = inTune ? "#2ed573" : Math.abs(cents) <= 25 ? "#f5a623" : "#ff4757";

  return (
    <div className="w-full max-w-xs">
      <div className="relative h-4 rounded-full overflow-hidden" style={{ background: "#252847" }}>
        <div className="absolute left-1/2 top-0 w-px h-full -translate-x-1/2 z-10" style={{ background: "#f5a62350" }} />
        <div
          className="absolute top-1 h-2 w-2 rounded-full -translate-x-1/2 transition-all duration-75"
          style={{
            left: `${pct}%`,
            background: color,
            boxShadow: inTune ? `0 0 10px ${color}` : "none",
          }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1 px-1" style={{ color: "#3a3f6a" }}>
        <span>-50¢</span><span>0</span><span>+50¢</span>
      </div>
    </div>
  );
}

function VolumeMeter({ volume }: { volume: number }) {
  const pct = Math.min(1, volume * 10) * 100;
  return (
    <div className="w-full max-w-xs">
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#252847" }}>
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{ width: `${pct}%`, background: "#2ed573" }}
        />
      </div>
      <p className="text-xs mt-0.5 text-right" style={{ color: "#3a3f6a" }}>mic</p>
    </div>
  );
}

export default function Tuner() {
  const { note, volume, isListening, error, start, stop } = usePitchDetection();

  const noteCents = note?.cents ?? 0;
  const inTune    = note !== null && Math.abs(noteCents) <= 10;
  const ringColor = !note ? "#252847" : inTune ? "#2ed573" : "#ff4757";

  return (
    <div
      className="flex flex-col items-center gap-5 p-8 rounded-2xl w-full max-w-sm"
      style={{ background: "#1a1d35", border: "1px solid #252847" }}
    >
      <h2 className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "#6b70a0" }}>
        Tuner
      </h2>

      {/* Ring */}
      <div
        className="relative flex items-center justify-center w-40 h-40 rounded-full transition-all duration-200"
        style={{
          border: `4px solid ${ringColor}`,
          boxShadow: !note ? "none" : inTune ? `0 0 32px ${ringColor}55` : `0 0 20px ${ringColor}33`,
        }}
      >
        {note ? (
          <div className="text-center">
            <p className="text-5xl font-black leading-tight" style={{ color: inTune ? "#2ed573" : "#e8eaf6" }}>
              {note.name}
            </p>
            <p className="text-xs mt-1" style={{ color: "#6b70a0" }}>
              {note.frequency.toFixed(1)} Hz
            </p>
          </div>
        ) : (
          <p className="text-sm" style={{ color: "#3a3f6a" }}>
            {isListening ? "Play a note…" : "—"}
          </p>
        )}
      </div>

      {/* Cents */}
      {note && (
        <div className="flex flex-col items-center gap-1 w-full">
          <p className="text-sm" style={{ color: "#6b70a0" }}>
            {noteCents > 0 ? `+${noteCents}¢ sharp` : noteCents < 0 ? `${noteCents}¢ flat` : "In tune!"}
          </p>
          <CentsMeter cents={noteCents} />
        </div>
      )}

      {isListening && <VolumeMeter volume={volume} />}
      {error && <p className="text-sm text-center" style={{ color: "#ff4757" }}>{error}</p>}

      <button
        onClick={isListening ? stop : start}
        className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer"
        style={
          isListening
            ? { background: "#252847", color: "#6b70a0" }
            : { background: "#f5a623", color: "#0f1020", boxShadow: "0 0 20px #f5a62355" }
        }
      >
        {isListening ? "Stop Listening" : "Start Tuner"}
      </button>

      <p className="text-xs text-center" style={{ color: "#3a3f6a" }}>
        Guitar range E2–E6 · YIN algorithm
      </p>
    </div>
  );
}
