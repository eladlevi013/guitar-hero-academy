import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionPageClient from "@/components/CollectionPageClient";
import { getCollectionBySlug, getCollectionEntries, libraryCollections } from "@/data/library";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  return {
    title: `${collection.title} · Song-Feel Library`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) notFound();

  const entries = getCollectionEntries(collection.id);

  return <CollectionPageClient collection={collection} entries={entries} />;
}

export function generateStaticParams() {
  return libraryCollections.map((collection) => ({ slug: collection.slug }));
}
