import { Level } from "@/types/tab";

// Am Pentatonic at Speed — same notes as World 1 Level 3, but eighth notes.
// A2 to A4 and back, all 0.5-beat (eighth) notes at 95 BPM = ~316ms per note.
// The jump from quarter to eighth notes is where real speed begins.
// 95 BPM, 22 notes, eighth notes throughout.
const level: Level = {
  id: "world2-level4",
  title: "Penta Speed",
  description: "You know the Am pentatonic. Now play it fast — eighth notes at 95 BPM. Same shape, double the tempo. This is where the pentatonic starts feeling like a solo.",
  bpm: 95,
  notes: [
    // Ascend — A2 to A4 (2 octaves, all eighth notes)
    { id: "n1",  string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 0.5, startBeat: 0   }, // A2
    { id: "n2",  string: 5, fret: 3, targetFrequency: 130.81, durationBeats: 0.5, startBeat: 0.5 }, // C3
    { id: "n3",  string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 0.5, startBeat: 1   }, // D3
    { id: "n4",  string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 0.5, startBeat: 1.5 }, // E3
    { id: "n5",  string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 0.5, startBeat: 2   }, // G3
    { id: "n6",  string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 0.5, startBeat: 2.5 }, // A3
    { id: "n7",  string: 2, fret: 1, targetFrequency: 261.63, durationBeats: 0.5, startBeat: 3   }, // C4
    { id: "n8",  string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 0.5, startBeat: 3.5 }, // D4
    { id: "n9",  string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 0.5, startBeat: 4   }, // E4
    { id: "n10", string: 1, fret: 3, targetFrequency: 392.00, durationBeats: 0.5, startBeat: 4.5 }, // G4
    { id: "n11", string: 1, fret: 5, targetFrequency: 440.00, durationBeats: 0.5, startBeat: 5   }, // A4 — peak

    // Descend — A4 back to A2
    { id: "n12", string: 1, fret: 3, targetFrequency: 392.00, durationBeats: 0.5, startBeat: 5.5 }, // G4
    { id: "n13", string: 1, fret: 0, targetFrequency: 329.63, durationBeats: 0.5, startBeat: 6   }, // E4
    { id: "n14", string: 2, fret: 3, targetFrequency: 293.66, durationBeats: 0.5, startBeat: 6.5 }, // D4
    { id: "n15", string: 2, fret: 1, targetFrequency: 261.63, durationBeats: 0.5, startBeat: 7   }, // C4
    { id: "n16", string: 3, fret: 2, targetFrequency: 220.00, durationBeats: 0.5, startBeat: 7.5 }, // A3
    { id: "n17", string: 3, fret: 0, targetFrequency: 196.00, durationBeats: 0.5, startBeat: 8   }, // G3
    { id: "n18", string: 4, fret: 2, targetFrequency: 164.81, durationBeats: 0.5, startBeat: 8.5 }, // E3
    { id: "n19", string: 4, fret: 0, targetFrequency: 146.83, durationBeats: 0.5, startBeat: 9   }, // D3
    { id: "n20", string: 5, fret: 3, targetFrequency: 130.81, durationBeats: 0.5, startBeat: 9.5 }, // C3
    { id: "n21", string: 5, fret: 0, targetFrequency: 110.00, durationBeats: 1,   startBeat: 10  }, // A2 — resolve (hold it)
  ],
};

export default level;
