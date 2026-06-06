import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhraseLearnView from "@/components/marketing/PhraseLearnView";
import { getAllPhraseSlugs, getPhraseBySlug } from "@/lib/learn/phrases";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllPhraseSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const phrase = getPhraseBySlug(params.slug);
  if (!phrase) return { title: "Not found | Frensei" };
  return {
    title: phrase.seoTitle,
    description: phrase.seoDescription,
    alternates: { canonical: `/learn/${phrase.slug}` },
    openGraph: {
      title: phrase.seoTitle,
      description: phrase.seoDescription,
      url: `https://frensei.jp/learn/${phrase.slug}`,
    },
  };
}

export default function PhraseLearnPage({ params }: Props) {
  const phrase = getPhraseBySlug(params.slug);
  if (!phrase) notFound();
  return <PhraseLearnView phrase={phrase} />;
}
