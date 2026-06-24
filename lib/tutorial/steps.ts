import type { Lang } from "@/src/utils/i18n/types";

export type TutorialStep = {
  title: string;
  body: string;
  cta: string;
};

const STEPS: Record<Lang, TutorialStep[]> = {
  en: [
    {
      title: "Welcome to Frensei",
      body: "Your AI coach for natural Japanese — not textbook Japanese.",
      cta: "Next",
    },
    {
      title: "The core loop",
      body: "Chat → correction → save a phrase. Remember just that.",
      cta: "Next",
    },
    {
      title: "A little each day",
      body: "Check Progress when you want. Two minutes a day is enough.",
      cta: "Start",
    },
  ],
  ja: [
    {
      title: "Frensei へようこそ",
      body: "自然な日本語コーチ。教科書っぽさを減らし、会話に近づけます。",
      cta: "次へ",
    },
    {
      title: "コアの流れ",
      body: "Chat で一文 → 添削 → フレーズ保存。これだけ覚えれば十分です。",
      cta: "次へ",
    },
    {
      title: "毎日少しでOK",
      body: "Progress で成長を確認。1日2分で十分です。",
      cta: "はじめる",
    },
  ],
  ko: [
    {
      title: "Frensei에 오신 것을 환영합니다",
      body: "교과서 일본어가 아닌, 자연스러운 일본어를 코칭하는 AI 선생님입니다.",
      cta: "다음",
    },
    {
      title: "핵심 루프",
      body: "채팅 → 교정 → 표현 저장. 이것만 기억하세요.",
      cta: "다음",
    },
    {
      title: "매일 조금씩",
      body: "Progress에서 성장을 확인하세요. 하루 2분이면 충분합니다.",
      cta: "시작",
    },
  ],
  zh: [
    {
      title: "欢迎使用 Frensei",
      body: "你的 AI 日语教练——自然日语，而非教科书日语。",
      cta: "下一步",
    },
    {
      title: "核心循环",
      body: "聊天 → 订正 → 保存表达。记住这三步即可。",
      cta: "下一步",
    },
    {
      title: "每天一点点",
      body: "在 Progress 查看成长。每天 2 分钟就够了。",
      cta: "开始",
    },
  ],
};

export function getTutorialSteps(lang: Lang): TutorialStep[] {
  return STEPS[lang] ?? STEPS.en;
}

/** @deprecated use getTutorialSteps(lang) */
export function getTutorialStepsLegacy(isJa: boolean): TutorialStep[] {
  return getTutorialSteps(isJa ? "ja" : "en");
}
