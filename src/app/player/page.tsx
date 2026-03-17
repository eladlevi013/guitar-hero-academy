"use client";

import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import world1 from "@/data/world1";
import world2 from "@/data/world2";
import world3 from "@/data/world3";
import { ALL_ACHIEVEMENTS, useAchievements } from "@/hooks/useAchievements";
import { usePracticeSettings } from "@/hooks/usePracticeSettings";
import { useProgress } from "@/hooks/useProgress";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { useSetupProgress } from "@/hooks/useSetupProgress";

const ALL_WORLDS = [world1, world2, world3];

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        background: "rgba(10,5,28,0.88)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        padding: 22,
        boxShadow: "0 18px 48px rgba(0,0,0,0.28)",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.5)", marginBottom: 6 }}>{eyebrow}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 16 }}>{title}</div>
      {children}
    </section>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px 15px" }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: accent ?? "rgba(200,180,140,0.48)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function PlayerPage() {
  const { completed, getBestStars, reset: resetProgress } = useProgress();
  const { unlocked } = useAchievements();
  const { sessions, summary } = useSessionHistory();
  const { progress, isReady, reset: resetSetup } = useSetupProgress();
  const { settings, setMode, setDrumVolume, setTimingOffsetMs, reset: resetSettings } = usePracticeSettings();
  const [previewStatus, setPreviewStatus] = useState<"idle" | "playing" | "done">("idle");

  const totals = useMemo(() => {
    const totalLevels = ALL_WORLDS.reduce((sum, world) => sum + world.levels.length, 0);
    const totalStars = ALL_WORLDS.reduce((sum, world) => sum + world.levels.reduce((acc, level) => acc + getBestStars(level.id), 0), 0);
    return { totalLevels, totalStars, maxStars: totalLevels * 3 };
  }, [getBestStars]);

  const topFocusAreas = useMemo(() => {
    const focusCounts = new Map<string, number>();
    sessions.forEach((session) => {
      focusCounts.set(session.focusArea, (focusCounts.get(session.focusArea) ?? 0) + 1);
    });
    return [...focusCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [sessions]);

  async function playPreview() {
    setPreviewStatus("playing");
    try {
      const ctx = new AudioContext();
      const startAt = ctx.currentTime + 0.05;
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? "square" : "triangle";
        osc.frequency.value = i === 0 ? 1020 : 860;
        gain.gain.setValueAtTime(0.0001, startAt + i * 0.42);
        gain.gain.exponentialRampToValueAtTime(0.16, startAt + i * 0.42 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + i * 0.42 + 0.11);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt + i * 0.42);
        osc.stop(startAt + i * 0.42 + 0.14);
      }
      window.setTimeout(() => setPreviewStatus("done"), 1700);
      window.setTimeout(() => {
        void ctx.close();
      }, 2100);
    } catch {
      setPreviewStatus("idle");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
        color: "#f0e8d8",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "28px 22px 72px" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <Link href="/" style={{ textDecoration: "none", color: "rgba(240,232,216,0.68)", fontSize: 13, fontWeight: 700 }}>
            {"<-"} Home
          </Link>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 900 }}>Player Hub</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/setup" style={{ textDecoration: "none", color: "#7bc3b4", fontSize: 13, fontWeight: 700 }}>Setup</Link>
            <Link href="/practice" style={{ textDecoration: "none", color: "#c8553d", fontSize: 13, fontWeight: 700 }}>Practice</Link>
          </div>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)", gap: 20, marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: "30px 28px", boxShadow: "0 18px 48px rgba(0,0,0,0.35)" }}>
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "6px 14px", borderRadius: 999, background: "rgba(106,158,232,0.14)", border: "1px solid rgba(106,158,232,0.24)", fontSize: 11, fontWeight: 800, color: "#bfd7ff", letterSpacing: "0.16em" }}>
              LOCAL PLAYER PROFILE
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 7vw, 68px)", lineHeight: 0.96, margin: "18px 0 12px", letterSpacing: "-0.04em" }}>
              Tune your rig,
              <br />
              track your growth,
              <br />
              keep the feel tight.
            </h1>
            <p style={{ maxWidth: 640, color: "rgba(240,232,216,0.72)", fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              This is the local value worth syncing later: your calibration, best runs, setup readiness, and the patterns showing up in your practice.
            </p>
          </div>

          <div style={{ background: "rgba(10,5,28,0.88)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: 22, boxShadow: "0 18px 48px rgba(0,0,0,0.35)", display: "grid", gap: 10 }}>
            <MiniStat label="Levels Cleared" value={`${completed.length}/${totals.totalLevels}`} accent="#c8553d" />
            <MiniStat label="Stars Banked" value={`${totals.totalStars}/${totals.maxStars}`} accent="#f0c040" />
            <MiniStat label="Practice Streak" value={`${summary.streakDays} day${summary.streakDays === 1 ? "" : "s"}`} accent="#7a4a8a" />
            <MiniStat label="Achievements" value={`${unlocked.length}/${ALL_ACHIEVEMENTS.length}`} accent="#7ac85a" />
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 18, marginBottom: 18 }}>
          <Panel eyebrow="TIMING" title="Calibration">
            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ color: "rgba(240,232,216,0.66)", fontSize: 14, lineHeight: 1.65 }}>
                If the notes feel early or late on this device, adjust the sync offset here. Positive values delay the note rail to match what you hear.
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={10}
                    value={settings.timingOffsetMs}
                    onChange={(e) => setTimingOffsetMs(parseInt(e.target.value, 10))}
                    style={{ width: 220, accentColor: "#c8553d", cursor: "pointer" }}
                  />
                  <div style={{ minWidth: 80, fontSize: 15, fontWeight: 800 }}>{settings.timingOffsetMs > 0 ? `+${settings.timingOffsetMs}` : settings.timingOffsetMs} ms</div>
                  <button onClick={() => setTimingOffsetMs(0)} style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#f0e8d8", padding: "10px 12px", fontWeight: 700, cursor: "pointer" }}>
                    Reset offset
                  </button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[-60, -30, 0, 30, 60].map((offset) => (
                    <button key={offset} onClick={() => setTimingOffsetMs(offset)} style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", background: settings.timingOffsetMs === offset ? "rgba(200,85,61,0.18)" : "rgba(255,255,255,0.04)", color: "#f0e8d8", padding: "8px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      {offset > 0 ? `+${offset}` : offset} ms
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => void playPreview()} style={{ border: "none", borderRadius: 14, background: "linear-gradient(135deg, #3a5a8a, #1e3a68)", color: "white", padding: "12px 16px", fontWeight: 800, cursor: "pointer" }}>
                  {previewStatus === "playing" ? "Playing preview..." : "Play timing preview"}
                </button>
                <div style={{ color: "rgba(240,232,216,0.62)", fontSize: 13 }}>
                  {previewStatus === "done" ? "Preview finished. If the click felt early, raise the offset a bit." : "Use the same speaker or headphone setup you practice on."}
                </div>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="READYNESS" title="Practice rig">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 14 }}>
              <MiniStat label="Mic" value={progress.micChecked ? "Checked" : "Pending"} accent="#3a7a6b" />
              <MiniStat label="Tuner" value={progress.tunerChecked ? "Locked" : "Pending"} accent="#6a9ee8" />
              <MiniStat label="Audio" value={progress.audioChecked ? "Clear" : "Pending"} accent="#f0c040" />
            </div>
            <div style={{ color: "rgba(240,232,216,0.68)", fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
              {isReady ? "This device is already marked ready for practice." : "Finish the setup flow once and this page becomes your quick health check before a session."}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/setup" style={{ textDecoration: "none", borderRadius: 14, background: "rgba(58,122,107,0.14)", color: "#b7e6dd", padding: "12px 15px", fontWeight: 800, border: "1px solid rgba(58,122,107,0.24)" }}>
                Open setup flow
              </Link>
              <button onClick={resetSetup} style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f0e8d8", padding: "12px 15px", fontWeight: 700, cursor: "pointer" }}>
                Reset setup
              </button>
            </div>
          </Panel>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: 18, marginBottom: 18 }}>
          <Panel eyebrow="PREFERENCES" title="Session defaults">
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(200,180,140,0.48)", letterSpacing: "0.14em", marginBottom: 8 }}>DEFAULT MODE</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(["timed", "practice"] as const).map((mode) => (
                    <button key={mode} onClick={() => setMode(mode)} style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: settings.mode === mode ? "rgba(200,85,61,0.18)" : "rgba(255,255,255,0.04)", color: "#f0e8d8", padding: "10px 12px", fontWeight: 700, cursor: "pointer" }}>
                      {mode === "timed" ? "Timed mode" : "Practice mode"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(200,180,140,0.48)", letterSpacing: "0.14em", marginBottom: 8 }}>DRUM VOLUME</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input type="range" min={0} max={1} step={0.05} value={settings.drumVolume} onChange={(e) => setDrumVolume(parseFloat(e.target.value))} style={{ width: 220, accentColor: "#c8553d", cursor: "pointer" }} />
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{Math.round(settings.drumVolume * 100)}%</div>
                </div>
              </div>
              <button onClick={resetSettings} style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f0e8d8", padding: "12px 15px", fontWeight: 700, cursor: "pointer", width: "fit-content" }}>
                Reset session defaults
              </button>
            </div>
          </Panel>

          <Panel eyebrow="PRACTICE SIGNAL" title="Recent sessions">
            {sessions.length > 0 ? (
              <div style={{ display: "grid", gap: 10 }}>
                {sessions.slice(0, 6).map((session) => (
                  <div key={session.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: 12, alignItems: "center", borderRadius: 16, padding: "13px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{session.levelTitle}</div>
                      <div style={{ fontSize: 12, color: "rgba(240,232,216,0.58)" }}>
                        {session.segmentLabel && session.segmentLabel !== "Full level" ? `${session.segmentLabel} · ` : ""}{session.focusArea} · {formatDate(session.timestamp)}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: session.mode === "timed" ? "#c8553d" : "#3a7a6b" }}>{session.mode}</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: "#f0c040" }}>{session.score}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "rgba(240,232,216,0.66)", fontSize: 14, lineHeight: 1.7 }}>
                Once you finish a few runs, this becomes your local practice log.
              </div>
            )}
          </Panel>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: 18 }}>
          <Panel eyebrow="COACHING" title="Focus patterns">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 14 }}>
              <MiniStat label="This Week" value={`${summary.recent7Count} runs`} accent="#c8553d" />
              <MiniStat label="Avg Accuracy" value={`${summary.avgAccuracy}%`} accent="#f0c040" />
              <MiniStat label="Practice Time" value={`${summary.practiceMinutes} min`} accent="#7ac85a" />
            </div>
            <div style={{ color: "rgba(240,232,216,0.72)", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
              Current coaching focus: {summary.recommendedFocus}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {topFocusAreas.length > 0 ? topFocusAreas.map(([focus, count]) => (
                <div key={focus} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, borderRadius: 14, padding: "11px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{focus}</div>
                  <div style={{ fontSize: 12, color: "rgba(240,232,216,0.54)" }}>{count} session{count === 1 ? "" : "s"}</div>
                </div>
              )) : (
                <div style={{ color: "rgba(240,232,216,0.62)", fontSize: 13 }}>Finish more runs to surface repeated weak spots.</div>
              )}
            </div>
          </Panel>

          <Panel eyebrow="MILESTONES" title="Achievements">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginBottom: 12 }}>
              {ALL_ACHIEVEMENTS.map((achievement) => {
                const earned = unlocked.includes(achievement.id);
                return (
                  <div key={achievement.id} style={{ borderRadius: 16, padding: "12px 13px", background: earned ? "rgba(122,200,90,0.12)" : "rgba(255,255,255,0.03)", border: earned ? "1px solid rgba(122,200,90,0.24)" : "1px solid rgba(255,255,255,0.06)", opacity: earned ? 1 : 0.55 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 18 }}>{achievement.icon}</span>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>{achievement.title}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(240,232,216,0.58)", lineHeight: 1.5 }}>{achievement.description}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={resetProgress} style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f0e8d8", padding: "12px 15px", fontWeight: 700, cursor: "pointer" }}>
                Reset level progress
              </button>
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}
