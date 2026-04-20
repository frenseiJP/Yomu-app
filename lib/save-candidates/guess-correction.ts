import { extractBetterLineFromCoachText } from "@/lib/save-candidates/extract";

/** Best-effort: pick a likely corrected Japanese line from assistant text (chat or topic feedback). */
export function guessCorrectedSentence(userText: string, assistantText: string): string | undefined {
  const fromBetter = extractBetterLineFromCoachText(assistantText);
  if (fromBetter && userText.trim()) {
    const nu = userText.replace(/\s+/g, "");
    const nb = fromBetter.replace(/\s+/g, "");
    if (nu !== nb) return fromBetter;
  }
  const lines = assistantText
    .split(/\n|。|！|!|？|\?/)
    .map((s) => s.trim())
    .filter((s) => /[ぁ-んァ-ン一-龯]/.test(s) && s.length >= 4 && s.length <= 60);
  const normalizedUser = userText.replace(/\s+/g, "");
  const candidate = lines.find((line) => {
    const normalized = line.replace(/\s+/g, "");
    if (normalized === normalizedUser) return false;
    return /です|ます|ません|でしょう|ください|でした/.test(line);
  });
  return candidate;
}
