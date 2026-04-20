import { getOrCreateUserId } from "@/lib/chat/service";

const KEY = "frensei_feedback_comments_v1";

export type FeedbackCommentItem = {
  id: string;
  userId: string;
  displayName?: string;
  body: string;
  createdAt: string;
};

function readAll(): FeedbackCommentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is FeedbackCommentItem => {
      if (!x || typeof x !== "object") return false;
      const r = x as Record<string, unknown>;
      return (
        typeof r.id === "string" &&
        typeof r.userId === "string" &&
        typeof r.body === "string" &&
        typeof r.createdAt === "string"
      );
    });
  } catch {
    return [];
  }
}

function writeAll(items: FeedbackCommentItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function listFeedbackCommentsByUser(userId?: string): FeedbackCommentItem[] {
  const uid = userId?.trim() || getOrCreateUserId();
  return readAll()
    .filter((x) => x.userId === uid)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addFeedbackComment(input: {
  body: string;
  displayName?: string;
  userId?: string;
}): FeedbackCommentItem {
  const userId = input.userId?.trim() || getOrCreateUserId();
  const item: FeedbackCommentItem = {
    id: `fb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    displayName: input.displayName?.trim() || undefined,
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
  };
  const all = readAll();
  all.unshift(item);
  writeAll(all);
  return item;
}

export function deleteFeedbackComment(id: string): void {
  const all = readAll().filter((x) => x.id !== id);
  writeAll(all);
}
