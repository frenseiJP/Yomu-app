"use client";

import {
  SKILL_TREE_ORDER,
  WEAKNESS_GATE_THRESHOLD,
  isCategoryUnlocked,
  masteryScoreFor,
  recommendedFocusCategory,
} from "@/lib/coach/categoryMastery";
import type { ProgressCopy } from "@/lib/i18n/progressCopy";
import { getSkillTreeHint, getSkillTreeLabel } from "@/lib/i18n/skillTree";
import type { MistakeCategoryKey } from "@/lib/habit/types";
import type { Lang } from "@/src/utils/i18n/types";

type Props = {
  userId: string;
  lang: Lang;
  copy: ProgressCopy;
  isLightTheme?: boolean;
  onPracticeCategory?: (key: MistakeCategoryKey) => void;
};

export default function SkillTreeCard({ userId, lang, copy, onPracticeCategory }: Props) {
  const focus = recommendedFocusCategory(userId);

  return (
    <section className="rounded-xl border-0 bg-transparent p-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {copy.skillPathCoachTitle}
          </p>
          <p className="mt-1 text-[12px] text-slate-400">{copy.skillPathCoachSubtitle}</p>
        </div>
        <p className="text-[11px] text-sky-300/90">
          {copy.focusNow}{" "}
          <span className="font-medium text-sky-100">{getSkillTreeLabel(lang, focus)}</span>
        </p>
      </div>
      <ul className="mt-4 space-y-2.5">
        {SKILL_TREE_ORDER.map((node, idx) => {
          const score = masteryScoreFor(userId, node.key);
          const unlocked = isCategoryUnlocked(userId, node.key);
          const ready = score >= WEAKNESS_GATE_THRESHOLD;
          return (
            <li key={node.key} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-[12px]">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                      ready
                        ? "bg-emerald-500/20 text-emerald-200"
                        : unlocked
                          ? "bg-sky-500/15 text-sky-200"
                          : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className={`font-medium ${unlocked ? "text-slate-100" : "text-slate-500"}`}>
                      {getSkillTreeLabel(lang, node.key)}
                      {!unlocked ? ` ${copy.locked}` : null}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">{getSkillTreeHint(lang, node.key)}</p>
                  </div>
                </div>
                <span className="shrink-0 font-medium text-slate-200">{score}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800/80">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    ready ? "bg-emerald-400/80" : "bg-wa-ruri/70"
                  }`}
                  style={{ width: `${Math.max(4, score)}%` }}
                />
              </div>
              {unlocked && node.key === focus && onPracticeCategory ? (
                <button
                  type="button"
                  onClick={() => onPracticeCategory(node.key)}
                  className="mt-1 text-[11px] font-medium text-sky-300 hover:text-sky-200"
                >
                  {copy.practiceWithSensei}
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[11px] text-slate-500">{copy.unlockAt(WEAKNESS_GATE_THRESHOLD)}</p>
    </section>
  );
}
