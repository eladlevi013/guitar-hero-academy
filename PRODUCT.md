# Guitar Hero Academy — Product Direction

## What this app is

A **real-time guitar scale trainer** built around the web's pitch detection API.
You plug in or play acoustic, the app listens, and it scores every note you play
against a scrolling tab rail — Guitar Hero style, but for actual technique practice.

## What this app is NOT

- **Not a song game.** No riffs, no recognizable melodies, no song fragments.
  Songs don't work well because (a) pitch detection picks up harmonics and noise,
  (b) song content creates copyright/IP risks, and (c) songs don't teach technique.
- **Not a beginner open-string toy.** The content is intermediate — pentatonic
  positions, real fret patterns, meaningful BPMs.

## Current content: The 5 Pentatonic Positions (World 1)

All levels use the **E minor pentatonic scale** across all 6 strings, full range.
Each level locks your hand into one CAGED shape and makes you play it clean and fast.

| Level | Shape | Fret range | BPM |
|-------|-------|-----------|-----|
| Box 1 — Full | Open / E shape | 0–3 | 95 |
| Box 2 — Full | G shape | 2–5 | 100 |
| Box 3 — Full | A shape | 4–8 | 104 |
| Box 4 — Full | B shape | 7–10 | 108 |
| Box 5 — Full | D shape | 9–12 | 112 |
| Grand Sweep | All 5 positions, 1-beat spacing | 0–12 | 120 |

## Design rules (do not break these)

1. **No real songs.** No recognizable riffs. Every note sequence is a purpose-built exercise.
2. **2-beat minimum spacing** on standard levels — gives notes room to ring and keeps
   drum groove feeling musical (kick + rest + snare + rest = groove, not machine gun).
3. **Full scale, not excerpts.** Every level covers all 6 strings of the position.
   Partial 3-string excerpts feel incomplete and are too easy.
4. **Ascending and descending.** Up the scale, hold the peak, back down to root.
5. **Intermediate difficulty.** BPMs 90–120 at 1× speed. The 0.5× option exists for
   beginners; the 1.5× option exists for advanced players. Default is full speed.
6. **Drums only** in the backing track — no bass, no pad, no guide melody.
   The player's own guitar is the only pitched sound. This keeps it clean and avoids
   the app "giving away" the notes.

## Technical architecture notes

- **Drum sync**: `outputLatency` is unreliable on Windows Chrome (returns 0).
  Fixed via `userSyncMs` (default 100ms) — user-adjustable in the SYNC slider.
  Formula: `audioWallStartRef = performance.now() + browser.outputLatency + userSyncMs`
- **Hit detection**: ±75 cents threshold, 600ms window per note. `requireRelease`
  prevents a sustained note from triggering multiple consecutive notes.
- **Modes**: Timed (scored, notes can be missed) and Practice (no miss, play at your pace).

## What to build next

- **Am pentatonic** positions (parallel to Em, different root feel)
- **Speed ladder** — same position, multiple passes at increasing BPM (75 / 90 / 110 / 130)
- **String skipping exercise** — non-adjacent strings to build right-hand accuracy
- **Daily challenge** — one random position at a random BPM, no retries
