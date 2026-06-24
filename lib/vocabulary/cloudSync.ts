"use client";

import { createClient } from "@/src/utils/supabase/client";
import { isMissingTableError } from "@/src/utils/supabase/schema-errors";
import type { VocabularyItem } from "@/lib/vocabulary/types";
import { listVocabularyByUser, upsertVocabulary } from "@/lib/vocabulary/storage";

let syncTimer: ReturnType<typeof setTimeout> | null = null;

function isItem(v: unknown): v is VocabularyItem {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.userId === "string" && typeof r.term === "string";
}

function mergeItems(local: VocabularyItem[], remote: VocabularyItem[]): VocabularyItem[] {
  const map = new Map<string, VocabularyItem>();
  for (const item of [...remote, ...local]) {
    const prev = map.get(item.id);
    if (!prev || item.updatedAt >= prev.updatedAt) map.set(item.id, item);
  }
  return [...map.values()].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

async function fetchRemoteVocab(authUserId: string): Promise<VocabularyItem[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vocabulary_items")
    .select("data, updated_at")
    .eq("user_id", authUserId)
    .order("updated_at", { ascending: false });
  if (error) {
    if (isMissingTableError(error, "vocabulary_items")) return null;
    throw error;
  }
  const items: VocabularyItem[] = [];
  for (const row of data ?? []) {
    const parsed = row.data;
    if (isItem(parsed)) items.push({ ...parsed, userId: authUserId });
  }
  return items;
}

async function pushVocab(authUserId: string, items: VocabularyItem[]): Promise<boolean> {
  if (items.length === 0) return true;
  const supabase = createClient();
  const rows = items.map((item) => ({
    id: item.id,
    user_id: authUserId,
    data: { ...item, userId: authUserId },
    updated_at: item.updatedAt,
  }));
  const { error } = await supabase.from("vocabulary_items").upsert(rows, { onConflict: "id" });
  if (error) {
    if (isMissingTableError(error, "vocabulary_items")) return false;
    throw error;
  }
  return true;
}

export async function pullVocabularyFromCloud(localUserId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const remote = await fetchRemoteVocab(user.id);
    if (!remote) return false;

    const local = listVocabularyByUser(localUserId);
    const merged = mergeItems(local, remote);
    for (const item of merged) {
      upsertVocabulary({ ...item, userId: localUserId });
    }
    return true;
  } catch {
    return false;
  }
}

export async function pushVocabularyToCloud(localUserId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const local = listVocabularyByUser(localUserId);
    const remote = (await fetchRemoteVocab(user.id)) ?? [];
    const merged = mergeItems(local, remote);
    for (const item of merged) {
      upsertVocabulary({ ...item, userId: localUserId });
    }
    return pushVocab(user.id, merged);
  } catch {
    return false;
  }
}

export function queueVocabularyCloudSync(localUserId: string): void {
  if (typeof window === "undefined") return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    void pushVocabularyToCloud(localUserId);
  }, 1500);
}
