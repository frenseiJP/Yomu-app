"use client";

import type { UserProgressV1 } from "@/lib/habit/types";
import { getProgressSnapshot } from "@/lib/habit/progress";
import { readHabitJson, writeHabitJson } from "@/lib/habit/storage";
import { createClient } from "@/src/utils/supabase/client";

const META_KEY = "frensei_progress_v1";
const KIND = "progress_v1";

let syncTimer: ReturnType<typeof setTimeout> | null = null;

function empty(): UserProgressV1 {
  return {
    activeDays: [],
    totalChatMessages: 0,
    missionsCompletedCount: 0,
    reviewsCompletedCount: 0,
    mistakesFixedCount: 0,
    learningDays: [],
  };
}

function parseRemote(raw: unknown): UserProgressV1 | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as UserProgressV1;
    } catch {
      return null;
    }
  }
  if (typeof raw === "object") return raw as UserProgressV1;
  return null;
}

function mergeProgress(local: UserProgressV1, remote: UserProgressV1): UserProgressV1 {
  const activeDays = [...new Set([...(local.activeDays ?? []), ...(remote.activeDays ?? [])])].sort();
  const learningDays = [...new Set([...(local.learningDays ?? []), ...(remote.learningDays ?? [])])].sort();

  const categoryMastery: NonNullable<UserProgressV1["categoryMastery"]> = {};
  const masteryKeys = new Set([
    ...Object.keys(local.categoryMastery ?? {}),
    ...Object.keys(remote.categoryMastery ?? {}),
  ]);
  for (const key of masteryKeys) {
    const k = key as keyof NonNullable<UserProgressV1["categoryMastery"]>;
    const l = local.categoryMastery?.[k];
    const r = remote.categoryMastery?.[k];
    if (!l && !r) continue;
    categoryMastery[k] = {
      score: Math.max(l?.score ?? 0, r?.score ?? 0),
      attempts: (l?.attempts ?? 0) + (r?.attempts ?? 0),
      lastAt: [l?.lastAt, r?.lastAt].filter(Boolean).sort().pop(),
    };
  }

  const weakDrillHistory = [
    ...(local.weakDrillHistory ?? []),
    ...(remote.weakDrillHistory ?? []),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 12);

  return {
    ...local,
    activeDays,
    learningDays,
    totalChatMessages: Math.max(local.totalChatMessages, remote.totalChatMessages),
    missionsCompletedCount: Math.max(local.missionsCompletedCount, remote.missionsCompletedCount),
    reviewsCompletedCount: Math.max(local.reviewsCompletedCount, remote.reviewsCompletedCount),
    mistakesFixedCount: Math.max(local.mistakesFixedCount, remote.mistakesFixedCount),
    correctedReuseCount: Math.max(local.correctedReuseCount ?? 0, remote.correctedReuseCount ?? 0),
    dailyJapaneseChars: { ...(remote.dailyJapaneseChars ?? {}), ...(local.dailyJapaneseChars ?? {}) },
    categoryMastery,
    weakDrillHistory,
    weeklyCategoryGoal: local.weeklyCategoryGoal ?? remote.weeklyCategoryGoal,
    lastSessionSummarySnippet:
      local.lastSessionSummarySnippet ?? remote.lastSessionSummarySnippet,
  };
}

export async function pullProgressFromCloud(localUserId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const remote = parseRemote(user.user_metadata?.[META_KEY]);
    if (!remote) return false;
    const local = readHabitJson<UserProgressV1>(KIND, localUserId, empty());
    const merged = mergeProgress(local, remote);
    writeHabitJson(KIND, localUserId, merged);
    return true;
  } catch {
    return false;
  }
}

export async function pushProgressToCloud(localUserId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const local = getProgressSnapshot(localUserId);
    const remote = parseRemote(user.user_metadata?.[META_KEY]);
    const merged = remote ? mergeProgress(local, remote) : local;
    writeHabitJson(KIND, localUserId, merged);
    const payload = JSON.stringify({
      activeDays: merged.activeDays,
      learningDays: merged.learningDays,
      categoryMastery: merged.categoryMastery,
      weakDrillHistory: merged.weakDrillHistory,
      correctedReuseCount: merged.correctedReuseCount,
      dailyJapaneseChars: merged.dailyJapaneseChars,
      weeklyCategoryGoal: merged.weeklyCategoryGoal,
      totalChatMessages: merged.totalChatMessages,
      missionsCompletedCount: merged.missionsCompletedCount,
      reviewsCompletedCount: merged.reviewsCompletedCount,
      mistakesFixedCount: merged.mistakesFixedCount,
    });
    if (payload.length > 3500) return false;
    await supabase.auth.updateUser({ data: { [META_KEY]: payload } });
    return true;
  } catch {
    return false;
  }
}

export function queueProgressCloudSync(localUserId: string): void {
  if (typeof window === "undefined") return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    void pushProgressToCloud(localUserId);
  }, 1500);
}
