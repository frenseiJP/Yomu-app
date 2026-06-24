import type { Lang } from "@/src/utils/i18n/types";

export type ReplySectionLabels = {
  youWrote: string;
  better: string;
  why: string;
  otherWays: string;
  shadowingChunks: string;
  tryAgain: string;
  readFullExplanation: string;
  niceDefault: string;
};

export type ChatActionsCopy = ReplySectionLabels & {
  coachNoteLabel: string;
  reuseCorrected: string;
  practiceCorrection: string;
  sayAndCloze: string;
  hide: string;
  keepForReview: string;
  savePhrase: string;
  saveCorrection: string;
  saveWord: string;
  saved: string;
  moreSaves: (n: number) => string;
  example: string;
  meaning: string;
  coachToolsTitle: string;
  coachToolsSubtitle: string;
  sessionGoal: string;
  sessionGoalNatural: string;
  sessionGoalParticles: string;
  sessionGoalPolite: string;
  sessionGoalConcise: string;
  speaking: string;
  sayOutLoud: string;
  dismiss: string;
  newChat: string;
  deleteSession: string;
  goalCheckNatural: string;
  goalCheckParticlesClear: string;
  goalCheckParticlesFocus: string;
  goalCheckPoliteMatch: string;
  goalCheckPoliteAdd: string;
  goalCheckConciseDone: string;
  goalCheckConciseShorter: string;
};

const COPY: Record<Lang, ChatActionsCopy> = {
  en: {
    youWrote: "You wrote",
    better: "Better",
    why: "Why",
    otherWays: "Other ways",
    shadowingChunks: "Shadowing chunks",
    tryAgain: "Try again 👇",
    readFullExplanation: "Read full explanation",
    niceDefault: "Nice 👍",
    coachNoteLabel: "Coach Note 🌸",
    reuseCorrected: "Reuse corrected sentence",
    practiceCorrection: "Practice this correction",
    sayAndCloze: "Say & cloze",
    hide: "Hide",
    keepForReview: "Keep for review",
    savePhrase: "Save this phrase",
    saveCorrection: "Save this correction",
    saveWord: "Save this word",
    saved: "Saved",
    moreSaves: (n) => `More saves (${n})`,
    example: "Example:",
    meaning: "Meaning:",
    coachToolsTitle: "Coach tools",
    coachToolsSubtitle: "Goals, paste-to-save, drills — optional extras",
    sessionGoal: "Session goal",
    sessionGoalNatural: "Natural",
    sessionGoalParticles: "Particles",
    sessionGoalPolite: "Politeness",
    sessionGoalConcise: "Concise",
    speaking: "Speaking",
    sayOutLoud: "Say it out loud",
    dismiss: "Dismiss",
    newChat: "New Chat",
    deleteSession: "Delete",
    goalCheckNatural: "Goal check: phrasing became more natural.",
    goalCheckParticlesClear: "Goal check: particle usage is getting clearer.",
    goalCheckParticlesFocus: "Goal check: keep focusing on particles in your next line.",
    goalCheckPoliteMatch: "Goal check: politeness level matches better.",
    goalCheckPoliteAdd: "Goal check: add polite endings for this goal.",
    goalCheckConciseDone: "Goal check: concise sentence achieved.",
    goalCheckConciseShorter: "Goal check: try one shorter version next.",
  },
  ja: {
    youWrote: "あなたの文",
    better: "より自然な言い方",
    why: "理由",
    otherWays: "ほかの言い方",
    shadowingChunks: "シャドーイング用",
    tryAgain: "もう一度試す 👇",
    readFullExplanation: "説明をすべて読む",
    niceDefault: "いいですね 👍",
    coachNoteLabel: "コーチメモ 🌸",
    reuseCorrected: "添削文を再利用",
    practiceCorrection: "この添削を練習",
    sayAndCloze: "声に出す & 穴埋め",
    hide: "閉じる",
    keepForReview: "復習用に残す",
    savePhrase: "このフレーズを保存",
    saveCorrection: "この添削を保存",
    saveWord: "この単語を保存",
    saved: "保存済み",
    moreSaves: (n) => `ほかの保存候補 (${n})`,
    example: "例:",
    meaning: "意味:",
    coachToolsTitle: "コーチツール",
    coachToolsSubtitle: "目標・貼り付け保存・ドリル（任意）",
    sessionGoal: "セッションの目標",
    sessionGoalNatural: "自然さ",
    sessionGoalParticles: "助詞",
    sessionGoalPolite: "丁寧さ",
    sessionGoalConcise: "簡潔さ",
    speaking: "スピーキング",
    sayOutLoud: "声に出して練習",
    dismiss: "閉じる",
    newChat: "新しいチャット",
    deleteSession: "削除",
    goalCheckNatural: "目標チェック：表現がより自然になりました。",
    goalCheckParticlesClear: "目標チェック：助詞の使い方が明確になってきました。",
    goalCheckParticlesFocus: "目標チェック：次は助詞に意識を向けてみましょう。",
    goalCheckPoliteMatch: "目標チェック：丁寧さのレベルが合っています。",
    goalCheckPoliteAdd: "目標チェック：丁寧な語尾を意識してみましょう。",
    goalCheckConciseDone: "目標チェック：簡潔な文になりました。",
    goalCheckConciseShorter: "目標チェック：もう少し短い文も試してみましょう。",
  },
  ko: {
    youWrote: "내가 쓴 문장",
    better: "더 자연스러운 표현",
    why: "이유",
    otherWays: "다른 표현",
    shadowingChunks: "섀도잉 구간",
    tryAgain: "다시 시도 👇",
    readFullExplanation: "설명 전체 보기",
    niceDefault: "좋아요 👍",
    coachNoteLabel: "코치 노트 🌸",
    reuseCorrected: "교정 문장 재사용",
    practiceCorrection: "이 교정 연습하기",
    sayAndCloze: "말하기 & 빈칸",
    hide: "닫기",
    keepForReview: "복습용으로 남기기",
    savePhrase: "이 표현 저장",
    saveCorrection: "이 교정 저장",
    saveWord: "이 단어 저장",
    saved: "저장됨",
    moreSaves: (n) => `더 많은 저장 (${n})`,
    example: "예:",
    meaning: "의미:",
    coachToolsTitle: "코치 도구",
    coachToolsSubtitle: "목표, 붙여넣기 저장, 드릴 — 선택 사항",
    sessionGoal: "세션 목표",
    sessionGoalNatural: "자연스러움",
    sessionGoalParticles: "조사",
    sessionGoalPolite: "정중함",
    sessionGoalConcise: "간결함",
    speaking: "말하기",
    sayOutLoud: "소리 내어 연습",
    dismiss: "닫기",
    newChat: "새 채팅",
    deleteSession: "삭제",
    goalCheckNatural: "목표 확인: 표현이 더 자연스러워졌어요.",
    goalCheckParticlesClear: "목표 확인: 조사 사용이 더 분명해졌어요.",
    goalCheckParticlesFocus: "목표 확인: 다음에는 조사에 집중해 보세요.",
    goalCheckPoliteMatch: "목표 확인: 정중함 수준이 더 잘 맞아요.",
    goalCheckPoliteAdd: "목표 확인: 정중한 어미를 추가해 보세요.",
    goalCheckConciseDone: "목표 확인: 간결한 문장이 됐어요.",
    goalCheckConciseShorter: "목표 확인: 더 짧은 버전도 시도해 보세요.",
  },
  zh: {
    youWrote: "你写的",
    better: "更好的说法",
    why: "原因",
    otherWays: "其他说法",
    shadowingChunks: "跟读片段",
    tryAgain: "再试一次 👇",
    readFullExplanation: "阅读完整解释",
    niceDefault: "不错 👍",
    coachNoteLabel: "教练笔记 🌸",
    reuseCorrected: "复用订正句",
    practiceCorrection: "练习这条订正",
    sayAndCloze: "朗读 & 填空",
    hide: "收起",
    keepForReview: "保留复习",
    savePhrase: "保存这条表达",
    saveCorrection: "保存这条订正",
    saveWord: "保存这个词",
    saved: "已保存",
    moreSaves: (n) => `更多可保存 (${n})`,
    example: "例句:",
    meaning: "含义:",
    coachToolsTitle: "教练工具",
    coachToolsSubtitle: "目标、粘贴保存、练习 — 可选",
    sessionGoal: "会话目标",
    sessionGoalNatural: "自然",
    sessionGoalParticles: "助词",
    sessionGoalPolite: "礼貌",
    sessionGoalConcise: "简洁",
    speaking: "口语",
    sayOutLoud: "大声练习",
    dismiss: "关闭",
    newChat: "新聊天",
    deleteSession: "删除",
    goalCheckNatural: "目标检查：表达更自然了。",
    goalCheckParticlesClear: "目标检查：助词用法更清晰了。",
    goalCheckParticlesFocus: "目标检查：下一句请继续关注助词。",
    goalCheckPoliteMatch: "目标检查：礼貌程度更匹配了。",
    goalCheckPoliteAdd: "目标检查：请加上礼貌语尾。",
    goalCheckConciseDone: "目标检查：句子更简洁了。",
    goalCheckConciseShorter: "目标检查：试试更短的版本。",
  },
};

export function getChatActionsCopy(lang: Lang): ChatActionsCopy {
  return COPY[lang] ?? COPY.en;
}

export function getReplySectionLabels(lang: Lang): ReplySectionLabels {
  const c = getChatActionsCopy(lang);
  return {
    youWrote: c.youWrote,
    better: c.better,
    why: c.why,
    otherWays: c.otherWays,
    shadowingChunks: c.shadowingChunks,
    tryAgain: c.tryAgain,
    readFullExplanation: c.readFullExplanation,
    niceDefault: c.niceDefault,
  };
}
