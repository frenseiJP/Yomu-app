import type { CoachContextPayload } from "@/lib/habit/types";
import { formatCoachContextForSystem } from "@/lib/habit/coach";
import { JAPANESE_PHRASE_STYLE_RULE } from "@/lib/chat/japaneseFormat";
import { inferReplyModeHint, replyModeHintBlock } from "@/lib/chat/replyMode";
import {
  SENSEI_SYSTEM_PROMPT,
  buildLearnerProfileBlock,
} from "@/lib/chat/senseiSystemPrompt";

function jlptToPhase(jlpt: string): 1 | 2 | 3 | 4 {
  const level = jlpt.toUpperCase();
  if (level.includes("N5")) return 1;
  if (level.includes("N4")) return 2;
  if (level.includes("N2") || level.includes("N1")) return 4;
  return 3;
}

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
  const sessionGoal = typeof o.sessionGoal === "string" ? o.sessionGoal.slice(0, 80) : undefined;
  const focusCategory =
    typeof o.focusCategory === "string" ? o.focusCategory.slice(0, 60) : undefined;
  const focusCategoryHint =
    typeof o.focusCategoryHint === "string" ? o.focusCategoryHint.slice(0, 200) : undefined;
  const focusCategoryScore =
    typeof o.focusCategoryScore === "number" && Number.isFinite(o.focusCategoryScore)
      ? Math.max(0, Math.min(100, o.focusCategoryScore))
      : undefined;
  const jlptLevel = typeof o.jlptLevel === "string" ? o.jlptLevel.slice(0, 8) : undefined;
  const region = typeof o.region === "string" ? o.region.slice(0, 80) : undefined;
  const learningMode =
    typeof o.learningMode === "string" ? o.learningMode.slice(0, 120) : undefined;

  return {
    recentMistakes,
    streak,
    lastMissionSummary,
    lastSummary,
    coachToneNote,
    sessionGoal,
    focusCategory,
    focusCategoryHint,
    focusCategoryScore,
    jlptLevel,
    region,
    learningMode,
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
  const name = UI_LANG_NAME[uiLang];
  const lines = [
    "=== OUTPUT LANGUAGE (CRITICAL — UI WINS) ===",
    `The learner's UI language is ${name} (${uiLang}). This is the ONLY output language.`,
    `Write ALL coaching, explanations, grammar notes, "answer", and the "whyEnglish" JSON field in ${name}.`,
    "NEVER infer response language from the user's message language, browser, or input script.",
    "If UI is Japanese and the user writes in English → explain in Japanese.",
    "If UI is English and the user writes in Japanese → explain in English.",
    "If UI is Korean and the user writes in English → explain in Korean.",
    "If UI is Chinese and the user writes in English → explain in Simplified Chinese.",
    "Japanese example phrases in replies stay in Japanese script; glosses after the em dash may stay English.",
    "VIOLATION CHECK: Before sending JSON, verify every explanation field is in " + name + ", not the user's input language.",
  ];
  if (uiLang === "ja") {
    return [BASE_SYSTEM_JA_UI_EXTRA, ...lines].join("\n");
  }
  return lines.join("\n");
}

const STRUCTURED_JSON_BLOCK = `
=== STRUCTURED OUTPUT (JSON only — choose mode first) ===
Return ONLY one JSON object (no markdown fences).

RELEVANCE (read before choosing mode):
1. Answer the user's ACTUAL latest message first — stay on topic.
2. Classify intent: correction | translation | explanation | conversation | app/help | general.
3. Use correction JSON fields ONLY when the user submitted Japanese to polish or explicitly asked for correction.
4. For grammar/meaning questions ("what does X mean?"), use explain — answer directly, do NOT force Better/Why/Other ways.
5. For app/product questions, answer helpfully in the UI language — no forced Japanese lesson.
6. If the request is unclear or too short, ask ONE clarifying question in "answer" (replyMode explain), e.g. "Could you give me one example sentence?"
7. Keep responses concise and structured — avoid unrelated lessons.

STEP 1 — Set "replyMode" to exactly one of:
- "explain" — questions, translations, culture, grammar, app help, conversation coaching. User is NOT asking you to fix a sentence they wrote.
- "reading" — how to read, pronounce, or say a word/phrase/kanji.
- "correction" — user submitted Japanese to polish OR clearly wants their line rewritten.

STEP 2 — Fields by mode:

If replyMode is "explain" OR "reading":
  Required: "replyMode", "answer"
  Optional: "niceLine"
  "answer" = full reply in prose (follow OUTPUT LANGUAGE). Use Japanese (romaji) — English meaning for examples.
  Do NOT include correctedSentence, studentSentence, or otherWay1/2.

If replyMode is "correction":
  Required: "replyMode", "niceLine", "studentSentence", "studentRomaji", "correctedSentence", "correctedRomaji", "correctedEnglish", "whyEnglish", "otherWay1", "otherWay1Romaji", "otherWay1English", "otherWay2", "otherWay2Romaji", "otherWay2English"
  NOTE: "whyEnglish" is a legacy field name — its content MUST be in the UI language (not English unless UI is English).

Plain string values only — no markdown fences inside JSON values.

LANGUAGE REMINDER: The "answer" and "whyEnglish" fields must match the UI language block above — never mirror the user's input language.

CONTEXT: Prior assistant messages may include compact tags like [correction ...] or [explain ...]. Use them to stay consistent — do not contradict earlier corrections.

CONVERSATION THREAD: Short follow-ups ("why?", "more examples", "what about X?") refer to the immediately preceding topic unless the user clearly switches subject.
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

  const uiLang: UiLang = normalizeUiLang(params.languageFromClient) ?? "en";

  const coach = parseCoachContextPayload(params.coachContext);
  const jlptLevel = coach?.jlptLevel ?? "N3";
  const learnerProfile = buildLearnerProfileBlock({
    uiLang,
    streak: coach?.streak,
    jlptLevel,
    phase: jlptToPhase(jlptLevel),
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
    toneInstruction,
    modeHint,
    JAPANESE_PHRASE_STYLE_RULE,
    core,
    coachAppendix,
    languageBlock,
    `FINAL REMINDER: Respond in ${UI_LANG_NAME[uiLang]} (${uiLang}) only. UI language overrides user message language.`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { systemPrompt, uiLang };
}

/** Sensei-recommended sampling temperature (freeform stream) */
export const SENSEI_CHAT_TEMPERATURE = 0.55;

/** Lower temperature for structured JSON — more consistent corrections. */
export function senseiStructuredTemperature(lastUserText: string): number {
  const mode = inferReplyModeHint(lastUserText);
  if (mode === "correction") return 0.35;
  if (mode === "reading") return 0.4;
  return 0.48;
}
