import type { GuidedTutorialStep } from "@/lib/tutorial/types";

export type TutorialHintCopy = {
  title: string;
  body: string;
  cta?: string;
};

export function getTutorialHintCopy(
  step: GuidedTutorialStep,
  isJa: boolean,
): TutorialHintCopy | null {
  if (step === "welcome" || step === "complete") return null;

  const en: Record<Exclude<GuidedTutorialStep, "welcome" | "complete">, TutorialHintCopy> = {
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
  };

  const ja: Record<Exclude<GuidedTutorialStep, "welcome" | "complete">, TutorialHintCopy> = {
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
      title: "Progress",
      body: "少しずつ練習すると、季節のビジュアルが育っていきます。",
      cta: "完了",
    },
  };

  const table = isJa ? ja : en;
  return table[step as Exclude<GuidedTutorialStep, "welcome" | "complete">] ?? null;
}

export function getWelcomeCopy(isJa: boolean): { title: string; body: string; cta: string; skip: string } {
  if (isJa) {
    return {
      title: "1分で体験",
      body: "一文書いて添削を受け、フレーズを1つ保存するだけ。すぐ終わります。",
      cta: "はじめる",
      skip: "スキップ",
    };
  }
  return {
    title: "Try it in 1 minute",
    body: "Write one sentence, get a correction, save one phrase. That's the core loop.",
    cta: "Start",
    skip: "Skip",
  };
}

export function getFinishCopy(isJa: boolean): { title: string; body: string; cta: string } {
  if (isJa) {
    return {
      title: "準備完了",
      body: "毎日少しの練習で十分です。今日のミッションから始めましょう。",
      cta: "今日のミッションを始める",
    };
  }
  return {
    title: "You're ready",
    body: "Try one short practice every day. Start with today's mission.",
    cta: "Start today's mission",
  };
}
