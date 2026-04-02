import { NextResponse } from "next/server";

const MODEL = "gpt-4o-mini";

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
 * アシスタント返信に即した語彙ハイライト・チップ・次の3択フォローを生成する。
 */
export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY missing" },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const assistantText =
    typeof body.assistantText === "string" ? body.assistantText.trim() : "";
  const userText = typeof body.userText === "string" ? body.userText.trim() : "";
  const uiLang = normalizeUiLang(body.language);

  if (!assistantText || assistantText.length > 32000) {
    return NextResponse.json({ error: "assistantText required" }, { status: 400 });
  }

  const langName = UI_LANG_NAME[uiLang];

  const instruction = [
    "Return ONLY one JSON object (no markdown) with keys:",
    "highlightPhrases: array of {phrase, reading} — 3 to 8 Japanese words or short phrases that appear verbatim in the assistant reply OR are clearly the focal teaching term in that reply (e.g. user asked about 三択 → include 三択).",
    "chipWords: array of exactly 3 {phrase, reading} — best vocabulary from this turn for tap-to-save chips; should match important terms from the reply.",
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
            "You output compact JSON only. Keys: highlightPhrases, chipWords, followUps, bestFollowUpIndex.",
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
    const t = await openaiRes.text().catch(() => "");
    return NextResponse.json(
      { error: t || "OpenAI request failed" },
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
  let chipWords = parsePhrases(parsed.chipWords, 3);
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

  while (chipWords.length < 3) {
    const h = highlightPhrases[chipWords.length];
    if (h) chipWords.push(h);
    else if (highlightPhrases[0]) chipWords.push(highlightPhrases[0]);
    else break;
  }
  chipWords = chipWords.slice(0, 3);

  return NextResponse.json({
    highlightPhrases,
    chipWords,
    followUps,
    bestFollowUpIndex,
  });
}
