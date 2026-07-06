"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { LearnPhrase } from "@/lib/learn/types";
import { getLearnCopy } from "@/lib/i18n/learnCopy";
import { useAppLang } from "@/lib/i18n/useAppLang";
import { localizePhrase } from "@/lib/learn/localizePhrase";
import MarketingShell, { mkt } from "@/components/marketing/MarketingShell";

type Props = {
  phrases: LearnPhrase[];
};

export default function LearnIndexClient({ phrases }: Props) {
  const lang = useAppLang();
  const copy = getLearnCopy(lang);

  return (
    <MarketingShell className="px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <Link href="/" className={`mb-8 inline-flex items-center gap-2 ${mkt.muted} hover:text-slate-900`}>
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Frensei</span>
        </Link>
        <h1 className={`text-3xl font-semibold ${mkt.heading}`}>{copy.indexTitle}</h1>
        <p className={`mt-3 ${mkt.muted}`}>{copy.indexSubtitle}</p>
        <ul className="mt-10 space-y-3">
          {phrases.map((p) => {
            const localized = localizePhrase(p, lang);
            return (
              <li key={p.slug}>
                <Link
                  href={`/learn/${p.slug}`}
                  className={`block p-4 transition hover:border-blue-300 ${mkt.card}`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={`text-lg ${mkt.heading}`}>{p.topic}</span>
                    <span className={`text-[11px] ${mkt.faint}`}>{p.level}</span>
                  </div>
                  <p className={`mt-1 text-sm ${mkt.muted}`}>{localized.meaning}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </MarketingShell>
  );
}
