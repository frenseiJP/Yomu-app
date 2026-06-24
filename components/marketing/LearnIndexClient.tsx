"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { LearnPhrase } from "@/lib/learn/types";
import { getLearnCopy } from "@/lib/i18n/learnCopy";
import { useAppLang } from "@/lib/i18n/useAppLang";
import { localizePhrase } from "@/lib/learn/localizePhrase";

type Props = {
  phrases: LearnPhrase[];
};

export default function LearnIndexClient({ phrases }: Props) {
  const lang = useAppLang();
  const copy = getLearnCopy(lang);

  return (
    <div className="min-h-screen bg-[#020617] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-slate-200">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Frensei</span>
        </Link>
        <h1 className="font-wa-serif text-3xl font-semibold text-slate-50">{copy.indexTitle}</h1>
        <p className="mt-3 text-slate-400">{copy.indexSubtitle}</p>
        <ul className="mt-10 space-y-3">
          {phrases.map((p) => {
            const localized = localizePhrase(p, lang);
            return (
              <li key={p.slug}>
                <Link
                  href={`/learn/${p.slug}`}
                  className="block rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 transition hover:border-pink-500/30"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-wa-serif text-lg text-slate-100">{p.topic}</span>
                    <span className="text-[11px] text-slate-500">{p.level}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{localized.meaning}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
