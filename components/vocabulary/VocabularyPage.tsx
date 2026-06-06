"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import VocabularyCategoryFilters from "@/components/vocabulary/VocabularyCategoryFilters";
import VocabularyDetailPanel from "@/components/vocabulary/VocabularyDetailPanel";
import VocabularyHeader from "@/components/vocabulary/VocabularyHeader";
import VocabularyListRow from "@/components/vocabulary/VocabularyListRow";
import VocabularySearchBar from "@/components/vocabulary/VocabularySearchBar";
import VocabularyTagChips from "@/components/vocabulary/VocabularyTagChips";
import { isVocabularyDueForReview, filterVocabulary, sortVocabularyForLearning } from "@/lib/vocabulary/selectors";
import {
  getVocabularyLibrary,
  isPersistedVocabularyItem,
  markVocabularyItemReviewed,
  removeVocabularyItem,
} from "@/lib/vocabulary/service";
import ReviewClozePanel from "@/components/coach/ReviewClozePanel";
import type { VocabularyFilterState, VocabularyItem, VocabularyListCategory } from "@/lib/vocabulary/types";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";
import { createClient } from "@/src/utils/supabase/client";
import TutorialHintCard from "@/components/tutorial/TutorialHintCard";
import { getTutorialHintCopy } from "@/lib/tutorial/copy";
import {
  clearGuidedTutorialSession,
  readGuidedTutorialSession,
  writeGuidedTutorialSession,
} from "@/lib/tutorial/session";
import {
  pagePaddingX,
  shellNarrow,
  shellViewFrame,
  shellWide,
} from "@/lib/layout/pageShell";
import { dateLocaleForLang, getPrototypeCopy } from "@/src/utils/i18n/prototypeCopy";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import type { Lang } from "@/src/utils/i18n/types";

type VocabularyPageProps = {
  /** Render inside YomuPrototypePage (bottom nav, no modal overlay). */
  inAppShell?: boolean;
  isLightTheme?: boolean;
  onNavigateHome?: () => void;
  onNavigateChat?: () => void;
  onNavigateTopic?: () => void;
  /** Open directly on Review tab (e.g. from Home). */
  initialCategory?: VocabularyListCategory;
};

export default function VocabularyPage({
  inAppShell = false,
  isLightTheme = false,
  onNavigateHome,
  onNavigateChat,
  onNavigateTopic,
  initialCategory,
}: VocabularyPageProps) {
  const emptyPanel = isLightTheme
    ? "border-neutral-200/90 bg-neutral-50/95"
    : "border-slate-800/80 bg-slate-950/70";
  const emptyTitle = isLightTheme ? "text-neutral-900" : "text-slate-100";
  const emptyBody = isLightTheme ? "text-neutral-600" : "text-slate-400";
  const emptyBtnPrimary = isLightTheme
    ? "border-wa-ruri/40 bg-sky-50 text-neutral-900 hover:bg-sky-100"
    : "border-wa-ruri/50 bg-wa-ruri/20 text-slate-100 hover:bg-wa-ruri/30";
  const emptyBtnSecondary = isLightTheme
    ? "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50"
    : "border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-900";
  const userId = useVocabularyUserId();
  const [chatBase, setChatBase] = useState<"/chat" | "/app">("/app");
  const [appLang, setAppLang] = useState<Lang>("en");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<VocabularyItem | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filter, setFilter] = useState<VocabularyFilterState>({
    query: "",
    category: initialCategory ?? "all",
    tag: "",
  });

  useEffect(() => {
    if (initialCategory) {
      setFilter((p) => ({ ...p, category: initialCategory }));
    }
  }, [initialCategory]);

  useEffect(() => {
    setAppLang(getLangClient());
  }, []);

  useEffect(() => {
    let cancelled = false;
    void createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!cancelled) setChatBase(data.user ? "/chat" : "/app");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { uiText } = useMemo(() => getPrototypeCopy(appLang), [appLang]);
  const dateLocale = useMemo(() => dateLocaleForLang(appLang), [appLang]);

  const all = useMemo(() => getVocabularyLibrary(userId), [userId, refreshKey]);
  const items = useMemo(() => sortVocabularyForLearning(filterVocabulary(all, filter), filter), [all, filter]);
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
    window.location.assign("/?view=progress");
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

  const detailPanelProps = selected
    ? {
        item: selected,
        canMutate: isPersistedVocabularyItem(selected),
        onClose: () => setSelected(null),
        onReview: handleReview,
        onDelete: handleDelete,
        ui: uiText,
        dateLocale,
      }
    : null;

  const contentWidth = selected ? shellWide : shellNarrow;

  const inner = (
    <div className={`mx-auto w-full ${contentWidth} ${pagePaddingX} py-5 sm:py-6 lg:py-8`}>
      <div
        className={
          selected
            ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-start lg:gap-6"
            : "w-full"
        }
      >
        <div className="min-w-0 space-y-4">
          <div className="flex items-center gap-3">
            {inAppShell && onNavigateHome ? (
              <button
                type="button"
                onClick={onNavigateHome}
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-700/80 text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200"
                aria-label={uiText.vocabLibBackAria}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : null}
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

          {tags.length > 0 ? (
            <div className="rounded-xl border border-slate-800/60 bg-slate-950/45 px-3 py-2">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className="text-xs font-medium text-slate-300"
              >
                {filtersOpen ? "Hide tag filters" : "More filters"}
              </button>
              {filtersOpen ? (
                <div className="mt-2">
                  <VocabularyTagChips
                    tags={tags}
                    selected={filter.tag}
                    onSelect={(tag) => setFilter((p) => ({ ...p, tag }))}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {filter.category === "review" ? (
            <ReviewClozePanel
              userId={userId}
              items={all}
              todayYmd={today}
              onReviewed={bump}
            />
          ) : null}

          <section className="space-y-2 pb-4">
            {all.length === 0 ? (
              <div className={`w-full rounded-2xl border p-6 ${emptyPanel}`}>
                <h2 className={`text-base font-semibold ${emptyTitle}`}>
                  Your vocabulary library is empty for now.
                </h2>
                <p className={`mt-2 text-sm leading-relaxed ${emptyBody}`}>
                  Save useful phrases, corrections, and words from Chat or scenario practice to build your
                  personal Japanese library.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {inAppShell && onNavigateChat ? (
                    <button
                      type="button"
                      onClick={onNavigateChat}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium sm:w-auto ${emptyBtnPrimary}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Start chatting
                    </button>
                  ) : (
                    <a
                      href={chatBase}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium sm:w-auto ${emptyBtnPrimary}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Start chatting
                    </a>
                  )}
                  {inAppShell && onNavigateTopic ? (
                    <button
                      type="button"
                      onClick={onNavigateTopic}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium sm:w-auto ${emptyBtnSecondary}`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Try a scenario
                    </button>
                  ) : (
                    <a
                      href="/app?scenario=today"
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium sm:w-auto ${emptyBtnSecondary}`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Try a scenario
                    </a>
                  )}
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 text-center text-sm text-slate-400">
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
                  <VocabularyListRow item={item} ui={uiText} onOpen={() => setSelected(item)} />
                </div>
              ))
            )}
          </section>

          {inAppShell && detailPanelProps ? (
            <div className="lg:hidden">
              <VocabularyDetailPanel {...detailPanelProps} layout="inline" />
            </div>
          ) : null}
        </div>

        {selected && detailPanelProps ? (
          <aside className="hidden min-w-0 lg:block">
            <VocabularyDetailPanel {...detailPanelProps} layout="inline" />
          </aside>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {inAppShell ? (
        <div className={`${shellViewFrame} py-4 sm:py-6`}>{inner}</div>
      ) : (
        <div className="mx-auto min-h-[100dvh] w-full overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">
          {inner}
        </div>
      )}

      {!inAppShell && detailPanelProps ? (
        <div className="lg:hidden">
          <VocabularyDetailPanel {...detailPanelProps} layout="modal" />
        </div>
      ) : null}

      {vocabTutorialHint ? (
        <TutorialHintCard
          stepKey="vocabulary_intro"
          title={vocabTutorialHint.title}
          body={vocabTutorialHint.body}
          cta={vocabTutorialHint.cta}
          placement="bottom"
          startCollapsed
          autoCollapseAfterMs={3500}
          skipLabel={isJa ? "スキップ" : "Skip"}
          onSkip={skipVocabTutorial}
          onCta={goToProgressTutorial}
        />
      ) : null}
    </>
  );
}
