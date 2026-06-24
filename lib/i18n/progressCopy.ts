import type { Lang } from "@/src/utils/i18n/types";

export type ProgressCopy = {
  title: string;
  subtitle: string;
  activeDays: string;
  thisWeek: string;
  conversations: string;
  sessionsCompleted: string;
  reviewDue: string;
  wordsAndCorrections: string;
  japaneseOutput: string;
  charsThisWeek: string;
  retryWithCorrection: string;
  timesReused: string;
  skillPathTitle: string;
  skillPathSubtitle: string;
  detailedTrendsTitle: string;
  detailedTrendsSubtitle: string;
  weakPointTrend: string;
  noCorrectionTrends: string;
  drillHistory: string;
  noDrillAttempts: string;
  weeklyDrillTrend: string;
  noWeeklyDrillTrend: string;
  trendNew: string;
  moreTitle: string;
  skillPathCoachTitle: string;
  skillPathCoachSubtitle: string;
  focusNow: string;
  locked: string;
  practiceWithSensei: string;
  unlockAt: (pct: number) => string;
  weeklyGoalTitle: string;
  weeklyGoalBody: (label: string) => string;
  weeklyGoalMet: string;
  weeklyGoalProgress: (pct: number) => string;
  weeklyGoalPractice: (label: string) => string;
  usefulPhraseTitle: string;
  usefulPhraseSubtitle: (phrase: string) => string;
  moreHistoryTitle: string;
  moreHistoryDesc: string;
  moreReportTitle: string;
  moreReportDesc: string;
  moreFeedbackTitle: string;
  moreFeedbackDesc: string;
  morePricingTitle: string;
  morePricingDesc: string;
  moreTutorialTitle: string;
  moreTutorialDesc: string;
  moreSettingsDesc: string;
  seasonalThisWeek: string;
  seasonalRhythm: string;
  phraseMeaningLabel: string;
  phraseWhenLabel: string;
  phrasePractice: string;
};

const COPY: Record<Lang, ProgressCopy> = {
  en: {
    title: "Progress",
    subtitle: "Your tree grows when you chat — details are optional.",
    activeDays: "Active days",
    thisWeek: "this week",
    conversations: "Conversations",
    sessionsCompleted: "sessions completed",
    reviewDue: "Review due",
    wordsAndCorrections: "words and corrections",
    japaneseOutput: "Japanese output",
    charsThisWeek: "chars this week",
    retryWithCorrection: "Retry with correction",
    timesReused: "times reused",
    skillPathTitle: "Skill path & content",
    skillPathSubtitle: "Optional — grow categories and save from real text",
    detailedTrendsTitle: "Detailed trends",
    detailedTrendsSubtitle: "Drills, corrections, topics",
    weakPointTrend: "Weak-point trend",
    noCorrectionTrends: "No correction trends yet this week.",
    drillHistory: "Drill history",
    noDrillAttempts: "No drill attempts yet.",
    weeklyDrillTrend: "Weekly drill average trend",
    noWeeklyDrillTrend: "No weekly drill trend yet.",
    trendNew: "(new)",
    moreTitle: "More",
    skillPathCoachTitle: "Coach skill path",
    skillPathCoachSubtitle: "Built from your corrections and drills — not a grammar textbook.",
    focusNow: "Focus now:",
    locked: "· locked",
    practiceWithSensei: "Practice this with Sensei →",
    unlockAt: (pct) =>
      `Unlock the next step at ${pct}% mastery. Keep chatting — your tree grows from real mistakes.`,
    weeklyGoalTitle: "Weekly coach goal",
    weeklyGoalBody: (label) => `This week: grow ${label} from your real corrections.`,
    weeklyGoalMet: "Goal met 🎉",
    weeklyGoalProgress: (pct) => `${pct}% of weekly target`,
    weeklyGoalPractice: (label) => `Practice ${label} with Sensei →`,
    usefulPhraseTitle: "Today's useful phrase",
    usefulPhraseSubtitle: (phrase) => `${phrase} · tap to expand`,
    moreHistoryTitle: "Learning history",
    moreHistoryDesc: "Continue past chat sessions",
    moreReportTitle: "Report",
    moreReportDesc: "Learning summary and beta feedback links",
    moreFeedbackTitle: "Feedback (beta)",
    moreFeedbackDesc: "Report bugs, requests, or what you liked",
    morePricingTitle: "Pricing",
    morePricingDesc: "Free, Pro, and Founder plans (beta)",
    moreTutorialTitle: "How to use Frensei",
    moreTutorialDesc: "60-second quick guide",
    moreSettingsDesc: "Language, tone, region and app preferences",
    seasonalThisWeek: "This week",
    seasonalRhythm: "Rhythm",
    phraseMeaningLabel: "Meaning",
    phraseWhenLabel: "When to use",
    phrasePractice: "Practice",
  },
  ja: {
    title: "進捗",
    subtitle: "チャットすると木が育ちます。詳細はお好みで。",
    activeDays: "アクティブ日数",
    thisWeek: "今週",
    conversations: "会話",
    sessionsCompleted: "セッション完了",
    reviewDue: "復習待ち",
    wordsAndCorrections: "語彙と添削",
    japaneseOutput: "日本語出力",
    charsThisWeek: "文字（今週）",
    retryWithCorrection: "添削の再利用",
    timesReused: "回再利用",
    skillPathTitle: "スキルパスとコンテンツ",
    skillPathSubtitle: "任意 — カテゴリを伸ばし、実際のテキストから保存",
    detailedTrendsTitle: "詳細トレンド",
    detailedTrendsSubtitle: "ドリル・添削・トピック",
    weakPointTrend: "弱点トレンド",
    noCorrectionTrends: "今週はまだ添削トレンドがありません。",
    drillHistory: "ドリル履歴",
    noDrillAttempts: "まだドリルがありません。",
    weeklyDrillTrend: "週間ドリル平均",
    noWeeklyDrillTrend: "まだ週間ドリルトレンドがありません。",
    trendNew: "（新規）",
    moreTitle: "その他",
    skillPathCoachTitle: "コーチのスキルパス",
    skillPathCoachSubtitle: "添削とドリルから作られます — 文法教科書ではありません。",
    focusNow: "今のフォーカス:",
    locked: "· ロック中",
    practiceWithSensei: "Sensei と練習 →",
    unlockAt: (pct) =>
      `次のステップは習熟度 ${pct}% で解放。チャットを続けて、実際のミスから成長しましょう。`,
    weeklyGoalTitle: "週間コーチ目標",
    weeklyGoalBody: (label) => `今週: 実際の添削から「${label}」を伸ばす`,
    weeklyGoalMet: "目標達成 🎉",
    weeklyGoalProgress: (pct) => `週間目標の ${pct}%`,
    weeklyGoalPractice: (label) => `「${label}」を Sensei と練習 →`,
    usefulPhraseTitle: "今日の便利フレーズ",
    usefulPhraseSubtitle: (phrase) => `${phrase} · タップで展開`,
    moreHistoryTitle: "学習履歴",
    moreHistoryDesc: "過去のチャットを続ける",
    moreReportTitle: "レポート",
    moreReportDesc: "学習サマリーとベータフィードバック",
    moreFeedbackTitle: "フィードバック（ベータ）",
    moreFeedbackDesc: "バグ・要望・感想を送る",
    morePricingTitle: "プラン",
    morePricingDesc: "Free / Pro / Founder（ベータ）",
    moreTutorialTitle: "Frensei の使い方",
    moreTutorialDesc: "60秒クイックガイド",
    moreSettingsDesc: "言語・トーン・地域などの設定",
    seasonalThisWeek: "今週",
    seasonalRhythm: "リズム",
    phraseMeaningLabel: "意味",
    phraseWhenLabel: "使う場面",
    phrasePractice: "練習する",
  },
  ko: {
    title: "진행 상황",
    subtitle: "채팅하면 나무가 자랍니다. 세부 사항은 선택입니다.",
    activeDays: "활동 일수",
    thisWeek: "이번 주",
    conversations: "대화",
    sessionsCompleted: "완료한 세션",
    reviewDue: "복습 대기",
    wordsAndCorrections: "어휘와 교정",
    japaneseOutput: "일본어 출력",
    charsThisWeek: "글자 (이번 주)",
    retryWithCorrection: "교정 재사용",
    timesReused: "회 재사용",
    skillPathTitle: "스킬 경로 & 콘텐츠",
    skillPathSubtitle: "선택 — 카테고리를 키우고 실제 텍스트에서 저장",
    detailedTrendsTitle: "상세 트렌드",
    detailedTrendsSubtitle: "드릴, 교정, 토픽",
    weakPointTrend: "약점 트렌드",
    noCorrectionTrends: "이번 주 교정 트렌드가 아직 없습니다.",
    drillHistory: "드릴 기록",
    noDrillAttempts: "아직 드릴 시도가 없습니다.",
    weeklyDrillTrend: "주간 드릴 평균",
    noWeeklyDrillTrend: "아직 주간 드릴 트렌드가 없습니다.",
    trendNew: "(신규)",
    moreTitle: "더보기",
    skillPathCoachTitle: "코치 스킬 경로",
    skillPathCoachSubtitle: "교정과 드릴에서 만들어집니다 — 문법 교과서가 아닙니다.",
    focusNow: "지금 집중:",
    locked: "· 잠김",
    practiceWithSensei: "Sensei와 연습 →",
    unlockAt: (pct) =>
      `다음 단계는 숙련도 ${pct}%에서 해제됩니다. 채팅을 이어가며 실제 실수에서 성장하세요.`,
    weeklyGoalTitle: "주간 코치 목표",
    weeklyGoalBody: (label) => `이번 주: 실제 교정에서 ${label} 키우기`,
    weeklyGoalMet: "목표 달성 🎉",
    weeklyGoalProgress: (pct) => `주간 목표의 ${pct}%`,
    weeklyGoalPractice: (label) => `${label} Sensei와 연습 →`,
    usefulPhraseTitle: "오늘의 유용한 표현",
    usefulPhraseSubtitle: (phrase) => `${phrase} · 탭하여 펼치기`,
    moreHistoryTitle: "학습 기록",
    moreHistoryDesc: "이전 채팅을 이어가기",
    moreReportTitle: "리포트",
    moreReportDesc: "학습 요약 및 베타 피드백",
    moreFeedbackTitle: "피드백 (베타)",
    moreFeedbackDesc: "버그, 요청, 의견 보내기",
    morePricingTitle: "플랜",
    morePricingDesc: "Free / Pro / Founder (베타)",
    moreTutorialTitle: "Frensei 사용법",
    moreTutorialDesc: "60초 빠른 가이드",
    moreSettingsDesc: "언어, 톤, 지역 등 앱 설정",
    seasonalThisWeek: "이번 주",
    seasonalRhythm: "리듬",
    phraseMeaningLabel: "의미",
    phraseWhenLabel: "사용 상황",
    phrasePractice: "연습하기",
  },
  zh: {
    title: "进度",
    subtitle: "聊天时树会成长——详情可选。",
    activeDays: "活跃天数",
    thisWeek: "本周",
    conversations: "对话",
    sessionsCompleted: "已完成会话",
    reviewDue: "待复习",
    wordsAndCorrections: "词汇与订正",
    japaneseOutput: "日语输出",
    charsThisWeek: "字符（本周）",
    retryWithCorrection: "订正复用",
    timesReused: "次复用",
    skillPathTitle: "技能路径与内容",
    skillPathSubtitle: "可选——从真实文本中提升类别并保存",
    detailedTrendsTitle: "详细趋势",
    detailedTrendsSubtitle: "练习、订正、主题",
    weakPointTrend: "薄弱点趋势",
    noCorrectionTrends: "本周尚无订正趋势。",
    drillHistory: "练习记录",
    noDrillAttempts: "尚无练习记录。",
    weeklyDrillTrend: "周练习平均分趋势",
    noWeeklyDrillTrend: "尚无周练习趋势。",
    trendNew: "（新）",
    moreTitle: "更多",
    skillPathCoachTitle: "教练技能路径",
    skillPathCoachSubtitle: "来自你的订正与练习——不是语法课本。",
    focusNow: "当前重点:",
    locked: "· 已锁定",
    practiceWithSensei: "与 Sensei 练习 →",
    unlockAt: (pct) => `下一步在熟练度 ${pct}% 时解锁。继续聊天，从真实错误中成长。`,
    weeklyGoalTitle: "每周教练目标",
    weeklyGoalBody: (label) => `本周：从真实订正中提升${label}`,
    weeklyGoalMet: "目标达成 🎉",
    weeklyGoalProgress: (pct) => `周目标的 ${pct}%`,
    weeklyGoalPractice: (label) => `与 Sensei 练习${label} →`,
    usefulPhraseTitle: "今日实用短语",
    usefulPhraseSubtitle: (phrase) => `${phrase} · 点击展开`,
    moreHistoryTitle: "学习记录",
    moreHistoryDesc: "继续之前的聊天",
    moreReportTitle: "报告",
    moreReportDesc: "学习摘要与测试反馈",
    moreFeedbackTitle: "反馈（测试版）",
    moreFeedbackDesc: "报告问题、建议或好评",
    morePricingTitle: "方案",
    morePricingDesc: "Free / Pro / Founder（测试版）",
    moreTutorialTitle: "如何使用 Frensei",
    moreTutorialDesc: "60 秒快速指南",
    moreSettingsDesc: "语言、语气、地区等应用偏好",
    seasonalThisWeek: "本周",
    seasonalRhythm: "节奏",
    phraseMeaningLabel: "含义",
    phraseWhenLabel: "使用场景",
    phrasePractice: "练习",
  },
};

export function getProgressCopy(lang: Lang): ProgressCopy {
  return COPY[lang] ?? COPY.en;
}
