"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import AccountMenu from "@/components/AccountMenu";
import CloudSyncCallout from "@/components/CloudSyncCallout";
import { libraryCollections } from "@/data/library";
import world1 from "@/data/world1";
import world2 from "@/data/world2";
import world3 from "@/data/world3";
import { useProgress } from "@/hooks/useProgress";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { useSetupProgress } from "@/hooks/useSetupProgress";

const ALL_WORLDS = [world1, world2, world3];

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default function Home() {
  const router = useRouter();
  const { completed, isCompleted, isUnlocked, getBestStars } = useProgress();
  const { sessions, summary } = useSessionHistory();
  const { isReady, progress } = useSetupProgress();
  const featuredCollections = libraryCollections.slice(0, 3);

  const stats = useMemo(() => {
    const totalLevels = ALL_WORLDS.reduce((sum, world) => sum + world.levels.length, 0);
    const completedLevels = completed.length;
    const totalStars = ALL_WORLDS.reduce((sum, world) => sum + world.levels.reduce((acc, level) => acc + getBestStars(level.id), 0), 0);
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
  const lastSession = sessions[0] ?? null;

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
      color: "#f0e8d8",
      fontFamily: "var(--font-body)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -120, left: -80, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,85,61,0.18) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", top: 40, right: -140, width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(110,40,180,0.14) 0%, transparent 72%)" }} />
        <div style={{ position: "absolute", bottom: -120, left: "25%", width: 700, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,122,107,0.12) 0%, transparent 74%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          backdropFilter: "blur(14px)",
          background: "rgba(6,3,16,0.78)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 18 }}>Guitar Hero Academy</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/player" style={{ color: "#bfd7ff", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>Player</Link>
            <Link href="/setup" style={{ color: "#7bc3b4", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>Setup</Link>
            <Link href="/daily" style={{ color: "#f0c040", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>Daily</Link>
            <Link href="/practice" style={{ color: "#c8553d", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>World Map</Link>
            <Link href="/library" style={{ color: "#b895ff", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>Library</Link>
            <AccountMenu />
          </div>
        </header>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 24px 28px" }}>
          <div className="hero-grid" style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.25fr) minmax(280px, 0.75fr)",
            gap: 24,
            alignItems: "stretch",
          }}>
            <div style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 28,
              padding: "32px 30px",
              boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
            }}>
              <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "6px 14px", borderRadius: 999, background: "rgba(200,85,61,0.12)", border: "1px solid rgba(200,85,61,0.25)", fontSize: 11, fontWeight: 800, color: "#ff9a7e", letterSpacing: "0.16em" }}>
                PRACTICE THAT SOUNDS LIKE MUSIC
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 7vw, 78px)", lineHeight: 0.98, margin: "18px 0 16px", letterSpacing: "-0.04em" }}>
                Train scales,
                <br />
                phrases, and
                <br />
                guitar technique.
              </h1>
              <p style={{ maxWidth: 650, color: "rgba(240,232,216,0.72)", fontSize: 17, lineHeight: 1.7, margin: 0 }}>
                Real-time pitch detection, synced backing drums, and a structured lead-guitar curriculum across pentatonic, blues, major, modal, interval, and arpeggio practice.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                <button
                  onClick={() => router.push(`/practice/${stats.nextLevel.id}`)}
                  style={{
                    border: "none",
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #c8553d, #a63518)",
                    color: "white",
                    fontSize: 15,
                    fontWeight: 800,
                    padding: "15px 22px",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(200,85,61,0.35)",
                  }}
                >
                  Continue W{stats.nextWorld.number}-L{stats.nextLevelNumber}
                </button>
                <Link href="/practice" style={{ textDecoration: "none", borderRadius: 16, background: "rgba(255,255,255,0.06)", color: "#f0e8d8", fontSize: 15, fontWeight: 700, padding: "15px 22px", border: "1px solid rgba(255,255,255,0.12)" }}>
                  Browse Worlds
                </Link>
                <Link href="/library" style={{ textDecoration: "none", borderRadius: 16, background: "rgba(176,122,232,0.1)", color: "#d4b8ff", fontSize: 15, fontWeight: 700, padding: "15px 22px", border: "1px solid rgba(176,122,232,0.24)" }}>
                  Song-Feel Library
                </Link>
                <Link href="/daily" style={{ textDecoration: "none", borderRadius: 16, background: "rgba(240,192,60,0.08)", color: "#f0c040", fontSize: 15, fontWeight: 700, padding: "15px 22px", border: "1px solid rgba(240,192,60,0.22)" }}>
                  Daily Challenge
                </Link>
              </div>
            </div>

            <div style={{
              background: "rgba(10,5,28,0.88)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 28,
              padding: "24px 22px",
              boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.52)", marginBottom: 6 }}>CURRENT FOCUS</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900 }}>{stats.nextLevel.title}</div>
                <div style={{ color: "#c8553d", fontSize: 12, fontWeight: 700, marginTop: 3 }}>World {stats.nextWorld.number} · Level {stats.nextLevelNumber}</div>
                {stats.nextLevel.subtitle && <div style={{ color: "rgba(240,232,216,0.62)", fontSize: 13, marginTop: 8 }}>{stats.nextLevel.subtitle}</div>}
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 12, color: "rgba(240,232,216,0.72)", lineHeight: 1.6 }}>{stats.nextLevel.description}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                <StatCard label="Technique" value={stats.nextLevel.focus ?? "Lead practice"} />
                <StatCard label="Difficulty" value={DIFFICULTY_LABEL[stats.nextLevel.difficulty ?? "medium"]} />
                <StatCard label="Tempo" value={`${stats.nextLevel.bpm} BPM`} />
                <StatCard label="Best Stars" value={`${getBestStars(stats.nextLevel.id)}/3`} />
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 24px 24px" }}>
          <div className="summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
            <SummaryCard label="Levels Cleared" value={`${stats.completedLevels}/${stats.totalLevels}`} sub={`${completionPct}% complete`} accent="#c8553d" />
            <SummaryCard label="Stars Earned" value={`${stats.totalStars}/${stats.maxStars}`} sub="Best runs saved" accent="#f0c040" />
            <SummaryCard label="Worlds Finished" value={`${stats.completedWorlds}/${ALL_WORLDS.length}`} sub="Curriculum milestones" accent="#3a7a6b" />
            <SummaryCard label="Session Streak" value={`${summary.streakDays} day${summary.streakDays === 1 ? "" : "s"}`} sub={`${summary.recent7Count} runs this week`} accent="#7a4a8a" />
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "4px 24px 20px" }}>
          <CloudSyncCallout />
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "8px 24px 24px" }}>
          <div style={{ background: "rgba(10,5,28,0.84)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "20px 22px", boxShadow: "0 18px 48px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: 18, alignItems: "start" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: isReady ? "#7ac85a" : "#7bc3b4", marginBottom: 6 }}>READY TO PLAY</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, marginBottom: 10 }}>
                  {isReady ? "Your setup is ready" : "One quick setup pass left"}
                </div>
                <div style={{ color: "rgba(240,232,216,0.66)", fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
                  {isReady
                    ? "Mic, tuner, and count-in checks are already saved, so you can jump straight into practice."
                    : "Finish the setup flow once, then the app can open into practice without extra guesswork."}
                </div>
                {!isReady && (
                  <Link href="/setup" style={{ display: "inline-block", textDecoration: "none", borderRadius: 14, background: "rgba(58,122,107,0.14)", color: "#b7e6dd", padding: "12px 16px", fontWeight: 800, border: "1px solid rgba(58,122,107,0.24)" }}>
                    Finish setup
                  </Link>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                <StatCard label="Mic" value={progress.micChecked ? "Checked" : "Pending"} />
                <StatCard label="Tuner" value={progress.tunerChecked ? "Locked" : "Pending"} />
                <StatCard label="Count-In" value={progress.audioChecked ? "Heard" : "Pending"} />
                <StatCard label="Avg Accuracy" value={`${summary.avgAccuracy}%`} />
                <StatCard label="This Week" value={`${summary.recent7Count} runs`} />
                <StatCard label="Last Run" value={lastSession ? `${lastSession.score}%` : "No runs yet"} />
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 24px 72px" }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.52)", marginBottom: 6 }}>GUIDED PRACTICE PATH</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30, margin: 0 }}>Worlds that build real lead-guitar language</h2>
            </div>
            <Link href="/practice" style={{ color: "#c8553d", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Open full world map</Link>
          </div>

          <div className="world-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}>
            {ALL_WORLDS.map((world) => {
              const worldStars = world.levels.reduce((sum, level) => sum + getBestStars(level.id), 0);
              const doneCount = world.levels.filter((level) => isCompleted(level.id)).length;
              const nextInWorld = world.levels.findIndex((level, idx) => isUnlocked(idx, world.levels.map((item) => item.id)) && !isCompleted(level.id));
              return (
                <div key={world.id} style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 22, boxShadow: "0 14px 38px rgba(0,0,0,0.28)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: world.accentColor, marginBottom: 6 }}>WORLD {world.number}</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900 }}>{world.title}</div>
                    </div>
                    <div style={{ minWidth: 64, textAlign: "right", color: "rgba(240,232,216,0.66)", fontSize: 12 }}>
                      {doneCount}/{world.levels.length}
                      <div style={{ color: "rgba(200,180,140,0.42)", fontSize: 10, marginTop: 4 }}>levels done</div>
                    </div>
                  </div>
                  <p style={{ color: "rgba(240,232,216,0.66)", fontSize: 13, lineHeight: 1.65, margin: "0 0 16px" }}>{world.description}</p>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                    {world.levels.slice(0, 3).map((level) => (
                      <span key={level.id} style={{ borderRadius: 999, padding: "6px 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,232,216,0.78)", fontSize: 11, fontWeight: 700 }}>
                        {level.subtitle ?? level.title}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "rgba(200,180,140,0.55)" }}>Best stars: {worldStars}/{world.levels.length * 3}</div>
                    <div style={{ fontSize: 12, color: "rgba(200,180,140,0.55)" }}>{world.levels.length} levels</div>
                  </div>

                  <button
                    onClick={() => router.push(`/practice/${world.levels[Math.max(0, nextInWorld)].id}`)}
                    style={{ width: "100%", border: "none", borderRadius: 14, background: `linear-gradient(135deg, ${world.accentColor}, ${world.accentColor}aa)`, color: "white", fontWeight: 800, padding: "13px 16px", cursor: "pointer" }}
                  >
                    {nextInWorld === -1 ? "Replay World" : `Resume at Level ${nextInWorld + 1}`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 56px" }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.52)", marginBottom: 6 }}>SONG-FEEL LIBRARY</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30, margin: 0 }}>Browse by vibe when you do not want the full path</h2>
            </div>
            <Link href="/library" style={{ color: "#b895ff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Open full library</Link>
          </div>

          <div className="world-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}>
            {featuredCollections.map((collection) => (
              <div key={collection.id} style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 22, boxShadow: "0 14px 38px rgba(0,0,0,0.28)" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: collection.accentColor, marginBottom: 6 }}>{collection.subtitle.toUpperCase()}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, marginBottom: 10 }}>{collection.title}</div>
                <p style={{ color: "rgba(240,232,216,0.66)", fontSize: 13, lineHeight: 1.65, margin: "0 0 16px" }}>{collection.description}</p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {collection.drillIds.slice(0, 3).map((drillId) => (
                    <span key={drillId} style={{ borderRadius: 999, padding: "6px 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,232,216,0.78)", fontSize: 11, fontWeight: 700 }}>
                      {drillId.replace("world", "W").replace("-level", "L")}
                    </span>
                  ))}
                </div>

                <Link href="/library" style={{ display: "inline-block", textDecoration: "none", borderRadius: 14, background: `linear-gradient(135deg, ${collection.accentColor}, ${collection.accentColor}aa)`, color: "white", fontWeight: 800, padding: "13px 16px" }}>
                  Explore this vibe
                </Link>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 12, color: "rgba(200,180,140,0.35)" }}>
            Local-first practice with optional Google backup and sync.
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/practice" style={{ fontSize: 12, color: "rgba(200,180,140,0.35)", textDecoration: "none" }}>World Map</Link>
            <Link href="/library" style={{ fontSize: 12, color: "rgba(200,180,140,0.35)", textDecoration: "none" }}>Library</Link>
            <Link href="/player" style={{ fontSize: 12, color: "rgba(200,180,140,0.35)", textDecoration: "none" }}>Player Hub</Link>
            <Link href="/setup" style={{ fontSize: 12, color: "rgba(200,180,140,0.35)", textDecoration: "none" }}>Setup</Link>
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
      <div style={{ fontSize: 12, color: "rgba(200,180,140,0.5)", marginTop: 8 }}>{sub}</div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(200,180,140,0.48)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 800 }}>{value}</div>
    </div>
  );
}
