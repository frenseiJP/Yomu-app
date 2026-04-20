import { NextResponse } from "next/server";
import { consumeRateLimit, getClientIp } from "@/lib/security/rateLimit";

const MODEL = "gpt-4o-mini";
const MAX_ASSISTANT_TEXT_CHARS = 20_000;
const MAX_USER_TEXT_CHARS = 2_000;

type UiLang = "ja" | "en" | "zh" | "ko";

const UI_LANG_NAME: Record<UiLang, string> = {
  ja: "Japanese",
  en: "English",
  zh: "Simplified Chinese",
  ko: "Korean",
};

function normalizeUiLang(raw: unknown): UiLang {
  if (raw === "ja" || raw === "en" || raw === "zh" || raw === "ko") return raw;
  return "en";
}

type PhrasePair = { phrase: string; reading: string };

function isPhrasePair(x: unknown): x is PhrasePair {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.phrase === "string" && typeof o.reading === "string";
}

function parsePhrases(raw: unknown, max: number): PhrasePair[] {
  if (!Array.isArray(raw)) return [];
  const out: PhrasePair[] = [];
  for (const item of raw) {
    if (isPhrasePair(item) && item.phrase.trim()) {
      out.push({
        phrase: item.phrase.trim(),
        reading: item.reading.trim() || item.phrase.trim(),
      });
      if (out.length >= max) break;
    }
  }
  return out;
}

function parseFollowUps(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((s) => s.trim())
    .slice(0, 3);
}

/**
 * アシスタント返信に即した語彙ハイライトと次の3択フォローを生成する。
 */
export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);
  const rl = await consumeRateLimit({
    key: `chat_context:${ip}`,
    limit: 40,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "retry-after": String(rl.retryAfterSec) },
      },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY missing" },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const assistantText =
    typeof body.assistantText === "string"
      ? body.assistantText.trim().slice(0, MAX_ASSISTANT_TEXT_CHARS)
      : "";
  const userText =
    typeof body.userText === "string"
      ? body.userText.trim().slice(0, MAX_USER_TEXT_CHARS)
      : "";
  const uiLang = normalizeUiLang(body.language);

  if (!assistantText) {
    return NextResponse.json({ error: "assistantText required" }, { status: 400 });
  }

  const langName = UI_LANG_NAME[uiLang];

  const instruction = [
    "Return ONLY one JSON object (no markdown) with keys:",
    "highlightPhrases: array of {phrase, reading} — 3 to 8 Japanese words or short phrases that appear verbatim in the assistant reply OR are clearly the focal teaching term in that reply (e.g. user asked about 三択 → include 三択).",
    "followUps: array of exactly 3 short strings — possible NEXT user messages to continue the lesson, written entirely in "
      + langName +
      ".",
    "bestFollowUpIndex: integer 0, 1, or 2 — which followUps entry is the BEST continuation (deeper, on-topic, builds on the assistant reply). The other two should be plausible but weaker, slightly off-topic, or generic.",
    "Shuffle mentally: do not always put the best follow-up first.",
    "reading: hiragana or romaji for Japanese phrase field.",
  ].join("\n");

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You output compact JSON only. Keys: highlightPhrases, followUps, bestFollowUpIndex.",
        },
        {
          role: "user",
          content:
            instruction +
            "\n\n--- Last user message ---\n" +
            (userText || "(none)") +
            "\n\n--- Assistant reply ---\n" +
            assistantText,
        },
      ],
    }),
  });

  if (!openaiRes.ok) {
    return NextResponse.json(
      { error: "OpenAI request failed" },
      { status: 502 },
    );
  }

  const completion = await openaiRes.json();
  const rawContent = completion?.choices?.[0]?.message?.content;
  const content = typeof rawContent === "string" ? rawContent.trim() : "";

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON from model" }, { status: 502 });
  }

  const highlightPhrases = parsePhrases(parsed.highlightPhrases, 8);
  const followUps = parseFollowUps(parsed.followUps);
  let bestFollowUpIndex =
    typeof parsed.bestFollowUpIndex === "number"
      ? Math.round(parsed.bestFollowUpIndex)
      : 0;
  bestFollowUpIndex = Math.min(2, Math.max(0, bestFollowUpIndex));
  if (followUps.length < 3) {
    return NextResponse.json(
      { error: "Model returned fewer than 3 followUps" },
      { status: 502 },
    );
  }
  if (bestFollowUpIndex >= followUps.length) bestFollowUpIndex = 0;

  return NextResponse.json({
    highlightPhrases,
    followUps,
    bestFollowUpIndex,
  });
}
