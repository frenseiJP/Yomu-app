"use client";

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
  const catLabel =
    mistakeCategoryLabel(
      inferMistakeCategory({
        userSentence: fields.userSentence,
        correctedSentence: fields.corrected,
        note: fields.categoryHint,
      }),
    ) ?? "Particle";

  return (
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
  );
}
