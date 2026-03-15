import { Level } from "@/types/tab";

const level: Level = {
  id: "world2-level6",
  title: "Full Pentatonic",
  description: "Sweep the E minor pentatonic across the full neck from low E to high G and back down. A complete tour of one of guitar's most powerful shapes.",
  bpm: 100,
  notes: [
    { id: "n1",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 0  },
    { id: "n2",  string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 1  },
    { id: "n3",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 2  },
    { id: "n4",  string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 3  },
    { id: "n5",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 4  },
    { id: "n6",  string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 5  },
    { id: "n7",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 6  },
    { id: "n8",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 7  },
    { id: "n9",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 8  },
    { id: "n10", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 9  },
    { id: "n11", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 10 },
    { id: "n12", string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 11 },
    { id: "n13", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 12 },
    { id: "n14", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 13 },
  ],
};

export default level;
