"use client";

import { X, Trash2, CheckCircle } from "lucide-react";
import VocabularyTypeBadge from "@/components/vocabulary/VocabularyTypeBadge";
import type { VocabularyItem } from "@/lib/vocabulary/types";
import type { PrototypeUiText } from "@/src/utils/i18n/prototypeCopy";
import { vocabReviewStatusLabel, vocabSourceLabel } from "@/lib/vocabulary/uiLabels";

function formatWhen(iso: string, locale: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(locale, {
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
  ui: PrototypeUiText;
  dateLocale: string;
  /** modal = bottom sheet / overlay; inline = desktop side column */
  layout?: "modal" | "inline";
};

export default function VocabularyDetailPanel({
  item,
  canMutate,
  onClose,
  onReview,
  onDelete,
  ui,
  dateLocale,
  layout = "modal",
}: Props) {
  const sourceLabel = vocabSourceLabel(ui, item.sourceType);
  const reviewLabel = vocabReviewStatusLabel(ui, item.reviewStatus);

  const card = (
    <div
      className={
        layout === "inline"
          ? "flex max-h-[calc(100dvh-7rem)] w-full flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-xl"
          : "flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-slate-700/80 bg-slate-950 shadow-2xl sm:rounded-2xl"
      }
      onClick={layout === "modal" ? (e) => e.stopPropagation() : undefined}
      role={layout === "modal" ? "document" : undefined}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-800/90 px-4 py-3">
        <div className="min-w-0 flex-1 space-y-1">
          <VocabularyTypeBadge type={item.type} ui={ui} />
          <h2 id="vocab-detail-title" className="font-wa-serif text-lg font-semibold text-slate-50">
            {item.term}
          </h2>
          <p className="text-[11px] text-slate-500">
            {ui.vocabDetailSavedPrefix} {formatWhen(item.createdAt, dateLocale)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700/80 p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          aria-label={ui.vocabCloseAria}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 text-sm">
        <section className="space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {ui.vocabDetailMeaning}
            </p>
            <p className="mt-1 text-slate-200">{item.meaning?.trim() || "—"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Source</p>
              <p className="mt-1 text-sm text-slate-300">{sourceLabel}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Review status</p>
              <p className="mt-1 text-sm text-slate-300">{reviewLabel}</p>
            </div>
          </div>

          {(item.exampleSentence || item.exampleTranslation) && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {ui.vocabDetailExample}
              </p>
              <p className="mt-1 text-slate-200">{item.exampleSentence?.trim() || "—"}</p>
              {item.exampleTranslation ? (
                <p className="mt-1 text-xs text-slate-500">{item.exampleTranslation}</p>
              ) : null}
            </div>
          )}

          {item.reading ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {ui.vocabDetailReading}
              </p>
              <p className="mt-1 text-slate-300">{item.reading}</p>
            </div>
          ) : null}

          {item.type === "correction" || item.userSentence || item.correctedSentence ? (
            <div className="rounded-xl border border-slate-800/90 bg-slate-900/50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {ui.vocabDetailCorrectionPair}
              </p>
              {item.userSentence ? (
                <p className="mt-2 text-xs text-slate-500">{ui.vocabDetailYourSentence}</p>
              ) : null}
              {item.userSentence ? <p className="mt-0.5 text-slate-300">{item.userSentence}</p> : null}
              <p className="mt-2 text-xs text-slate-500">{ui.vocabDetailCorrectedLabel}</p>
              <p className="mt-0.5 text-emerald-200/95">{item.correctedSentence || item.term}</p>
              {item.mistakeNote ? (
                <>
                  <p className="mt-2 text-xs text-slate-500">{ui.vocabDetailNote}</p>
                  <p className="mt-0.5 text-slate-400">{item.mistakeNote}</p>
                </>
              ) : null}
            </div>
          ) : null}

          {item.aiComment ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {ui.vocabDetailAiNote}
              </p>
              <p className="mt-1 text-slate-300">{item.aiComment}</p>
            </div>
          ) : null}

          {item.tags.length > 0 ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {ui.vocabDetailTags}
              </p>
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
              {ui.vocabDetailTopicOnly}
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-200 hover:bg-red-500/15 sm:w-auto"
            >
              <Trash2 className="h-4 w-4" />
              {ui.vocabActionDelete}
            </button>
            <button
              type="button"
              onClick={onReview}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-medium text-emerald-100 hover:bg-emerald-500/20 sm:w-auto"
            >
              <CheckCircle className="h-4 w-4" />
              {ui.vocabActionMarkReviewed}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-slate-200 sm:w-auto"
          >
            {ui.vocabActionClose}
          </button>
        )}
      </div>
    </div>
  );

  if (layout === "inline") {
    return card;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vocab-detail-title"
      onClick={onClose}
    >
      {card}
    </div>
  );
}
