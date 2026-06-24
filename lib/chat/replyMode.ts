export type SenseiReplyMode = "explain" | "reading" | "correction";

export type UserIntent =
  | "japanese_correction"
  | "translation"
  | "explanation"
  | "conversation_practice"
  | "app_help"
  | "general_question";

const READING_PATTERNS = [
  /読み(方)?/,
  /発音/,
  /どう(いう|読む|発音)/,
  /how\s+(do\s+you\s+)?(read|pronounce|say)\b/i,
  /pronunciation\b/i,
  /\breading\s+of\b/i,
  /ローマ字/,
  /仮名/,
  /アクセント/,
  /pitch\s+accent/i,
];

const EXPLAIN_PATTERNS = [
  /\?|？/,
  /what\s+(is|does|are)\b/i,
  /\bwhat'?s\s+the\s+difference\b/i,
  /\bhow\s+do\s+(i|you)\b/i,
  /\bcan\s+you\s+explain\b/i,
  /意味/,
  /違い/,
  /とは/,
  /って何/,
  /教えて/,
  /について/,
  /文法/,
  /使い方/,
  /culture\b/i,
  /keigo\b/i,
  /敬語/,
  /grammar\b/i,
  /difference\s+between/i,
  /when\s+(should|do)\s+i\s+use/i,
  /なぜ|why\b/i,
  /〜てしまいました|てしまう/,
];

const CORRECTION_PATTERNS = [
  /直して/,
  /修正/,
  /チェック/,
  /natural\s*\?/i,
  /correct\s*(this|my)?/i,
  /polish/i,
  /これで(いい|合って|自然)/,
  /添削/,
  /言い換え/,
  /is\s+this\s+natural/i,
  /fix\s+my/i,
];

const TRANSLATION_PATTERNS = [
  /\btranslate\b/i,
  /翻訳/,
  /怎么说/,
  /怎麼說/,
  /뭐라고\s*해/,
  /in\s+english\b/i,
  /英語で(は|何)/,
  /日本語で(は|何)/,
  /한국어로/,
];

const APP_HELP_PATTERNS = [
  /\bhow\s+(do|to)\s+(i\s+)?use\s+(this\s+)?app\b/i,
  /\bfrensei\b/i,
  /\bsettings\b/i,
  /\baccount\b/i,
  /\bsubscription\b/i,
  /\bplan\b/i,
  /アプリの(使い方|設定)/,
  /このアプリ/,
  /ログイン/,
  /課金/,
];

const CONVERSATION_PATTERNS = [
  /practice\s+(speaking|conversation)/i,
  /role\s*play/i,
  /会話(練習|の練習)/,
  /ロールプレイ/,
  /chat\s+with\s+me/i,
  /talk\s+to\s+me\s+in\s+japanese/i,
];

function hasJapanese(text: string): boolean {
  return /[ぁ-んァ-ン一-龯]/.test(text);
}

function looksLikeJapaneseSentenceAttempt(text: string): boolean {
  if (!hasJapanese(text)) return false;
  const t = text.trim();
  if (t.length < 3) return false;
  // Mostly Japanese characters — likely a line to polish, not a grammar question
  const jpChars = (t.match(/[ぁ-んァ-ン一-龯]/g) ?? []).length;
  return jpChars / t.length >= 0.35;
}

/** Classify what the user wants this turn (relevance guard). */
export function inferUserIntent(text: string): UserIntent {
  const t = text.trim();
  if (!t) return "general_question";

  if (APP_HELP_PATTERNS.some((p) => p.test(t))) return "app_help";
  if (TRANSLATION_PATTERNS.some((p) => p.test(t))) return "translation";
  if (CONVERSATION_PATTERNS.some((p) => p.test(t))) return "conversation_practice";
  if (READING_PATTERNS.some((p) => p.test(t))) return "explanation";
  if (CORRECTION_PATTERNS.some((p) => p.test(t))) return "japanese_correction";

  const looksLikeQuestion =
    EXPLAIN_PATTERNS.some((p) => p.test(t)) ||
    /^(what|why|when|where|which|can|is|are|do|does)\b/i.test(t);

  if (looksLikeQuestion) return "explanation";
  if (looksLikeJapaneseSentenceAttempt(t)) return "japanese_correction";

  return "general_question";
}

export function userIntentToReplyMode(intent: UserIntent): SenseiReplyMode {
  if (intent === "japanese_correction") return "correction";
  if (intent === "translation" || intent === "explanation" || intent === "app_help") {
    return "explain";
  }
  if (intent === "conversation_practice") return "explain";
  return "explain";
}

/** Lightweight hint for the model — not a hard rule. */
export function inferReplyModeHint(text: string): SenseiReplyMode {
  return userIntentToReplyMode(inferUserIntent(text));
}

const INTENT_GUIDES: Record<UserIntent, string> = {
  japanese_correction:
    'Intent: polish the learner\'s Japanese. Use replyMode "correction" with Better / Why / Other ways. Do NOT give an unrelated grammar lecture.',
  translation:
    'Intent: translate or gloss. Use replyMode "explain". Give the meaning/translation directly first. Do NOT force a full correction block.',
  explanation:
    'Intent: teach or explain (grammar, meaning, culture). Use replyMode "explain" or "reading" if pronunciation-focused. Answer the actual question first — stay on topic.',
  conversation_practice:
    'Intent: conversation practice. Use replyMode "explain". Respond in natural Japanese with romaji glosses and a brief coaching note — do not lecture.',
  app_help:
    'Intent: app/product help. Use replyMode "explain". Answer how to use Frensei/settings/features clearly in the UI language. Do NOT teach random Japanese unless asked.',
  general_question:
    'Intent: general question. Use replyMode "explain". Answer what was asked directly. If unclear, ask ONE short clarifying question (e.g. "Could you give me one example sentence?").',
};

export function intentHintBlock(intent: UserIntent, userText: string): string {
  const clipped = userText.trim().slice(0, 400);
  return [
    "=== USER INTENT (answer THIS — stay relevant to the latest message) ===",
    INTENT_GUIDES[intent],
    `User message: ${clipped || "(empty)"}`,
    "If the message is vague or missing context, ask one clarifying question instead of guessing.",
  ].join("\n");
}

export function replyModeHintBlock(mode: SenseiReplyMode, userText: string): string {
  const intent = inferUserIntent(userText);
  const intentBlock = intentHintBlock(intent, userText);
  const modeGuides: Record<SenseiReplyMode, string> = {
    explain:
      'Structured mode: use replyMode "explain" unless correction is clearly needed. Do NOT use Better/Why/Other ways blocks.',
    reading:
      'Structured mode: use replyMode "reading". Focus on pronunciation/reading — not a full rewrite.',
    correction:
      'Structured mode: use replyMode "correction" with correction JSON fields only when the user submitted Japanese to polish.',
  };
  return [intentBlock, "", "=== REPLY MODE ===", modeGuides[mode]].join("\n");
}
