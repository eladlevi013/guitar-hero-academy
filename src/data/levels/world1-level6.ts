import { Level } from "@/types/tab";

// The Grand Sweep — positions 1 through 5, one continuous run up the neck.
// 4 notes per position (2 strings × 2 frets), 1-beat spacing = maximum speed.
// Builds to E5 at fret 12, then drops straight back to open E2.
// 100 BPM — this is the boss level.
const level: Level = {
  id: "world1-level6",
  title: "Grand Sweep",
  description: "All 5 positions in one run — E2 to E5 across the full neck, then drop back to root. 100 BPM, 1-beat spacing. This is everything you practiced, in sequence.",
  bpm: 120,
  notes: [
    // ── Position 1 (open) ─────────────────────────────────────────────────────
    { id: "n1",  string: 6, fret: 0,  targetFrequency: 82.41,  durationBeats: 1, startBeat: 0  }, // E2
    { id: "n2",  string: 6, fret: 3,  targetFrequency: 98.00,  durationBeats: 1, startBeat: 1  }, // G2
    { id: "n3",  string: 5, fret: 0,  targetFrequency: 110.00, durationBeats: 1, startBeat: 2  }, // A2
    { id: "n4",  string: 5, fret: 2,  targetFrequency: 123.47, durationBeats: 1, startBeat: 3  }, // B2
    // ── Position 2 (G shape, frets 3–5) ──────────────────────────────────────
    { id: "n5",  string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 4  }, // E3
    { id: "n6",  string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 5  }, // G3
    { id: "n7",  string: 3, fret: 2,  targetFrequency: 220.00, durationBeats: 1, startBeat: 6  }, // A3
    { id: "n8",  string: 3, fret: 4,  targetFrequency: 246.94, durationBeats: 1, startBeat: 7  }, // B3
    // ── Position 3 (A shape, frets 5–7) ──────────────────────────────────────
    { id: "n9",  string: 5, fret: 5,  targetFrequency: 146.83, durationBeats: 1, startBeat: 8  }, // D3
    { id: "n10", string: 5, fret: 7,  targetFrequency: 164.81, durationBeats: 1, startBeat: 9  }, // E3
    { id: "n11", string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 10 }, // G3
    { id: "n12", string: 4, fret: 7,  targetFrequency: 220.00, durationBeats: 1, startBeat: 11 }, // A3
    // ── Position 4 (B shape, frets 7–10) ─────────────────────────────────────
    { id: "n13", string: 3, fret: 7,  targetFrequency: 293.66, durationBeats: 1, startBeat: 12 }, // D4
    { id: "n14", string: 3, fret: 9,  targetFrequency: 329.63, durationBeats: 1, startBeat: 13 }, // E4
    { id: "n15", string: 2, fret: 8,  targetFrequency: 392.00, durationBeats: 1, startBeat: 14 }, // G4
    { id: "n16", string: 2, fret: 10, targetFrequency: 440.00, durationBeats: 1, startBeat: 15 }, // A4
    // ── Position 5 (D shape, frets 10–12) — PEAK ─────────────────────────────
    { id: "n17", string: 2, fret: 12, targetFrequency: 493.88, durationBeats: 1, startBeat: 16 }, // B4
    { id: "n18", string: 1, fret: 10, targetFrequency: 587.33, durationBeats: 1, startBeat: 17 }, // D5
    { id: "n19", string: 1, fret: 12, targetFrequency: 659.25, durationBeats: 3, startBeat: 18 }, // E5 — PEAK, hold
    // ── Drop straight back to root ────────────────────────────────────────────
    { id: "n20", string: 6, fret: 0,  targetFrequency: 82.41,  durationBeats: 3, startBeat: 22 }, // E2 — resolve low
  ],
};

export default level;
