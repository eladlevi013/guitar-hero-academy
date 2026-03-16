import { Level } from "@/types/tab";

const level: Level = {
  id: "world3-level3",
  title: "A Major Penta",
  description: "A major pentatonic box starting on the low E string. Bright, country-flavoured tones at 105 BPM — nail the cross-string shifts.",
  bpm: 105,
  notes: [
    { id: "n1",  string: 6, fret: 5, targetFrequency: 110.00, durationBeats: 0.5, startBeat: 0   },
    { id: "n2",  string: 6, fret: 7, targetFrequency: 123.47, durationBeats: 0.5, startBeat: 0.5 },
    { id: "n3",  string: 5, fret: 4, targetFrequency: 138.59, durationBeats: 0.5, startBeat: 1   },
    { id: "n4",  string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 0.5, startBeat: 1.5 },
    { id: "n5",  string: 4, fret: 4, targetFrequency: 185.00, durationBeats: 0.5, startBeat: 2   },
    { id: "n6",  string: 4, fret: 7, targetFrequency: 220.00, durationBeats: 0.5, startBeat: 2.5 },
    { id: "n7",  string: 3, fret: 4, targetFrequency: 246.94, durationBeats: 0.5, startBeat: 3   },
    { id: "n8",  string: 3, fret: 6, targetFrequency: 277.18, durationBeats: 0.5, startBeat: 3.5 },
    { id: "n9",  string: 3, fret: 4, targetFrequency: 246.94, durationBeats: 0.5, startBeat: 4   },
    { id: "n10", string: 4, fret: 7, targetFrequency: 220.00, durationBeats: 0.5, startBeat: 4.5 },
    { id: "n11", string: 4, fret: 4, targetFrequency: 185.00, durationBeats: 0.5, startBeat: 5   },
    { id: "n12", string: 5, fret: 7, targetFrequency: 164.81, durationBeats: 0.5, startBeat: 5.5 },
    { id: "n13", string: 5, fret: 4, targetFrequency: 138.59, durationBeats: 0.5, startBeat: 6   },
    { id: "n14", string: 6, fret: 7, targetFrequency: 123.47, durationBeats: 0.5, startBeat: 6.5 },
    { id: "n15", string: 6, fret: 5, targetFrequency: 110.00, durationBeats: 1,   startBeat: 7   },
  ],
};

export default level;
