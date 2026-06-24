"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import type { LearnPhrase } from "@/lib/learn/types";
import { getPhraseBySlug } from "@/lib/learn/phrases";
import { logBetaEvent } from "@/lib/analytics/client";
import { getLearnCopy } from "@/lib/i18n/learnCopy";
import { useAppLang } from "@/lib/i18n/useAppLang";
import { localizePhrase } from "@/lib/learn/localizePhrase";

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
    <article className="relative min-h-screen overflow-x-hidden bg-[#020617]">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-200">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Frensei</span>
        </Link>
        <Link
          href="/login?intent=signup"
          className="rounded-lg bg-pink-500/90 px-3 py-1.5 text-xs font-medium text-white"
        >
          {copy.startFree}
        </Link>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-pink-400/90">
          {phrase.level} · {copy.phraseGuide}
        </p>
        <h1 className="mt-2 font-wa-serif text-3xl font-semibold text-slate-50 sm:text-4xl">
          {localized.title}
        </h1>
        <p className="mt-4 text-2xl text-slate-200">{phrase.topic}</p>
        <p className="text-sm text-slate-500">{phrase.reading}</p>
        <p className="mt-4 text-lg text-slate-300">{localized.meaning}</p>

        <section className="mt-10 space-y-4">
          <h2 className="font-wa-serif text-xl text-slate-100">{copy.nuance}</h2>
          <p className="leading-relaxed text-slate-400">{localized.nuance}</p>
        </section>

        <section className="mt-8 rounded-2xl border border-wa-ruri/25 bg-wa-ruri/8 p-5">
          <h2 className="font-wa-serif text-lg text-slate-100">{copy.culturalNote}</h2>
          <p className="mt-2 leading-relaxed text-slate-300">{localized.culturalNote}</p>
        </section>

        <section className="mt-10">
          <h2 className="font-wa-serif text-xl text-slate-100">{copy.examples}</h2>
          <ul className="mt-4 space-y-4">
            {phrase.examples.map((ex, index) => (
              <li
                key={ex.ja}
                className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4"
              >
                <p className="text-lg text-slate-100">{ex.ja}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {localized.examplesLocalized[index]?.translation ?? ex.en}
                </p>
                <p className="mt-2 text-[12px] text-slate-500">
                  {localized.examplesLocalized[index]?.context ?? ex.context}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {localized.commonMistakes.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-wa-serif text-xl text-slate-100">{copy.commonMistakes}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-400">
              {localized.commonMistakes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-12 rounded-2xl border border-pink-500/25 bg-pink-500/8 p-6">
          <div className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink-400" />
            <div>
              <h2 className="font-wa-serif text-lg text-slate-100">{copy.askSensei(phrase.topic)}</h2>
              <p className="mt-2 text-sm text-slate-400">{copy.tryCtaBody}</p>
              <Link
                href={tryHref}
                onClick={() =>
                  void logBetaEvent({
                    eventType: "signup_cta_click",
                    route: `/learn/${phrase.slug}`,
                    metadata: { source: "phrase_cta", slug: phrase.slug },
                  })
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-wa-ruri px-4 py-2.5 text-sm font-medium text-white hover:bg-wa-asagi"
              >
                {copy.tryWithSensei}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-wa-serif text-lg text-slate-100">{copy.relatedPhrases}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/learn/${r.slug}`}
                  className="rounded-full border border-slate-700/80 px-3 py-1.5 text-sm text-slate-300 hover:border-pink-500/30 hover:text-pink-200"
                >
                  {r.topic}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
