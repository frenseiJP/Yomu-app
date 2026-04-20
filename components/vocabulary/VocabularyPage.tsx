"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VocabularyCategoryFilters from "@/components/vocabulary/VocabularyCategoryFilters";
import VocabularyDetailPanel from "@/components/vocabulary/VocabularyDetailPanel";
import VocabularyHeader from "@/components/vocabulary/VocabularyHeader";
import VocabularyListRow from "@/components/vocabulary/VocabularyListRow";
import VocabularySearchBar from "@/components/vocabulary/VocabularySearchBar";
import VocabularyTagChips from "@/components/vocabulary/VocabularyTagChips";
import { isVocabularyDueForReview, filterVocabulary } from "@/lib/vocabulary/selectors";
import {
  getVocabularyLibrary,
  isPersistedVocabularyItem,
  markVocabularyItemReviewed,
  removeVocabularyItem,
} from "@/lib/vocabulary/service";
import type { VocabularyFilterState, VocabularyItem } from "@/lib/vocabulary/types";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";

export default function VocabularyPage() {
  const userId = useVocabularyUserId();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<VocabularyItem | null>(null);
  const [filter, setFilter] = useState<VocabularyFilterState>({
    query: "",
    category: "all",
    tag: "",
  });

  const all = useMemo(() => getVocabularyLibrary(userId), [userId, refreshKey]);
  const items = useMemo(() => filterVocabulary(all, filter), [all, filter]);
  const tags = useMemo(() => [...new Set(all.flatMap((x) => x.tags))].sort().slice(0, 24), [all]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const reviewCount = useMemo(() => all.filter((x) => isVocabularyDueForReview(x, today)).length, [all, today]);

  const bump = useCallback(() => setRefreshKey((k) => k + 1), []);

  const handleReview = useCallback(() => {
    if (!selected || !isPersistedVocabularyItem(selected)) return;
    const next = markVocabularyItemReviewed(selected);
    setSelected(next);
    bump();
  }, [selected, bump]);

  const handleDelete = useCallback(() => {
    if (!selected || !isPersistedVocabularyItem(selected)) return;
    removeVocabularyItem(selected.id);
    setSelected(null);
    bump();
  }, [selected, bump]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col gap-4 px-4 py-5 pb-28 sm:px-6 sm:py-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-700/80 text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200"
          aria-label="Back to app"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <VocabularyHeader total={all.length} reviewCount={reviewCount} />
        </div>
      </div>

      <VocabularySearchBar value={filter.query} onChange={(q) => setFilter((p) => ({ ...p, query: q }))} />

      <VocabularyCategoryFilters
        active={filter.category}
        onChange={(category) => setFilter((p) => ({ ...p, category }))}
      />

      <VocabularyTagChips
        tags={tags}
        selected={filter.tag}
        onSelect={(tag) => setFilter((p) => ({ ...p, tag }))}
      />

      <section className="space-y-2 pb-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 text-center text-sm text-slate-400">
            No entries match. Try another search, clear the tag filter, or save phrases from chat.
          </div>
        ) : (
          items.map((item) => (
            <VocabularyListRow key={item.id} item={item} onOpen={() => setSelected(item)} />
          ))
        )}
      </section>

      {selected ? (
        <VocabularyDetailPanel
          item={selected}
          canMutate={isPersistedVocabularyItem(selected)}
          onClose={() => setSelected(null)}
          onReview={handleReview}
          onDelete={() => {
            if (typeof window !== "undefined" && !window.confirm("Remove this entry from your library?")) return;
            handleDelete();
          }}
        />
      ) : null}
    </div>
  );
}
