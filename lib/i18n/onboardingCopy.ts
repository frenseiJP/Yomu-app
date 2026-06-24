import type { Lang } from "@/src/utils/i18n/types";

export type OnboardingGoalCopy = {
  goalSectionTitle: string;
  goalWhy: Record<string, string>;
  goalHardest: Record<string, string>;
  goalMinutes: Record<string, string>;
  firstLanguageJa: string;
  firstLanguageEn: string;
  displayLanguage: Record<Lang, string>;
  pendingGuestNote: string;
};

const ONBOARDING_GOAL_COPY: Record<Lang, OnboardingGoalCopy> = {
  en: {
    goalSectionTitle: "Why are you learning Japanese?",
    goalWhy: {
      travel: "Travel",
      anime: "Anime",
      work: "Work",
      living: "Living in Japan",
      friends: "Friends & Family",
    },
    goalHardest: {
      speaking: "Speaking",
      listening: "Listening",
      grammar: "Grammar",
      vocabulary: "Vocabulary",
      confidence: "Confidence",
    },
    goalMinutes: {
      "2": "2 min / day",
      "5": "5 min / day",
      "10": "10 min / day",
      "20+": "20+ min / day",
    },
    firstLanguageJa: "Japanese",
    firstLanguageEn: "English (UI)",
    displayLanguage: { ja: "日本語", en: "English", ko: "한국어", zh: "中文" },
    pendingGuestNote:
      "Your trial conversation is saved. Finish this quick setup to continue chatting.",
  },
  ja: {
    goalSectionTitle: "学習の目的",
    goalWhy: {
      travel: "旅行",
      anime: "アニメ",
      work: "仕事",
      living: "日本での生活",
      friends: "友人・家族",
    },
    goalHardest: {
      speaking: "話すこと",
      listening: "聞くこと",
      grammar: "文法",
      vocabulary: "語彙",
      confidence: "自信",
    },
    goalMinutes: {
      "2": "1日2分",
      "5": "1日5分",
      "10": "1日10分",
      "20+": "1日20分以上",
    },
    firstLanguageJa: "日本語",
    firstLanguageEn: "英語（UI）",
    displayLanguage: { ja: "日本語", en: "English", ko: "한국어", zh: "中文" },
    pendingGuestNote: "体験会話は保存されています。簡単な設定を完了するとチャットを続けられます。",
  },
  ko: {
    goalSectionTitle: "일본어를 배우는 이유",
    goalWhy: {
      travel: "여행",
      anime: "애니메이션",
      work: "업무",
      living: "일본 생활",
      friends: "친구·가족",
    },
    goalHardest: {
      speaking: "말하기",
      listening: "듣기",
      grammar: "문법",
      vocabulary: "어휘",
      confidence: "자신감",
    },
    goalMinutes: {
      "2": "하루 2분",
      "5": "하루 5분",
      "10": "하루 10분",
      "20+": "하루 20분 이상",
    },
    firstLanguageJa: "일본어",
    firstLanguageEn: "영어 (UI)",
    displayLanguage: { ja: "日本語", en: "English", ko: "한국어", zh: "中文" },
    pendingGuestNote: "체험 대화가 저장되었습니다. 간단한 설정을 마치면 채팅을 이어갈 수 있습니다.",
  },
  zh: {
    goalSectionTitle: "你为什么学日语？",
    goalWhy: {
      travel: "旅行",
      anime: "动漫",
      work: "工作",
      living: "在日本生活",
      friends: "朋友与家人",
    },
    goalHardest: {
      speaking: "口语",
      listening: "听力",
      grammar: "语法",
      vocabulary: "词汇",
      confidence: "自信",
    },
    goalMinutes: {
      "2": "每天 2 分钟",
      "5": "每天 5 分钟",
      "10": "每天 10 分钟",
      "20+": "每天 20 分钟以上",
    },
    firstLanguageJa: "日语",
    firstLanguageEn: "英语（界面）",
    displayLanguage: { ja: "日本語", en: "English", ko: "한국어", zh: "中文" },
    pendingGuestNote: "试用对话已保存。完成快速设置后即可继续聊天。",
  },
};

export function getOnboardingGoalCopy(lang: Lang): OnboardingGoalCopy {
  return ONBOARDING_GOAL_COPY[lang] ?? ONBOARDING_GOAL_COPY.en;
}
