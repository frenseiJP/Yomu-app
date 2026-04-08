import type { TopicPracticeResult } from "@/lib/topic/types";
import { listTopicPracticeResultsByUser } from "@/lib/topic/service";
import { getOrCreateUserId } from "@/lib/chat/service";
import { listVocabularyByUser, upsertVocabulary } from "@/lib/vocabulary/storage";
import type { VocabularyItem, VocabularyItemType, VocabularySourceType } from "@/lib/vocabulary/types";

function id(): string {
  return `vocab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function now(): string {
  return new Date().toISOString();
}

export function handleSaveVocabularyItem(
  input: Omit<VocabularyItem, "id" | "createdAt" | "updatedAt" | "userId"> & { userId?: string },
): VocabularyItem {
  const userId = input.userId ?? getOrCreateUserId();
  const t = now();
  const item: VocabularyItem = {
    ...input,
    id: id(),
    userId,
    createdAt: t,
    updatedAt: t,
  };
  upsertVocabulary(item);
  return item;
}

export function createVocabularyFromCorrection(params: {
  userSentence: string;
  correctedSentence: string;
  meaning?: string;
  sourceSessionId?: string;
  userId?: string;
}): VocabularyItem {
  return handleSaveVocabularyItem({
    type: "phrase",
    term: params.correctedSentence,
    meaning: params.meaning ?? "Correction from your practice",
    exampleSentence: params.correctedSentence,
    userSentence: params.userSentence,
    correctedSentence: params.correctedSentence,
    mistakeNote: "Saved from correction",
    sourceType: "chat",
    sourceSessionId: params.sourceSessionId,
    tags: ["correction"],
    reviewStatus: "new",
    nextReviewDate: new Date().toISOString().slice(0, 10),
    userId: params.userId,
  });
}

export function createVocabularyFromTopic(result: TopicPracticeResult, userId?: string): VocabularyItem[] {
  const out: VocabularyItem[] = [];
  out.push(
    handleSaveVocabularyItem({
      type: "phrase",
      term: result.correctedAnswer,
      meaning: "Corrected expression from Topic Practice",
      exampleSentence: result.correctedAnswer,
      userSentence: result.userAnswer,
      correctedSentence: result.correctedAnswer,
      aiComment: result.explanation,
      sourceType: "topic",
      tags: ["topic_practice"],
      reviewStatus: "learning",
      nextReviewDate: new Date().toISOString().slice(0, 10),
      userId,
    }),
  );
  result.alternativeExamples.slice(0, 2).forEach((alt) => {
    out.push(
      handleSaveVocabularyItem({
        type: "phrase",
        term: alt,
        meaning: "Alternative natural expression",
        exampleSentence: alt,
        sourceType: "topic",
        tags: ["topic_practice", "alternative"],
        reviewStatus: "new",
        userId,
      }),
    );
  });
  return out;
}

export function createVocabularyFromChat(params: {
  term: string;
  meaning: string;
  exampleSentence: string;
  type?: VocabularyItemType;
  sourceType?: VocabularySourceType;
  sourceSessionId?: string;
  tags?: string[];
  userId?: string;
}): VocabularyItem {
  return handleSaveVocabularyItem({
    type: params.type ?? "word",
    term: params.term,
    meaning: params.meaning,
    exampleSentence: params.exampleSentence,
    sourceType: params.sourceType ?? "chat",
    sourceSessionId: params.sourceSessionId,
    tags: params.tags ?? [],
    reviewStatus: "new",
    userId: params.userId,
  });
}

export function getVocabularyLibrary(userId?: string): VocabularyItem[] {
  const uid = userId ?? getOrCreateUserId();
  const direct = listVocabularyByUser(uid);
  const topicDerived = listTopicPracticeResultsByUser(uid)
    .slice(0, 20)
    .map((r) => topicToPseudoItem(r, uid));
  return [...direct, ...topicDerived].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

function topicToPseudoItem(r: TopicPracticeResult, userId: string): VocabularyItem {
  return {
    id: `topic_${r.id}`,
    userId,
    type: "phrase",
    term: r.correctedAnswer,
    meaning: "Saved Topic Practice result",
    exampleSentence: r.correctedAnswer,
    userSentence: r.userAnswer,
    correctedSentence: r.correctedAnswer,
    aiComment: r.explanation,
    sourceType: "topic",
    tags: ["topic_practice"],
    reviewStatus: "learning",
    createdAt: r.createdAt,
    updatedAt: r.createdAt,
  };
}
