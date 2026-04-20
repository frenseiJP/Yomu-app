/**
 * チャット履歴の型定義と localStorage 永続化
 * Yomu - 日本文化AIコーチ
 */
import { getOrCreateUserId } from "@/lib/chat/service";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string; // ISO
};

export type ChatSession = {
  id: string;
  title: string;
  preview: string; // 先頭メッセージなど
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

const LEGACY_STORAGE_KEY = "yomu_chat_history";
function storageKey(): string {
  return `frensei:chat-history:v1:${getOrCreateUserId()}`;
}

function getStored(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const scopedKey = storageKey();
    const scopedRaw = localStorage.getItem(scopedKey);
    if (scopedRaw) {
      const parsed = JSON.parse(scopedRaw) as ChatSession[];
      return Array.isArray(parsed) ? parsed : [];
    }
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacyRaw) return [];
    localStorage.setItem(scopedKey, legacyRaw);
    const parsed = JSON.parse(legacyRaw) as ChatSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStored(sessions: ChatSession[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(), JSON.stringify(sessions));
  } catch {
    // ignore
  }
}

export function getAllSessions(): ChatSession[] {
  return getStored().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getSession(id: string): ChatSession | undefined {
  return getStored().find((s) => s.id === id);
}

export function saveSession(session: ChatSession): void {
  const list = getStored();
  const idx = list.findIndex((s) => s.id === session.id);
  const next =
    idx >= 0
      ? list.map((s, i) => (i === idx ? session : s))
      : [session, ...list];
  setStored(next);
}

export function deleteSession(id: string): void {
  setStored(getStored().filter((s) => s.id !== id));
}

export function createSession(
  firstMessage: string,
  firstReply: string
): ChatSession {
  const now = new Date().toISOString();
  const id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const title =
    firstMessage.slice(0, 40) + (firstMessage.length > 40 ? "…" : "");
  return {
    id,
    title,
    preview: firstReply.slice(0, 80) + (firstReply.length > 80 ? "…" : ""),
    messages: [
      { id: `msg_${id}_0`, role: "user", content: firstMessage, createdAt: now },
      {
        id: `msg_${id}_1`,
        role: "assistant",
        content: firstReply,
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}
