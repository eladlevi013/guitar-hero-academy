import { Level } from "@/types/tab";

// Em Pentatonic — 3-Note Sequences (ascending groups)
// Instead of a straight scale run, play overlapping 3-note groups:
// 1-2-3, 2-3-4, 3-4-5, 4-5-6... This is how soloists actually think.
// Scale notes (box 1): E2, G2, A2, B2, D3, E3, G3, A3
// Groups: [E2,G2,A2] [G2,A2,B2] [A2,B2,D3] [B2,D3,E3] [D3,E3,G3] [E3,G3,A3]
// 108 BPM, 1-beat spacing, 18 notes.
const level: Level = {
  id: "world2-level2",
  title: "Sequences",
  description: "Em pentatonic in overlapping 3-note groups — 1-2-3, 2-3-4, 3-4-5... This is the most important pattern exercise in soloing. Break the linear habit.",
  bpm: 108,
  notes: [
    // ── Group 1: E2, G2, A2 ───────────────────────────────────────────────────
    { id: "n1",  string: 6, fret: 0,  targetFrequency: 82.41,  durationBeats: 1, startBeat: 0  }, // E2
    { id: "n2",  string: 6, fret: 3,  targetFrequency: 98.00,  durationBeats: 1, startBeat: 1  }, // G2
    { id: "n3",  string: 5, fret: 0,  targetFrequency: 110.00, durationBeats: 1, startBeat: 2  }, // A2
    // ── Group 2: G2, A2, B2 ───────────────────────────────────────────────────
    { id: "n4",  string: 6, fret: 3,  targetFrequency: 98.00,  durationBeats: 1, startBeat: 3  }, // G2
    { id: "n5",  string: 5, fret: 0,  targetFrequency: 110.00, durationBeats: 1, startBeat: 4  }, // A2
    { id: "n6",  string: 5, fret: 2,  targetFrequency: 123.47, durationBeats: 1, startBeat: 5  }, // B2
    // ── Group 3: A2, B2, D3 ───────────────────────────────────────────────────
    { id: "n7",  string: 5, fret: 0,  targetFrequency: 110.00, durationBeats: 1, startBeat: 6  }, // A2
    { id: "n8",  string: 5, fret: 2,  targetFrequency: 123.47, durationBeats: 1, startBeat: 7  }, // B2
    { id: "n9",  string: 4, fret: 0,  targetFrequency: 146.83, durationBeats: 1, startBeat: 8  }, // D3
    // ── Group 4: B2, D3, E3 ───────────────────────────────────────────────────
    { id: "n10", string: 5, fret: 2,  targetFrequency: 123.47, durationBeats: 1, startBeat: 9  }, // B2
    { id: "n11", string: 4, fret: 0,  targetFrequency: 146.83, durationBeats: 1, startBeat: 10 }, // D3
    { id: "n12", string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 11 }, // E3
    // ── Group 5: D3, E3, G3 ───────────────────────────────────────────────────
    { id: "n13", string: 4, fret: 0,  targetFrequency: 146.83, durationBeats: 1, startBeat: 12 }, // D3
    { id: "n14", string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 13 }, // E3
    { id: "n15", string: 3, fret: 0,  targetFrequency: 196.00, durationBeats: 1, startBeat: 14 }, // G3
    // ── Group 6: E3, G3, A3 — resolve ─────────────────────────────────────────
    { id: "n16", string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 15 }, // E3
    { id: "n17", string: 3, fret: 0,  targetFrequency: 196.00, durationBeats: 1, startBeat: 16 }, // G3
    { id: "n18", string: 3, fret: 2,  targetFrequency: 220.00, durationBeats: 2, startBeat: 17 }, // A3 — peak, hold
  ],
};

export default level;
