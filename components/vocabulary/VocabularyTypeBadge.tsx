"use client";

import type { VocabularyItemType } from "@/lib/vocabulary/types";
import type { PrototypeUiText } from "@/src/utils/i18n/prototypeCopy";

const STYLES: Record<VocabularyItemType, string> = {
  word: "border-sky-500/40 bg-sky-500/10 text-sky-200",
  phrase: "border-violet-500/40 bg-violet-500/10 text-violet-200",
  correction: "border-amber-500/45 bg-amber-500/10 text-amber-200",
};

function labelFor(ui: PrototypeUiText, type: VocabularyItemType): string {
  if (type === "word") return ui.vocabTypeWord;
  if (type === "phrase") return ui.vocabTypePhrase;
  return ui.vocabTypeCorrection;
}

export default function VocabularyTypeBadge({
  type,
  ui,
}: {
  type: VocabularyItemType;
  ui: PrototypeUiText;
}) {
  return (
    <span
      className={`inline-flex flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STYLES[type]}`}
    >
      {labelFor(ui, type)}
    </span>
  );
}
