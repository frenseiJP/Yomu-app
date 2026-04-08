import { recordsStorage } from "@/src/features/records/storage";
import { generateRecordId, nowIso } from "@/src/features/records/storage/helpers";
import type {
  DueReviews,
  MistakeReviewEntry,
  ReviewIntervalStep,
  ReviewStore,
  WordReviewEntry,
} from "@/lib/habit/types";
import { readHabitJson, writeHabitJson } from "@/lib/habit/storage";
import { todayYmd, addDaysYmd } from "@/lib/habit/date";

const KIND = "reviews_v1";

const INTERVAL_DAYS: [number, number, number] = [1, 3, 7];

function emptyStore(): ReviewStore {
  return { words: [], mistakes: [] };
}

function load(userId: string): ReviewStore {
  return readHabitJson<ReviewStore>(KIND, userId, emptyStore());
}

function save(userId: string, s: ReviewStore): void {
  writeHabitJson(KIND, userId, s);
}

/** Ensure queue has items from saved words / mistakes (idempotent-ish) */
export function ensureReviewQueueSeeded(userId: string): void {
  const store = load(userId);
  const words = recordsStorage.savedWords.getAllByUser(userId);
  const mistakes = recordsStorage.mistakeLogs.getAllByUser(userId);
  const today = todayYmd();
  const existingWordIds = new Set(
    store.words.map((w) => w.relatedWordId).filter(Boolean) as string[],
  );

  for (const sw of words) {
    if (existingWordIds.has(sw.id)) continue;
    store.words.push({
      id: generateRecordId("wrev"),
      userId,
      relatedWordId: sw.id,
      word: sw.word,
      meaningHint: sw.meaning.slice(0, 80),
      nextReviewDate: today,
      intervalStep: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    existingWordIds.add(sw.id);
  }

  const existingMistakeIds = new Set(store.mistakes.map((m) => m.mistakeLogId));
  for (const m of mistakes) {
    if (existingMistakeIds.has(m.id)) continue;
    store.mistakes.push({
      id: generateRecordId("mrev"),
      userId,
      mistakeLogId: m.id,
      originalText: m.originalText,
      correctedText: m.correctedText,
      nextReviewDate: today,
      intervalStep: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    existingMistakeIds.add(m.id);
  }

  save(userId, store);
}

export function getDueReviews(userId: string, today: string = todayYmd()): DueReviews {
  ensureReviewQueueSeeded(userId);
  const store = load(userId);
  const words = store.words.filter((w) => w.nextReviewDate <= today);
  const mistakes = store.mistakes.filter((m) => m.nextReviewDate <= today);
  return { words, mistakes };
}

function nextIntervalStep(step: ReviewIntervalStep, success: boolean): ReviewIntervalStep {
  if (!success) return 0;
  return step >= 2 ? 2 : ((step + 1) as ReviewIntervalStep);
}

function nextDateFromStep(today: string, step: ReviewIntervalStep): string {
  const days = INTERVAL_DAYS[step];
  return addDaysYmd(today, days);
}

export function applyWordReviewResult(
  userId: string,
  entryId: string,
  success: boolean,
): void {
  const store = load(userId);
  const today = todayYmd();
  store.words = store.words.map((w) => {
    if (w.id !== entryId) return w;
    const nextStep = nextIntervalStep(w.intervalStep, success);
    return {
      ...w,
      intervalStep: nextStep,
      nextReviewDate: nextDateFromStep(today, nextStep),
      updatedAt: nowIso(),
    };
  });
  save(userId, store);
}

export function applyMistakeReviewResult(
  userId: string,
  entryId: string,
  success: boolean,
): void {
  const store = load(userId);
  const today = todayYmd();
  store.mistakes = store.mistakes.map((m) => {
    if (m.id !== entryId) return m;
    const nextStep = nextIntervalStep(m.intervalStep, success);
    return {
      ...m,
      intervalStep: nextStep,
      nextReviewDate: nextDateFromStep(today, nextStep),
      updatedAt: nowIso(),
    };
  });
  save(userId, store);
}
