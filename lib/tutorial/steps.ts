export type TutorialStep = {
  title: string;
  body: string;
  cta: string;
};

export function getTutorialSteps(isJa: boolean): TutorialStep[] {
  if (isJa) {
    return [
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
    ];
  }

  return [
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
  ];
}
