"use client";

import { X, Trash2, CheckCircle } from "lucide-react";
import VocabularyTypeBadge from "@/components/vocabulary/VocabularyTypeBadge";
import type { VocabularyItem } from "@/lib/vocabulary/types";

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

type Props = {
  item: VocabularyItem;
  canMutate: boolean;
  onClose: () => void;
  onReview: () => void;
  onDelete: () => void;
};

export default function VocabularyDetailPanel({ item, canMutate, onClose, onReview, onDelete }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vocab-detail-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-slate-700/80 bg-slate-950 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-800/90 px-4 py-3">
          <div className="min-w-0 flex-1 space-y-1">
            <VocabularyTypeBadge type={item.type} />
            <h2 id="vocab-detail-title" className="font-wa-serif text-lg font-semibold text-slate-50">
              {item.term}
            </h2>
            <p className="text-[11px] text-slate-500">Saved {formatWhen(item.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700/80 p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 text-sm">
          <section className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Meaning / context</p>
              <p className="mt-1 text-slate-200">{item.meaning?.trim() || "—"}</p>
            </div>

            {(item.exampleSentence || item.exampleTranslation) && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Example</p>
                <p className="mt-1 text-slate-200">{item.exampleSentence?.trim() || "—"}</p>
                {item.exampleTranslation ? (
                  <p className="mt-1 text-xs text-slate-500">{item.exampleTranslation}</p>
                ) : null}
              </div>
            )}

            {item.reading ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Reading</p>
                <p className="mt-1 text-slate-300">{item.reading}</p>
              </div>
            ) : null}

            {item.type === "correction" || item.userSentence || item.correctedSentence ? (
              <div className="rounded-xl border border-slate-800/90 bg-slate-900/50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Correction pair</p>
                {item.userSentence ? (
                  <p className="mt-2 text-xs text-slate-500">Your sentence</p>
                ) : null}
                {item.userSentence ? <p className="mt-0.5 text-slate-300">{item.userSentence}</p> : null}
                <p className="mt-2 text-xs text-slate-500">Corrected</p>
                <p className="mt-0.5 text-emerald-200/95">{item.correctedSentence || item.term}</p>
                {item.mistakeNote ? (
                  <>
                    <p className="mt-2 text-xs text-slate-500">Note</p>
                    <p className="mt-0.5 text-slate-400">{item.mistakeNote}</p>
                  </>
                ) : null}
              </div>
            ) : null}

            {item.aiComment ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">AI note</p>
                <p className="mt-1 text-slate-300">{item.aiComment}</p>
              </div>
            ) : null}

            {item.tags.length > 0 ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Tags</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-slate-700/80 bg-slate-900/70 px-2 py-0.5 text-[11px] text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {!canMutate ? (
              <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">
                This entry is linked from Topic Practice history. Delete and review actions apply only to items saved in
                your vocabulary store.
              </p>
            ) : null}
          </section>
        </div>

        <div className="flex flex-shrink-0 flex-col gap-2 border-t border-slate-800/90 px-4 py-3 sm:flex-row sm:justify-end">
          {canMutate ? (
            <>
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-200 hover:bg-red-500/15"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
              <button
                type="button"
                onClick={onReview}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-medium text-emerald-100 hover:bg-emerald-500/20"
              >
                <CheckCircle className="h-4 w-4" />
                Mark reviewed
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-slate-200"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
