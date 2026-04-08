export type Season = "spring" | "summer" | "autumn" | "winter";

export interface SeasonalProgressState {
  season: Season;
  stage: 0 | 1 | 2 | 3 | 4;
  title: string;
  description: string;
  visualTheme: string;
  progressRatio: number;
  streakCount: number;
  recentActivityCount: number;
  unlockedMoments: string[];
}

function seasonByMonth(month1to12: number): Season {
  if (month1to12 >= 3 && month1to12 <= 5) return "spring";
  if (month1to12 >= 6 && month1to12 <= 8) return "summer";
  if (month1to12 >= 9 && month1to12 <= 11) return "autumn";
  return "winter";
}

const SEASON_COPY: Record<Season, { titles: string[]; desc: string[]; theme: string }> = {
  spring: {
    titles: ["静かな枝先", "小さなつぼみ", "若葉の気配", "花がひらく", "満開のさくら"],
    desc: [
      "学びの種を植えました。今日の一歩が芽になります。",
      "やさしい表現が、少しずつ身についてきています。",
      "毎日の積み重ねが、自然な会話力を育てています。",
      "丁寧な言い回しが会話に咲き始めています。",
      "続けた時間が、あなたらしい日本語として花開いています。",
    ],
    theme: "from-pink-200/30 via-rose-200/20 to-slate-900",
  },
  summer: {
    titles: ["朝の若葉", "青空の伸び", "緑の重なり", "夏の勢い", "夏祭りの光"],
    desc: [
      "今日の練習が、次の会話の自信になります。",
      "言い換えの幅が少しずつ広がっています。",
      "実用的な表現が日常で使える形に育っています。",
      "会話の瞬発力が上がってきました。",
      "学習の熱量が、ことばの自然さに変わっています。",
    ],
    theme: "from-emerald-200/25 via-cyan-200/15 to-slate-900",
  },
  autumn: {
    titles: ["色づきの始まり", "黄葉の線", "橙の重なり", "紅葉の深まり", "錦の景色"],
    desc: [
      "落ち着いた反復が、確かな定着につながっています。",
      "ミスの修正が、実力として残り始めています。",
      "語彙の使い分けが、より自然になってきました。",
      "文脈に合う丁寧さを選べるようになっています。",
      "積み上げた学びが、豊かな表現として実ってきています。",
    ],
    theme: "from-amber-200/30 via-orange-200/20 to-slate-900",
  },
  winter: {
    titles: ["静かな夜", "雪の足あと", "灯りの継続", "白い朝の安定", "冬灯りの完成"],
    desc: [
      "静かな継続が、次の季節の強さをつくります。",
      "短い復習でも、着実に力になります。",
      "会話と復習の往復が定着を支えています。",
      "難しい表現にも落ち着いて向き合えています。",
      "見えない努力が、確かな言語感覚になっています。",
    ],
    theme: "from-sky-200/20 via-indigo-200/10 to-slate-900",
  },
};

export function buildSeasonalProgressState(params: {
  now?: Date;
  streak: number;
  recentActivityCount: number;
  missionDoneCount: number;
  reviewDoneCount: number;
  chatCount: number;
  topicCount: number;
}): SeasonalProgressState {
  const now = params.now ?? new Date();
  const season = seasonByMonth(now.getMonth() + 1);
  const weighted =
    Math.min(params.streak, 10) * 2 +
    Math.min(params.recentActivityCount, 7) * 2 +
    Math.min(params.missionDoneCount, 20) +
    Math.min(params.reviewDoneCount, 30) +
    Math.min(params.chatCount, 60) * 0.2 +
    Math.min(params.topicCount, 30) * 0.8;
  const progressRatio = Math.max(0, Math.min(1, weighted / 60));
  const stage = Math.min(4, Math.floor(progressRatio * 5)) as 0 | 1 | 2 | 3 | 4;
  const copy = SEASON_COPY[season];

  const unlockedMoments: string[] = [];
  if (params.streak >= 3) unlockedMoments.push("3-day rhythm");
  if (params.streak >= 7) unlockedMoments.push("weekly consistency");
  if (params.reviewDoneCount >= 10) unlockedMoments.push("review stability");
  if (params.topicCount >= 5) unlockedMoments.push("expression practice");

  return {
    season,
    stage,
    title: copy.titles[stage],
    description: copy.desc[stage],
    visualTheme: copy.theme,
    progressRatio,
    streakCount: params.streak,
    recentActivityCount: params.recentActivityCount,
    unlockedMoments,
  };
}
