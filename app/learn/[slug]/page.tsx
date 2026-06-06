import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhraseLearnView from "@/components/marketing/PhraseLearnView";
import { phraseArticleJsonLd, phraseFaqJsonLd } from "@/lib/learn/jsonLd";
import { getAllPhraseSlugs, getPhraseBySlug } from "@/lib/learn/phrases";
import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();

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
      url: `${SITE_URL}/learn/${phrase.slug}`,
    },
  };
}

export default function PhraseLearnPage({ params }: Props) {
  const phrase = getPhraseBySlug(params.slug);
  if (!phrase) notFound();
  const articleLd = phraseArticleJsonLd(phrase);
  const faqLd = phraseFaqJsonLd(phrase);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <PhraseLearnView phrase={phrase} />
    </>
  );
}
