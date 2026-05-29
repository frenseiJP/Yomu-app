"use client";

import { useState } from "react";
import SpeakingLoopPanel from "@/components/coach/SpeakingLoopPanel";
import ClozeDrillInline from "@/components/coach/ClozeDrillInline";
import type { CorrectionPracticeFields } from "@/lib/coach/correctionPractice";
import { inferMistakeCategory, mistakeCategoryLabel } from "@/lib/vocabulary/mistakeCategory";

type Props = {
  fields: CorrectionPracticeFields;
  userId: string;
  onSpeakingCheck?: (score: number) => void;
  onClozeComplete?: (score: 0 | 1 | 2) => void;
};

export default function CorrectionPracticeBlock({
  fields,
  userId,
  onSpeakingCheck,
  onClozeComplete,
}: Props) {
  const [open, setOpen] = useState(false);
  const catLabel =
    mistakeCategoryLabel(
      inferMistakeCategory({
        userSentence: fields.userSentence,
        correctedSentence: fields.corrected,
        note: fields.categoryHint,
      }),
    ) ?? "Particle";

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[38px] w-full items-center justify-between rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-left text-[12px] font-medium text-violet-100"
        aria-expanded={open}
      >
        <span>Practice this correction</span>
        <span className="text-[11px] text-violet-300/80">{open ? "Hide" : "Say & cloze"}</span>
      </button>
      {open ? (
        <div className="mt-2 space-y-2">
          <SpeakingLoopPanel
            sentence={fields.corrected}
            compact
            onCheckComplete={(score) => onSpeakingCheck?.(score)}
          />
          <ClozeDrillInline
            corrected={fields.corrected}
            userSentence={fields.userSentence}
            userId={userId}
            categoryHint={catLabel}
            onScored={onClozeComplete}
          />
        </div>
      ) : null}
    </div>
  );
}
