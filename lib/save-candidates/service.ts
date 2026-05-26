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

function candidateTerm(candidate: SaveCandidate): string {
  return candidate.term || candidate.primaryText;
}

function candidateMeaning(candidate: SaveCandidate): string {
  return candidate.meaning || candidate.secondaryText || "";
}

function toVocabularyItem(candidate: SaveCandidate, userId: string): VocabularyItem {
  const now = nowIso();
  const term = candidateTerm(candidate);
  const meaning = candidateMeaning(candidate);

  if (candidate.type === "correction") {
    const userSentence = (candidate.secondaryText ?? "").replace(/^Your answer:\s*/i, "");
    return {
      id: makeId(),
      userId,
      type: "correction",
      term,
      userSentence,
      correctedSentence: term,
      meaning,
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
      term,
      meaning,
      exampleSentence: candidate.exampleSentence ?? term,
      exampleTranslation: candidate.exampleTranslation,
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
    term,
    meaning,
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
    return (
      items.find(
        (x) => x.type === "correction" && norm(x.userSentence ?? "") === a && norm(x.correctedSentence ?? "") === b,
      ) ?? null
    );
  }
  const t = norm(item.term);
  return items.find((x) => x.type === item.type && norm(x.term) === t) ?? null;
}

export function recommendCandidatesForMessage(
  params: Omit<GetRecommendedSaveCandidatesParams, "existingItems">,
  scopedUserId?: string,
): SaveCandidate[] {
  const userId = scopedUserId?.trim() || getOrCreateUserId();
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

export function saveCandidateToVocabulary(
  candidate: SaveCandidate,
  scopedUserId?: string,
): { saved: boolean; item: VocabularyItem } {
  const userId = scopedUserId?.trim() || getOrCreateUserId();
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
