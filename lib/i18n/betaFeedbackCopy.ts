import type { Lang } from "@/src/utils/i18n/types";

export type BetaFeedbackCopy = {
  ask: string;
  yes: string;
  no: string;
  note: string;
  placeholder: string;
  send: string;
  skip: string;
  thanks: string;
};

const BETA_FEEDBACK_COPY: Record<Lang, BetaFeedbackCopy> = {
  en: {
    ask: "Quick feedback?",
    yes: "👍 Yes",
    no: "👎 No",
    note: "Optional note",
    placeholder: "What felt helpful or confusing?",
    send: "Send",
    skip: "Later",
    thanks: "Thank you — this helps improve Frensei 🙏",
  },
  ja: {
    ask: "フィードバックをお願いできますか？",
    yes: "👍 はい",
    no: "👎 いいえ",
    note: "ひとこと（任意）",
    placeholder: "使い心地など…",
    send: "送信",
    skip: "あとで",
    thanks: "ありがとうございます 🙏",
  },
  ko: {
    ask: "간단한 피드백을 부탁드려도 될까요?",
    yes: "👍 예",
    no: "👎 아니오",
    note: "한마디 (선택)",
    placeholder: "도움이 됐거나 헷갈렸던 점…",
    send: "보내기",
    skip: "나중에",
    thanks: "감사합니다 🙏",
  },
  zh: {
    ask: "方便快速反馈一下吗？",
    yes: "👍 是",
    no: "👎 否",
    note: "补充说明（可选）",
    placeholder: "哪些有帮助或令人困惑…",
    send: "发送",
    skip: "稍后",
    thanks: "谢谢 🙏",
  },
};

export function getBetaFeedbackCopy(lang: Lang): BetaFeedbackCopy {
  return BETA_FEEDBACK_COPY[lang] ?? BETA_FEEDBACK_COPY.en;
}
