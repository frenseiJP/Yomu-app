import { getCoachFocusSummary } from "@/lib/coach/categoryMastery";
import { getSkillTreeLabel } from "@/lib/i18n/skillTree";
import { getOrCreateRetentionDailyMission } from "@/lib/mission/retentionDaily";
import { listTopicPracticeResultsByUser } from "@/lib/topic/service";
import { getCorrectionItems } from "@/lib/vocabulary/learnerStats";
import { mistakeCategoryLabel } from "@/lib/vocabulary/mistakeCategory";
import type { Lang } from "@/src/utils/i18n/types";

export type CoachNote = {
  id: string;
  body: string;
};

export function buildCoachNotes(userId: string, lang: Lang, jlptLevel = "N3"): CoachNote[] {
  const notes: CoachNote[] = [];
  const focus = getCoachFocusSummary(userId);
  const focusLabel = getSkillTreeLabel(lang, focus.key);

  if (focus.score < 70) {
    notes.push({
      id: "focus",
      body:
        lang === "ja"
          ? `「${focusLabel}」がつまずきポイントです。${focus.hint}`
          : lang === "ko"
            ? `「${focusLabel}」에서 자주 헷갈려요. ${focus.hint}`
            : lang === "zh"
              ? `你在「${focusLabel}」上还需要加强。${focus.hint}`
              : `You often struggle with ${focusLabel.toLowerCase()}. ${focus.hint}`,
    });
  }

  const corrections = getCorrectionItems(userId);
  const byCategory = new Map<string, number>();
  for (const c of corrections) {
    const cat = c.mistakeCategory ?? "other";
    if (cat === "other") continue;
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + 1);
  }
  const topCat = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topCat && topCat[1] >= 2) {
    const label = mistakeCategoryLabel(topCat[0] as never, lang) ?? topCat[0];
    notes.push({
      id: "category",
      body:
        lang === "ja"
          ? `「${label}」の添削を ${topCat[1]} 回保存しました。ここを意識すると伸びます。`
          : lang === "ko"
            ? `「${label}」 관련 교정을 ${topCat[1]}번 저장했어요.`
            : lang === "zh"
              ? `你已保存 ${topCat[1]} 条「${label}」相关订正。`
              : `You've saved ${topCat[1]} corrections about ${label.toLowerCase()}.`,
    });
  }

  const topicCount = listTopicPracticeResultsByUser(userId).length;
  if (topicCount >= 2) {
    notes.push({
      id: "topic",
      body:
        lang === "ja"
          ? `トピック練習を ${topicCount} 回しました。シナリオ会話が得意になってきています。`
          : lang === "ko"
            ? `토픽 연습을 ${topicCount}번 했어요.`
            : lang === "zh"
              ? `你已完成 ${topicCount} 次情景练习。`
              : `You've practiced scenario Japanese ${topicCount} times.`,
    });
  }

  const mission = getOrCreateRetentionDailyMission(userId, jlptLevel);
  if (!mission.completed) {
    notes.push({
      id: "mission",
      body:
        lang === "ja"
          ? `今週のおすすめ：${mission.mission.title} に挑戦してみましょう。`
          : lang === "ko"
            ? `이번 주 추천: ${mission.mission.title}`
            : lang === "zh"
              ? `本周建议：尝试「${mission.mission.title}」`
              : `Try focusing on ${mission.mission.title.toLowerCase()} this week.`,
    });
  }

  return notes.slice(0, 3);
}
