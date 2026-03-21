# Shred School — Product Spec

A browser-based lead guitar shredding trainer. Real-time pitch detection via microphone, Guitar Hero–style scrolling tab rail, synced backing drums, and a structured curriculum focused on speed, technique, and shredding mastery. No songs, no subscription — pure shredding practice.

---

## What it is

A Next.js web app where a guitar player practices shredding techniques by playing along to a scrolling tab rail. The app listens to the microphone, detects pitch in real time, and scores each note as a hit or miss. Speed and precision can be trained methodically instead of by ear alone.

---

## World & Level Structure

### World 1 — Alternate Picking Foundations
Build the bedrock of shredding: strict alternate picking, right-hand consistency, and clean articulation on pentatonic and blues scales.

| Level | Name | Focus | BPM |
|---|---|---|---|
| 1 | Down-Up Foundations | Alternate picking basics | 92 |
| 2 | Pickstroke Precision | 3-note picking cells | 108 |
| 3 | Blues Bend Awareness | Blue notes with precision | 100 |
| 4 | 5th Fret Shift | Position independence and picking control | 100 |
| 5 | Interval Jumping | Wider picking arcs | 104 |
| 6 | Full-Range Alt-Pick | Position shifting at speed | 116 |

### World 2 — Legato & Fluidity
Master hammer-ons, pull-offs, and slides to unlock smooth, liquid shredding. Legato is the secret weapon for speed.

### World 3 — Advanced Shredding
Speed cells, 4-note sequences, string skipping, full-neck runs, and advanced articulation. This is where shredders are made.

**18 levels total across 3 worlds.**

Each level carries: `title`, `subtitle`, `description`, `bpm`, `difficulty` (easy/medium/hard), `focus` technique goal, and an array of `notes` (string, fret, target frequency, start beat, duration).

**Level unlock progression:** completing level N unlocks level N+1 within a world.

---

## Core Gameplay Loop

1. Player opens a level page (`/practice/[levelId]`)
2. Taps **Start Mic** → browser requests microphone permission
3. 4-beat drum count-in plays before notes begin scrolling
4. Notes scroll right-to-left; the playhead is the hit zone
5. Pitch detection compares detected frequency to target — ±75 cents = hit
6. Green = hit, dim red = miss (with the actual note played or `silent` label)
7. Level completes when all notes have passed → results screen with score, stars, tips

---

## Game Modes

| Mode | Behaviour |
|---|---|
| **Timed** | Clock-driven, notes expire, misses break combo, full scoring, stars count |
| **Practice** | No clock pressure, no misses, session logged but stars not updated |

Default mode is configurable from the Player Hub. Both modes save to session history.

---

## Practice Segments

Drill specific parts of a level without replaying the full thing:

| Segment | Notes |
|---|---|
| Full level | Complete run — only this awards stars |
| Front half | First 50% of notes |
| Back half | Second 50% of notes |
| Last 8 notes | Final stretch drill |

Segment state is separate from full-level progress so partial runs never overwrite your best star count.

---

## Tab Rail

- Scrolls horizontally at a constant px/ms rate locked to AudioContext clock (not `Date.now`)
- String lines 1–6, each a distinct color (blue / amber / green / teal / purple / red)
- Note circles show fret number; `O` = open string
- **Active** note (in hit window): bright string color with glow
- **Hit**: green with pop animation
- **Missed**: dim red; label fades out showing the note actually played or `silent`
- Playhead pulses on the beat; ring flash on each hit
- Combo ≥3/5/10 tints the rail blue/green/gold

---

## Pitch Detection

- **Algorithm**: YIN (de Cheveigné & Kawahara 2002)
- **Buffer**: 4096 samples @ 44.1 kHz (~93 ms window)
- **Rate**: every 3rd animation frame (~20 Hz) to avoid burning CPU
- **Guitar range filter**: 60–1500 Hz only
- **Audio chain**: `getUserMedia` → DynamicsCompressor → Gain (×4) → AnalyserNode
- **Hit tolerance**: ±75 cents
- **Hit window**: note duration + 600 ms padding per side (covers output latency + reaction time)
- **Release detection**: sustained pitch doesn't re-trigger; player must go silent or shift ≥150 cents

---

## Cents Meter

Live tuning bar shown during a session:

- Green dot + "Perfect!" when within ±15¢
- Amber within ±40¢, red beyond
- Animated needle with smooth CSS transition — doubles as a real-time tuner

---

## Backing Drums

- Synthesized drum pattern via Web Audio API — no audio files to load or cache
- Kick, snare, hi-hat pattern locked to the level BPM
- 4-beat count-in before first note
- Volume adjustable from Player Hub settings (0–100%)
- Stops automatically on level completion or mic stop
- Silent in Practice mode; plays in Timed mode

---

## Scoring

- **Score**: `hits / total × 100`, rounded
- **Stars**: 3★ ≥80%, 2★ ≥60%, 1★ ≥40%, 0★ below
- **Combo**: consecutive hits; breaks on miss; shown in the header when ≥2
- **Max combo**: tracked per attempt, shown on results screen
- **Best stars**: per-level best is saved to `localStorage` and never overwritten by a worse run

---

## Session Feedback

After each run the app generates personalized coaching based on the attempt:

- Identifies the **most-missed string** and **top 2 missed notes** by label
- Accuracy-banded tips (<60%, 60–85%, >85%)
- Combo-based advice if max combo was low relative to level length
- **Focus area** label surfaced in session history (e.g. "String 4 accuracy", "Pitch lock on F#4")

---

## Daily Challenge

- One level per UTC calendar day, rotating across all 18 levels
- Shareable result card with stars, hit/miss bar, and score percentage
- One-tap share to X (Twitter) or clipboard copy
- Achievements: `Daily Grind` (complete a daily), `Daily Legend` (3★ on a daily)

---

## Achievements (18 total)

Stored in `localStorage`. Toast notification fires on unlock for 3.5 s.

| ID | Title | Icon | Trigger |
|---|---|---|---|
| `first-note` | First Note | 🎵 | Hit your very first note |
| `first-level` | Level Clear | ✅ | Finish any level |
| `hat-trick` | Hat Trick | ⭐ | Earn 3★ on any level |
| `perfect` | Perfect Run | 💎 | Hit 100% in one level |
| `accuracy-star` | Sharp Shooter | 🎯 | Score 90%+ accuracy on any level |
| `on-a-roll` | On a Roll | 🔥 | Hit 5 notes in a row |
| `unstoppable` | Unstoppable | ⚡ | Hit 10 notes in a row |
| `flow-state` | Flow State | 🌊 | Hit 20 notes in a row |
| `speed-demon` | Speed Demon | 🚀 | Complete a level at 1.25× speed or faster |
| `world1-done` | Right Hand Ready | 🏆 | Complete all 6 levels of World 1 |
| `world2-done` | Fluid Fingers | 🎓 | Complete all 6 levels of World 2 |
| `world3-done` | Shred Lord | 👑 | Complete all 6 levels of World 3 |
| `all-worlds` | Guitar Hero | 🌟 | Complete all 18 levels |
| `world1-ace` | Picking Pro | 🎸 | Earn 3★ on any World 1 level |
| `world2-ace` | Legato Legend | 🎶 | Earn 3★ on any World 2 level |
| `world3-ace` | Shred Star | 💥 | Earn 3★ on any World 3 level |
| `daily-done` | Daily Grind | 📅 | Complete a daily challenge |
| `daily-perfect` | Daily Legend | 🥇 | 3★ on a daily challenge |

---

## Player Hub (`/player`)

Dedicated player profile and settings page:

### Stats at a glance
Levels cleared, stars banked, practice streak, achievements unlocked.

### Timing Calibration
- ±180 ms audio latency offset slider
- Quick-select preset buttons (−60, −30, 0, +30, +60 ms)
- "Play timing preview" — 4-click count-in to test the current offset
- Adjusts the note rail scroll rate so what you hear matches what you see

### Session Defaults
- Default mode (Timed / Practice)
- Drum volume (0–100%)
- Both persist across sessions

### Practice Rig Status
Quick-glance mic / tuner / audio check state without re-running setup.

### Recent Sessions Log
Last 6 runs with: level title, segment label, focus area, mode, score, timestamp.

### Focus Patterns
Top 3 most-practiced focus areas derived from session history — shows where you keep coming back.

### Achievement Grid
All 18 achievements shown with earned vs. locked state.

---

## Setup Flow (`/setup`)

Guided 3-step flow that runs once and saves its state locally. All subsequent sessions show a readiness badge without re-running setup.

1. **Mic check** — start mic, watch the volume meter go green, mark confirmed
2. **Tuner lock** — pluck a note, see it detected in the live tuner, save the check
3. **Count-in audio** — play a 4-click count-in through the device speakers, confirm audible

Setup state shown as a readiness indicator on: homepage, practice map, and player hub.

---

## Practice Map (`/practice`)

Interactive world map with:

- **World tab switcher** — W1 / W2 / W3 selector with accent colors
- **Status strip** — rig readiness, session count, avg accuracy, coaching focus at a glance below tabs
- **SVG node map** — animated road path with 6 nodes, locked nodes show padlock icon
- **Level list** — all 6 levels with title, BPM, stars, locked/unlocked state; click any to preview
- **"Jump to recommendation"** — highlights the next incomplete level
- **Level detail panel** — description, focus goal, difficulty, note count, BPM, best stars, recent world runs, start button
- **Recent world runs** — last 2 sessions from the active world shown in the detail panel

---

## Session History & Analytics

All session data stored in `localStorage`:

**Per-session fields:** level ID, title, world number, score, stars, hit count, focus area, segment label, mode, timestamp.

**Derived summary (shown in Player Hub and homepage):**
- Streak days (consecutive days with at least 1 session)
- Runs in last 7 days
- Average accuracy (%)
- Total practice minutes
- Recommended coaching focus (most common weak area across recent sessions)

---

## localStorage Keys

| Key | Content |
|---|---|
| `gha-v1-progress` | Completed level IDs + best star counts |
| `gha-v1-achievements` | Unlocked achievement IDs |
| `gha-v1-session-history` | Array of up to 50 recent sessions |
| `gha-v1-setup-progress` | Mic / tuner / audio check flags |
| `gha-v1-practice-settings` | Mode, drum volume, timing offset ms |

All reads/writes are wrapped in try/catch so storage errors are silent.

---

## Production-Ready Status

### Already shipped
- Per-level SEO metadata (`<title>`, `<description>`) via Next.js `generateMetadata`
- Static param generation — all 18 level pages pre-rendered at build time (`generateStaticParams`)
- AudioContext clock used for note timing — immune to `Date.now` drift and tab throttling
- Timing offset calibration to compensate for device-specific audio latency
- Graceful mic error handling with in-UI error messages
- All `localStorage` reads/writes guarded with try/catch
- Backing track and mic automatically cleaned up on unmount
- Session history capped at 80 entries to avoid unbounded storage growth
- **OG image** — `/api/og` edge route returns a 1200×630 image for social sharing previews
- **Custom 404 page** — styled not-found.tsx with guitar emoji and navigation links
- **Error boundary** — styled error.tsx with reset button and error message display
- **Anonymous user ID** — `getAnonymousId()` / `useAnonymousId()` generates a UUID on first visit, stored in `gha-anon-id`. Makes account migration trivial when auth lands.
- **Score history sparkline** — last 8–12 timed runs shown as a color-coded bar chart on the session complete screen and practice map level detail panel
- **Per-string accuracy bars** — after each full level run, shows hit % per guitar string (only strings used in the level)
- **Scale diagram** — mini fretboard in the pre-session control dock showing which positions appear in the level, colored by string
- **Level audio preview** — "Preview scale" button plays the level's notes as synthesized tones at 65% BPM before starting
- **World completion ceremony** — completing the last level of a world shows a full-screen celebration screen with confetti, world title, star count, share button, and "Begin World N+1" CTA
- **Share on any level** — session complete screen has "Share on X" and "Copy result" buttons generating a result card (stars + score + link)
- **Try faster** — when score ≥ 80%, a "Try faster ↑" button offers the next speed step (inverse of retry slower)
- **Practice calendar heatmap** — GitHub-style 26-week contribution grid in Player Hub, colored by sessions per day
- **Data export** — "Export my data" in Player Hub downloads all sessions, progress, achievements, and settings as dated JSON
- **Auto-advance toggle** — Player Hub setting: after a 3-star full run, automatically navigate to the next level
- **Mobile CSS layer** — `globals.css` media query at ≤680px covers hero grid, summary grid, world cards, practice map, player hub, and status strip
- **Expanded achievement set** — 18 achievements with correct Unicode emoji encoding; new entries cover Sharp Shooter (90%+), Flow State (20-note combo), Speed Demon (1.25× speed), per-world star tiers (Picking Pro / Legato Legend / Shred Star), and renamed world-completion titles (Right Hand Ready / Fluid Fingers / Shred Lord)
- **Musical level redesign** — all 18 levels rebuilt with `buildNotesVaried` burst-hold phrasing: eighth-note groups followed by sustained holds, giving each drill the feel of real guitar music rather than a mechanical exercise
- **World completion achievement triggers** — `PracticeSession` fires `world1-done` / `world2-done` / `world3-done` / `all-worlds` automatically when the last level of a world is completed in timed full-level mode
- **Simplified home page UI** — hero reduced to headline + CTA + current-focus panel; four-stat summary row; three world cards with progress bars and resume buttons; clean footer; no extraneous sections

### Recommended next steps

**Reliability**
- E2E tests (Playwright) for setup flow and level-completion happy path
- Unit tests for the YIN pitch detection and game loop hit detection logic
- Service worker for offline support and PWA installability badge

**Reach**
- ARIA labels on all icon-only buttons and the SVG map nodes for screen reader support
- Full mobile layout pass — the CSS layer is in place; individual pages need className wiring
- Keyboard shortcut cheat sheet overlay (`?` key)

**Growth**
- Google Auth + cloud sync — link anonymous ID to account on first sign-in, sync localStorage to backend
- Daily challenge leaderboard — submit scores to a backend, show global ranking
- Analytics — event tracking on level start/complete/drop to identify curriculum weak spots
- Level editor — JSON-based authoring tool so the curriculum can grow without code changes

**Audio quality**
- Sampled drum audio as an opt-in upgrade over the synthesized oscillator pattern
- BPM ramp mode — starts at 70% tempo and auto-increases as the player succeeds (Rocksmith-style)

---

## File Map

```
src/
├── app/
│   ├── globals.css                  # Keyframe animations, CSS variables
│   ├── layout.tsx                   # Root layout, font loading
│   ├── page.tsx                     # Home dashboard
│   ├── daily/page.tsx               # Daily challenge
│   ├── player/page.tsx              # Player Hub (profile, settings, stats)
│   ├── setup/page.tsx               # 3-step setup flow
│   └── practice/
│       ├── page.tsx                 # Practice Map (world map, level list)
│       └── [levelId]/page.tsx       # Dynamic level route + SEO metadata
├── components/
│   ├── PracticeSession.tsx          # Main game UI, segment picker, results, coaching
│   ├── TabRail.tsx                  # Scrolling tab rail (rAF-driven, no React state per frame)
│   └── Tuner.tsx                    # Live tuner display component
├── hooks/
│   ├── useGameLoop.ts               # Beat timing, hit detection, miss labels, scoring
│   ├── usePitchDetection.ts         # Mic capture, YIN throttling, cents, note name output
│   ├── useBackingTrack.ts           # Drum synthesis, count-in, AudioContext management
│   ├── useProgress.ts               # Level completion and best-star persistence
│   ├── useAchievements.ts           # Achievement unlock logic and toast state
│   ├── useSessionHistory.ts         # Session log, summary stats, streak calculation
│   ├── usePracticeSettings.ts       # Mode, drum volume, timing offset persistence
│   └── useSetupProgress.ts          # Setup flow step state persistence
├── data/
│   ├── world1.ts                    # World 1 metadata and 6 levels
│   ├── world2.ts                    # World 2 metadata and 6 levels
│   ├── world3.ts                    # World 3 metadata and 6 levels
│   └── levelLibrary.ts              # Shared level data helpers
└── types/
    └── tab.ts                       # TabNote, Level, World types
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, static export) |
| Language | TypeScript |
| Styling | Inline styles + `globals.css` for keyframes |
| Fonts | Inter (body), Playfair Display (display) via `next/font` |
| Audio | Web Audio API — `getUserMedia`, `AnalyserNode`, oscillator synthesis |
| Pitch | Custom YIN implementation |
| Animation | `requestAnimationFrame` loop in TabRail (no React state per frame) |
| State | React hooks + `localStorage` — no server, no account required |
| Deployment | Vercel |
