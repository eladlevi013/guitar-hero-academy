import { Level } from "@/types/tab";

// Am Pentatonic — Box 2 FULL (all 6 strings, C shape, root at fret 8)
// Am penta box 2: Str6: 8,10 | Str5: 7,10 | Str4: 7,10 | Str3: 7,9 | Str2: 8,10 | Str1: 8,10
// C3 up to D5 and back. The hand moves up from box 1 to the next position.
// 118 BPM, 2-beat spacing.
const level: Level = {
  id: "world2-level3",
  title: "Am Box 2",
  description: "Am pentatonic Box 2 — hand shifts up to frets 7–10. Same scale, new grip. C3 to D5 and back. Connect this to Box 1 in your head — they're the same notes shifted up the neck.",
  bpm: 118,
  notes: [
    // ── Ascending ─────────────────────────────────────────────────────────────
    { id: "n1",  string: 6, fret: 8,  targetFrequency: 130.81, durationBeats: 1, startBeat: 0  }, // C3
    { id: "n2",  string: 6, fret: 10, targetFrequency: 146.83, durationBeats: 1, startBeat: 2  }, // D3
    { id: "n3",  string: 5, fret: 7,  targetFrequency: 164.81, durationBeats: 1, startBeat: 4  }, // E3
    { id: "n4",  string: 5, fret: 10, targetFrequency: 196.00, durationBeats: 1, startBeat: 6  }, // G3
    { id: "n5",  string: 4, fret: 7,  targetFrequency: 220.00, durationBeats: 1, startBeat: 8  }, // A3
    { id: "n6",  string: 4, fret: 10, targetFrequency: 261.63, durationBeats: 1, startBeat: 10 }, // C4
    { id: "n7",  string: 3, fret: 7,  targetFrequency: 293.66, durationBeats: 1, startBeat: 12 }, // D4
    { id: "n8",  string: 3, fret: 9,  targetFrequency: 329.63, durationBeats: 1, startBeat: 14 }, // E4
    { id: "n9",  string: 2, fret: 8,  targetFrequency: 392.00, durationBeats: 1, startBeat: 16 }, // G4
    { id: "n10", string: 2, fret: 10, targetFrequency: 440.00, durationBeats: 1, startBeat: 18 }, // A4
    { id: "n11", string: 1, fret: 8,  targetFrequency: 523.25, durationBeats: 1, startBeat: 20 }, // C5
    { id: "n12", string: 1, fret: 10, targetFrequency: 587.33, durationBeats: 2, startBeat: 22 }, // D5 — peak, hold
    // ── Descending ────────────────────────────────────────────────────────────
    { id: "n13", string: 1, fret: 8,  targetFrequency: 523.25, durationBeats: 1, startBeat: 24 }, // C5
    { id: "n14", string: 2, fret: 10, targetFrequency: 440.00, durationBeats: 1, startBeat: 26 }, // A4
    { id: "n15", string: 2, fret: 8,  targetFrequency: 392.00, durationBeats: 1, startBeat: 28 }, // G4
    { id: "n16", string: 3, fret: 9,  targetFrequency: 329.63, durationBeats: 1, startBeat: 30 }, // E4
    { id: "n17", string: 3, fret: 7,  targetFrequency: 293.66, durationBeats: 1, startBeat: 32 }, // D4
    { id: "n18", string: 4, fret: 10, targetFrequency: 261.63, durationBeats: 1, startBeat: 34 }, // C4
    { id: "n19", string: 4, fret: 7,  targetFrequency: 220.00, durationBeats: 1, startBeat: 36 }, // A3
    { id: "n20", string: 5, fret: 10, targetFrequency: 196.00, durationBeats: 1, startBeat: 38 }, // G3
    { id: "n21", string: 5, fret: 7,  targetFrequency: 164.81, durationBeats: 1, startBeat: 40 }, // E3
    { id: "n22", string: 6, fret: 10, targetFrequency: 146.83, durationBeats: 1, startBeat: 42 }, // D3
    { id: "n23", string: 6, fret: 8,  targetFrequency: 130.81, durationBeats: 2, startBeat: 44 }, // C3 — resolve
  ],
};

export default level;
