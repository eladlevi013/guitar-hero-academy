import { Level } from "@/types/tab";

const level: Level = {
  id: "world1-level4",
  title: "G Major Feel",
  description: "Explore the bright, uplifting G major pentatonic scale across three strings. Notice the cheerful mood shift from the minor scales.",
  bpm: 66,
  notes: [
    { id: "n1", string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 0 },
    { id: "n2", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 1 },
    { id: "n3", string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 2 },
    { id: "n4", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 3 },
    { id: "n5", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 4 },
    { id: "n6", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 5 },
    { id: "n7", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 1, startBeat: 6 },
    { id: "n8", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 7 },
  ],
};

export default level;
