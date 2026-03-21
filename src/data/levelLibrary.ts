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

function buildNotesVaried(pattern: NotePos[]): TabNote[] {
  let startBeat = 0;
  return pattern.map((note, idx) => {
    const dur = note.durationBeats ?? 1;
    const built: TabNote = {
      id: `n${idx + 1}`,
      string: note.string,
      fret: note.fret,
      targetFrequency: frequencyFor(note),
      durationBeats: dur,
      startBeat: Math.round(startBeat * 1000) / 1000,
    };
    startBeat += dur;
    return built;
  });
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
  beatStep?: number;
}): Level {
  return {
    id,
    title,
    subtitle,
    description,
    focus,
    bpm,
    difficulty,
    notes: beatStep !== undefined ? buildNotes(pattern, beatStep) : buildNotesVaried(pattern),
  };
}

// World 1: First Songs

export const world1Level1 = createLevel({
  id: "world1-level1",
  title: "Ah Vous Dirai-Je Maman",
  subtitle: "The first familiar melody, in the simple shape most players know as Twinkle",
  description: "This opens the product with something immediately recognizable so the app feels musical from the first minute.",
  focus: "Melody memory, repeated notes, and calm phrase endings",
  bpm: 70,
  difficulty: "easy",
  pattern: [
    p(2, 1, 0.75), p(2, 1, 0.75), p(1, 3, 0.75), p(1, 3, 0.75),
    p(1, 5, 0.75), p(1, 5, 0.75), p(1, 3, 1.5),
    p(1, 1, 0.75), p(1, 1, 0.75), p(1, 0, 0.75), p(1, 0, 0.75),
    p(2, 3, 0.75), p(2, 3, 0.75), p(2, 1, 1.5),
    p(1, 3, 0.75), p(1, 3, 0.75), p(1, 1, 0.75), p(1, 1, 0.75),
    p(1, 0, 0.75), p(1, 0, 0.75), p(2, 3, 1.5),
    p(2, 1, 0.75), p(2, 1, 0.75), p(1, 3, 0.75), p(1, 3, 0.75),
    p(1, 5, 0.75), p(1, 5, 0.75), p(1, 3, 1.5),
    p(1, 1, 0.75), p(1, 1, 0.75), p(1, 0, 0.75), p(1, 0, 0.75),
    p(2, 3, 0.75), p(2, 3, 0.75), p(2, 1, 2.0),
  ],
});

export const world1Level2 = createLevel({
  id: "world1-level2",
  title: "Ode to Joy",
  subtitle: "A clear melodic climb that feels good under the fingers",
  description: "This is one of the strongest public-domain entries for the path because the contour is obvious and the rhythm is forgiving.",
  focus: "Phrase pacing, smooth repeated notes, and melodic contour",
  bpm: 76,
  difficulty: "easy",
  pattern: [
    p(2, 5, 0.75), p(2, 5, 0.75), p(2, 7, 0.75), p(2, 8, 0.75),
    p(2, 8, 0.75), p(2, 7, 0.75), p(2, 5, 0.75), p(2, 3, 0.75),
    p(2, 1, 0.75), p(2, 1, 0.75), p(2, 3, 0.75), p(2, 5, 0.75),
    p(2, 5, 1.0), p(2, 3, 0.5), p(2, 3, 1.5),
    p(2, 5, 0.75), p(2, 5, 0.75), p(2, 7, 0.75), p(2, 8, 0.75),
    p(2, 8, 0.75), p(2, 7, 0.75), p(2, 5, 0.75), p(2, 3, 0.75),
    p(2, 1, 0.75), p(2, 1, 0.75), p(2, 3, 0.75), p(2, 5, 0.75),
    p(2, 3, 1.0), p(2, 1, 0.5), p(2, 1, 2.0),
  ],
});

export const world1Level3 = createLevel({
  id: "world1-level3",
  title: "Frere Jacques",
  subtitle: "Balanced phrases that teach simple timing without weirdness",
  description: "A straightforward melody with mirrored phrases that helps the app feel more like learning songs and less like surviving drills.",
  focus: "Simple sequencing, steady timing, and phrase symmetry",
  bpm: 70,
  difficulty: "easy",
  pattern: [
    p(2, 1, 0.75), p(2, 3, 0.75), p(1, 0, 0.75), p(2, 1, 0.75),
    p(2, 1, 0.75), p(2, 3, 0.75), p(1, 0, 0.75), p(2, 1, 0.75),
    p(1, 0, 0.75), p(1, 1, 0.75), p(1, 3, 1.5),
    p(1, 0, 0.75), p(1, 1, 0.75), p(1, 3, 1.5),
    p(1, 3, 0.75), p(1, 5, 0.75), p(1, 3, 0.75), p(1, 1, 0.75), p(1, 0, 0.75), p(2, 1, 0.75),
    p(1, 3, 0.75), p(1, 5, 0.75), p(1, 3, 0.75), p(1, 1, 0.75), p(1, 0, 0.75), p(2, 1, 0.75),
    p(2, 1, 0.75), p(2, 5, 0.75), p(2, 1, 1.5),
    p(2, 1, 0.75), p(2, 5, 0.75), p(2, 1, 2.0),
  ],
});

export const world1Level4 = createLevel({
  id: "world1-level4",
  title: "Jingle Bells",
  subtitle: "A familiar hook slowed down enough to stay fun",
  description: "This arrangement keeps the melody clear and gives the phrase room to breathe instead of racing through it.",
  focus: "Recognizable phrasing, repeated-note control, and cleaner landings",
  bpm: 78,
  difficulty: "easy",
  pattern: [
    p(1, 0, 0.75), p(1, 0, 0.75), p(1, 0, 1.5),
    p(1, 0, 0.75), p(1, 0, 0.75), p(1, 0, 1.5),
    p(1, 0, 0.75), p(1, 3, 0.75), p(2, 1, 0.75), p(2, 3, 0.75), p(1, 0, 2.0),
    p(1, 1, 0.75), p(1, 1, 0.75), p(1, 1, 0.75), p(1, 1, 0.75),
    p(1, 1, 0.75), p(1, 0, 0.75), p(1, 0, 0.75), p(1, 0, 0.75),
    p(1, 0, 0.75), p(2, 3, 0.75), p(2, 3, 0.75), p(1, 1, 0.75), p(2, 1, 0.75), p(1, 0, 2.0),
  ],
});

export const world1Level5 = createLevel({
  id: "world1-level5",
  title: "Amazing Grace",
  subtitle: "A slow familiar melody with clear support notes",
  description: "This is where the early world starts adding just enough weight underneath the melody to feel like guitar.",
  focus: "Root-note support, open-string ring, and slower phrase endings",
  bpm: 68,
  difficulty: "medium",
  pattern: [
    p(6, 3, 0.5), p(2, 0, 1.5), p(5, 2, 0.5), p(2, 3, 1.5),
    p(6, 3, 0.5), p(2, 0, 1.0), p(2, 3, 0.5), p(1, 0, 1.5),
    p(6, 3, 0.5), p(2, 3, 0.5), p(2, 0, 1.5), p(5, 0, 0.5), p(5, 2, 0.5), p(6, 3, 2.0),
    p(6, 3, 0.5), p(2, 0, 1.0), p(2, 3, 0.5), p(1, 0, 1.5),
    p(5, 2, 0.5), p(2, 3, 0.5), p(2, 0, 0.5), p(6, 3, 2.5),
  ],
});

export const world1Level6 = createLevel({
  id: "world1-level6",
  title: "Good King Wenceslas",
  subtitle: "A march-like melody with a stronger rhythmic identity",
  description: "This one works because the shape is memorable and the rhythm gives it a little more life than the softer song entries.",
  focus: "March feel, melodic steps, and keeping a tune steady over time",
  bpm: 74,
  difficulty: "medium",
  pattern: [
    p(3, 0, 0.75), p(3, 0, 0.75), p(3, 2, 0.75), p(3, 4, 0.75),
    p(3, 2, 0.75), p(3, 0, 0.75), p(2, 3, 1.5),
    p(3, 0, 0.75), p(3, 0, 0.75), p(3, 2, 0.75), p(3, 4, 0.75),
    p(3, 2, 0.75), p(3, 0, 0.75), p(2, 3, 1.5),
    p(2, 3, 0.75), p(1, 0, 0.75), p(1, 2, 0.75), p(1, 3, 0.75),
    p(1, 2, 0.75), p(1, 0, 0.75), p(2, 3, 1.5),
    p(3, 2, 0.75), p(3, 0, 0.75), p(2, 3, 0.75), p(2, 1, 0.75), p(3, 0, 2.0),
  ],
});

export const world1Level7 = createLevel({
  id: "world1-level7",
  title: "Silent Night",
  subtitle: "A slower melody that rewards calm timing more than speed",
  description: "This is a good late-World-1 song because it asks for control without getting technically busy.",
  focus: "Longer note values, gentle movement, and smooth familiar phrasing",
  bpm: 64,
  difficulty: "medium",
  pattern: [
    p(2, 3, 1.0), p(1, 0, 1.0), p(2, 3, 1.0), p(2, 0, 2.0),
    p(2, 3, 1.0), p(1, 0, 1.0), p(2, 3, 1.0), p(2, 0, 2.0),
    p(1, 3, 1.0), p(1, 3, 1.0), p(2, 5, 1.0), p(1, 1, 1.0), p(1, 0, 2.0),
    p(2, 1, 1.0), p(2, 1, 1.0), p(1, 3, 1.0), p(1, 1, 1.0), p(1, 0, 2.0),
  ],
});

export const world1Level8 = createLevel({
  id: "world1-level8",
  title: "First Songs Medley",
  subtitle: "A boss level built from the melodies you already know",
  description: "Instead of a random finale, this world ends with a short medley that proves the product has been teaching actual songs.",
  focus: "Switching between familiar melodies without losing the beat",
  bpm: 82,
  difficulty: "medium",
  pattern: [
    p(2, 1, 0.75), p(1, 3, 0.75), p(1, 5, 0.75), p(1, 3, 1.0),
    p(2, 5, 0.75), p(2, 7, 0.75), p(2, 8, 0.75), p(2, 5, 1.0),
    p(2, 1, 0.75), p(2, 3, 0.75), p(1, 0, 0.75), p(2, 1, 1.0),
    p(1, 0, 0.75), p(1, 3, 0.75), p(2, 1, 0.75), p(2, 3, 1.5),
    p(6, 3, 0.5), p(2, 0, 1.0), p(2, 3, 0.5), p(1, 0, 1.5),
    p(2, 3, 1.0), p(1, 0, 1.0), p(2, 3, 1.5),
  ],
});

// World 2: Song Weight

export const world2Level1 = createLevel({
  id: "world2-level1",
  title: "Ode to Joy (Rooted)",
  subtitle: "The same melody, now with low anchors that make it feel fuller",
  description: "This is the first weighted arrangement in the path. The support notes are there to give shape, not to crowd the melody.",
  focus: "Root-note anchoring, melody clarity, and cleaner phrase payoff",
  bpm: 76,
  difficulty: "easy",
  pattern: [
    p(5, 3, 0.5), p(2, 5, 0.75), p(2, 5, 0.75), p(2, 7, 0.75), p(2, 8, 1.0),
    p(5, 3, 0.5), p(2, 8, 0.75), p(2, 7, 0.75), p(2, 5, 0.75), p(2, 3, 1.0),
    p(6, 1, 0.5), p(2, 1, 0.75), p(2, 1, 0.75), p(2, 3, 0.75), p(2, 5, 1.0),
    p(5, 3, 0.5), p(2, 5, 1.0), p(2, 3, 0.5), p(2, 3, 1.5),
    p(5, 3, 0.5), p(2, 5, 0.75), p(2, 7, 0.75), p(2, 8, 0.75), p(2, 7, 0.75), p(2, 5, 1.5),
  ],
});

export const world2Level2 = createLevel({
  id: "world2-level2",
  title: "Amazing Grace (Weighted)",
  subtitle: "A familiar song with more support and a better landing",
  description: "The melody stays obvious, but the rooted support notes make it feel more like a guitar part than a bare tune.",
  focus: "Support-note timing, slower phrasing, and clean resolution",
  bpm: 70,
  difficulty: "easy",
  pattern: [
    p(6, 3, 0.5), p(2, 0, 1.5), p(5, 2, 0.5), p(2, 3, 1.5),
    p(6, 3, 0.5), p(2, 0, 1.0), p(2, 3, 0.5), p(1, 0, 1.5),
    p(6, 3, 0.5), p(2, 3, 0.5), p(2, 0, 1.5), p(5, 0, 0.5), p(5, 2, 0.5), p(6, 3, 2.0),
    p(6, 3, 0.5), p(2, 0, 1.0), p(2, 3, 0.5), p(1, 0, 1.5),
    p(5, 2, 0.5), p(2, 3, 0.5), p(2, 0, 0.5), p(6, 3, 2.5),
  ],
});

export const world2Level3 = createLevel({
  id: "world2-level3",
  title: "When the Saints Go Marching In",
  subtitle: "A stronger marching arrangement with clearer phrase endings",
  description: "This one works best when the tune stays front and center and the lower notes only step in to drive the rhythm.",
  focus: "Marching pulse, rooted support, and stronger melodic payoff",
  bpm: 82,
  difficulty: "medium",
  pattern: [
    p(5, 3, 0.5), p(2, 1, 1.0), p(2, 5, 0.5), p(2, 6, 1.0), p(1, 3, 1.0),
    p(5, 3, 0.5), p(2, 1, 1.0), p(2, 5, 0.5), p(2, 6, 1.0), p(1, 3, 1.0),
    p(6, 3, 0.5), p(2, 5, 0.5), p(2, 6, 0.5), p(1, 3, 0.5), p(1, 5, 1.0),
    p(5, 3, 0.5), p(1, 5, 0.5), p(1, 3, 0.5), p(2, 6, 0.5), p(2, 5, 2.0),
  ],
});

export const world2Level4 = createLevel({
  id: "world2-level4",
  title: "Oh! Susanna",
  subtitle: "A friendlier singalong arrangement with enough bass to hold it together",
  description: "This keeps the melody obvious and uses the support notes only where they actually help the line feel bigger.",
  focus: "Bass-note support, melodic leaps, and cleaner familiar-song pacing",
  bpm: 84,
  difficulty: "medium",
  pattern: [
    p(6, 3, 0.5), p(2, 1, 0.75), p(1, 0, 0.75), p(1, 3, 0.75), p(1, 5, 1.25),
    p(5, 2, 0.5), p(1, 5, 0.75), p(1, 3, 0.75), p(1, 0, 0.75), p(2, 1, 1.0),
    p(6, 3, 0.5), p(1, 0, 0.75), p(1, 3, 0.75), p(1, 5, 0.75), p(1, 3, 0.75), p(2, 3, 1.0),
    p(5, 2, 0.5), p(2, 3, 0.75), p(1, 0, 0.75), p(1, 1, 0.75), p(1, 0, 1.5),
    p(6, 3, 0.5), p(1, 0, 0.75), p(1, 3, 0.75), p(1, 5, 0.75), p(1, 3, 0.75), p(2, 1, 0.75), p(2, 3, 2.0),
  ],
});

export const world2Level5 = createLevel({
  id: "world2-level5",
  title: "Auld Lang Syne",
  subtitle: "A more mature familiar tune with a steady melodic flow",
  description: "This gives the middle world a song that feels older and warmer, while still being easy enough to follow by ear.",
  focus: "Longer phrase flow, familiar contour, and cleaner transitions",
  bpm: 72,
  difficulty: "medium",
  pattern: [
    p(2, 1, 0.75), p(2, 3, 0.75), p(1, 0, 1.0), p(2, 3, 0.5), p(2, 1, 1.0),
    p(2, 3, 0.75), p(1, 0, 0.75), p(1, 3, 1.5),
    p(1, 3, 0.75), p(1, 5, 0.75), p(1, 3, 1.0), p(2, 3, 0.5), p(2, 1, 1.0),
    p(2, 3, 0.75), p(1, 0, 0.75), p(2, 1, 1.5),
    p(2, 3, 0.75), p(1, 0, 0.75), p(1, 3, 0.75), p(1, 5, 0.75), p(1, 3, 2.0),
  ],
});

export const world2Level6 = createLevel({
  id: "world2-level6",
  title: "Greensleeves",
  subtitle: "A slower public-domain melody with a more emotional shape",
  description: "This is the first point where the path starts to feel a little more grown-up without getting technically dense.",
  focus: "Melodic shape, smoother descending lines, and controlled pacing",
  bpm: 66,
  difficulty: "medium",
  pattern: [
    p(1, 5, 0.75), p(1, 8, 0.75), p(1, 10, 0.75), p(1, 12, 0.75),
    p(1, 10, 0.75), p(1, 8, 0.75), p(1, 7, 1.0), p(1, 5, 1.0),
    p(1, 7, 0.75), p(1, 8, 0.75), p(1, 7, 0.75), p(1, 5, 0.75),
    p(2, 8, 0.75), p(2, 7, 0.75), p(2, 5, 1.5),
    p(1, 5, 0.75), p(1, 8, 0.75), p(1, 10, 0.75), p(1, 8, 0.75), p(1, 7, 2.0),
  ],
});

export const world2Level7 = createLevel({
  id: "world2-level7",
  title: "Carcassi Prelude Theme",
  subtitle: "A simple study-style line that finally gives the path real guitar logic",
  description: "This level is not pretending to be a pop song. It is a study-style melodic outline built from chord tones and stepwise motion.",
  focus: "Arpeggio logic, chord-tone hearing, and smooth right-hand flow",
  bpm: 76,
  difficulty: "medium",
  pattern: [
    p(5, 3, 0.5), p(4, 2, 0.5), p(3, 0, 0.5), p(2, 1, 0.5), p(1, 0, 1.0),
    p(2, 1, 0.5), p(3, 0, 0.5), p(4, 2, 0.5), p(5, 3, 1.0),
    p(5, 0, 0.5), p(4, 2, 0.5), p(3, 2, 0.5), p(2, 1, 0.5), p(1, 0, 1.0),
    p(2, 1, 0.5), p(3, 2, 0.5), p(4, 2, 0.5), p(5, 0, 1.0),
    p(6, 3, 0.5), p(5, 2, 0.5), p(4, 0, 0.5), p(3, 0, 0.5), p(2, 1, 2.0),
  ],
});

export const world2Level8 = createLevel({
  id: "world2-level8",
  title: "Song Weight Suite",
  subtitle: "A boss level that proves the second world taught real material",
  description: "This finale links rooted familiar-song phrases with a cleaner study-style ending so the middle world feels like a complete chapter.",
  focus: "Switching between song phrases and stronger guitar motion",
  bpm: 88,
  difficulty: "hard",
  pattern: [
    p(5, 3, 0.5), p(2, 5, 0.75), p(2, 7, 0.75), p(2, 8, 1.0),
    p(6, 3, 0.5), p(2, 0, 1.0), p(2, 3, 0.5), p(1, 0, 1.5),
    p(5, 3, 0.5), p(2, 1, 1.0), p(2, 5, 0.5), p(2, 6, 1.0),
    p(6, 3, 0.5), p(2, 1, 0.75), p(1, 0, 0.75), p(1, 3, 1.0),
    p(5, 3, 0.5), p(4, 2, 0.5), p(3, 0, 0.5), p(2, 1, 0.5), p(1, 0, 2.0),
  ],
});

// World 3: Stage Lift

export const world3Level1 = createLevel({
  id: "world3-level1",
  title: "Electric Fog",
  subtitle: "A moody intro line that teaches motif control",
  description: "One memorable shape keeps coming back in slightly different ways. Think intro melody, not exercise.",
  focus: "Motif control, repeated lead shapes, and moody pacing",
  bpm: 96,
  difficulty: "medium",
  pattern: [
    p(3, 0, 0.5), p(3, 3, 0.5), p(3, 5, 1.0),
    p(2, 3, 0.5), p(2, 5, 0.5), p(3, 5, 1.0),
    p(3, 0, 0.5), p(3, 3, 0.5), p(3, 5, 0.5), p(2, 3, 0.5), p(2, 5, 1.0),
    p(1, 3, 0.5), p(2, 5, 0.5), p(2, 3, 0.5), p(3, 5, 0.5), p(3, 3, 0.5), p(3, 0, 2.5),
  ],
});

export const world3Level2 = createLevel({
  id: "world3-level2",
  title: "Skyline Lift",
  subtitle: "A brighter climb that feels like the chorus opening up",
  description: "Let the ascent build naturally and make the highest note feel earned.",
  focus: "Ascending movement, wider positions, and clean peaks",
  bpm: 102,
  difficulty: "medium",
  pattern: [
    p(4, 5, 0.5), p(4, 7, 0.5), p(3, 4, 0.5), p(3, 7, 0.5), p(2, 5, 1.0),
    p(3, 7, 0.5), p(2, 5, 0.5), p(2, 7, 1.0),
    p(2, 5, 0.5), p(2, 7, 0.5), p(1, 5, 0.5), p(1, 7, 0.5), p(1, 8, 1.0),
    p(1, 7, 0.5), p(1, 5, 0.5), p(2, 7, 0.5), p(2, 5, 0.5), p(3, 7, 0.5), p(3, 4, 0.5), p(4, 5, 2.5),
  ],
});

export const world3Level3 = createLevel({
  id: "world3-level3",
  title: "Fireline Echo",
  subtitle: "A call-and-response hook that sounds bigger every pass",
  description: "The phrase jumps between strings so it can answer itself with a new color.",
  focus: "Call-and-response phrasing, string contrast, and hook repetition",
  bpm: 108,
  difficulty: "medium",
  pattern: [
    p(2, 8, 0.5), p(2, 10, 0.5), p(1, 8, 1.0),
    p(3, 7, 0.5), p(3, 9, 0.5), p(2, 7, 1.0),
    p(2, 8, 0.5), p(2, 10, 0.5), p(1, 8, 0.5), p(1, 10, 0.5), p(1, 12, 1.0),
    p(2, 10, 0.5), p(2, 8, 0.5), p(3, 9, 0.5), p(3, 7, 0.5), p(2, 7, 0.5), p(2, 5, 2.0),
  ],
});

export const world3Level4 = createLevel({
  id: "world3-level4",
  title: "Wire Runner",
  subtitle: "A skipping line that feels wider without feeling random",
  description: "This introduces bigger gaps between notes, which makes it feel more modern right away.",
  focus: "String skipping, clean transitions, and keeping wider intervals musical",
  bpm: 112,
  difficulty: "medium",
  pattern: [
    p(4, 7, 0.5), p(2, 8, 0.5), p(3, 7, 0.5), p(1, 8, 0.5),
    p(2, 10, 0.5), p(3, 9, 0.5), p(4, 9, 1.0),
    p(4, 7, 0.5), p(2, 8, 0.5), p(3, 9, 0.5), p(1, 10, 0.5),
    p(2, 8, 0.5), p(3, 7, 0.5), p(4, 9, 0.5), p(2, 10, 0.5), p(1, 8, 1.0),
    p(2, 8, 0.5), p(3, 7, 0.5), p(4, 7, 2.0),
  ],
});

export const world3Level5 = createLevel({
  id: "world3-level5",
  title: "Sunset Stomp",
  subtitle: "A riff-forward lift in the middle of the lead world",
  description: "This gives the third world some bite without leaving the main product path.",
  focus: "Blues color, repeated accents, and medium-tempo confidence",
  bpm: 106,
  difficulty: "medium",
  pattern: [
    p(3, 7, 0.5), p(3, 7, 0.5), p(3, 7, 0.25), p(3, 6, 0.25),
    p(3, 7, 0.5), p(3, 5, 0.5), p(3, 2, 0.5), p(3, 0, 0.5), p(3, 2, 1.0),
    p(3, 7, 0.5), p(3, 7, 0.5), p(3, 6, 0.5), p(3, 7, 0.5), p(3, 9, 0.5), p(3, 7, 1.0),
    p(3, 5, 0.5), p(3, 7, 0.5), p(3, 9, 0.5), p(3, 10, 0.5), p(3, 9, 0.5), p(3, 7, 0.5), p(3, 2, 0.5), p(3, 0, 2.5),
  ],
});

export const world3Level6 = createLevel({
  id: "world3-level6",
  title: "Sandstrike",
  subtitle: "A heavier low-string lane that still fits the product path",
  description: "The open-string pulse sets the mood, and the fretted accents give it shape without turning into a detour.",
  focus: "Low-string chugging, pulse control, and heavier accent placement",
  bpm: 112,
  difficulty: "hard",
  pattern: [
    p(6, 0, 0.25), p(6, 0, 0.25), p(6, 3, 0.25), p(6, 0, 0.5),
    p(6, 0, 0.25), p(6, 0, 0.25), p(6, 5, 0.25), p(6, 3, 0.5),
    p(6, 0, 0.25), p(6, 0, 0.25), p(6, 3, 0.25), p(6, 0, 0.5),
    p(6, 5, 0.25), p(6, 3, 0.25), p(6, 2, 0.25), p(6, 0, 1.0),
    p(6, 0, 0.25), p(6, 3, 0.25), p(6, 5, 0.25), p(6, 3, 0.25), p(6, 0, 2.5),
  ],
});

export const world3Level7 = createLevel({
  id: "world3-level7",
  title: "Northbound Rush",
  subtitle: "A faster neck-travel line that actually feels like movement",
  description: "Stay relaxed while moving, because the line only sounds good if the notes still feel connected.",
  focus: "Position shifts, faster travel, and keeping a long line connected",
  bpm: 120,
  difficulty: "hard",
  pattern: [
    p(4, 5, 0.5), p(4, 7, 0.5), p(3, 4, 0.5), p(3, 5, 0.5), p(3, 7, 0.5),
    p(2, 5, 0.5), p(2, 7, 0.5), p(1, 5, 0.5), p(1, 7, 0.5), p(1, 8, 0.5),
    p(1, 10, 0.5), p(1, 12, 0.5), p(2, 10, 0.5), p(2, 8, 0.5), p(2, 7, 0.5),
    p(1, 8, 0.5), p(1, 7, 0.5), p(1, 5, 0.5), p(2, 7, 0.5), p(2, 5, 0.5),
    p(3, 7, 0.5), p(3, 5, 0.5), p(4, 7, 0.5), p(4, 5, 2.0),
  ],
});

export const world3Level8 = createLevel({
  id: "world3-level8",
  title: "Last Light Solo",
  subtitle: "A full mini-solo with a hook, a climb, and a real ending",
  description: "This is the payoff world. It begins with a recognizable hook, opens up into a climb, then resolves like a finished statement.",
  focus: "Mini-solo storytelling, dynamic phrasing, and controlled climactic playing",
  bpm: 126,
  difficulty: "hard",
  pattern: [
    p(2, 8, 0.5), p(2, 10, 0.5), p(1, 8, 1.0), p(2, 10, 0.5), p(2, 8, 0.5), p(3, 9, 1.0),
    p(3, 7, 0.5), p(3, 9, 0.5), p(2, 7, 0.5), p(2, 8, 0.5), p(2, 10, 1.0),
    p(1, 8, 0.5), p(1, 10, 0.5), p(1, 12, 0.5), p(1, 10, 0.5), p(1, 8, 0.5),
    p(2, 10, 0.5), p(2, 12, 0.5), p(1, 12, 0.5), p(1, 10, 0.5), p(1, 8, 0.5),
    p(2, 10, 0.5), p(2, 8, 0.5), p(3, 9, 0.5), p(3, 7, 0.5), p(2, 8, 0.5), p(2, 5, 2.5),
  ],
});
