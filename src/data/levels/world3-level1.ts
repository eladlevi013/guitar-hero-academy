import { Level } from "@/types/tab";

const level: Level = {
  id: "world3-level1",
  title: "D Major",
  description: "Climb the D major scale from open D string up to D4, then descend back. Focus on clean fretting across strings 4 and 3.",
  bpm: 95,
  notes: [
    { id: "n1",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 0  },
    { id: "n2",  string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 1  },
    { id: "n3",  string: 4, fret: 4, targetFrequency: 185.00, durationBeats: 1, startBeat: 2  },
    { id: "n4",  string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 1, startBeat: 3  },
    { id: "n5",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 4  },
    { id: "n6",  string: 3, fret: 4, targetFrequency: 246.94, durationBeats: 1, startBeat: 5  },
    { id: "n7",  string: 3, fret: 6, targetFrequency: 277.18, durationBeats: 1, startBeat: 6  },
    { id: "n8",  string: 3, fret: 7, targetFrequency: 293.66, durationBeats: 1, startBeat: 7  },
    { id: "n9",  string: 3, fret: 6, targetFrequency: 277.18, durationBeats: 1, startBeat: 8  },
    { id: "n10", string: 3, fret: 4, targetFrequency: 246.94, durationBeats: 1, startBeat: 9  },
    { id: "n11", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 10 },
    { id: "n12", string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 1, startBeat: 11 },
    { id: "n13", string: 4, fret: 4, targetFrequency: 185.00, durationBeats: 1, startBeat: 12 },
    { id: "n14", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 13 },
    { id: "n15", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 14 },
  ],
};

export default level;
