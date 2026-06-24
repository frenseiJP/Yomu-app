"use client";

import { createClient } from "@/src/utils/supabase/client";
import { isMissingTableError } from "@/src/utils/supabase/schema-errors";
import {
  FREE_DAILY_CHAT_MESSAGES,
  PLAN_FREE,
  PLAN_PRO,
  type PlanId,
  dailyChatLimitForPlan,
} from "@/lib/plan/limits";

const LOCAL_KEY = "frensei:plan:usage:v1";

type LocalUsage = { day: string; count: number; plan: PlanId };

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function readLocal(): LocalUsage {
  if (typeof window === "undefined") {
    return { day: todayUtc(), count: 0, plan: PLAN_FREE };
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return { day: todayUtc(), count: 0, plan: PLAN_FREE };
    const parsed = JSON.parse(raw) as LocalUsage;
    if (parsed.day !== todayUtc()) return { day: todayUtc(), count: 0, plan: parsed.plan ?? PLAN_FREE };
    return parsed;
  } catch {
    return { day: todayUtc(), count: 0, plan: PLAN_FREE };
  }
}

function writeLocal(usage: LocalUsage): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(usage));
  } catch {
    /* ignore */
  }
}

export async function getUserPlan(): Promise<PlanId> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return PLAN_FREE;

    const { data, error } = await supabase
      .from("user_plans")
      .select("plan")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error && !isMissingTableError(error, "user_plans")) return readLocal().plan;
    if (data?.plan === PLAN_PRO) return PLAN_PRO;
    return PLAN_FREE;
  } catch {
    return readLocal().plan;
  }
}

export async function getChatUsageToday(): Promise<{ used: number; limit: number; plan: PlanId }> {
  const plan = await getUserPlan();
  const limit = dailyChatLimitForPlan(plan);
  const local = readLocal();

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { used: local.count, limit, plan };
    }

    const { data, error } = await supabase
      .from("user_plans")
      .select("plan, chat_messages_today, chat_day")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error && !isMissingTableError(error, "user_plans")) {
      return { used: local.count, limit, plan };
    }

    const remotePlan = data?.plan === PLAN_PRO ? PLAN_PRO : PLAN_FREE;
    const remoteLimit = dailyChatLimitForPlan(remotePlan);
    const day = data?.chat_day ?? todayUtc();
    const used = day === todayUtc() ? (data?.chat_messages_today ?? 0) : 0;
    return { used, limit: remoteLimit, plan: remotePlan };
  } catch {
    return { used: local.count, limit, plan };
  }
}

export async function incrementChatUsage(): Promise<{ allowed: boolean; used: number; limit: number }> {
  const before = await getChatUsageToday();
  if (before.used >= before.limit) {
    return { allowed: false, used: before.used, limit: before.limit };
  }

  const nextUsed = before.used + 1;
  const local = readLocal();
  writeLocal({ day: todayUtc(), count: nextUsed, plan: before.plan });

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { allowed: true, used: nextUsed, limit: before.limit };
    }

    const today = todayUtc();
    await supabase.from("user_plans").upsert(
      {
        user_id: user.id,
        plan: before.plan,
        chat_messages_today: nextUsed,
        chat_day: today,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
  } catch {
    /* local fallback ok */
  }

  return { allowed: true, used: nextUsed, limit: before.limit };
}

export function freeDailyLimitMessage(lang: "ja" | "en" | "ko" | "zh"): string {
  const n = FREE_DAILY_CHAT_MESSAGES;
  if (lang === "ja") return `本日の無料メッセージ上限（${n}件）に達しました。明日また使えます。`;
  if (lang === "ko") return `오늘 무료 메시지 한도(${n}회)에 도달했습니다. 내일 다시 이용해 주세요.`;
  if (lang === "zh") return `已达到今日免费消息上限（${n}条）。请明天再来。`;
  return `You've reached today's free message limit (${n}). Come back tomorrow or upgrade to Pro.`;
}
