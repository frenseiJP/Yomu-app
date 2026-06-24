import { get, list, put } from "@vercel/blob";
import type { AnalyticsRange, AnalyticsSummary } from "@/lib/analytics/queries";

export type BlobEventRow = {
  createdAt: string;
  event_type: string;
  user_id: string | null;
  session_id: string | null;
  route: string | null;
  metadata: Record<string, unknown> | null;
};

function blobToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || null;
}

function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function blobPath(day: string): string {
  return `analytics/${day}.jsonl`;
}

function dayKeysForRange(rangeDays: AnalyticsRange): string[] {
  const keys: string[] = [];
  for (let i = 0; i < rangeDays; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(dayKey(d));
  }
  return keys;
}

function parseMetadata(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function isBlobAnalyticsConfigured(): boolean {
  return blobToken() !== null;
}

export async function appendBlobEvent(
  row: Omit<BlobEventRow, "createdAt"> & { createdAt?: string },
): Promise<boolean> {
  const token = blobToken();
  if (!token) return false;

  const day = dayKey();
  const path = blobPath(day);
  const line =
        JSON.stringify({
          createdAt: row.createdAt ?? new Date().toISOString(),
          event_type: row.event_type,
          user_id: row.user_id,
          session_id: row.session_id,
          route: row.route,
          metadata: row.metadata,
        }) + "\n";

  let existing = "";
  try {
    const current = await get(path, { access: "private", token });
    if (current?.statusCode === 200 && current.stream) {
      existing = await new Response(current.stream).text();
    }
  } catch {
    /* start fresh */
  }

  await put(path, existing + line, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });
  return true;
}

async function readBlobRows(rangeDays: AnalyticsRange): Promise<BlobEventRow[]> {
  const token = blobToken();
  if (!token) return [];

  const wanted = new Set(dayKeysForRange(rangeDays));
  const cutoff = Date.now() - rangeDays * 24 * 60 * 60 * 1000;
  const rows: BlobEventRow[] = [];

  const { blobs } = await list({ prefix: "analytics/", token });
  for (const blob of blobs) {
    const day = blob.pathname.replace("analytics/", "").replace(".jsonl", "");
    if (!wanted.has(day)) continue;

    const current = await get(blob.pathname, { access: "private", token });
    if (!current || current.statusCode !== 200 || !current.stream) continue;
    const text = await new Response(current.stream).text();
    for (const rawLine of text.split("\n")) {
      if (!rawLine.trim()) continue;
      try {
        const parsed = JSON.parse(rawLine) as BlobEventRow;
        const ts = Date.parse(parsed.createdAt);
        if (!Number.isFinite(ts) || ts < cutoff) continue;
        rows.push(parsed);
      } catch {
        /* ignore malformed lines */
      }
    }
  }

  return rows;
}

function countType(rows: BlobEventRow[], type: string): number {
  return rows.filter((row) => row.event_type === type).length;
}

export async function fetchAnalyticsSummaryFromBlob(
  rangeDays: AnalyticsRange = 7,
): Promise<AnalyticsSummary | null> {
  if (!isBlobAnalyticsConfigured()) return null;

  try {
    const rows = await readBlobRows(rangeDays);
    const breakdownMap = new Map<string, { count: number; users: Set<string> }>();
    const tabCounts = new Map<string, number>();
    const routeCounts = new Map<string, number>();
    const dailyMap = new Map<string, Map<string, number>>();
    const uniqueUsers = new Set<string>();

    for (const row of rows) {
      const type = row.event_type || "unknown";
      const prev = breakdownMap.get(type) ?? { count: 0, users: new Set<string>() };
      prev.count += 1;
      if (row.user_id) {
        prev.users.add(row.user_id);
        uniqueUsers.add(row.user_id);
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

    return {
      rangeDays,
      generatedAt: new Date().toISOString(),
      configured: true,
      dataSource: "blob",
      totals: {
        events: rows.length,
        uniqueUsers: uniqueUsers.size,
        registeredUsers: null,
      },
      eventBreakdown: [...breakdownMap.entries()]
        .map(([event_type, value]) => ({
          event_type,
          count: value.count,
          unique_users: value.users.size,
        }))
        .sort((a, b) => b.count - a.count),
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
      dailyTrend: [...dailyMap.entries()]
        .flatMap(([day, events]) =>
          [...events.entries()].map(([event_type, event_count]) => ({
            day: `${day}T00:00:00.000Z`,
            event_type,
            event_count,
            unique_users: 0,
          })),
        )
        .sort((a, b) => b.day.localeCompare(a.day))
        .slice(0, 30),
    };
  } catch {
    return null;
  }
}
