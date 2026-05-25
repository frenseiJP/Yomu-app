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
      body: "Write a Japanese sentence in Chat. Tap below to use the example.",
      cta: "Use this sentence",
    },
    chat_sent: {
      title: "Sending…",
      body: "Frensei is preparing your natural correction.",
    },
    correction_seen: {
      title: "Natural correction",
      body: "See Better, Why, and Other ways — this is how Frensei coaches you.",
      cta: "Next",
    },
    save_prompt: {
      title: "Save useful phrases",
      body: "Tap [Save] on a phrase you want to keep in your Vocabulary.",
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
      body: "Chat に日本語を一文書いてみましょう。下のボタンで例文を入れられます。",
      cta: "この文を使う",
    },
    chat_sent: {
      title: "送信中…",
      body: "Frensei が自然な言い換えを準備しています。",
    },
    correction_seen: {
      title: "自然な言い換え",
      body: "Better・Why・Other ways を確認 — これが Frensei のコーチングです。",
      cta: "次へ",
    },
    save_prompt: {
      title: "フレーズを保存",
      body: "残したい表現の [Save] をタップして Vocabulary に追加しましょう。",
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
      title: "2分で Frensei を試そう",
      body: "教科書っぽい日本語から、自然な話し方へ。実際の画面を使って体験します。",
      cta: "チュートリアルを始める",
      skip: "スキップ",
    };
  }
  return {
    title: "Let's try Frensei in 2 minutes",
    body: "Stop sounding like a textbook. Start sounding natural — with a quick hands-on tour.",
    cta: "Start tutorial",
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
