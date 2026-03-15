import { Level } from "@/types/tab";

const level: Level = {
  id: "world2-level5",
  title: "Em Scale Drive",
  description: "Run the E minor scale through the mid-to-high register and back. Crossing string sets at speed builds essential fretting-hand accuracy.",
  bpm: 95,
  notes: [
    { id: "n1",  string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 0  },
    { id: "n2",  string: 4, fret: 4, targetFrequency: 185.00, durationBeats: 1, startBeat: 1  },
    { id: "n3",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 2  },
    { id: "n4",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 3  },
    { id: "n5",  string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 4  },
    { id: "n6",  string: 3, fret: 5, targetFrequency: 261.63, durationBeats: 1, startBeat: 5  },
    { id: "n7",  string: 3, fret: 7, targetFrequency: 293.66, durationBeats: 1, startBeat: 6  },
    { id: "n8",  string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 7  },
    { id: "n9",  string: 3, fret: 7, targetFrequency: 293.66, durationBeats: 1, startBeat: 8  },
    { id: "n10", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 9  },
    { id: "n11", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 10 },
    { id: "n12", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 11 },
  ],
};

export default level;
