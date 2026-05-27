"use client";

import type { DailyUsefulPhrase } from "@/lib/dailyPhrase/phrases";

type Props = {
  phrase: DailyUsefulPhrase;
  isLightTheme: boolean;
  onPractice: () => void;
};

export default function DailyUsefulPhraseCard({ phrase, isLightTheme, onPractice }: Props) {
  const card = isLightTheme
    ? "rounded-2xl border border-pink-100/80 bg-gradient-to-br from-white to-pink-50/40 p-4 shadow-sm"
    : "rounded-2xl border border-pink-500/25 bg-gradient-to-br from-slate-950/90 to-pink-950/20 p-4 shadow-glass";

  const label = isLightTheme ? "text-pink-600/90" : "text-pink-300/90";
  const phraseText = isLightTheme ? "text-neutral-900" : "text-slate-50";
  const sub = isLightTheme ? "text-neutral-500" : "text-slate-400";
  const sectionLabel = isLightTheme ? "text-neutral-500" : "text-slate-500";
  const meaning = isLightTheme ? "text-neutral-800" : "text-slate-200";
  const when = isLightTheme ? "text-neutral-700" : "text-slate-300";

  return (
    <section className={`w-full ${card} sm:p-5`}>
      <p className={`text-[11px] font-semibold tracking-wide ${label}`}>
        Today&apos;s useful phrase 🌸
      </p>
      <p className={`mt-3 font-wa-serif text-lg leading-snug sm:text-xl lg:text-2xl ${phraseText}`}>
        {phrase.phrase}
      </p>
      <p className={`mt-1 text-sm ${sub}`}>({phrase.romaji})</p>

      <div className="mt-4 space-y-3 sm:mt-5 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${sectionLabel}`}>
            Meaning
          </p>
          <p className={`mt-1 text-sm leading-relaxed ${meaning}`}>{phrase.meaning}</p>
        </div>
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${sectionLabel}`}>
            When to use
          </p>
          <p className={`mt-1 text-sm leading-relaxed ${when}`}>{phrase.whenToUse}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onPractice}
        className={`btn-wa-hover btn-wa-hover-ruri mt-4 inline-flex min-h-[44px] w-full touch-manipulation items-center justify-center rounded-xl border border-wa-ruri/45 bg-wa-ruri/20 py-3 text-sm font-semibold hover:bg-wa-ruri/30 lg:mt-5 lg:min-h-[40px] ${
          isLightTheme ? "text-neutral-900" : "text-slate-50"
        }`}
      >
        Practice
      </button>
    </section>
  );
}
