export type SaveCandidateType = "word" | "phrase" | "correction";

export interface SaveCandidate {
  id: string;
  type: SaveCandidateType;
  label: string;
  /** Japanese term (primary display + storage). */
  term: string;
  /** Short English gloss for review. */
  meaning: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  /** @deprecated Use `term`. */
  primaryText: string;
  /** @deprecated Use `meaning`. */
  secondaryText?: string;
  explanation?: string;
  tags: string[];
  sourceMessageId?: string;
  sourceSessionId?: string;
  alreadySaved: boolean;
}

export interface GetRecommendedSaveCandidatesParams {
  aiMessageContent: string;
  userMessageContent?: string;
  correctedSentence?: string;
  messageId?: string;
  sessionId?: string;
  existingItems: {
    type: "word" | "phrase" | "correction";
    term: string;
    userSentence?: string;
    correctedSentence?: string;
    updatedAt?: string;
  }[];
  topicCategory?: string;
}
