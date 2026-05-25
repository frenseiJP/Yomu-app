/** Sensei v2.0: Japanese (romaji) — English meaning */
export const JAPANESE_PHRASE_STYLE_RULE = `
=== JAPANESE PHRASE FORMAT (MANDATORY — Sensei v2.0) ===
Every Japanese word, phrase, or sentence in your reply MUST use:
  Japanese text (romaji) — English meaning

Rules:
- Romaji in half-width parentheses () immediately after the Japanese, same line
- English meaning after an em dash (—)
- Lowercase Hepburn romaji (e.g. taberu, yoroshiku onegaishimasu)
- No corner brackets required; no hiragana-only in parentheses
- Examples:
  ありがとうございます (arigatou gozaimasu) — Thank you very much.
  食べる (taberu) — to eat
`.trim();

export function formatJaRomajiLine(
  japanese: string,
  romaji?: string | null,
  english?: string | null,
): string {
  const jp = japanese.trim();
  if (!jp) return "";
  const r = romaji?.trim();
  const en = english?.trim();
  if (r && en) return `${jp} (${r}) — ${en}`;
  if (r) return `${jp} (${r})`;
  return jp;
}

/** Legacy helper — wraps as Sensei line when romaji only */
export function formatJaRomaji(japanese: string, romaji?: string | null): string {
  return formatJaRomajiLine(japanese, romaji);
}

export function stripJaWrappers(text: string): string {
  return text
    .trim()
    .replace(/^「/, "")
    .replace(/」$/, "")
    .replace(/（[^）]*）$/, "")
    .replace(/\([^)]*\)\s*—.*$/, "")
    .replace(/\([^)]*\)$/, "")
    .trim();
}
