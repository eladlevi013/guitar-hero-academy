import { Level } from "@/types/tab";

// Am Pentatonic — 4-Note Forward Sequences (Box 1, 5th position)
// Same exercise as World 1 Level 2 but on A minor pentatonic at the 5th fret.
// Am penta Box 1: Str6: 5,8 | Str5: 5,7 | Str4: 5,7 | Str3: 5,7 | Str2: 5,8 | Str1: 5,8
// Scale: A2 C3 D3 E3 G3 A3 C4 D4 E4 G4 A4 C5
// 9 groups of 4, overlapping by 3, all the way to C5 peak. 110 BPM, 1-beat, 36 notes.
const level: Level = {
  id: "world2-level1",
  title: "Am — 4-Note Groups",
  description: "The 4-note sequence exercise on A minor pentatonic at the 5th fret. A2 to C5 in nine overlapping groups. Same technique as W1-L2, new scale, higher position, faster.",
  bpm: 110,
  notes: [
    // ── Group 1: A2 C3 D3 E3 ──────────────────────────────────────────────────
    { id: "n1",  string: 6, fret: 5, targetFrequency: 110.00, durationBeats: 1, startBeat: 0  }, // A2
    { id: "n2",  string: 6, fret: 8, targetFrequency: 130.81, durationBeats: 1, startBeat: 1  }, // C3
    { id: "n3",  string: 5, fret: 5, targetFrequency: 146.83, durationBeats: 1, startBeat: 2  }, // D3
    { id: "n4",  string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 1, startBeat: 3  }, // E3
    // ── Group 2: C3 D3 E3 G3 ──────────────────────────────────────────────────
    { id: "n5",  string: 6, fret: 8, targetFrequency: 130.81, durationBeats: 1, startBeat: 4  }, // C3
    { id: "n6",  string: 5, fret: 5, targetFrequency: 146.83, durationBeats: 1, startBeat: 5  }, // D3
    { id: "n7",  string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 1, startBeat: 6  }, // E3
    { id: "n8",  string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 1, startBeat: 7  }, // G3
    // ── Group 3: D3 E3 G3 A3 ──────────────────────────────────────────────────
    { id: "n9",  string: 5, fret: 5, targetFrequency: 146.83, durationBeats: 1, startBeat: 8  }, // D3
    { id: "n10", string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 1, startBeat: 9  }, // E3
    { id: "n11", string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 1, startBeat: 10 }, // G3
    { id: "n12", string: 4, fret: 7, targetFrequency: 220.00, durationBeats: 1, startBeat: 11 }, // A3
    // ── Group 4: E3 G3 A3 C4 ──────────────────────────────────────────────────
    { id: "n13", string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 1, startBeat: 12 }, // E3
    { id: "n14", string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 1, startBeat: 13 }, // G3
    { id: "n15", string: 4, fret: 7, targetFrequency: 220.00, durationBeats: 1, startBeat: 14 }, // A3
    { id: "n16", string: 3, fret: 5, targetFrequency: 261.63, durationBeats: 1, startBeat: 15 }, // C4
    // ── Group 5: G3 A3 C4 D4 ──────────────────────────────────────────────────
    { id: "n17", string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 1, startBeat: 16 }, // G3
    { id: "n18", string: 4, fret: 7, targetFrequency: 220.00, durationBeats: 1, startBeat: 17 }, // A3
    { id: "n19", string: 3, fret: 5, targetFrequency: 261.63, durationBeats: 1, startBeat: 18 }, // C4
    { id: "n20", string: 3, fret: 7, targetFrequency: 293.66, durationBeats: 1, startBeat: 19 }, // D4
    // ── Group 6: A3 C4 D4 E4 ──────────────────────────────────────────────────
    { id: "n21", string: 4, fret: 7, targetFrequency: 220.00, durationBeats: 1, startBeat: 20 }, // A3
    { id: "n22", string: 3, fret: 5, targetFrequency: 261.63, durationBeats: 1, startBeat: 21 }, // C4
    { id: "n23", string: 3, fret: 7, targetFrequency: 293.66, durationBeats: 1, startBeat: 22 }, // D4
    { id: "n24", string: 2, fret: 5, targetFrequency: 329.63, durationBeats: 1, startBeat: 23 }, // E4
    // ── Group 7: C4 D4 E4 G4 ──────────────────────────────────────────────────
    { id: "n25", string: 3, fret: 5, targetFrequency: 261.63, durationBeats: 1, startBeat: 24 }, // C4
    { id: "n26", string: 3, fret: 7, targetFrequency: 293.66, durationBeats: 1, startBeat: 25 }, // D4
    { id: "n27", string: 2, fret: 5, targetFrequency: 329.63, durationBeats: 1, startBeat: 26 }, // E4
    { id: "n28", string: 2, fret: 8, targetFrequency: 392.00, durationBeats: 1, startBeat: 27 }, // G4
    // ── Group 8: D4 E4 G4 A4 ──────────────────────────────────────────────────
    { id: "n29", string: 3, fret: 7, targetFrequency: 293.66, durationBeats: 1, startBeat: 28 }, // D4
    { id: "n30", string: 2, fret: 5, targetFrequency: 329.63, durationBeats: 1, startBeat: 29 }, // E4
    { id: "n31", string: 2, fret: 8, targetFrequency: 392.00, durationBeats: 1, startBeat: 30 }, // G4
    { id: "n32", string: 1, fret: 5, targetFrequency: 440.00, durationBeats: 1, startBeat: 31 }, // A4
    // ── Group 9: E4 G4 A4 C5 — PEAK ───────────────────────────────────────────
    { id: "n33", string: 2, fret: 5, targetFrequency: 329.63, durationBeats: 1, startBeat: 32 }, // E4
    { id: "n34", string: 2, fret: 8, targetFrequency: 392.00, durationBeats: 1, startBeat: 33 }, // G4
    { id: "n35", string: 1, fret: 5, targetFrequency: 440.00, durationBeats: 1, startBeat: 34 }, // A4
    { id: "n36", string: 1, fret: 8, targetFrequency: 523.25, durationBeats: 2, startBeat: 35 }, // C5 — hold it
  ],
};

export default level;
