"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AccountMenu from "@/components/AccountMenu";
import { libraryCollections } from "@/data/library";
import world1 from "@/data/world1";
import world2 from "@/data/world2";
import world3 from "@/data/world3";
import { useProgress } from "@/hooks/useProgress";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { useSetupProgress } from "@/hooks/useSetupProgress";
import type { Level, World } from "@/types/tab";

const ALL_WORLDS = [world1, world2, world3];

const NODES = [
  { x: 150, y: 532 },
  { x: 78, y: 438 },
  { x: 222, y: 336 },
  { x: 78, y: 230 },
  { x: 222, y: 126 },
  { x: 150, y: 52 },
];

const ROAD = [
  "M 150,532",
  "C 150,486 78,488 78,438",
  "C 78,392 222,390 222,336",
  "C 222,286 78,282 78,230",
  "C 78,182 222,180 222,126",
  "C 222,88 150,86 150,52",
].join(" ");

const WORLD_THEMES: Record<string, { main: string; dark: string }[]> = {
  world1: [
    { main: "#c8553d", dark: "#9a3821" },
    { main: "#c47c2a", dark: "#8a5218" },
    { main: "#5c8a42", dark: "#3d6028" },
    { main: "#3a7a6b", dark: "#205548" },
    { main: "#3a5a8a", dark: "#1e3a68" },
    { main: "#7a4a8a", dark: "#4e2860" },
  ],
  world2: [
    { main: "#3a7a6b", dark: "#205548" },
    { main: "#3a5a8a", dark: "#1e3a68" },
    { main: "#7a4a8a", dark: "#4e2860" },
    { main: "#c8553d", dark: "#9a3821" },
    { main: "#8a3a20", dark: "#5c1e0a" },
    { main: "#4e2860", dark: "#2a1038" },
  ],
  world3: [
    { main: "#a83a1e", dark: "#6e2210" },
    { main: "#8a3a20", dark: "#5c1e0a" },
    { main: "#4e2860", dark: "#2a1038" },
    { main: "#7a4a8a", dark: "#4e2860" },
    { main: "#c47c2a", dark: "#8a5218" },
    { main: "#c8553d", dark: "#9a3821" },
  ],
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "#7ac85a",
  medium: "#f0c040",
  hard: "#ff7a59",
};

function getNextUnlockedIndex(
  world: World,
  isUnlocked: (levelIndex: number, levelIds: string[]) => boolean,
  isCompleted: (levelId: string) => boolean,
) {
  const levelIds = world.levels.map((level) => level.id);
  for (let idx = 0; idx < world.levels.length; idx++) {
    if (isUnlocked(idx, levelIds) && !isCompleted(world.levels[idx].id)) return idx;
  }
  return 0;
}

function buildStars(stars: number) {
  return [1, 2, 3].map((value) => (value <= stars ? "*" : "-")).join("");
}

function PadLock({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <path
        d={`M ${cx - 5},${cy - 1} L ${cx - 5},${cy - 6} A 5,5 0 0 1 ${cx + 5},${cy - 6} L ${cx + 5},${cy - 1}`}
        fill="none"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x={cx - 7} y={cy - 2} width={14} height={10} rx={2.5} fill="rgba(255,255,255,0.24)" />
      <circle cx={cx} cy={cy + 3} r={1.8} fill="rgba(0,0,0,0.45)" />
    </g>
  );
}

function WorldMap({
  world,
  selectedIndex,
  onNodeSelect,
}: {
  world: World;
  selectedIndex: number;
  onNodeSelect: (index: number) => void;
}) {
  const { isCompleted, isUnlocked, getBestStars } = useProgress();
  const levelIds = world.levels.map((level) => level.id);
  const themes = WORLD_THEMES[world.id];
  const radius = 24;

  return (
    <svg
      viewBox="0 0 300 590"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {world.levels.map((level, index) => {
          const done = isCompleted(level.id);
          const locked = !isUnlocked(index, levelIds);
          const theme = themes[index];
          return (
            <radialGradient key={level.id} id={`node-${world.id}-${index}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor={locked ? "rgba(255,255,255,0.08)" : done ? "#8fd46a" : theme.main} />
              <stop offset="100%" stopColor={locked ? "rgba(255,255,255,0.02)" : done ? "#2f5a22" : theme.dark} />
            </radialGradient>
          );
        })}
      </defs>

      <path d={ROAD} stroke="rgba(105,55,180,0.16)" strokeWidth="34" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={ROAD} stroke="rgba(15,9,35,0.98)" strokeWidth="24" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={ROAD} stroke="rgba(240,192,60,0.12)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="9 14" />

      {world.levels.map((level, index) => {
        const done = isCompleted(level.id);
        const unlocked = isUnlocked(index, levelIds);
        const locked = !unlocked;
        const theme = themes[index];
        const stars = getBestStars(level.id);
        const { x, y } = NODES[index];
        const selected = selectedIndex === index;

        return (
          <g key={level.id} onClick={() => onNodeSelect(index)} style={{ cursor: locked ? "default" : "pointer" }}
            role={locked ? undefined : "button"}
            aria-label={locked ? `Level ${index + 1} — locked` : `Level ${index + 1}: ${level.title}${done ? " (complete)" : ""}`}
            tabIndex={locked ? -1 : 0}
            onKeyDown={(e) => { if (!locked && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onNodeSelect(index); } }}
          >
            <circle
              cx={x}
              cy={y}
              r={selected ? radius + 11 : radius + 5}
              fill="none"
              stroke={selected ? `${theme.main}77` : done ? "rgba(122,200,90,0.3)" : `${theme.main}22`}
              strokeWidth={selected ? 8 : 4}
            />
            <circle cx={x} cy={y + 3} r={radius + 1} fill="rgba(0,0,0,0.42)" />
            <circle
              cx={x}
              cy={y}
              r={radius}
              fill={`url(#node-${world.id}-${index})`}
              stroke={selected ? "rgba(255,255,255,0.62)" : locked ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.18)"}
              strokeWidth="2"
            />
            {!locked ? (
              <text x={x} y={y} textAnchor="middle" dy="0.35em" fill="white" fontSize="15" fontWeight="900" style={{ userSelect: "none" }}>
                {index + 1}
              </text>
            ) : (
              <PadLock cx={x} cy={y} />
            )}
            <text x={x} y={y + radius + 12} textAnchor="middle" dominantBaseline="hanging" fill={locked ? "rgba(255,255,255,0.2)" : done ? "#7ac85a" : theme.main} fontSize="10" fontWeight="700" style={{ userSelect: "none" }}>
              {locked ? "LOCK" : `L${index + 1}`}
            </text>
            {!locked && (
              <text x={x} y={y + radius + 24} textAnchor="middle" dominantBaseline="hanging" fill={stars > 0 ? "#f0c040" : "rgba(255,255,255,0.18)"} fontSize="9" style={{ userSelect: "none" }}>
                {buildStars(stars)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function LevelRow({
  level,
  index,
  selected,
  unlocked,
  stars,
  onSelect,
}: {
  level: Level;
  index: number;
  selected: boolean;
  unlocked: boolean;
  stars: number;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        borderRadius: 18,
        border: selected ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.08)",
        background: selected ? "rgba(255,255,255,0.08)" : unlocked ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
        padding: "14px 14px 13px",
        cursor: unlocked ? "pointer" : "default",
        opacity: unlocked ? 1 : 0.45,
      }}
    >
      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: unlocked ? "rgba(200,180,140,0.55)" : "rgba(255,255,255,0.24)", marginBottom: 5 }}>
            LEVEL {index + 1}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#f0e8d8", marginBottom: 4 }}>{level.title}</div>
          <div style={{ fontSize: 12, color: "rgba(240,232,216,0.56)", lineHeight: 1.4 }}>{level.subtitle ?? `${level.notes.length} note workout`}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ color: unlocked ? "#f0c040" : "rgba(255,255,255,0.16)", fontSize: 12, fontWeight: 800 }}>{buildStars(stars)}</div>
          <div style={{ fontSize: 10, color: "rgba(200,180,140,0.45)", marginTop: 6 }}>{level.bpm} BPM</div>
        </div>
      </div>
    </button>
  );
}

function InfoStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: accent ?? "rgba(200,180,140,0.48)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function LevelSparkline({ levelId }: { levelId: string }) {
  const { sessions } = useSessionHistory();
  const history = sessions.filter(s => s.levelId === levelId && s.mode === "timed").slice(0, 8).reverse();
  if (history.length < 2) return null;
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(200,180,140,0.48)", marginBottom: 8 }}>SCORE TREND</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 28 }}>
        {history.map((s, i) => {
          const color = s.score >= 80 ? "#7ac85a" : s.score >= 60 ? "#f0c040" : "#e8553d";
          return (
            <div key={s.id} style={{ flex: 1, height: `${Math.max(10, (s.score / 100) * 100)}%`, background: color, borderRadius: 2, opacity: 0.4 + (i / history.length) * 0.6 }} />
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(200,180,140,0.3)", marginTop: 3 }}>
        <span>{history[0]?.score}%</span><span>→ {history[history.length - 1]?.score}%</span>
      </div>
    </div>
  );
}

export default function PracticePage() {
  const router = useRouter();
  const { isUnlocked, isCompleted, getBestStars } = useProgress();
  const { summary, sessions } = useSessionHistory();
  const { isReady } = useSetupProgress();
  const [worldIndex, setWorldIndex] = useState(0);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(() => getNextUnlockedIndex(ALL_WORLDS[0], isUnlocked, isCompleted));

  const activeWorld = ALL_WORLDS[worldIndex];
  const activeLevel = activeWorld.levels[selectedLevelIndex];
  const levelIds = activeWorld.levels.map((level) => level.id);
  const levelUnlocked = isUnlocked(selectedLevelIndex, levelIds);
  const bestStars = getBestStars(activeLevel.id);
  const worldDoneCount = activeWorld.levels.filter((level) => isCompleted(level.id)).length;
  const nextRecommendedIndex = getNextUnlockedIndex(activeWorld, isUnlocked, isCompleted);
  const worldSessions = sessions.filter((session) => session.worldNum === activeWorld.number).slice(0, 2);
  const featuredCollections = libraryCollections.slice(0, 3);

  function handleWorldChange(index: number) {
    const world = ALL_WORLDS[index];
    setWorldIndex(index);
    setSelectedLevelIndex(getNextUnlockedIndex(world, isUnlocked, isCompleted));
  }

  function handleStartLevel(level: Level) {
    if (!levelUnlocked) return;
    router.push(`/practice/${level.id}`);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
      color: "#f0e8d8",
      fontFamily: "var(--font-body)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -120, left: -70, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,85,61,0.16) 0%, transparent 72%)" }} />
        <div style={{ position: "absolute", top: 70, right: -120, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(110,40,180,0.12) 0%, transparent 72%)" }} />
        <div style={{ position: "absolute", bottom: -120, left: "20%", width: 620, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,122,107,0.12) 0%, transparent 76%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <header style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "rgba(6,3,16,0.82)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" style={{ textDecoration: "none", color: "rgba(240,232,216,0.68)", fontSize: 13, fontWeight: 700 }}>&lt;- Home</Link>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 900 }}>Practice Map</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Link href="/player" style={{ textDecoration: "none", color: "#bfd7ff", fontSize: 13, fontWeight: 700 }}>Player</Link>
            <Link href="/setup" style={{ textDecoration: "none", color: "#7bc3b4", fontSize: 13, fontWeight: 700 }}>Setup</Link>
            <Link href="/daily" style={{ textDecoration: "none", color: "#f0c040", fontSize: 13, fontWeight: 700 }}>Daily</Link>
            <Link href="/library" style={{ textDecoration: "none", color: "#b895ff", fontSize: 13, fontWeight: 700 }}>Library</Link>
            <AccountMenu />
          </div>
        </header>

        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 56px" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
            {ALL_WORLDS.map((world, index) => (
              <button
                key={world.id}
                onClick={() => handleWorldChange(index)}
                style={{
                  border: index === worldIndex ? `1px solid ${world.accentColor}` : "1px solid rgba(255,255,255,0.08)",
                  background: index === worldIndex ? `${world.accentColor}20` : "rgba(255,255,255,0.04)",
                  color: index === worldIndex ? "white" : "rgba(240,232,216,0.62)",
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                W{world.number} / {world.title}
              </button>
            ))}
          </div>

          <div className="status-strip" style={{
            background: "rgba(10,5,28,0.82)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "14px 20px",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 0,
            flexWrap: "wrap",
          }}>
            {/* Rig status */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 20px 6px 0" }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: isReady ? "#7ac85a" : "#f0c040",
                boxShadow: isReady ? "0 0 8px #7ac85a99" : "0 0 8px #f0c04099",
              }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: isReady ? "#7ac85a" : "#f0c040", lineHeight: 1 }}>
                  {isReady ? "Rig ready" : "Setup pending"}
                </div>
                <div style={{ fontSize: 11, color: "rgba(200,180,140,0.42)", marginTop: 3 }}>
                  mic · tuner · audio
                </div>
              </div>
              <Link href="/setup" style={{ textDecoration: "none", fontSize: 11, color: "rgba(200,180,140,0.45)", fontWeight: 700, marginLeft: 4 }}>
                Setup →
              </Link>
            </div>

            <div className="status-divider" style={{ width: 1, height: 36, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

            {/* Sessions this week */}
            <div style={{ padding: "6px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{summary.recent7Count}</div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(200,180,140,0.45)", marginTop: 3 }}>RUNS / WEEK</div>
            </div>

            <div className="status-divider" style={{ width: 1, height: 36, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

            {/* Streak */}
            <div style={{ padding: "6px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1, color: summary.streakDays > 0 ? "#f0c040" : "#f0e8d8" }}>
                {summary.streakDays}
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(200,180,140,0.45)", marginTop: 3 }}>DAY STREAK</div>
            </div>

            <div className="status-divider" style={{ width: 1, height: 36, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

            {/* Avg accuracy */}
            <div style={{ padding: "6px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{summary.avgAccuracy}%</div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(200,180,140,0.45)", marginTop: 3 }}>AVG ACCURACY</div>
            </div>

            <div className="status-divider" style={{ width: 1, height: 36, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

            {/* Coaching focus */}
            <div style={{ padding: "6px 20px", flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(200,180,140,0.45)", marginBottom: 3 }}>COACHING FOCUS</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{summary.recommendedFocus}</div>
            </div>

            {/* Daily shortcut */}
            <Link href="/daily" style={{
              textDecoration: "none",
              borderRadius: 12,
              background: "rgba(240,192,60,0.08)",
              border: "1px solid rgba(240,192,60,0.18)",
              color: "#f0c040",
              fontSize: 12,
              fontWeight: 800,
              padding: "10px 14px",
              flexShrink: 0,
              marginLeft: "auto",
            }}>
              Daily →
            </Link>
          </div>

          <section style={{ marginBottom: 18 }}>
            <div style={{ background: "rgba(10,5,28,0.82)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "18px 20px", boxShadow: "0 18px 48px rgba(0,0,0,0.3)" }}>
              <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.48)", marginBottom: 6 }}>SONG-FEEL COLLECTIONS</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900 }}>Use worlds for progression, library packs for mood</div>
                </div>
                <Link href="/library" style={{ textDecoration: "none", color: "#b895ff", fontSize: 13, fontWeight: 700 }}>Open library</Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
                {featuredCollections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => router.push("/library")}
                    style={{
                      textAlign: "left",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                      borderRadius: 18,
                      padding: "16px 16px 15px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: collection.accentColor, marginBottom: 6 }}>{collection.subtitle.toUpperCase()}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>{collection.title}</div>
                    <div style={{ color: "rgba(240,232,216,0.6)", fontSize: 12, lineHeight: 1.55, marginBottom: 10 }}>{collection.description}</div>
                    <div style={{ color: "rgba(200,180,140,0.45)", fontSize: 11, fontWeight: 700 }}>{collection.drillIds.length} drills</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="practice-layout" style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "start" }}>
            <div style={{ flex: "1 1 470px", minWidth: 320, display: "grid", gap: 16 }}>
              <div style={{ background: "rgba(10,5,28,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: 22, boxShadow: "0 18px 48px rgba(0,0,0,0.32)" }}>
                <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: activeWorld.accentColor, marginBottom: 6 }}>WORLD {activeWorld.number}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900, marginBottom: 8 }}>{activeWorld.title}</div>
                    <div style={{ color: "rgba(240,232,216,0.68)", fontSize: 13, lineHeight: 1.65, maxWidth: 560 }}>{activeWorld.description}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, minWidth: 230 }}>
                    <InfoStat label="Completed" value={`${worldDoneCount}/${activeWorld.levels.length}`} />
                    <InfoStat label="World Stars" value={`${activeWorld.levels.reduce((sum, level) => sum + getBestStars(level.id), 0)}/${activeWorld.levels.length * 3}`} />
                  </div>
                </div>
              </div>

              <div style={{ background: "rgba(10,5,28,0.84)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: 18, boxShadow: "0 18px 48px rgba(0,0,0,0.32)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.48)", marginBottom: 6 }}>LEVELS</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900 }}>Choose your next drill</div>
                  </div>
                  <button
                    onClick={() => setSelectedLevelIndex(nextRecommendedIndex)}
                    style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#f0e8d8", padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}
                  >
                    Jump to recommendation
                  </button>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {activeWorld.levels.map((level, index) => (
                    <LevelRow
                      key={level.id}
                      level={level}
                      index={index}
                      selected={selectedLevelIndex === index}
                      unlocked={isUnlocked(index, levelIds)}
                      stars={getBestStars(level.id)}
                      onSelect={() => setSelectedLevelIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="practice-map-sidebar" style={{ flex: "0 0 390px", width: "100%", maxWidth: 390, display: "grid", gap: 16, margin: "0 auto" }}>
              <div style={{ background: "rgba(10,5,28,0.82)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: 18, boxShadow: "0 18px 48px rgba(0,0,0,0.32)" }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: activeWorld.accentColor, marginBottom: 6 }}>PATH VIEW</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900 }}>Compact route map</div>
                </div>
                <div style={{ borderRadius: 22, background: "linear-gradient(180deg, rgba(18,10,40,0.98), rgba(11,7,24,0.98))", border: "1px solid rgba(255,255,255,0.06)", padding: "14px 10px 8px", height: 500, overflow: "hidden" }}>
                  <WorldMap world={activeWorld} selectedIndex={selectedLevelIndex} onNodeSelect={setSelectedLevelIndex} />
                </div>
              </div>

              <div style={{ background: "rgba(10,5,28,0.88)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: 18, boxShadow: "0 18px 48px rgba(0,0,0,0.32)" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: activeWorld.accentColor, marginBottom: 6 }}>SELECTED LEVEL</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 900, marginBottom: 6 }}>{activeLevel.title}</div>
                {activeLevel.subtitle && <div style={{ color: "rgba(240,232,216,0.64)", fontSize: 13, marginBottom: 12 }}>{activeLevel.subtitle}</div>}
                <div style={{ color: "rgba(240,232,216,0.74)", fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{activeLevel.description}</div>
                {activeLevel.focus && (
                  <div style={{ marginBottom: 14, borderRadius: 16, padding: "12px 14px", background: "rgba(58,122,107,0.12)", border: "1px solid rgba(58,122,107,0.18)", color: "#b7e6dd", fontSize: 13, lineHeight: 1.6 }}>
                    Technique goal: {activeLevel.focus}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginBottom: 10 }}>
                  <InfoStat label="Tempo" value={`${activeLevel.bpm} BPM`} />
                  <InfoStat label="Notes" value={String(activeLevel.notes.length)} />
                  <InfoStat label="Difficulty" value={(activeLevel.difficulty ?? "medium").toUpperCase()} accent={DIFFICULTY_COLOR[activeLevel.difficulty ?? "medium"]} />
                  <InfoStat label="Stars" value={`${bestStars}/3`} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <LevelSparkline levelId={activeLevel.id} />
                </div>

                {worldSessions.length > 0 && (
                  <div style={{ marginBottom: 16, borderRadius: 18, padding: "14px 14px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: "rgba(200,180,140,0.48)", marginBottom: 8 }}>RECENT WORLD RUNS</div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {worldSessions.map((session) => (
                        <div key={session.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, fontSize: 12, color: "rgba(240,232,216,0.68)" }}>
                          <span>{session.levelTitle}</span>
                          <span style={{ color: "#f0c040", fontWeight: 800 }}>{session.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleStartLevel(activeLevel)}
                  disabled={!levelUnlocked}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: 16,
                    background: levelUnlocked ? `linear-gradient(135deg, ${activeWorld.accentColor}, ${activeWorld.accentColor}aa)` : "rgba(255,255,255,0.08)",
                    color: levelUnlocked ? "white" : "rgba(255,255,255,0.35)",
                    padding: "14px 18px",
                    fontWeight: 800,
                    cursor: levelUnlocked ? "pointer" : "not-allowed",
                    boxShadow: levelUnlocked ? `0 8px 24px ${activeWorld.accentColor}33` : "none",
                  }}
                >
                  {levelUnlocked ? `Start Level ${selectedLevelIndex + 1}` : "Finish previous level first"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
