export type SenseiReplyMode = "explain" | "reading" | "correction";

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
];

/** Lightweight hint for the model — not a hard rule. */
export function inferReplyModeHint(text: string): SenseiReplyMode {
  const t = text.trim();
  if (!t) return "explain";

  const hasJapanese = /[ぁ-んァ-ン一-龯]/.test(t);
  const looksLikeQuestion =
    EXPLAIN_PATTERNS.some((p) => p.test(t)) ||
    /^(what|why|when|where|which|can|is|are|do|does)\b/i.test(t);

  if (READING_PATTERNS.some((p) => p.test(t))) {
    return "reading";
  }

  if (CORRECTION_PATTERNS.some((p) => p.test(t))) {
    return "correction";
  }

  // Japanese text without explicit correction intent → explain (not auto-correct)
  if (hasJapanese && looksLikeQuestion) {
    return "explain";
  }

  return "explain";
}

export function replyModeHintBlock(mode: SenseiReplyMode, userText: string): string {
  const clipped = userText.trim().slice(0, 400);
  const guides: Record<SenseiReplyMode, string> = {
    explain:
      'Use replyMode "explain". Answer the question directly (vocabulary, grammar, culture). Do NOT use "What you wrote" or "Corrected version" unless the user explicitly submitted Japanese to fix.',
    reading:
      'Use replyMode "reading". Focus on how to read/pronounce the word or phrase. Give Japanese (romaji) — meaning. Do NOT force a full sentence rewrite unless briefly helpful.',
    correction:
      'Use replyMode "correction". The user submitted Japanese to polish. Use the correction JSON fields (What you wrote / Corrected version structure).',
  };
  return [
    "=== REPLY MODE HINT (follow this turn) ===",
    guides[mode],
    `User message (for context): ${clipped || "(empty)"}`,
  ].join("\n");
}
