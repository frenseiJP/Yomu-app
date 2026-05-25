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

  return (
    <section className={card}>
      <p className="text-[11px] font-semibold tracking-wide text-pink-300/90">
        Today&apos;s useful phrase 🌸
      </p>
      <p className="mt-3 font-wa-serif text-xl leading-snug text-slate-50">{phrase.phrase}</p>
      <p className="mt-1 text-sm text-slate-400">({phrase.romaji})</p>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Meaning
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-200">{phrase.meaning}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            When to use
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{phrase.whenToUse}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onPractice}
        className="btn-wa-hover btn-wa-hover-ruri mt-4 w-full rounded-xl border border-wa-ruri/45 bg-wa-ruri/20 py-3 text-sm font-semibold text-slate-50 hover:bg-wa-ruri/30"
      >
        Practice
      </button>
    </section>
  );
}
