import { Level } from "@/types/tab";

const level: Level = {
  id: "world3-level2",
  title: "Em Box 2",
  description: "Em pentatonic Box 2 at the 7th position. Higher frets, eighth-note speed — shift your hand up the neck and feel the new shape.",
  bpm: 100,
  notes: [
    { id: "n1",  string: 5, fret: 7,  targetFrequency: 164.81, durationBeats: 0.5, startBeat: 0   },
    { id: "n2",  string: 5, fret: 10, targetFrequency: 196.00, durationBeats: 0.5, startBeat: 0.5 },
    { id: "n3",  string: 4, fret: 7,  targetFrequency: 220.00, durationBeats: 0.5, startBeat: 1   },
    { id: "n4",  string: 4, fret: 9,  targetFrequency: 246.94, durationBeats: 0.5, startBeat: 1.5 },
    { id: "n5",  string: 3, fret: 7,  targetFrequency: 293.66, durationBeats: 0.5, startBeat: 2   },
    { id: "n6",  string: 3, fret: 9,  targetFrequency: 329.63, durationBeats: 0.5, startBeat: 2.5 },
    { id: "n7",  string: 2, fret: 8,  targetFrequency: 392.00, durationBeats: 0.5, startBeat: 3   },
    { id: "n8",  string: 2, fret: 10, targetFrequency: 440.00, durationBeats: 0.5, startBeat: 3.5 },
    { id: "n9",  string: 2, fret: 8,  targetFrequency: 392.00, durationBeats: 0.5, startBeat: 4   },
    { id: "n10", string: 3, fret: 9,  targetFrequency: 329.63, durationBeats: 0.5, startBeat: 4.5 },
    { id: "n11", string: 3, fret: 7,  targetFrequency: 293.66, durationBeats: 0.5, startBeat: 5   },
    { id: "n12", string: 4, fret: 9,  targetFrequency: 246.94, durationBeats: 0.5, startBeat: 5.5 },
    { id: "n13", string: 4, fret: 7,  targetFrequency: 220.00, durationBeats: 0.5, startBeat: 6   },
    { id: "n14", string: 5, fret: 10, targetFrequency: 196.00, durationBeats: 0.5, startBeat: 6.5 },
    { id: "n15", string: 5, fret: 7,  targetFrequency: 164.81, durationBeats: 1,   startBeat: 7   },
  ],
};

export default level;
