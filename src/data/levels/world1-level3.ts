import { Level } from "@/types/tab";

// Em Pentatonic — Pedal Tone (Box 1)
// Alternate between the open low E (root, fret 0 str6) and each ascending scale note.
// The root repeats as a "pedal" — it anchors every note against home base.
// Teaches root-note awareness: you hear each scale note's colour against the tonic.
// Classic exercise: every real guitarist drills this before soloing over a static chord.
// Ascending with pedal (22 notes), then straight descent (11 notes). 90 BPM, 1-beat.
const level: Level = {
  id: "world1-level3",
  title: "Pedal Tone",
  description: "Return to open E2 after every note as you climb the scale. The root acts as a pedal — each scale note gets heard against home. Ascending with the pedal, straight back down.",
  bpm: 90,
  notes: [
    // ── Ascending — root pedal between every scale note ───────────────────────
    { id: "n1",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 0  }, // E2 (root)
    { id: "n2",  string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 1  }, // G2
    { id: "n3",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 2  }, // E2 (root)
    { id: "n4",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 3  }, // A2
    { id: "n5",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 4  }, // E2 (root)
    { id: "n6",  string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 5  }, // B2
    { id: "n7",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 6  }, // E2 (root)
    { id: "n8",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 7  }, // D3
    { id: "n9",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 8  }, // E2 (root)
    { id: "n10", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 9  }, // E3
    { id: "n11", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 10 }, // E2 (root)
    { id: "n12", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 11 }, // G3
    { id: "n13", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 12 }, // E2 (root)
    { id: "n14", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 13 }, // A3
    { id: "n15", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 14 }, // E2 (root)
    { id: "n16", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 15 }, // B3
    { id: "n17", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 16 }, // E2 (root)
    { id: "n18", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 17 }, // D4
    { id: "n19", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 18 }, // E2 (root)
    { id: "n20", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 19 }, // E4
    { id: "n21", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 20 }, // E2 (root)
    { id: "n22", string: 1, fret: 3, targetFrequency: 392.00, durationBeats: 2, startBeat: 21 }, // G4 — PEAK, hold
    // ── Descending — straight back, no pedal ──────────────────────────────────
    { id: "n23", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 23 }, // E4
    { id: "n24", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 24 }, // D4
    { id: "n25", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 25 }, // B3
    { id: "n26", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 26 }, // A3
    { id: "n27", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 27 }, // G3
    { id: "n28", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 28 }, // E3
    { id: "n29", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 29 }, // D3
    { id: "n30", string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 30 }, // B2
    { id: "n31", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 31 }, // A2
    { id: "n32", string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 32 }, // G2
    { id: "n33", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 2, startBeat: 33 }, // E2 — resolve
  ],
};

export default level;
