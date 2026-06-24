import type { CategoryMasteryState, MistakeCategoryKey, UserProgressV1, UserStats } from "@/lib/habit/types";
import { readHabitJson, writeHabitJson } from "@/lib/habit/storage";
import { todayYmd, addDaysYmd, toYmd } from "@/lib/habit/date";
import { listTopicPracticeResultsByUser } from "@/lib/topic/service";
import { readLegacyUiVocab } from "@/lib/vocabulary/legacyStorage";
import {
  getCorrectionItems,
  getLearnerVocabulary,
  getSavedWordCount,
} from "@/lib/vocabulary/learnerStats";

const KIND = "progress_v1";

function emptyProgress(): UserProgressV1 {
  return {
    activeDays: [],
    totalChatMessages: 0,
    missionsCompletedCount: 0,
    reviewsCompletedCount: 0,
    mistakesFixedCount: 0,
    learningDays: [],
    dailyJapaneseChars: {},
    correctedReuseCount: 0,
    weakDrillHistory: [],
    categoryMastery: {},
  };
}

function load(userId: string): UserProgressV1 {
  return readHabitJson<UserProgressV1>(KIND, userId, emptyProgress());
}

export function getProgressSnapshot(userId: string): UserProgressV1 {
  return load(userId);
}

/** Map current calendar week (Sun–Sat) to 7 booleans for UI dots */
export function activeDaysToWeekDots(activeDays: string[]): boolean[] {
  const set = new Set(activeDays);
  const today = new Date();
  const sun = new Date(today);
  sun.setDate(today.getDate() - today.getDay());
  const out: boolean[] = [];
  for (let wd = 0; wd < 7; wd++) {
    const d = new Date(sun);
    d.setDate(sun.getDate() + wd);
    out.push(set.has(toYmd(d)));
  }
  return out;
}

function save(userId: string, p: UserProgressV1): void {
  writeHabitJson(KIND, userId, p);
  if (typeof window !== "undefined") {
    void import("@/lib/habit/progressCloud").then((m) => m.queueProgressCloudSync(userId));
  }
}

function uniqPushDay(arr: string[], day: string): string[] {
  const set = new Set(arr);
  set.add(day);
  return [...set].sort();
}

/** Consecutive calendar days ending today or yesterday */
export function computeStreak(activeDays: string[]): number {
  const set = new Set(activeDays);
  const today = todayYmd();
  const yesterday = addDaysYmd(today, -1);
  let anchor = set.has(today) ? today : set.has(yesterday) ? yesterday : null;
  if (!anchor) return 0;
  let count = 0;
  let cursor = anchor;
  while (set.has(cursor)) {
    count++;
    cursor = addDaysYmd(cursor, -1);
  }
  return count;
}

export function getUserStats(userId: string): UserStats {
  const p = load(userId);
  const savedWords = getSavedWordCount(userId);
  const mistakes = getCorrectionItems(userId).length;

  let legacyWords = 0;
  try {
    legacyWords = readLegacyUiVocab(userId).length;
  } catch {
    /* ignore */
  }

  const topicPractices = listTopicPracticeResultsByUser(userId).length;

  return {
    streak: computeStreak(p.activeDays),
    totalWords: Math.max(savedWords, legacyWords, getLearnerVocabulary(userId).length),
    totalMistakes: mistakes,
    totalSessions: p.learningDays.length,
    mistakesFixed: p.mistakesFixedCount,
    totalTopicPractices: topicPractices,
  };
}

function countJapaneseChars(text: string): number {
  const matches = text.match(/[ぁ-んァ-ン一-龯々ー]/g);
  return matches ? matches.length : 0;
}

export function recordChatUsed(userId: string, learnerText = ""): void {
  const p = load(userId);
  const day = todayYmd();
  p.activeDays = uniqPushDay(p.activeDays, day);
  p.learningDays = uniqPushDay(p.learningDays, day);
  p.totalChatMessages += 1;
  const jpCount = countJapaneseChars(learnerText);
  if (jpCount > 0) {
    const nextDaily = { ...(p.dailyJapaneseChars ?? {}) };
    nextDaily[day] = (nextDaily[day] ?? 0) + jpCount;
    p.dailyJapaneseChars = nextDaily;
  }
  save(userId, p);
}

export function recordMissionCompleted(userId: string): void {
  const p = load(userId);
  const day = todayYmd();
  p.activeDays = uniqPushDay(p.activeDays, day);
  p.missionsCompletedCount += 1;
  save(userId, p);
}

export function recordReviewDone(userId: string, opts: { success: boolean; isMistake: boolean }): void {
  const p = load(userId);
  const day = todayYmd();
  p.activeDays = uniqPushDay(p.activeDays, day);
  p.reviewsCompletedCount += 1;
  if (opts.success && opts.isMistake) p.mistakesFixedCount += 1;
  save(userId, p);
}

export function setLastSessionSummarySnippet(userId: string, text: string): void {
  const p = load(userId);
  p.lastSessionSummarySnippet = text.slice(0, 400);
  save(userId, p);
}

export function recordCorrectedReuse(userId: string): void {
  const p = load(userId);
  p.correctedReuseCount = (p.correctedReuseCount ?? 0) + 1;
  p.activeDays = uniqPushDay(p.activeDays, todayYmd());
  save(userId, p);
}

export function recordWeakDrillResult(
  userId: string,
  entry: { category: string; score: number; maxScore: number },
): void {
  const p = load(userId);
  const next = [
    {
      at: new Date().toISOString(),
      category: entry.category,
      score: entry.score,
      maxScore: entry.maxScore,
    },
    ...(p.weakDrillHistory ?? []),
  ].slice(0, 12);
  p.weakDrillHistory = next;
  p.activeDays = uniqPushDay(p.activeDays, todayYmd());
  save(userId, p);
}

export function recordCategoryMasteryUpdate(
  userId: string,
  key: MistakeCategoryKey,
  score: number,
): void {
  const p = load(userId);
  const prev = p.categoryMastery?.[key];
  const nextMastery: CategoryMasteryState = {
    score: Math.max(0, Math.min(100, score)),
    attempts: (prev?.attempts ?? 0) + 1,
    lastAt: new Date().toISOString(),
  };
  p.categoryMastery = { ...(p.categoryMastery ?? {}), [key]: nextMastery };
  save(userId, p);
}
