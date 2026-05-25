import { NextResponse } from "next/server";
import {
  type FeedbackSource,
  postFeedbackToGoogleSheets,
} from "@/lib/feedback/googleSheets";
import { saveFeedbackToSupabase } from "@/lib/feedback/supabaseBackup";

const FEEDBACK_SOURCES = new Set<FeedbackSource>(["feedback_form", "report"]);

function asString(value: unknown, max = 2000): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const userId = asString(body.userId, 128);
  const commentBody = asString(body.body, 4000);
  if (!userId || !commentBody) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const createdAt = asString(body.createdAt, 64) ?? new Date().toISOString();
  const displayName = asString(body.displayName, 120);
  const route = asString(body.route, 256) ?? "/feedback";
  const sourceRaw = asString(body.source, 32);
  const source: FeedbackSource =
    sourceRaw && FEEDBACK_SOURCES.has(sourceRaw as FeedbackSource)
      ? (sourceRaw as FeedbackSource)
      : "feedback_form";
  const reportContext = asString(body.reportContext, 2000);

  const result = await postFeedbackToGoogleSheets({
    source,
    userId,
    displayName,
    body: commentBody,
    createdAt,
    route,
    reportContext,
  });

  const sheetsOk = result.ok;
  await saveFeedbackToSupabase({
    userId,
    displayName,
    body: commentBody,
    route,
    source,
    sheetsSynced: sheetsOk,
  });

  if (!sheetsOk) {
    if (result.reason === "not_configured") {
      return NextResponse.json({ ok: false, error: "sheets_not_configured" }, { status: 503 });
    }
    if (result.reason === "script_error") {
      return NextResponse.json({ ok: false, error: "sheets_script_not_ready" }, { status: 502 });
    }
    return NextResponse.json({ ok: false, error: "sheets_request_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
