import type { GetRecommendedSaveCandidatesParams, SaveCandidate } from "@/lib/save-candidates/types";

const PARTICLES = new Set(["は", "が", "を", "に", "へ", "で", "と", "も", "の", "ね", "よ", "か", "です", "する"]);

function norm(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

function jpLines(text: string): string[] {
  return text
    .split(/\n|。|！|!|？|\?/)
    .map((s) => s.trim())
    .filter((s) => /[ぁ-んァ-ン一-龯]/.test(s) && s.length >= 2);
}

function pickPhrase(lines: string[], existing: Set<string>): string | null {
  for (const line of lines) {
    if (line.length < 4 || line.length > 40) continue;
    if (PARTICLES.has(line)) continue;
    if (existing.has(norm(line))) continue;
    return line;
  }
  return null;
}

function pickWord(lines: string[], existing: Set<string>): string | null {
  for (const line of lines) {
    const pieces = line
      .split(/[、,\s]/)
      .map((p) => p.trim())
      .filter(Boolean);
    for (const p of pieces) {
      if (p.length < 2 || p.length > 8) continue;
      if (!/[ぁ-んァ-ン一-龯]/.test(p)) continue;
      if (PARTICLES.has(p)) continue;
      if (existing.has(norm(p))) continue;
      return p;
    }
  }
  return null;
}

function buildCorrection(user?: string, corrected?: string): { user: string; corrected: string } | null {
  if (!user || !corrected) return null;
  if (norm(user) === norm(corrected)) return null;
  return { user: user.trim(), corrected: corrected.trim() };
}

export function getRecommendedSaveCandidates(params: GetRecommendedSaveCandidatesParams): SaveCandidate[] {
  const existingTerms = new Set(params.existingItems.map((x) => norm(x.term)));
  const out: SaveCandidate[] = [];

  const correction = buildCorrection(params.userMessageContent, params.correctedSentence);
  if ( correction && !existingTerms.has(norm(correction.corrected))) {
    out.push({
      id: `cand_corr_${Date.now()}`,
      type: "correction",
      label: "Correction",
      primaryText: correction.corrected,
      secondaryText: `Your answer: ${correction.user}`,
      explanation: "Natural correction from this exchange.",
      tags: ["correction"],
      sourceMessageId: params.messageId,
      sourceSessionId: params.sessionId,
      alreadySaved: false,
    });
  }

  const lines = jpLines(params.aiMessageContent);
  const phrase = pickPhrase(lines, existingTerms);
  if (phrase && out.length < 3) {
    out.push({
      id: `cand_phrase_${Date.now()}_${out.length}`,
      type: "phrase",
      label: "Useful phrase",
      primaryText: phrase,
      secondaryText: "Natural expression worth reusing.",
      tags: ["phrase"],
      sourceMessageId: params.messageId,
      sourceSessionId: params.sessionId,
      alreadySaved: false,
    });
    existingTerms.add(norm(phrase));
  }

  const word = pickWord(lines, existingTerms);
  if (word && out.length < 3) {
    out.push({
      id: `cand_word_${Date.now()}_${out.length}`,
      type: "word",
      label: "Word",
      primaryText: word,
      secondaryText: "Useful single word from this reply.",
      tags: ["word"],
      sourceMessageId: params.messageId,
      sourceSessionId: params.sessionId,
      alreadySaved: false,
    });
  }

  return out.slice(0, 3);
}
