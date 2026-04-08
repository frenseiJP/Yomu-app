"use client";

import type { SeasonalProgressState } from "@/lib/progress/seasonal";

type Props = {
  state: SeasonalProgressState;
  compact?: boolean;
  onOpenProgress?: () => void;
};

export default function SeasonalProgressCard({ state, compact = false, onOpenProgress }: Props) {
  const markers = Array.from({ length: 7 }, (_, i) => i < state.recentActivityCount);
  return (
    <section className="rounded-2xl border border-slate-800/70 bg-slate-950/80 p-4 shadow-glass">
      <div className={`rounded-xl bg-gradient-to-br ${state.visualTheme} p-4`}>
        <p className="text-[10px] uppercase tracking-[0.14em] text-slate-300">{state.season} journey</p>
        <p className="mt-1 font-wa-serif text-lg text-slate-50">{state.title}</p>
        <p className="mt-1 text-xs text-slate-200/90">{state.description}</p>
      </div>
      <div className="mt-3">
        <div className="h-2 rounded-full bg-slate-800">
          <div className="h-2 rounded-full bg-gradient-to-r from-wa-ruri to-wa-asagi" style={{ width: `${Math.max(8, Math.round(state.progressRatio * 100))}%` }} />
        </div>
        <div className="mt-2 flex gap-1.5">
          {markers.map((on, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-full ${on ? "bg-wa-kinari" : "bg-slate-700"}`} />
          ))}
        </div>
      </div>
      {!compact && onOpenProgress ? (
        <button type="button" onClick={onOpenProgress} className="mt-3 rounded-lg bg-wa-ruri/25 px-3 py-1.5 text-xs text-slate-100">
          Open Progress
        </button>
      ) : null}
    </section>
  );
}
