/** Monetization foundation — free tier limits for logged-in users. */
export const PLAN_FREE = "free" as const;
export const PLAN_PRO = "pro" as const;
export type PlanId = typeof PLAN_FREE | typeof PLAN_PRO;

/** Guest trial (sessionStorage). */
export const GUEST_CHAT_MAX_TURNS = 3;

/** Logged-in free plan: chat messages per calendar day (UTC). */
export const FREE_DAILY_CHAT_MESSAGES = 15;

/** Logged-in free plan: phrase/word saves per calendar day (UTC). */
export const FREE_DAILY_SAVE_ITEMS = 10;

/** Pro plan: generous daily cap (pre-Stripe placeholder). */
export const PRO_DAILY_CHAT_MESSAGES = 500;

export function dailyChatLimitForPlan(plan: PlanId): number {
  return plan === PLAN_PRO ? PRO_DAILY_CHAT_MESSAGES : FREE_DAILY_CHAT_MESSAGES;
}

export function planDisplayName(plan: PlanId, lang: "ja" | "en" | "ko" | "zh"): string {
  if (plan === PLAN_PRO) {
    return lang === "ja" ? "Pro" : lang === "ko" ? "Pro" : lang === "zh" ? "Pro" : "Pro";
  }
  return lang === "ja"
    ? "無料プラン"
    : lang === "ko"
      ? "무료 플랜"
      : lang === "zh"
        ? "免费方案"
        : "Free plan";
}
