"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
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
import TutorialHintCard from "@/components/tutorial/TutorialHintCard";
import { getTutorialHintCopy } from "@/lib/tutorial/copy";
import {
  clearGuidedTutorialSession,
  readGuidedTutorialSession,
  writeGuidedTutorialSession,
} from "@/lib/tutorial/session";
import { dateLocaleForLang, getPrototypeCopy } from "@/src/utils/i18n/prototypeCopy";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import type { Lang } from "@/src/utils/i18n/types";

export default function VocabularyPage() {
  const pathname = usePathname();
  const userId = useVocabularyUserId();
  const [appLang, setAppLang] = useState<Lang>("en");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<VocabularyItem | null>(null);
  const [filter, setFilter] = useState<VocabularyFilterState>({
    query: "",
    category: "all",
    tag: "",
  });

  useEffect(() => {
    setAppLang(getLangClient());
  }, [pathname]);

  const { uiText } = useMemo(() => getPrototypeCopy(appLang), [appLang]);
  const dateLocale = useMemo(() => dateLocaleForLang(appLang), [appLang]);

  const all = useMemo(() => getVocabularyLibrary(userId), [userId, refreshKey]);
  const items = useMemo(() => filterVocabulary(all, filter), [all, filter]);
  const tags = useMemo(() => [...new Set(all.flatMap((x) => x.tags))].sort().slice(0, 24), [all]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const reviewCount = useMemo(() => all.filter((x) => isVocabularyDueForReview(x, today)).length, [all, today]);

  const [tutorialHighlightId, setTutorialHighlightId] = useState<string | null>(null);

  useEffect(() => {
    const sess = readGuidedTutorialSession();
    if (sess?.step === "vocabulary_intro") {
      setTutorialHighlightId(sess.savedVocabularyId ?? null);
    }
  }, [refreshKey]);

  const isJa = appLang === "ja";
  const vocabTutorialHint =
    readGuidedTutorialSession()?.step === "vocabulary_intro"
      ? getTutorialHintCopy("vocabulary_intro", isJa)
      : null;

  const goToProgressTutorial = useCallback(() => {
    writeGuidedTutorialSession({
      step: "progress_intro",
      startedAt: readGuidedTutorialSession()?.startedAt ?? new Date().toISOString(),
    });
    window.location.assign("/");
  }, []);

  const skipVocabTutorial = useCallback(() => {
    clearGuidedTutorialSession();
    setTutorialHighlightId(null);
  }, []);

  const bump = useCallback(() => setRefreshKey((k) => k + 1), []);

  const handleReview = useCallback(() => {
    if (!selected || !isPersistedVocabularyItem(selected)) return;
    const next = markVocabularyItemReviewed(selected);
    setSelected(next);
    bump();
  }, [selected, bump]);

  const handleDelete = useCallback(() => {
    if (!selected || !isPersistedVocabularyItem(selected)) return;
    if (typeof window !== "undefined" && !window.confirm(uiText.vocabDeleteConfirm)) return;
    removeVocabularyItem(selected.id);
    setSelected(null);
    bump();
  }, [selected, bump, uiText.vocabDeleteConfirm]);

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
          aria-label={uiText.vocabLibBackAria}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <VocabularyHeader total={all.length} reviewCount={reviewCount} ui={uiText} />
        </div>
      </div>

      <VocabularySearchBar
        value={filter.query}
        onChange={(q) => setFilter((p) => ({ ...p, query: q }))}
        ui={uiText}
      />

      <VocabularyCategoryFilters
        active={filter.category}
        onChange={(category) => setFilter((p) => ({ ...p, category }))}
        ui={uiText}
      />

      <VocabularyTagChips
        tags={tags}
        selected={filter.tag}
        onSelect={(tag) => setFilter((p) => ({ ...p, tag }))}
      />

      <section className="space-y-2 pb-4">
        {all.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6">
            <h2 className="text-base font-semibold text-slate-100">Your vocabulary library is empty for now.</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Save useful phrases, corrections, and words from Chat or Topic Practice to build your personal Japanese
              library.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl border border-wa-ruri/50 bg-wa-ruri/20 px-3.5 py-2 text-xs font-medium text-slate-100 hover:bg-wa-ruri/30"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Start chatting
              </Link>
              <Link
                href="/topic"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-900"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Try Topic Practice
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 text-center text-sm text-slate-400">
            {uiText.vocabLibEmpty}
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={
                tutorialHighlightId && item.id === tutorialHighlightId
                  ? "rounded-2xl ring-2 ring-wa-ruri/55 ring-offset-2 ring-offset-[#020617]"
                  : undefined
              }
            >
              <VocabularyListRow
                item={item}
                ui={uiText}
                onOpen={() => setSelected(item)}
              />
            </div>
          ))
        )}
      </section>

      {selected ? (
        <VocabularyDetailPanel
          item={selected}
          canMutate={isPersistedVocabularyItem(selected)}
          onClose={() => setSelected(null)}
          onReview={handleReview}
          onDelete={handleDelete}
          ui={uiText}
          dateLocale={dateLocale}
        />
      ) : null}

      {vocabTutorialHint ? (
        <TutorialHintCard
          title={vocabTutorialHint.title}
          body={vocabTutorialHint.body}
          cta={vocabTutorialHint.cta}
          placement="top-right"
          skipLabel={isJa ? "スキップ" : "Skip"}
          onSkip={skipVocabTutorial}
          onCta={goToProgressTutorial}
        />
      ) : null}
    </div>
  );
}
