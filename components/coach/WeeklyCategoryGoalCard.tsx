"use client";

import type { WeeklyGoalStatus } from "@/lib/habit/weeklyGoal";

type Props = {
  status: WeeklyGoalStatus;
  onPractice?: () => void;
};

export default function WeeklyCategoryGoalCard({ status, onPractice }: Props) {
  return (
    <section className="rounded-2xl border border-sky-500/25 bg-sky-500/8 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300/90">
        Weekly coach goal
      </p>
      <p className="mt-1 text-[12px] text-slate-400">
        This week: grow <span className="font-medium text-slate-200">{status.label}</span> from your real
        corrections.
      </p>
      <div className="mt-3 flex items-center justify-between text-[12px] text-slate-300">
        <span>
          {status.currentScore}% / {status.targetScore}%
        </span>
        <span className="font-medium text-sky-100">
          {status.met ? "Goal met 🎉" : `${status.progressPercent}% of weekly target`}
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
          Practice {status.label} with Sensei →
        </button>
      ) : null}
    </section>
  );
}
