import { Level } from "@/types/tab";

const level: Level = {
  id: "world3-level4",
  title: "Blues Speed",
  description: "The A blues scale at 110 BPM with eighth notes. That flat-five blue note flies by fast — keep your hand steady and hit it clean.",
  bpm: 110,
  notes: [
    { id: "n1",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 0.5, startBeat: 0   },
    { id: "n2",  string: 5, fret: 3, targetFrequency: 130.81, durationBeats: 0.5, startBeat: 0.5 },
    { id: "n3",  string: 5, fret: 5, targetFrequency: 146.83, durationBeats: 0.5, startBeat: 1   },
    { id: "n4",  string: 5, fret: 6, targetFrequency: 155.56, durationBeats: 0.5, startBeat: 1.5 },
    { id: "n5",  string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 0.5, startBeat: 2   },
    { id: "n6",  string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 0.5, startBeat: 2.5 },
    { id: "n7",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 0.5, startBeat: 3   },
    { id: "n8",  string: 4, fret: 5, targetFrequency: 196.00, durationBeats: 0.5, startBeat: 3.5 },
    { id: "n9",  string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 0.5, startBeat: 4   },
    { id: "n10", string: 5, fret: 6, targetFrequency: 155.56, durationBeats: 0.5, startBeat: 4.5 },
    { id: "n11", string: 5, fret: 5, targetFrequency: 146.83, durationBeats: 0.5, startBeat: 5   },
    { id: "n12", string: 5, fret: 3, targetFrequency: 130.81, durationBeats: 0.5, startBeat: 5.5 },
    { id: "n13", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1,   startBeat: 6   },
  ],
};

export default level;
