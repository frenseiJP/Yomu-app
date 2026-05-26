/** Japanese-only text helpers for Smart Save extraction. */

const JP_CHAR = /[ぁ-んァ-ン一-龯々ー]/;
const JP_CHAR_GLOBAL = /[ぁ-んァ-ン一-龯々ー]/g;
const ALLOWED_PUNCT = /[、。．.!?！？…・「」『』（）\s]/;

const LABEL_LINE =
  /^(better|why|other ways|try again|nice|tip|note|what you wrote|corrected version|your answer)\s*[:：]?/i;

export function jpCharCount(s: string): number {
  return (s.match(JP_CHAR_GLOBAL) ?? []).length;
}

/** Keep only Japanese script and light punctuation. */
export function toJapaneseOnly(raw: string): string {
  let s = raw.trim();
  s = s.replace(LABEL_LINE, "");
  s = s.replace(/```[\s\S]*?```/g, "");
  s = s.replace(/\*\*/g, "");
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  const out: string[] = [];
  for (const ch of s) {
    if (JP_CHAR.test(ch) || ALLOWED_PUNCT.test(ch)) out.push(ch);
  }
  return out.join("").replace(/\s+/g, "").trim();
}

export function containsLatin(s: string): boolean {
  return /[a-zA-Z]/.test(s);
}

export function isJapaneseSnippet(s: string): boolean {
  const jp = toJapaneseOnly(s);
  if (!jp || jpCharCount(jp) < 1) return false;
  if (containsLatin(s.replace(LABEL_LINE, ""))) return false;
  return jpCharCount(jp) >= 1;
}

export function stripSnippet(s: string): string {
  return toJapaneseOnly(s)
    .replace(/^[・\-*]+/, "")
    .replace(/[。．.!?！？…]+$/g, "")
    .trim();
}

export function splitIntoSnippets(line: string): string[] {
  const cleaned = stripSnippet(line);
  if (!cleaned) return [];

  const parts = cleaned
    .split(/[、,，。．.!?！？\n]+/)
    .map(stripSnippet)
    .filter((p) => isJapaneseSnippet(p) && jpCharCount(p) >= 1);

  const withTopicSplit = [...parts];
  for (const p of [...parts]) {
    if (jpCharCount(p) > 6 && /は/.test(p)) {
      const idx = p.indexOf("は");
      if (idx > 0 && idx < p.length - 1) {
        const head = stripSnippet(p.slice(0, idx));
        const tail = stripSnippet(p.slice(idx + 1));
        if (head && tail && jpCharCount(head) <= 8 && jpCharCount(tail) <= 18) {
          withTopicSplit.push(head, tail);
        }
      }
    }
  }

  const unique = [...new Set(withTopicSplit)];
  if (unique.length > 0) return unique;
  return jpCharCount(cleaned) <= 24 ? [cleaned] : [];
}
