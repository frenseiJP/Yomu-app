"use client";

import type { WeeklyGoalStatus } from "@/lib/habit/weeklyGoal";
import type { ProgressCopy } from "@/lib/i18n/progressCopy";

type Props = {
  status: WeeklyGoalStatus;
  copy: ProgressCopy;
  onPractice?: () => void;
};

export default function WeeklyCategoryGoalCard({ status, copy, onPractice }: Props) {
  return (
    <section className="rounded-2xl border border-sky-500/25 bg-sky-500/8 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300/90">
        {copy.weeklyGoalTitle}
      </p>
      <p className="mt-1 text-[12px] text-slate-400">{copy.weeklyGoalBody(status.label)}</p>
      <div className="mt-3 flex items-center justify-between text-[12px] text-slate-300">
        <span>
          {status.currentScore}% / {status.targetScore}%
        </span>
        <span className="font-medium text-sky-100">
          {status.met ? copy.weeklyGoalMet : copy.weeklyGoalProgress(status.progressPercent)}
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-800/80">
        <div
          className={`h-2 rounded-full transition-all ${status.met ? "bg-emerald-400/80" : "bg-sky-400/80"}`}
          style={{ width: `${Math.max(4, status.progressPercent)}%` }}
        />
      </div>
      {!status.met && onPractice ? (
        <button
          type="button"
          onClick={onPractice}
          className="mt-3 text-[11px] font-medium text-sky-300 hover:text-sky-200"
        >
          {copy.weeklyGoalPractice(status.label)}
        </button>
      ) : null}
    </section>
  );
}
