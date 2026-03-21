"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AccountMenu from "@/components/AccountMenu";
import LibraryDrillCard from "@/components/LibraryDrillCard";
import {
  allCatalogEntries,
  allGenres,
  allScaleFamilies,
  allTechniques,
  getCatalogEntryByLevelId,
  getCollectionEntries,
  libraryCollections,
} from "@/data/library";
import { useFavoriteDrills } from "@/hooks/useFavoriteDrills";
import { useProgress } from "@/hooks/useProgress";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import type { DrillCatalogEntry } from "@/types/library";

function prettyLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeLevelId(levelId: string) {
  return levelId.split("__")[0] ?? levelId;
}

function recommendationReason(
  entry: DrillCatalogEntry,
  focusText: string,
  recent7Count: number,
  avgAccuracy: number,
) {
  if (recent7Count < 3 && entry.genreTags.includes("warmup")) {
    return "Quick reset";
  }
  if (focusText.includes("string") && entry.techniqueTags.some((tag) => tag === "string-skipping" || tag === "alternate-picking")) {
    return "String focus";
  }
  if ((focusText.includes("pitch") || focusText.includes("phrasing")) && entry.techniqueTags.includes("phrasing")) {
    return "Phrasing";
  }
  if ((focusText.includes("range") || focusText.includes("shift")) && entry.techniqueTags.includes("position-shift")) {
    return "Shift work";
  }
  if (avgAccuracy >= 82 && entry.techniqueTags.includes("speed")) {
    return "Speed ready";
  }
  return "Next step";
}

function CollectionCard({
  title,
  subtitle,
  description,
  accentColor,
  drillCount,
  onOpen,
  onStart,
}: {
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  drillCount: number;
  onOpen: () => void;
  onStart: () => void;
}) {
  return (
    <div
      className="ui-glow-panel ui-lift-card"
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        padding: 20,
        boxShadow: "0 14px 38px rgba(0,0,0,0.28)",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: accentColor, marginBottom: 7 }}>
        {subtitle.toUpperCase()}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
        {title}
      </div>
      <p style={{ color: "rgba(240,232,216,0.66)", fontSize: 13, lineHeight: 1.65, margin: "0 0 12px" }}>
        {description}
      </p>
      <div style={{ color: "rgba(200,180,140,0.45)", fontSize: 11, fontWeight: 700, marginBottom: 14 }}>
        {drillCount} drills
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          className="ui-soft-button"
          onClick={onOpen}
          style={{
            flex: 1,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: "#f0e8d8",
            fontWeight: 700,
            padding: "12px 14px",
            cursor: "pointer",
          }}
        >
          View pack
        </button>
        <button
          className="ui-solid-button"
          onClick={onStart}
          style={{
            flex: 1,
            border: "none",
            borderRadius: 14,
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
            color: "white",
            fontWeight: 800,
            padding: "12px 14px",
            cursor: "pointer",
          }}
        >
          Start pack
        </button>
      </div>
    </div>
  );
}

function LibraryStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px 15px" }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: accent, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function FilterGroup({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(200,180,140,0.48)", letterSpacing: "0.14em", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              className="ui-soft-button"
              key={option}
              onClick={() => setValue(option)}
              style={{
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.1)",
                background: active ? "rgba(200,85,61,0.18)" : "rgba(255,255,255,0.04)",
                color: active ? "#f0e8d8" : "rgba(240,232,216,0.66)",
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {option === "all" ? "All" : prettyLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ShelfSection({
  title,
  eyebrow,
  subtitle,
  entries,
  getStars,
  isCompleted,
  isFavorite,
  onToggleFavorite,
  onStart,
  onSecondary,
  secondaryLabel,
  highlightLabel,
}: {
  title: string;
  eyebrow: string;
  subtitle: string;
  entries: DrillCatalogEntry[];
  getStars: (levelId: string) => number;
  isCompleted: (levelId: string) => boolean;
  isFavorite: (levelId: string) => boolean;
  onToggleFavorite: (levelId: string) => void;
  onStart: (levelId: string) => void;
  onSecondary?: (entry: DrillCatalogEntry) => void;
  secondaryLabel?: string;
  highlightLabel?: (entry: DrillCatalogEntry) => string | undefined;
}) {
  if (!entries.length) return null;

  return (
    <section style={{ marginBottom: 26 }}>
      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.5)", marginBottom: 6 }}>{eyebrow}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900 }}>{title}</div>
        </div>
        <div style={{ color: "rgba(240,232,216,0.55)", fontSize: 13 }}>{subtitle}</div>
      </div>

      <div className="library-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
        {entries.map((entry) => (
          <LibraryDrillCard
            key={entry.levelId}
            entry={entry}
            stars={getStars(entry.levelId)}
            completed={isCompleted(entry.levelId)}
            isFavorite={isFavorite(entry.levelId)}
            onToggleFavorite={() => onToggleFavorite(entry.levelId)}
            onStart={() => onStart(entry.levelId)}
            secondaryActionLabel={secondaryLabel}
            onSecondaryAction={onSecondary ? () => onSecondary(entry) : undefined}
            highlightLabel={highlightLabel?.(entry)}
          />
        ))}
      </div>
    </section>
  );
}

export default function LibraryPage() {
  const router = useRouter();
  const { completed, getBestStars, isCompleted } = useProgress();
  const { favorites, isFavorite, toggleFavorite } = useFavoriteDrills();
  const { sessions, summary } = useSessionHistory();
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string>("all");
  const [activeTechnique, setActiveTechnique] = useState<string>("all");
  const [activeScale, setActiveScale] = useState<string>("all");

  function openFirstCollection(entry: DrillCatalogEntry) {
    const collection = libraryCollections.find((item) => item.id === entry.collectionIds[0]);
    if (collection) router.push(`/library/${collection.slug}`);
  }

  const recentEntries = useMemo(() => {
    const seen = new Set<string>();
    const output: DrillCatalogEntry[] = [];

    for (const session of sessions) {
      const levelId = normalizeLevelId(session.levelId);
      if (seen.has(levelId)) continue;
      seen.add(levelId);
      const entry = getCatalogEntryByLevelId(levelId);
      if (entry) output.push(entry);
      if (output.length === 4) break;
    }

    return output;
  }, [sessions]);

  const favoriteEntries = useMemo(
    () => favorites.map((levelId) => getCatalogEntryByLevelId(levelId)).filter(Boolean) as DrillCatalogEntry[],
    [favorites],
  );

  const recommendedEntries = useMemo(() => {
    const focusText = `${sessions[0]?.focusArea ?? ""} ${summary.recommendedFocus}`.toLowerCase();
    const recentIds = new Set(recentEntries.map((entry) => entry.levelId));
    const completedIds = new Set(completed);

    return [...allCatalogEntries]
      .map((entry) => {
        let score = completedIds.has(entry.levelId) ? -2 : 5;
        if (recentIds.has(entry.levelId)) score -= 3;
        if (favorites.includes(entry.levelId)) score += 1;
        if (summary.recent7Count < 3 && entry.genreTags.includes("warmup")) score += 4;
        if (focusText.includes("string") && entry.techniqueTags.some((tag) => tag === "string-skipping" || tag === "alternate-picking")) score += 3;
        if ((focusText.includes("pitch") || focusText.includes("phrasing") || focusText.includes("resolution")) && entry.techniqueTags.includes("phrasing")) score += 3;
        if ((focusText.includes("range") || focusText.includes("shift")) && entry.techniqueTags.includes("position-shift")) score += 3;
        if ((focusText.includes("speed") || summary.avgAccuracy >= 82) && entry.techniqueTags.includes("speed")) score += 2;
        if (summary.avgAccuracy < 65 && entry.level.difficulty === "easy") score += 2;
        return { entry, score };
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, 4)
      .map(({ entry }) => entry);
  }, [completed, favorites, recentEntries, sessions, summary.avgAccuracy, summary.recent7Count, summary.recommendedFocus]);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return allCatalogEntries.filter((entry) => {
      if (activeGenre !== "all" && !entry.genreTags.includes(activeGenre as never)) return false;
      if (activeTechnique !== "all" && !entry.techniqueTags.includes(activeTechnique as never)) return false;
      if (activeScale !== "all" && entry.scaleFamily !== activeScale) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        entry.level.title,
        entry.level.subtitle,
        entry.level.description,
        entry.level.focus,
        entry.vibeTitle,
        entry.vibeLine,
        entry.sourceTitle,
        entry.sourceAttribution,
        entry.sourceLicense,
        entry.worldTitle,
        entry.genreTags.join(" "),
        entry.techniqueTags.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [activeGenre, activeScale, activeTechnique, query]);

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
          <Link className="ui-nav-link" href="/" style={{ textDecoration: "none", color: "rgba(240,232,216,0.68)", fontSize: 13, fontWeight: 700 }}>
            {"<-"} Home
          </Link>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 900 }}>Song-Feel Library</div>
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
            marginBottom: 22,
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
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "6px 14px", borderRadius: 999, background: "rgba(106,158,232,0.12)", border: "1px solid rgba(106,158,232,0.25)", fontSize: 11, fontWeight: 800, color: "#bfd7ff", letterSpacing: "0.16em" }}>
              ORIGINAL DRILLS + FAMILIAR SONGS.
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 0.98, margin: "18px 0 14px", letterSpacing: "-0.04em" }}>
              Browse drills by
              <br />
              genre feel,
              <br />
              then save the ones
              <br />
              you want to keep.
            </h1>
            <p style={{ maxWidth: 720, color: "rgba(240,232,216,0.72)", fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              The practice path teaches order. The library gives you freedom. Start with curated packs, jump into familiar songs, revisit recent drills, keep your favorites close, and let the app point you toward the next useful run.
            </p>
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
            <LibraryStat label="Drills" value={String(allCatalogEntries.length)} accent="#c8553d" />
            <LibraryStat label="Collections" value={String(libraryCollections.length)} accent="#6a9ee8" />
            <LibraryStat label="Saved" value={String(favoriteEntries.length)} accent="#f0c040" />
            <LibraryStat label="Recent" value={String(recentEntries.length)} accent="#7ac85a" />
          </div>
        </section>

        <section style={{ marginBottom: 26 }}>
          <div className="ui-section-head">
            <div className="ui-section-copy">
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.5)", marginBottom: 6 }}>CURATED COLLECTIONS</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900 }}>Start with a vibe, then open the full pack</div>
              <p>Use these when you want a cleaner visual lane into a sound or mood instead of hunting through everything at once.</p>
            </div>
            <div style={{ color: "rgba(240,232,216,0.55)", fontSize: 13 }}>Each pack now has its own page and drill lineup.</div>
          </div>

          <div className="collection-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
            {libraryCollections.map((collection) => {
              const entries = getCollectionEntries(collection.id);
              const startEntry = entries.find((entry) => !isCompleted(entry.levelId)) ?? entries[0];
              return (
                <CollectionCard
                  key={collection.id}
                  title={collection.title}
                  subtitle={collection.subtitle}
                  description={collection.description}
                  accentColor={collection.accentColor}
                  drillCount={entries.length}
                  onOpen={() => router.push(`/library/${collection.slug}`)}
                  onStart={() => router.push(`/practice/${startEntry?.levelId}`)}
                />
              );
            })}
          </div>
        </section>

        <ShelfSection
          title="Recommended Now"
          eyebrow="SMART PICKS"
          subtitle={summary.recommendedFocus}
          entries={recommendedEntries}
          getStars={getBestStars}
          isCompleted={isCompleted}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onStart={(levelId) => router.push(`/practice/${levelId}`)}
          onSecondary={openFirstCollection}
          secondaryLabel="Pack"
          highlightLabel={(entry) =>
            recommendationReason(
              entry,
              `${sessions[0]?.focusArea ?? ""} ${summary.recommendedFocus}`.toLowerCase(),
              summary.recent7Count,
              summary.avgAccuracy,
            )
          }
        />

        <ShelfSection
          title="Recently Played"
          eyebrow="QUICK RETURN"
          subtitle="Jump back into the drills you touched most recently."
          entries={recentEntries}
          getStars={getBestStars}
          isCompleted={isCompleted}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onStart={(levelId) => router.push(`/practice/${levelId}`)}
          onSecondary={openFirstCollection}
          secondaryLabel="Pack"
          highlightLabel={() => "Recent"}
        />

        <ShelfSection
          title="Saved Drills"
          eyebrow="FAVORITES"
          subtitle="Keep your repeatable warmups and best-feeling drills close."
          entries={favoriteEntries}
          getStars={getBestStars}
          isCompleted={isCompleted}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onStart={(levelId) => router.push(`/practice/${levelId}`)}
          onSecondary={openFirstCollection}
          secondaryLabel="Pack"
          highlightLabel={() => "Saved"}
        />

        <section
          className="ui-glow-panel"
          style={{
            background: "rgba(10,5,28,0.88)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 28,
            padding: 22,
            boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
            marginBottom: 18,
          }}
        >
          <div className="ui-section-head">
            <div className="ui-section-copy">
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.5)", marginBottom: 6 }}>FILTERS</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900 }}>Find drills that feel right today</div>
              <p>Search when you know what you want. Use recommendations and shelves when you want the app to guide the next move.</p>
            </div>
            <div style={{ color: "rgba(240,232,216,0.55)", fontSize: 13 }}>
              Search by vibe, technique, scale family, or genre feel.
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search scale, vibe, technique, or title"
              style={{
                width: "100%",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "#f0e8d8",
                padding: "14px 16px",
                fontSize: 14,
                outline: "none",
              }}
            />

            <FilterGroup
              label="Genre Feel"
              value={activeGenre}
              setValue={setActiveGenre}
              options={["all", ...allGenres]}
            />
            <FilterGroup
              label="Technique"
              value={activeTechnique}
              setValue={setActiveTechnique}
              options={["all", ...allTechniques]}
            />
            <FilterGroup
              label="Scale Family"
              value={activeScale}
              setValue={setActiveScale}
              options={["all", ...allScaleFamilies]}
            />
          </div>
        </section>

        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900 }}>
              {filteredEntries.length} drill{filteredEntries.length === 1 ? "" : "s"} ready
            </div>
            <Link className="ui-nav-link" href="/practice" style={{ color: "#c8553d", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
              Back to Practice Path
            </Link>
          </div>

          <div className="library-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
            {filteredEntries.map((entry) => (
              <LibraryDrillCard
                key={entry.levelId}
                entry={entry}
                stars={getBestStars(entry.levelId)}
                completed={isCompleted(entry.levelId)}
                isFavorite={isFavorite(entry.levelId)}
                onToggleFavorite={() => toggleFavorite(entry.levelId)}
                onStart={() => router.push(`/practice/${entry.levelId}`)}
                secondaryActionLabel="Similar"
                onSecondaryAction={() => {
                  setActiveGenre(entry.genreTags[0] ?? "all");
                  setActiveTechnique(entry.techniqueTags[0] ?? "all");
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
