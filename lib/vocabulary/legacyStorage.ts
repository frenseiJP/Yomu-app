const LEGACY_VOCAB_KEY = "yomu_my_vocab";

function scopedLegacyVocabKey(userId: string): string {
  return `frensei:vocab:legacy-ui:v1:${userId}`;
}

export function readLegacyUiVocab(userId: string): unknown[] {
  if (typeof window === "undefined") return [];
  try {
    const scopedRaw = window.localStorage.getItem(scopedLegacyVocabKey(userId));
    if (scopedRaw) {
      const arr = JSON.parse(scopedRaw) as unknown;
      return Array.isArray(arr) ? arr : [];
    }
    const legacyRaw = window.localStorage.getItem(LEGACY_VOCAB_KEY);
    if (!legacyRaw) return [];
    // Safe migration: copy legacy payload to scoped key on first read.
    window.localStorage.setItem(scopedLegacyVocabKey(userId), legacyRaw);
    const arr = JSON.parse(legacyRaw) as unknown;
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
