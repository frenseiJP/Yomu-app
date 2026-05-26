import { makeSaveCandidate } from "@/lib/save-candidates/enrich";
import {
  isJapaneseSnippet,
  jpCharCount,
  splitIntoSnippets,
  stripSnippet,
  toJapaneseOnly,
} from "@/lib/save-candidates/japanese";
import type { GetRecommendedSaveCandidatesParams, SaveCandidate } from "@/lib/save-candidates/types";

export { jpCharCount, splitIntoSnippets } from "@/lib/save-candidates/japanese";

const PARTICLES = new Set([
  "は",
  "が",
  "を",
  "に",
  "へ",
  "で",
  "と",
  "も",
  "の",
  "ね",
  "よ",
  "か",
  "です",
  "する",
  "ます",
  "だ",
  "ない",
]);

const LOW_VALUE_TOKENS = new Set([
  ...PARTICLES,
  "これ",
  "それ",
  "あれ",
  "ここ",
  "そこ",
  "どこ",
  "また",
]);

const LIMITS = {
  word: { min: 1, max: 8 },
  phrase: { min: 2, max: 18 },
  hardMax: 24,
} as const;

function norm(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

function isNoiseLine(s: string): boolean {
  const t = stripSnippet(s);
  if (!t || !isJapaneseSnippet(t)) return true;
  if (/これは|使える|表現です|丁寧な|レストランで/.test(t) && jpCharCount(t) > 10) return true;
  return false;
}

function isParticleOnly(line: string): boolean {
  const t = stripSnippet(line);
  if (!t) return true;
  if (PARTICLES.has(t)) return true;
  if (/^[はがをにでのともねよかの]+$/.test(t)) return true;
  return false;
}

function isNearDuplicate(a: string, b: string): boolean {
  const na = norm(a);
  const nb = norm(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const short = na.length <= nb.length ? na : nb;
  const long = na.length <= nb.length ? nb : na;
  if (short.length >= 3 && long.includes(short)) return true;
  return false;
}

function isDuplicateOfSet(term: string, existing: Set<string>): boolean {
  const n = norm(term);
  for (const e of existing) {
    if (isNearDuplicate(n, e)) return true;
  }
  return false;
}

/** Structured coach replies: pull the main Japanese line after "Better:" */
export function extractBetterLineFromCoachText(ai: string): string | null {
  const block = ai.match(/Better:\s*\n?\s*([\s\S]+?)(?=\n\s*\n|\nWhy:|\nOther ways:|$)/i);
  if (!block) return null;
  const first = block[1]
    .split("\n")
    .map((l) => stripSnippet(l))
    .find((l) => isJapaneseSnippet(l) && jpCharCount(l) >= 2 && !isNoiseLine(l));
  return first ?? null;
}

function extractOtherWayBullets(ai: string): string[] {
  const block = ai.match(/Other ways:\s*([\s\S]+?)(?=Try again|$)/i);
  if (!block) return [];
  return block[1]
    .split("\n")
    .map((l) => stripSnippet(l.replace(/^・\s*/, "")))
    .filter((l) => isJapaneseSnippet(l) && jpCharCount(l) >= 2 && !isNoiseLine(l));
}

function jpLines(text: string): string[] {
  return text
    .split(/\n|。|！|!|？|\?/)
    .map(stripSnippet)
    .filter((s) => isJapaneseSnippet(s) && jpCharCount(s) >= 2 && !isNoiseLine(s));
}

function phraseScore(line: string, sourceBoost = 0): number {
  const len = jpCharCount(line);
  let s = sourceBoost * 4;
  if (len >= LIMITS.phrase.min && len <= LIMITS.phrase.max) s += 12;
  else if (len <= LIMITS.hardMax) s += 3;
  else s -= 10;
  if (/すみません|ください|どこですか|遅れ|気をつけ/.test(line) && len <= 14) s += 2;
  if (len <= 10) s += 2;
  if (len <= 6) s += 1;
  if (/は/.test(line) && len > 7) s -= 4;
  if (len > LIMITS.phrase.max) s -= 8;
  return s;
}

function fitsPhrase(line: string): boolean {
  const len = jpCharCount(line);
  return (
    len >= LIMITS.phrase.min &&
    len <= LIMITS.phrase.max &&
    !isParticleOnly(line) &&
    !isNoiseLine(line) &&
    isJapaneseSnippet(line)
  );
}

function fitsWordToken(p: string): boolean {
  const len = jpCharCount(p);
  if (len === 1 && !/[一-龯]/.test(p)) return false;
  return (
    len >= LIMITS.word.min &&
    len <= LIMITS.word.max &&
    isJapaneseSnippet(p) &&
    !LOW_VALUE_TOKENS.has(p) &&
    !isParticleOnly(p)
  );
}

type ScoredSnippet = { text: string; boost: number };

function collectSnippets(ai: string): ScoredSnippet[] {
  const scored = new Map<string, number>();
  const add = (line: string, boost: number) => {
    const jpLine = toJapaneseOnly(line);
    if (!jpLine) return;
    for (const sn of splitIntoSnippets(jpLine)) {
      if (!isJapaneseSnippet(sn) || jpCharCount(sn) > LIMITS.hardMax) continue;
      const prev = scored.get(sn) ?? 0;
      scored.set(sn, Math.max(prev, boost));
    }
  };

  for (const line of extractOtherWayBullets(ai)) add(line, 3);
  const better = extractBetterLineFromCoachText(ai);
  if (better) add(better, 2);
  for (const line of jpLines(ai)) add(line, 0);

  return [...scored.entries()].map(([text, boost]) => ({ text, boost }));
}

function pickPhrases(
  snippets: ScoredSnippet[],
  existing: Set<string>,
  skipNorm: Set<string>,
  max: number,
): string[] {
  const chosen: string[] = [];
  const used = new Set(existing);

  while (chosen.length < max) {
    const candidates = snippets
      .filter(({ text }) => fitsPhrase(text))
      .filter(({ text }) => {
        const n = norm(text);
        if (used.has(n) || skipNorm.has(n)) return false;
        if (chosen.some((c) => isNearDuplicate(c, text))) return false;
        return true;
      });
    if (candidates.length === 0) break;
    candidates.sort((a, b) => phraseScore(b.text, b.boost) - phraseScore(a.text, a.boost));
    const pick = candidates[0]!.text;
    chosen.push(pick);
    used.add(norm(pick));
  }
  return chosen;
}

function pickWord(snippets: ScoredSnippet[], existing: Set<string>, skip: string[]): string | null {
  const scored: { token: string; score: number }[] = [];
  for (const { text: line, boost } of snippets) {
    if (skip.some((s) => isNearDuplicate(s, line))) continue;
    const pieces = [
      line,
      ...line.split(/[、,\s「」『』]/).map((p) => stripSnippet(p)),
    ];
    for (const p of pieces) {
      if (!fitsWordToken(p) || existing.has(norm(p))) continue;
      let score = 5 + boost * 2;
      if (/[一-龯]/.test(p)) score += 2;
      if (jpCharCount(p) >= 2 && jpCharCount(p) <= 4) score += 1;
      scored.push({ token: p, score });
    }
  }
  if (scored.length === 0) return null;
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.token ?? null;
}

function wasSavedRecently(
  existingItems: GetRecommendedSaveCandidatesParams["existingItems"],
  term: string,
  withinDays = 14,
): boolean {
  const n = norm(term);
  const now = Date.now();
  const limitMs = withinDays * 24 * 60 * 60 * 1000;
  return existingItems.some((x) => {
    if (norm(x.term) !== n) return false;
    if (!x.updatedAt) return true;
    const t = Date.parse(x.updatedAt);
    if (!Number.isFinite(t)) return true;
    return now - t <= limitMs;
  });
}

export function getRecommendedSaveCandidates(params: GetRecommendedSaveCandidatesParams): SaveCandidate[] {
  const existingTerms = new Set(params.existingItems.map((x) => norm(x.term)));
  const out: SaveCandidate[] = [];
  let index = 0;

  const snippets = collectSnippets(params.aiMessageContent);
  const skipForPhrase = new Set<string>();
  if (params.userMessageContent) {
    skipForPhrase.add(norm(toJapaneseOnly(params.userMessageContent)));
  }

  const firstPhrases = pickPhrases(snippets, existingTerms, skipForPhrase, 1);
  const phraseTerms: string[] = [];

  for (const phrase of firstPhrases) {
    if (out.length >= 3) break;
    out.push(
      makeSaveCandidate({
        type: "phrase",
        term: phrase,
        messageId: params.messageId,
        sessionId: params.sessionId,
        index: index++,
      }),
    );
    phraseTerms.push(phrase);
    existingTerms.add(norm(phrase));
  }

  const word = pickWord(snippets, existingTerms, phraseTerms);
  if (
    word &&
    out.length < 3 &&
    !phraseTerms.some((p) => isNearDuplicate(p, word)) &&
    !wasSavedRecently(params.existingItems, word)
  ) {
    out.push(
      makeSaveCandidate({
        type: "word",
        term: word,
        messageId: params.messageId,
        sessionId: params.sessionId,
        index: index++,
      }),
    );
    phraseTerms.push(word);
    existingTerms.add(norm(word));
  }

  if (out.length < 3) {
    const more = pickPhrases(snippets, existingTerms, skipForPhrase, 3 - out.length);
    for (const phrase of more) {
      if (out.length >= 3) break;
      if (out.some((c) => isNearDuplicate(c.term, phrase))) continue;
      out.push(
        makeSaveCandidate({
          type: "phrase",
          term: phrase,
          messageId: params.messageId,
          sessionId: params.sessionId,
          index: index++,
        }),
      );
      existingTerms.add(norm(phrase));
    }
  }

  return out.slice(0, 3);
}
