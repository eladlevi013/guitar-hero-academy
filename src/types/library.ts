import type { Level } from "@/types/tab";

export type DrillGenre =
  | "blues"
  | "rock"
  | "country"
  | "folk"
  | "metal"
  | "modal"
  | "jazz"
  | "funk"
  | "warmup";

export type ScaleFamily =
  | "minor-pentatonic"
  | "major-pentatonic"
  | "blues"
  | "major"
  | "natural-minor"
  | "dorian"
  | "mixolydian"
  | "arpeggio";

export type TechniqueTag =
  | "alternate-picking"
  | "sequencing"
  | "position-shift"
  | "string-skipping"
  | "intervals"
  | "pedal-tones"
  | "arpeggios"
  | "phrasing"
  | "speed";

export interface DrillCatalogEntry {
  levelId: string;
  worldId: string;
  worldNumber: number;
  worldTitle: string;
  worldAccentColor: string;
  sourceTitle: string;
  sourceLicense: string;
  sourceAttribution?: string;
  sourceUrl?: string;
  scaleFamily: ScaleFamily;
  techniqueTags: TechniqueTag[];
  genreTags: DrillGenre[];
  vibeTitle: string;
  vibeLine: string;
  collectionIds: string[];
  level: Level;
}

export interface DrillCollection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  drillIds: string[];
}
