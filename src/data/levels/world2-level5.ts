import { Level } from "@/types/tab";

// Em Pentatonic — Two-Box Link (Box 1 → Box 2, ascending then back)
// Ascend through Box 1 (open position), shift hands at str4 fret 5, continue
// ascending through Box 2 (G shape), hold peak A4, then descend back through
// both boxes to open E2.
// The pivot note: str4 fret 5 (G3) is the first Box 2 note — hand shifts here.
// 115 BPM, 1-beat spacing, 24 notes.
const level: Level = {
  id: "world2-level5",
  title: "Box Link 1→2",
  description: "Em pentatonic Box 1 into Box 2 in one continuous run. Shift hand at G3 (str4 fret 5), keep climbing to A4, then come back down through both positions. This is position shifting.",
  bpm: 115,
  notes: [
    // ── Ascending — Box 1 (open position) ─────────────────────────────────────
    { id: "n1",  string: 6, fret: 0,  targetFrequency: 82.41,  durationBeats: 1, startBeat: 0  }, // E2
    { id: "n2",  string: 6, fret: 3,  targetFrequency: 98.00,  durationBeats: 1, startBeat: 1  }, // G2
    { id: "n3",  string: 5, fret: 0,  targetFrequency: 110.00, durationBeats: 1, startBeat: 2  }, // A2
    { id: "n4",  string: 5, fret: 2,  targetFrequency: 123.47, durationBeats: 1, startBeat: 3  }, // B2
    { id: "n5",  string: 4, fret: 0,  targetFrequency: 146.83, durationBeats: 1, startBeat: 4  }, // D3
    { id: "n6",  string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 5  }, // E3 ← last Box 1 note
    // ── SHIFT — Box 2 (G shape, frets 2–5) ────────────────────────────────────
    { id: "n7",  string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 6  }, // G3 ← first Box 2 note
    { id: "n8",  string: 3, fret: 2,  targetFrequency: 220.00, durationBeats: 1, startBeat: 7  }, // A3
    { id: "n9",  string: 3, fret: 4,  targetFrequency: 246.94, durationBeats: 1, startBeat: 8  }, // B3
    { id: "n10", string: 2, fret: 3,  targetFrequency: 293.66, durationBeats: 1, startBeat: 9  }, // D4
    { id: "n11", string: 2, fret: 5,  targetFrequency: 329.63, durationBeats: 1, startBeat: 10 }, // E4
    { id: "n12", string: 1, fret: 3,  targetFrequency: 392.00, durationBeats: 1, startBeat: 11 }, // G4
    { id: "n13", string: 1, fret: 5,  targetFrequency: 440.00, durationBeats: 2, startBeat: 12 }, // A4 — PEAK, hold
    // ── Descending — Box 2 ────────────────────────────────────────────────────
    { id: "n14", string: 1, fret: 3,  targetFrequency: 392.00, durationBeats: 1, startBeat: 14 }, // G4
    { id: "n15", string: 2, fret: 5,  targetFrequency: 329.63, durationBeats: 1, startBeat: 15 }, // E4
    { id: "n16", string: 2, fret: 3,  targetFrequency: 293.66, durationBeats: 1, startBeat: 16 }, // D4
    { id: "n17", string: 3, fret: 4,  targetFrequency: 246.94, durationBeats: 1, startBeat: 17 }, // B3
    { id: "n18", string: 3, fret: 2,  targetFrequency: 220.00, durationBeats: 1, startBeat: 18 }, // A3
    { id: "n19", string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 19 }, // G3 ← back at pivot
    // ── SHIFT back — Box 1 ────────────────────────────────────────────────────
    { id: "n20", string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 20 }, // E3
    { id: "n21", string: 5, fret: 2,  targetFrequency: 123.47, durationBeats: 1, startBeat: 21 }, // B2
    { id: "n22", string: 5, fret: 0,  targetFrequency: 110.00, durationBeats: 1, startBeat: 22 }, // A2
    { id: "n23", string: 6, fret: 3,  targetFrequency: 98.00,  durationBeats: 1, startBeat: 23 }, // G2
    { id: "n24", string: 6, fret: 0,  targetFrequency: 82.41,  durationBeats: 2, startBeat: 24 }, // E2 — resolve
  ],
};

export default level;
