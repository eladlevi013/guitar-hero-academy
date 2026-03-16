import { Level } from "@/types/tab";

// THE GAUNTLET — Am Pentatonic Box 1, full 6 strings, 1-beat spacing at 130 BPM.
// At 130 BPM, 1-beat spacing = 461ms per note. 23 notes in ~10 seconds.
// No pause at the top. Ascending straight into descending.
// This is the hardest level in the app. Earn it.
const level: Level = {
  id: "world2-level6",
  title: "The Gauntlet",
  description: "Am pentatonic Box 1, all 6 strings, 1-beat spacing at 130 BPM. A2 to C5 and straight back down, no pause. 23 notes in 10 seconds. This is the hardest level in the app.",
  bpm: 130,
  notes: [
    // ── Ascending — A2 to C5 (no mercy) ───────────────────────────────────────
    { id: "n1",  string: 6, fret: 5,  targetFrequency: 110.00, durationBeats: 1, startBeat: 0  }, // A2
    { id: "n2",  string: 6, fret: 8,  targetFrequency: 130.81, durationBeats: 1, startBeat: 1  }, // C3
    { id: "n3",  string: 5, fret: 5,  targetFrequency: 146.83, durationBeats: 1, startBeat: 2  }, // D3
    { id: "n4",  string: 5, fret: 7,  targetFrequency: 164.81, durationBeats: 1, startBeat: 3  }, // E3
    { id: "n5",  string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 4  }, // G3
    { id: "n6",  string: 4, fret: 7,  targetFrequency: 220.00, durationBeats: 1, startBeat: 5  }, // A3
    { id: "n7",  string: 3, fret: 5,  targetFrequency: 261.63, durationBeats: 1, startBeat: 6  }, // C4
    { id: "n8",  string: 3, fret: 7,  targetFrequency: 293.66, durationBeats: 1, startBeat: 7  }, // D4
    { id: "n9",  string: 2, fret: 5,  targetFrequency: 329.63, durationBeats: 1, startBeat: 8  }, // E4
    { id: "n10", string: 2, fret: 8,  targetFrequency: 392.00, durationBeats: 1, startBeat: 9  }, // G4
    { id: "n11", string: 1, fret: 5,  targetFrequency: 440.00, durationBeats: 1, startBeat: 10 }, // A4
    { id: "n12", string: 1, fret: 8,  targetFrequency: 523.25, durationBeats: 1, startBeat: 11 }, // C5 — PEAK
    // ── Descending — C5 back to A2 (no pause) ─────────────────────────────────
    { id: "n13", string: 1, fret: 5,  targetFrequency: 440.00, durationBeats: 1, startBeat: 12 }, // A4
    { id: "n14", string: 2, fret: 8,  targetFrequency: 392.00, durationBeats: 1, startBeat: 13 }, // G4
    { id: "n15", string: 2, fret: 5,  targetFrequency: 329.63, durationBeats: 1, startBeat: 14 }, // E4
    { id: "n16", string: 3, fret: 7,  targetFrequency: 293.66, durationBeats: 1, startBeat: 15 }, // D4
    { id: "n17", string: 3, fret: 5,  targetFrequency: 261.63, durationBeats: 1, startBeat: 16 }, // C4
    { id: "n18", string: 4, fret: 7,  targetFrequency: 220.00, durationBeats: 1, startBeat: 17 }, // A3
    { id: "n19", string: 4, fret: 5,  targetFrequency: 196.00, durationBeats: 1, startBeat: 18 }, // G3
    { id: "n20", string: 5, fret: 7,  targetFrequency: 164.81, durationBeats: 1, startBeat: 19 }, // E3
    { id: "n21", string: 5, fret: 5,  targetFrequency: 146.83, durationBeats: 1, startBeat: 20 }, // D3
    { id: "n22", string: 6, fret: 8,  targetFrequency: 130.81, durationBeats: 1, startBeat: 21 }, // C3
    { id: "n23", string: 6, fret: 5,  targetFrequency: 110.00, durationBeats: 3, startBeat: 22 }, // A2 — hold it
  ],
};

export default level;
