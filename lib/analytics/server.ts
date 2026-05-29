import { createClient } from "@supabase/supabase-js";
import { BETA_EVENT_TYPES, type BetaEventInput } from "@/lib/analytics/types";

type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike };

function isEventType(value: string): value is (typeof BETA_EVENT_TYPES)[number] {
  return (BETA_EVENT_TYPES as readonly string[]).includes(value);
}

function asString(value: unknown, max = 200): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function sanitizePrimitive(value: unknown): string | number | boolean | null {
  if (value == null) return null;
  if (typeof value === "string") return value.slice(0, 200);
  if (typeof value === "number" || typeof value === "boolean") return value;
  return null;
}

function pickAllowedMetadata(
  eventType: BetaEventInput["eventType"],
  metadata: Record<string, unknown> | undefined,
): JsonLike | null {
  if (!metadata) return null;
  const allowlist: Record<BetaEventInput["eventType"], string[]> = {
    page_view: [],
    chat_send: ["textLength", "mode"],
    mission_start: ["missionTitle", "missionCategory"],
    topic_submit: ["topicId", "answerLength", "source"],
    vocabulary_save: ["source", "wordLength", "candidateType"],
    feedback_submit: ["source", "helpful", "hasMessage", "hasEmail", "hasDisplayName", "bodyLength"],
    tutorial_shown: ["manual"],
    tutorial_started: ["manual"],
    tutorial_step_completed: ["step"],
    tutorial_completed: ["step"],
    tutorial_skipped: ["step"],
    api_rate_limited: ["status"],
    api_payload_too_large: ["status", "limitBytes"],
    api_error: ["status", "reason"],
    coach_correction_received: [],
    coach_cloze_complete: ["score"],
    coach_speaking_check: ["score"],
    coach_content_import: ["saved", "candidates"],
    coach_weekly_goal_met: ["category"],
  };
  const out: Record<string, JsonLike> = {};
  for (const key of allowlist[eventType]) {
    const v = sanitizePrimitive(metadata[key]);
    if (v !== null) out[key] = v;
  }
  return Object.keys(out).length > 0 ? out : null;
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function logBetaEventServer(input: BetaEventInput): Promise<void> {
  try {
    if (!isEventType(input.eventType)) return;
    const supabase = getAdminClient();
    if (!supabase) return;
    await supabase.from("beta_event_logs").insert({
      event_type: input.eventType,
      user_id: asString(input.userId, 128),
      session_id: asString(input.sessionId, 128),
      route: asString(input.route, 256),
      metadata: pickAllowedMetadata(input.eventType, input.metadata),
    });
  } catch {
    // Fail silently by design.
  }
}
