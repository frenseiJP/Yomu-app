import { getLearnerVocabulary } from "@/lib/vocabulary/learnerStats";
import { listTopicPracticeResultsByUser, TOPIC_PROMPTS } from "@/lib/topic/service";
import type { Lang } from "@/src/utils/i18n/types";

export type WeeklySummaryItem = { id: string; body: string; placeholder?: boolean };

function weekStart(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function topicCategoryLabel(category: string, lang: Lang): string {
  const labels: Record<string, Record<Lang, string>> = {
    restaurant: {
      en: "restaurant Japanese",
      ja: "レストランの日本語",
      ko: "레스토랑 일본어",
      zh: "餐厅日语",
    },
    asking_help: {
      en: "asking for help",
      ja: "助けを求める表現",
      ko: "도움 요청 표현",
      zh: "求助表达",
    },
    apology: {
      en: "apologizing politely",
      ja: "丁寧なお詫び",
      ko: "정중한 사과",
      zh: "礼貌道歉",
    },
    travel: {
      en: "travel Japanese",
      ja: "旅行の日本語",
      ko: "여행 일본어",
      zh: "旅行日语",
    },
    other: {
      en: "daily conversation",
      ja: "日常会話",
      ko: "일상 대화",
      zh: "日常对话",
    },
  };
  return labels[category]?.[lang] ?? labels.other[lang];
}

function placeholderItems(lang: Lang): WeeklySummaryItem[] {
  const copy: Record<Lang, string[]> = {
    en: [
      "You practiced travel Japanese this week.",
      "You saved useful phrases for review.",
      "Your coach is watching your rhythm — chat again to build momentum.",
    ],
    ja: [
      "今週は旅行の日本語を練習しました。",
      "復習用に役立つフレーズを保存しました。",
      "コーチがあなたのペースを見ています。チャットを続けて勢いをつけましょう。",
    ],
    ko: [
      "이번 주 여행 일본어를 연습했어요.",
      "복습용 표현을 저장했어요.",
      "코치가 학습 리듬을 지켜보고 있어요. 채팅을 이어가 보세요.",
    ],
    zh: [
      "本周你练习了旅行日语。",
      "你保存了实用表达以便复习。",
      "教练在关注你的学习节奏——继续聊天来保持动力。",
    ],
  };
  return (copy[lang] ?? copy.en).map((body, i) => ({
    id: `placeholder-${i}`,
    body,
    placeholder: true,
  }));
}

export function buildWeeklyCoachSummary(userId: string, lang: Lang): WeeklySummaryItem[] {
  const since = weekStart();
  const items: WeeklySummaryItem[] = [];

  const topicResults = listTopicPracticeResultsByUser(userId).filter(
    (r) => new Date(r.createdAt) >= since,
  );
  const byCategory = new Map<string, number>();
  for (const r of topicResults) {
    const prompt = TOPIC_PROMPTS.find((p) => p.id === r.topicId);
    const cat = prompt?.category ?? "other";
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + 1);
  }
  const topCategory = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topCategory && topCategory[1] >= 1) {
    const label = topicCategoryLabel(topCategory[0], lang);
    items.push({
      id: "topic",
      body:
        lang === "ja"
          ? `${label}を ${topCategory[1]} 回練習しました。`
          : lang === "ko"
            ? `${label}을(를) ${topCategory[1]}번 연습했어요.`
            : lang === "zh"
              ? `你练习了 ${topCategory[1]} 次${label}。`
              : `You practiced ${label} ${topCategory[1]} time${topCategory[1] === 1 ? "" : "s"}.`,
    });
  }

  const saves = getLearnerVocabulary(userId).filter(
    (v) =>
      (v.type === "phrase" || v.type === "word") && new Date(v.createdAt) >= since,
  );
  if (saves.length >= 1) {
    items.push({
      id: "saves",
      body:
        lang === "ja"
          ? `役に立つフレーズを ${saves.length} 件保存しました。`
          : lang === "ko"
            ? `유용한 표현 ${saves.length}개를 저장했어요.`
            : lang === "zh"
              ? `你保存了 ${saves.length} 条实用表达。`
              : `You saved ${saves.length} useful phrase${saves.length === 1 ? "" : "s"}.`,
    });
  }

  if (topCategory && topCategory[1] >= 2) {
    const label = topicCategoryLabel(topCategory[0], lang);
    items.push({
      id: "top_topic",
      body:
        lang === "ja"
          ? `いちばん多いトピックは「${label}」です。`
          : lang === "ko"
            ? `가장 많이 연습한 주제는 「${label}」이에요.`
            : lang === "zh"
              ? `你最常练习的主题是「${label}」。`
              : `Your most common topic is ${label}.`,
    });
  }

  if (items.length > 0) return items.slice(0, 3);
  return placeholderItems(lang);
}
