import type { Lang } from "@/src/utils/i18n/types";

export type SettingsPlanCopy = {
  sectionTitle: string;
  pricingTitle: string;
  pricingDesc: string;
};

const COPY: Record<Lang, SettingsPlanCopy> = {
  en: {
    sectionTitle: "Plan",
    pricingTitle: "Pricing",
    pricingDesc: "Free & Pro app · Standard & Intensive lessons (Pro included)",
  },
  ja: {
    sectionTitle: "プラン",
    pricingTitle: "料金プラン",
    pricingDesc: "Free / Pro アプリ · Standard / Intensive レッスン（Pro 込み）",
  },
  ko: {
    sectionTitle: "플랜",
    pricingTitle: "요금제",
    pricingDesc: "무료·Pro 앱 · Standard·Intensive 레슨 (Pro 포함)",
  },
  zh: {
    sectionTitle: "方案",
    pricingTitle: "定价",
    pricingDesc: "Free / Pro 应用 · Standard / Intensive 课程（含 Pro）",
  },
};

export function getSettingsPlanCopy(lang: Lang): SettingsPlanCopy {
  return COPY[lang] ?? COPY.en;
}
