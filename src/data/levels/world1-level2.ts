import { Level } from "@/types/tab";

// Em Pentatonic — Position 2 FULL (all 6 strings, G shape)
// Str6: 3,5 | Str5: 2,5 | Str4: 2,5 | Str3: 2,4 | Str2: 3,5 | Str1: 3,5
// G2 up to A4 and back. Hand shifts up from open position.
// 88 BPM, 2-beat spacing.
const level: Level = {
  id: "world1-level2",
  title: "Box 2 — Full",
  description: "Em pentatonic position 2, all 6 strings. G shape — hand sits around frets 2–5. G2 up to A4 and back. Shift your hand up from position 1 and lock in.",
  bpm: 100,
  notes: [
    // ── Ascending ─────────────────────────────────────────────────────────────
    { id: "n1",  string: 6, fret: 3,  targetFrequency: 98.00,  durationBeats: 1, startBeat: 0  }, // G2
    { id: "n2",  string: 6, fret: 5,  targetFrequency: 110.00, durationBeats: 1, startBeat: 2  }, // A2
    { id: "n3",  string: 5, fret: 2,  targetFrequency: 123.47, durationBeats: 1, startBeat: 4  }, // B2
    { id: "n4",  string: 5, fret: 5,  targetFrequency: 146.83, durationBeats: 1, startBeat: 6  }, // D3
    { id: "n5",  string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 8  }, // E3
    { id: "n6",  string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 10 }, // G3
    { id: "n7",  string: 3, fret: 2,  targetFrequency: 220.00, durationBeats: 1, startBeat: 12 }, // A3
    { id: "n8",  string: 3, fret: 4,  targetFrequency: 246.94, durationBeats: 1, startBeat: 14 }, // B3
    { id: "n9",  string: 2, fret: 3,  targetFrequency: 293.66, durationBeats: 1, startBeat: 16 }, // D4
    { id: "n10", string: 2, fret: 5,  targetFrequency: 329.63, durationBeats: 1, startBeat: 18 }, // E4
    { id: "n11", string: 1, fret: 3,  targetFrequency: 392.00, durationBeats: 1, startBeat: 20 }, // G4
    { id: "n12", string: 1, fret: 5,  targetFrequency: 440.00, durationBeats: 2, startBeat: 22 }, // A4 — peak, hold
    // ── Descending ────────────────────────────────────────────────────────────
    { id: "n13", string: 1, fret: 3,  targetFrequency: 392.00, durationBeats: 1, startBeat: 24 }, // G4
    { id: "n14", string: 2, fret: 5,  targetFrequency: 329.63, durationBeats: 1, startBeat: 26 }, // E4
    { id: "n15", string: 2, fret: 3,  targetFrequency: 293.66, durationBeats: 1, startBeat: 28 }, // D4
    { id: "n16", string: 3, fret: 4,  targetFrequency: 246.94, durationBeats: 1, startBeat: 30 }, // B3
    { id: "n17", string: 3, fret: 2,  targetFrequency: 220.00, durationBeats: 1, startBeat: 32 }, // A3
    { id: "n18", string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 34 }, // G3
    { id: "n19", string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 36 }, // E3
    { id: "n20", string: 5, fret: 5,  targetFrequency: 146.83, durationBeats: 1, startBeat: 38 }, // D3
    { id: "n21", string: 5, fret: 2,  targetFrequency: 123.47, durationBeats: 1, startBeat: 40 }, // B2
    { id: "n22", string: 6, fret: 5,  targetFrequency: 110.00, durationBeats: 1, startBeat: 42 }, // A2
    { id: "n23", string: 6, fret: 3,  targetFrequency: 98.00,  durationBeats: 2, startBeat: 44 }, // G2 — resolve
  ],
};

export default level;
