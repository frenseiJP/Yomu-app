"use client";

import { useMemo, useState } from "react";
import { getOrCreateUserId } from "@/lib/chat/service";
import { filterVocabulary } from "@/lib/vocabulary/selectors";
import { getVocabularyLibrary } from "@/lib/vocabulary/service";
import type { VocabularyFilterState, VocabularyItem } from "@/lib/vocabulary/types";

export default function VocabularyPage() {
  const [selected, setSelected] = useState<VocabularyItem | null>(null);
  const [filter, setFilter] = useState<VocabularyFilterState>({
    query: "",
    type: "all",
    tag: "",
    reviewStatus: "all",
  });
  const userId = getOrCreateUserId();
  const all = useMemo(() => getVocabularyLibrary(userId), [userId]);
  const items = useMemo(() => filterVocabulary(all, filter), [all, filter]);
  const tags = useMemo(() => [...new Set(all.flatMap((x) => x.tags))].slice(0, 12), [all]);
  const dueCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return all.filter((x) => x.nextReviewDate && x.nextReviewDate <= today).length;
  }, [all]);

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col gap-4 px-4 py-5 sm:px-6">
      <header>
        <h1 className="font-wa-serif text-xl font-semibold text-slate-100">Vocabulary</h1>
        <p className="mt-1 text-sm text-slate-400">Your personal Japanese learning library</p>
      </header>

      <section className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-300">Total {all.length}</div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-300">Due {dueCount}</div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-300">Recent {Math.min(5, all.length)}</div>
      </section>

      <input
        value={filter.query}
        onChange={(e) => setFilter((p) => ({ ...p, query: e.target.value }))}
        placeholder="Search term, meaning, tags..."
        className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none"
      />

      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {[
          ["all", "All"],
          ["word", "Words"],
          ["phrase", "Phrases"],
        ].map(([v, label]) => (
          <button
            key={v}
            type="button"
            onClick={() => setFilter((p) => ({ ...p, type: v as VocabularyFilterState["type"] }))}
            className={`rounded-full border px-3 py-1.5 ${
              filter.type === v ? "border-wa-ruri bg-wa-ruri/20 text-slate-100" : "border-slate-700 text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setFilter((p) => ({ ...p, reviewStatus: p.reviewStatus === "due" ? "all" : "due" }))}
          className={`rounded-full border px-3 py-1.5 ${
            filter.reviewStatus === "due"
              ? "border-amber-500 bg-amber-500/20 text-amber-200"
              : "border-slate-700 text-slate-400"
          }`}
        >
          Needs Review
        </button>
      </div>

      {tags.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilter((p) => ({ ...p, tag: p.tag === tag ? "" : tag }))}
              className={`rounded-full border px-2.5 py-1 ${
                filter.tag === tag ? "border-sky-400 bg-sky-400/20 text-sky-100" : "border-slate-700 text-slate-400"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      ) : null}

      <section className="space-y-2 pb-8">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-400">
            No matching items found. Try a different keyword or tag.
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-slate-100">{item.term}</p>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">{item.type}</span>
              </div>
              <p className="mt-1 text-sm text-slate-300">{item.meaning}</p>
              <p className="mt-1 line-clamp-1 text-xs text-slate-500">{item.exampleSentence}</p>
            </button>
          ))
        )}
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 bg-black/60 p-4">
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-slate-700 bg-slate-950 p-4">
            <p className="font-wa-serif text-lg text-slate-50">{selected.term}</p>
            <p className="mt-1 text-sm text-slate-300">{selected.meaning}</p>
            <p className="mt-3 text-xs text-slate-500">Example</p>
            <p className="text-sm text-slate-300">{selected.exampleSentence}</p>
            {selected.userSentence ? (
              <>
                <p className="mt-3 text-xs text-slate-500">Your learning note</p>
                <p className="text-sm text-slate-300">{selected.userSentence}</p>
                {selected.correctedSentence ? <p className="mt-1 text-sm text-emerald-300">{selected.correctedSentence}</p> : null}
              </>
            ) : null}
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-4 rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-100"
            >
              Back
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
