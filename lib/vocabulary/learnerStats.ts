import { getVocabularyLibrary } from "@/lib/vocabulary/service";
import type { VocabularyItem } from "@/lib/vocabulary/types";

export function getLearnerVocabulary(userId: string): VocabularyItem[] {
  return getVocabularyLibrary(userId);
}

export function getSavedWordCount(userId: string): number {
  return getLearnerVocabulary(userId).filter(
    (v) => v.type === "word" || v.type === "phrase",
  ).length;
}

export function getCorrectionItems(userId: string): VocabularyItem[] {
  return getLearnerVocabulary(userId).filter((v) => v.type === "correction");
}

export function getRecentCorrectionsForCoach(
  userId: string,
  limit = 3,
): { original: string; corrected: string; explanation: string }[] {
  return getCorrectionItems(userId)
    .slice(0, limit)
    .map((v) => ({
      original: (v.userSentence ?? v.term).slice(0, 200),
      corrected: (v.correctedSentence ?? v.term).slice(0, 200),
      explanation: (v.mistakeNote ?? v.meaning ?? "Saved correction").slice(0, 200),
    }))
    .filter((m) => m.original.length > 0);
}
