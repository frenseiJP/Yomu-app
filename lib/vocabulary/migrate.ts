import { listVocabularyByUser, upsertVocabulary } from "@/lib/vocabulary/storage";
import type { VocabularyItem } from "@/lib/vocabulary/types";

const LEGACY_GLOBAL_KEY = "yomu_my_vocab";

function scopedLegacyKey(userId: string): string {
  return `frensei:vocab:legacy-ui:v1:${userId}`;
}

function migrationFlagKey(userId: string): string {
  return `frensei:vocab:migrated:v2:${userId}`;
}

function legacyRowToItem(raw: Record<string, unknown>, userId: string): VocabularyItem | null {
  const term = typeof raw.word === "string" ? raw.word.trim() : "";
  if (!term) return null;
  const now = new Date().toISOString();
  const translations = Array.isArray(raw.translations)
    ? raw.translations.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    : [];
  const meaning =
    translations[0] ??
    (typeof raw.meaning === "string" && raw.meaning.trim() ? raw.meaning.trim() : undefined);
  const examples = Array.isArray(raw.exampleSentences)
    ? raw.exampleSentences.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    : [];
  return {
    id: `legacy_${userId}_${term}`,
    userId,
    type: "word",
    term,
    reading: typeof raw.kana === "string" && raw.kana.trim() ? raw.kana.trim() : undefined,
    meaning,
    exampleSentence: examples[0],
    sourceType: "manual",
    tags: ["legacy_migrated"],
    reviewStatus: "new",
    createdAt: now,
    updatedAt: now,
  };
}

function readLegacyRows(userId: string): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];
  const rows: Record<string, unknown>[] = [];
  try {
    const scopedRaw = window.localStorage.getItem(scopedLegacyKey(userId));
    if (scopedRaw) {
      const parsed = JSON.parse(scopedRaw) as unknown;
      if (Array.isArray(parsed)) rows.push(...parsed.filter((x) => x && typeof x === "object") as Record<string, unknown>[]);
    }
    const globalRaw = window.localStorage.getItem(LEGACY_GLOBAL_KEY);
    if (globalRaw) {
      const parsed = JSON.parse(globalRaw) as unknown;
      if (Array.isArray(parsed)) rows.push(...parsed.filter((x) => x && typeof x === "object") as Record<string, unknown>[]);
    }
  } catch {
    /* ignore */
  }
  return rows;
}

/** One-time migration from legacy UI vocab keys into `frensei_vocabulary_v1`. */
export function migrateLegacyVocabularyIfNeeded(userId: string): number {
  if (typeof window === "undefined" || !userId) return 0;
  if (window.localStorage.getItem(migrationFlagKey(userId))) return 0;

  const existingTerms = new Set(listVocabularyByUser(userId).map((x) => x.term));
  let added = 0;
  for (const raw of readLegacyRows(userId)) {
    const item = legacyRowToItem(raw, userId);
    if (!item || existingTerms.has(item.term)) continue;
    upsertVocabulary(item);
    existingTerms.add(item.term);
    added += 1;
  }

  window.localStorage.setItem(migrationFlagKey(userId), String(added));
  return added;
}
