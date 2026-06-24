import type { MistakeCategoryKey } from "@/lib/habit/types";
import type { Lang } from "@/src/utils/i18n/types";

const LABELS: Record<Lang, Record<MistakeCategoryKey, string>> = {
  en: {
    particle: "Particles",
    politeness: "Politeness",
    tense: "Tense",
    word_choice: "Word choice",
    word_order: "Word order",
    register: "Register",
    other: "Other",
  },
  ja: {
    particle: "助詞",
    politeness: "丁寧さ",
    tense: "時制",
    word_choice: "語彙",
    word_order: "語順",
    register: "場面・文体",
    other: "その他",
  },
  ko: {
    particle: "조사",
    politeness: "경어",
    tense: "시제",
    word_choice: "어휘",
    word_order: "어순",
    register: "상황·문체",
    other: "기타",
  },
  zh: {
    particle: "助词",
    politeness: "礼貌",
    tense: "时态",
    word_choice: "词汇",
    word_order: "语序",
    register: "场合·语体",
    other: "其他",
  },
};

const HINTS: Record<Lang, Record<MistakeCategoryKey, string>> = {
  en: {
    particle: "は・が・を・に — the glue of Japanese",
    politeness: "です/ます and softening your tone",
    tense: "Past, present, and ongoing actions",
    word_choice: "More natural words for the situation",
    word_order: "Where pieces land in a sentence",
    register: "Casual vs polite for the moment",
    other: "Patterns outside the main categories",
  },
  ja: {
    particle: "は・が・を・に — 日本語のつなぎ目",
    politeness: "です・ますと柔らかい言い方",
    tense: "過去・現在・進行の使い分け",
    word_choice: "場面に合った自然な語彙",
    word_order: "文の中での語の順番",
    register: "カジュアルと丁寧の切り替え",
    other: "主要カテゴリ以外のパターン",
  },
  ko: {
    particle: "は・が・を・に — 일본어의 연결 고리",
    politeness: "です/ます와 부드러운 말투",
    tense: "과거·현재·진행 구분",
    word_choice: "상황에 맞는 자연스러운 어휘",
    word_order: "문장 안에서 단어가 놓이는 위치",
    register: "캐주얼과 정중한 말투 전환",
    other: "주요 범주 밖의 패턴",
  },
  zh: {
    particle: "は・が・を・に — 日语的衔接",
    politeness: "です/ます 与柔和语气",
    tense: "过去、现在与进行",
    word_choice: "更贴合场景的自然用词",
    word_order: "句子中词语的位置",
    register: "口语与礼貌的切换",
    other: "主要类别之外的表达",
  },
};

export function getSkillTreeLabel(lang: Lang, key: MistakeCategoryKey): string {
  return LABELS[lang]?.[key] ?? LABELS.en[key];
}

export function getSkillTreeHint(lang: Lang, key: MistakeCategoryKey): string {
  return HINTS[lang]?.[key] ?? HINTS.en[key];
}
