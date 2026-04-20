"use client";

import type { VocabularyListCategory } from "@/lib/vocabulary/types";

const CATEGORIES: { id: VocabularyListCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "phrase", label: "Phrase" },
  { id: "word", label: "Word" },
  { id: "review", label: "Review" },
];

type Props = {
  active: VocabularyListCategory;
  onChange: (c: VocabularyListCategory) => void;
};

export default function VocabularyCategoryFilters({ active, onChange }: Props) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map(({ id, label }) => (
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
          {label}
        </button>
      ))}
    </div>
  );
}
