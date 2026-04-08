import type { VocabularyFilterState, VocabularyItem } from "@/lib/vocabulary/types";

function contains(h: string | undefined, q: string): boolean {
  return (h ?? "").toLowerCase().includes(q);
}

export function filterVocabulary(items: VocabularyItem[], filter: VocabularyFilterState): VocabularyItem[] {
  const q = filter.query.trim().toLowerCase();
  const today = new Date().toISOString().slice(0, 10);
  return items.filter((item) => {
    if (filter.type !== "all" && item.type !== filter.type) return false;
    if (filter.tag && !item.tags.includes(filter.tag)) return false;
    if (filter.reviewStatus === "due") {
      if (!item.nextReviewDate || item.nextReviewDate > today) return false;
    } else if (filter.reviewStatus !== "all" && item.reviewStatus !== filter.reviewStatus) {
      return false;
    }
    if (!q) return true;
    return (
      contains(item.term, q) ||
      contains(item.meaning, q) ||
      contains(item.exampleSentence, q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}
