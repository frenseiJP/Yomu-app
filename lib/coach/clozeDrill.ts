import { stripSnippet } from "@/lib/save-candidates/japanese";

const CLOZE_PARTICLES = ["は", "が", "を", "に", "で", "と", "も", "へ", "の", "から", "まで"];

export interface ClozeDrill {
  id: string;
  prompt: string;
  blank: string;
  answer: string;
  fullSentence: string;
  hint: string;
}

function pickBlankToken(corrected: string, user?: string): string | null {
  const c = stripSnippet(corrected);
  const u = user ? stripSnippet(user) : "";
  for (const p of CLOZE_PARTICLES) {
    const inC = c.includes(p);
    const inU = u.includes(p);
    if (inC && !inU) return p;
    if (inC && u && c.split(p).length !== u.split(p).length) return p;
  }
  const cWords = c.replace(/[。、！？\s]/g, "");
  const uWords = u.replace(/[。、！？\s]/g, "");
  if (uWords && cWords.length > uWords.length) {
    for (let i = 0; i < cWords.length; i++) {
      if (cWords[i] !== uWords[i]) {
        const run = cWords.slice(i, i + 3);
        if (run.length >= 2) return run;
      }
    }
  }
  for (const p of CLOZE_PARTICLES) {
    if (c.includes(p)) return p;
  }
  const chunk = c.match(/[\u3040-\u30ff\u4e00-\u9faf]{2,4}/);
  return chunk?.[0] ?? null;
}

/** One cloze from a correction pair — coach-style, not textbook */
export function buildClozeFromCorrection(
  corrected: string,
  user?: string,
): ClozeDrill | null {
  const full = stripSnippet(corrected);
  if (!full || full.length < 4) return null;
  const blank = pickBlankToken(full, user);
  if (!blank || blank.length > 6) return null;
  const idx = full.indexOf(blank);
  if (idx < 0) return null;
  const prompt =
    full.slice(0, idx) + "＿＿" + full.slice(idx + blank.length);
  return {
    id: `cloze-${Date.now()}`,
    prompt,
    blank,
    answer: blank,
    fullSentence: full,
    hint: "Fill the missing piece — Sensei used this in your correction.",
  };
}

export function scoreClozeAnswer(drill: ClozeDrill, input: string): 0 | 1 | 2 {
  const a = stripSnippet(input);
  if (!a) return 0;
  if (a === drill.answer) return 2;
  if (a.includes(drill.answer) || drill.answer.includes(a)) return 1;
  return 0;
}
