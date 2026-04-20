"use client";

import type { Season, SeasonStage } from "@/lib/progress/seasonal";
import SeasonalGrowthVisual from "@/components/progress/SeasonalGrowthVisual";

type Props = {
  season: Season;
  /** 0–4 の成長段階（既存 SeasonalGrowthVisual と整合） */
  stage: SeasonStage;
  progressRatio: number;
  isLightTheme?: boolean;
  className?: string;
};

/**
 * 季節ビジュアル（桜・花火・紅葉・雪だるま）— メイン UI は数値なし。
 */
export default function ProgressVisual({
  season,
  stage,
  progressRatio,
  isLightTheme = false,
  className = "",
}: Props) {
  const shell = isLightTheme
    ? "rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm"
    : "rounded-3xl border border-slate-800/70 bg-slate-950/75 p-4 shadow-glass backdrop-blur-xl";

  return (
    <div className={`${shell} ${className}`}>
      <div className="flex flex-col items-center justify-center overflow-hidden rounded-2xl">
        <SeasonalGrowthVisual
          season={season}
          stage={stage}
          progressRatio={progressRatio}
          className="scale-[0.92] sm:scale-100"
        />
      </div>
    </div>
  );
}
