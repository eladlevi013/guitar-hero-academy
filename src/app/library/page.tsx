"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AccountMenu from "@/components/AccountMenu";
import {
  allCatalogEntries,
  allGenres,
  allScaleFamilies,
  allTechniques,
  getCollectionEntries,
  libraryCollections,
} from "@/data/library";
import { useProgress } from "@/hooks/useProgress";

function prettyLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function Tag({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "accent" }) {
  return (
    <span
      style={{
        borderRadius: 999,
        padding: "6px 10px",
        background: tone === "accent" ? "rgba(106,158,232,0.14)" : "rgba(255,255,255,0.05)",
        border: tone === "accent" ? "1px solid rgba(106,158,232,0.22)" : "1px solid rgba(255,255,255,0.08)",
        color: tone === "accent" ? "#bfd7ff" : "rgba(240,232,216,0.76)",
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

export default function LibraryPage() {
  const router = useRouter();
  const { getBestStars, isCompleted } = useProgress();
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string>("all");
  const [activeTechnique, setActiveTechnique] = useState<string>("all");
  const [activeScale, setActiveScale] = useState<string>("all");

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
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 22px",
          background: "rgba(6,3,16,0.84)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Link href="/" style={{ textDecoration: "none", color: "rgba(240,232,216,0.68)", fontSize: 13, fontWeight: 700 }}>
            {"<-"} Home
          </Link>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 900 }}>Song-Feel Library</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Link href="/practice" style={{ textDecoration: "none", color: "#c8553d", fontSize: 13, fontWeight: 700 }}>Practice Path</Link>
          <Link href="/player" style={{ textDecoration: "none", color: "#bfd7ff", fontSize: 13, fontWeight: 700 }}>Player</Link>
          <AccountMenu />
        </div>
      </header>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "34px 22px 72px" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
            gap: 20,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 28,
              padding: "28px 28px 26px",
              boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "6px 14px", borderRadius: 999, background: "rgba(106,158,232,0.12)", border: "1px solid rgba(106,158,232,0.25)", fontSize: 11, fontWeight: 800, color: "#bfd7ff", letterSpacing: "0.16em" }}>
              NO COPYRIGHTED SONGS. JUST SONG-FEEL WORKOUTS.
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 0.98, margin: "18px 0 14px", letterSpacing: "-0.04em" }}>
              Browse drills by
              <br />
              genre feel,
              <br />
              scale, or technique.
            </h1>
            <p style={{ maxWidth: 720, color: "rgba(240,232,216,0.72)", fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              The practice path teaches order. The library gives you freedom. Jump straight into blues, arena-rock, modal jam, warmup, or speed-focused workouts without losing the guided world structure.
            </p>
          </div>

          <div
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
            <LibraryStat label="Genre Feels" value={String(allGenres.length)} accent="#7ac85a" />
            <LibraryStat label="Scales" value={String(allScaleFamilies.length)} accent="#f0c040" />
          </div>
        </section>

        <section style={{ marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.5)", marginBottom: 6 }}>CURATED COLLECTIONS</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900 }}>Start with a vibe, not just a level</div>
            </div>
            <div style={{ color: "rgba(240,232,216,0.55)", fontSize: 13 }}>Each pack reuses drills from the path in a more musical browsing layer.</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
            {libraryCollections.map((collection) => {
              const entries = getCollectionEntries(collection.id);
              return (
                <div
                  key={collection.id}
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 24,
                    padding: 20,
                    boxShadow: "0 14px 38px rgba(0,0,0,0.28)",
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: collection.accentColor, marginBottom: 7 }}>
                    {collection.subtitle.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
                    {collection.title}
                  </div>
                  <p style={{ color: "rgba(240,232,216,0.66)", fontSize: 13, lineHeight: 1.65, margin: "0 0 14px" }}>
                    {collection.description}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                    {entries.slice(0, 3).map((entry) => (
                      <Tag key={entry.levelId}>{entry.level.title}</Tag>
                    ))}
                  </div>
                  <button
                    onClick={() => router.push(`/practice/${entries[0]?.levelId}`)}
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: 14,
                      background: `linear-gradient(135deg, ${collection.accentColor}, ${collection.accentColor}aa)`,
                      color: "white",
                      fontWeight: 800,
                      padding: "12px 14px",
                      cursor: "pointer",
                    }}
                  >
                    Start this pack
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section
          style={{
            background: "rgba(10,5,28,0.88)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 28,
            padding: 22,
            boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(200,180,140,0.5)", marginBottom: 6 }}>FILTERS</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900 }}>Find drills that feel right today</div>
            </div>
            <div style={{ color: "rgba(240,232,216,0.55)", fontSize: 13 }}>
              Library drills launch directly. The path still handles the guided unlock order.
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
            <Link href="/practice" style={{ color: "#c8553d", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
              Back to Practice Path
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
            {filteredEntries.map((entry) => {
              const stars = getBestStars(entry.levelId);
              const completed = isCompleted(entry.levelId);
              return (
                <div
                  key={entry.levelId}
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 22,
                    padding: 20,
                    boxShadow: "0 14px 38px rgba(0,0,0,0.28)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: entry.worldAccentColor, marginBottom: 6 }}>
                        WORLD {entry.worldNumber} • {entry.worldTitle.toUpperCase()}
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900 }}>{entry.level.title}</div>
                      {entry.level.subtitle && (
                        <div style={{ color: "rgba(240,232,216,0.58)", fontSize: 13, marginTop: 4 }}>{entry.level.subtitle}</div>
                      )}
                    </div>
                    <div style={{ textAlign: "right", minWidth: 64 }}>
                      <div style={{ color: completed ? "#7ac85a" : "#f0c040", fontSize: 12, fontWeight: 800 }}>
                        {completed ? "Done" : `${stars}/3`}
                      </div>
                      <div style={{ color: "rgba(200,180,140,0.42)", fontSize: 10, marginTop: 6 }}>
                        {entry.level.bpm} BPM
                      </div>
                    </div>
                  </div>

                  <div style={{ borderRadius: 16, background: "rgba(106,158,232,0.08)", border: "1px solid rgba(106,158,232,0.16)", padding: "12px 14px", marginBottom: 12 }}>
                    <div style={{ color: "#bfd7ff", fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", marginBottom: 4 }}>
                      {entry.vibeTitle.toUpperCase()}
                    </div>
                    <div style={{ color: "rgba(240,232,216,0.72)", fontSize: 13, lineHeight: 1.6 }}>{entry.vibeLine}</div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    <Tag tone="accent">{prettyLabel(entry.scaleFamily)}</Tag>
                    {entry.genreTags.slice(0, 2).map((tag) => <Tag key={tag}>{prettyLabel(tag)}</Tag>)}
                    {entry.techniqueTags.slice(0, 2).map((tag) => <Tag key={tag}>{prettyLabel(tag)}</Tag>)}
                  </div>

                  <div style={{ color: "rgba(240,232,216,0.6)", fontSize: 13, lineHeight: 1.65, marginBottom: 14 }}>
                    {entry.level.description}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 14 }}>
                    <MiniStat label="Focus" value={entry.level.focus ?? "Lead practice"} />
                    <MiniStat label="Difficulty" value={(entry.level.difficulty ?? "medium").toUpperCase()} />
                    <MiniStat label="Notes" value={String(entry.level.notes.length)} />
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => router.push(`/practice/${entry.levelId}`)}
                      style={{
                        flex: 1,
                        border: "none",
                        borderRadius: 14,
                        background: `linear-gradient(135deg, ${entry.worldAccentColor}, ${entry.worldAccentColor}aa)`,
                        color: "white",
                        fontWeight: 800,
                        padding: "13px 14px",
                        cursor: "pointer",
                      }}
                    >
                      Start drill
                    </button>
                    <button
                      onClick={() => {
                        setActiveGenre(entry.genreTags[0] ?? "all");
                        setActiveTechnique(entry.techniqueTags[0] ?? "all");
                      }}
                      style={{
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.05)",
                        color: "#f0e8d8",
                        fontWeight: 700,
                        padding: "13px 14px",
                        cursor: "pointer",
                      }}
                    >
                      Similar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(200,180,140,0.48)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.35 }}>{value}</div>
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
