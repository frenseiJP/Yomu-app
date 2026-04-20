"use client";

import VocabularyTypeBadge from "@/components/vocabulary/VocabularyTypeBadge";
import type { VocabularyItem } from "@/lib/vocabulary/types";

type Props = {
  item: VocabularyItem;
  onOpen: () => void;
};

export default function VocabularyListRow({ item, onOpen }: Props) {
  const preview =
    item.exampleSentence?.trim() ||
    item.correctedSentence?.trim() ||
    item.userSentence?.trim() ||
    "—";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3.5 text-left transition-colors hover:border-slate-700 hover:bg-slate-900/60 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 font-medium leading-snug text-slate-100">{item.term}</p>
        <VocabularyTypeBadge type={item.type} />
      </div>
      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-400">
        {item.meaning?.trim() || "—"}
      </p>
      <p className="mt-1.5 line-clamp-1 text-[11px] text-slate-500">{preview}</p>
      {item.tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.tags.slice(0, 5).map((t) => (
            <span
              key={t}
              className="rounded-md border border-slate-800/90 bg-slate-900/80 px-1.5 py-0.5 text-[10px] text-slate-500"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}
