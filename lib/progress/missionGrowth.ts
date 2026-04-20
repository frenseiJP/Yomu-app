import { readHabitJson, writeHabitJson } from "@/lib/habit/storage";
import { todayYmd, diffCalendarDaysYmd } from "@/lib/habit/date";
import type { Season, SeasonStage } from "@/lib/progress/seasonal";
import { getCalendarSeason } from "@/lib/progress/seasonal";

const KIND = "mission_growth_v1";

/** リテンション用ミッション成長（数字は主 UI では使わず内部・コピー用） */
export interface MissionGrowthState {
  totalCompleted: number;
  currentStreak: number;
  lastActiveDate: string;
}

export function readMissionGrowth(userId: string): MissionGrowthState {
  const raw = readHabitJson<Partial<MissionGrowthState>>(KIND, userId, {});
  return {
    totalCompleted: typeof raw.totalCompleted === "number" && Number.isFinite(raw.totalCompleted) ? raw.totalCompleted : 0,
    currentStreak:
      typeof raw.currentStreak === "number" && Number.isFinite(raw.currentStreak) ? raw.currentStreak : 0,
    lastActiveDate: typeof raw.lastActiveDate === "string" ? raw.lastActiveDate : "",
  };
}

export function writeMissionGrowth(userId: string, state: MissionGrowthState): void {
  writeHabitJson(KIND, userId, state);
}

/**
 * ストリーク: 前回完了日の翌日なら +1、同日は据え置き、2 日以上空いたら 1 に戻す。
 */
export function computeNextStreak(prevStreak: number, lastActiveYmd: string, todayYmdStr: string): number {
  if (!lastActiveYmd) return 1;
  if (lastActiveYmd === todayYmdStr) return prevStreak;
  const gap = diffCalendarDaysYmd(lastActiveYmd, todayYmdStr);
  if (gap === 1) return prevStreak + 1;
  return 1;
}

/** 季節ビジュアル用ステージ 0–4（5 段階）。ミッション数とストリークの両方を少し反映 */
export function computeVisualGrowthStage(
  totalCompleted: number,
  currentStreak: number,
): SeasonStage {
  const fromMissions = Math.min(4, Math.floor(totalCompleted / 3));
  const fromStreak = Math.min(1, Math.floor(Math.min(currentStreak, 21) / 7));
  return Math.min(4, fromMissions + fromStreak) as SeasonStage;
}

export function growthProgressRatio(totalCompleted: number, stage: SeasonStage): number {
  const cycle = (totalCompleted % 3) / 3;
  return Math.min(1, Math.max(0.12, (stage + 1) / 5 + cycle * 0.08));
}

export function applyMissionGrowthOnCompletion(userId: string): MissionGrowthState {
  const cur = readMissionGrowth(userId);
  const today = todayYmd();
  const nextStreak = computeNextStreak(cur.currentStreak, cur.lastActiveDate, today);
  const next: MissionGrowthState = {
    totalCompleted: cur.totalCompleted + 1,
    currentStreak: nextStreak,
    lastActiveDate: today,
  };
  writeMissionGrowth(userId, next);
  return next;
}

export function buildMissionCompletionCopy(season: Season): { banner: string; microLine1: string; microLine2: string } {
  const head = "Nice work 👍\nYou're getting more natural.";
  const table: Record<
    Season,
    { growth: string; micro1: string; micro2: string }
  > = {
    spring: {
      growth: `${head}\nYour progress grew 🌸`,
      micro1: "Your sakura grew a little",
      micro2: "Streak warmth continues 🔥",
    },
    summer: {
      growth: `${head}\nYour fireworks just got bigger 🎆`,
      micro1: "Your summer spark grew",
      micro2: "Streak warmth continues 🔥",
    },
    autumn: {
      growth: `${head}\nThe leaves shifted into richer color 🍂`,
      micro1: "Your autumn deepened a step",
      micro2: "Streak warmth continues 🔥",
    },
    winter: {
      growth: `${head}\nYour snowman filled out a bit more ⛄`,
      micro1: "Your winter scene grew",
      micro2: "Streak warmth continues 🔥",
    },
  };
  const row = table[season];
  return { banner: row.growth, microLine1: row.micro1, microLine2: row.micro2 };
}

export function getMissionGrowthSnapshotForUi(userId: string): {
  growth: MissionGrowthState;
  season: Season;
  stage: SeasonStage;
  progressRatio: number;
} {
  const growth = readMissionGrowth(userId);
  const season = getCalendarSeason();
  const stage = computeVisualGrowthStage(growth.totalCompleted, growth.currentStreak);
  return {
    growth,
    season,
    stage,
    progressRatio: growthProgressRatio(growth.totalCompleted, stage),
  };
}
