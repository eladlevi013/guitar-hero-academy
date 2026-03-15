import { Level } from "@/types/tab";

const level: Level = {
  id: "world2-level3",
  title: "Dm Groove",
  description: "Work through the D minor pentatonic scale on the mid strings and back. A darker, groovier feel that lives in a higher register.",
  bpm: 86,
  notes: [
    { id: "n1", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 0 },
    { id: "n2", string: 4, fret: 3, targetFrequency: 174.61, durationBeats: 1, startBeat: 1 },
    { id: "n3", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 2 },
    { id: "n4", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 3 },
    { id: "n5", string: 3, fret: 5, targetFrequency: 261.63, durationBeats: 1, startBeat: 4 },
    { id: "n6", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 1, startBeat: 5 },
    { id: "n7", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 6 },
    { id: "n8", string: 4, fret: 3, targetFrequency: 174.61, durationBeats: 1, startBeat: 7 },
    { id: "n9", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 8 },
  ],
};

export default level;
