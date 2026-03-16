import { Level } from "@/types/tab";

// Em Pentatonic — Position 3 FULL (all 6 strings, A shape)
// Str6: 5,7 | Str5: 5,7 | Str4: 5,7 | Str3: 4,7 | Str2: 5,8 | Str1: 5,7
// A2 up to B4 and back. Symmetric frets across most strings.
// 91 BPM, 2-beat spacing.
const level: Level = {
  id: "world1-level3",
  title: "Box 3 — Full",
  description: "Em pentatonic position 3, all 6 strings. A shape — frets 5 & 7 dominate. A2 up to B4 and back. The symmetry makes this fast once you feel it.",
  bpm: 104,
  notes: [
    // ── Ascending ─────────────────────────────────────────────────────────────
    { id: "n1",  string: 6, fret: 5,  targetFrequency: 110.00, durationBeats: 1, startBeat: 0  }, // A2
    { id: "n2",  string: 6, fret: 7,  targetFrequency: 123.47, durationBeats: 1, startBeat: 2  }, // B2
    { id: "n3",  string: 5, fret: 5,  targetFrequency: 146.83, durationBeats: 1, startBeat: 4  }, // D3
    { id: "n4",  string: 5, fret: 7,  targetFrequency: 164.81, durationBeats: 1, startBeat: 6  }, // E3
    { id: "n5",  string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 8  }, // G3
    { id: "n6",  string: 4, fret: 7,  targetFrequency: 220.00, durationBeats: 1, startBeat: 10 }, // A3
    { id: "n7",  string: 3, fret: 4,  targetFrequency: 246.94, durationBeats: 1, startBeat: 12 }, // B3
    { id: "n8",  string: 3, fret: 7,  targetFrequency: 293.66, durationBeats: 1, startBeat: 14 }, // D4
    { id: "n9",  string: 2, fret: 5,  targetFrequency: 329.63, durationBeats: 1, startBeat: 16 }, // E4
    { id: "n10", string: 2, fret: 8,  targetFrequency: 392.00, durationBeats: 1, startBeat: 18 }, // G4
    { id: "n11", string: 1, fret: 5,  targetFrequency: 440.00, durationBeats: 1, startBeat: 20 }, // A4
    { id: "n12", string: 1, fret: 7,  targetFrequency: 493.88, durationBeats: 2, startBeat: 22 }, // B4 — peak, hold
    // ── Descending ────────────────────────────────────────────────────────────
    { id: "n13", string: 1, fret: 5,  targetFrequency: 440.00, durationBeats: 1, startBeat: 24 }, // A4
    { id: "n14", string: 2, fret: 8,  targetFrequency: 392.00, durationBeats: 1, startBeat: 26 }, // G4
    { id: "n15", string: 2, fret: 5,  targetFrequency: 329.63, durationBeats: 1, startBeat: 28 }, // E4
    { id: "n16", string: 3, fret: 7,  targetFrequency: 293.66, durationBeats: 1, startBeat: 30 }, // D4
    { id: "n17", string: 3, fret: 4,  targetFrequency: 246.94, durationBeats: 1, startBeat: 32 }, // B3
    { id: "n18", string: 4, fret: 7,  targetFrequency: 220.00, durationBeats: 1, startBeat: 34 }, // A3
    { id: "n19", string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 36 }, // G3
    { id: "n20", string: 5, fret: 7,  targetFrequency: 164.81, durationBeats: 1, startBeat: 38 }, // E3
    { id: "n21", string: 5, fret: 5,  targetFrequency: 146.83, durationBeats: 1, startBeat: 40 }, // D3
    { id: "n22", string: 6, fret: 7,  targetFrequency: 123.47, durationBeats: 1, startBeat: 42 }, // B2
    { id: "n23", string: 6, fret: 5,  targetFrequency: 110.00, durationBeats: 2, startBeat: 44 }, // A2 — resolve
  ],
};

export default level;
