"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import world1 from "@/data/world1";
import world2 from "@/data/world2";
import world3 from "@/data/world3";
import { World } from "@/types/tab";
import { useProgress } from "@/hooks/useProgress";

// ── Map geometry — viewBox 360 × 720 ─────────────────────────────────────────
const NODE_POS = [
  { x: 180, y: 648 }, // Level 1
  { x: 78,  y: 524 }, // Level 2
  { x: 282, y: 400 }, // Level 3
  { x: 78,  y: 276 }, // Level 4
  { x: 282, y: 152 }, // Level 5
  { x: 180, y: 44  }, // Level 6
];

const ROAD = [
  "M 180,648",
  "C 180,586 78,586 78,524",
  "C 78,462 282,462 282,400",
  "C 282,338 78,338 78,276",
  "C 78,214 282,214 282,152",
  "C 282,90 180,90 180,44",
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
    { main: "#c47c2a", dark: "#7a4810" },
    { main: "#c8553d", dark: "#8a2820" },
    { main: "#a83a1e", dark: "#6e1808" },
    { main: "#8a1a1a", dark: "#5c0808" },
    { main: "#5c1840", dark: "#380828" },
    { main: "#2c0e50", dark: "#180630" },
  ],
};

// ── SVG road ──────────────────────────────────────────────────────────────────
function MapRoad({ filterId }: { filterId: string }) {
  return (
    <svg viewBox="0 0 360 720" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: "absolute", inset: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={filterId}>
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(110,40,180,0.5)" floodOpacity="0.6" />
        </filter>
        <filter id={`${filterId}-glow`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Outer glow shadow */}
      <path d={ROAD} stroke="rgba(110,40,180,0.3)" strokeWidth="52" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
            filter={`url(#${filterId})`} />
      {/* Road body */}
      <path d={ROAD} stroke="rgba(40,20,70,0.85)" strokeWidth="42" fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
      {/* Road centre lane — subtle lighter stripe */}
      <path d={ROAD} stroke="rgba(110,60,180,0.22)" strokeWidth="26" fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
      {/* Dashed centre line */}
      <path d={ROAD} stroke="rgba(200,85,61,0.18)" strokeWidth="3" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="14 18" />
      {/* Node position rings */}
      {NODE_POS.map(({ x, y }, i) => (
        <circle key={i} cx={x} cy={y} r="36" fill="none"
                stroke="rgba(200,85,61,0.2)" strokeWidth="1.5" />
      ))}
      {/* Decorative diamonds */}
      {[
        { x: 32,  y: 95,  r: 0   }, { x: 328, y: 158, r: 45  },
        { x: 30,  y: 282, r: 15  }, { x: 332, y: 395, r: -20 },
        { x: 32,  y: 498, r: 30  }, { x: 328, y: 548, r: -10 },
        { x: 182, y: 355, r: 0   }, { x: 182, y: 572, r: 45  },
      ].map(({ x, y, r }, i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`} opacity="0.5">
          <polygon points="0,-7 5,0 0,7 -5,0" fill="rgba(200,85,61,0.6)" />
        </g>
      ))}
      {/* Glowing star/orb accents */}
      {[
        { x: 50, y: 188, c: "rgba(110,40,180,0.5)" },
        { x: 312, y: 270, c: "rgba(200,85,61,0.4)" },
        { x: 54, y: 443, c: "rgba(58,122,107,0.5)" },
        { x: 310, y: 476, c: "rgba(196,124,42,0.4)" },
        { x: 188, y: 308, c: "rgba(110,40,180,0.4)" },
      ].map(({ x, y, c }, i) => (
        <g key={i} filter={`url(#${filterId}-glow)`}>
          <circle cx={x} cy={y} r="5" fill={c} />
        </g>
      ))}
    </svg>
  );
}

// ── Single world map ──────────────────────────────────────────────────────────
function WorldMap({ world, onNodeClick }: {
  world: World;
  onNodeClick: (levelIndex: number) => void;
}) {
  const { isCompleted, isUnlocked, getBestStars } = useProgress();
  const levelIds = world.levels.map((l) => l.id);
  const themes   = WORLD_THEMES[world.id];

  return (
    <div style={{
      position: "relative",
      width: "min(80vw, calc((100vh - 180px) / 2))",
      aspectRatio: "360 / 720",
    }}>
      <MapRoad filterId={`ps-${world.id}`} />
      {world.levels.map((level, i) => {
        const pos      = NODE_POS[i];
        const done     = isCompleted(level.id);
        const unlocked = isUnlocked(i, levelIds);
        const locked   = !unlocked;
        const theme    = themes[i];
        const stars    = getBestStars(level.id);
        const leftPct  = (pos.x / 360) * 100;
        const topPct   = (pos.y / 720) * 100;

        const nodeStyle: React.CSSProperties = locked ? {
          background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
          border: "2px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.2)", cursor: "default",
        } : done ? {
          background: "linear-gradient(160deg, #5c8a42 0%, #3d6028 100%)",
          border: "2px solid rgba(92,138,66,0.5)",
          boxShadow: "0 4px 0 #2a4a18, 0 6px 24px rgba(92,138,66,0.45), inset 0 1px 0 rgba(255,255,255,0.28)",
          color: "white", cursor: "pointer",
        } : {
          background: `linear-gradient(160deg, ${theme.main} 0%, ${theme.dark} 100%)`,
          border: "2px solid rgba(255,255,255,0.22)",
          boxShadow: `0 4px 0 ${theme.dark}, 0 8px 28px ${theme.main}55, inset 0 1px 0 rgba(255,255,255,0.32)`,
          color: "white", cursor: "pointer",
          animation: "levelPulse 2s ease-in-out infinite",
        };

        return (
          <div key={level.id} onClick={() => onNodeClick(i)}
            style={{
              position: "absolute", left: `${leftPct}%`, top: `${topPct}%`,
              transform: "translate(-50%, -50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
              zIndex: 10, userSelect: "none",
            }}
          >
            <div style={{
              width: 62, height: 62, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 900, transition: "transform 0.15s",
              ...nodeStyle,
            }}
              onMouseEnter={(e) => { if (!locked) (e.currentTarget as HTMLDivElement).style.transform = "scale(1.12)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
            >
              {done ? "✓" : locked ? "—" : i + 1}
            </div>
            <div style={{
              background: "rgba(8,4,22,0.88)",
              border: `1px solid ${locked ? "rgba(255,255,255,0.08)" : done ? "rgba(92,138,66,0.35)" : `${theme.main}45`}`,
              borderRadius: 10, padding: "3px 9px",
              fontSize: 10, fontWeight: 700,
              color: locked ? "rgba(255,255,255,0.25)" : done ? "#5c8a42" : theme.main,
              whiteSpace: "nowrap", textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
            }}>
              {locked ? "Locked" : level.title}
              {!locked && (
                <div style={{ fontSize: 9, letterSpacing: 1, marginTop: 1 }}>
                  {[1,2,3].map(s => (
                    <span key={s} style={{ color: s <= stars ? (done ? "#5c8a42" : theme.main) : "rgba(255,255,255,0.15)" }}>★</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const WORLDS = [world1, world2, world3];

export default function PracticePage() {
  const router  = useRouter();
  const { isUnlocked, reset } = useProgress();
  const [activeIdx, setActiveIdx] = useState(0);
  const [toast, setToast]         = useState<string | null>(null);

  const activeWorld = WORLDS[activeIdx];

  const handleNodeClick = (levelIndex: number) => {
    const levelIds = activeWorld.levels.map((l) => l.id);
    if (isUnlocked(levelIndex, levelIds)) {
      router.push(`/practice/${activeWorld.levels[levelIndex].id}`);
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
      position: "relative",
    }}>

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-15%", left: "-10%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,85,61,0.14) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: "10%", right: "-8%",
          width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,40,180,0.14) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "20%",
          width: 460, height: 460, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(58,122,107,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>

        {/* ── Header ────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(6,3,16,0.92)", backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(200,85,61,0.18)",
          padding: "0 24px",
          height: 52, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{ textDecoration: "none", fontSize: 13, fontWeight: 600, color: "rgba(200,180,140,0.65)" }}>
            ← Home
          </Link>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#f0e8d8" }}>
            World Map
          </div>
          <button
            onClick={() => {
              if (window.confirm("Reset all progress and star ratings? This cannot be undone.")) {
                reset();
              }
            }}
            style={{
              fontSize: 11, fontWeight: 700, color: "rgba(200,85,61,0.55)",
              background: "transparent", border: "none", cursor: "pointer",
              padding: "4px 8px", borderRadius: 8,
              transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(200,85,61,0.9)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(200,85,61,0.55)")}
          >Reset</button>
        </div>

        {/* ── World tabs ────────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "stretch",
          background: "rgba(6,3,16,0.7)", backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(200,85,61,0.12)",
          flexShrink: 0,
        }}>
          {WORLDS.map((w, i) => {
            const active = i === activeIdx;
            return (
              <button key={w.id} onClick={() => setActiveIdx(i)} style={{
                flex: 1, padding: "10px 0",
                background: active ? "rgba(200,85,61,0.12)" : "transparent",
                border: "none",
                borderBottom: active ? "3px solid #c8553d" : "3px solid transparent",
                cursor: "pointer",
                transition: "all .15s",
              }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: active ? "#c8553d" : "rgba(200,160,100,0.35)", letterSpacing: "0.18em", marginBottom: 2 }}>
                  WORLD {w.number}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#f0e8d8" : "rgba(200,180,140,0.35)", fontFamily: "var(--font-display)" }}>
                  {w.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Map ───────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 24px 48px" }}>
          <WorldMap world={activeWorld} onNodeClick={handleNodeClick} />
        </div>

        {/* ── Toast ─────────────────────────────────────────────────── */}
        {toast && (
          <div style={{
            position: "fixed", bottom: 36, left: "50%", transform: "translateX(-50%)",
            background: "rgba(20,8,40,0.95)", backdropFilter: "blur(12px)",
            color: "#f0e8d8", padding: "10px 22px",
            borderRadius: 28, fontSize: 13, fontWeight: 700, zIndex: 100,
            border: "1px solid rgba(200,85,61,0.25)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
          }}>
            {toast}
          </div>
        )}

      </div>
    </div>
  );
}
