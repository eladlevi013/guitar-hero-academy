import { Level } from "@/types/tab";

// Em Pentatonic — Position 5 FULL (all 6 strings, D shape)
// Str6: 10,12 | Str5: 10,12 | Str4: 9,12 | Str3: 9,12 | Str2: 10,12 | Str1: 10,12
// D3 up to E5 and back. High up the neck — fret 12 rings like a bell.
// 97 BPM, 2-beat spacing.
const level: Level = {
  id: "world1-level5",
  title: "Box 5 — Full",
  description: "Em pentatonic position 5, all 6 strings. D shape — frets 9 to 12. D3 up to E5 and back. Fret 12 is the octave marker. Make it ring.",
  bpm: 112,
  notes: [
    // ── Ascending ─────────────────────────────────────────────────────────────
    { id: "n1",  string: 6, fret: 10, targetFrequency: 146.83, durationBeats: 1, startBeat: 0  }, // D3
    { id: "n2",  string: 6, fret: 12, targetFrequency: 164.81, durationBeats: 1, startBeat: 2  }, // E3
    { id: "n3",  string: 5, fret: 10, targetFrequency: 196.00, durationBeats: 1, startBeat: 4  }, // G3
    { id: "n4",  string: 5, fret: 12, targetFrequency: 220.00, durationBeats: 1, startBeat: 6  }, // A3
    { id: "n5",  string: 4, fret: 9,  targetFrequency: 246.94, durationBeats: 1, startBeat: 8  }, // B3
    { id: "n6",  string: 4, fret: 12, targetFrequency: 293.66, durationBeats: 1, startBeat: 10 }, // D4
    { id: "n7",  string: 3, fret: 9,  targetFrequency: 329.63, durationBeats: 1, startBeat: 12 }, // E4
    { id: "n8",  string: 3, fret: 12, targetFrequency: 392.00, durationBeats: 1, startBeat: 14 }, // G4
    { id: "n9",  string: 2, fret: 10, targetFrequency: 440.00, durationBeats: 1, startBeat: 16 }, // A4
    { id: "n10", string: 2, fret: 12, targetFrequency: 493.88, durationBeats: 1, startBeat: 18 }, // B4
    { id: "n11", string: 1, fret: 10, targetFrequency: 587.33, durationBeats: 1, startBeat: 20 }, // D5
    { id: "n12", string: 1, fret: 12, targetFrequency: 659.25, durationBeats: 2, startBeat: 22 }, // E5 — peak, hold
    // ── Descending ────────────────────────────────────────────────────────────
    { id: "n13", string: 1, fret: 10, targetFrequency: 587.33, durationBeats: 1, startBeat: 24 }, // D5
    { id: "n14", string: 2, fret: 12, targetFrequency: 493.88, durationBeats: 1, startBeat: 26 }, // B4
    { id: "n15", string: 2, fret: 10, targetFrequency: 440.00, durationBeats: 1, startBeat: 28 }, // A4
    { id: "n16", string: 3, fret: 12, targetFrequency: 392.00, durationBeats: 1, startBeat: 30 }, // G4
    { id: "n17", string: 3, fret: 9,  targetFrequency: 329.63, durationBeats: 1, startBeat: 32 }, // E4
    { id: "n18", string: 4, fret: 12, targetFrequency: 293.66, durationBeats: 1, startBeat: 34 }, // D4
    { id: "n19", string: 4, fret: 9,  targetFrequency: 246.94, durationBeats: 1, startBeat: 36 }, // B3
    { id: "n20", string: 5, fret: 12, targetFrequency: 220.00, durationBeats: 1, startBeat: 38 }, // A3
    { id: "n21", string: 5, fret: 10, targetFrequency: 196.00, durationBeats: 1, startBeat: 40 }, // G3
    { id: "n22", string: 6, fret: 12, targetFrequency: 164.81, durationBeats: 1, startBeat: 42 }, // E3
    { id: "n23", string: 6, fret: 10, targetFrequency: 146.83, durationBeats: 2, startBeat: 44 }, // D3 — resolve
  ],
};

export default level;
