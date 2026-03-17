# Content Architecture

## Direction

Keep the current `worlds` structure as the guided beginner-to-advanced path.

Do not make `worlds` the only way content is organized.

The long-term structure should be:

- `Practice Path`
  - The current world-based progression map.
- `Library`
  - A browsable drill catalog across all content.
- `Collections`
  - Curated packs built around a goal, sound, or genre.

This gives the app both:

- a clear starting path for new players
- an open-ended system for replay, search, and future growth

## Why This Fits The Current App

The existing app is already technique-driven, not song-driven.

That means the core content unit is not really a "world" or a "genre".
It is a `drill`.

Today you already have:

- `World`
  - a presentation/grouping layer
- `Level`
  - the real content unit

So the clean move is:

- keep `Level` as the canonical drill object
- let a level belong to:
  - one `world`
  - zero or more `collections`
  - many metadata tags for library filtering

## Information Architecture

### 1. Practice Path

Purpose:
The guided curriculum for players who want "tell me what to do next."

Route:

- `/practice`

Current behavior to keep:

- world tabs
- unlock progression
- "next recommended level"
- level preview and start flow

What changes later:

- rename the section in UI from `Practice Map` to `Practice Path`
- keep the world map visual because it is motivating and distinctive

### 2. Library

Purpose:
The main exploration surface for all drills.

Routes:

- `/library`
- `/library?scale=pentatonic&technique=sequencing&difficulty=medium`

Level launch route:

- keep using `/practice/[levelId]`

Library should support:

- search by title
- filter by scale family
- filter by technique
- filter by difficulty
- filter by BPM range
- filter by world
- filter by genre flavor
- sort by:
  - recommended
  - easiest
  - fastest
  - newest
  - most practiced

Suggested default sections on `/library`:

- `Recommended for you`
- `Continue where you left off`
- `Popular techniques`
- `By scale family`
- `By genre flavor`

### 3. Collections

Purpose:
Curated sets of drills with a stronger identity than a generic filter result.

Routes:

- `/collections`
- `/collections/[slug]`

Examples:

- `Blues Foundations`
- `Fast Pentatonic Runs`
- `String Skipping Starter Pack`
- `Rock Lead Essentials`
- `Modal Color Pack`
- `Warmups for 10 Minutes`

Collections should not replace worlds.
They should be reusable overlays on top of the same drill library.

## Recommended Route Map

- `/`
  - home dashboard
- `/practice`
  - guided path
- `/practice/[levelId]`
  - session page for a drill
- `/library`
  - all drills with filters and search
- `/collections`
  - all collections
- `/collections/[slug]`
  - collection detail page
- `/player`
  - player hub
- `/daily`
  - daily challenge
- `/setup`
  - setup flow

## Content Model

### Current

Today `Level` carries:

- id
- title
- subtitle
- description
- focus
- bpm
- difficulty
- notes

### Recommended Next Shape

Keep the current fields and add metadata for discovery:

```ts
type GenreTag =
  | "blues"
  | "rock"
  | "metal"
  | "funk"
  | "country"
  | "jazz"
  | "neo-soul";

type ScaleFamily =
  | "minor-pentatonic"
  | "major-pentatonic"
  | "blues"
  | "major"
  | "natural-minor"
  | "dorian"
  | "mixolydian"
  | "arpeggio";

type TechniqueTag =
  | "alternate-picking"
  | "sequencing"
  | "position-shift"
  | "string-skipping"
  | "intervals"
  | "pedal-tones"
  | "arpeggios"
  | "phrasing";

type Drill = Level & {
  worldId?: string;
  worldOrder?: number;
  scaleFamily: ScaleFamily;
  techniqueTags: TechniqueTag[];
  genreTags: GenreTag[];
  positionLabel?: string;
  tempoBand?: "slow" | "medium" | "fast";
  estimatedSeconds?: number;
  collectionIds?: string[];
  recommendedFor?: ("beginner" | "intermediate" | "advanced")[];
};

type Collection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  accentColor: string;
  coverStyle?: "blues" | "rock" | "warmup" | "theory";
  drillIds: string[];
  goal: string;
  difficulty?: "easy" | "medium" | "hard";
};
```

## Filter System

The first library version should stay simple.

Recommended filters:

- `Scale`
  - Minor pentatonic
  - Major pentatonic
  - Blues
  - Major
  - Natural minor
  - Dorian
  - Mixolydian
  - Arpeggio
- `Technique`
  - Alternate picking
  - Sequencing
  - Position shift
  - String skipping
  - Intervals
  - Pedal tones
  - Arpeggios
  - Phrasing
- `Difficulty`
  - Easy
  - Medium
  - Hard
- `Feel / Genre`
  - Blues
  - Rock
  - Metal
  - Funk
  - Country
  - Jazz
- `Tempo`
  - Under 95 BPM
  - 95-110 BPM
  - 110+ BPM
- `Source`
  - Path only
  - Collections only
  - All drills

## World Strategy

The current three worlds are enough for now.

Do not add more worlds immediately.

Instead, make the current worlds stronger:

- tighten each world identity
- make sure each level teaches a distinct skill
- reduce overlap
- give each world a visible "why this matters" feeling

Good world framing for the current app:

- `World 1: Foundation`
  - pentatonic, blues color, position transfer
- `World 2: Expansion`
  - full scales, modal colors, chord tones
- `World 3: Application`
  - sequence speed, skips, range, phrase building

If more worlds are added later, they should unlock a genuinely new lane:

- `World 4: Rhythm Lead`
  - double stops, syncopation, groove phrasing
- `World 5: Expression`
  - bends, vibrato, slides, articulation control
- `World 6: Speed Systems`
  - tremolo, economy, burst drills

But this should come after the library exists.

## Genre Strategy

Genres should not become worlds.

Genres should become:

- collection themes
- recommendation labels
- library filters

Example:

- one pentatonic sequence drill can appear in:
  - World 1 or 3
  - a `Blues Foundations` collection
  - a `Rock Lead Essentials` collection
  - library search results for `pentatonic`

That reuse is much more powerful than creating separate genre worlds.

## Homepage Strategy

The home page should eventually point to three top-level choices:

- `Continue Path`
  - resume world progression
- `Open Library`
  - browse drills
- `Explore Collections`
  - enter genre or goal-based packs

This keeps the product clear:

- path for structure
- library for freedom
- collections for personality

## Recommended Implementation Order

### Phase 1

Add metadata to each level and introduce the library surface.

Scope:

- extend level metadata
- create `/library`
- add filters and search
- keep `/practice/[levelId]` as the drill launch page

### Phase 2

Add collections.

Scope:

- define `Collection` data
- create `/collections`
- create `/collections/[slug]`
- show collection chips on level cards

### Phase 3

Add personalization on top of the library.

Scope:

- recommended drills based on missed notes or weak areas
- "because you practiced X" suggestions
- genre-oriented onboarding

## Product Recommendation

The right near-term direction is:

- keep worlds
- build a library next
- use genres as collections and filters

Short version:

- `Worlds` are the teaching path
- `Library` is the product backbone
- `Collections` are the emotional layer

That gives Guitar Hero Academy a better chance of feeling like a real platform instead of a fixed campaign.
