"use client";

import type { RecentWin } from "@/lib/coach/recentWins";

type Props = {
  title: string;
  wins: RecentWin[];
  isLightTheme: boolean;
};

function withBlossom(body: string): string {
  if (body.includes("🌸")) return body;
  return `🌸 ${body}`;
}

export default function RecentWinsCard({ title, wins, isLightTheme }: Props) {
  if (wins.length === 0) return null;

  return (
    <section
      className={`rounded-2xl border p-4 ${
        isLightTheme
          ? "border-emerald-200/80 bg-emerald-50/50"
          : "border-emerald-500/25 bg-emerald-500/8"
      }`}
    >
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
          isLightTheme ? "text-emerald-800/70" : "text-emerald-300/80"
        }`}
      >
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {wins.map((win) => (
          <li
            key={win.id}
            className={`text-[13px] leading-snug ${
              isLightTheme ? "text-emerald-950" : "text-emerald-100"
            }`}
          >
            {withBlossom(win.body)}
          </li>
        ))}
      </ul>
    </section>
  );
}
