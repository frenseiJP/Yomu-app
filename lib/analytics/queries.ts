import { createClient } from "@supabase/supabase-js";

export type AnalyticsRange = 7 | 14 | 30;

export type EventDailyRow = {
  day: string;
  event_type: string;
  event_count: number;
  unique_users: number;
};

export type RouteDailyRow = {
  day: string;
  route: string;
  event_type: string;
  event_count: number;
  unique_users: number;
};

export type AnalyticsSummary = {
  rangeDays: AnalyticsRange;
  generatedAt: string;
  configured: boolean;
  error?: string;
  totals: {
    events: number;
    uniqueUsers: number;
    registeredUsers: number | null;
  };
  eventBreakdown: { event_type: string; count: number; unique_users: number }[];
  tabUsage: { tab: string; count: number }[];
  funnel: {
    landing_view: number;
    guest_chat_start: number;
    guest_chat_turn: number;
    guest_chat_limit: number;
    signup_cta_click: number;
    login_success: number;
    chat_send: number;
    vocabulary_save: number;
  };
  tutorial: {
    shown: number;
    started: number;
    completed: number;
    skipped: number;
  };
  topRoutes: { route: string; count: number }[];
  recentFeedback: {
    created_at: string;
    user_id: string;
    display_name: string | null;
    body: string;
    source: string;
  }[];
  dailyTrend: EventDailyRow[];
};

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function sinceIso(days: AnalyticsRange): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

function countEvents(
  rows: { event_type: string; event_count: number; unique_users: number }[],
  type: string,
): number {
  return rows
    .filter((r) => r.event_type === type)
    .reduce((sum, r) => sum + Number(r.event_count || 0), 0);
}

export async function fetchAnalyticsSummary(rangeDays: AnalyticsRange = 7): Promise<AnalyticsSummary> {
  const empty: AnalyticsSummary = {
    rangeDays,
    generatedAt: new Date().toISOString(),
    configured: false,
    totals: { events: 0, uniqueUsers: 0, registeredUsers: null },
    eventBreakdown: [],
    tabUsage: [],
    funnel: {
      landing_view: 0,
      guest_chat_start: 0,
      guest_chat_turn: 0,
      guest_chat_limit: 0,
      signup_cta_click: 0,
      login_success: 0,
      chat_send: 0,
      vocabulary_save: 0,
    },
    tutorial: { shown: 0, started: 0, completed: 0, skipped: 0 },
    topRoutes: [],
    recentFeedback: [],
    dailyTrend: [],
  };

  const supabase = getAdminClient();
  if (!supabase) {
    return {
      ...empty,
      error: "SUPABASE_SERVICE_ROLE_KEY が未設定です。Supabase → Settings → API の service_role key を Vercel に追加してください。",
    };
  }

  const since = sinceIso(rangeDays);

  const [dailyRes, routeRes, logsRes, feedbackRes, authCountRes] = await Promise.all([
    supabase
      .from("beta_event_logs_daily")
      .select("day, event_type, event_count, unique_users")
      .gte("day", since)
      .order("day", { ascending: false }),
    supabase
      .from("beta_event_logs_route_daily")
      .select("day, route, event_type, event_count, unique_users")
      .gte("day", since)
      .eq("event_type", "page_view")
      .order("event_count", { ascending: false })
      .limit(50),
    supabase
      .from("beta_event_logs")
      .select("event_type, user_id, metadata")
      .gte("created_at", since)
      .limit(5000),
    supabase
      .from("beta_feedback_submissions")
      .select("created_at, user_id, display_name, body, source")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase.auth.admin.listUsers({ page: 1, perPage: 200 }),
  ]);

  if (dailyRes.error) {
    return {
      ...empty,
      configured: true,
      error: `beta_event_logs の読み取りに失敗: ${dailyRes.error.message}（マイグレーション未適用の可能性）`,
    };
  }

  const dailyRows = (dailyRes.data ?? []) as EventDailyRow[];
  const routeRows = (routeRes.data ?? []) as RouteDailyRow[];
  const rawLogs = logsRes.data ?? [];

  const breakdownMap = new Map<string, { count: number; users: Set<string> }>();
  for (const row of dailyRows) {
    const prev = breakdownMap.get(row.event_type) ?? { count: 0, users: new Set<string>() };
    prev.count += Number(row.event_count);
    breakdownMap.set(row.event_type, prev);
  }

  for (const log of rawLogs) {
    const t = String(log.event_type);
    const prev = breakdownMap.get(t) ?? { count: 0, users: new Set<string>() };
    prev.count += 1;
    if (log.user_id) prev.users.add(String(log.user_id));
    breakdownMap.set(t, prev);
  }

  const eventBreakdown = [...breakdownMap.entries()]
    .map(([event_type, v]) => ({
      event_type,
      count: v.count,
      unique_users: v.users.size || 0,
    }))
    .sort((a, b) => b.count - a.count);

  const tabCounts = new Map<string, number>();
  for (const log of rawLogs) {
    if (log.event_type !== "shell_view") continue;
    const meta = log.metadata as { tab?: string } | null;
    const tab = meta?.tab ?? "unknown";
    tabCounts.set(tab, (tabCounts.get(tab) ?? 0) + 1);
  }

  const routeTotals = new Map<string, number>();
  for (const r of routeRows) {
    routeTotals.set(r.route, (routeTotals.get(r.route) ?? 0) + Number(r.event_count));
  }

  const uniqueUsers = new Set(
    rawLogs.map((l) => l.user_id).filter((id): id is string => typeof id === "string" && id.length > 0),
  );

  return {
    rangeDays,
    generatedAt: new Date().toISOString(),
    configured: true,
    totals: {
      events: rawLogs.length || dailyRows.reduce((s, r) => s + Number(r.event_count), 0),
      uniqueUsers: uniqueUsers.size,
      registeredUsers: authCountRes.error
        ? null
        : (authCountRes.data?.users?.length ?? null),
    },
    eventBreakdown,
    tabUsage: [...tabCounts.entries()]
      .map(([tab, count]) => ({ tab, count }))
      .sort((a, b) => b.count - a.count),
    funnel: {
      landing_view: countEvents(dailyRows, "landing_view"),
      guest_chat_start: countEvents(dailyRows, "guest_chat_start"),
      guest_chat_turn: countEvents(dailyRows, "guest_chat_turn"),
      guest_chat_limit: countEvents(dailyRows, "guest_chat_limit"),
      signup_cta_click: countEvents(dailyRows, "signup_cta_click"),
      login_success: countEvents(dailyRows, "login_success"),
      chat_send: countEvents(dailyRows, "chat_send"),
      vocabulary_save: countEvents(dailyRows, "vocabulary_save"),
    },
    tutorial: {
      shown: countEvents(dailyRows, "tutorial_shown"),
      started: countEvents(dailyRows, "tutorial_started"),
      completed: countEvents(dailyRows, "tutorial_completed"),
      skipped: countEvents(dailyRows, "tutorial_skipped"),
    },
    topRoutes: [...routeTotals.entries()]
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12),
    recentFeedback: (feedbackRes.data ?? []).map((f) => ({
      created_at: String(f.created_at),
      user_id: String(f.user_id),
      display_name: f.display_name ? String(f.display_name) : null,
      body: String(f.body).slice(0, 280),
      source: String(f.source),
    })),
    dailyTrend: dailyRows.slice(0, 14),
  };
}
