import type { CoachContextPayload } from "@/lib/habit/types";
import { formatCoachContextForSystem } from "@/lib/habit/coach";

export function parseCoachContextPayload(raw: unknown): CoachContextPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const streak = typeof o.streak === "number" && Number.isFinite(o.streak) ? o.streak : 0;
  const lastMissionSummary =
    typeof o.lastMissionSummary === "string" ? o.lastMissionSummary.slice(0, 800) : "";
  const lastSummary = typeof o.lastSummary === "string" ? o.lastSummary.slice(0, 500) : "";
  const coachToneNote =
    typeof o.coachToneNote === "string" ? o.coachToneNote.slice(0, 600) : "";
  let recentMistakes: CoachContextPayload["recentMistakes"] = [];
  if (Array.isArray(o.recentMistakes)) {
    recentMistakes = o.recentMistakes
      .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
      .slice(0, 5)
      .map((m) => ({
        original: typeof m.original === "string" ? m.original.slice(0, 200) : "",
        corrected: typeof m.corrected === "string" ? m.corrected.slice(0, 200) : "",
        explanation: typeof m.explanation === "string" ? m.explanation.slice(0, 300) : "",
      }))
      .filter((m) => m.original.length > 0);
  }
  return {
    recentMistakes,
    streak,
    lastMissionSummary,
    lastSummary,
    coachToneNote:
      coachToneNote ||
      "You are a calm, supportive Japanese coach. Be encouraging without being loud.",
  };
}

/** モデルが日本語システム文に引きずられないよう、核は英語で記述 */
export const BASE_SYSTEM_CORE = `
You are "Frensei" (in-app coach name may appear as Yomu): an AI Japanese coach focused on sounding natural in real life — nuance, politeness, and what native speakers would actually say — not textbook drills or exam cramming.
Assume the learner is around JLPT N3 level and often cares about business-appropriate Japanese.
Write in a warm, curious, partner-like tone (explore together; do not grade the learner).
When you give feedback, prefer concrete, natural rewrites and short "why" notes over abstract grammar lectures.
Keep the conversation going: invite one small next step (e.g. try again, tweak tone, or a follow-up line). Do not close the chat with farewells like "see you tomorrow" or imply the session is over.

STRICT BANNED SUBSTRINGS (do not output these anywhere: headings, body, bullets, parentheses, mixed scripts):
- 共感
- 回答
- 解説
- 質問

Also avoid corny section titles in any language that mirror those labels (e.g. standalone "Answer", "Explanation", "Question" as headings).

Guidelines:
- If the user asks a direct question, answer it clearly (without using the banned substrings).
- You may add short Japanese examples, quotes, vocabulary, or readings when teaching Japanese.
- Markdown is fine if headings never contain the banned substrings.
- Explain grammar / keigo types (polite, respectful, humble) when helpful, in the OUTPUT LANGUAGE specified above.

The OUTPUT LANGUAGE block at the top of this system message overrides everything else about which language to use for explanations.
`.trim();

export const BASE_SYSTEM_JA_EXTRA = `
（日本語UI向けの補足）
- メインの説明・文化メモ・文法の話はすべて自然な日本語で書いてください。
- 必要なら英語・中国語・韓国語を短く添えてもよい。
`.trim();

const JA_TONE_INSTRUCTIONS: Record<string, string> = {
  casual: `
【重要】あなたの返答の文体は「カジュアル」にしてください。
- です・ます調ではなく、タメ口（だよ・だね・〜しよう・〜してね）で話す。
- 友達に話すような、親しみやすくラフな日本語で書く。
`,
  neutral: `
【重要】あなたの返答の文体は「標準」（です・ます調）にしてください。
- 丁寧だが堅くしすぎない、一般的な敬体で書く。
`,
  business: `
【重要】あなたの返答の文体は「ビジネス」にしてください。
- 敬語を丁寧に（です・ます、謙譲語・尊敬語を適宜使い、いただきます・申し上げます・ございます などを自然に含める）。
- ビジネスメールや商談で使える丁寧な日本語で書く。
`,
};

export function detectLanguageFromText(text: string): "ja" | "en" | "zh" | "ko" {
  const t = text ?? "";
  if (/[가-힣]/.test(t)) return "ko";
  if (/[ぁ-んァ-ン]/.test(t)) return "ja";
  if (/[一-龠]/.test(t)) return "zh";
  if (/[a-zA-Z]/.test(t)) return "en";
  return "ja";
}

export function getToneInstruction(lang: "ja" | "en" | "zh" | "ko", toneKey: string): string {
  if (lang === "ja") {
    return JA_TONE_INSTRUCTIONS[toneKey] ?? JA_TONE_INSTRUCTIONS.neutral;
  }
  if (toneKey === "casual") {
    return "TONE: Casual / friendly — relaxed wording, not stiff.";
  }
  if (toneKey === "business") {
    return "TONE: Business — polite, professional, clear.";
  }
  return "TONE: Neutral — polite and natural, not overly stiff.";
}

export type UiLang = "ja" | "en" | "zh" | "ko";

const UI_LANG_NAME: Record<UiLang, string> = {
  ja: "Japanese",
  en: "English",
  zh: "Simplified Chinese",
  ko: "Korean",
};

export function normalizeUiLang(raw: unknown): UiLang | null {
  if (raw === "ja" || raw === "en" || raw === "zh" || raw === "ko") return raw;
  return null;
}

export function buildOutputLanguageBlock(uiLang: UiLang): string {
  const name = UI_LANG_NAME[uiLang];
  if (uiLang === "ja") {
    return [
      "=== OUTPUT LANGUAGE (HIGHEST PRIORITY) ===",
      "The app UI language is Japanese.",
      "Write your ENTIRE reply (explanations, cultural notes, grammar notes, tips) in natural Japanese.",
      "You may include short non-Japanese glosses only when helpful for learning.",
    ].join("\n");
  }
  return [
    "=== OUTPUT LANGUAGE (HIGHEST PRIORITY) ===",
    `The app UI language is ${name} (${uiLang}).`,
    `You MUST write your ENTIRE reply (all explanations, cultural notes, grammar notes, tips, and meta commentary) in ${name}.`,
    "Japanese may appear ONLY as short examples, quoted phrases, vocabulary items, readings (furigana/romaji), or sample sentences for teaching.",
    "Even if the user writes entirely in Japanese, keep the main teaching explanation in " +
      name +
      "; do not switch the main explanation to Japanese.",
  ].join("\n");
}

const STRUCTURED_JSON_BLOCK = `
=== STRUCTURED OUTPUT (MANDATORY) ===
Return ONLY one JSON object (no markdown code fences, no text before or after JSON) with exactly these keys:
"niceLine", "correctedSentence", "whyEnglish", "otherWay1", "otherWay2"

Field meanings:
- niceLine: one short warm line (emoji ok). Never a farewell or "see you tomorrow".
- correctedSentence: ONE natural Japanese sentence that best matches what the learner meant in their latest message. Apply the TONE instruction (casual / neutral / business). If their Japanese is already strong, polish lightly or offer a slightly more native phrasing.
- whyEnglish: 1–2 short, very simple sentences explaining nuance, politeness, or word choice. The CONTENT language must follow OUTPUT LANGUAGE above (e.g. if UI is Japanese, write this field in Japanese even though the key name says whyEnglish).
- otherWay1, otherWay2: two different short natural Japanese alternatives (same politeness level as correctedSentence when possible).

Do not include any other keys. Do not include "Better:", "Why:", or section headers in JSON values — plain string values only.
`.trim();

export type ChatOpenAiMode = "freeform_stream" | "structured_json";

export function buildOpenAiChatSystemPrompt(params: {
  languageFromClient?: unknown;
  tone?: unknown;
  coachContext?: unknown;
  messages: unknown;
  mode: ChatOpenAiMode;
}): { systemPrompt: string; uiLang: UiLang } {
  const toneKey =
    typeof params.tone === "string" &&
    (params.tone === "casual" || params.tone === "neutral" || params.tone === "business")
      ? params.tone
      : "neutral";

  const arr = Array.isArray(params.messages) ? params.messages : [];
  const lastUserMessage = [...arr]
    .reverse()
    .find((m) => {
      if (!m || typeof m !== "object") return false;
      const r = m as { role?: unknown; content?: unknown };
      return r.role === "user" && typeof r.content === "string";
    });
  const lastUserText =
    typeof (lastUserMessage as { content?: string } | undefined)?.content === "string"
      ? String((lastUserMessage as { content: string }).content)
      : "";

  const uiLang: UiLang =
    normalizeUiLang(params.languageFromClient) ?? detectLanguageFromText(lastUserText);

  const toneInstruction = getToneInstruction(uiLang, toneKey);
  const languageBlock = buildOutputLanguageBlock(uiLang);
  const coachAppendix = formatCoachContextForSystem(parseCoachContextPayload(params.coachContext));

  let core = BASE_SYSTEM_CORE;
  if (params.mode === "structured_json") {
    core += "\n\n" + STRUCTURED_JSON_BLOCK;
  }

  const systemPrompt =
    languageBlock +
    "\n\n" +
    toneInstruction +
    "\n\n" +
    core +
    (uiLang === "ja" ? "\n" + BASE_SYSTEM_JA_EXTRA : "") +
    coachAppendix;

  return { systemPrompt, uiLang };
}
