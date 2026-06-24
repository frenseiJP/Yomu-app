import type { Lang } from "@/src/utils/i18n/types";

export type PricingCopy = {
  title: string;
  betaDisclaimer: string;
  free: string;
  pro: string;
  founder: string;
  freeBullets: string[];
  proBullets: string[];
  founderBullets: string[];
  cta: string;
  back: string;
  betaPreview: string;
};

const COPY: Record<Lang, PricingCopy> = {
  en: {
    title: "Pricing",
    betaDisclaimer: "Payments are not active yet. This is beta pricing infrastructure.",
    free: "Free",
    pro: "Pro",
    founder: "Founder",
    betaPreview: "Beta preview",
    freeBullets: ["15 chats / day", "Save 10 phrases / day", "Daily missions"],
    proBullets: ["Unlimited chat", "Unlimited saves", "Advanced coaching"],
    founderBullets: ["Everything in Pro", "Founder badge", "Early access"],
    cta: "Coming soon",
    back: "Back to app",
  },
  ja: {
    title: "プラン",
    betaDisclaimer: "決済はまだ有効化されていません。ベータ中のプラン設計です。",
    free: "無料",
    pro: "Pro",
    founder: "Founder",
    betaPreview: "ベータプレビュー",
    freeBullets: ["1日15チャット", "1日10フレーズ保存", "デイリーミッション"],
    proBullets: ["チャット無制限", "保存無制限", "高度なコーチング"],
    founderBullets: ["Pro のすべて", "Founder バッジ", "早期アクセス"],
    cta: "近日公開",
    back: "アプリに戻る",
  },
  ko: {
    title: "요금제",
    betaDisclaimer: "결제는 아직 활성화되지 않았습니다. 베타 요금제 설계입니다.",
    free: "무료",
    pro: "Pro",
    founder: "Founder",
    betaPreview: "베타 미리보기",
    freeBullets: ["하루 15회 채팅", "하루 10개 표현 저장", "데일리 미션"],
    proBullets: ["무제한 채팅", "무제한 저장", "고급 코칭"],
    founderBullets: ["Pro 전체 기능", "Founder 배지", "얼리 액세스"],
    cta: "곧 공개",
    back: "앱으로 돌아가기",
  },
  zh: {
    title: "方案",
    betaDisclaimer: "支付尚未启用。这是测试阶段的方案设计。",
    free: "免费",
    pro: "Pro",
    founder: "Founder",
    betaPreview: "测试预览",
    freeBullets: ["每天 15 次聊天", "每天保存 10 条表达", "每日任务"],
    proBullets: ["无限聊天", "无限保存", "高级教练"],
    founderBullets: ["包含 Pro 全部功能", "Founder 徽章", "抢先体验"],
    cta: "即将推出",
    back: "返回应用",
  },
};

export function getPricingCopy(lang: Lang): PricingCopy {
  return COPY[lang] ?? COPY.en;
}
