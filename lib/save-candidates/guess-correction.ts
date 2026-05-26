import { extractBetterLineFromCoachText, jpCharCount, splitIntoSnippets } from "@/lib/save-candidates/extract";

/** Best-effort: pick a likely corrected Japanese line from assistant text (chat or topic feedback). */
export function guessCorrectedSentence(userText: string, assistantText: string): string | undefined {
  const fromBetter = extractBetterLineFromCoachText(assistantText);
  if (fromBetter && userText.trim()) {
    const nu = userText.replace(/\s+/g, "");
    const short =
      splitIntoSnippets(fromBetter).find((s) => jpCharCount(s) <= 22) ?? fromBetter;
    const nb = short.replace(/\s+/g, "");
    if (nu !== nb && jpCharCount(short) <= 22) return short;
  }
  const lines = assistantText
    .split(/\n|。|！|!|？|\?/)
    .map((s) => s.trim())
    .filter(
      (s) =>
        /[ぁ-んァ-ン一-龯]/.test(s) &&
        jpCharCount(s) >= 4 &&
        jpCharCount(s) <= 22,
    );
  const normalizedUser = userText.replace(/\s+/g, "");
  const candidate = lines.find((line) => {
    const normalized = line.replace(/\s+/g, "");
    if (normalized === normalizedUser) return false;
    return /です|ます|ません|でしょう|ください|でした/.test(line);
  });
  return candidate;
}
