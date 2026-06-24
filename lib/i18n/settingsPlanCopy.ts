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
    pricingDesc: "Free, Pro, and Founder (beta preview)",
  },
  ja: {
    sectionTitle: "プラン",
    pricingTitle: "料金プラン",
    pricingDesc: "無料・Pro・Founder（ベータプレビュー）",
  },
  ko: {
    sectionTitle: "플랜",
    pricingTitle: "요금제",
    pricingDesc: "무료, Pro, Founder (베타 미리보기)",
  },
  zh: {
    sectionTitle: "方案",
    pricingTitle: "定价",
    pricingDesc: "免费、Pro、Founder（测试预览）",
  },
};

export function getSettingsPlanCopy(lang: Lang): SettingsPlanCopy {
  return COPY[lang] ?? COPY.en;
}
