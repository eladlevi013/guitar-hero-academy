import { Level } from "@/types/tab";

// Em Pentatonic — 4-Note Forward Sequences (Box 1)
// Play 4 consecutive scale notes, then start the next group one step higher.
// Groups: [1234] [2345] [3456] [4567] [5678] [6789] [789·10] [89·10·11] [9·10·11·12]
// Each note appears in 4 consecutive groups — that overlap is what makes this hard.
// This is the single most important scale exercise. 9 groups straight to the peak.
// 100 BPM, 1-beat spacing, 36 notes ascending.
const level: Level = {
  id: "world1-level2",
  title: "4-Note Groups",
  description: "Play four consecutive Em pentatonic notes, then start one step higher. 1-2-3-4, 2-3-4-5, 3-4-5-6... Nine overlapping groups to the peak. This is the exercise that turns a scale into a solo.",
  bpm: 100,
  notes: [
    // ── Group 1: E2 G2 A2 B2 ──────────────────────────────────────────────────
    { id: "n1",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 0  }, // E2
    { id: "n2",  string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 1  }, // G2
    { id: "n3",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 2  }, // A2
    { id: "n4",  string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 3  }, // B2
    // ── Group 2: G2 A2 B2 D3 ──────────────────────────────────────────────────
    { id: "n5",  string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 4  }, // G2
    { id: "n6",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 5  }, // A2
    { id: "n7",  string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 6  }, // B2
    { id: "n8",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 7  }, // D3
    // ── Group 3: A2 B2 D3 E3 ──────────────────────────────────────────────────
    { id: "n9",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 8  }, // A2
    { id: "n10", string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 9  }, // B2
    { id: "n11", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 10 }, // D3
    { id: "n12", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 11 }, // E3
    // ── Group 4: B2 D3 E3 G3 ──────────────────────────────────────────────────
    { id: "n13", string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 12 }, // B2
    { id: "n14", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 13 }, // D3
    { id: "n15", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 14 }, // E3
    { id: "n16", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 15 }, // G3
    // ── Group 5: D3 E3 G3 A3 ──────────────────────────────────────────────────
    { id: "n17", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 16 }, // D3
    { id: "n18", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 17 }, // E3
    { id: "n19", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 18 }, // G3
    { id: "n20", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 19 }, // A3
    // ── Group 6: E3 G3 A3 B3 ──────────────────────────────────────────────────
    { id: "n21", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 20 }, // E3
    { id: "n22", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 21 }, // G3
    { id: "n23", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 22 }, // A3
    { id: "n24", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 23 }, // B3
    // ── Group 7: G3 A3 B3 D4 ──────────────────────────────────────────────────
    { id: "n25", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 24 }, // G3
    { id: "n26", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 25 }, // A3
    { id: "n27", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 26 }, // B3
    { id: "n28", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 27 }, // D4
    // ── Group 8: A3 B3 D4 E4 ──────────────────────────────────────────────────
    { id: "n29", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 28 }, // A3
    { id: "n30", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 29 }, // B3
    { id: "n31", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 30 }, // D4
    { id: "n32", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 31 }, // E4
    // ── Group 9: B3 D4 E4 G4 — PEAK ───────────────────────────────────────────
    { id: "n33", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 32 }, // B3
    { id: "n34", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 33 }, // D4
    { id: "n35", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 34 }, // E4
    { id: "n36", string: 1, fret: 3, targetFrequency: 392.00, durationBeats: 2, startBeat: 35 }, // G4 — hold it
  ],
};

export default level;
