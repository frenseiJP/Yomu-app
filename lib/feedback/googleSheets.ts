export type FeedbackSource = "feedback_form" | "report";

export type FeedbackSheetPayload = {
  source: FeedbackSource;
  userId: string;
  displayName?: string;
  body: string;
  createdAt: string;
  route?: string;
  /** JSON snapshot from learning report (streak, chat count, etc.) */
  reportContext?: string;
};

export type FeedbackSheetsResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "request_failed" | "script_error" };

export function isFeedbackSheetsConfigured(): boolean {
  return getWebhookUrl() !== null;
}

function getWebhookUrl(): string | null {
  const url = process.env.FEEDBACK_SHEETS_WEBHOOK_URL?.trim();
  if (!url) return null;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return null;
  return url;
}

function parseAppsScriptResponse(text: string): FeedbackSheetsResult {
  const trimmed = text.trim();
  if (!trimmed) return { ok: true };

  try {
    const parsed = JSON.parse(trimmed) as { ok?: boolean; error?: string };
    if (parsed.ok === true) return { ok: true };
    if (parsed.ok === false) return { ok: false, reason: "script_error" };
  } catch {
    // HTML error pages from Apps Script still return 200
  }

  if (
    trimmed.includes("doPost") &&
    (trimmed.includes("not found") ||
      trimmed.includes("見つかりません") ||
      trimmed.includes("Script function not found"))
  ) {
    return { ok: false, reason: "script_error" };
  }

  if (trimmed.includes("<!DOCTYPE") || trimmed.includes("<html")) {
    return { ok: false, reason: "request_failed" };
  }

  return { ok: true };
}

export async function postFeedbackToGoogleSheets(
  payload: FeedbackSheetPayload,
): Promise<FeedbackSheetsResult> {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return { ok: false, reason: "not_configured" };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      redirect: "follow",
    });

    const text = await res.text();
    const parsed = parseAppsScriptResponse(text);
    if (!parsed.ok) return parsed;

    // Apps Script may return 200 with JSON even after redirects
    if (text.includes('"ok":true') || text.includes('"ok": true')) {
      return { ok: true };
    }

    if (!res.ok) return { ok: false, reason: "request_failed" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "request_failed" };
  }
}
