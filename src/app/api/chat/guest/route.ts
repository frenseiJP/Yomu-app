import {
  buildOpenAiChatSystemPrompt,
  SENSEI_CHAT_TEMPERATURE,
} from "@/lib/chat/openAiChatSystem";
import { parseSenseiChatPayload } from "@/lib/ftue/format";
import { consumeRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { logBetaEventServer } from "@/lib/analytics/server";

const OPENAI_MODEL = "gpt-4o-mini";
const MAX_MESSAGES = 6;
const MAX_MESSAGE_CHARS = 800;
const MAX_TOTAL_CHARS = 4_000;
const MAX_REQUEST_BODY_BYTES = 20_000;

async function parseJsonBodyWithLimit(req: Request): Promise<unknown | null> {
  const raw = await req.text().catch(() => "");
  if (raw.length > MAX_REQUEST_BODY_BYTES) return null;
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return {};
  }
}

function clampMessages(raw: unknown): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(raw)) return [];
  const out: { role: "user" | "assistant"; content: string }[] = [];
  let total = 0;
  for (const m of raw) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const c = content.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!c) continue;
    total += c.length;
    if (total > MAX_TOTAL_CHARS) break;
    out.push({ role, content: c });
    if (out.length >= MAX_MESSAGES) break;
  }
  return out;
}

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);
  const rl = await consumeRateLimit({
    key: `chat_guest:${ip}`,
    limit: 12,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    await logBetaEventServer({
      eventType: "api_rate_limited",
      route: "/api/chat/guest",
      metadata: { status: 429 },
    });
    return Response.json(
      { error: "Too many requests" },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSec) } },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "missing_api_key", fallback: true },
      { status: 200, headers: { "cache-control": "no-store" } },
    );
  }

  const body = await parseJsonBodyWithLimit(req);
  if (body === null) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  const { messages: rawMessages, language: languageFromClient } = body as {
    messages?: unknown;
    language?: unknown;
  };
  const messages = clampMessages(rawMessages);
  const userTurns = messages.filter((m) => m.role === "user").length;
  if (userTurns > 3) {
    return Response.json({ error: "guest_limit", limit: 3 }, { status: 403 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastUserText = lastUser?.content ?? "";

  const { systemPrompt } = buildOpenAiChatSystemPrompt({
    languageFromClient,
    tone: "neutral",
    coachContext: { jlptLevel: "N5", streak: 0 },
    messages,
    mode: "structured_json",
  });

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: SENSEI_CHAT_TEMPERATURE,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!openaiRes.ok) {
    await logBetaEventServer({
      eventType: "api_error",
      route: "/api/chat/guest",
      metadata: { status: 200, reason: "openai_failed_fallback" },
    });
    return Response.json(
      { error: "openai_failed", fallback: true },
      { status: 200, headers: { "cache-control": "no-store" } },
    );
  }

  const data = (await openaiRes.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const rawJson = data.choices?.[0]?.message?.content;
  if (typeof rawJson !== "string") {
    return Response.json({ error: "empty_model", fallback: true }, { status: 200 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson) as unknown;
  } catch {
    return Response.json({ error: "json_parse", fallback: true }, { status: 200 });
  }

  const coach = parseSenseiChatPayload(parsed, lastUserText);
  if (!coach) {
    return Response.json({ error: "invalid_shape", fallback: true }, { status: 200 });
  }

  return Response.json({ ok: true, coach }, { status: 200, headers: { "cache-control": "no-store" } });
}
