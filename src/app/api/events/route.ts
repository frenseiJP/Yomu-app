import { NextResponse } from "next/server";
import { BETA_EVENT_TYPES, type BetaEventType } from "@/lib/analytics/types";
import { logBetaEventServer } from "@/lib/analytics/server";

function isEventType(value: unknown): value is BetaEventType {
  return typeof value === "string" && (BETA_EVENT_TYPES as readonly string[]).includes(value);
}

function asString(value: unknown, max = 200): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function asPlainObject(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

export async function POST(req: Request): Promise<Response> {
  let payload: Record<string, unknown> = {};
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const eventType = payload.eventType;
  if (!isEventType(eventType)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  await logBetaEventServer({
    eventType,
    userId: asString(payload.userId, 128),
    sessionId: asString(payload.sessionId, 128),
    route: asString(payload.route, 256),
    metadata: asPlainObject(payload.metadata),
  });
  return NextResponse.json({ ok: true }, { status: 200 });
}
