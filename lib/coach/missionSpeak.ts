/** Pull Japanese phrase from mission copy (e.g. 「すみません」). */
export function extractJapaneseQuoted(text: string): string | null {
  const m = text.match(/「([^」]{1,40})」/);
  return m?.[1]?.trim() ?? null;
}

export function isSpeakStyleMission(instruction: string, tags: string[] = []): boolean {
  if (tags.some((t) => /speak/i.test(t))) return true;
  return /out loud|say\s|speak|口に|声に/i.test(instruction);
}
