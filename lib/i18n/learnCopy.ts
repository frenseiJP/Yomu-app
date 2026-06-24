import type { Lang } from "@/src/utils/i18n/types";

export type LearnUiCopy = {
  indexTitle: string;
  indexSubtitle: string;
  phraseGuide: string;
  startFree: string;
  nuance: string;
  culturalNote: string;
  examples: string;
  commonMistakes: string;
  askSensei: (topic: string) => string;
  tryCtaBody: string;
  tryWithSensei: string;
  relatedPhrases: string;
  metadataIndexTitle: string;
  metadataIndexDescription: string;
};

const LEARN_COPY: Record<Lang, LearnUiCopy> = {
  en: {
    indexTitle: "Japanese phrase guides",
    indexSubtitle: "Meaning, culture, and real usage—not textbook definitions.",
    phraseGuide: "Phrase guide",
    startFree: "Start free",
    nuance: "Nuance",
    culturalNote: "Cultural note",
    examples: "Examples",
    commonMistakes: "Common mistakes",
    askSensei: (topic) => `Ask Sensei about ${topic}`,
    tryCtaBody: "Try 3 free messages—no sign-up. Get a personalized explanation.",
    tryWithSensei: "Try with Sensei",
    relatedPhrases: "Related phrases",
    metadataIndexTitle: "Japanese Phrase Guides — Natural Usage & Culture | Frensei",
    metadataIndexDescription:
      "Free guides for itadakimasu, otsukaresama, sumimasen, and 20+ essential Japanese phrases. Learn meaning, nuance, and culture—then practice with AI.",
  },
  ja: {
    indexTitle: "日本語フレーズガイド",
    indexSubtitle: "意味・文化・実際の使い方—教科書的な定義だけではありません。",
    phraseGuide: "フレーズガイド",
    startFree: "無料で始める",
    nuance: "ニュアンス",
    culturalNote: "文化的なポイント",
    examples: "例文",
    commonMistakes: "よくある間違い",
    askSensei: (topic) => `「${topic}」について先生に聞く`,
    tryCtaBody: "登録不要・3メッセージ無料。あなた向けの解説を受け取れます。",
    tryWithSensei: "先生と試す",
    relatedPhrases: "関連フレーズ",
    metadataIndexTitle: "日本語フレーズガイド — 自然な使い方と文化 | Frensei",
    metadataIndexDescription:
      "いただきます・お疲れ様・すみませんなど30以上のフレーズを解説。意味と文化を学び、AIで練習できます。",
  },
  ko: {
    indexTitle: "일본어 표현 가이드",
    indexSubtitle: "의미, 문화, 실제 사용법—교과서적 정의가 아닙니다.",
    phraseGuide: "표현 가이드",
    startFree: "무료로 시작",
    nuance: "뉘앙스",
    culturalNote: "문화적 포인트",
    examples: "예문",
    commonMistakes: "흔한 실수",
    askSensei: (topic) => `「${topic}」에 대해 선생님에게 물어보기`,
    tryCtaBody: "가입 불필요 · 무료 메시지 3회. 맞춤 설명을 받아보세요.",
    tryWithSensei: "선생님과 체험",
    relatedPhrases: "관련 표현",
    metadataIndexTitle: "일본어 표현 가이드 — 자연스러운 사용과 문화 | Frensei",
    metadataIndexDescription:
      "いただきます, お疲れ様, すみません 등 30개 이상의 필수 일본어 표현. 의미와 문화를 배우고 AI로 연습하세요.",
  },
  zh: {
    indexTitle: "日语表达指南",
    indexSubtitle: "含义、文化与真实用法——不只是教科书定义。",
    phraseGuide: "表达指南",
    startFree: "免费开始",
    nuance: "语感",
    culturalNote: "文化要点",
    examples: "例句",
    commonMistakes: "常见错误",
    askSensei: (topic) => `向老师询问「${topic}」`,
    tryCtaBody: "无需注册 · 免费 3 条消息。获得个性化讲解。",
    tryWithSensei: "与老师试聊",
    relatedPhrases: "相关表达",
    metadataIndexTitle: "日语表达指南 — 自然用法与文化 | Frensei",
    metadataIndexDescription:
      "いただきます、お疲れ様、すみません等 30+ 必备日语表达。学习含义与文化，并用 AI 练习。",
  },
};

export function getLearnCopy(lang: Lang): LearnUiCopy {
  return LEARN_COPY[lang] ?? LEARN_COPY.en;
}
