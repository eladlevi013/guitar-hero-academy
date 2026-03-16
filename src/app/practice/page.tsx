"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import world1 from "@/data/world1";
import { World } from "@/types/tab";
import { useProgress } from "@/hooks/useProgress";

// ── Map geometry ──────────────────────────────────────────────────────────────
const NODES = [
  { x: 150, y: 538 }, // Level 1 — bottom center (shifted up to give label room)
  { x: 70,  y: 440 }, // Level 2 — left
  { x: 230, y: 335 }, // Level 3 — right
  { x: 70,  y: 230 }, // Level 4 — left
  { x: 230, y: 125 }, // Level 5 — right
  { x: 150, y: 50  }, // Level 6 — top center
];

const ROAD = [
  "M 150,538",
  "C 150,492 70,492 70,440",
  "C 70,390 230,390 230,335",
  "C 230,284 70,284 70,230",
  "C 70,180 230,180 230,125",
  "C 230,88 150,88 150,50",
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

// SVG padlock — centred on (cx, cy), no emoji rendering issues
function PadLock({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {/* Shackle */}
      <path
        d={`M ${cx - 5},${cy - 1} L ${cx - 5},${cy - 6} A 5,5 0 0 1 ${cx + 5},${cy - 6} L ${cx + 5},${cy - 1}`}
        fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeLinecap="round"
      />
      {/* Body */}
      <rect x={cx - 7} y={cy - 2} width={14} height={10} rx={2.5}
            fill="rgba(255,255,255,0.28)" />
      {/* Keyhole dot */}
      <circle cx={cx} cy={cy + 3} r={1.8} fill="rgba(0,0,0,0.45)" />
    </g>
  );
}

// ── World Map SVG ─────────────────────────────────────────────────────────────
function WorldMap({ world, onNodeClick }: { world: World; onNodeClick: (i: number) => void }) {
  const { isCompleted, isUnlocked, getBestStars } = useProgress();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const levelIds = world.levels.map(l => l.id);
  const themes   = WORLD_THEMES[world.id];
  const R        = 30;

  return (
    <svg
      viewBox="0 0 300 610"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient defs — one per node */}
      <defs>
        {world.levels.map((level, i) => {
          const done    = isCompleted(level.id);
          const locked  = !isUnlocked(i, levelIds);
          const theme   = themes[i];
          return (
            <radialGradient key={i} id={`ng-${world.id}-${i}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%"   stopColor={locked ? "rgba(255,255,255,0.1)" : done ? "#8fd46a" : theme.main} />
              <stop offset="100%" stopColor={locked ? "rgba(255,255,255,0.02)" : done ? "#3d6028" : theme.dark} />
            </radialGradient>
          );
        })}
      </defs>

      {/* ── Road ─────────────────────────────────────────────────────────────── */}
      {/* Outer glow */}
      <path d={ROAD} stroke="rgba(110,40,200,0.22)" strokeWidth="52"
            fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Road body */}
      <path d={ROAD} stroke="rgba(12,5,30,0.98)" strokeWidth="38"
            fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Purple shimmer */}
      <path d={ROAD} stroke="rgba(120,60,200,0.2)" strokeWidth="18"
            fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Gold centre dashes */}
      <path d={ROAD} stroke="rgba(240,192,60,0.16)" strokeWidth="2"
            fill="none" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="10 18" />

      {/* ── Level nodes ──────────────────────────────────────────────────────── */}
      {world.levels.map((level, i) => {
        const done     = isCompleted(level.id);
        const unlocked = isUnlocked(i, levelIds);
        const locked   = !unlocked;
        const theme    = themes[i];
        const stars    = getBestStars(level.id);
        const { x, y } = NODES[i];
        const hovered  = hoveredIdx === i;
        const starStr  = [1, 2, 3].map(s => s <= stars ? "★" : "☆").join("");

        // Labels always below the node, centered — same pattern as every game map
        const labelY = y + R + 13;
        const starsY = y + R + 26;

        const nodeStroke = locked  ? "rgba(255,255,255,0.07)"
                         : done    ? "rgba(92,138,66,0.65)"
                         : hovered ? "rgba(255,255,255,0.55)"
                                   : "rgba(255,255,255,0.22)";

        return (
          <g
            key={level.id}
            style={{ cursor: locked ? "default" : "pointer" }}
            onClick={() => onNodeClick(i)}
            onMouseEnter={() => { if (!locked) setHoveredIdx(i); }}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Glow ring — active nodes only. No CSS scale on <g> (breaks gradient fills). */}
            {!locked && (
              <circle cx={x} cy={y} r={R + (hovered ? 16 : 9)}
                      fill="none"
                      stroke={done ? "rgba(92,138,66,0.35)" : `${theme.main}${hovered ? "44" : "26"}`}
                      strokeWidth={hovered ? 12 : 6} />
            )}

            {/* Drop shadow */}
            <circle cx={x} cy={y + 4} r={R + 2} fill="rgba(0,0,0,0.55)" />

            {/* Node circle */}
            <circle cx={x} cy={y} r={R}
                    fill={`url(#ng-${world.id}-${i})`}
                    stroke={nodeStroke} strokeWidth="2.5" />

            {/* Inner highlight */}
            <ellipse cx={x - 8} cy={y - 10} rx={11} ry={7}
                     fill="rgba(255,255,255,0.17)" />

            {/* Number or checkmark — dy="0.35em" is cross-browser safe */}
            {!locked && (
              <text
                x={x} y={y}
                textAnchor="middle" dy="0.35em"
                fill="white" fontSize="17" fontWeight="900"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", userSelect: "none" }}
              >
                {done ? "✓" : String(i + 1)}
              </text>
            )}

            {/* SVG padlock (locked nodes) — no emoji, always centered */}
            {locked && <PadLock cx={x} cy={y} />}

            {/* Level title — centered below the node */}
            <text
              x={x} y={labelY}
              textAnchor="middle" dominantBaseline="hanging"
              fill={locked ? "rgba(255,255,255,0.25)" : done ? "#6ab857" : theme.main}
              fontSize="11" fontWeight="700"
              style={{ fontFamily: "'Inter', system-ui, sans-serif", userSelect: "none" }}
            >
              {locked
                ? "Locked"
                : level.title.length > 10 ? level.title.slice(0, 10) + "…" : level.title}
            </text>

            {/* Stars — below title, gold when earned */}
            {!locked && (
              <text
                x={x} y={starsY}
                textAnchor="middle" dominantBaseline="hanging"
                fill={stars > 0 ? "#f5c842" : "rgba(255,255,255,0.18)"}
                fontSize="10"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", userSelect: "none" }}
              >
                {starStr}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PracticePage() {
  const router  = useRouter();
  const { isUnlocked } = useProgress();
  const [toast, setToast] = useState<string | null>(null);

  const handleNodeClick = (levelIndex: number) => {
    const levelIds = world1.levels.map(l => l.id);
    if (isUnlocked(levelIndex, levelIds)) {
      router.push(`/practice/${world1.levels[levelIndex].id}`);
    } else {
      setToast(`Complete Level ${levelIndex} first`);
      setTimeout(() => setToast(null), 2200);
    }
  };

  return (
    <div style={{
      height: "100vh", overflow: "hidden",
      display: "flex", flexDirection: "column",
      background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
      fontFamily: "var(--font-inter)",
      position: "relative",
    }}>

      {/* ── Ambient orbs ─────────────────────────────────────────────────────── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", left: "-8%", width: 680, height: 680, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,85,61,0.18) 0%, rgba(160,50,20,0.08) 50%, transparent 75%)" }} />
        <div style={{ position: "absolute", top: "-5%", right: "-10%", width: 580, height: 580, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,40,180,0.16) 0%, rgba(80,20,140,0.07) 50%, transparent 75%)" }} />
        <div style={{ position: "absolute", bottom: "-8%", left: "8%", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(58,122,107,0.14) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.028) 1px, transparent 1px)",
          backgroundSize: "28px 28px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header style={{
          background: "rgba(6,3,16,0.92)", backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(200,85,61,0.18)",
          padding: "0 28px", height: 56, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{
            textDecoration: "none", fontSize: 13, fontWeight: 600,
            color: "rgba(220,196,160,0.55)",
          }}>
            ← Home
          </Link>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: "#c8553d", marginBottom: 1 }}>
              WORLD {world1.number}
            </div>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 900,
              background: "linear-gradient(90deg, #f0e8d8, #c8a882)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {world1.title}
            </span>
          </div>
          <div style={{ width: 60 }} />
        </header>

        {/* ── Map area ─────────────────────────────────────────────────────── */}
        <div style={{
          flex: 1, overflow: "hidden",
          display: "flex", justifyContent: "center", alignItems: "center",
          padding: "16px 24px",
        }}>
          <div style={{
            height: "100%", maxWidth: 360, width: "100%",
            display: "flex", justifyContent: "center", alignItems: "center",
          }}>
            <WorldMap world={world1} onNodeClick={handleNodeClick} />
          </div>
        </div>

        {/* ── Toast ────────────────────────────────────────────────────────── */}
        {toast && (
          <div style={{
            position: "fixed", bottom: 36, left: "50%", transform: "translateX(-50%)",
            background: "rgba(20,8,40,0.95)", backdropFilter: "blur(12px)",
            color: "#f0e8d8", padding: "10px 24px",
            borderRadius: 28, fontSize: 13, fontWeight: 700, zIndex: 100,
            border: "1px solid rgba(200,85,61,0.3)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.55)",
            whiteSpace: "nowrap",
          }}>
            {toast}
          </div>
        )}

      </div>
    </div>
  );
}
