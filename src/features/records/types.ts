export type MistakeType =
  | "particle"
  | "politeness"
  | "grammar"
  | "vocabulary"
  | "unnatural_expression"
  | "pronunciation_note"
  | "other";

export type EmotionFeeling =
  | "motivated"
  | "confused"
  | "frustrated"
  | "happy"
  | "tired"
  | "nervous"
  | "proud"
  | "other";

export interface SavedWord {
  id: string;
  userId: string;
  word: string;
  reading?: string;
  meaning: string;
  exampleSentence: string;
  exampleTranslation?: string;
  sourceMessageId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedPhrase {
  id: string;
  userId: string;
  phrase: string;
  meaning: string;
  exampleSentence: string;
  exampleTranslation?: string;
  contextNote?: string;
  sourceMessageId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MistakeLog {
  id: string;
  userId: string;
  originalText: string;
  correctedText: string;
  explanation: string;
  mistakeType: MistakeType;
  sourceMessageId?: string;
  reviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmotionLog {
  id: string;
  userId: string;
  sessionId: string;
  confidenceLevel: 1 | 2 | 3 | 4 | 5;
  feeling: EmotionFeeling;
  memo?: string;
  createdAt: string;
}

export interface SessionSummary {
  id: string;
  userId: string;
  sessionId: string;
  learnedWords: string[];
  learnedPhrases: string[];
  keyMistakes: string[];
  encouragement: string;
  nextFocus: string;
  confidenceLevel?: 1 | 2 | 3 | 4 | 5;
  feeling?: EmotionFeeling;
  createdAt: string;
}

export interface LearningActivity {
  id: string;
  userId: string;
  sessionId: string;
  activityDate: string; // YYYY-MM-DD
  messageCount: number;
  savedWordCount: number;
  savedPhraseCount: number;
  mistakeCount: number;
  sessionDurationSec?: number;
  createdAt: string;
  updatedAt: string;
}

