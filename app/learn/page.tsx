import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getAllPhrases } from "@/lib/learn/phrases";
import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Japanese Phrase Guides — Natural Usage & Culture | Frensei",
  description:
    "Free guides for itadakimasu, otsukaresama, sumimasen, and 20+ essential Japanese phrases. Learn meaning, nuance, and culture—then practice with AI.",
  alternates: { canonical: "/learn" },
};

export default function LearnIndexPage() {
  const phrases = getAllPhrases();
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Japanese phrase guides",
    itemListElement: phrases.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/learn/${p.slug}`,
      name: p.topic,
    })),
  };

  return (
    <div className="min-h-screen bg-[#020617] px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }}
      />
      <div className="mx-auto w-full max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-slate-200">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Frensei</span>
        </Link>
        <h1 className="font-wa-serif text-3xl font-semibold text-slate-50">
          Japanese phrase guides
        </h1>
        <p className="mt-3 text-slate-400">
          Meaning, culture, and real usage—not textbook definitions.
        </p>
        <ul className="mt-10 space-y-3">
          {phrases.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/learn/${p.slug}`}
                className="block rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 transition hover:border-pink-500/30"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-wa-serif text-lg text-slate-100">{p.topic}</span>
                  <span className="text-[11px] text-slate-500">{p.level}</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{p.meaningEn}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
