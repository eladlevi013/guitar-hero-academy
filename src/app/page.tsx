"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import world1 from "@/data/world1";
import world2 from "@/data/world2";
import world3 from "@/data/world3";
import { useProgress } from "@/hooks/useProgress";

const ALL_WORLDS = [world1, world2, world3];

const WORLD_META: Record<string, {
  accent: string; diffLabel: string; diffColor: string; levelColors: string[];
}> = {
  world1: {
    accent: "#c8553d", diffLabel: "Beginner", diffColor: "#5c8a42",
    levelColors: ["#c8553d","#c47c2a","#5c8a42","#3a7a6b","#3a5a8a","#7a4a8a"],
  },
  world2: {
    accent: "#3a7a6b", diffLabel: "Hard", diffColor: "#c47c2a",
    levelColors: ["#3a7a6b","#3a5a8a","#7a4a8a","#c8553d","#8a3a20","#c8553d"],
  },
  world3: {
    accent: "#c8553d", diffLabel: "Extreme", diffColor: "#c8553d",
    levelColors: ["#c47c2a","#c8553d","#a83a1e","#8a1a1a","#5c1840","#2c0e50"],
  },
};

export default function Home() {
  const router = useRouter();
  const { isCompleted, isUnlocked } = useProgress();

  // ── Avoid hydration mismatch: localStorage is only available client-side ──
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Find the next level to continue
  let continueId = world1.levels[0].id;
  if (mounted) {
    outer: for (const w of ALL_WORLDS) {
      const ids = w.levels.map(l => l.id);
      for (let i = 0; i < w.levels.length; i++) {
        if (isUnlocked(i, ids) && !isCompleted(w.levels[i].id)) {
          continueId = w.levels[i].id;
          break outer;
        }
      }
    }
  }

  return (
    <main suppressHydrationWarning style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--font-body)",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ── Ambient gradient orbs ──────────────────────────────────── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* Top-left warm red glow */}
        <div style={{
          position: "absolute", top: "-10%", left: "-8%",
          width: 680, height: 680, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,85,61,0.18) 0%, rgba(160,50,20,0.08) 50%, transparent 75%)",
        }} />
        {/* Top-right purple glow */}
        <div style={{
          position: "absolute", top: "-5%", right: "-10%",
          width: 580, height: 580, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,40,180,0.16) 0%, rgba(80,20,140,0.07) 50%, transparent 75%)",
        }} />
        {/* Middle amber accent */}
        <div style={{
          position: "absolute", top: "38%", left: "42%",
          width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,124,42,0.1) 0%, transparent 65%)",
          transform: "translate(-50%, -50%)",
        }} />
        {/* Bottom-left teal glow */}
        <div style={{
          position: "absolute", bottom: "-8%", left: "8%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(58,122,107,0.14) 0%, transparent 70%)",
        }} />
        {/* Bottom-right deep red */}
        <div style={{
          position: "absolute", bottom: "-5%", right: "5%",
          width: 440, height: 440, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,85,61,0.12) 0%, transparent 65%)",
        }} />
        {/* Dot grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.028) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
      </div>

      {/* All content sits above the orbs */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>

      {/* ── Sticky Header ────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(6,3,16,0.92)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(200,85,61,0.18)",
        padding: "0 28px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 900,
          letterSpacing: "0.01em",
          background: "linear-gradient(90deg, #f0e8d8, #c8a882)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>Guitar Hero Academy</span>
        <Link href="/practice" style={{
          fontSize: 13, fontWeight: 700, color: "#c8553d", textDecoration: "none",
          border: "1px solid rgba(200,85,61,0.3)", padding: "5px 14px",
          borderRadius: 20, transition: "background .15s",
        }}>World Map →</Link>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        padding: "96px 24px 112px",
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", gap: 36,
        position: "relative",
      }}>
        {/* Hero glow ring behind title */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -54%)",
          width: 700, height: 380,
          background: "radial-gradient(ellipse, rgba(200,85,61,0.12) 0%, rgba(110,40,180,0.07) 45%, transparent 72%)",
          pointerEvents: "none",
        }} />
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(200,85,61,0.1)", border: "1px solid rgba(200,85,61,0.25)",
          borderRadius: 100, padding: "6px 16px",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#c8553d",
            boxShadow: "0 0 8px #c8553d",
            display: "inline-block",
          }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(200,85,61,0.9)", letterSpacing: "0.18em" }}>
            REAL-TIME PITCH DETECTION
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(46px, 8vw, 90px)",
            fontWeight: 900, lineHeight: 1.04,
            letterSpacing: "-0.03em",
            margin: "0 0 20px",
          }}>
            <span style={{ color: "#f0e8d8" }}>Guitar Hero</span><br />
            <span style={{
              background: "linear-gradient(120deg, #ff6b4a 0%, #c8553d 30%, #c47c2a 65%, #f0c060 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 32px rgba(200,85,61,0.4))",
            }}>Academy</span>
          </h1>
          <p style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "rgba(220,196,160,0.65)",
            maxWidth: 460, margin: "0 auto", lineHeight: 1.75,
          }}>
            Play any note on your guitar. The app listens, detects pitch in real
            time, and scores only what you hit at the right moment.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/practice" style={{
            padding: "16px 38px", borderRadius: 14, fontWeight: 800, fontSize: 16,
            background: "linear-gradient(135deg, #c8553d 0%, #a63518 100%)",
            color: "white", textDecoration: "none",
            boxShadow: "0 4px 0 #7a2410, 0 12px 32px rgba(200,85,61,0.38)",
            letterSpacing: "-0.01em",
          }}>Start Playing</Link>
          <button
            onClick={() => router.push(`/practice/${continueId}`)}
            style={{
              padding: "16px 38px", borderRadius: 14, fontWeight: 700, fontSize: 16,
              background: "rgba(255,255,255,0.06)", color: "#f0e8d8",
              border: "1.5px solid rgba(255,255,255,0.14)", cursor: "pointer",
              backdropFilter: "blur(6px)", letterSpacing: "-0.01em",
            }}
          >Continue →</button>
        </div>

        {/* Stats strip */}
        <div style={{
          display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center",
          marginTop: 8,
        }}>
          {[
            { n: "3", label: "Worlds" },
            { n: "18", label: "Levels" },
            { n: "140", label: "Max BPM" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900,
                background: "linear-gradient(135deg, #f0e8d8, #c8a882)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", lineHeight: 1,
              }}>{s.n}</div>
              <div style={{ fontSize: 11, color: "rgba(220,196,160,0.45)", fontWeight: 600, letterSpacing: "0.1em", marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Thin separator ───────────────────────────────────────── */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 0 }} />

      {/* ── World sections ───────────────────────────────────────── */}
      <div style={{ flex: 1, padding: "56px 0 80px" }}>
        {ALL_WORLDS.map((world, wi) => {
          const meta     = WORLD_META[world.id];
          const levelIds = world.levels.map(l => l.id);

          return (
            <section key={world.id} style={{
              maxWidth: 1020, margin: "0 auto",
              padding: wi === 0 ? "0 24px 52px" : "40px 24px 52px",
              borderTop: wi > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
              position: "relative",
            }}>
              {/* Per-world faint glow */}
              <div style={{
                position: "absolute", top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 600, height: 200,
                background: `radial-gradient(ellipse, ${meta.accent}0f 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />

              {/* World header row */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {/* Accent pill */}
                  <div style={{
                    width: 5, height: 44, borderRadius: 3,
                    background: `linear-gradient(to bottom, ${meta.accent}, ${meta.accent}66)`,
                    flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800,
                        color: "rgba(200,85,61,0.65)", letterSpacing: "0.2em",
                      }}>WORLD {world.number}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 800, letterSpacing: "0.1em",
                        color: meta.diffColor,
                        background: `${meta.diffColor}18`,
                        border: `1px solid ${meta.diffColor}45`,
                        padding: "2px 8px", borderRadius: 20,
                      }}>{meta.diffLabel}</span>
                    </div>
                    <h2 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22, fontWeight: 900, margin: 0,
                      color: "#f0e8d8", lineHeight: 1,
                    }}>{world.title}</h2>
                    <p style={{ fontSize: 12, color: "rgba(220,196,160,0.4)", margin: "4px 0 0", lineHeight: 1.4 }}>
                      {world.description}
                    </p>
                  </div>
                </div>
                <Link href="/practice" style={{
                  fontSize: 13, fontWeight: 700,
                  color: meta.accent, textDecoration: "none",
                  opacity: 0.85, whiteSpace: "nowrap",
                }}>Open Map →</Link>
              </div>

              {/* Level cards */}
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
                {world.levels.map((level, i) => {
                  const done     = mounted && isCompleted(level.id);
                  const unlocked = mounted ? isUnlocked(i, levelIds) : i === 0;
                  const color    = meta.levelColors[i];

                  return (
                    <button
                      key={level.id}
                      onClick={() => router.push(`/practice/${level.id}`)}
                      disabled={!unlocked}
                      style={{
                        minWidth: 154, padding: "14px 14px",
                        background: unlocked
                          ? `linear-gradient(145deg, rgba(255,255,255,0.07) 0%, ${color}10 100%)`
                          : "rgba(255,255,255,0.02)",
                        borderRadius: 14, flexShrink: 0,
                        border: `1px solid ${unlocked ? `${color}28` : "rgba(255,255,255,0.04)"}`,
                        borderTop: `3px solid ${unlocked ? color : "rgba(255,255,255,0.07)"}`,
                        cursor: unlocked ? "pointer" : "not-allowed",
                        opacity: unlocked ? 1 : 0.32,
                        textAlign: "left",
                        transition: "transform 0.15s, background 0.15s, box-shadow 0.15s",
                        outline: "none",
                      }}
                      onMouseEnter={e => {
                        if (!unlocked) return;
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.background = `linear-gradient(145deg, rgba(255,255,255,0.11) 0%, ${color}1a 100%)`;
                        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${color}30`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.background = unlocked
                          ? `linear-gradient(145deg, rgba(255,255,255,0.07) 0%, ${color}10 100%)`
                          : "rgba(255,255,255,0.02)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{
                        fontSize: 9, fontWeight: 800, letterSpacing: "0.12em",
                        color: unlocked ? color : "rgba(255,255,255,0.18)",
                        marginBottom: 6,
                      }}>
                        {unlocked ? `LEVEL ${i + 1}` : "LOCKED"}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700,
                        color: unlocked ? "#f0e8d8" : "rgba(255,255,255,0.18)",
                        lineHeight: 1.3, marginBottom: 5,
                      }}>
                        {level.title}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>
                        {level.notes.length} notes · {level.bpm} BPM
                      </div>
                      <div style={{
                        marginTop: 10, fontSize: 13, letterSpacing: 3,
                        color: done ? color : "rgba(255,255,255,0.07)",
                      }}>★★★</div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{
        background: "linear-gradient(180deg, rgba(6,3,16,0.0) 0%, rgba(6,3,16,0.97) 12%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "44px 24px",
        display: "flex", justifyContent: "center",
        gap: "clamp(24px, 5vw, 80px)", flexWrap: "wrap",
      }}>
        {[
          { icon: "🎸", title: "Real-time pitch",      desc: "YIN algorithm, works with acoustic & electric guitar" },
          { icon: "🎯", title: "Rhythm scoring",       desc: "Only counts if you hit the right note at the right time" },
          { icon: "🏆", title: "3 worlds · 18 levels", desc: "From beginner open strings to 140 BPM speed runs" },
        ].map(f => (
          <div key={f.title} style={{ textAlign: "center", maxWidth: 200 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#f0e8d8", fontSize: 14, marginBottom: 5 }}>
              {f.title}
            </div>
            <div style={{ fontSize: 12, color: "rgba(220,196,160,0.5)", lineHeight: 1.65 }}>{f.desc}</div>
          </div>
        ))}
      </footer>
      </div>{/* /zIndex wrapper */}
    </main>
  );
}
