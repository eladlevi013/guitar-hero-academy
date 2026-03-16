# Guitar Hero Academy — Product Spec

A browser-based guitar technique trainer. Real-time pitch detection via microphone, Guitar Hero–style scrolling tab rail, no song content — pure exercises.

---

## What it is

A single-page web app (Next.js) where a guitar player practices technique drills by playing along to a scrolling tab rail. The app listens to the microphone, detects pitch in real time using the YIN algorithm, and scores each note as a hit or miss. The goal is speed and accuracy improvement, not entertainment.

---

## World & Level Structure

**One world: World 1 — The 5 Positions**

All content is Em pentatonic across the neck, the standard 5 CAGED/pentatonic hand positions.

| Level | Name | Focus | BPM |
|---|---|---|---|
| 1 | Penta Box 1 | Position 1, open box | 78 |
| 2 | Penta Box 2 | Position 2, G shape (str6 frets 3&5) | 80 |
| 3 | Penta Box 3 | Position 3, A shape (frets 5&7) | 83 |
| 4 | Penta Box 4 | Position 4, B shape (frets 7&10/7&9) | 86 |
| 5 | Penta Box 5 | Position 5, D shape (frets 10&12/9&12) | 89 |
| 6 | Neck Runner | Positions 1→3→5 continuous run with hand shifts | 93 |

**Level design rules:**
- No real songs, no recognizable riffs — exercises only
- Notes must not fall on every consecutive beat (avoids machine-gun kick pattern)
- Space notes ≥2 beats apart, or in groups of 4 quick notes followed by a 2-beat held note
- Use `durationBeats: 2` held notes at phrase peaks and endings

---

## Core Gameplay Loop

1. Player opens a level page (`/practice/[levelId]`)
2. Taps **Start** (or presses `Space`) → browser asks for mic permission
3. 4-beat drum lead-in counts down visually
4. Notes scroll right-to-left on the tab rail; the white playhead line is the hit zone
5. Player plays each note as it crosses the playhead
6. YIN pitch detection compares detected frequency to the target — ±75 cents = hit
7. Green circle = hit, red circle = miss; a miss label shows the note actually played (or "silent")
8. Level ends → score screen shows %, star rating (3★ ≥80%, 2★ ≥60%, 1★ ≥40%), max combo

---

## Game Modes

| Mode | Behaviour |
|---|---|
| **Timed** | Clock-driven, notes expire, misses break combo, full scoring |
| **Practice** | No clock pressure, tab auto-scrolls to each note, no misses, no score |

Toggle with the `M` key or the MODE segmented control (only before starting).

---

## Speed Control

Five speed multipliers available before starting:

| Key | Multiplier | BPM example (Level 1) |
|---|---|---|
| `1` | 0.5× | 39 BPM |
| `2` | 0.75× | 59 BPM |
| `3` | 1× | 78 BPM |
| `4` | 1.25× | 98 BPM |
| `5` | 1.5× | 117 BPM |

---

## Keyboard Shortcuts

| Key | Action | When |
|---|---|---|
| `Space` | Start / Stop mic | Always |
| `R` | Restart level | When stopped |
| `Esc` | Back to World Map | Always |
| `1`–`5` | Set speed (0.5×–1.5×) | When stopped |
| `M` | Toggle Timed / Practice | When stopped |

---

## Tab Rail

- Scrolls horizontally at a constant px/ms rate tied to BPM
- String lines 1–6 (e → E), each a distinct color
- Note circles show fret number; `O` = open string
- **Active** note (in hit window): bright string color, glow
- **Hit**: green `#22c55e` with pop animation
- **Missed**: dim red; small label fades out over 2s showing:
  - Note name played (e.g. `G#3`) — sourced from the live YIN frequency at the time of miss
  - `silent` (dim) — if no pitch was detected during the window
- Playhead pulses on the beat; ring flash on each hit
- Combo ≥3/5/10 tints the rail blue/green/gold

---

## Pitch Detection

- **Algorithm**: YIN (de Cheveigné & Kawahara 2002)
- **Buffer**: 4096 samples @ 44.1 kHz (~93 ms window)
- **Rate**: runs every 3rd animation frame (~20 Hz) to avoid burning CPU
- **Guitar range filter**: 60–1500 Hz only
- **Audio chain**: `getUserMedia` → DynamicsCompressor → Gain (×4) → AnalyserNode
- **Hit tolerance**: ±75 cents
- **Hit window**: note duration + 600 ms padding on each side (covers output latency + reaction time)
- **Release detection**: sustained pitch doesn't re-trigger the next note — player must go silent or shift ≥150 cents

---

## Cents Meter

Live tuning bar shown below the tab rail during a session:

- Green dot + "Perfect!" when within ±15¢
- Amber when within ±40¢
- Red when outside ±40¢
- Dot tracks current pitch; fill bar shows sharp/flat direction

---

## Backing Track

- Synthesized drum pattern (Web Audio API), no audio files
- Kick on each note's start beat; hi-hat fills the rests; snare on beat 2 & 4
- Plays only in Timed mode, silent in Practice mode
- Volume control in the transport row (range slider, accent-color tinted)
- Stops automatically on level complete

---

## Scoring

- **Score**: `hits / total × 100`, rounded
- **Stars**: 3★ ≥80%, 2★ ≥60%, 1★ ≥40%, 0★ below
- **Combo**: consecutive hits; breaks on miss; displayed in header when ≥2
- **Max combo**: tracked per attempt, shown on results screen
- **Progress**: best star rating per level saved in `localStorage` (`gha-v1-stars`, `gha-v1-progress`)

---

## Achievements

Stored in `localStorage` key `gha-v1-achievements`. Toast shown for 3.5 s.

| ID | Title | Trigger |
|---|---|---|
| `first-note` | First Note | Hit 1 note |
| `first-level` | First Level | Complete any level |
| `on-a-roll` | On a Roll | Combo ≥5 |
| `unstoppable` | Unstoppable | Combo ≥10 |
| `hat-trick` | Hat Trick | 3-star a level |
| `perfect` | Perfect | Hit every note |

---

## First-Time Onboarding

Shown once on first visit (checked against `gha-v1-onboarded` in localStorage).

3-screen modal, dismissible at any point via "Skip":

1. **Play near your mic or plug in** — laptop mic or direct input
2. **Allow microphone when prompted** — browser permission flow
3. **Hit the notes as they scroll** — static mini rail preview showing one green hit and one red miss with note label

"Got it" on screen 3 sets `gha-v1-onboarded = 1` and closes.

---

## localStorage Keys

| Key | Type | Content |
|---|---|---|
| `gha-v1-progress` | `string[]` | Completed level IDs |
| `gha-v1-stars` | `Record<string, 1\|2\|3>` | Best star count per level |
| `gha-v1-achievements` | `string[]` | Unlocked achievement IDs |
| `gha-v1-onboarded` | `"1"` | Set after onboarding modal dismissed |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Inline styles + `globals.css` for keyframes |
| Fonts | Inter (body), Playfair Display (display) via `next/font` |
| Audio | Web Audio API — `getUserMedia`, `AnalyserNode`, Web Audio synthesis |
| Pitch | Custom YIN implementation in `src/lib/yin.ts` |
| Animation | `requestAnimationFrame` loop in TabRail (no React state per frame) |

---

## File Map

```
src/
├── app/
│   ├── globals.css              # Keyframe animations, CSS vars
│   ├── layout.tsx               # Root layout, font loading
│   ├── page.tsx                 # Home / world select
│   └── practice/
│       ├── page.tsx             # World map with level cards
│       └── [levelId]/page.tsx   # Dynamic level route
├── components/
│   ├── PracticeSession.tsx      # Main game UI, control dock, onboarding modal
│   └── TabRail.tsx              # Scrolling tab rail (rAF-driven, memoized)
├── hooks/
│   ├── useGameLoop.ts           # Timing, hit detection, miss labels, scoring
│   ├── usePitchDetection.ts     # Mic capture, YIN throttling, note output
│   ├── useBackingTrack.ts       # Drum synthesis and playback
│   ├── useProgress.ts           # localStorage progress persistence
│   └── useAchievements.ts       # Achievement unlock and toast
├── lib/
│   └── yin.ts                   # YIN algorithm + frequencyToNote utility
├── data/
│   ├── world1.ts                # World 1 metadata and level list
│   └── levels/world1-level1.ts … world1-level6.ts
└── types/
    └── tab.ts                   # TabNote, Level types
```
