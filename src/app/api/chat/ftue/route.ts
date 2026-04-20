import { parseFtueCoachPayload } from "@/lib/ftue/format";
import { consumeRateLimit, getClientIp } from "@/lib/security/rateLimit";

const OPENAI_MODEL = "gpt-4o-mini";
const MAX_USER_SENTENCE_CHARS = 1_000;
const MAX_PROMPT_EN_CHARS = 300;
const MAX_HISTORY_TURNS = 6;
const MAX_HISTORY_CONTENT_CHARS = 400;

type UiLang = "ja" | "en" | "zh" | "ko";

function normalizeUiLang(raw: unknown): UiLang {
  if (raw === "ja" || raw === "en" || raw === "zh" || raw === "ko") return raw;
  return "en";
}

const SYSTEM = `You are a concise Japanese coach for a first-time learner drill.

The learner is translating this English into natural Japanese (polite / neutral tone is safest unless context says casual):
{{PROMPT_EN}}

They just wrote a Japanese attempt (may be imperfect).

Return ONLY valid JSON with these keys:
- "niceLine": short praise, default tone like "Nice 👍" (emoji ok)
- "correctedSentence": ONE best natural Japanese sentence for the meaning (no quotes around it)
- "whyEnglish": 1–2 short sentences in SIMPLE English about nuance / politeness / word choice
- "otherWay1": another natural Japanese wording (short)
- "otherWay2": another natural Japanese wording (short)

Rules:
- whyEnglish must be easy English (CEFR A2 level).
- correctedSentence should improve their line when possible; if already perfect, polish lightly or offer a natural synonym flow.
- Keep each field concise and mobile-readable (avoid long paragraphs).
- Keep the learner in flow; never end with session-closing language.
- Do not use farewell endings like "See you tomorrow".
- Do not include markdown. No keys other than the five above.`;

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);
  const rl = await consumeRateLimit({
    key: `chat_ftue:${ip}`,
    limit: 15,
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
  const userSentence =
    typeof body.userSentence === "string"
      ? body.userSentence.trim().slice(0, MAX_USER_SENTENCE_CHARS)
      : "";
  const promptEn =
    typeof body.promptEnglish === "string"
      ? body.promptEnglish.trim().slice(0, MAX_PROMPT_EN_CHARS)
      : "";
  const uiLang = normalizeUiLang(body.language);
  const history = Array.isArray(body.history) ? body.history : [];

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

  const system = SYSTEM.replace("{{PROMPT_EN}}", promptBlock);

  const userContent = [
    `UI language (for minor tone only): ${uiLang}`,
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
      temperature: 0.45,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: userContent },
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
    return Response.json({ error: "invalid_shape", fallback: true }, { status: 200 });
  }

  return Response.json({ ok: true, coach }, { status: 200, headers: { "cache-control": "no-store" } });
}
