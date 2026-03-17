"use client";

import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import AccountMenu from "@/components/AccountMenu";
import CloudSyncCallout from "@/components/CloudSyncCallout";
import { usePitchDetection } from "@/hooks/usePitchDetection";
import { useSetupProgress } from "@/hooks/useSetupProgress";

function SetupStep({
  label,
  title,
  body,
  done,
  children,
}: {
  label: string;
  title: string;
  body: string;
  done: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="ui-glow-panel ui-lift-card"
      style={{
        background: "rgba(10,5,28,0.88)",
        border: done ? "1px solid rgba(122,200,90,0.32)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        padding: 22,
        boxShadow: "0 18px 48px rgba(0,0,0,0.28)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: done ? "#7ac85a" : "rgba(200,180,140,0.5)", marginBottom: 6 }}>{label}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900 }}>{title}</div>
        </div>
        <div style={{ borderRadius: 999, padding: "8px 12px", background: done ? "rgba(122,200,90,0.12)" : "rgba(255,255,255,0.05)", color: done ? "#7ac85a" : "rgba(240,232,216,0.65)", fontSize: 12, fontWeight: 800 }}>
          {done ? "Ready" : "Needs check"}
        </div>
      </div>
      <p style={{ color: "rgba(240,232,216,0.66)", fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>{body}</p>
      {children}
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "12px 14px" }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: accent, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

export default function SetupPage() {
  const { progress, isReady, setMicChecked, setTunerChecked, setAudioChecked, reset } = useSetupProgress();
  const { note, volume, isListening, error, start, stop } = usePitchDetection();
  const [countInStatus, setCountInStatus] = useState<"idle" | "playing" | "done">("idle");

  const volumePct = Math.min(100, Math.round(volume * 900));
  const setupPct = Math.round(([progress.micChecked, progress.tunerChecked, progress.audioChecked].filter(Boolean).length / 3) * 100);

  const noteHint = useMemo(() => {
    if (!note) return "Pluck any clean note so the tuner can lock on.";
    return `${note.name} at ${note.frequency.toFixed(1)} Hz`;
  }, [note]);

  async function playCountIn() {
    setCountInStatus("playing");
    try {
      const ctx = new AudioContext();
      const startAt = ctx.currentTime + 0.06;
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? "square" : "triangle";
        osc.frequency.value = i === 0 ? 1100 : 900;
        gain.gain.setValueAtTime(0.0001, startAt + i * 0.45);
        gain.gain.exponentialRampToValueAtTime(0.18, startAt + i * 0.45 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + i * 0.45 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt + i * 0.45);
        osc.stop(startAt + i * 0.45 + 0.16);
      }
      window.setTimeout(() => {
        setCountInStatus("done");
        setAudioChecked(true);
      }, 1900);
      window.setTimeout(() => {
        void ctx.close();
      }, 2300);
    } catch {
      setCountInStatus("idle");
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
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 900 }}>Practice Setup</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Link className="ui-nav-link" href="/player" style={{ textDecoration: "none", color: "#bfd7ff", fontSize: 13, fontWeight: 700 }}>
              Player
            </Link>
            <Link className="ui-nav-link" href="/practice" style={{ textDecoration: "none", color: "#c8553d", fontSize: 13, fontWeight: 700 }}>
              World Map
            </Link>
            <Link className="ui-nav-link" href="/library" style={{ textDecoration: "none", color: "#b895ff", fontSize: 13, fontWeight: 700 }}>
              Library
            </Link>
            <AccountMenu />
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)",
            gap: 20,
            marginBottom: 22,
          }}
        >
          <div className="ui-glow-panel ui-lift-card" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 30, padding: "30px 28px", boxShadow: "0 18px 48px rgba(0,0,0,0.35)" }}>
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "6px 14px", borderRadius: 999, background: "rgba(58,122,107,0.16)", border: "1px solid rgba(58,122,107,0.28)", fontSize: 11, fontWeight: 800, color: "#7bc3b4", letterSpacing: "0.16em" }}>
              GET YOUR RIG READY
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 7vw, 68px)", lineHeight: 0.96, margin: "18px 0 12px", letterSpacing: "-0.04em" }}>
              Make the app feel
              <br />
              reliable before
              <br />
              the first note.
            </h1>
            <p style={{ maxWidth: 640, color: "rgba(240,232,216,0.72)", fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              Check your microphone, make sure the tuner sees a real guitar note, and confirm the count-in is audible. Once this is green, the practice flow should feel much more dependable.
            </p>
          </div>

          <div className="ui-lift-card" style={{ background: "rgba(10,5,28,0.88)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 30, padding: 24, boxShadow: "0 18px 48px rgba(0,0,0,0.35)", display: "grid", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: isReady ? "#7ac85a" : "#f0c040", marginBottom: 8 }}>SETUP STATUS</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900 }}>{isReady ? "Ready to practice" : `${setupPct}% complete`}</div>
              <div style={{ color: "rgba(240,232,216,0.62)", fontSize: 13, marginTop: 8 }}>
                {isReady ? "Your local setup has passed all three checks." : "Finish the three checks below before long practice sessions."}
              </div>
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${setupPct}%`, height: "100%", background: "linear-gradient(90deg, #3a7a6b, #7ac85a)", borderRadius: 999 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
              <StatPill label="Mic" value={progress.micChecked ? "Checked" : "Pending"} accent="#3a7a6b" />
              <StatPill label="Tuner" value={progress.tunerChecked ? "Locked in" : "Pending"} accent="#6a9ee8" />
              <StatPill label="Audio" value={progress.audioChecked ? "Count-in heard" : "Pending"} accent="#f0c040" />
              <StatPill label="Next Step" value={isReady ? "Start a level" : "Finish setup"} accent="#c8553d" />
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="ui-soft-button" href="/practice" style={{ textDecoration: "none", borderRadius: 16, background: isReady ? "linear-gradient(135deg, #c8553d, #a63518)" : "rgba(255,255,255,0.08)", color: "white", padding: "13px 16px", fontWeight: 800 }}>
                Open practice map
              </Link>
              <button onClick={reset} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, background: "rgba(255,255,255,0.04)", color: "#f0e8d8", padding: "13px 16px", fontWeight: 700, cursor: "pointer" }}>
                Reset setup
              </button>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 22 }}>
          <CloudSyncCallout title="Setup works without login, but Google keeps this device work safe" compact />
        </section>

        <section style={{ display: "grid", gap: 18 }}>
          <SetupStep
            label="STEP 1"
            title="Microphone check"
            body="Turn the mic on and strum once. If the level meter jumps into green, the app is hearing the guitar well enough to start."
            done={progress.micChecked}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  if (isListening) stop();
                  else void start();
                }}
                style={{
                  border: "none",
                  borderRadius: 14,
                  background: isListening ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #3a7a6b, #205548)",
                  color: "white",
                  padding: "12px 16px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {isListening ? "Stop mic" : "Start mic"}
              </button>
              <div style={{ flex: "1 1 280px", minWidth: 220 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(200,180,140,0.5)", marginBottom: 8 }}>INPUT LEVEL</div>
                <div style={{ height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${volumePct}%`, height: "100%", background: volumePct > 18 ? "linear-gradient(90deg, #3a7a6b, #7ac85a)" : "linear-gradient(90deg, #c47c2a, #f0c040)", borderRadius: 999 }} />
                </div>
              </div>
              <button
                onClick={() => setMicChecked(true)}
                disabled={volumePct < 18}
                style={{
                  border: "none",
                  borderRadius: 14,
                  background: volumePct >= 18 ? "linear-gradient(135deg, #7ac85a, #4f8b36)" : "rgba(255,255,255,0.08)",
                  color: volumePct >= 18 ? "#091008" : "rgba(255,255,255,0.34)",
                  padding: "12px 16px",
                  fontWeight: 800,
                  cursor: volumePct >= 18 ? "pointer" : "not-allowed",
                }}
              >
                Mark mic good
              </button>
            </div>
            {error && <div style={{ color: "#ff7a59", fontSize: 12, marginTop: 10 }}>{error}</div>}
          </SetupStep>

          <SetupStep
            label="STEP 2"
            title="Tuner lock"
            body="Pluck a single clean note. Once the tuner sees it, save this step so your first practice session starts with a confident signal."
            done={progress.tunerChecked}
          >
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 14, alignItems: "center" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: "#6a9ee8", marginBottom: 8 }}>LIVE TUNER</div>
                <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1, marginBottom: 6 }}>{note?.name ?? "--"}</div>
                <div style={{ color: "rgba(240,232,216,0.6)", fontSize: 13 }}>{noteHint}</div>
              </div>
              <button
                onClick={() => setTunerChecked(true)}
                disabled={!note}
                style={{
                  border: "none",
                  borderRadius: 14,
                  background: note ? "linear-gradient(135deg, #6a9ee8, #3a5a8a)" : "rgba(255,255,255,0.08)",
                  color: note ? "white" : "rgba(255,255,255,0.34)",
                  padding: "12px 16px",
                  fontWeight: 800,
                  cursor: note ? "pointer" : "not-allowed",
                }}
              >
                Save tuner check
              </button>
            </div>
          </SetupStep>

          <SetupStep
            label="STEP 3"
            title="Count-in and output check"
            body="Play a short four-click count-in through the speakers or headphones. If you can hear it clearly, save the output check."
            done={progress.audioChecked}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => void playCountIn()}
                disabled={countInStatus === "playing"}
                style={{
                  border: "none",
                  borderRadius: 14,
                  background: countInStatus === "playing" ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #c47c2a, #8a5218)",
                  color: "white",
                  padding: "12px 16px",
                  fontWeight: 800,
                  cursor: countInStatus === "playing" ? "default" : "pointer",
                }}
              >
                {countInStatus === "playing" ? "Playing count-in..." : "Play count-in"}
              </button>
              <div style={{ color: "rgba(240,232,216,0.66)", fontSize: 13 }}>
                {countInStatus === "done" ? "Count-in played. If it sounded clear, this step is done." : "Best with the same speaker or headphone setup you will practice on."}
              </div>
            </div>
          </SetupStep>
        </section>
      </div>
    </main>
  );
}
