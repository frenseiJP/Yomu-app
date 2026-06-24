import { getUserStats } from "@/lib/habit/progress";
import { getOrCreateRetentionDailyMission } from "@/lib/mission/retentionDaily";
import { isDailyReflectionCompletedToday } from "@/lib/mission/dailyReflection";
import { getLearnerVocabulary, getCorrectionItems } from "@/lib/vocabulary/learnerStats";
import { mistakeCategoryLabel } from "@/lib/vocabulary/mistakeCategory";
import { listTopicPracticeResultsByUser, TOPIC_PROMPTS } from "@/lib/topic/service";
import type { Lang } from "@/src/utils/i18n/types";

export type RecentWin = { id: string; body: string };

function weekStart(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function topicWinLabel(topicId: string, lang: Lang): string | null {
  const prompt = TOPIC_PROMPTS.find((p) => p.id === topicId);
  if (!prompt) return null;
  if (prompt.category === "asking_help") {
    return lang === "ja"
      ? "道の尋ね方を練習しました"
      : lang === "ko"
        ? "길 묻기를 연습했어요"
        : lang === "zh"
          ? "练习了问路"
          : "Practiced asking directions";
  }
  if (prompt.category === "restaurant") {
    return lang === "ja"
      ? "レストランの注文を練習しました"
      : lang === "ko"
        ? "레스토랑 주문을 연습했어요"
        : lang === "zh"
          ? "练习了餐厅点餐"
          : "Practiced restaurant ordering";
  }
  return lang === "ja"
    ? `「${prompt.title}」を練習しました`
    : lang === "ko"
      ? `「${prompt.title}」을(를) 연습했어요`
      : lang === "zh"
        ? `练习了「${prompt.title}」`
        : `Practiced ${prompt.title.toLowerCase()}`;
}

export function buildRecentWins(userId: string, lang: Lang, jlptLevel = "N3"): RecentWin[] {
  const wins: RecentWin[] = [];
  const stats = getUserStats(userId);
  const since = weekStart();
  const mission = getOrCreateRetentionDailyMission(userId, jlptLevel);

  if (isDailyReflectionCompletedToday(userId)) {
    wins.push({
      id: "reflection",
      body:
        lang === "ja"
          ? "今日の振り返りを完了しました"
          : lang === "ko"
            ? "오늘 회고를 완료했어요"
            : lang === "zh"
              ? "完成了今日反思"
              : "Completed daily reflection",
    });
  }

  if (mission.completed) {
    wins.push({
      id: "mission",
      body:
        lang === "ja"
          ? "今日のミッションを完了しました"
          : lang === "ko"
            ? "오늘 미션을 완료했어요"
            : lang === "zh"
              ? "完成了今日任务"
              : "Completed today's mission",
    });
  }

  const weekSaves = getLearnerVocabulary(userId).filter(
    (v) =>
      (v.type === "phrase" || v.type === "word") && new Date(v.createdAt) >= since,
  ).length;
  if (weekSaves >= 1) {
    wins.push({
      id: "saved",
      body:
        lang === "ja"
          ? `${weekSaves} 件のフレーズを保存しました`
          : lang === "ko"
            ? `${weekSaves}개의 표현을 저장했어요`
            : lang === "zh"
              ? `保存了 ${weekSaves} 条表达`
              : `Saved ${weekSaves} phrase${weekSaves === 1 ? "" : "s"}`,
    });
  }

  const latestTopic = listTopicPracticeResultsByUser(userId)[0];
  if (latestTopic) {
    const label = topicWinLabel(latestTopic.topicId, lang);
    if (label) {
      wins.push({ id: "topic", body: label });
    }
  }

  const latest = getCorrectionItems(userId)[0];
  if (latest?.mistakeCategory && wins.length < 5) {
    const label = mistakeCategoryLabel(latest.mistakeCategory, lang);
    if (label) {
      wins.push({
        id: "practice",
        body:
          lang === "ja"
            ? `「${label}」を練習しました`
            : lang === "ko"
              ? `「${label}」을(를) 연습했어요`
              : lang === "zh"
                ? `练习了「${label}」`
                : `Practiced ${label.toLowerCase()}`,
      });
    }
  }

  if (stats.streak >= 2 && wins.length < 5) {
    wins.push({
      id: "streak",
      body:
        lang === "ja"
          ? `${stats.streak} 日連続で学習中です`
          : lang === "ko"
            ? `${stats.streak}일 연속 학습 중이에요`
            : lang === "zh"
              ? `已连续学习 ${stats.streak} 天`
              : `${stats.streak}-day learning streak`,
    });
  }

  return wins.slice(0, 5);
}
