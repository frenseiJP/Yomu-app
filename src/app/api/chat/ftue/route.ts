import {
  buildOpenAiChatSystemPrompt,
  SENSEI_CHAT_TEMPERATURE,
} from "@/lib/chat/openAiChatSystem";
import { parseFtueCoachPayload } from "@/lib/ftue/format";
import { resolveRequestUiLang } from "@/lib/i18n/resolveUiLang";
import { consumeRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { logBetaEventServer } from "@/lib/analytics/server";

const OPENAI_MODEL = "gpt-4o-mini";
const MAX_USER_SENTENCE_CHARS = 1_000;
const MAX_PROMPT_EN_CHARS = 300;
const MAX_HISTORY_TURNS = 6;
const MAX_HISTORY_CONTENT_CHARS = 400;
const MAX_REQUEST_BODY_BYTES = 20_000;

type UiLang = "ja" | "en" | "zh" | "ko";

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);
  const rl = await consumeRateLimit({
    key: `chat_ftue:${ip}`,
    limit: 15,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    await logBetaEventServer({
      eventType: "api_rate_limited",
      route: "/api/chat/ftue",
      metadata: { status: 429 },
    });
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

  const raw = await req.text().catch(() => "");
  if (raw.length > MAX_REQUEST_BODY_BYTES) {
    await logBetaEventServer({
      eventType: "api_payload_too_large",
      route: "/api/chat/ftue",
      metadata: { status: 413, limitBytes: MAX_REQUEST_BODY_BYTES },
    });
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }
  let body: unknown = {};
  if (raw.trim()) {
    try {
      body = JSON.parse(raw) as unknown;
    } catch {
      body = {};
    }
  }
  const userSentence =
    typeof (body as { userSentence?: unknown }).userSentence === "string"
      ? (body as { userSentence: string }).userSentence.trim().slice(0, MAX_USER_SENTENCE_CHARS)
      : "";
  const promptEn =
    typeof (body as { promptEnglish?: unknown }).promptEnglish === "string"
      ? (body as { promptEnglish: string }).promptEnglish.trim().slice(0, MAX_PROMPT_EN_CHARS)
      : "";
  const uiLang: UiLang = resolveRequestUiLang((body as { language?: unknown }).language);
  const history = Array.isArray((body as { history?: unknown }).history)
    ? (body as { history: unknown[] }).history
    : [];

  if (!userSentence) {
    return Response.json({ error: "userSentence required" }, { status: 400 });
  }

  const promptBlock = promptEn || "I'm a little late, sorry.";

  type HistTurn = { role: string; content: string };
  const historyLines = (history as unknown[])
    .filter(
      (h: unknown): h is HistTurn =>
        !!h &&
        typeof h === "object" &&
        ((h as { role?: unknown }).role === "user" ||
          (h as { role?: unknown }).role === "assistant") &&
        typeof (h as { content?: unknown }).content === "string",
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((h) => `${h.role}: ${h.content.slice(0, MAX_HISTORY_CONTENT_CHARS)}`)
    .join("\n");

  const { systemPrompt } = buildOpenAiChatSystemPrompt({
    languageFromClient: uiLang,
    tone: "neutral",
    messages: [{ role: "user", content: userSentence }],
    mode: "structured_json",
  });

  const system =
    systemPrompt +
    `\n\n=== FTUE DRILL ===\nThe learner is translating this English into natural Japanese:\n${promptBlock}`;

  const userContent = [
    `UI language (ALL explanations must be in this language): ${uiLang}`,
    historyLines ? `Recent turns:\n${historyLines}\n` : "",
    `Latest learner Japanese:\n${userSentence}`,
  ]
    .filter(Boolean)
    .join("\n\n");

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
        { role: "system", content: system },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!openaiRes.ok) {
    await logBetaEventServer({
      eventType: "api_error",
      route: "/api/chat/ftue",
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

  const coach = parseFtueCoachPayload(parsed, userSentence);
  if (!coach) {
    return Response.json({ error: "invalid_shape", fallback: true }, { status: 200 });
  }

  return Response.json({ ok: true, coach }, { status: 200, headers: { "cache-control": "no-store" } });
}
