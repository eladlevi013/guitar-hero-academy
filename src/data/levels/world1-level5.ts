import { Level } from "@/types/tab";

// Em Pentatonic — Descending 3-Note Groups (Box 1)
// Ascend the scale straight (learn the direction), then come back down in overlapping
// 3-note groups: G4-E4-D4, E4-D4-B3, D4-B3-A3, B3-A3-G3...
// Each group starts one step lower than the previous — the mirror of the 4-note
// ascending exercise in Level 2. Most players only practice going up. This fixes that.
// The descending pull-off motion lives here. 12 up + 30 down = 42 notes. 108 BPM.
const level: Level = {
  id: "world1-level5",
  title: "Descending Groups",
  description: "Ascend straight, then cascade back down in overlapping 3-note groups. G4-E4-D4, E4-D4-B3, D4-B3-A3... Most players only drill going up. This is the other half. Ten groups all the way back to E2.",
  bpm: 108,
  notes: [
    // ── Ascending — straight run to peak ──────────────────────────────────────
    { id: "n1",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 0  }, // E2
    { id: "n2",  string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 1  }, // G2
    { id: "n3",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 2  }, // A2
    { id: "n4",  string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 3  }, // B2
    { id: "n5",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 4  }, // D3
    { id: "n6",  string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 5  }, // E3
    { id: "n7",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 6  }, // G3
    { id: "n8",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 7  }, // A3
    { id: "n9",  string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 8  }, // B3
    { id: "n10", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 9  }, // D4
    { id: "n11", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 10 }, // E4
    { id: "n12", string: 1, fret: 3, targetFrequency: 392.00, durationBeats: 1, startBeat: 11 }, // G4 — peak, cascade begins
    // ── Descending 3-note groups — each starts one step lower ─────────────────
    // Group D1: G4 E4 D4
    { id: "n13", string: 1, fret: 3, targetFrequency: 392.00, durationBeats: 1, startBeat: 12 }, // G4
    { id: "n14", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 13 }, // E4
    { id: "n15", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 14 }, // D4
    // Group D2: E4 D4 B3
    { id: "n16", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 15 }, // E4
    { id: "n17", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 16 }, // D4
    { id: "n18", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 17 }, // B3
    // Group D3: D4 B3 A3
    { id: "n19", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 18 }, // D4
    { id: "n20", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 19 }, // B3
    { id: "n21", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 20 }, // A3
    // Group D4: B3 A3 G3
    { id: "n22", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 21 }, // B3
    { id: "n23", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 22 }, // A3
    { id: "n24", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 23 }, // G3
    // Group D5: A3 G3 E3
    { id: "n25", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 24 }, // A3
    { id: "n26", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 25 }, // G3
    { id: "n27", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 26 }, // E3
    // Group D6: G3 E3 D3
    { id: "n28", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 27 }, // G3
    { id: "n29", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 28 }, // E3
    { id: "n30", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 29 }, // D3
    // Group D7: E3 D3 B2
    { id: "n31", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 30 }, // E3
    { id: "n32", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 31 }, // D3
    { id: "n33", string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 32 }, // B2
    // Group D8: D3 B2 A2
    { id: "n34", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 33 }, // D3
    { id: "n35", string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 34 }, // B2
    { id: "n36", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 35 }, // A2
    // Group D9: B2 A2 G2
    { id: "n37", string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 36 }, // B2
    { id: "n38", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 37 }, // A2
    { id: "n39", string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 38 }, // G2
    // Group D10: A2 G2 E2
    { id: "n40", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 39 }, // A2
    { id: "n41", string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 40 }, // G2
    { id: "n42", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 2, startBeat: 41 }, // E2 — resolve
  ],
};

export default level;
