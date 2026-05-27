export type GuidedTutorialStep =
  | "welcome"
  | "chat_intro"
  | "chat_sent"
  | "correction_seen"
  | "save_prompt"
  | "vocabulary_intro"
  | "progress_intro"
  | "complete";

export type GuidedTutorialSession = {
  step: GuidedTutorialStep;
  chatSessionId?: string;
  assistantMessageId?: number;
  savedVocabularyId?: string;
  startedAt: string;
};
