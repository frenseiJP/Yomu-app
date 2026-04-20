import { buildOpenAiChatSystemPrompt } from "@/lib/chat/openAiChatSystem";
import { parseFtueCoachPayload } from "@/lib/ftue/format";
import { consumeRateLimit, getClientIp } from "@/lib/security/rateLimit";

const OPENAI_MODEL = "gpt-4o-mini";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_TOTAL_CHARS = 10_000;

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
    key: `chat_structured:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    return Response.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "retry-after": String(rl.retryAfterSec) },
      },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "missing_api_key", fallback: true },
      { status: 200, headers: { "cache-control": "no-store" } },
    );
  }

  const body = await req.json().catch(() => ({}));
  const { messages: rawMessages, tone, language: languageFromClient, coachContext } = body as {
    messages?: unknown;
    tone?: unknown;
    language?: unknown;
    coachContext?: unknown;
  };
  const messages = clampMessages(rawMessages);

  const { systemPrompt } = buildOpenAiChatSystemPrompt({
    languageFromClient,
    tone,
    coachContext,
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
      temperature: 0.55,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        ...(Array.isArray(messages) ? messages : []),
      ],
    }),
  });

  if (!openaiRes.ok) {
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

  const coach = parseFtueCoachPayload(parsed);
  if (!coach) {
    return Response.json(
      { error: "invalid_shape", fallback: true },
      { status: 200 },
    );
  }

  return Response.json({ ok: true, coach }, { status: 200, headers: { "cache-control": "no-store" } });
}
