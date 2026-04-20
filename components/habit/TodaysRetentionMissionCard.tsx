"use client";

import { Flame } from "lucide-react";
import type { RetentionDailyMissionDay } from "@/lib/mission/retentionDaily";

type Props = {
  day: RetentionDailyMissionDay;
  isLightTheme: boolean;
  onStart: () => void;
};

export default function TodaysRetentionMissionCard({ day, isLightTheme, onStart }: Props) {
  const card = isLightTheme
    ? "rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5"
    : "rounded-2xl border border-slate-800/60 bg-slate-950/80 p-4 shadow-glass backdrop-blur-xl sm:p-5";
  const titleCls = isLightTheme ? "text-neutral-900" : "text-slate-100";
  const subCls = isLightTheme ? "text-neutral-600" : "text-slate-400";

  return (
    <section
      className={
        day.completed && !isLightTheme
          ? `${card} border-emerald-500/35 bg-emerald-950/25`
          : day.completed && isLightTheme
            ? `${card} border-emerald-200 bg-emerald-50/80`
            : card
      }
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Flame className="h-5 w-5 flex-shrink-0 text-orange-400" aria-hidden />
          <span
            className={`font-wa-serif text-sm font-semibold tracking-tight sm:text-base ${titleCls}`}
          >
            🔥 Today&apos;s Mission
          </span>
        </div>
        {day.completed ? (
          <span className="flex-shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            Done
          </span>
        ) : (
          <span className={`flex-shrink-0 text-[10px] ${subCls}`}>{day.date}</span>
        )}
      </div>
      <p className={`text-xs font-medium uppercase tracking-wide ${subCls}`}>{day.mission.title}</p>
      <p className={`mt-2 text-[13px] leading-relaxed sm:text-sm ${titleCls}`}>{day.mission.instruction}</p>
      <p className={`mt-2 rounded-lg border px-2.5 py-2 text-[12px] italic leading-snug ${isLightTheme ? "border-neutral-200 bg-neutral-50 text-neutral-800" : "border-slate-700/80 bg-slate-900/60 text-slate-200"}`}>
        “{day.mission.prompt_en}”
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {day.mission.tags.map((t) => (
          <span
            key={t}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              isLightTheme ? "bg-neutral-100 text-neutral-600" : "bg-slate-800/90 text-slate-400"
            }`}
          >
            {t}
          </span>
        ))}
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            isLightTheme ? "bg-amber-50 text-amber-800" : "bg-amber-500/10 text-amber-200/90"
          }`}
        >
          {day.mission.difficulty}
        </span>
      </div>
      <button
        type="button"
        disabled={day.completed}
        onClick={onStart}
        className="btn-wa-hover btn-wa-hover-ruri mt-4 w-full rounded-xl border border-wa-ruri/50 bg-wa-ruri/25 py-3 text-sm font-semibold text-slate-50 shadow-glass hover:bg-wa-ruri/35 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-800/60 disabled:text-slate-500"
      >
        {day.completed ? "Completed" : "Start"}
      </button>
    </section>
  );
}
