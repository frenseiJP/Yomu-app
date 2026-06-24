import type { Metadata } from "next";
import LearnIndexClient from "@/components/marketing/LearnIndexClient";
import { getAllPhrases } from "@/lib/learn/phrases";
import { getLearnCopy } from "@/lib/i18n/learnCopy";
import { getSiteUrl } from "@/lib/siteUrl";
import { getLangServer } from "@/src/utils/i18n/serverLang";

const SITE_URL = getSiteUrl();

export function generateMetadata(): Metadata {
  const lang = getLangServer();
  const copy = getLearnCopy(lang);
  return {
    title: copy.metadataIndexTitle,
    description: copy.metadataIndexDescription,
    alternates: { canonical: "/learn" },
  };
}

export default function LearnIndexPage() {
  const phrases = getAllPhrases();
  const lang = getLangServer();
  const copy = getLearnCopy(lang);
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: copy.indexTitle,
    itemListElement: phrases.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/learn/${p.slug}`,
      name: p.topic,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }}
      />
      <LearnIndexClient phrases={phrases} />
    </>
  );
}
