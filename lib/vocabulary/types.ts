export type VocabularyItemType = "word" | "phrase";
export type VocabularySourceType = "chat" | "topic" | "review" | "manual";
export type VocabularyReviewStatus = "new" | "learning" | "reviewed";

export interface VocabularyItem {
  id: string;
  userId: string;
  type: VocabularyItemType;
  term: string;
  reading?: string;
  meaning: string;
  exampleSentence: string;
  exampleTranslation?: string;
  userSentence?: string;
  correctedSentence?: string;
  mistakeNote?: string;
  aiComment?: string;
  topicCategory?: string;
  sourceType: VocabularySourceType;
  sourceSessionId?: string;
  tags: string[];
  reviewStatus: VocabularyReviewStatus;
  nextReviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyFilterState {
  query: string;
  type: "all" | VocabularyItemType;
  tag: string;
  reviewStatus: "all" | VocabularyReviewStatus | "due";
}
