import type { Lang } from "@/src/utils/i18n/types";

export type ChatActionsCopy = {
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
};

const COPY: Record<Lang, ChatActionsCopy> = {
  en: {
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
  },
  ja: {
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
  },
  ko: {
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
  },
  zh: {
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
  },
};

export function getChatActionsCopy(lang: Lang): ChatActionsCopy {
  return COPY[lang] ?? COPY.en;
}
