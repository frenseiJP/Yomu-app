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

function reviewUrgencyScore(item: VocabularyItem, todayYmd: string): number {
  if (item.reviewStatus === "new") return 10_000;
  if (!item.nextReviewDate) return 3_000;
  const day = Date.parse(`${item.nextReviewDate}T00:00:00Z`);
  const today = Date.parse(`${todayYmd}T00:00:00Z`);
  const daysLate = Math.floor((today - day) / 86_400_000);
  return daysLate >= 0 ? 2_000 + daysLate : 1_000 + daysLate;
}

/**
 * Forgetting-first ordering:
 * - Review tab: new and overdue items first
 * - Other tabs: newest updates first
 */
export function sortVocabularyForLearning(items: VocabularyItem[], filter: VocabularyFilterState): VocabularyItem[] {
  const today = new Date().toISOString().slice(0, 10);
  const arr = [...items];
  if (filter.category === "review") {
    arr.sort((a, b) => {
      const scoreDiff = reviewUrgencyScore(b, today) - reviewUrgencyScore(a, today);
      if (scoreDiff !== 0) return scoreDiff;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
    return arr;
  }
  arr.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return arr;
}
