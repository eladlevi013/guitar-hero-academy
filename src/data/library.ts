import world1 from "@/data/world1";
import world2 from "@/data/world2";
import world3 from "@/data/world3";
import type { DrillCatalogEntry, DrillCollection } from "@/types/library";

const WORLDS = [world1, world2, world3];

const levelMeta: Record<
  string,
  Omit<
    DrillCatalogEntry,
    "level" | "levelId" | "worldId" | "worldNumber" | "worldTitle" | "worldAccentColor"
  >
> = {
  "world1-level1": {
    scaleFamily: "minor-pentatonic",
    techniqueTags: ["alternate-picking", "phrasing"],
    genreTags: ["blues", "warmup", "rock"],
    vibeTitle: "Open-road blues starter",
    vibeLine: "A clean first box run that feels like the opening move of a slow blues lead.",
    collectionIds: ["warmup-circuit", "blues-club"],
  },
  "world1-level2": {
    scaleFamily: "minor-pentatonic",
    techniqueTags: ["sequencing", "alternate-picking", "speed"],
    genreTags: ["rock", "metal"],
    vibeTitle: "Arena lead ladder",
    vibeLine: "Overlapping shapes that already feel closer to a rock intro than a plain exercise.",
    collectionIds: ["arena-rock", "speed-lab"],
  },
  "world1-level3": {
    scaleFamily: "blues",
    techniqueTags: ["phrasing", "alternate-picking"],
    genreTags: ["blues", "rock"],
    vibeTitle: "Blues club turnaround",
    vibeLine: "The blue note shows up fast here, so this one feels like a late-night club lick workout.",
    collectionIds: ["blues-club"],
  },
  "world1-level4": {
    scaleFamily: "minor-pentatonic",
    techniqueTags: ["position-shift", "alternate-picking"],
    genreTags: ["country", "rock", "warmup"],
    vibeTitle: "Fifth-fret road trip",
    vibeLine: "A practical move into a more song-ready position that feels like a verse lead pocket.",
    collectionIds: ["warmup-circuit", "country-sunrise"],
  },
  "world1-level5": {
    scaleFamily: "minor-pentatonic",
    techniqueTags: ["intervals", "phrasing"],
    genreTags: ["country", "blues", "rock"],
    vibeTitle: "Wide-interval hook line",
    vibeLine: "The interval jumps give this one a more melodic, singable lead feel.",
    collectionIds: ["country-sunrise", "blues-club"],
  },
  "world1-level6": {
    scaleFamily: "minor-pentatonic",
    techniqueTags: ["position-shift", "speed"],
    genreTags: ["rock", "metal"],
    vibeTitle: "Climb to the chorus",
    vibeLine: "A classic rising run that feels like moving from verse shape into a bigger chorus lead.",
    collectionIds: ["arena-rock", "speed-lab"],
  },
  "world2-level1": {
    scaleFamily: "major",
    techniqueTags: ["alternate-picking", "phrasing"],
    genreTags: ["country", "warmup", "funk"],
    vibeTitle: "Clean daylight major line",
    vibeLine: "Bright and clean, this one feels like a country-pop intro or a crisp melodic fill.",
    collectionIds: ["country-sunrise", "warmup-circuit"],
  },
  "world2-level2": {
    scaleFamily: "natural-minor",
    techniqueTags: ["position-shift", "phrasing"],
    genreTags: ["rock", "metal", "modal"],
    vibeTitle: "Minor movie trailer run",
    vibeLine: "A fuller seven-note sound that already feels more cinematic and dramatic.",
    collectionIds: ["arena-rock", "night-drive"],
  },
  "world2-level3": {
    scaleFamily: "major-pentatonic",
    techniqueTags: ["phrasing", "alternate-picking"],
    genreTags: ["country", "funk", "warmup"],
    vibeTitle: "Country-sunrise pocket",
    vibeLine: "Major pentatonic warmth with a little bounce, great for brighter melodic lead shapes.",
    collectionIds: ["country-sunrise", "warmup-circuit"],
  },
  "world2-level4": {
    scaleFamily: "dorian",
    techniqueTags: ["pedal-tones", "phrasing"],
    genreTags: ["modal", "funk", "jazz"],
    vibeTitle: "Night-drive modal vamp",
    vibeLine: "Pedal tone plus Dorian color makes this one feel like a jam over a moody groove.",
    collectionIds: ["night-drive"],
  },
  "world2-level5": {
    scaleFamily: "mixolydian",
    techniqueTags: ["phrasing", "speed"],
    genreTags: ["blues", "rock", "modal"],
    vibeTitle: "Jam-band dominant run",
    vibeLine: "A strong dominant color for blues-rock or open jam tracks where the lead has to move.",
    collectionIds: ["blues-club", "night-drive", "arena-rock"],
  },
  "world2-level6": {
    scaleFamily: "arpeggio",
    techniqueTags: ["arpeggios", "string-skipping"],
    genreTags: ["jazz", "rock", "modal"],
    vibeTitle: "Chord-tone spotlight",
    vibeLine: "This one starts sounding less like scale practice and more like real solo construction.",
    collectionIds: ["night-drive", "speed-lab"],
  },
  "world3-level1": {
    scaleFamily: "blues",
    techniqueTags: ["sequencing", "phrasing", "speed"],
    genreTags: ["blues", "rock"],
    vibeTitle: "Texas shuffle burner",
    vibeLine: "The repeating cells give it that relentless blues-rock lead engine feel.",
    collectionIds: ["blues-club", "arena-rock"],
  },
  "world3-level2": {
    scaleFamily: "minor-pentatonic",
    techniqueTags: ["sequencing", "speed", "alternate-picking"],
    genreTags: ["metal", "rock"],
    vibeTitle: "Shred runway",
    vibeLine: "A proper four-note sequence drill that feels like the beginning of faster lead language.",
    collectionIds: ["speed-lab", "arena-rock"],
  },
  "world3-level3": {
    scaleFamily: "blues",
    techniqueTags: ["pedal-tones", "phrasing"],
    genreTags: ["blues", "rock", "modal"],
    vibeTitle: "Root-and-fire response",
    vibeLine: "This one feels like answering a rhythm riff with short, tense blues phrases.",
    collectionIds: ["blues-club"],
  },
  "world3-level4": {
    scaleFamily: "minor-pentatonic",
    techniqueTags: ["string-skipping", "speed"],
    genreTags: ["rock", "metal", "funk"],
    vibeTitle: "Wide-screen skip line",
    vibeLine: "The skips make it sound more modern and less boxed-in right away.",
    collectionIds: ["speed-lab", "arena-rock"],
  },
  "world3-level5": {
    scaleFamily: "natural-minor",
    techniqueTags: ["position-shift", "speed"],
    genreTags: ["rock", "metal", "modal"],
    vibeTitle: "Full-neck escape run",
    vibeLine: "A bigger range workout that feels like a real solo climbing out of the safe box.",
    collectionIds: ["speed-lab", "night-drive", "arena-rock"],
  },
  "world3-level6": {
    scaleFamily: "blues",
    techniqueTags: ["phrasing", "position-shift", "speed"],
    genreTags: ["blues", "rock", "metal"],
    vibeTitle: "Finale solo workout",
    vibeLine: "The closest thing in the app to a full lead passage rather than a single mechanical drill.",
    collectionIds: ["arena-rock", "blues-club", "speed-lab"],
  },
};

export const libraryCollections: DrillCollection[] = [
  {
    id: "blues-club",
    slug: "blues-club-nights",
    title: "Blues Club Nights",
    subtitle: "Blue notes, hooks, and late-night phrasing",
    description: "A compact pack that feels like small-club blues leads: bends implied through phrasing, repeated cells, and tension against the root.",
    accentColor: "#c8553d",
    drillIds: ["world1-level1", "world1-level3", "world1-level5", "world2-level5", "world3-level3"],
  },
  {
    id: "arena-rock",
    slug: "arena-rock-leads",
    title: "Arena Rock Leads",
    subtitle: "Big climbs, louder hooks, faster exits",
    description: "These drills feel like chorus lead moments: bigger hand movement, stronger sequencing, and more dramatic high-note payoff.",
    accentColor: "#f0c040",
    drillIds: ["world1-level2", "world1-level6", "world2-level2", "world2-level5", "world3-level6"],
  },
  {
    id: "country-sunrise",
    slug: "country-sunrise-lines",
    title: "Country Sunrise",
    subtitle: "Bright majors, open air, singable movement",
    description: "A brighter melodic lane built around major and major-pentatonic color with a cleaner, more vocal lead feel.",
    accentColor: "#7ac85a",
    drillIds: ["world1-level4", "world1-level5", "world2-level1", "world2-level3"],
  },
  {
    id: "night-drive",
    slug: "night-drive-modal-pack",
    title: "Night Drive Modal Pack",
    subtitle: "Dorian color, dominant movement, chord-tone focus",
    description: "Moodier lines for players who want jam-track color instead of only pentatonic safety.",
    accentColor: "#6a9ee8",
    drillIds: ["world2-level2", "world2-level4", "world2-level5", "world2-level6", "world3-level5"],
  },
  {
    id: "warmup-circuit",
    slug: "ten-minute-warmup-circuit",
    title: "10-Minute Warmup Circuit",
    subtitle: "Quick clean reps before a real session",
    description: "A short circuit of lower-pressure drills that work well as a pre-practice reset without needing a full world run.",
    accentColor: "#3a7a6b",
    drillIds: ["world1-level1", "world1-level4", "world2-level1", "world2-level3"],
  },
  {
    id: "speed-lab",
    slug: "speed-lab",
    title: "Speed Lab",
    subtitle: "Sequences, skips, and fast neck travel",
    description: "When the goal is right-hand consistency and staying controlled as the line gets more demanding.",
    accentColor: "#b07ae8",
    drillIds: ["world1-level2", "world1-level6", "world3-level2", "world3-level4", "world3-level5"],
  },
];

export const allCatalogEntries: DrillCatalogEntry[] = WORLDS.flatMap((world) =>
  world.levels.map((level) => {
    const meta = levelMeta[level.id];
    return {
      levelId: level.id,
      worldId: world.id,
      worldNumber: world.number,
      worldTitle: world.title,
      worldAccentColor: world.accentColor,
      level,
      ...meta,
    };
  }),
);

export const allGenres = [...new Set(allCatalogEntries.flatMap((entry) => entry.genreTags))];
export const allTechniques = [...new Set(allCatalogEntries.flatMap((entry) => entry.techniqueTags))];
export const allScaleFamilies = [...new Set(allCatalogEntries.map((entry) => entry.scaleFamily))];

export function getCollectionBySlug(slug: string) {
  return libraryCollections.find((collection) => collection.slug === slug) ?? null;
}

export function getCollectionEntries(collectionId: string) {
  return allCatalogEntries.filter((entry) => entry.collectionIds.includes(collectionId));
}
