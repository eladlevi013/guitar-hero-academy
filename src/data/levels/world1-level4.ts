import { Level } from "@/types/tab";

// Em Pentatonic — Diatonic 3rds (Box 1)
// Skip every other scale note and pair them: (1,3) (2,4) (3,5) (4,6)...
// Pattern creates a zigzag — low→high→lower→higher→ — which sounds musical immediately
// because you're playing intervals instead of adjacent steps.
// This is how guitar teachers break students out of linear scalar thinking.
// 20 notes ascending in 3rds, straight descent. 105 BPM, 1-beat.
const level: Level = {
  id: "world1-level4",
  title: "Diatonic 3rds",
  description: "Skip every other pentatonic note and pair them up. E2→A2, G2→B2, A2→D3... The zigzag sounds musical immediately — you're playing intervals, not a scale run. Ascend in 3rds, straight back down.",
  bpm: 105,
  notes: [
    // ── Ascending in diatonic 3rds — pair (n, n+2) stepping up by one each time ─
    { id: "n1",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 0  }, // E2  (1)
    { id: "n2",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 1  }, // A2  (3)
    { id: "n3",  string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 2  }, // G2  (2)
    { id: "n4",  string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 3  }, // B2  (4)
    { id: "n5",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 4  }, // A2  (3)
    { id: "n6",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 5  }, // D3  (5)
    { id: "n7",  string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 6  }, // B2  (4)
    { id: "n8",  string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 7  }, // E3  (6)
    { id: "n9",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 8  }, // D3  (5)
    { id: "n10", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 9  }, // G3  (7)
    { id: "n11", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 10 }, // E3  (6)
    { id: "n12", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 11 }, // A3  (8)
    { id: "n13", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 12 }, // G3  (7)
    { id: "n14", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 13 }, // B3  (9)
    { id: "n15", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 14 }, // A3  (8)
    { id: "n16", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 15 }, // D4  (10)
    { id: "n17", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 16 }, // B3  (9)
    { id: "n18", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 17 }, // E4  (11)
    { id: "n19", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 18 }, // D4  (10)
    { id: "n20", string: 1, fret: 3, targetFrequency: 392.00, durationBeats: 2, startBeat: 19 }, // G4  (12) — PEAK, hold
    // ── Descending — straight scale back to root ──────────────────────────────
    { id: "n21", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 21 }, // E4
    { id: "n22", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 22 }, // D4
    { id: "n23", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 23 }, // B3
    { id: "n24", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 24 }, // A3
    { id: "n25", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 25 }, // G3
    { id: "n26", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 26 }, // E3
    { id: "n27", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 27 }, // D3
    { id: "n28", string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 28 }, // B2
    { id: "n29", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 29 }, // A2
    { id: "n30", string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 30 }, // G2
    { id: "n31", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 2, startBeat: 31 }, // E2 — resolve
  ],
};

export default level;
