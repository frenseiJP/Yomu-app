import type { VocabularyItem } from "@/lib/vocabulary/types";

const KEY = "frensei_vocabulary_v1";

function isItem(v: unknown): v is VocabularyItem {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.userId === "string" && typeof r.term === "string";
}

function readAll(): VocabularyItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isItem);
  } catch {
    return [];
  }
}

function writeAll(items: VocabularyItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function listVocabularyByUser(userId: string): VocabularyItem[] {
  return readAll()
    .filter((x) => x.userId === userId)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function upsertVocabulary(item: VocabularyItem): void {
  const all = readAll();
  const idx = all.findIndex((x) => x.id === item.id);
  if (idx >= 0) all[idx] = item;
  else all.unshift(item);
  writeAll(all);
}

export function deleteVocabulary(id: string): void {
  const all = readAll().filter((x) => x.id !== id);
  writeAll(all);
}
