"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AccountMenu from "@/components/AccountMenu";
import { libraryCollections } from "@/data/library";
import { ALL_WORLDS } from "@/data/worlds";
import { useProgress } from "@/hooks/useProgress";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { useSetupProgress } from "@/hooks/useSetupProgress";
import type { Level, World } from "@/types/tab";

const NODES = [
  { x: 150, y: 558 },
  { x: 84, y: 490 },
  { x: 218, y: 422 },
  { x: 84, y: 354 },
  { x: 218, y: 286 },
  { x: 84, y: 218 },
  { x: 218, y: 150 },
  { x: 150, y: 70 },
];

const ROAD = [
  "M 150,558",
  "C 150,524 84,524 84,490",
  "C 84,456 218,456 218,422",
  "C 218,388 84,388 84,354",
  "C 84,320 218,320 218,286",
  "C 218,252 84,252 84,218",
  "C 84,184 218,184 218,150",
  "C 218,110 150,106 150,70",
].join(" ");

const WORLD_THEMES: Record<string, { main: string; dark: string }[]> = {
  world1: [
    { main: "#c8553d", dark: "#9a3821" },
    { main: "#c47c2a", dark: "#8a5218" },
    { main: "#5c8a42", dark: "#3d6028" },
    { main: "#3a7a6b", dark: "#205548" },
    { main: "#3a5a8a", dark: "#1e3a68" },
    { main: "#7a4a8a", dark: "#4e2860" },
    { main: "#c8553d", dark: "#9a3821" },
    { main: "#f0c040", dark: "#8a6a18" },
  ],
  world2: [
    { main: "#1e78c2", dark: "#0e4a82" },
    { main: "#1a6aaa", dark: "#0c3e6e" },
    { main: "#2480c8", dark: "#124e88" },
    { main: "#1e5e9a", dark: "#0c3660" },
    { main: "#2870b8", dark: "#144078" },
    { main: "#1660a0", dark: "#0a3868" },
    { main: "#3b8ed6", dark: "#18588e" },
    { main: "#5aa7f2", dark: "#2b6db0" },
  ],
  world3: [
    { main: "#a83a1e", dark: "#6e2210" },
    { main: "#8a3a20", dark: "#5c1e0a" },
    { main: "#4e2860", dark: "#2a1038" },
    { main: "#7a4a8a", dark: "#4e2860" },
    { main: "#c47c2a", dark: "#8a5218" },
    { main: "#c8553d", dark: "#9a3821" },
    { main: "#ff7a59", dark: "#a63d22" },
    { main: "#f0c040", dark: "#8a6a18" },
  ],
};

const WORLD_IDENTITY: Record<string, {
  aura: string;
  panelBg: string;
  mapBg: string;
  mission: string;
  styleTag: string;
  marker: string;
}> = {
  world1: {
    aura: "radial-gradient(circle at 18% 18%, rgba(255,100,72,0.24) 0%, transparent 52%), radial-gradient(circle at 82% 72%, rgba(255,150,62,0.18) 0%, transparent 48%)",
    panelBg: "linear-gradient(145deg, rgba(38,10,12,0.9), rgba(25,8,14,0.86))",
    mapBg: "linear-gradient(180deg, rgba(40,12,16,0.96), rgba(18,8,14,0.98))",
    mission: "Build fast confidence with songs people already recognize instead of asking them to trust random drills.",
    styleTag: "FIRST SONGS",
    marker: "Familiar melodies first, cleaner pacing, and a more believable entry point for late beginners.",
  },
  world2: {
    aura: "radial-gradient(circle at 15% 20%, rgba(142,91,255,0.24) 0%, transparent 55%), radial-gradient(circle at 86% 68%, rgba(70,210,255,0.15) 0%, transparent 48%)",
    panelBg: "linear-gradient(145deg, rgba(26,10,44,0.9), rgba(14,8,30,0.86))",
    mapBg: "linear-gradient(180deg, rgba(30,10,52,0.96), rgba(12,8,28,0.98))",
    mission: "Keep the songs familiar but add roots, rhythm, and more guitar-specific weight.",
    styleTag: "SONG WEIGHT",
    marker: "Weighted melodies, steadier support notes, and the first study-style material in the path.",
  },
  world3: {
    aura: "radial-gradient(circle at 12% 18%, rgba(255,138,40,0.24) 0%, transparent 55%), radial-gradient(circle at 84% 72%, rgba(255,64,64,0.16) 0%, transparent 48%)",
    panelBg: "linear-gradient(145deg, rgba(46,16,8,0.9), rgba(28,10,12,0.86))",
    mapBg: "linear-gradient(180deg, rgba(54,18,8,0.96), rgba(18,8,12,0.98))",
    mission: "Turn progress into payoff with lead lines, bigger movement, and short solo energy.",
    styleTag: "STAGE LIFT",
    marker: "Chorus lifts, darker lead lines, heavier pulses, and a real mini-solo finish.",
  },
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
      viewBox="0 0 300 620"
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
  const featuredCollections = [
    libraryCollections.find((collection) => collection.id === "familiar-songs"),
    ...libraryCollections.filter((collection) => collection.id !== "familiar-songs"),
  ].filter((collection): collection is (typeof libraryCollections)[number] => Boolean(collection)).slice(0, 3);
  const worldIdentity = WORLD_IDENTITY[activeWorld.id];
  const worldProgress = ALL_WORLDS.map((world) => {
    const cleared = world.levels.filter((level) => isCompleted(level.id)).length;
    const total = world.levels.length;
    return {
      world,
      cleared,
      total,
      pct: Math.round((cleared / total) * 100),
    };
  });

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
        <header className="app-topbar" style={{ height: 60, padding: "0 24px", background: "rgba(6,3,16,0.82)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" style={{ textDecoration: "none", color: "rgba(240,232,216,0.68)", fontSize: 13, fontWeight: 700 }}>&lt;- Home</Link>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 900 }}>Practice Map</div>
          <div className="app-topbar-links">
            <Link className="ui-nav-link" href="/player" style={{ textDecoration: "none", color: "#bfd7ff", fontSize: 13, fontWeight: 700 }}>Player</Link>
            <Link className="ui-nav-link" href="/setup" style={{ textDecoration: "none", color: "#7bc3b4", fontSize: 13, fontWeight: 700 }}>Setup</Link>
            <Link className="ui-nav-link" href="/daily" style={{ textDecoration: "none", color: "#f0c040", fontSize: 13, fontWeight: 700 }}>Daily</Link>
            <Link className="ui-nav-link" href="/library" style={{ textDecoration: "none", color: "#b895ff", fontSize: 13, fontWeight: 700 }}>Library</Link>
            <AccountMenu />
          </div>
        </header>

        <section className="page-padding" style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 56px" }}>
          <div className="mobile-scroll-row" style={{ marginBottom: 18 }}>
            <div className="ui-glow-panel" style={{
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(10,5,28,0.84)",
              boxShadow: "0 14px 34px rgba(0,0,0,0.3)",
              padding: "14px 14px 12px",
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "rgba(200,180,140,0.52)", marginBottom: 10 }}>
                CONNECTED WORLD ROUTE
              </div>
              <div style={{ display: "flex", alignItems: "stretch", gap: 8, flexWrap: "wrap" }}>
                {worldProgress.map(({ world, cleared, total, pct }, index) => {
                  const selected = index === worldIndex;
                  const connectorActive = index < worldProgress.length - 1 && pct >= 60;
                  return (
                    <div key={world.id} style={{ display: "flex", alignItems: "center", flex: "1 1 240px", minWidth: 220 }}>
                      <button
                        onClick={() => handleWorldChange(index)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          border: selected ? `1px solid ${world.accentColor}` : `1px solid ${world.accentColor}55`,
                          background: selected
                            ? `linear-gradient(135deg, ${world.accentColor}44, rgba(255,255,255,0.07))`
                            : `linear-gradient(135deg, ${world.accentColor}1f, rgba(255,255,255,0.03))`,
                          color: "white",
                          borderRadius: 14,
                          padding: "10px 12px",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", color: world.accentColor }}>WORLD {world.number}</div>
                          <div style={{ fontSize: 10, color: "rgba(240,232,216,0.72)", fontWeight: 700 }}>{cleared}/{total}</div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, marginTop: 5 }}>{world.title}</div>
                        <div style={{ fontSize: 10, color: "rgba(240,232,216,0.62)", marginTop: 5 }}>Progress {pct}%</div>
                      </button>
                      {index < worldProgress.length - 1 && (
                        <div style={{
                          width: 22,
                          height: 2,
                          margin: "0 5px",
                          background: connectorActive ? `linear-gradient(90deg, ${world.accentColor}, ${worldProgress[index + 1].world.accentColor})` : "rgba(255,255,255,0.2)",
                          borderRadius: 999,
                          flexShrink: 0,
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
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
            <div className="ui-glow-panel ui-lift-card" style={{ background: "rgba(10,5,28,0.82)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "18px 20px", boxShadow: "0 18px 48px rgba(0,0,0,0.3)" }}>
              <div className="ui-section-head">
              <div className="ui-section-copy">
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.48)", marginBottom: 6 }}>SONG-FEEL COLLECTIONS</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900 }}>Follow the path or jump into a musical lane</div>
                  <p>The worlds now carry the main learning path. The library is where you branch into familiar songs, grooves, or lead-focused moods without losing the structure.</p>
                </div>
                <Link className="ui-nav-link" href="/library" style={{ textDecoration: "none", color: "#b895ff", fontSize: 13, fontWeight: 700 }}>Open library</Link>
              </div>

              <div className="collection-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
                {featuredCollections.map((collection) => (
                  <button
                    className="ui-lift-card"
                    key={collection.id}
                    onClick={() => router.push(`/library/${collection.slug}`)}
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
              <div style={{
                background: `${worldIdentity.aura}, ${worldIdentity.panelBg}`,
                border: `1px solid ${activeWorld.accentColor}44`,
                borderRadius: 28,
                padding: 22,
                boxShadow: `0 18px 48px rgba(0,0,0,0.32), 0 0 0 1px ${activeWorld.accentColor}22 inset`,
              }}>
                <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: activeWorld.accentColor, marginBottom: 6 }}>WORLD {activeWorld.number}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900, marginBottom: 8 }}>{activeWorld.title}</div>
                    <div style={{ color: "rgba(240,232,216,0.68)", fontSize: 13, lineHeight: 1.65, maxWidth: 560 }}>{activeWorld.description}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                      <span style={{ borderRadius: 999, padding: "6px 10px", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", background: `${activeWorld.accentColor}2b`, border: `1px solid ${activeWorld.accentColor}55`, color: "#fff" }}>
                        {worldIdentity.styleTag}
                      </span>
                      <span style={{ borderRadius: 999, padding: "6px 10px", fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(240,232,216,0.82)" }}>
                        {worldIdentity.mission}
                      </span>
                    </div>
                    <div style={{ color: "rgba(240,232,216,0.6)", fontSize: 12, marginTop: 10 }}>{worldIdentity.marker}</div>
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
                <div style={{ borderRadius: 22, background: worldIdentity.mapBg, border: `1px solid ${activeWorld.accentColor}33`, padding: "14px 10px 8px", height: 560, overflow: "hidden" }}>
                  <WorldMap world={activeWorld} selectedIndex={selectedLevelIndex} onNodeSelect={setSelectedLevelIndex} />
                </div>
              </div>

              <div style={{ background: "rgba(10,5,28,0.88)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: 18, boxShadow: "0 18px 48px rgba(0,0,0,0.32)" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: activeWorld.accentColor, marginBottom: 6 }}>SELECTED LEVEL</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 900, marginBottom: 6 }}>{activeLevel.title}</div>
                {activeLevel.subtitle && <div style={{ color: "rgba(240,232,216,0.64)", fontSize: 13, marginBottom: 12 }}>{activeLevel.subtitle}</div>}
                <div style={{ color: "rgba(240,232,216,0.74)", fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{activeLevel.description}</div>
                {activeLevel.focus && (
                  <div style={{ marginBottom: 14, borderRadius: 16, padding: "12px 14px", background: `${activeWorld.accentColor}1f`, border: `1px solid ${activeWorld.accentColor}4a`, color: "#f3ebdd", fontSize: 13, lineHeight: 1.6 }}>
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
