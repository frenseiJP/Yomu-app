import type { Lang } from "@/src/utils/i18n/types";

type BetaBadgeCopy = {
  label: string;
  notice: string;
};

const COPY: Record<Lang, BetaBadgeCopy> = {
  en: {
    label: "Beta",
    notice: "Features and data may change during the beta. Your feedback helps us improve.",
  },
  ja: {
    label: "ベータ",
    notice: "ベータ版のため機能やデータが変わる場合があります。フィードバックをお待ちしています。",
  },
  ko: {
    label: "베타",
    notice: "베타 기간에는 기능과 데이터가 변경될 수 있습니다. 피드백을 보내 주세요.",
  },
  zh: {
    label: "测试版",
    notice: "测试期间功能与数据可能调整，欢迎通过反馈告诉我们您的想法。",
  },
};

export function getBetaBadgeCopy(lang: Lang): BetaBadgeCopy {
  return COPY[lang] ?? COPY.en;
}
