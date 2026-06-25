import type { TopicPrompt } from "@/lib/topic/types";
import type { Lang } from "@/src/utils/i18n/types";

const TITLES: Record<string, Record<Lang, string>> = {
  apology_late: {
    en: "Apologizing politely",
    ja: "丁寧にお詫びする",
    ko: "정중하게 사과하기",
    zh: "礼貌地道歉",
  },
  asking_help_polite: {
    en: "Asking for help",
    ja: "助けを求める",
    ko: "도움 요청하기",
    zh: "请求帮助",
  },
  ordering_restaurant: {
    en: "Ordering at a restaurant",
    ja: "レストランで注文する",
    ko: "레스토랑에서 주문하기",
    zh: "在餐厅点餐",
  },
  saying_no_politely: {
    en: "Saying no politely",
    ja: "丁寧にお断りする",
    ko: "정중하게 거절하기",
    zh: "礼貌地拒绝",
  },
  self_intro: {
    en: "Self introduction",
    ja: "自己紹介",
    ko: "자기소개",
    zh: "自我介绍",
  },
  asking_spicy: {
    en: "Asking if something is spicy",
    ja: "辛いかどうか聞く",
    ko: "매운지 물어보기",
    zh: "询问是否辛辣",
  },
};

const DAILY_QUESTIONS: Record<string, Record<Lang, string>> = {
  apology_late: {
    en: "How do you apologize politely?",
    ja: "丁寧にお詫びするには？",
    ko: "정중하게 어떻게 사과할까요?",
    zh: "如何礼貌地道歉？",
  },
};

const PROMPTS: Record<string, Record<Lang, string>> = {
  apology_late: {
    en: "You are 10 minutes late to a meeting. How would you apologize politely in Japanese?",
    ja: "会議に10分遅れました。丁寧にどうお詫びしますか？",
    ko: "회의에 10분 늦었습니다. 정중하게 어떻게 사과할까요?",
    zh: "会议迟到了10分钟。如何用日语礼貌道歉？",
  },
  asking_help_polite: {
    en: "You cannot find the station exit. How would you ask for help politely in Japanese?",
    ja: "駅の出口がわかりません。丁寧に助けを求めるには？",
    ko: "역 출구를 찾을 수 없습니다. 정중하게 도움을 어떻게 요청할까요?",
    zh: "找不到车站出口。如何用日语礼貌地求助？",
  },
  ordering_restaurant: {
    en: "You are ready to order. How would you order politely in Japanese?",
    ja: "注文の番です。丁寧にどう注文しますか？",
    ko: "주문할 차례입니다. 정중하게 어떻게 주문할까요?",
    zh: "准备点餐了。如何用日语礼貌地点餐？",
  },
  saying_no_politely: {
    en: "A coworker invites you but you cannot join. How would you decline politely in Japanese?",
    ja: "同僚に誘われましたが参加できません。丁寧にどう断りますか？",
    ko: "동료가 초대했지만 참석할 수 없습니다. 정중하게 어떻게 거절할까요?",
    zh: "同事邀请你但无法参加。如何用日语礼貌拒绝？",
  },
  self_intro: {
    en: "You are meeting someone for the first time. Give a short natural self introduction in Japanese.",
    ja: "初対面の人に会います。自然な自己紹介を日本語で。",
    ko: "처음 만나는 사람입니다. 자연스러운 일본어 자기소개를 해 보세요.",
    zh: "第一次见面。用自然的日语做简短自我介绍。",
  },
  asking_spicy: {
    en: "At a restaurant, how would you ask if a dish is spicy in natural Japanese?",
    ja: "レストランで、その料理が辛いか自然な日本語でどう聞きますか？",
    ko: "레스토랑에서 그 요리가 매운지 자연스러운 일본어로 어떻게 물어볼까요?",
    zh: "在餐厅，如何用自然的日语询问菜品是否辣？",
  },
};

/** Localize built-in scenario titles and learner-facing prompts for UI display. */
export function localizeTopicPrompt(topic: TopicPrompt, lang: Lang): TopicPrompt {
  const title = TITLES[topic.id]?.[lang] ?? topic.title;
  const dailyQuestion = DAILY_QUESTIONS[topic.id]?.[lang] ?? topic.dailyQuestion;
  const prompt = PROMPTS[topic.id]?.[lang] ?? topic.prompt;
  return { ...topic, title, dailyQuestion, prompt };
}

export function localizeTopicList(topics: TopicPrompt[], lang: Lang): TopicPrompt[] {
  return topics.map((t) => localizeTopicPrompt(t, lang));
}

const GUIDE_COPY: Record<Lang, { topicPrefix: string; writeAnswer: string; scenarioLabel: string }> = {
  en: {
    topicPrefix: "Topic:",
    writeAnswer: "Write your answer in Japanese 👇",
    scenarioLabel: "Scenario practice",
  },
  ja: {
    topicPrefix: "トピック:",
    writeAnswer: "日本語で答えてみましょう 👇",
    scenarioLabel: "シナリオ練習",
  },
  ko: {
    topicPrefix: "토픽:",
    writeAnswer: "일본어로 답해 보세요 👇",
    scenarioLabel: "시나리오 연습",
  },
  zh: {
    topicPrefix: "话题:",
    writeAnswer: "用日语回答 👇",
    scenarioLabel: "情景练习",
  },
};

export function buildLocalizedTopicGuideMessage(topic: TopicPrompt, lang: Lang): string {
  const localized = localizeTopicPrompt(topic, lang);
  const guide = GUIDE_COPY[lang] ?? GUIDE_COPY.en;
  return [ `${guide.topicPrefix} ${localized.title}`, localized.prompt, "", guide.writeAnswer ].join("\n");
}

export function scenarioPracticeLabel(lang: Lang): string {
  return (GUIDE_COPY[lang] ?? GUIDE_COPY.en).scenarioLabel;
}

export function scenarioSessionTitle(topic: TopicPrompt, lang: Lang): string {
  const localized = localizeTopicPrompt(topic, lang);
  const prefix =
    lang === "ja"
      ? "シナリオ:"
      : lang === "ko"
        ? "시나리오:"
        : lang === "zh"
          ? "情景:"
          : "Scenario:";
  return `${prefix} ${localized.title}`;
}
