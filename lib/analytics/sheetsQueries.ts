import type { AnalyticsRange, AnalyticsSummary } from "@/lib/analytics/queries";

function sinceMs(days: AnalyticsRange): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function emptySummary(rangeDays: AnalyticsRange, note?: string): AnalyticsSummary {
  return {
    rangeDays,
    generatedAt: new Date().toISOString(),
    configured: false,
    error: note,
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
}

async function readGasEchoText(res: Response): Promise<string> {
  if (res.status === 302 || res.status === 303) {
    const location = res.headers.get("location");
    if (location) {
      const follow = await fetch(location, { cache: "no-store", redirect: "follow" });
      return follow.text();
    }
  }
  return res.text();
}

type AnalyticsRow = {
  createdAt: string;
  userId: string;
  eventType: string;
  sessionId: string;
  route: string;
  metadata: string;
};

function parseMetadata(raw: string): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function countType(rows: AnalyticsRow[], type: string): number {
  return rows.filter((r) => r.eventType === type).length;
}

export async function fetchAnalyticsSummaryFromSheets(
  rangeDays: AnalyticsRange = 7,
): Promise<AnalyticsSummary | null> {
  const webhook = process.env.FEEDBACK_SHEETS_WEBHOOK_URL?.trim();
  const secret = process.env.ADMIN_ANALYTICS_SECRET?.trim();
  if (!webhook || !secret) return null;

  const url = new URL(webhook);
  url.searchParams.set("action", "analytics_summary");
  url.searchParams.set("days", String(rangeDays));
  url.searchParams.set("secret", secret);

  try {
    const res = await fetch(url.toString(), { method: "GET", cache: "no-store", redirect: "manual" });
    const text = await readGasEchoText(res);
    const parsed = JSON.parse(text) as {
      ok?: boolean;
      error?: string;
      rows?: AnalyticsRow[];
      source?: string;
    };

    if (!parsed.ok || !Array.isArray(parsed.rows)) {
      return null;
    }

    const cutoff = sinceMs(rangeDays);
    const rows = parsed.rows.filter((row) => {
      const ts = Date.parse(row.createdAt);
      return Number.isFinite(ts) && ts >= cutoff;
    });

    const breakdownMap = new Map<string, { count: number; users: Set<string> }>();
    const tabCounts = new Map<string, number>();
    const routeCounts = new Map<string, number>();
    const dailyMap = new Map<string, Map<string, number>>();
    const uniqueUsers = new Set<string>();

    for (const row of rows) {
      const type = row.eventType || "unknown";
      const prev = breakdownMap.get(type) ?? { count: 0, users: new Set<string>() };
      prev.count += 1;
      if (row.userId) {
        prev.users.add(row.userId);
        uniqueUsers.add(row.userId);
      }
      breakdownMap.set(type, prev);

      if (type === "shell_view") {
        const meta = parseMetadata(row.metadata);
        const tab = typeof meta?.tab === "string" ? meta.tab : "unknown";
        tabCounts.set(tab, (tabCounts.get(tab) ?? 0) + 1);
      }

      if (row.route) {
        routeCounts.set(row.route, (routeCounts.get(row.route) ?? 0) + 1);
      }

      const day = row.createdAt.slice(0, 10);
      const dayEvents = dailyMap.get(day) ?? new Map<string, number>();
      dayEvents.set(type, (dayEvents.get(type) ?? 0) + 1);
      dailyMap.set(day, dayEvents);
    }

    const eventBreakdown = [...breakdownMap.entries()]
      .map(([event_type, v]) => ({
        event_type,
        count: v.count,
        unique_users: v.users.size,
      }))
      .sort((a, b) => b.count - a.count);

    const dailyTrend = [...dailyMap.entries()]
      .flatMap(([day, events]) =>
        [...events.entries()].map(([event_type, event_count]) => ({
          day: `${day}T00:00:00.000Z`,
          event_type,
          event_count,
          unique_users: 0,
        })),
      )
      .sort((a, b) => b.day.localeCompare(a.day))
      .slice(0, 30);

    return {
      rangeDays,
      generatedAt: new Date().toISOString(),
      configured: true,
      totals: {
        events: rows.length,
        uniqueUsers: uniqueUsers.size,
        registeredUsers: null,
      },
      eventBreakdown,
      tabUsage: [...tabCounts.entries()]
        .map(([tab, count]) => ({ tab, count }))
        .sort((a, b) => b.count - a.count),
      funnel: {
        landing_view: countType(rows, "landing_view"),
        guest_chat_start: countType(rows, "guest_chat_start"),
        guest_chat_turn: countType(rows, "guest_chat_turn"),
        guest_chat_limit: countType(rows, "guest_chat_limit"),
        signup_cta_click: countType(rows, "signup_cta_click"),
        login_success: countType(rows, "login_success"),
        chat_send: countType(rows, "chat_send"),
        vocabulary_save: countType(rows, "vocabulary_save"),
      },
      tutorial: {
        shown: countType(rows, "tutorial_shown"),
        started: countType(rows, "tutorial_started"),
        completed: countType(rows, "tutorial_completed"),
        skipped: countType(rows, "tutorial_skipped"),
      },
      topRoutes: [...routeCounts.entries()]
        .map(([route, count]) => ({ route, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 12),
      recentFeedback: [],
      dailyTrend,
    };
  } catch {
    return null;
  }
}
