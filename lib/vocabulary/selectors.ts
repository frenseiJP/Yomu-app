import type { VocabularyFilterState, VocabularyItem } from "@/lib/vocabulary/types";

function contains(h: string | undefined, q: string): boolean {
  return (h ?? "").toLowerCase().includes(q);
}

/** Items that should appear under the Review tab (due or never reviewed). */
export function isVocabularyDueForReview(item: VocabularyItem, todayYmd: string): boolean {
  if (item.reviewStatus === "new") return true;
  if (item.nextReviewDate && item.nextReviewDate <= todayYmd) return true;
  return false;
}

export function filterVocabulary(items: VocabularyItem[], filter: VocabularyFilterState): VocabularyItem[] {
  const q = filter.query.trim().toLowerCase();
  const today = new Date().toISOString().slice(0, 10);
  return items.filter((item) => {
    if (filter.category === "review") {
      if (!isVocabularyDueForReview(item, today)) return false;
    } else if (filter.category !== "all" && item.type !== filter.category) return false;
    if (filter.tag && !item.tags.includes(filter.tag)) return false;
    if (!q) return true;
    return (
      contains(item.term, q) ||
      contains(item.meaning, q) ||
      contains(item.exampleSentence, q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}
