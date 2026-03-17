import { Level, TabNote } from "@/types/tab";

type GuitarString = TabNote["string"];

type NotePos = {
  string: GuitarString;
  fret: number;
  durationBeats?: number;
};

const OPEN_STRING_FREQUENCIES: Record<GuitarString, number> = {
  1: 329.63,
  2: 246.94,
  3: 196.0,
  4: 146.83,
  5: 110.0,
  6: 82.41,
};

function p(string: GuitarString, fret: number, durationBeats: number = 1): NotePos {
  return { string, fret, durationBeats };
}

function frequencyFor({ string, fret }: NotePos) {
  const hz = OPEN_STRING_FREQUENCIES[string] * Math.pow(2, fret / 12);
  return Math.round(hz * 100) / 100;
}

function buildNotes(pattern: NotePos[], beatStep: number): TabNote[] {
  let startBeat = 0;

  return pattern.map((note, idx) => {
    const built: TabNote = {
      id: `n${idx + 1}`,
      string: note.string,
      fret: note.fret,
      targetFrequency: frequencyFor(note),
      durationBeats: note.durationBeats ?? 1,
      startBeat: Math.round(startBeat * 1000) / 1000,
    };
    startBeat += beatStep;
    return built;
  });
}

function hold(note: NotePos, durationBeats: number): NotePos {
  return { ...note, durationBeats };
}

function ascDesc(pattern: NotePos[], peakHoldBeats: number = 2, resolveHoldBeats: number = 2): NotePos[] {
  const up = pattern.map((note, idx) => idx === pattern.length - 1 ? hold(note, peakHoldBeats) : note);
  const downBase = pattern.slice(0, -1).reverse();
  const down = downBase.map((note, idx) => idx === downBase.length - 1 ? hold(note, resolveHoldBeats) : note);
  return [...up, ...down];
}

function overlappingGroups(pattern: NotePos[], groupSize: number, holdLastBeats: number = 2): NotePos[] {
  const out: NotePos[] = [];
  for (let i = 0; i <= pattern.length - groupSize; i++) {
    for (let j = 0; j < groupSize; j++) {
      out.push({ ...pattern[i + j] });
    }
  }
  if (out.length > 0) out[out.length - 1] = hold(out[out.length - 1], holdLastBeats);
  return out;
}

function pedal(root: NotePos, pattern: NotePos[], peakHoldBeats: number = 2, resolveHoldBeats: number = 2): NotePos[] {
  const ascent: NotePos[] = [];
  pattern.forEach((note, idx) => {
    ascent.push({ ...root });
    ascent.push(idx === pattern.length - 1 ? hold(note, peakHoldBeats) : { ...note });
  });

  const downBase = pattern.slice(0, -1).reverse();
  const down = downBase.map((note, idx) => idx === downBase.length - 1 ? hold(note, resolveHoldBeats) : note);
  return [...ascent, ...down];
}

function intervalPairs(pattern: NotePos[], gap: number, resolveHoldBeats: number = 2): NotePos[] {
  const out: NotePos[] = [];
  for (let i = 0; i < pattern.length - gap; i++) {
    out.push({ ...pattern[i] });
    out.push({ ...pattern[i + gap] });
  }

  const downBase = pattern.slice(0, -1).reverse();
  const down = downBase.map((note, idx) => idx === downBase.length - 1 ? hold(note, resolveHoldBeats) : note);
  return [...out, ...down];
}

function createLevel({
  id,
  title,
  subtitle,
  description,
  focus,
  bpm,
  difficulty,
  pattern,
  beatStep,
}: {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  focus: string;
  bpm: number;
  difficulty: "easy" | "medium" | "hard";
  pattern: NotePos[];
  beatStep: number;
}): Level {
  return {
    id,
    title,
    subtitle,
    description,
    focus,
    bpm,
    difficulty,
    notes: buildNotes(pattern, beatStep),
  };
}

const EM_PENTA_BOX1 = [
  p(6, 0), p(6, 3), p(5, 0), p(5, 2), p(4, 0), p(4, 2),
  p(3, 0), p(3, 2), p(2, 0), p(2, 3), p(1, 0), p(1, 3),
];

const EM_POSITION_LINK = [
  p(6, 0), p(6, 3), p(5, 0), p(5, 2), p(4, 0), p(4, 2),
  p(3, 0), p(3, 2), p(2, 0), p(2, 3), p(1, 0), p(1, 3), p(1, 5), p(1, 7),
];

const E_BLUES_OPEN = [
  p(6, 0), p(6, 3), p(5, 0), p(5, 1), p(5, 2), p(4, 0),
  p(4, 2), p(3, 0), p(3, 3), p(2, 0), p(2, 3), p(1, 0), p(1, 3),
];

const AM_PENTA_BOX1 = [
  p(6, 5), p(6, 8), p(5, 5), p(5, 7), p(4, 5), p(4, 7),
  p(3, 5), p(3, 7), p(2, 5), p(2, 8), p(1, 5), p(1, 8),
];

const A_BLUES_BOX1 = [
  p(6, 5), p(6, 8), p(5, 5), p(5, 6), p(5, 7), p(4, 5),
  p(4, 7), p(3, 5), p(3, 7), p(2, 5), p(2, 8), p(1, 5), p(1, 8),
];

const D_MAJOR = [
  p(4, 0), p(4, 2), p(4, 4), p(3, 1), p(3, 2), p(3, 4),
  p(2, 0), p(2, 2), p(2, 3), p(1, 0), p(1, 2), p(1, 3),
];

const E_NATURAL_MINOR = [
  p(6, 0), p(6, 2), p(6, 3), p(5, 0), p(5, 2), p(5, 3),
  p(4, 0), p(4, 2), p(4, 4), p(3, 0), p(3, 2), p(3, 4),
  p(2, 0), p(2, 1), p(2, 3), p(1, 0),
];

const A_MAJOR_PENTA = [
  p(6, 5), p(6, 7), p(5, 4), p(5, 7), p(4, 4), p(4, 7),
  p(3, 4), p(3, 6), p(2, 5), p(2, 7), p(1, 5), p(1, 7),
];

const E_DORIAN = [
  p(6, 0), p(6, 2), p(6, 3), p(5, 0), p(5, 2), p(5, 4),
  p(4, 0), p(4, 2), p(4, 4), p(3, 0), p(3, 2), p(3, 4),
  p(2, 2), p(2, 3), p(1, 0),
];

const A_MIXOLYDIAN = [
  p(6, 5), p(6, 7), p(6, 9), p(5, 5), p(5, 7), p(5, 9),
  p(4, 5), p(4, 7), p(4, 9), p(3, 6), p(3, 7), p(2, 5), p(2, 7), p(1, 5),
];

const E_MINOR_ARPEGGIO = [
  p(6, 0), p(5, 2), p(4, 2), p(3, 0), p(2, 0), p(1, 0), p(1, 3), p(1, 7),
];

const EM_STRING_SKIP = [
  p(6, 0), p(4, 0), p(5, 0), p(3, 0), p(4, 2), p(2, 0),
  p(3, 2), p(1, 0), p(2, 3), p(1, 3), p(2, 0), p(3, 0),
];

const EM_FULL_NECK = [
  p(6, 0), p(6, 3), p(5, 0), p(5, 2), p(4, 0), p(4, 2), p(4, 5),
  p(3, 2), p(3, 4), p(2, 3), p(2, 5), p(1, 3), p(1, 5), p(1, 7), p(1, 10), p(1, 12),
];

const SOLO_WORKOUT = [
  p(6, 0), p(6, 3), p(5, 0), p(5, 1), p(5, 2), p(4, 0), p(4, 2), p(3, 0),
  p(3, 2), p(2, 0), p(2, 3), p(1, 0), p(1, 3), p(1, 5), p(1, 7), p(2, 5),
  p(2, 3), p(1, 0), p(2, 0), p(3, 0), p(4, 2), p(5, 0), p(6, 0, 2),
];

export const world1Level1 = createLevel({
  id: "world1-level1",
  title: "E Minor Pentatonic",
  subtitle: "Box 1 map",
  description: "Learn the core open E minor pentatonic box from the lowest root to the top string, then come back down cleanly.",
  focus: "Scale mapping and clean alternate picking",
  bpm: 88,
  difficulty: "easy",
  pattern: ascDesc(EM_PENTA_BOX1),
  beatStep: 2,
});

export const world1Level2 = createLevel({
  id: "world1-level2",
  title: "E Minor Sequences",
  subtitle: "3-note groups",
  description: "Overlap the scale in 3-note groups so level 2 already feels like lead-guitar vocabulary instead of a plain scale run.",
  focus: "Sequencing accuracy and rhythmic control",
  bpm: 102,
  difficulty: "medium",
  pattern: overlappingGroups(EM_PENTA_BOX1, 3),
  beatStep: 1,
});

export const world1Level3 = createLevel({
  id: "world1-level3",
  title: "E Blues Scale",
  subtitle: "Add the blue note",
  description: "Add the flat-five and hear how the open blues sound changes the line. Great for first blues phrasing practice.",
  focus: "Blues phrasing and color-tone awareness",
  bpm: 96,
  difficulty: "medium",
  pattern: ascDesc(E_BLUES_OPEN),
  beatStep: 1,
});

export const world1Level4 = createLevel({
  id: "world1-level4",
  title: "A Minor Pentatonic",
  subtitle: "5th-fret box",
  description: "Move the same pentatonic logic to the 5th fret so the app starts training position awareness, not just open strings.",
  focus: "Position awareness and fretboard transfer",
  bpm: 96,
  difficulty: "medium",
  pattern: ascDesc(AM_PENTA_BOX1),
  beatStep: 1,
});

export const world1Level5 = createLevel({
  id: "world1-level5",
  title: "A Minor Thirds",
  subtitle: "Interval drill",
  description: "Play interval pairs through A minor pentatonic. This is a very practical way to sound musical instead of just scalar.",
  focus: "Interval hearing and string crossing",
  bpm: 98,
  difficulty: "medium",
  pattern: intervalPairs(AM_PENTA_BOX1, 2),
  beatStep: 1,
});

export const world1Level6 = createLevel({
  id: "world1-level6",
  title: "E Position Shift",
  subtitle: "Box 1 into higher reach",
  description: "Climb past the familiar open box and keep going into higher notes. This introduces the hand shift that real players need.",
  focus: "Position shifting with stable timing",
  bpm: 108,
  difficulty: "hard",
  pattern: ascDesc(EM_POSITION_LINK),
  beatStep: 1,
});

export const world2Level1 = createLevel({
  id: "world2-level1",
  title: "D Major Scale",
  subtitle: "Clean major phrasing",
  description: "A useful major-scale drill across the middle strings. Great for picking accuracy and hearing a brighter scale color.",
  focus: "Major-scale clarity and pick control",
  bpm: 94,
  difficulty: "medium",
  pattern: ascDesc(D_MAJOR),
  beatStep: 1,
});

export const world2Level2 = createLevel({
  id: "world2-level2",
  title: "E Natural Minor",
  subtitle: "Full 7-note shape",
  description: "Expand beyond pentatonic into the full natural minor sound. This is the bridge from box playing to real scale fluency.",
  focus: "Seven-note scale fluency",
  bpm: 100,
  difficulty: "medium",
  pattern: ascDesc(E_NATURAL_MINOR),
  beatStep: 1,
});

export const world2Level3 = createLevel({
  id: "world2-level3",
  title: "A Major Pentatonic",
  subtitle: "Country-friendly color",
  description: "Practice the major pentatonic flavor so you can hear and feel the difference between minor and major lead vocabulary.",
  focus: "Major/minor contrast and phrasing touch",
  bpm: 102,
  difficulty: "medium",
  pattern: ascDesc(A_MAJOR_PENTA),
  beatStep: 1,
});

export const world2Level4 = createLevel({
  id: "world2-level4",
  title: "E Dorian Pedal",
  subtitle: "Modal ear training",
  description: "Hit the root between Dorian notes so the major sixth really stands out. This is a practical modal drill the app can judge well.",
  focus: "Modal hearing and root anchoring",
  bpm: 96,
  difficulty: "medium",
  pattern: pedal(p(6, 0), E_DORIAN.slice(1)),
  beatStep: 1,
});

export const world2Level5 = createLevel({
  id: "world2-level5",
  title: "A Mixolydian Run",
  subtitle: "Dominant color",
  description: "A useful dominant-scale workout for blues, rock, and jam-track soloing. It trains a color most players neglect early on.",
  focus: "Dominant-scale flow and articulation",
  bpm: 106,
  difficulty: "hard",
  pattern: ascDesc(A_MIXOLYDIAN),
  beatStep: 1,
});

export const world2Level6 = createLevel({
  id: "world2-level6",
  title: "E Minor Arpeggios",
  subtitle: "Chord-tone targeting",
  description: "Outline the E minor chord directly. Arpeggios are one of the best ways to sound like a player instead of an exercise machine.",
  focus: "Chord-tone targeting and string tracking",
  bpm: 108,
  difficulty: "hard",
  pattern: ascDesc(E_MINOR_ARPEGGIO),
  beatStep: 1,
});

export const world3Level1 = createLevel({
  id: "world3-level1",
  title: "A Blues Sequences",
  subtitle: "3-note blues cells",
  description: "Run overlapping 3-note groups inside the A blues scale so the blue note shows up in real lead-guitar movement.",
  focus: "Blues sequencing and attack consistency",
  bpm: 108,
  difficulty: "medium",
  pattern: overlappingGroups(A_BLUES_BOX1, 3),
  beatStep: 1,
});

export const world3Level2 = createLevel({
  id: "world3-level2",
  title: "E Minor 4-Note Groups",
  subtitle: "Classic shred drill",
  description: "This is the classic overlapping 4-note scale drill. It is tougher than level 2 in world 1 and great for real technique building.",
  focus: "Four-note sequencing and speed discipline",
  bpm: 114,
  difficulty: "hard",
  pattern: overlappingGroups(EM_PENTA_BOX1, 4),
  beatStep: 1,
});

export const world3Level3 = createLevel({
  id: "world3-level3",
  title: "E Blues Pedal",
  subtitle: "Root against color tones",
  description: "Return to the low E between blues notes so every color tone is heard against home. Great for phrasing awareness.",
  focus: "Root resolution and blues tension control",
  bpm: 104,
  difficulty: "hard",
  pattern: pedal(p(6, 0), E_BLUES_OPEN.slice(1)),
  beatStep: 1,
});

export const world3Level4 = createLevel({
  id: "world3-level4",
  title: "String Skip Pentatonic",
  subtitle: "Wider interval control",
  description: "Skip strings while staying inside E minor pentatonic. This makes the hands work harder and the lines sound much less boxy.",
  focus: "String skipping and right-hand accuracy",
  bpm: 112,
  difficulty: "hard",
  pattern: ascDesc(EM_STRING_SKIP),
  beatStep: 1,
});

export const world3Level5 = createLevel({
  id: "world3-level5",
  title: "Full-Neck E Minor",
  subtitle: "Range and shifting",
  description: "Take E minor across a much bigger range. This is a useful endurance and shifting drill for players leaving the beginner box behind.",
  focus: "Range shifts and neck connection",
  bpm: 120,
  difficulty: "hard",
  pattern: ascDesc(EM_FULL_NECK),
  beatStep: 1,
});

export const world3Level6 = createLevel({
  id: "world3-level6",
  title: "Lead Guitar Workout",
  subtitle: "Blues to scale resolve",
  description: "A mixed phrase that moves through blues notes, scale tones, higher-position notes, and a clean resolve. This is the most musical drill in the set.",
  focus: "Phrase connection and musical resolution",
  bpm: 124,
  difficulty: "hard",
  pattern: SOLO_WORKOUT,
  beatStep: 1,
});
