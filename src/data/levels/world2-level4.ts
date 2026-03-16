import { Level } from "@/types/tab";

// Em Pentatonic — String Skip (ping-pong pattern, box 1)
// Instead of playing adjacent strings, skip one string between each note.
// Creates wide interval jumps that break the linear scale habit.
// Pattern: str6↔str4, str5↔str3, str4↔str2, str3↔str1 — cycling up.
// 110 BPM, 1-beat spacing, 16 notes.
const level: Level = {
  id: "world2-level4",
  title: "String Skip",
  description: "Em pentatonic with one string skipped between every note. Ping-pong from thick to thin strings. This is what makes pentatonic sound wide and open instead of scalar.",
  bpm: 110,
  notes: [
    // ── Phase 1: str6 ↔ str4 ──────────────────────────────────────────────────
    { id: "n1",  string: 6, fret: 0,  targetFrequency: 82.41,  durationBeats: 1, startBeat: 0  }, // E2
    { id: "n2",  string: 4, fret: 0,  targetFrequency: 146.83, durationBeats: 1, startBeat: 1  }, // D3 (skip str5)
    { id: "n3",  string: 6, fret: 3,  targetFrequency: 98.00,  durationBeats: 1, startBeat: 2  }, // G2
    { id: "n4",  string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 3  }, // E3 (skip str5)
    // ── Phase 2: str5 ↔ str3 ──────────────────────────────────────────────────
    { id: "n5",  string: 5, fret: 0,  targetFrequency: 110.00, durationBeats: 1, startBeat: 4  }, // A2
    { id: "n6",  string: 3, fret: 0,  targetFrequency: 196.00, durationBeats: 1, startBeat: 5  }, // G3 (skip str4)
    { id: "n7",  string: 5, fret: 2,  targetFrequency: 123.47, durationBeats: 1, startBeat: 6  }, // B2
    { id: "n8",  string: 3, fret: 2,  targetFrequency: 220.00, durationBeats: 1, startBeat: 7  }, // A3 (skip str4)
    // ── Phase 3: str4 ↔ str2 ──────────────────────────────────────────────────
    { id: "n9",  string: 4, fret: 0,  targetFrequency: 146.83, durationBeats: 1, startBeat: 8  }, // D3
    { id: "n10", string: 2, fret: 0,  targetFrequency: 246.94, durationBeats: 1, startBeat: 9  }, // B3 (skip str3)
    { id: "n11", string: 4, fret: 2,  targetFrequency: 164.81, durationBeats: 1, startBeat: 10 }, // E3
    { id: "n12", string: 2, fret: 3,  targetFrequency: 293.66, durationBeats: 1, startBeat: 11 }, // D4 (skip str3)
    // ── Phase 4: str3 ↔ str1 ──────────────────────────────────────────────────
    { id: "n13", string: 3, fret: 0,  targetFrequency: 196.00, durationBeats: 1, startBeat: 12 }, // G3
    { id: "n14", string: 1, fret: 0,  targetFrequency: 329.63, durationBeats: 1, startBeat: 13 }, // E4 (skip str2)
    { id: "n15", string: 3, fret: 2,  targetFrequency: 220.00, durationBeats: 1, startBeat: 14 }, // A3
    { id: "n16", string: 1, fret: 3,  targetFrequency: 392.00, durationBeats: 2, startBeat: 15 }, // G4 (skip str2) — peak, hold
  ],
};

export default level;
