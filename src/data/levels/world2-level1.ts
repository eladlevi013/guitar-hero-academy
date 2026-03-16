import { Level } from "@/types/tab";

// Em Groove — Em pentatonic with E2 as the constant home base.
// Every other note returns to E2, like a root pedal. Sounds like a riff.
// 75 BPM, 11 notes, quarter notes throughout.
const level: Level = {
  id: "world2-level1",
  title: "Em Groove",
  description: "The Em pentatonic scale as a groove — not a scale run. Every note returns to E2 before going higher. This is the pedal-tone technique that powers metal riffs.",
  bpm: 75,
  notes: [
    { id: "n1",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 0  }, // E2 — home
    { id: "n2",  string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 1  }, // G2
    { id: "n3",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 2  }, // E2 — home
    { id: "n4",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 3  }, // A2
    { id: "n5",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 4  }, // E2 — home
    { id: "n6",  string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 5  }, // B2
    { id: "n7",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 6  }, // A2
    { id: "n8",  string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 7  }, // G2
    { id: "n9",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 8  }, // E2 — home
    { id: "n10", string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 9  }, // G2
    { id: "n11", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 2, startBeat: 10 }, // E2 — resolve
  ],
};

export default level;
