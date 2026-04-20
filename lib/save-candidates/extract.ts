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

function norm(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

function isNoiseLine(s: string): boolean {
  const t = s.trim();
  if (!t) return true;
  if (/^(nice|better|why|other ways|try again)/i.test(t)) return true;
  if (/^・/.test(t) && t.length < 6) return true;
  return false;
}

/** Structured coach replies: pull the main Japanese line after "Better:" */
export function extractBetterLineFromCoachText(ai: string): string | null {
  const block = ai.match(/Better:\s*\n?\s*([\s\S]+?)(?=\n\s*\n|\nWhy:|\nOther ways:|$)/i);
  if (!block) return null;
  const first = block[1]
    .split("\n")
    .map((l) => l.trim())
    .find((l) => /[ぁ-んァ-ン一-龯]/.test(l) && l.length >= 2 && !isNoiseLine(l));
  return first ?? null;
}

function extractOtherWayBullets(ai: string): string[] {
  const block = ai.match(/Other ways:\s*([\s\S]+?)(?=Try again|$)/i);
  if (!block) return [];
  return block[1]
    .split("\n")
    .map((l) => l.replace(/^・\s*/, "").trim())
    .filter((l) => /[ぁ-んァ-ン一-龯]/.test(l) && l.length >= 4 && !isNoiseLine(l));
}

function jpLines(text: string): string[] {
  return text
    .split(/\n|。|！|!|？|\?/)
    .map((s) => s.trim())
    .filter((s) => /[ぁ-んァ-ン一-龯]/.test(s) && s.length >= 2 && !isNoiseLine(s));
}

function phraseScore(line: string): number {
  let s = 0;
  if (/です|ます|ません|ください|申し訳|すみません|恐れ入り/.test(line)) s += 3;
  if (line.length >= 6 && line.length <= 36) s += 2;
  if (/[、，]/.test(line)) s += 1;
  if (line.length >= 4 && line.length <= 40) s += 1;
  return s;
}

function pickPhraseFromLines(
  lines: string[],
  existing: Set<string>,
  skipNorm: Set<string>,
): string | null {
  const candidates = lines.filter((line) => {
    if (line.length < 4 || line.length > 48) return false;
    if (PARTICLES.has(line)) return false;
    const n = norm(line);
    if (existing.has(n) || skipNorm.has(n)) return false;
    return true;
  });
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => phraseScore(b) - phraseScore(a));
  return candidates[0] ?? null;
}

function isAcceptableWordToken(p: string, existing: Set<string>): boolean {
  const t = p.trim();
  if (t.length < 2 || t.length > 12) return false;
  if (!/[ぁ-んァ-ン一-龯]/.test(t)) return false;
  if (LOW_VALUE_TOKENS.has(t)) return false;
  if (/^[ぁ-ん]{1,2}$/.test(t)) return false;
  if (existing.has(norm(t))) return false;
  if (/^[はがをにでのともねよか]+$/.test(t)) return false;
  return true;
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

function pickWord(lines: string[], existing: Set<string>): string | null {
  for (const line of lines) {
    const pieces = line
      .split(/[、,\s「」『』]/)
      .map((p) => p.trim())
      .filter(Boolean);
    for (const p of pieces) {
      if (isAcceptableWordToken(p, existing)) return p;
    }
  }
  return null;
}

function buildCorrection(user?: string, corrected?: string): { user: string; corrected: string } | null {
  if (!user || !corrected) return null;
  if (norm(user) === norm(corrected)) return null;
  return { user: user.trim(), corrected: corrected.trim() };
}

function inferCorrectionNote(user: string, corrected: string): string {
  const u = user.replace(/\s+/g, "");
  const c = corrected.replace(/\s+/g, "");
  if (c.includes("は") && !u.includes("は") && /どこ|だれ|いつ|なに|なん|誰/.test(u)) {
    return "Add は to make the question sound natural.";
  }
  if (/ですか|ますか|でしょうか/.test(c) && !/ですか|ますか|でしょうか/.test(u)) {
    return "Polite question ending sounds more natural here.";
  }
  if (/ください|くださいませんか/.test(c) && !/ください/.test(u)) {
    return "Use ください for a natural polite request.";
  }
  return "This version sounds more natural in conversation.";
}

export function getRecommendedSaveCandidates(params: GetRecommendedSaveCandidatesParams): SaveCandidate[] {
  const existingTerms = new Set(params.existingItems.map((x) => norm(x.term)));
  const out: SaveCandidate[] = [];

  const betterLine = extractBetterLineFromCoachText(params.aiMessageContent);
  const otherWays = extractOtherWayBullets(params.aiMessageContent);

  const correctedFromParam =
    params.correctedSentence?.trim() ||
    (betterLine && params.userMessageContent && norm(betterLine) !== norm(params.userMessageContent)
      ? betterLine
      : undefined);

  const correction = buildCorrection(params.userMessageContent, correctedFromParam);
  if (correction && !existingTerms.has(norm(correction.corrected))) {
    out.push({
      id: `cand_corr_${Date.now()}`,
      type: "correction",
      label: "Correction",
      primaryText: correction.corrected,
      secondaryText: `Your answer: ${correction.user}`,
      explanation: inferCorrectionNote(correction.user, correction.corrected),
      tags: ["correction"],
      sourceMessageId: params.messageId,
      sourceSessionId: params.sessionId,
      alreadySaved: false,
    });
    existingTerms.add(norm(correction.corrected));
  }

  const corrPrimary = out[0]?.type === "correction" ? out[0].primaryText : "";
  const corrNorm = corrPrimary ? norm(corrPrimary) : "";

  let phrase: string | null = null;
  if (otherWays.length > 0) {
    phrase =
      otherWays.find((l) => !existingTerms.has(norm(l)) && norm(l) !== corrNorm) ?? null;
  }
  if (!phrase && betterLine && !existingTerms.has(norm(betterLine)) && norm(betterLine) !== corrNorm) {
    phrase = betterLine;
  }
  if (!phrase) {
    const lines = jpLines(params.aiMessageContent);
    const skip = new Set(corrNorm ? [corrNorm] : []);
    phrase = pickPhraseFromLines(lines, existingTerms, skip);
  }

  if (phrase && out.length < 3 && norm(phrase) !== norm(corrPrimary)) {
    out.push({
      id: `cand_phrase_${Date.now()}_${out.length}`,
      type: "phrase",
      label: "Useful phrase",
      primaryText: phrase,
      secondaryText: "From this reply",
      tags: ["phrase"],
      sourceMessageId: params.messageId,
      sourceSessionId: params.sessionId,
      alreadySaved: false,
    });
    existingTerms.add(norm(phrase));
  }

  const linesForWord = [
    ...otherWays,
    ...(betterLine ? [betterLine] : []),
    ...jpLines(params.aiMessageContent),
  ];
  const word = pickWord(linesForWord, existingTerms);
  if (
    word &&
    out.length < 3 &&
    norm(word) !== norm(phrase ?? "") &&
    norm(word) !== norm(corrPrimary) &&
    !wasSavedRecently(params.existingItems, word)
  ) {
    out.push({
      id: `cand_word_${Date.now()}_${out.length}`,
      type: "word",
      label: "Word",
      primaryText: word,
      secondaryText: "Useful vocabulary",
      tags: ["word"],
      sourceMessageId: params.messageId,
      sourceSessionId: params.sessionId,
      alreadySaved: false,
    });
  }

  return out.slice(0, 3);
}
