"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import type { LearnPhrase } from "@/lib/learn/types";
import { getPhraseBySlug } from "@/lib/learn/phrases";
import { logBetaEvent } from "@/lib/analytics/client";
import { getLearnCopy } from "@/lib/i18n/learnCopy";
import { useAppLang } from "@/lib/i18n/useAppLang";
import { localizePhrase } from "@/lib/learn/localizePhrase";
import MarketingShell, { mkt } from "@/components/marketing/MarketingShell";

type Props = {
  phrase: LearnPhrase;
};

export default function PhraseLearnView({ phrase }: Props) {
  const lang = useAppLang();
  const copy = getLearnCopy(lang);
  const localized = localizePhrase(phrase, lang);

  const related = phrase.relatedSlugs
    .map((slug) => getPhraseBySlug(slug))
    .filter((p): p is LearnPhrase => Boolean(p));

  const tryHref = `/try?q=${encodeURIComponent(localized.tryPrompt)}`;

  return (
    <MarketingShell className="relative overflow-x-hidden">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className={`flex items-center gap-2 ${mkt.muted} hover:text-slate-900`}>
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Frensei</span>
        </Link>
        <Link href="/login?intent=signup" className={mkt.ctaSm}>
          {copy.startFree}
        </Link>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <p className={mkt.badge}>
          {phrase.level} · {copy.phraseGuide}
        </p>
        <h1 className={`mt-2 text-3xl font-semibold sm:text-4xl ${mkt.heading}`}>{localized.title}</h1>
        <p className={`mt-4 text-2xl ${mkt.heading}`}>{phrase.topic}</p>
        <p className={`text-sm ${mkt.faint}`}>{phrase.reading}</p>
        <p className={`mt-4 text-lg ${mkt.body}`}>{localized.meaning}</p>

        <section className="mt-10 space-y-4">
          <h2 className={`text-xl ${mkt.heading}`}>{copy.nuance}</h2>
          <p className={`leading-relaxed ${mkt.muted}`}>{localized.nuance}</p>
        </section>

        <section className={`mt-8 p-5 ${mkt.alertInfo}`}>
          <h2 className={`text-lg ${mkt.heading}`}>{copy.culturalNote}</h2>
          <p className={`mt-2 leading-relaxed ${mkt.body}`}>{localized.culturalNote}</p>
        </section>

        <section className="mt-10">
          <h2 className={`text-xl ${mkt.heading}`}>{copy.examples}</h2>
          <ul className="mt-4 space-y-4">
            {phrase.examples.map((ex, index) => (
              <li key={ex.ja} className={`p-4 ${mkt.card}`}>
                <p className={`text-lg ${mkt.heading}`}>{ex.ja}</p>
                <p className={`mt-1 text-sm ${mkt.muted}`}>
                  {localized.examplesLocalized[index]?.translation ?? ex.en}
                </p>
                <p className={`mt-2 text-[12px] ${mkt.faint}`}>
                  {localized.examplesLocalized[index]?.context ?? ex.context}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {localized.commonMistakes.length > 0 ? (
          <section className="mt-10">
            <h2 className={`text-xl ${mkt.heading}`}>{copy.commonMistakes}</h2>
            <ul className={`mt-3 list-disc space-y-2 pl-5 text-sm ${mkt.muted}`}>
              {localized.commonMistakes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className={`mt-12 p-6 ${mkt.alertInfo}`}>
          <div className="flex items-start gap-3">
            <MessageCircle className={`mt-0.5 h-5 w-5 flex-shrink-0 ${mkt.accentIcon}`} />
            <div>
              <h2 className={`text-lg ${mkt.heading}`}>{copy.askSensei(phrase.topic)}</h2>
              <p className={`mt-2 text-sm ${mkt.muted}`}>{copy.tryCtaBody}</p>
              <Link
                href={tryHref}
                onClick={() =>
                  void logBetaEvent({
                    eventType: "signup_cta_click",
                    route: `/learn/${phrase.slug}`,
                    metadata: { source: "phrase_cta", slug: phrase.slug },
                  })
                }
                className={`mt-4 inline-flex items-center gap-2 ${mkt.cta}`}
              >
                {copy.tryWithSensei}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-12">
            <h2 className={`text-lg ${mkt.heading}`}>{copy.relatedPhrases}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/learn/${r.slug}`}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-blue-300 hover:text-blue-700"
                >
                  {r.topic}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </MarketingShell>
  );
}
