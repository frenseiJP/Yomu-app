import { NextResponse } from "next/server";
import type { BetaFeedbackSource } from "@/lib/feedback/types";
import {
  type FeedbackSource,
  postFeedbackToGoogleSheets,
} from "@/lib/feedback/googleSheets";
import { saveFeedbackToSupabase } from "@/lib/feedback/supabaseBackup";

const BETA_SOURCES = new Set<BetaFeedbackSource>(["chat", "topic", "vocabulary", "general"]);

function asString(value: unknown, max = 2000): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function formatBetaPromptBody(input: {
  helpful: boolean | null;
  message?: string;
  betaSource: BetaFeedbackSource;
  sessionId?: string;
  appVersion?: string;
}): string {
  const helpfulLabel =
    input.helpful === true ? "yes" : input.helpful === false ? "no" : "unspecified";
  const lines = [
    `[Beta inline feedback]`,
    `Helpful: ${helpfulLabel}`,
    `Source: ${input.betaSource}`,
  ];
  if (input.sessionId) lines.push(`Session: ${input.sessionId}`);
  if (input.appVersion) lines.push(`App version: ${input.appVersion}`);
  if (input.message) lines.push("", input.message);
  return lines.join("\n").slice(0, 4000);
}

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const userId = asString(body.userId, 128);
  if (!userId) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const betaSourceRaw = asString(body.source, 32);
  const betaSource: BetaFeedbackSource =
    betaSourceRaw && BETA_SOURCES.has(betaSourceRaw as BetaFeedbackSource)
      ? (betaSourceRaw as BetaFeedbackSource)
      : "chat";

  const helpful =
    typeof body.helpful === "boolean" ? body.helpful : body.helpful === null ? null : null;
  const message = asString(body.message, 500);
  const sessionId = asString(body.sessionId, 128);
  const appVersion = asString(body.appVersion, 64);
  const route = asString(body.route, 256) ?? "/app";
  const createdAt = asString(body.createdAt, 64) ?? new Date().toISOString();

  const commentBody = formatBetaPromptBody({
    helpful,
    message,
    betaSource,
    sessionId,
    appVersion,
  });

  const source: FeedbackSource = "beta_prompt";
  const result = await postFeedbackToGoogleSheets({
    source,
    userId,
    body: commentBody,
    createdAt,
    route,
    reportContext: sessionId ? JSON.stringify({ sessionId, betaSource, helpful }) : undefined,
  });

  const sheetsOk = result.ok;
  await saveFeedbackToSupabase({
    userId,
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
