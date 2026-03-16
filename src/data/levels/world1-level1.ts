import { Level } from "@/types/tab";

// Em Pentatonic — Position 1 FULL (all 6 strings, open box)
// Str6: 0,3 | Str5: 0,2 | Str4: 0,2 | Str3: 0,2 | Str2: 0,3 | Str1: 0,3
// E2 all the way up to G4, then back down. This is the full box.
// 85 BPM, 2-beat spacing.
const level: Level = {
  id: "world1-level1",
  title: "Box 1 — Full",
  description: "Em pentatonic position 1, all 6 strings. E2 up to G4 and back. Open position, but full range. Every note of the box, both directions.",
  bpm: 95,
  notes: [
    // ── Ascending ─────────────────────────────────────────────────────────────
    { id: "n1",  string: 6, fret: 0,  targetFrequency: 82.41,  durationBeats: 1, startBeat: 0  }, // E2
    { id: "n2",  string: 6, fret: 3,  targetFrequency: 98.00,  durationBeats: 1, startBeat: 2  }, // G2
    { id: "n3",  string: 5, fret: 0,  targetFrequency: 110.00, durationBeats: 1, startBeat: 4  }, // A2
    { id: "n4",  string: 5, fret: 2,  targetFrequency: 123.47, durationBeats: 1, startBeat: 6  }, // B2
    { id: "n5",  string: 4, fret: 0,  targetFrequency: 146.83, durationBeats: 1, startBeat: 8  }, // D3
    { id: "n6",  string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 10 }, // E3
    { id: "n7",  string: 3, fret: 0,  targetFrequency: 196.00, durationBeats: 1, startBeat: 12 }, // G3
    { id: "n8",  string: 3, fret: 2,  targetFrequency: 220.00, durationBeats: 1, startBeat: 14 }, // A3
    { id: "n9",  string: 2, fret: 0,  targetFrequency: 246.94, durationBeats: 1, startBeat: 16 }, // B3
    { id: "n10", string: 2, fret: 3,  targetFrequency: 293.66, durationBeats: 1, startBeat: 18 }, // D4
    { id: "n11", string: 1, fret: 0,  targetFrequency: 329.63, durationBeats: 1, startBeat: 20 }, // E4
    { id: "n12", string: 1, fret: 3,  targetFrequency: 392.00, durationBeats: 2, startBeat: 22 }, // G4 — peak, hold
    // ── Descending ────────────────────────────────────────────────────────────
    { id: "n13", string: 1, fret: 0,  targetFrequency: 329.63, durationBeats: 1, startBeat: 24 }, // E4
    { id: "n14", string: 2, fret: 3,  targetFrequency: 293.66, durationBeats: 1, startBeat: 26 }, // D4
    { id: "n15", string: 2, fret: 0,  targetFrequency: 246.94, durationBeats: 1, startBeat: 28 }, // B3
    { id: "n16", string: 3, fret: 2,  targetFrequency: 220.00, durationBeats: 1, startBeat: 30 }, // A3
    { id: "n17", string: 3, fret: 0,  targetFrequency: 196.00, durationBeats: 1, startBeat: 32 }, // G3
    { id: "n18", string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 34 }, // E3
    { id: "n19", string: 4, fret: 0,  targetFrequency: 146.83, durationBeats: 1, startBeat: 36 }, // D3
    { id: "n20", string: 5, fret: 2,  targetFrequency: 123.47, durationBeats: 1, startBeat: 38 }, // B2
    { id: "n21", string: 5, fret: 0,  targetFrequency: 110.00, durationBeats: 1, startBeat: 40 }, // A2
    { id: "n22", string: 6, fret: 3,  targetFrequency: 98.00,  durationBeats: 1, startBeat: 42 }, // G2
    { id: "n23", string: 6, fret: 0,  targetFrequency: 82.41,  durationBeats: 2, startBeat: 44 }, // E2 — resolve
  ],
};

export default level;
