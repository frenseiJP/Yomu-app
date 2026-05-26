import type { GetRecommendedSaveCandidatesParams, SaveCandidate } from "@/lib/save-candidates/types";

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
  word: { min: 2, max: 8 },
  phrase: { min: 2, max: 18 },
  correction: { max: 22 },
} as const;

function norm(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export function jpCharCount(s: string): number {
  return (s.match(/[ぁ-んァ-ン一-龯]/g) ?? []).length;
}

function isNoiseLine(s: string): boolean {
  const t = s.trim();
  if (!t) return true;
  if (/^(nice|better|why|other ways|try again)/i.test(t)) return true;
  if (/^・/.test(t) && t.length < 6) return true;
  if (/これは|使える|表現です|丁寧な/.test(t) && jpCharCount(t) > 12) return true;
  return false;
}

function stripSnippet(s: string): string {
  return s
    .replace(/^[\s・\-*]+/, "")
    .replace(/[。．.!?！？…]+$/g, "")
    .replace(/\s+/g, "")
    .trim();
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
    .find((l) => /[ぁ-んァ-ン一-龯]/.test(l) && l.length >= 2 && !isNoiseLine(l));
  return first ?? null;
}

function extractOtherWayBullets(ai: string): string[] {
  const block = ai.match(/Other ways:\s*([\s\S]+?)(?=Try again|$)/i);
  if (!block) return [];
  return block[1]
    .split("\n")
    .map((l) => stripSnippet(l.replace(/^・\s*/, "")))
    .filter((l) => /[ぁ-んァ-ン一-龯]/.test(l) && l.length >= 2 && !isNoiseLine(l));
}

function jpLines(text: string): string[] {
  return text
    .split(/\n|。|！|!|？|\?/)
    .map(stripSnippet)
    .filter((s) => /[ぁ-んァ-ン一-龯]/.test(s) && s.length >= 2 && !isNoiseLine(s));
}

export function splitIntoSnippets(line: string): string[] {
  const cleaned = stripSnippet(line);
  if (!cleaned) return [];
  const parts = cleaned
    .split(/[、,，。．.!?！？\n]+/)
    .map(stripSnippet)
    .filter((p) => /[ぁ-んァ-ン一-龯]/.test(p) && p.length >= 2);
  if (parts.length > 0) return parts;
  return [cleaned];
}

function phraseScore(line: string, sourceBoost = 0): number {
  const len = jpCharCount(line);
  let s = sourceBoost * 4;
  if (len >= LIMITS.phrase.min && len <= LIMITS.phrase.max) s += 12;
  else if (len <= LIMITS.correction.max) s += 4;
  else s -= 8;
  if (/すみません|ください|どこですか|遅れ/.test(line) && len <= 14) s += 2;
  if (len > LIMITS.phrase.max) s -= 6;
  return s;
}

function fitsPhrase(line: string): boolean {
  const len = jpCharCount(line);
  return (
    len >= LIMITS.phrase.min &&
    len <= LIMITS.phrase.max &&
    !isParticleOnly(line) &&
    !isNoiseLine(line)
  );
}

function fitsWordToken(p: string): boolean {
  const len = jpCharCount(p);
  return (
    len >= LIMITS.word.min &&
    len <= LIMITS.word.max &&
    /[ぁ-んァ-ン一-龯]/.test(p) &&
    !LOW_VALUE_TOKENS.has(p) &&
    !isParticleOnly(p) &&
    !/^[ぁ-ん]{1,2}$/.test(p)
  );
}

type ScoredSnippet = { text: string; boost: number };

function collectSnippets(ai: string): ScoredSnippet[] {
  const scored = new Map<string, number>();
  const add = (line: string, boost: number) => {
    for (const sn of splitIntoSnippets(line)) {
      if (!/[ぁ-んァ-ン一-龯]/.test(sn)) continue;
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

function pickPhraseFromSnippets(
  snippets: ScoredSnippet[],
  existing: Set<string>,
  skipNorm: Set<string>,
): string | null {
  const candidates = snippets
    .filter(({ text }) => fitsPhrase(text))
    .filter(({ text }) => {
      const n = norm(text);
      if (existing.has(n) || skipNorm.has(n)) return false;
      return true;
    });
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => phraseScore(b.text, b.boost) - phraseScore(a.text, a.boost));
  return candidates[0]?.text ?? null;
}

function isAcceptableWordToken(p: string, existing: Set<string>): boolean {
  if (!fitsWordToken(p)) return false;
  if (existing.has(norm(p))) return false;
  if (/^[はがをにでのともねよか]+$/.test(p)) return false;
  return true;
}

function pickWord(snippets: ScoredSnippet[], existing: Set<string>): string | null {
  const scored: { token: string; score: number }[] = [];
  for (const { text: line, boost } of snippets) {
    const pieces = [
      line,
      ...line.split(/[、,\s「」『』]/).map((p) => stripSnippet(p)),
    ];
    for (const p of pieces) {
      if (!isAcceptableWordToken(p, existing)) continue;
      let score = 5 + boost * 2;
      if (/[一-龯]/.test(p)) score += 2;
      if (jpCharCount(p) >= 3 && jpCharCount(p) <= 6) score += 1;
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

function buildCorrection(user?: string, corrected?: string): { user: string; corrected: string } | null {
  if (!user || !corrected) return null;
  if (norm(user) === norm(corrected)) return null;
  return { user: user.trim(), corrected: corrected.trim() };
}

function shortenCorrectionText(corrected: string): string | null {
  const trimmed = stripSnippet(corrected);
  if (jpCharCount(trimmed) <= LIMITS.correction.max) return trimmed;
  const parts = splitIntoSnippets(trimmed)
    .filter((p) => jpCharCount(p) >= 2 && jpCharCount(p) <= LIMITS.correction.max)
    .sort((a, b) => phraseScore(b) - phraseScore(a));
  return parts[0] ?? null;
}

function inferCorrectionNote(user: string, corrected: string): string {
  const u = user.replace(/\s+/g, "");
  const c = corrected.replace(/\s+/g, "");
  if (c.includes("は") && !u.includes("は") && /どこ|だれ|いつ|なに|なん|誰/.test(u)) {
    return "Add は for a natural question.";
  }
  if (/ですか|ますか/.test(c) && !/ですか|ますか/.test(u)) {
    return "Polite question ending.";
  }
  if (/ください/.test(c) && !/ください/.test(u)) {
    return "Polite request pattern.";
  }
  return "Sounds more natural.";
}

export function inferPhraseNote(phrase: string): string {
  if (/すみません|申し訳|ごめん|失礼/.test(phrase)) return "sounds apologetic";
  if (/ください|お願い/.test(phrase)) return "polite request";
  if (/ですか|ますか|でしょうか/.test(phrase)) return "useful question pattern";
  if (/遅れ|遅刻|遅く/.test(phrase)) return "about being late";
  if (/辛い|おいしい|ください/.test(phrase)) return "useful in daily situations";
  if (/どこ/.test(phrase)) return "asking where";
  return "useful in conversation";
}

export function getRecommendedSaveCandidates(params: GetRecommendedSaveCandidatesParams): SaveCandidate[] {
  const existingTerms = new Set(params.existingItems.map((x) => norm(x.term)));
  const out: SaveCandidate[] = [];
  const usedNorm = new Set<string>();

  const snippets = collectSnippets(params.aiMessageContent);

  const betterLine = extractBetterLineFromCoachText(params.aiMessageContent);
  const correctedFromParam =
    params.correctedSentence?.trim() ||
    (betterLine && params.userMessageContent && norm(betterLine) !== norm(params.userMessageContent)
      ? betterLine
      : undefined);

  const skipForPhrase = new Set<string>();
  if (params.userMessageContent) skipForPhrase.add(norm(params.userMessageContent));

  let phrase = pickPhraseFromSnippets(snippets, existingTerms, skipForPhrase);
  if (!phrase && betterLine) {
    const shortBetter = splitIntoSnippets(betterLine).find(fitsPhrase);
    if (shortBetter && !isDuplicateOfSet(shortBetter, existingTerms)) phrase = shortBetter;
  }

  if (phrase) {
    out.push({
      id: `cand_phrase_${Date.now()}_0`,
      type: "phrase",
      label: "Phrase",
      primaryText: phrase,
      secondaryText: inferPhraseNote(phrase),
      tags: ["phrase"],
      sourceMessageId: params.messageId,
      sourceSessionId: params.sessionId,
      alreadySaved: false,
    });
    usedNorm.add(norm(phrase));
    existingTerms.add(norm(phrase));
  }

  const word = pickWord(snippets, existingTerms);
  const phraseNorm = phrase ? norm(phrase) : "";
  if (
    word &&
    norm(word) !== phraseNorm &&
    !isDuplicateOfSet(word, usedNorm) &&
    !wasSavedRecently(params.existingItems, word)
  ) {
    out.push({
      id: `cand_word_${Date.now()}_1`,
      type: "word",
      label: "Word",
      primaryText: word,
      secondaryText: "key vocabulary",
      tags: ["word"],
      sourceMessageId: params.messageId,
      sourceSessionId: params.sessionId,
      alreadySaved: false,
    });
    usedNorm.add(norm(word));
    existingTerms.add(norm(word));
  } else if (!word && out.length < 3) {
    const secondPhrase = pickPhraseFromSnippets(snippets, existingTerms, skipForPhrase);
    if (secondPhrase && !isDuplicateOfSet(secondPhrase, usedNorm)) {
      out.push({
        id: `cand_phrase_${Date.now()}_2`,
        type: "phrase",
        label: "Phrase",
        primaryText: secondPhrase,
        secondaryText: inferPhraseNote(secondPhrase),
        tags: ["phrase"],
        sourceMessageId: params.messageId,
        sourceSessionId: params.sessionId,
        alreadySaved: false,
      });
      usedNorm.add(norm(secondPhrase));
      existingTerms.add(norm(secondPhrase));
    }
  }

  const rawCorrection = buildCorrection(params.userMessageContent, correctedFromParam);
  if (rawCorrection && out.length < 3) {
    const shortCorrected = shortenCorrectionText(rawCorrection.corrected);
    if (
      shortCorrected &&
      jpCharCount(shortCorrected) <= LIMITS.correction.max &&
      !isDuplicateOfSet(shortCorrected, usedNorm) &&
      !existingTerms.has(norm(shortCorrected))
    ) {
      out.push({
        id: `cand_corr_${Date.now()}`,
        type: "correction",
        label: "Correction",
        primaryText: shortCorrected,
        secondaryText: `Your answer: ${rawCorrection.user}`,
        explanation: inferCorrectionNote(rawCorrection.user, shortCorrected),
        tags: ["correction"],
        sourceMessageId: params.messageId,
        sourceSessionId: params.sessionId,
        alreadySaved: false,
      });
    }
  }

  return out.slice(0, 3);
}
