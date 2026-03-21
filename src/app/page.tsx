"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import FloatingNav from "@/components/FloatingNav";
import { ALL_WORLDS } from "@/data/worlds";
import { useProgress } from "@/hooks/useProgress";
import { useSessionHistory } from "@/hooks/useSessionHistory";

const WORLD_THEME: Record<string, { cardBg: string; aura: string; label: string }> = {
  world1: {
    cardBg: "linear-gradient(145deg, rgba(44,22,8,0.9), rgba(20,10,4,0.86))",
    aura: "radial-gradient(circle at 84% 20%, rgba(232,184,75,0.2), transparent 44%)",
    label: "FIRST SONGS",
  },
  world2: {
    cardBg: "linear-gradient(145deg, rgba(8,20,44,0.9), rgba(4,12,30,0.86))",
    aura: "radial-gradient(circle at 84% 20%, rgba(75,155,232,0.22), transparent 44%)",
    label: "SONG WEIGHT",
  },
  world3: {
    cardBg: "linear-gradient(145deg, rgba(44,10,10,0.9), rgba(20,6,6,0.86))",
    aura: "radial-gradient(circle at 84% 20%, rgba(200,75,75,0.22), transparent 44%)",
    label: "STAGE LIFT",
  },
};

export default function Home() {
  const router = useRouter();
  const { completed, isCompleted, isUnlocked, getBestStars } = useProgress();
  const { summary } = useSessionHistory();

  const stats = useMemo(() => {
    const totalLevels = ALL_WORLDS.reduce((sum, world) => sum + world.levels.length, 0);
    const completedLevels = completed.length;
    const totalStars = ALL_WORLDS.reduce(
      (sum, world) => sum + world.levels.reduce((worldSum, level) => worldSum + getBestStars(level.id), 0),
      0,
    );
    const maxStars = totalLevels * 3;
    const completedWorlds = ALL_WORLDS.filter((world) => world.levels.every((level) => isCompleted(level.id))).length;

    let nextLevel = ALL_WORLDS[0].levels[0];
    let nextWorld = ALL_WORLDS[0];
    let nextLevelNumber = 1;

    outer: for (const world of ALL_WORLDS) {
      const ids = world.levels.map((level) => level.id);
      for (let idx = 0; idx < world.levels.length; idx++) {
        if (isUnlocked(idx, ids) && !isCompleted(world.levels[idx].id)) {
          nextLevel = world.levels[idx];
          nextWorld = world;
          nextLevelNumber = idx + 1;
          break outer;
        }
      }
    }

    return {
      totalLevels,
      completedLevels,
      totalStars,
      maxStars,
      completedWorlds,
      nextLevel,
      nextWorld,
      nextLevelNumber,
    };
  }, [completed, getBestStars, isCompleted, isUnlocked]);

  const completionPct = Math.round((stats.completedLevels / stats.totalLevels) * 100);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
        color: "#f0e8d8",
        fontFamily: "var(--font-body)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -120, left: -80, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,85,61,0.16) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", top: 40, right: -140, width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(110,40,180,0.12) 0%, transparent 72%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <FloatingNav />

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 24px 28px" }}>
          <div className="hero-grid responsive-split" style={{ gap: 24, alignItems: "stretch" }}>
            <div
              className="ui-glow-panel"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 28,
                padding: "36px 32px",
                boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
              }}
            >
              <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "5px 12px", borderRadius: 999, background: "rgba(200,85,61,0.12)", border: "1px solid rgba(200,85,61,0.25)", fontSize: 11, fontWeight: 800, color: "#ff9a7e", letterSpacing: "0.16em", marginBottom: 18 }}>
                LATE-BEGINNER GUITAR PATH
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 6.5vw, 74px)", lineHeight: 0.98, margin: "0 0 18px", letterSpacing: "-0.04em" }}>
                Play riffs that feel
                <br />
                like music. Follow
                <br />
                a path that pays off.
              </h1>
              <p style={{ maxWidth: 560, color: "rgba(240,232,216,0.7)", fontSize: 16, lineHeight: 1.7, margin: "0 0 28px" }}>
                24 playable levels across three connected worlds. The early path now leans on familiar public-domain songs, then gradually moves into heavier arrangements and lead work.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  className="ui-solid-button"
                  onClick={() => router.push(`/practice/${stats.nextLevel.id}`)}
                  style={{ border: "none", borderRadius: 16, background: "linear-gradient(135deg, #c8553d, #a63518)", color: "white", fontSize: 15, fontWeight: 800, padding: "15px 24px", cursor: "pointer", boxShadow: "0 6px 20px rgba(200,85,61,0.35)" }}
                >
                  {`Continue - W${stats.nextWorld.number}L${stats.nextLevelNumber}`}
                </button>
                <Link className="ui-soft-button" href="/practice" style={{ textDecoration: "none", borderRadius: 16, background: "rgba(255,255,255,0.06)", color: "#f0e8d8", fontSize: 15, fontWeight: 700, padding: "15px 24px", border: "1px solid rgba(255,255,255,0.12)" }}>
                  Open practice path
                </Link>
              </div>
            </div>

            <div
              className="ui-glow-panel"
              style={{
                background: "rgba(10,5,28,0.88)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 28,
                padding: "28px 26px",
                boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.5)", marginBottom: 6 }}>CURRENT FOCUS</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900 }}>{stats.nextLevel.title}</div>
                <div style={{ color: "#c8553d", fontSize: 12, fontWeight: 700, marginTop: 4 }}>{`World ${stats.nextWorld.number} - Level ${stats.nextLevelNumber}`}</div>
                {stats.nextLevel.subtitle && <div style={{ color: "rgba(240,232,216,0.58)", fontSize: 13, marginTop: 8 }}>{stats.nextLevel.subtitle}</div>}
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 14, border: "1px solid rgba(255,255,255,0.06)", fontSize: 13, color: "rgba(240,232,216,0.7)", lineHeight: 1.65 }}>
                {stats.nextLevel.description}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                <MiniStat label="Technique" value={stats.nextLevel.focus ?? "Lead practice"} />
                <MiniStat label="Difficulty" value={stats.nextLevel.difficulty ?? "medium"} />
                <MiniStat label="Tempo" value={`${stats.nextLevel.bpm} BPM`} />
                <MiniStat label="Best Stars" value={`${getBestStars(stats.nextLevel.id)}/3 stars`} />
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 24px" }}>
          <div className="summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
            <SummaryCard label="Levels Cleared" value={`${stats.completedLevels}/${stats.totalLevels}`} sub={`${completionPct}% complete`} accent="#c8553d" />
            <SummaryCard label="Stars Earned" value={`${stats.totalStars}/${stats.maxStars}`} sub="Best runs saved" accent="#f0c040" />
            <SummaryCard label="Worlds Done" value={`${stats.completedWorlds}/${ALL_WORLDS.length}`} sub="Curriculum milestones" accent="#3a7a6b" />
            <SummaryCard label="Week Streak" value={`${summary.streakDays} day${summary.streakDays === 1 ? "" : "s"}`} sub={`${summary.recent7Count} runs this week`} accent="#7a4a8a" />
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "8px 24px 72px" }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.48)", marginBottom: 6 }}>GUIDED PRACTICE PATH</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: 0 }}>Three worlds with one clear musical path</h2>
              <Link href="/practice" style={{ color: "#c8553d", fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                Full world map -&gt;
              </Link>
            </div>
          </div>

          <div className="world-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}>
            {ALL_WORLDS.map((world) => {
              const theme = WORLD_THEME[world.id];
              const worldStars = world.levels.reduce((sum, level) => sum + getBestStars(level.id), 0);
              const doneCount = world.levels.filter((level) => isCompleted(level.id)).length;
              const nextInWorld = world.levels.findIndex(
                (level, idx) => isUnlocked(idx, world.levels.map((item) => item.id)) && !isCompleted(level.id),
              );
              const pct = Math.round((doneCount / world.levels.length) * 100);
              const nextLevelId = world.levels[Math.max(0, nextInWorld)].id;

              return (
                <div
                  className="ui-glow-panel"
                  key={world.id}
                  style={{
                    background: `${theme.aura}, ${theme.cardBg}`,
                    border: `1px solid ${world.accentColor}55`,
                    borderRadius: 24,
                    padding: 22,
                    boxShadow: "0 14px 38px rgba(0,0,0,0.28)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: world.accentColor }}>{`${theme.label} - WORLD ${world.number}`}</div>
                      <div style={{ fontSize: 11, color: "rgba(200,180,140,0.55)" }}>{doneCount}/{world.levels.length} done</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 900 }}>{world.title}</div>
                  </div>

                  <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ height: "100%", borderRadius: 999, width: `${pct}%`, background: `linear-gradient(90deg, ${world.accentColor}, ${world.accentColor}99)`, transition: "width 0.4s ease" }} />
                  </div>

                  <p style={{ color: "rgba(240,232,216,0.62)", fontSize: 13, lineHeight: 1.65, margin: 0 }}>{world.description}</p>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(200,180,140,0.52)" }}>
                    <span>{`Stars ${worldStars}/${world.levels.length * 3}`}</span>
                    <span>{world.levels.length} levels</span>
                  </div>

                  <button
                    className="ui-solid-button"
                    onClick={() => router.push(`/practice/${nextLevelId}`)}
                    style={{ width: "100%", border: "none", borderRadius: 14, background: `linear-gradient(135deg, ${world.accentColor}, ${world.accentColor}aa)`, color: "white", fontWeight: 800, padding: "13px 16px", cursor: "pointer" }}
                  >
                    {nextInWorld === -1 ? "Replay World" : `Resume - Level ${nextInWorld + 1}`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <footer style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 12, color: "rgba(200,180,140,0.32)" }}>Local-first practice with optional Google backup and sync.</div>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/practice" style={{ fontSize: 12, color: "rgba(200,180,140,0.32)", textDecoration: "none" }}>World Map</Link>
            <Link href="/library" style={{ fontSize: 12, color: "rgba(200,180,140,0.32)", textDecoration: "none" }}>Library</Link>
            <Link href="/daily" style={{ fontSize: 12, color: "rgba(200,180,140,0.32)", textDecoration: "none" }}>Daily</Link>
            <Link href="/setup" style={{ fontSize: 12, color: "rgba(200,180,140,0.32)", textDecoration: "none" }}>Setup</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div style={{ background: "rgba(10,5,28,0.82)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 18 }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: accent, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgba(200,180,140,0.48)", marginTop: 8 }}>{sub}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(200,180,140,0.46)", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 800 }}>{value}</div>
    </div>
  );
}
