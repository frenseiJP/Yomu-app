import { getOrCreateUserId } from "@/lib/chat/service";
import { getRecommendedSaveCandidates } from "@/lib/save-candidates/extract";
import type { GetRecommendedSaveCandidatesParams, SaveCandidate } from "@/lib/save-candidates/types";
import { listVocabularyByUser, upsertVocabulary } from "@/lib/vocabulary/storage";
import type { VocabularyItem } from "@/lib/vocabulary/types";

function nowIso(): string {
  return new Date().toISOString();
}

function norm(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

function makeId(): string {
  return `vocab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function toVocabularyItem(candidate: SaveCandidate, userId: string): VocabularyItem {
  const now = nowIso();
  if (candidate.type === "correction") {
    const corrected = candidate.primaryText;
    const userSentence = (candidate.secondaryText ?? "").replace(/^Your answer:\s*/i, "");
    return {
      id: makeId(),
      userId,
      type: "correction",
      term: corrected,
      userSentence,
      correctedSentence: corrected,
      mistakeNote: candidate.explanation,
      aiComment: "Saved from recommended correction.",
      sourceType: "chat",
      sourceSessionId: candidate.sourceSessionId,
      sourceMessageId: candidate.sourceMessageId,
      tags: ["correction", ...candidate.tags],
      reviewStatus: "new",
      nextReviewDate: now.slice(0, 10),
      createdAt: now,
      updatedAt: now,
    };
  }
  if (candidate.type === "phrase") {
    return {
      id: makeId(),
      userId,
      type: "phrase",
      term: candidate.primaryText,
      meaning: candidate.secondaryText,
      exampleSentence: candidate.primaryText,
      aiComment: candidate.explanation,
      sourceType: "chat",
      sourceSessionId: candidate.sourceSessionId,
      sourceMessageId: candidate.sourceMessageId,
      tags: candidate.tags,
      reviewStatus: "new",
      nextReviewDate: now.slice(0, 10),
      createdAt: now,
      updatedAt: now,
    };
  }
  return {
    id: makeId(),
    userId,
    type: "word",
    term: candidate.primaryText,
    meaning: candidate.secondaryText,
    sourceType: "chat",
    sourceSessionId: candidate.sourceSessionId,
    sourceMessageId: candidate.sourceMessageId,
    tags: candidate.tags,
    reviewStatus: "new",
    nextReviewDate: now.slice(0, 10),
    createdAt: now,
    updatedAt: now,
  };
}

function findDuplicate(items: VocabularyItem[], item: VocabularyItem): VocabularyItem | null {
  if (item.type === "correction") {
    const a = norm(item.userSentence ?? "");
    const b = norm(item.correctedSentence ?? "");
    return items.find(
      (x) => x.type === "correction" && norm(x.userSentence ?? "") === a && norm(x.correctedSentence ?? "") === b,
    ) ?? null;
  }
  const t = norm(item.term);
  return items.find((x) => x.type === item.type && norm(x.term) === t) ?? null;
}

export function recommendCandidatesForMessage(params: Omit<GetRecommendedSaveCandidatesParams, "existingItems">): SaveCandidate[] {
  const userId = getOrCreateUserId();
  const existing = listVocabularyByUser(userId);
  const candidates = getRecommendedSaveCandidates({
    ...params,
    existingItems: existing,
  });
  return candidates.map((c) => {
    const item = toVocabularyItem(c, userId);
    const dup = findDuplicate(existing, item);
    return { ...c, alreadySaved: Boolean(dup) };
  });
}

export function saveCandidateToVocabulary(candidate: SaveCandidate): { saved: boolean; item: VocabularyItem } {
  const userId = getOrCreateUserId();
  const all = listVocabularyByUser(userId);
  const item = toVocabularyItem(candidate, userId);
  const dup = findDuplicate(all, item);
  if (dup) {
    const updated: VocabularyItem = { ...dup, updatedAt: nowIso(), reviewStatus: "learning" };
    upsertVocabulary(updated);
    return { saved: false, item: updated };
  }
  upsertVocabulary(item);
  return { saved: true, item };
}
