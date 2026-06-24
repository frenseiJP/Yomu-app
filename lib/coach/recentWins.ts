import { getUserStats } from "@/lib/habit/progress";
import { getOrCreateRetentionDailyMission } from "@/lib/mission/retentionDaily";
import { isDailyReflectionCompletedToday } from "@/lib/mission/dailyReflection";
import { getSavedWordCount, getCorrectionItems } from "@/lib/vocabulary/learnerStats";
import { mistakeCategoryLabel } from "@/lib/vocabulary/mistakeCategory";
import type { Lang } from "@/src/utils/i18n/types";

export type RecentWin = { id: string; body: string };

export function buildRecentWins(userId: string, lang: Lang, jlptLevel = "N3"): RecentWin[] {
  const wins: RecentWin[] = [];
  const stats = getUserStats(userId);
  const saved = getSavedWordCount(userId);
  const mission = getOrCreateRetentionDailyMission(userId, jlptLevel);

  if (mission.completed) {
    wins.push({
      id: "mission",
      body:
        lang === "ja"
          ? "今日のミッションを完了しました 🌸"
          : lang === "ko"
            ? "오늘 미션을 완료했어요 🌸"
            : lang === "zh"
              ? "你完成了今日任务 🌸"
              : "You completed today's mission 🌸",
    });
  }

  if (isDailyReflectionCompletedToday(userId)) {
    wins.push({
      id: "reflection",
      body:
        lang === "ja"
          ? "今日の振り返りを完了しました 🌸"
          : lang === "ko"
            ? "오늘 회고를 완료했어요 🌸"
            : lang === "zh"
              ? "你完成了今日反思 🌸"
              : "You completed today's reflection 🌸",
    });
  }

  if (saved >= 1) {
    wins.push({
      id: "saved",
      body:
        lang === "ja"
          ? `${saved} 件のフレーズを保存しました。`
          : lang === "ko"
            ? `${saved}개의 표현을 저장했어요.`
            : lang === "zh"
              ? `你保存了 ${saved} 条表达。`
              : `You saved ${saved} phrase${saved === 1 ? "" : "s"}.`,
    });
  }

  const latest = getCorrectionItems(userId)[0];
  if (latest?.mistakeCategory) {
    const label = mistakeCategoryLabel(latest.mistakeCategory, lang);
    if (label) {
      wins.push({
        id: "practice",
        body:
          lang === "ja"
            ? `「${label}」を練習しました。`
            : lang === "ko"
              ? `「${label}」을(를) 연습했어요.`
              : lang === "zh"
                ? `你练习了「${label}」。`
                : `You practiced ${label.toLowerCase()}.`,
      });
    }
  }

  if (stats.streak >= 2) {
    wins.push({
      id: "streak",
      body:
        lang === "ja"
          ? `${stats.streak} 日連続で学習中です。`
          : lang === "ko"
            ? `${stats.streak}일 연속 학습 중이에요.`
            : lang === "zh"
              ? `已连续学习 ${stats.streak} 天。`
              : `${stats.streak}-day learning streak.`,
    });
  }

  return wins.slice(0, 4);
}
