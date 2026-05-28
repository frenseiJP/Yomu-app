import type { CategoryMasteryState, MistakeCategoryKey } from "@/lib/habit/types";
import { getProgressSnapshot, recordCategoryMasteryUpdate } from "@/lib/habit/progress";
import { inferMistakeCategory } from "@/lib/vocabulary/mistakeCategory";
import type { MistakeCategory } from "@/lib/vocabulary/mistakeCategory";

export const SKILL_TREE_ORDER: {
  key: MistakeCategoryKey;
  label: string;
  coachHint: string;
}[] = [
  { key: "particle", label: "Particles", coachHint: "は・が・を・に — the glue of Japanese" },
  { key: "politeness", label: "Politeness", coachHint: "です/ます and softening your tone" },
  { key: "tense", label: "Tense", coachHint: "Past, present, and ongoing actions" },
  { key: "word_choice", label: "Word choice", coachHint: "More natural words for the situation" },
  { key: "word_order", label: "Word order", coachHint: "Where pieces land in a sentence" },
  { key: "register", label: "Register", coachHint: "Casual vs polite for the moment" },
];

/** Gate: next category unlocks when prior reaches this mastery */
export const WEAKNESS_GATE_THRESHOLD = 65;

export function categoryKeyFromMistake(cat?: MistakeCategory): MistakeCategoryKey {
  if (!cat || cat === "other") return "other";
  return cat;
}

export function getCategoryMasteryMap(userId: string): Partial<Record<MistakeCategoryKey, CategoryMasteryState>> {
  return getProgressSnapshot(userId).categoryMastery ?? {};
}

export function masteryScoreFor(userId: string, key: MistakeCategoryKey): number {
  return getCategoryMasteryMap(userId)[key]?.score ?? 0;
}

export function isCategoryUnlocked(userId: string, key: MistakeCategoryKey): boolean {
  const idx = SKILL_TREE_ORDER.findIndex((s) => s.key === key);
  if (idx <= 0) return true;
  const prior = SKILL_TREE_ORDER[idx - 1]!.key;
  return masteryScoreFor(userId, prior) >= WEAKNESS_GATE_THRESHOLD;
}

export function nextLockedCategory(userId: string): MistakeCategoryKey | null {
  for (const node of SKILL_TREE_ORDER) {
    if (!isCategoryUnlocked(userId, node.key)) return node.key;
    if (masteryScoreFor(userId, node.key) < WEAKNESS_GATE_THRESHOLD) return node.key;
  }
  return null;
}

export function getCoachFocusSummary(userId: string): {
  key: MistakeCategoryKey;
  label: string;
  hint: string;
  score: number;
} {
  const key = recommendedFocusCategory(userId);
  const node = SKILL_TREE_ORDER.find((s) => s.key === key) ?? SKILL_TREE_ORDER[0]!;
  return {
    key,
    label: node.label,
    hint: node.coachHint,
    score: masteryScoreFor(userId, key),
  };
}

export function recommendedFocusCategory(userId: string): MistakeCategoryKey {
  const locked = nextLockedCategory(userId);
  if (locked && locked !== "other") return locked;
  let lowest: MistakeCategoryKey = "particle";
  let lowScore = 101;
  for (const node of SKILL_TREE_ORDER) {
    const s = masteryScoreFor(userId, node.key);
    if (s < lowScore) {
      lowScore = s;
      lowest = node.key;
    }
  }
  return lowest;
}

/** Bump mastery after drill or correction save */
export function applyMasteryFromDrill(
  userId: string,
  category: string,
  score: number,
  maxScore: number,
): void {
  const key = normalizeCategoryKey(category);
  if (key === "other") return;
  const ratio = maxScore > 0 ? score / maxScore : 0;
  const prev = getCategoryMasteryMap(userId)[key]?.score ?? 0;
  const delta = Math.round(8 * ratio + (ratio >= 0.67 ? 4 : 0));
  const next = Math.min(100, prev + delta);
  recordCategoryMasteryUpdate(userId, key, next);
}

export function applyMasteryFromCorrection(
  userId: string,
  input: { userSentence?: string; correctedSentence?: string; note?: string },
): void {
  const key = categoryKeyFromMistake(inferMistakeCategory(input));
  if (key === "other") return;
  const prev = getCategoryMasteryMap(userId)[key]?.score ?? 0;
  recordCategoryMasteryUpdate(userId, key, Math.min(100, prev + 3));
}

function normalizeCategoryKey(raw: string): MistakeCategoryKey {
  const t = raw.toLowerCase().replace(/\s+/g, "_");
  const keys: MistakeCategoryKey[] = [
    "particle",
    "politeness",
    "tense",
    "word_choice",
    "word_order",
    "register",
    "other",
  ];
  if (keys.includes(t as MistakeCategoryKey)) return t as MistakeCategoryKey;
  if (/particle/.test(t)) return "particle";
  if (/polite/.test(t)) return "politeness";
  return "other";
}

export type DrillTier = "starter" | "core" | "challenge";

export function drillTierForCategory(userId: string, category: MistakeCategoryKey): DrillTier {
  const score = masteryScoreFor(userId, category);
  if (score < 35) return "starter";
  if (score < WEAKNESS_GATE_THRESHOLD) return "core";
  return "challenge";
}
