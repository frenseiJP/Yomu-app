import type {
  EmotionLog,
  LearningActivity,
  MistakeLog,
  SavedPhrase,
  SavedWord,
  SessionSummary,
} from "@/src/features/records/types";

export type RepositoryCreateInput<T extends { id: string; userId: string; createdAt: string }> = Omit<
  T,
  "id" | "userId" | "createdAt" | "updatedAt"
> &
  Partial<Pick<T, "id" | "createdAt">>;

export interface UserScopedRepository<
  T extends { id: string; userId: string; createdAt: string },
> {
  getAllByUser(userId: string): T[];
  getBySession(userId: string, sessionId: string): T[];
  create(userId: string, input: RepositoryCreateInput<T>): T;
  update(
    userId: string,
    id: string,
    patch: Partial<Omit<T, "id" | "userId" | "createdAt">>,
  ): T | null;
  delete(userId: string, id: string): boolean;
}

export interface RecordsStorage {
  savedWords: UserScopedRepository<SavedWord>;
  savedPhrases: UserScopedRepository<SavedPhrase>;
  mistakeLogs: UserScopedRepository<MistakeLog>;
  emotionLogs: UserScopedRepository<EmotionLog>;
  sessionSummaries: UserScopedRepository<SessionSummary>;
  learningActivities: UserScopedRepository<LearningActivity>;
}

