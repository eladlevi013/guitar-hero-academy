import { Level } from "@/types/tab";

const level: Level = {
  id: "world2-level4",
  title: "Rock Riff",
  description: "A driving E minor rock riff that bounces between the tonic and upper neighbours. Think classic power-chord territory on single strings.",
  bpm: 90,
  notes: [
    { id: "n1",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 0 },
    { id: "n2",  string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 1 },
    { id: "n3",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 2 },
    { id: "n4",  string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 3 },
    { id: "n5",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 4 },
    { id: "n6",  string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 1, startBeat: 5 },
    { id: "n7",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 6 },
    { id: "n8",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1, startBeat: 7 },
    { id: "n9",  string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 1, startBeat: 8 },
    { id: "n10", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1, startBeat: 9 },
  ],
};

export default level;
