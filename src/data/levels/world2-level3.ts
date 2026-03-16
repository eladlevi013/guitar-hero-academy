import { Level } from "@/types/tab";

// Blues Lick — an actual blues lick in Am, not a scale run.
// Starts on A3, descends through the blues scale with the Eb3 blue note,
// lands on A2, then climbs back up to resolve on A3.
// Eb3 appears twice — once descending (tension), once ascending (release).
// 88 BPM, 13 notes, quarter notes throughout.
const level: Level = {
  id: "world2-level3",
  title: "Blues Lick",
  description: "A real blues lick — not a scale drill. Start high, fall through the blue note, land on the root, climb back up. The Eb3 appears twice: once as a question, once as the answer.",
  bpm: 88,
  notes: [
    { id: "n1",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 0  }, // A3 — start high
    { id: "n2",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 1  }, // G3
    { id: "n3",  string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 2  }, // E3
    { id: "n4",  string: 4, fret: 1, targetFrequency: 155.56, durationBeats: 1, startBeat: 3  }, // Eb3 ← blue note (tension)
    { id: "n5",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 4  }, // D3
    { id: "n6",  string: 5, fret: 3, targetFrequency: 130.81, durationBeats: 1, startBeat: 5  }, // C3
    { id: "n7",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 6  }, // A2 — root landed
    { id: "n8",  string: 5, fret: 3, targetFrequency: 130.81, durationBeats: 1, startBeat: 7  }, // C3 — climb back
    { id: "n9",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 8  }, // D3
    { id: "n10", string: 4, fret: 1, targetFrequency: 155.56, durationBeats: 1, startBeat: 9  }, // Eb3 ← blue note (release)
    { id: "n11", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 10 }, // E3
    { id: "n12", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 11 }, // G3
    { id: "n13", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 2, startBeat: 12 }, // A3 — resolve
  ],
};

export default level;
