import { Level } from "@/types/tab";

const level: Level = {
  id: "world3-level1",
  title: "Am Speed",
  description: "Burn through the A minor pentatonic with an upper extension up to C4, then race back to the root. Speed and accuracy are both tested here.",
  bpm: 108,
  notes: [
    { id: "n1",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 0  },
    { id: "n2",  string: 5, fret: 3, targetFrequency: 130.81, durationBeats: 1, startBeat: 1  },
    { id: "n3",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 2  },
    { id: "n4",  string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 3  },
    { id: "n5",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 4  },
    { id: "n6",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 5  },
    { id: "n7",  string: 3, fret: 5, targetFrequency: 261.63, durationBeats: 1, startBeat: 6  },
    { id: "n8",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 7  },
    { id: "n9",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 8  },
    { id: "n10", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 9  },
    { id: "n11", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 10 },
    { id: "n12", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 11 },
  ],
};

export default level;
