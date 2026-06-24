"use client";

import type { CoachNote } from "@/lib/coach/notes";

type Props = {
  title: string;
  notes: CoachNote[];
  isLightTheme: boolean;
};

export default function CoachNotesCard({ title, notes, isLightTheme }: Props) {
  if (notes.length === 0) return null;

  const labelClass = isLightTheme ? "text-neutral-500" : "text-slate-500";
  const titleClass = isLightTheme ? "text-neutral-900" : "text-slate-50";
  const bodyClass = isLightTheme ? "text-neutral-700" : "text-slate-300";

  return (
    <section
      className={`rounded-2xl border p-4 ${
        isLightTheme
          ? "border-violet-200/80 bg-violet-50/40"
          : "border-violet-500/25 bg-violet-500/8"
      }`}
    >
      <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${labelClass}`}>
        {title}
      </p>
      <ul className="mt-2 space-y-2">
        {notes.map((note) => (
          <li
            key={note.id}
            className={`rounded-xl border px-3 py-2.5 text-[13px] leading-relaxed ${bodyClass} ${
              isLightTheme ? "border-violet-100 bg-white/80" : "border-violet-500/15 bg-slate-900/40"
            }`}
          >
            {note.body}
          </li>
        ))}
      </ul>
    </section>
  );
}
