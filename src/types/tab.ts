export interface TabNote {
  id: string;
  string: 1 | 2 | 3 | 4 | 5 | 6;
  fret: number;
  targetFrequency: number;
  durationBeats: number;
  startBeat: number;
}

export interface Level {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  focus?: string;
  bpm: number;
  difficulty?: "easy" | "medium" | "hard";
  /** Legacy style key — no longer used by the backing track */
  backingKey?: string;
  notes: TabNote[];
}

export interface World {
  id: string;
  number: number;
  title: string;
  description: string;
  accentColor: string;
  levels: Level[];
}
