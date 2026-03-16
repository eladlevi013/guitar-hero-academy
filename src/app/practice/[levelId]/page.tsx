import type { Metadata } from "next";
import { notFound } from "next/navigation";
import world1 from "@/data/world1";
import PracticeSession from "@/components/PracticeSession";

const ALL_WORLDS = [world1];

interface Props {
  params: Promise<{ levelId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { levelId } = await params;
  for (const world of ALL_WORLDS) {
    const idx = world.levels.findIndex((l) => l.id === levelId);
    if (idx === -1) continue;
    const level = world.levels[idx];
    return {
      title: `W${world.number}L${idx + 1} · ${level.title}`,
      description: `Play "${level.title}" — World ${world.number}, Level ${idx + 1} on Guitar Hero Academy. ${level.notes.length} notes at ${level.bpm} BPM.`,
    };
  }
  return { title: "Level Not Found" };
}

export default async function LevelPage({ params }: Props) {
  const { levelId } = await params;

  // Build a flat list of all levels across all worlds so we can find the next
  // level even when crossing a world boundary.
  const allLevels = ALL_WORLDS.flatMap((w) =>
    w.levels.map((l, i) => ({ level: l, levelNum: i + 1, worldNum: w.number, totalLevels: w.levels.length }))
  );

  const flatIndex = allLevels.findIndex((e) => e.level.id === levelId);
  if (flatIndex === -1) notFound();

  const { level, levelNum, worldNum, totalLevels } = allLevels[flatIndex];
  const nextLevelId = allLevels[flatIndex + 1]?.level.id;

  return (
    <PracticeSession
      level={level}
      levelNum={levelNum}
      worldNum={worldNum}
      totalLevels={totalLevels}
      nextLevelId={nextLevelId}
    />
  );
}

export function generateStaticParams() {
  return ALL_WORLDS.flatMap((w) => w.levels.map((l) => ({ levelId: l.id })));
}
