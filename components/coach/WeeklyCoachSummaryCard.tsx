"use client";

import type { WeeklySummaryItem } from "@/lib/coach/weeklySummary";

type Props = {
  title: string;
  items: WeeklySummaryItem[];
  isLightTheme: boolean;
};

export default function WeeklyCoachSummaryCard({ title, items, isLightTheme }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      className={`rounded-2xl border p-4 ${
        isLightTheme
          ? "border-violet-200/80 bg-violet-50/40"
          : "border-violet-500/25 bg-violet-500/8"
      }`}
    >
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
          isLightTheme ? "text-violet-800/70" : "text-violet-300/80"
        }`}
      >
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            className={`text-[13px] leading-snug ${
              isLightTheme ? "text-violet-950" : "text-violet-100"
            }`}
          >
            • {item.body}
          </li>
        ))}
      </ul>
    </section>
  );
}
