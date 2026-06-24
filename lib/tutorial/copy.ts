import type { GuidedTutorialStep } from "@/lib/tutorial/types";
import type { Lang } from "@/src/utils/i18n/types";

export type TutorialHintCopy = {
  title: string;
  body: string;
  cta?: string;
};

type StepKey = Exclude<GuidedTutorialStep, "welcome" | "complete">;

const HINTS: Record<Lang, Record<StepKey, TutorialHintCopy>> = {
  en: {
    chat_intro: {
      title: "Try one sentence",
      body: "Write Japanese to get a native-like rewrite, or ask in English for a direct answer.",
    },
    chat_sent: {
      title: "Sending…",
      body: "Frensei is preparing your natural correction.",
    },
    correction_seen: {
      title: "Review the reply",
      body: "Japanese input gets native-style improvements. English questions get direct answers.",
      cta: "Next",
    },
    save_prompt: {
      title: "Save this phrase",
      body: "Tap Save this phrase to keep it in Vocabulary for review later.",
      cta: "Done",
    },
    vocabulary_intro: {
      title: "Your Vocabulary",
      body: "Saved phrases appear here. Tap an item to see details.",
      cta: "Next",
    },
    progress_intro: {
      title: "Your progress",
      body: "Practice a little each day and watch your season grow.",
      cta: "Finish",
    },
  },
  ja: {
    chat_intro: {
      title: "一文だけ試す",
      body: "日本語で書くと自然な言い換えを提案。英語で質問するとそのまま答えます。",
    },
    chat_sent: {
      title: "送信中…",
      body: "Frensei が自然な言い換えを準備しています。",
    },
    correction_seen: {
      title: "返信を確認",
      body: "日本語入力はネイティブ寄りに改善。英語の質問にはそのまま回答します。",
      cta: "次へ",
    },
    save_prompt: {
      title: "このフレーズを保存",
      body: "Save this phrase をタップして、あとで復習できるようにしましょう。",
      cta: "完了",
    },
    vocabulary_intro: {
      title: "あなたの Vocabulary",
      body: "保存したフレーズがここに並びます。行をタップすると詳細が見られます。",
      cta: "次へ",
    },
    progress_intro: {
      title: "進捗",
      body: "少しずつ練習すると、季節のビジュアルが育っていきます。",
      cta: "完了",
    },
  },
  ko: {
    chat_intro: {
      title: "한 문장만 시도",
      body: "일본어로 쓰면 자연스러운 표현을, 영어로 물으면 바로 답합니다.",
    },
    chat_sent: {
      title: "전송 중…",
      body: "Frensei가 자연스러운 교정을 준비하고 있어요.",
    },
    correction_seen: {
      title: "답변 확인",
      body: "일본어 입력은 네이티브 스타일로 개선됩니다. 영어 질문에는 바로 답합니다.",
      cta: "다음",
    },
    save_prompt: {
      title: "이 표현 저장",
      body: "Save this phrase를 탭해 어휘에 저장하고 나중에 복습하세요.",
      cta: "완료",
    },
    vocabulary_intro: {
      title: "내 어휘",
      body: "저장한 표현이 여기에 표시됩니다. 항목을 탭하면 자세히 볼 수 있어요.",
      cta: "다음",
    },
    progress_intro: {
      title: "진행 상황",
      body: "매일 조금씩 연습하면 계절 비주얼이 자라요.",
      cta: "완료",
    },
  },
  zh: {
    chat_intro: {
      title: "试一句话",
      body: "写日语获得自然改写，用英语提问则直接回答。",
    },
    chat_sent: {
      title: "发送中…",
      body: "Frensei 正在准备自然订正。",
    },
    correction_seen: {
      title: "查看回复",
      body: "日语输入会获得更自然的表达，英语问题会直接回答。",
      cta: "下一步",
    },
    save_prompt: {
      title: "保存这条表达",
      body: "点击 Save this phrase 保存到词汇本，方便日后复习。",
      cta: "完成",
    },
    vocabulary_intro: {
      title: "你的词汇本",
      body: "保存的表达会显示在这里。点击条目查看详情。",
      cta: "下一步",
    },
    progress_intro: {
      title: "进度",
      body: "每天练习一点，季节视觉会慢慢成长。",
      cta: "完成",
    },
  },
};

const WELCOME: Record<Lang, { title: string; body: string; cta: string; skip: string; badge: string }> = {
  en: {
    title: "Try it in 1 minute",
    body: "Write one sentence, get a correction, save one phrase. That's the core loop.",
    cta: "Start",
    skip: "Skip",
    badge: "Quick guide",
  },
  ja: {
    title: "1分で体験",
    body: "一文書いて添削を受け、フレーズを1つ保存するだけ。すぐ終わります。",
    cta: "はじめる",
    skip: "スキップ",
    badge: "はじめかた",
  },
  ko: {
    title: "1분 체험",
    body: "한 문장 쓰고, 교정 받고, 표현 하나 저장. 핵심 루프입니다.",
    cta: "시작",
    skip: "건너뛰기",
    badge: "빠른 가이드",
  },
  zh: {
    title: "1分钟体验",
    body: "写一句话、获得订正、保存一条表达。这就是核心循环。",
    cta: "开始",
    skip: "跳过",
    badge: "快速指南",
  },
};

const FINISH: Record<Lang, { title: string; body: string; cta: string }> = {
  en: {
    title: "You're ready",
    body: "Try one short practice every day. Start with today's mission.",
    cta: "Start today's mission",
  },
  ja: {
    title: "準備完了",
    body: "毎日少しの練習で十分です。今日のミッションから始めましょう。",
    cta: "今日のミッションを始める",
  },
  ko: {
    title: "준비 완료",
    body: "매일 짧게 연습하면 충분해요. 오늘의 미션부터 시작하세요.",
    cta: "오늘 미션 시작",
  },
  zh: {
    title: "准备就绪",
    body: "每天短练即可。从今日任务开始吧。",
    cta: "开始今日任务",
  },
};

export function getTutorialHintCopy(step: GuidedTutorialStep, lang: Lang): TutorialHintCopy | null {
  if (step === "welcome" || step === "complete") return null;
  const table = HINTS[lang] ?? HINTS.en;
  return table[step as StepKey] ?? null;
}

/** @deprecated use getTutorialHintCopy(step, lang) */
export function getTutorialHintCopyLegacy(step: GuidedTutorialStep, isJa: boolean): TutorialHintCopy | null {
  return getTutorialHintCopy(step, isJa ? "ja" : "en");
}

export function getWelcomeCopy(lang: Lang): { title: string; body: string; cta: string; skip: string; badge: string } {
  return WELCOME[lang] ?? WELCOME.en;
}

export function getFinishCopy(lang: Lang): { title: string; body: string; cta: string } {
  return FINISH[lang] ?? FINISH.en;
}

export function tutorialSkipLabel(lang: Lang): string {
  return lang === "ja" ? "スキップ" : lang === "ko" ? "건너뛰기" : lang === "zh" ? "跳过" : "Skip";
}
