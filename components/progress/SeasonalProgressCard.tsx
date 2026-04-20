"use client";

import type { SeasonalProgressState } from "@/lib/progress/seasonal";
import SeasonalGrowthVisual from "@/components/progress/SeasonalGrowthVisual";

type Props = {
  state: SeasonalProgressState;
  compact?: boolean;
  isLightTheme?: boolean;
  onOpenProgress?: () => void;
};

function ActivityMarks({
  season,
  activityCount,
  compact: _compact,
  isLightTheme,
}: {
  season: SeasonalProgressState["season"];
  activityCount: number;
  compact: boolean;
  isLightTheme: boolean;
}) {
  const n = Math.min(12, Math.max(0, activityCount));
  const total = 12;
  const size = _compact ? "h-1.5 w-1.5" : "h-2 w-2";

  const shape =
    season === "spring" || season === "summer"
      ? "rounded-full"
      : season === "autumn"
        ? "rotate-45 rounded-[1px]"
        : "rounded-full";

  const onClass =
    season === "spring"
      ? "bg-pink-300/90 shadow-[0_0_8px_rgba(251,113,133,0.45)]"
      : season === "summer"
        ? "bg-emerald-400/90 shadow-[0_0_8px_rgba(52,211,153,0.35)]"
        : season === "autumn"
          ? "bg-amber-500/90 shadow-[0_0_6px_rgba(245,158,11,0.4)]"
          : "bg-sky-200/90 shadow-[0_0_6px_rgba(186,230,253,0.45)]";

  const offClass = isLightTheme ? "bg-neutral-200" : "bg-slate-700/50";

  return (
    <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start" aria-label="Recent activity">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`${size} ${shape} ${i < n ? onClass : offClass} transition-colors duration-500`}
        />
      ))}
    </div>
  );
}

function StreakWarmth({
  streakCount,
  compact,
  isLightTheme,
}: {
  streakCount: number;
  compact: boolean;
  isLightTheme?: boolean;
}) {
  const slots = 7;
  const filled = Math.min(slots, Math.max(0, streakCount));
  const dot = compact ? "h-1.5 w-1.5" : "h-2 w-2";
  const off = isLightTheme ? "bg-neutral-200" : "bg-slate-700/40";
  return (
    <div className="flex gap-1" aria-label="Learning rhythm">
      {Array.from({ length: slots }, (_, i) => (
        <span
          key={i}
          className={`${dot} rounded-full ${i < filled ? "bg-amber-200/90 shadow-[0_0_6px_rgba(253,230,138,0.5)]" : off}`}
        />
      ))}
    </div>
  );
}

export default function SeasonalProgressCard({
  state,
  compact = false,
  isLightTheme = false,
  onOpenProgress,
}: Props) {
  const shell = isLightTheme
    ? "rounded-2xl border border-neutral-200 bg-white shadow-sm"
    : "rounded-2xl border border-slate-800/70 bg-slate-950/80 shadow-glass";

  if (compact) {
    return (
      <button
        type="button"
        onClick={onOpenProgress}
        className={`${shell} w-full p-3 text-left transition hover:opacity-95 active:scale-[0.99]`}
      >
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl opacity-95">
            <SeasonalGrowthVisual
              season={state.season}
              stage={state.stage}
              progressRatio={state.progressRatio}
              className="scale-[0.55] -translate-y-1"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`font-wa-serif text-sm ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}>
              {state.homePreviewLine}
            </p>
            <p className={`mt-0.5 text-[11px] ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`}>
              {state.encouragementLine}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <StreakWarmth streakCount={state.streakCount} compact isLightTheme={isLightTheme} />
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <section className={`${shell} overflow-hidden`}>
      <div
        className={`relative bg-gradient-to-br px-5 pb-6 pt-6 sm:px-7 sm:pb-8 sm:pt-7 ${state.visualTheme}`}
      >
        <p
          className={`text-[10px] font-medium uppercase tracking-[0.2em] ${isLightTheme ? "text-neutral-600/90" : "text-slate-400/90"}`}
        >
          {state.season}
        </p>
        <h2
          className={`mt-2 font-wa-serif text-xl leading-tight sm:text-2xl ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}
        >
          {state.momentLine}
        </h2>
        <p
          className={`mt-2 max-w-prose text-sm leading-relaxed ${isLightTheme ? "text-neutral-700" : "text-slate-200/95"}`}
        >
          {state.storyLine}
        </p>
        <p className={`mt-3 text-xs italic ${isLightTheme ? "text-neutral-600" : "text-slate-300/90"}`}>
          {state.encouragementLine}
        </p>

        <div className="mt-5">
          <SeasonalGrowthVisual season={state.season} stage={state.stage} progressRatio={state.progressRatio} />
        </div>
      </div>

      <div className={`space-y-4 px-5 py-4 sm:px-7 ${isLightTheme ? "bg-neutral-50/80" : "bg-slate-950/90"}`}>
        <div>
          <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`}>
            This week
          </p>
          <ActivityMarks season={state.season} activityCount={state.activityCount} compact={false} isLightTheme={isLightTheme} />
        </div>
        <div>
          <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`}>
            Rhythm
          </p>
          <StreakWarmth streakCount={state.streakCount} compact={false} isLightTheme={isLightTheme} />
        </div>
      </div>
    </section>
  );
}
