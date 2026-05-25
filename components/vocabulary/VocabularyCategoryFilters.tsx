"use client";

import type { VocabularyListCategory } from "@/lib/vocabulary/types";
import type { PrototypeUiText } from "@/src/utils/i18n/prototypeCopy";

const CATEGORIES: { id: VocabularyListCategory; key: keyof Pick<
  PrototypeUiText,
  "vocabLibFilterAll" | "vocabLibFilterPhrase" | "vocabLibFilterWord" | "vocabLibFilterReview"
> }[] = [
  { id: "all", key: "vocabLibFilterAll" },
  { id: "phrase", key: "vocabLibFilterPhrase" },
  { id: "word", key: "vocabLibFilterWord" },
  { id: "review", key: "vocabLibFilterReview" },
];

type Props = {
  active: VocabularyListCategory;
  onChange: (c: VocabularyListCategory) => void;
  ui: PrototypeUiText;
};

export default function VocabularyCategoryFilters({ active, onChange, ui }: Props) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map(({ id, key }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex-shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
            active === id
              ? "border-wa-ruri/70 bg-wa-ruri/20 text-slate-100"
              : "border-slate-700/90 bg-slate-950/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
          }`}
        >
          {ui[key]}
        </button>
      ))}
    </div>
  );
}
