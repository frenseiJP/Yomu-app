import type { CoachContextPayload } from "@/lib/habit/types";
import { formatCoachContextForSystem } from "@/lib/habit/coach";
import { JAPANESE_PHRASE_STYLE_RULE } from "@/lib/chat/japaneseFormat";
import { inferReplyModeHint, replyModeHintBlock } from "@/lib/chat/replyMode";
import {
  SENSEI_SYSTEM_PROMPT,
  buildLearnerProfileBlock,
} from "@/lib/chat/senseiSystemPrompt";

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
    coachToneNote,
  };
}

export const BASE_SYSTEM_JA_UI_EXTRA = `
=== OUTPUT LANGUAGE (Japanese UI) ===
Write explanations, grammar notes, and coaching in natural Japanese.
Japanese examples MUST still use: Japanese (romaji) — English meaning (keep the English gloss after the em dash).
`.trim();

const JA_TONE_INSTRUCTIONS: Record<string, string> = {
  casual: `
TONE for Japanese examples: casual / friendly (だ・である調, タメ口). Do not use stiff です・ます unless teaching contrast.
`,
  neutral: `
TONE for Japanese examples: standard polite (です・ます). Natural everyday politeness.
`,
  business: `
TONE for Japanese examples: business-appropriate (敬語・です・ます). Respectful forms (いただく, 申し上げる, ございます) when natural.
`,
};

export function detectLanguageFromText(text: string): "ja" | "en" | "zh" | "ko" {
  const t = text ?? "";
  if (/[가-힣]/.test(t)) return "ko";
  if (/[ぁ-んァ-ン]/.test(t)) return "ja";
  if (/[一-龠]/.test(t)) return "zh";
  if (/[a-zA-Z]/.test(t)) return "en";
  return "en";
}

export function getToneInstruction(lang: "ja" | "en" | "zh" | "ko", toneKey: string): string {
  if (lang === "ja") {
    return JA_TONE_INSTRUCTIONS[toneKey] ?? JA_TONE_INSTRUCTIONS.neutral;
  }
  if (toneKey === "casual") {
    return "TONE for Japanese examples: Casual / friendly — relaxed wording.";
  }
  if (toneKey === "business") {
    return "TONE for Japanese examples: Business — polite, professional keigo when appropriate.";
  }
  return "TONE for Japanese examples: Neutral polite — natural です・ます.";
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
  if (uiLang === "ja") {
    return BASE_SYSTEM_JA_UI_EXTRA;
  }
  const name = UI_LANG_NAME[uiLang];
  return [
    "=== OUTPUT LANGUAGE ===",
    `Write all explanations and coaching in ${name}.`,
    "Japanese appears only in examples using: Japanese (romaji) — English meaning.",
    "Even if the user writes in Japanese, keep explanations in " + name + ".",
  ].join("\n");
}

const STRUCTURED_JSON_BLOCK = `
=== STRUCTURED OUTPUT (JSON only — choose mode first) ===
Return ONLY one JSON object (no markdown fences).

STEP 1 — Set "replyMode" to exactly one of:
- "explain" — general questions about Japan, Japanese, grammar, culture, meaning, comparisons. The user is NOT asking you to fix a sentence they wrote.
- "reading" — how to read, pronounce, or say a word/phrase/kanji. Focus on reading/pronunciation, not rewriting their message as a full sentence.
- "correction" — the user submitted Japanese (or clearly wants their line rewritten). Use correction fields below.

STEP 2 — Fields by mode:

If replyMode is "explain" OR "reading":
  Required: "replyMode", "answer"
  Optional: "niceLine"
  "answer" = full teaching reply in prose (follow OUTPUT LANGUAGE). Use Japanese (romaji) — English meaning for examples.
  Do NOT include correctedSentence, studentSentence, or otherWay1/2.

If replyMode is "correction":
  Required: "replyMode", "niceLine", "studentSentence", "studentRomaji", "correctedSentence", "correctedRomaji", "correctedEnglish", "whyEnglish", "otherWay1", "otherWay1Romaji", "otherWay1English", "otherWay2", "otherWay2Romaji", "otherWay2English"

Plain string values only — no markdown fences inside JSON values.
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

  const coach = parseCoachContextPayload(params.coachContext);
  const learnerProfile = buildLearnerProfileBlock({
    uiLang,
    streak: coach?.streak,
    jlptLevel: "N3",
    phase: 3,
  });

  const toneInstruction = getToneInstruction(uiLang, toneKey);
  const languageBlock = buildOutputLanguageBlock(uiLang);
  const coachAppendix = formatCoachContextForSystem(coach);

  let core = SENSEI_SYSTEM_PROMPT;
  const modeHint =
    params.mode === "structured_json" && lastUserText
      ? replyModeHintBlock(inferReplyModeHint(lastUserText), lastUserText)
      : "";

  if (params.mode === "structured_json") {
    core += "\n\n" + STRUCTURED_JSON_BLOCK;
  }

  const systemPrompt = [
    learnerProfile,
    languageBlock,
    toneInstruction,
    modeHint,
    JAPANESE_PHRASE_STYLE_RULE,
    core,
    coachAppendix,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { systemPrompt, uiLang };
}

/** Sensei-recommended sampling temperature */
export const SENSEI_CHAT_TEMPERATURE = 0.55;
