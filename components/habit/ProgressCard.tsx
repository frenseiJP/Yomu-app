"use client";

import type { UserStats } from "@/lib/habit/types";
import type { PrototypeUiText } from "@/src/utils/i18n/prototypeCopy";

type Props = {
  stats: UserStats;
  ui: PrototypeUiText;
  isLightTheme: boolean;
};

function line(template: string, n: number): string {
  return template.replace("{n}", String(n));
}

export default function ProgressCard({ stats, ui, isLightTheme }: Props) {
  const card = isLightTheme
    ? "rounded-2xl border border-neutral-200 bg-[#f8f7f4] p-4 shadow-sm"
    : "rounded-2xl border border-slate-800/60 bg-slate-950/80 p-4 shadow-glass backdrop-blur-xl";
  const title = isLightTheme ? "text-neutral-900" : "text-slate-50";
  const row = isLightTheme ? "text-neutral-700" : "text-slate-300";

  return (
    <section className={card}>
      <p className={`font-wa-serif text-sm font-semibold ${title}`}>{ui.habitProgressTitle}</p>
      <ul className={`mt-3 space-y-2 text-sm ${row}`}>
        <li>🔥 {line(ui.habitStreakLine, stats.streak)}</li>
        <li>📘 {line(ui.habitWordsLine, stats.totalWords)}</li>
        <li>🧠 {line(ui.habitMistakesLine, stats.totalMistakes)}</li>
        <li>✨ {line(ui.habitFixedLine, stats.mistakesFixed)}</li>
        <li className="text-[11px] opacity-80">
          Sessions (learning days): {stats.totalSessions}
        </li>
      </ul>
    </section>
  );
}
