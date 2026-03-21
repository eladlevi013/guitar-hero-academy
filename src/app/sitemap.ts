import { MetadataRoute } from "next";
import { libraryCollections } from "@/data/library";
import { ALL_WORLDS } from "@/data/worlds";

const BASE = "https://guitar-hero-academy.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const levelEntries = ALL_WORLDS.flatMap((world) =>
    world.levels.map((level) => ({
      url: `${BASE}/practice/${level.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  const collectionEntries = libraryCollections.map((collection) => ({
    url: `${BASE}/library/${collection.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/practice`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/library`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/daily`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/player`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/setup`, changeFrequency: "monthly", priority: 0.5 },
    ...collectionEntries,
    ...levelEntries,
  ];
}
