import type { MistakeCategoryKey, UserProgressV1 } from "@/lib/habit/types";
import { readHabitJson, writeHabitJson } from "@/lib/habit/storage";
import {
  recommendedFocusCategory,
  masteryScoreFor,
  SKILL_TREE_ORDER,
} from "@/lib/coach/categoryMastery";

const KIND = "progress_v1";
const GOAL_DELTA = 15;
const GOAL_TARGET_CAP = 100;

export function isoWeekKey(d = new Date()): string {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function load(userId: string): UserProgressV1 {
  return readHabitJson<UserProgressV1>(KIND, userId, {
    activeDays: [],
    totalChatMessages: 0,
    missionsCompletedCount: 0,
    reviewsCompletedCount: 0,
    mistakesFixedCount: 0,
    learningDays: [],
  });
}

function save(userId: string, p: UserProgressV1): void {
  writeHabitJson(KIND, userId, p);
}

export function ensureWeeklyCategoryGoal(userId: string): UserProgressV1 {
  const p = load(userId);
  const week = isoWeekKey();
  const existing = p.weeklyCategoryGoal;
  if (existing?.weekKey === week && existing.category) {
    return p;
  }
  const category = recommendedFocusCategory(userId);
  const startScore = masteryScoreFor(userId, category);
  const targetScore = Math.min(GOAL_TARGET_CAP, startScore + GOAL_DELTA);
  const next: UserProgressV1 = {
    ...p,
    weeklyCategoryGoal: {
      weekKey: week,
      category,
      startScore,
      targetScore,
    },
  };
  save(userId, next);
  return next;
}

export type WeeklyGoalStatus = {
  weekKey: string;
  category: MistakeCategoryKey;
  label: string;
  currentScore: number;
  startScore: number;
  targetScore: number;
  progressPercent: number;
  met: boolean;
};

export function getWeeklyCategoryGoalStatus(userId: string): WeeklyGoalStatus | null {
  const p = ensureWeeklyCategoryGoal(userId);
  const g = p.weeklyCategoryGoal;
  if (!g?.category) return null;
  const currentScore = masteryScoreFor(userId, g.category);
  const span = Math.max(1, g.targetScore - g.startScore);
  const progressPercent = Math.min(100, Math.round(((currentScore - g.startScore) / span) * 100));
  const label = SKILL_TREE_ORDER.find((s) => s.key === g.category)?.label ?? g.category;
  return {
    weekKey: g.weekKey,
    category: g.category,
    label,
    currentScore,
    startScore: g.startScore,
    targetScore: g.targetScore,
    progressPercent,
    met: currentScore >= g.targetScore,
  };
}
