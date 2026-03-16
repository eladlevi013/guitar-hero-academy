import { Level } from "@/types/tab";

// G Major Phrase — not a scale run. A musical statement in G major.
// Opens with a G major arpeggio (G-B-D), climbs stepwise to E4, descends back.
// Tells a complete melodic story: departure, climb, return.
// 80 BPM, 13 notes, quarter notes throughout.
const level: Level = {
  id: "world2-level2",
  title: "G Major Phrase",
  description: "G major as a real melodic phrase — not a scale run. An arpeggio launch, a stepwise climb to the top, and a descent back home. This is how solos are actually built.",
  bpm: 80,
  notes: [
    { id: "n1",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 0  }, // G3 — root
    { id: "n2",  string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 1  }, // B3 — arpeggio
    { id: "n3",  string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 2  }, // D4 — arpeggio
    { id: "n4",  string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 3  }, // B3 — back
    { id: "n5",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 4  }, // G3 — root again
    { id: "n6",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 5  }, // A3 — stepwise up
    { id: "n7",  string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 6  }, // B3
    { id: "n8",  string: 2, fret: 1, targetFrequency: 261.63, durationBeats: 1, startBeat: 7  }, // C4
    { id: "n9",  string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 8  }, // D4
    { id: "n10", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 9  }, // E4 — peak
    { id: "n11", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 1, startBeat: 10 }, // D4 — descend
    { id: "n12", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 11 }, // B3
    { id: "n13", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 2, startBeat: 12 }, // G3 — home
  ],
};

export default level;
