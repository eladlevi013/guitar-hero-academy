import { Level } from "@/types/tab";

// Em Pentatonic — full neck, 2 positions connected.
// Position 1 (open): E2-G2 · A2-B2 · D3-E3
// Position 2 (continues): G3-A3 · B3-D4 · E4-G4
// Together they cover 2+ octaves in one continuous run.
// 105 BPM, 23 notes, eighth notes throughout.
const level: Level = {
  id: "world2-level5",
  title: "Full Neck Em",
  description: "Connect two positions of the Em pentatonic in one long run across the whole neck. This is how you start thinking in shapes instead of single notes.",
  bpm: 105,
  notes: [
    // Position 1 — open (E2 to E3)
    { id: "n1",  string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 0.5, startBeat: 0   }, // E2
    { id: "n2",  string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 0.5, startBeat: 0.5 }, // G2
    { id: "n3",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 0.5, startBeat: 1   }, // A2
    { id: "n4",  string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 0.5, startBeat: 1.5 }, // B2
    { id: "n5",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 0.5, startBeat: 2   }, // D3
    { id: "n6",  string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 0.5, startBeat: 2.5 }, // E3

    // Position 2 — continues up (G3 to G4)
    { id: "n7",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 0.5, startBeat: 3   }, // G3
    { id: "n8",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 0.5, startBeat: 3.5 }, // A3
    { id: "n9",  string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 0.5, startBeat: 4   }, // B3
    { id: "n10", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 0.5, startBeat: 4.5 }, // D4
    { id: "n11", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 0.5, startBeat: 5   }, // E4
    { id: "n12", string: 1, fret: 3, targetFrequency: 392.00, durationBeats: 0.5, startBeat: 5.5 }, // G4 — top

    // Full descent — position 2 back through position 1
    { id: "n13", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 0.5, startBeat: 6   }, // E4
    { id: "n14", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 0.5, startBeat: 6.5 }, // D4
    { id: "n15", string: 2, fret: 0, targetFrequency: 246.94, durationBeats: 0.5, startBeat: 7   }, // B3
    { id: "n16", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 0.5, startBeat: 7.5 }, // A3
    { id: "n17", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 0.5, startBeat: 8   }, // G3
    { id: "n18", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 0.5, startBeat: 8.5 }, // E3
    { id: "n19", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 0.5, startBeat: 9   }, // D3
    { id: "n20", string: 5, fret: 2, targetFrequency: 123.47, durationBeats: 0.5, startBeat: 9.5 }, // B2
    { id: "n21", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 0.5, startBeat: 10  }, // A2
    { id: "n22", string: 6, fret: 3, targetFrequency: 98.00,  durationBeats: 0.5, startBeat: 10.5}, // G2
    { id: "n23", string: 6, fret: 0, targetFrequency: 82.41,  durationBeats: 1,   startBeat: 11  }, // E2 — resolve
  ],
};

export default level;
