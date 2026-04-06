import type { RecordsStorage } from "@/src/features/records/storage/repository";
import { createLocalStorageRepository } from "@/src/features/records/storage/localStorageRepository";
import type {
  EmotionLog,
  LearningActivity,
  MistakeLog,
  SavedPhrase,
  SavedWord,
  SessionSummary,
} from "@/src/features/records/types";

/**
 * MVP の既定実装。
 * 将来 Supabase 実装に差し替える場合は RecordsStorage を満たす別実装を作るだけで良い。
 */
export function createRecordsStorage(): RecordsStorage {
  return {
    savedWords: createLocalStorageRepository<SavedWord>({
      entityKey: "saved_words",
      supportsUpdatedAt: true,
    }),
    savedPhrases: createLocalStorageRepository<SavedPhrase>({
      entityKey: "saved_phrases",
      supportsUpdatedAt: true,
    }),
    mistakeLogs: createLocalStorageRepository<MistakeLog>({
      entityKey: "mistake_logs",
      supportsUpdatedAt: true,
    }),
    emotionLogs: createLocalStorageRepository<EmotionLog>({
      entityKey: "emotion_logs",
      supportsUpdatedAt: false,
    }),
    sessionSummaries: createLocalStorageRepository<SessionSummary>({
      entityKey: "session_summaries",
      supportsUpdatedAt: false,
    }),
    learningActivities: createLocalStorageRepository<LearningActivity>({
      entityKey: "learning_activities",
      supportsUpdatedAt: true,
    }),
  };
}

export const recordsStorage = createRecordsStorage();

export type { RecordsStorage, UserScopedRepository } from "@/src/features/records/storage/repository";
export type {
  EmotionFeeling,
  EmotionLog,
  LearningActivity,
  MistakeLog,
  MistakeType,
  SavedPhrase,
  SavedWord,
  SessionSummary,
} from "@/src/features/records/types";

