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
        body: "教科書っぽい日本語から、自然な話し方へ。Frensei はそのための AI コーチです。",
        cta: "次へ",
      },
      {
        title: "まずは一文から",
        body: "Today’s Mission か Chat を開いて、日本語を一文だけ書いてみましょう。",
        cta: "次へ",
      },
      {
        title: "自然な言い換えをもらう",
        body: "より自然な言い方、理由、ほかの例文を Frensei が教えてくれます。",
        cta: "次へ",
      },
      {
        title: "便利な表現を保存",
        body: "添削・フレーズ・単語を Vocabulary に保存して、自分のライブラリを育てましょう。",
        cta: "次へ",
      },
      {
        title: "毎日ちょっとだけ",
        body: "Progress で成長を確認。1日2分の練習でも十分です。ベータ中は Report や More からご意見を送れます。",
        cta: "練習を始める",
      },
    ];
  }

  return [
    {
      title: "Welcome to Frensei",
      body: "Frensei helps you stop sounding like a textbook and start sounding natural in Japanese.",
      cta: "Next",
    },
    {
      title: "Start with one sentence",
      body: "Choose Today’s Mission or open Chat. Just try writing one Japanese sentence.",
      cta: "Next",
    },
    {
      title: "Get natural corrections",
      body: "Frensei shows a better way to say it, explains why, and gives other natural examples.",
      cta: "Next",
    },
    {
      title: "Save useful phrases",
      body: "Save corrections, phrases, and words to build your personal Japanese library.",
      cta: "Next",
    },
    {
      title: "Practice a little every day",
      body: "Your progress grows with daily practice. Try just 2 minutes a day. During beta, share feedback from Report or More.",
      cta: "Start practicing",
    },
  ];
}
