"use client";

import { useMemo, useState } from "react";
import { buildClozeFromCorrection, scoreClozeAnswer } from "@/lib/coach/clozeDrill";
import { applyMasteryFromDrill } from "@/lib/coach/categoryMastery";
import { pickDueCorrectionForCloze } from "@/lib/coach/reviewCloze";
import { markVocabularyItemReviewed, isPersistedVocabularyItem } from "@/lib/vocabulary/service";
import type { VocabularyItem } from "@/lib/vocabulary/types";
import { mistakeCategoryLabel } from "@/lib/vocabulary/mistakeCategory";

type Props = {
  userId: string;
  items: VocabularyItem[];
  todayYmd: string;
  onReviewed: () => void;
};

export default function ReviewClozePanel({ userId, items, todayYmd, onReviewed }: Props) {
  const target = useMemo(
    () => pickDueCorrectionForCloze(items, todayYmd),
    [items, todayYmd],
  );
  const drill = useMemo(() => {
    if (!target) return null;
    const corrected = (target.correctedSentence ?? target.term).trim();
    const user = target.userSentence?.trim();
    return buildClozeFromCorrection(corrected, user);
  }, [target]);

  const [input, setInput] = useState("");
  const [done, setDone] = useState<0 | 1 | 2 | null>(null);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  if (!target || !drill || dismissedId === target.id) return null;

  const catLabel =
    mistakeCategoryLabel(target.mistakeCategory) ?? target.mistakeCategory ?? "Other";

  const submit = () => {
    const s = scoreClozeAnswer(drill, input);
    setDone(s);
    applyMasteryFromDrill(userId, catLabel, s, 2);
    if (s >= 1 && isPersistedVocabularyItem(target)) {
      markVocabularyItemReviewed(target);
      onReviewed();
    }
  };

  const skip = () => {
    setDismissedId(target.id);
  };

  return (
    <section className="rounded-2xl border border-amber-500/30 bg-amber-500/8 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200/90">
        Review cloze
      </p>
      <p className="mt-1 text-[12px] text-slate-400">
        From a correction you saved — fill the gap before you move on.
      </p>
      <p className="mt-2 font-wa-serif text-base leading-relaxed text-slate-100">{drill.prompt}</p>
      {done == null ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="missing piece"
            className="min-h-[40px] flex-1 rounded-lg border border-slate-700 bg-slate-900/80 px-3 text-[14px] text-slate-100"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submit}
              className="min-h-[40px] flex-1 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 text-[12px] font-medium text-amber-100 sm:flex-none"
            >
              Check
            </button>
            <button
              type="button"
              onClick={skip}
              className="min-h-[40px] rounded-lg border border-slate-700/60 px-3 text-[12px] text-slate-400"
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <p className="text-[12px] text-slate-300">
            {done === 2
              ? "Perfect — marked reviewed."
              : done === 1
                ? `Close. Answer: ${drill.answer}`
                : `Full line: ${drill.fullSentence}`}
          </p>
          <button
            type="button"
            onClick={skip}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-300"
          >
            Next item →
          </button>
        </div>
      )}
    </section>
  );
}
