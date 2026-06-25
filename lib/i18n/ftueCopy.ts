import type { Lang } from "@/src/utils/i18n/types";

export type FtuePickerCopy = {
  title: string;
  speakNaturally: string;
  recommendedFirst: string;
  dailySituation: string;
  freeChat: string;
};

const COPY: Record<Lang, FtuePickerCopy> = {
  en: {
    title: "What do you want to practice?",
    speakNaturally: "Speak naturally",
    recommendedFirst: "Recommended first",
    dailySituation: "Daily situation",
    freeChat: "Free chat",
  },
  ja: {
    title: "何を練習しますか？",
    speakNaturally: "自然に話す",
    recommendedFirst: "はじめにおすすめ",
    dailySituation: "日常の場面",
    freeChat: "自由チャット",
  },
  ko: {
    title: "무엇을 연습할까요?",
    speakNaturally: "자연스럽게 말하기",
    recommendedFirst: "처음 추천",
    dailySituation: "일상 상황",
    freeChat: "자유 채팅",
  },
  zh: {
    title: "想练习什么？",
    speakNaturally: "自然表达",
    recommendedFirst: "首次推荐",
    dailySituation: "日常场景",
    freeChat: "自由聊天",
  },
};

export function getFtuePickerCopy(lang: Lang): FtuePickerCopy {
  return COPY[lang] ?? COPY.en;
}
