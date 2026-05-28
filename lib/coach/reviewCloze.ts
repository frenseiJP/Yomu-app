import { buildClozeFromCorrection } from "@/lib/coach/clozeDrill";
import { isVocabularyDueForReview } from "@/lib/vocabulary/selectors";
import type { VocabularyItem } from "@/lib/vocabulary/types";

function reviewUrgency(item: VocabularyItem, todayYmd: string): number {
  if (item.reviewStatus === "new") return 10_000;
  if (!item.nextReviewDate) return 3_000;
  const day = Date.parse(`${item.nextReviewDate}T00:00:00Z`);
  const today = Date.parse(`${todayYmd}T00:00:00Z`);
  const daysLate = Math.floor((today - day) / 86_400_000);
  return daysLate >= 0 ? 2_000 + daysLate : 1_000 + daysLate;
}

/** First due correction that yields a valid cloze (forgetting-first). */
export function pickDueCorrectionForCloze(
  items: VocabularyItem[],
  todayYmd: string,
): VocabularyItem | null {
  const candidates = items
    .filter(
      (item) =>
        item.type === "correction" &&
        isVocabularyDueForReview(item, todayYmd) &&
        Boolean((item.correctedSentence ?? item.term).trim()),
    )
    .sort((a, b) => reviewUrgency(b, todayYmd) - reviewUrgency(a, todayYmd));

  for (const item of candidates) {
    const corrected = (item.correctedSentence ?? item.term).trim();
    const user = item.userSentence?.trim();
    if (buildClozeFromCorrection(corrected, user)) return item;
  }
  return null;
}
