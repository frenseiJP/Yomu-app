/**
 * Daily habit loop types (MVP, localStorage).
 * DB移行時は同じ形で Supabase テーブルにマップ可能。
 */

export type MissionTaskType = "speak" | "correct" | "recall" | "create_sentence";

export interface MissionTask {
  id: string;
  type: MissionTaskType;
  instruction: string;
  relatedWord?: string;
  relatedMistakeId?: string;
  completed: boolean;
}

/** One mission per calendar day per user */
export interface HabitDailyMission {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  tasks: MissionTask[];
  createdAt: string;
}

export type ReviewIntervalStep = 0 | 1 | 2;

/** Spaced repetition queue item for a saved word */
export interface WordReviewEntry {
  id: string;
  userId: string;
  /** Optional link to records SavedWord.id */
  relatedWordId?: string;
  word: string;
  meaningHint: string;
  nextReviewDate: string; // YYYY-MM-DD
  intervalStep: ReviewIntervalStep;
  createdAt: string;
  updatedAt: string;
}

export interface MistakeReviewEntry {
  id: string;
  userId: string;
  mistakeLogId: string;
  originalText: string;
  correctedText: string;
  nextReviewDate: string;
  intervalStep: ReviewIntervalStep;
  createdAt: string;
  updatedAt: string;
}

export interface DueReviews {
  words: WordReviewEntry[];
  mistakes: MistakeReviewEntry[];
}

export interface UserStats {
  streak: number;
  totalWords: number;
  totalMistakes: number;
  totalSessions: number;
  mistakesFixed: number;
  totalTopicPractices: number;
}

export interface MissionStore {
  /** date -> mission */
  byDate: Record<string, HabitDailyMission>;
}

export interface ReviewStore {
  words: WordReviewEntry[];
  mistakes: MistakeReviewEntry[];
}

export type MistakeCategoryKey =
  | "particle"
  | "politeness"
  | "tense"
  | "word_choice"
  | "word_order"
  | "register"
  | "other";

export interface CategoryMasteryState {
  /** 0–100 mastery score per category */
  score: number;
  attempts: number;
  lastAt?: string;
}

export interface UserProgressV1 {
  activeDays: string[];
  totalChatMessages: number;
  missionsCompletedCount: number;
  reviewsCompletedCount: number;
  mistakesFixedCount: number;
  learningDays: string[];
  lastSessionSummarySnippet?: string;
  dailyJapaneseChars?: Record<string, number>;
  correctedReuseCount?: number;
  weakDrillHistory?: {
    at: string;
    category: string;
    score: number;
    maxScore: number;
  }[];
  categoryMastery?: Partial<Record<MistakeCategoryKey, CategoryMasteryState>>;
  weeklyCategoryGoal?: {
    weekKey: string;
    category: MistakeCategoryKey;
    startScore: number;
    targetScore: number;
  };
}

/** Serializable payload sent to /api/chat */
export interface CoachContextPayload {
  recentMistakes: { original: string; corrected: string; explanation: string }[];
  streak: number;
  lastMissionSummary: string;
  lastSummary: string;
  coachToneNote: string;
  sessionGoal?: string;
  /** e.g. "Particles" — gentle skill-path focus for Sensei */
  focusCategory?: string;
  focusCategoryHint?: string;
  focusCategoryScore?: number;
  jlptLevel?: string;
}
