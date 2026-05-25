import { DAILY_USEFUL_PHRASES, type DailyUsefulPhrase } from "@/lib/dailyPhrase/phrases";

function fnv1a(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function getDailyUsefulPhrase(dateYmd?: string): DailyUsefulPhrase {
  const d =
    dateYmd ??
    new Date().toISOString().slice(0, 10);
  const idx = fnv1a(d) % DAILY_USEFUL_PHRASES.length;
  return DAILY_USEFUL_PHRASES[idx]!;
}

export function buildDailyPhrasePracticeOpener(phrase: DailyUsefulPhrase): string {
  return (
    `Let's practice today's useful phrase 🌸\n\n` +
    `${phrase.phrase} (${phrase.romaji}) — ${phrase.meaning}\n\n` +
    `Try using it in one short sentence, or ask me when to use it.`
  );
}
