import { Level } from "@/types/tab";

const level: Level = {
  id: "world2-level1",
  title: "Am Rock",
  description: "Drive through the full A minor pentatonic pattern up and back at a rock tempo. Feel the groove as the scale loops on itself.",
  bpm: 78,
  notes: [
    { id: "n1",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 0 },
    { id: "n2",  string: 5, fret: 3, targetFrequency: 130.81, durationBeats: 1, startBeat: 1 },
    { id: "n3",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 2 },
    { id: "n4",  string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 3 },
    { id: "n5",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 4 },
    { id: "n6",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 5 },
    { id: "n7",  string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 6 },
    { id: "n8",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 7 },
    { id: "n9",  string: 5, fret: 3, targetFrequency: 130.81, durationBeats: 1, startBeat: 8 },
    { id: "n10", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 9 },
  ],
};

export default level;
