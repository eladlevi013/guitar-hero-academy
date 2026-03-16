# Guitar Hero Academy — Product Document

## What this app is

A **real-time guitar scale trainer** in the browser.
You plug in (or play acoustic near a mic), the app listens, and it scores every note
you play against a scrolling tab rail — Guitar Hero style, but for actual technique practice.

## What this app is NOT

- **Not a song game.** No riffs, no recognizable melodies, no song fragments.
  Pitch detection picks up harmonics and noise; songs are copyright risk; songs don't teach technique.
- **Not a beginner open-string toy.** Content starts intermediate and escalates to advanced.

---

## Current content

### World 1 — The 5 Positions

E minor pentatonic, all 6 strings, ascending + descending. Each level locks your hand into
one CAGED box shape and forces you to play it clean at a meaningful BPM.

| # | Title | CAGED shape | Fret range | Notes | BPM | Spacing |
|---|-------|-------------|-----------|-------|-----|---------|
| 1 | Box 1 — Full | E shape (open) | 0–3 | 23 | 95 | 2-beat |
| 2 | Box 2 — Full | G shape | 2–5 | 23 | 100 | 2-beat |
| 3 | Box 3 — Full | A shape | 4–8 | 23 | 104 | 2-beat |
| 4 | Box 4 — Full | B shape | 7–10 | 23 | 108 | 2-beat |
| 5 | Box 5 — Full | D shape | 9–12 | 23 | 112 | 2-beat |
| 6 | Grand Sweep | All 5 positions | 0–12 | 23 | 120 | 1-beat |

### World 2 — Beyond the Box

Moves beyond shape memorization into how players actually use the pentatonic.
Each level isolates one soloing technique.

| # | Title | Technique | Notes | BPM | Spacing |
|---|-------|-----------|-------|-----|---------|
| 1 | Am Box 1 | Am pentatonic Box 1, A2→C5, full 6 strings | 23 | 115 | 2-beat |
| 2 | Sequences | Em penta, overlapping 3-note groups (1-2-3, 2-3-4…) | 18 | 108 | 1-beat |
| 3 | Am Box 2 | Am pentatonic Box 2, C3→D5, frets 7–10 | 23 | 118 | 2-beat |
| 4 | String Skip | Em penta, skip one string between every note (ping-pong) | 16 | 110 | 1-beat |
| 5 | Box Link 1→2 | Em penta Box 1 into Box 2, one continuous run, hand shift at G3 | 24 | 115 | 1-beat |
| 6 | The Gauntlet | Am penta Box 1, A2→C5 and straight back, no pause at peak | 23 | 130 | 1-beat |

---

## Feature inventory (what is actually shipped)

### Scoring and feedback

- **Real-time pitch detection**: YIN algorithm on microphone input. Detects note name + frequency 60×/sec.
- **Cents meter**: Shows how many cents sharp/flat you are. Color codes: green (±15¢), yellow (±40¢), red (off).
- **Hit window**: 600ms per note (`HIT_PADDING_MS = 600`). Covers latency, mic buffer, and reaction time.
- **Pitch threshold**: ±75 cents (`CENTS_THRESHOLD = 75`). Close enough counts.
- **`requireRelease`**: Prevents a sustained pitch from triggering consecutive notes. Player must go silent or move >150¢ away.
- **Score**: `hits / total * 100`, rounded to integer percent.
- **Stars**: 0–3 based on score: `≥80% = 3★`, `60–79% = 2★`, `40–59% = 1★`, `<40% = 0★`.
- **Combo system**: Consecutive hit counter. Breaks on miss. Tracks max combo for the session.
- **Combo badges**: "COMBO 5" (gold), "COMBO 10" (flame red with glow), upgrades per threshold.
- **Level complete screen**: Message varies by stars. Confetti on 3 stars (28 animated particles). Score bar animates.

### Game modes

- **Timed mode**: Notes must be hit within their time window. Misses break combo, count against score.
  Drum backing track plays to keep tempo.
- **Practice mode**: No timing pressure. Notes advance only when you hit them. No backing track, no scoring.
  Smooth tab scrolling follows your pace.

### Speed control

- Multiplier: **0.5×, 0.75×, 1×, 1.25×, 1.5×**
- Scales BPM and all note timing. Shows effective BPM next to selector.
- Backing track tempo matches multiplier.

### Tab rail

- Scrolls left-to-right. Notes are colored by string (6 distinct colors).
- Status per note: `pending` (outline), `active` (highlighted, current hit window), `hit` (filled), `missed` (faded).
- Clock-driven in timed mode. Index-driven in practice mode.
- 4-beat lead-in before the first note (`LEAD_IN_BEATS = 4`). Beat countdown (4, 3, 2, 1) animates in.

### World map

- SVG path connecting 6 level nodes per world.
- Nodes: locked (padlock), unlocked (number), completed (checkmark + star count).
- Sequential unlock — must complete level N to unlock level N+1.
- Two worlds selectable via tab switcher at the top.

### Daily challenge

- One level per day, same for all players globally. Determined by `floor((utcToday - epoch) / dayMs)` mod total levels.
- Challenge number shown (`Daily Challenge #N`).
- After completing: share button generates tweet with stars, score, and ASCII hit bar (🟩🟥).
- "Try again" restarts without reloading.

### Achievements (12 total)

| ID | Icon | Trigger |
|----|------|---------|
| first-note | 🎵 | Hit your first note ever |
| first-level | ✅ | Complete any level |
| hat-trick | ⭐ | Get 3 stars on any level |
| perfect | 💎 | Hit 100% of notes in a level |
| on-a-roll | 🔥 | Hit 5 notes in a row |
| unstoppable | ⚡ | Hit 10 notes in a row |
| foundations | 🏆 | Complete all 6 World 1 levels |
| scale-scholar | 🎓 | Complete all 6 World 2 levels |
| technique-lord | 👑 | Complete all 6 World 3 levels |
| guitar-hero | 🌟 | Complete all 18 levels across all worlds |
| daily-grind | 📅 | Complete a daily challenge |
| daily-legend | 🏅 | Get 3 stars on a daily challenge |

Achievements unlock once, persist to localStorage, show as toast (auto-dismiss after 3.5s).

### Progress persistence

All progress in `localStorage`. Keys: `gha-v1-progress` (completed IDs), `gha-v1-stars` (best star per level), `gha-v1-achievements`.
Best star only overwritten if new score is higher. Full reset function available.

### Keyboard shortcuts

`Space` — start/stop · `R` — restart level · `Esc` — back to world map

### Other

- PWA: installable on iOS/Android via manifest, Apple web app title "GHA".
- Fonts: Inter (UI), Playfair Display (headers/display).

---

## Design rules (do not break these)

1. **No real songs.** No recognizable riffs. Every note sequence is a purpose-built exercise.
2. **2-beat minimum spacing** on standard levels — kick + rest + snare + rest = groove, not machine gun.
3. **Full scale, not excerpts.** Every box-position level covers all 6 strings.
4. **Ascending and descending.** Up the scale, hold peak or reverse immediately, back to root.
5. **BPMs start at 95, top out at 130.** Speed multiplier (0.5×–1.5×) handles difficulty range.
6. **Drums only** in backing track. The player's guitar is the only pitched sound — avoids "giving away" notes.
7. **Practice mode is silent.** No drums, no scoring. Just the note and the tab.

---

## Scoring math (full detail)

```
beatMs          = 60000 / (level.bpm × speedMultiplier)
leadInMs        = 4 × beatMs
noteStartMs     = leadInMs + (note.startBeat × beatMs)
noteEndMs       = noteStartMs + (note.durationBeats × beatMs) + HIT_PADDING_MS (600ms)

centsOff(f1, f2) = 1200 × log2(f1 / f2)   // negative = flat, positive = sharp

A note is a HIT if:
  - elapsed is within [noteStartMs - HIT_PADDING_MS, noteEndMs]
  - |centsOff(detected, target)| ≤ 75
  - requireRelease is false (player released previous note)

score = round(hits / total × 100)
stars = score ≥ 80 ? 3 : score ≥ 60 ? 2 : score ≥ 40 ? 1 : 0

Daily challenge index = floor((Date.UTC(y,m,d) - epoch) / 86400000) % totalLevels
  where epoch = Date.UTC(2025, 0, 1)
```

---

## Thoughts on potential

Guitar Hero Academy fills a real gap. Every guitarist eventually knows the pentatonic shape
but can't use it. YouTube gives licks to copy. GuitarPro gives static tabs. Nothing gives
them a machine that *listens and scores* technique drills at tempo.

**Why it could get traction:**

- **Zero friction.** Browser, allow mic, play. No install, no account, no calibration.
- **The Guitar Hero feedback loop is addictive** even for exercises. Scrolling notes create
  urgency that a metronome doesn't. The hit flash and star pop feel good to earn.
- **Natural social hook.** "3 stars on The Gauntlet at 1.5×" is a flex. Daily challenge share
  cards (🟩🟥 hit bar + star rating) are Twitter/Discord-native.
- **No copyright risk.** Content is all original exercises. Safe to distribute, monetize, embed.
- **The daily challenge is a retention engine.** Same level for everyone worldwide creates
  community (Discord, Reddit: "did you get The Gauntlet today?").

**What would make this a real product:**

- User accounts + global leaderboard per daily challenge
- Speed ladder mode: same position played at 75 / 90 / 110 / 130 BPM in one session, trophy at top
- More scale families: Am pentatonic in all 5 positions, major pentatonic, blues scale (the ♭5 note)
- Lick library: pre-built 4-bar phrases using scale patterns — same detection, more musical
- Mobile: external audio interface via USB-C is standard for serious players

**What it is right now:**

A solid MVP. Two worlds, 12 levels, daily challenge, achievement system, real pitch detection,
real scoring, shareable results. The core loop is done and it works. Ship it.
