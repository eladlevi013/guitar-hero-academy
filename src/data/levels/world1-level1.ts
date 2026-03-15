import { Level } from "@/types/tab";

const level: Level = {
  id: "world1-level1",
  title: "Six Strings",
  description: "Walk across all six open strings from low to high, then back down. Learn the name and sound of every string in standard tuning.",
  bpm: 55,
  notes: [
    { id: "n1", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 0 },
    { id: "n2", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 1 },
    { id: "n3", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 1, startBeat: 2 },
    { id: "n4", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 3 },
    { id: "n5", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 4 },
    { id: "n6", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 1, startBeat: 5 },
    { id: "n7", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 1, startBeat: 6 },
    { id: "n8", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 1, startBeat: 7 },
  ],
};

export default level;
