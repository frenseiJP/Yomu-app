import { makeSaveCandidate } from "@/lib/save-candidates/enrich";
import {
  isJapaneseSnippet,
  jpCharCount,
  splitIntoSnippets,
  stripSnippet,
} from "@/lib/save-candidates/japanese";
import type { SaveCandidate } from "@/lib/save-candidates/types";
import { inferMistakeCategory } from "@/lib/vocabulary/mistakeCategory";

export interface ContentImportResult {
  candidates: SaveCandidate[];
  weakCategories: string[];
  sampleLine: string;
}

function scoreSnippet(line: string): number {
  const len = jpCharCount(line);
  if (len < 3 || len > 28) return -1;
  let s = 10;
  if (/です|ます|ください|お願い/.test(line)) s += 4;
  if (/[ぁ-んァ-ン]/.test(line) && /[一-龯]/.test(line)) s += 2;
  return s;
}

/** Paste real Japanese (message, diary, subtitle) → save candidates + weak hints */
export function importContentFromPaste(
  raw: string,
  opts: { existingTerms: string[]; max?: number },
): ContentImportResult {
  const max = opts.max ?? 6;
  const existing = new Set(opts.existingTerms.map((t) => stripSnippet(t).toLowerCase()));
  const lines = splitIntoSnippets(raw)
    .map(stripSnippet)
    .filter((l) => isJapaneseSnippet(l) && jpCharCount(l) >= 3);

  const ranked = [...new Set(lines)]
    .map((line) => ({ line, score: scoreSnippet(line) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const candidates: SaveCandidate[] = [];
  for (const { line } of ranked) {
    if (candidates.length >= max) break;
    const key = line.toLowerCase();
    if (existing.has(key)) continue;
    const type = jpCharCount(line) <= 6 ? "word" : "phrase";
    candidates.push(
      makeSaveCandidate({
        type,
        term: line,
        index: candidates.length,
        tags: ["from-content", "coach-pick"],
      }),
    );
    existing.add(key);
  }

  const weakSet = new Set<string>();
  for (const line of lines.slice(0, 8)) {
    const cat = inferMistakeCategory({ correctedSentence: line });
    if (cat !== "other") weakSet.add(cat);
  }

  return {
    candidates,
    weakCategories: [...weakSet],
    sampleLine: ranked[0]?.line ?? lines[0] ?? "",
  };
}
