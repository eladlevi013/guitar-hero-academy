import { Level } from "@/types/tab";

// Am Pentatonic — Descending 3-Note Groups (Box 1, 5th position)
// Ascend the Am penta scale straight (12 notes), then cascade back down in
// overlapping 3-note groups: C5-A4-G4, A4-G4-E4, G4-E4-D4, E4-D4-C4...
// The descending mirror of the Em penta ascending sequences in Level 2.
// Descending sequences are harder because guitarists default to ascending runs.
// 12 ascending + 30 descending = 42 notes. 118 BPM, 1-beat.
const level: Level = {
  id: "world2-level3",
  title: "Am — Descending Groups",
  description: "Straight up the Am pentatonic, then cascade back in overlapping 3-note groups. C5-A4-G4, A4-G4-E4, G4-E4-D4... Ten groups all the way back to A2. The downward mirror of sequences.",
  bpm: 118,
  notes: [
    // ── Ascending — straight run to peak ──────────────────────────────────────
    { id: "n1",  string: 6, fret: 5, targetFrequency: 110.00, durationBeats: 1, startBeat: 0  }, // A2
    { id: "n2",  string: 6, fret: 8, targetFrequency: 130.81, durationBeats: 1, startBeat: 1  }, // C3
    { id: "n3",  string: 5, fret: 5, targetFrequency: 146.83, durationBeats: 1, startBeat: 2  }, // D3
    { id: "n4",  string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 1, startBeat: 3  }, // E3
    { id: "n5",  string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 1, startBeat: 4  }, // G3
    { id: "n6",  string: 4, fret: 7, targetFrequency: 220.00, durationBeats: 1, startBeat: 5  }, // A3
    { id: "n7",  string: 3, fret: 5, targetFrequency: 261.63, durationBeats: 1, startBeat: 6  }, // C4
    { id: "n8",  string: 3, fret: 7, targetFrequency: 293.66, durationBeats: 1, startBeat: 7  }, // D4
    { id: "n9",  string: 2, fret: 5, targetFrequency: 329.63, durationBeats: 1, startBeat: 8  }, // E4
    { id: "n10", string: 2, fret: 8, targetFrequency: 392.00, durationBeats: 1, startBeat: 9  }, // G4
    { id: "n11", string: 1, fret: 5, targetFrequency: 440.00, durationBeats: 1, startBeat: 10 }, // A4
    { id: "n12", string: 1, fret: 8, targetFrequency: 523.25, durationBeats: 1, startBeat: 11 }, // C5 — peak, cascade begins
    // ── Descending 3-note groups — each starts one step lower ─────────────────
    // Group D1: C5 A4 G4
    { id: "n13", string: 1, fret: 8, targetFrequency: 523.25, durationBeats: 1, startBeat: 12 }, // C5
    { id: "n14", string: 1, fret: 5, targetFrequency: 440.00, durationBeats: 1, startBeat: 13 }, // A4
    { id: "n15", string: 2, fret: 8, targetFrequency: 392.00, durationBeats: 1, startBeat: 14 }, // G4
    // Group D2: A4 G4 E4
    { id: "n16", string: 1, fret: 5, targetFrequency: 440.00, durationBeats: 1, startBeat: 15 }, // A4
    { id: "n17", string: 2, fret: 8, targetFrequency: 392.00, durationBeats: 1, startBeat: 16 }, // G4
    { id: "n18", string: 2, fret: 5, targetFrequency: 329.63, durationBeats: 1, startBeat: 17 }, // E4
    // Group D3: G4 E4 D4
    { id: "n19", string: 2, fret: 8, targetFrequency: 392.00, durationBeats: 1, startBeat: 18 }, // G4
    { id: "n20", string: 2, fret: 5, targetFrequency: 329.63, durationBeats: 1, startBeat: 19 }, // E4
    { id: "n21", string: 3, fret: 7, targetFrequency: 293.66, durationBeats: 1, startBeat: 20 }, // D4
    // Group D4: E4 D4 C4
    { id: "n22", string: 2, fret: 5, targetFrequency: 329.63, durationBeats: 1, startBeat: 21 }, // E4
    { id: "n23", string: 3, fret: 7, targetFrequency: 293.66, durationBeats: 1, startBeat: 22 }, // D4
    { id: "n24", string: 3, fret: 5, targetFrequency: 261.63, durationBeats: 1, startBeat: 23 }, // C4
    // Group D5: D4 C4 A3
    { id: "n25", string: 3, fret: 7, targetFrequency: 293.66, durationBeats: 1, startBeat: 24 }, // D4
    { id: "n26", string: 3, fret: 5, targetFrequency: 261.63, durationBeats: 1, startBeat: 25 }, // C4
    { id: "n27", string: 4, fret: 7, targetFrequency: 220.00, durationBeats: 1, startBeat: 26 }, // A3
    // Group D6: C4 A3 G3
    { id: "n28", string: 3, fret: 5, targetFrequency: 261.63, durationBeats: 1, startBeat: 27 }, // C4
    { id: "n29", string: 4, fret: 7, targetFrequency: 220.00, durationBeats: 1, startBeat: 28 }, // A3
    { id: "n30", string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 1, startBeat: 29 }, // G3
    // Group D7: A3 G3 E3
    { id: "n31", string: 4, fret: 7, targetFrequency: 220.00, durationBeats: 1, startBeat: 30 }, // A3
    { id: "n32", string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 1, startBeat: 31 }, // G3
    { id: "n33", string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 1, startBeat: 32 }, // E3
    // Group D8: G3 E3 D3
    { id: "n34", string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 1, startBeat: 33 }, // G3
    { id: "n35", string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 1, startBeat: 34 }, // E3
    { id: "n36", string: 5, fret: 5, targetFrequency: 146.83, durationBeats: 1, startBeat: 35 }, // D3
    // Group D9: E3 D3 C3
    { id: "n37", string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 1, startBeat: 36 }, // E3
    { id: "n38", string: 5, fret: 5, targetFrequency: 146.83, durationBeats: 1, startBeat: 37 }, // D3
    { id: "n39", string: 6, fret: 8, targetFrequency: 130.81, durationBeats: 1, startBeat: 38 }, // C3
    // Group D10: D3 C3 A2
    { id: "n40", string: 5, fret: 5, targetFrequency: 146.83, durationBeats: 1, startBeat: 39 }, // D3
    { id: "n41", string: 6, fret: 8, targetFrequency: 130.81, durationBeats: 1, startBeat: 40 }, // C3
    { id: "n42", string: 6, fret: 5, targetFrequency: 110.00, durationBeats: 2, startBeat: 41 }, // A2 — resolve
  ],
};

export default level;
