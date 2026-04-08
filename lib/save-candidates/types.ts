export type SaveCandidateType = "correction" | "phrase" | "word";

export interface SaveCandidate {
  id: string;
  type: SaveCandidateType;
  label: string;
  primaryText: string;
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
