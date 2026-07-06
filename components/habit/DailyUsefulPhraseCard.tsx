"use client";

import type { DailyUsefulPhrase } from "@/lib/dailyPhrase/phrases";
import type { ProgressCopy } from "@/lib/i18n/progressCopy";

type Props = {
  phrase: DailyUsefulPhrase;
  isLightTheme: boolean;
  onPractice: () => void;
  copy?: Pick<ProgressCopy, "usefulPhraseTitle" | "phraseMeaningLabel" | "phraseWhenLabel" | "phrasePractice">;
  /** Inside collapsible — no outer card chrome */
  compact?: boolean;
};

export default function DailyUsefulPhraseCard({
  phrase,
  isLightTheme,
  onPractice,
  copy,
  compact = false,
}: Props) {
  const card = compact
    ? ""
    : isLightTheme
      ? "rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/40 p-4 shadow-sm"
      : "rounded-2xl border border-blue-500/25 bg-gradient-to-br from-slate-950/90 to-blue-950/20 p-4 shadow-glass";

  const label = isLightTheme ? "text-blue-600/90" : "text-blue-300/90";
  const phraseText = isLightTheme ? "text-neutral-900" : "text-slate-50";
  const sub = isLightTheme ? "text-neutral-500" : "text-slate-400";
  const sectionLabel = isLightTheme ? "text-neutral-500" : "text-slate-500";
  const meaning = isLightTheme ? "text-neutral-800" : "text-slate-200";
  const when = isLightTheme ? "text-neutral-700" : "text-slate-300";

  return (
    <section className={`w-full ${card} ${compact ? "" : "sm:p-5"}`}>
      {!compact ? (
        <p className={`text-[11px] font-semibold tracking-wide ${label}`}>
          {copy?.usefulPhraseTitle ? `${copy.usefulPhraseTitle} 🌸` : "Today's useful phrase 🌸"}
        </p>
      ) : null}
      <p
        className={`font-wa-serif leading-snug ${phraseText} ${
          compact ? "text-lg" : "mt-3 text-lg sm:text-xl lg:text-2xl"
        }`}
      >
        {phrase.phrase}
      </p>
      <p className={`mt-1 text-sm ${sub}`}>({phrase.romaji})</p>

      <div
        className={`space-y-3 ${compact ? "mt-3" : "mt-4 sm:mt-5 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0"}`}
      >
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${sectionLabel}`}>
            {copy?.phraseMeaningLabel ?? "Meaning"}
          </p>
          <p className={`mt-1 text-sm leading-relaxed ${meaning}`}>{phrase.meaning}</p>
        </div>
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${sectionLabel}`}>
            {copy?.phraseWhenLabel ?? "When to use"}
          </p>
          <p className={`mt-1 text-sm leading-relaxed ${when}`}>{phrase.whenToUse}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onPractice}
        className={`mt-4 inline-flex min-h-[44px] w-full touch-manipulation items-center justify-center rounded-xl border border-blue-300 bg-blue-50 py-3 text-sm font-semibold hover:bg-blue-100 lg:mt-5 lg:min-h-[40px] ${
          isLightTheme ? "text-blue-900" : "text-slate-50"
        }`}
      >
        {copy?.phrasePractice ?? "Practice"}
      </button>
    </section>
  );
}
