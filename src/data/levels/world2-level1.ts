import { Level } from "@/types/tab";

// Am Pentatonic — Box 1 FULL (all 6 strings, root at fret 5)
// Am penta = A, C, D, E, G — THE most played scale in blues and rock.
// Str6: 5,8 | Str5: 5,7 | Str4: 5,7 | Str3: 5,7 | Str2: 5,8 | Str1: 5,8
// A2 up to C5, then back down. Hand camps at the 5th fret.
// 115 BPM, 2-beat spacing.
const level: Level = {
  id: "world2-level1",
  title: "Am Box 1",
  description: "A minor pentatonic Box 1 — the most used scale shape in blues and rock. Hand at fret 5. A2 up to C5 and back. Every blues solo you've ever heard lives here.",
  bpm: 115,
  notes: [
    // ── Ascending ─────────────────────────────────────────────────────────────
    { id: "n1",  string: 6, fret: 5,  targetFrequency: 110.00, durationBeats: 1, startBeat: 0  }, // A2
    { id: "n2",  string: 6, fret: 8,  targetFrequency: 130.81, durationBeats: 1, startBeat: 2  }, // C3
    { id: "n3",  string: 5, fret: 5,  targetFrequency: 146.83, durationBeats: 1, startBeat: 4  }, // D3
    { id: "n4",  string: 5, fret: 7,  targetFrequency: 164.81, durationBeats: 1, startBeat: 6  }, // E3
    { id: "n5",  string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 8  }, // G3
    { id: "n6",  string: 4, fret: 7,  targetFrequency: 220.00, durationBeats: 1, startBeat: 10 }, // A3
    { id: "n7",  string: 3, fret: 5,  targetFrequency: 261.63, durationBeats: 1, startBeat: 12 }, // C4
    { id: "n8",  string: 3, fret: 7,  targetFrequency: 293.66, durationBeats: 1, startBeat: 14 }, // D4
    { id: "n9",  string: 2, fret: 5,  targetFrequency: 329.63, durationBeats: 1, startBeat: 16 }, // E4
    { id: "n10", string: 2, fret: 8,  targetFrequency: 392.00, durationBeats: 1, startBeat: 18 }, // G4
    { id: "n11", string: 1, fret: 5,  targetFrequency: 440.00, durationBeats: 1, startBeat: 20 }, // A4
    { id: "n12", string: 1, fret: 8,  targetFrequency: 523.25, durationBeats: 2, startBeat: 22 }, // C5 — peak, hold
    // ── Descending ────────────────────────────────────────────────────────────
    { id: "n13", string: 1, fret: 5,  targetFrequency: 440.00, durationBeats: 1, startBeat: 24 }, // A4
    { id: "n14", string: 2, fret: 8,  targetFrequency: 392.00, durationBeats: 1, startBeat: 26 }, // G4
    { id: "n15", string: 2, fret: 5,  targetFrequency: 329.63, durationBeats: 1, startBeat: 28 }, // E4
    { id: "n16", string: 3, fret: 7,  targetFrequency: 293.66, durationBeats: 1, startBeat: 30 }, // D4
    { id: "n17", string: 3, fret: 5,  targetFrequency: 261.63, durationBeats: 1, startBeat: 32 }, // C4
    { id: "n18", string: 4, fret: 7,  targetFrequency: 220.00, durationBeats: 1, startBeat: 34 }, // A3
    { id: "n19", string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 36 }, // G3
    { id: "n20", string: 5, fret: 7,  targetFrequency: 164.81, durationBeats: 1, startBeat: 38 }, // E3
    { id: "n21", string: 5, fret: 5,  targetFrequency: 146.83, durationBeats: 1, startBeat: 40 }, // D3
    { id: "n22", string: 6, fret: 8,  targetFrequency: 130.81, durationBeats: 1, startBeat: 42 }, // C3
    { id: "n23", string: 6, fret: 5,  targetFrequency: 110.00, durationBeats: 2, startBeat: 44 }, // A2 — resolve
  ],
};

export default level;
