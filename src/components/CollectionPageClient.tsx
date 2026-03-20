"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import AccountMenu from "@/components/AccountMenu";
import LibraryDrillCard from "@/components/LibraryDrillCard";
import { useFavoriteDrills } from "@/hooks/useFavoriteDrills";
import { useProgress } from "@/hooks/useProgress";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import type { DrillCatalogEntry, DrillCollection } from "@/types/library";

function normalizeLevelId(levelId: string) {
  return levelId.split("__")[0] ?? levelId;
}

export default function CollectionPageClient({
  collection,
  entries,
}: {
  collection: DrillCollection;
  entries: DrillCatalogEntry[];
}) {
  const router = useRouter();
  const { getBestStars, isCompleted } = useProgress();
  const { favorites, isFavorite, toggleFavorite } = useFavoriteDrills();
  const { sessions } = useSessionHistory();

  const completionCount = useMemo(
    () => entries.filter((entry) => isCompleted(entry.levelId)).length,
    [entries, isCompleted],
  );

  const savedCount = useMemo(
    () => entries.filter((entry) => favorites.includes(entry.levelId)).length,
    [entries, favorites],
  );

  const recentIds = useMemo(() => {
    const seen = new Set<string>();
    for (const session of sessions) {
      const levelId = normalizeLevelId(session.levelId);
      if (entries.some((entry) => entry.levelId === levelId)) seen.add(levelId);
    }
    return seen;
  }, [entries, sessions]);

  const startEntry = entries.find((entry) => !isCompleted(entry.levelId)) ?? entries[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #04020f 0%, #0b0420 22%, #16082e 44%, #1e0818 66%, #0d0410 100%)",
        color: "#f0e8d8",
        fontFamily: "var(--font-body)",
      }}
    >
      <header
        className="app-topbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          gap: 12,
          padding: "14px 22px",
          background: "rgba(6,3,16,0.84)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Link className="ui-nav-link" href="/library" style={{ textDecoration: "none", color: "rgba(240,232,216,0.68)", fontSize: 13, fontWeight: 700 }}>
            {"<-"} Library
          </Link>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 900 }}>{collection.title}</div>
        </div>
        <div className="app-topbar-links">
          <Link className="ui-nav-link" href="/practice" style={{ textDecoration: "none", color: "#c8553d", fontSize: 13, fontWeight: 700 }}>Practice Path</Link>
          <Link className="ui-nav-link" href="/player" style={{ textDecoration: "none", color: "#bfd7ff", fontSize: 13, fontWeight: 700 }}>Player</Link>
          <AccountMenu />
        </div>
      </header>

      <div className="page-padding" style={{ maxWidth: 1180, margin: "0 auto", padding: "34px 22px 72px" }}>
        <section
          className="responsive-split"
          style={{
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div
            className="ui-glow-panel ui-lift-card"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 28,
              padding: "28px 28px 26px",
              boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "6px 14px", borderRadius: 999, background: `${collection.accentColor}22`, border: `1px solid ${collection.accentColor}44`, fontSize: 11, fontWeight: 800, color: collection.accentColor, letterSpacing: "0.16em" }}>
              {collection.subtitle.toUpperCase()}
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 6vw, 68px)", lineHeight: 0.98, margin: "18px 0 14px", letterSpacing: "-0.04em" }}>
              {collection.title}
            </h1>
            <p style={{ maxWidth: 720, color: "rgba(240,232,216,0.72)", fontSize: 16, lineHeight: 1.7, margin: "0 0 18px" }}>
              {collection.description}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                className="ui-solid-button"
                onClick={() => router.push(`/practice/${startEntry?.levelId}`)}
                style={{
                  border: "none",
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${collection.accentColor}, ${collection.accentColor}aa)`,
                  color: "white",
                  fontSize: 15,
                  fontWeight: 800,
                  padding: "15px 22px",
                  cursor: "pointer",
                }}
              >
                {completionCount === entries.length ? "Replay pack" : "Start this pack"}
              </button>
              <Link className="ui-soft-button" href="/library" style={{ textDecoration: "none", borderRadius: 16, background: "rgba(255,255,255,0.06)", color: "#f0e8d8", fontSize: 15, fontWeight: 700, padding: "15px 22px", border: "1px solid rgba(255,255,255,0.12)" }}>
                Back to library
              </Link>
            </div>
          </div>

          <div
            className="ui-lift-card"
            style={{
              background: "rgba(10,5,28,0.88)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 28,
              padding: 22,
              boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
              display: "grid",
              gap: 10,
            }}
          >
            <CollectionStat label="Drills" value={String(entries.length)} accent={collection.accentColor} />
            <CollectionStat label="Completed" value={`${completionCount}/${entries.length}`} accent="#7ac85a" />
            <CollectionStat label="Saved" value={String(savedCount)} accent="#f0c040" />
            <CollectionStat label="Recent" value={String(recentIds.size)} accent="#6a9ee8" />
          </div>
        </section>

        <section style={{ marginBottom: 18 }}>
          <div className="ui-glow-panel ui-lift-card" style={{ background: "rgba(10,5,28,0.88)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "18px 20px", boxShadow: "0 18px 48px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.5)", marginBottom: 6 }}>WHEN TO USE THIS PACK</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, marginBottom: 10 }}>A focused lane inside the bigger curriculum</div>
            <div style={{ color: "rgba(240,232,216,0.66)", fontSize: 14, lineHeight: 1.7 }}>
              Use this pack when you want a consistent mood or technique focus without bouncing around the whole map. Save the drills you want to keep repeating, then jump back into the world path when you want the structured order again.
            </div>
          </div>
        </section>

        <section>
          <div className="ui-section-head">
            <div className="ui-section-copy">
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.5)", marginBottom: 6 }}>DRILL ORDER</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900 }}>Everything in this collection</div>
              <p>Play top to bottom for a guided mini-run, or just return to the ones that feel best under your fingers.</p>
            </div>
            <div style={{ color: "rgba(240,232,216,0.55)", fontSize: 13 }}>Play them in order or just pick the one that fits today.</div>
          </div>

          <div className="library-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
            {entries.map((entry) => (
              <LibraryDrillCard
                key={entry.levelId}
                entry={entry}
                stars={getBestStars(entry.levelId)}
                completed={isCompleted(entry.levelId)}
                isFavorite={isFavorite(entry.levelId)}
                onToggleFavorite={() => toggleFavorite(entry.levelId)}
                onStart={() => router.push(`/practice/${entry.levelId}`)}
                highlightLabel={recentIds.has(entry.levelId) ? "Recent" : undefined}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function CollectionStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px 15px" }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: accent, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800 }}>{value}</div>
    </div>
  );
}
