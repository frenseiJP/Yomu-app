"use client";

import type { ChatSessionStore } from "@/lib/chat/types";
import type { VocabularyItem } from "@/lib/vocabulary/types";

const CHAT_PREFIX = "frensei:chat:v1:";
const VOCAB_KEY = "frensei_vocabulary_v1";

function readChatStore(userId: string): ChatSessionStore | null {
  try {
    const raw = window.localStorage.getItem(`${CHAT_PREFIX}${userId}`);
    if (!raw) return null;
    return JSON.parse(raw) as ChatSessionStore;
  } catch {
    return null;
  }
}

function writeChatStore(userId: string, store: ChatSessionStore): void {
  try {
    window.localStorage.setItem(`${CHAT_PREFIX}${userId}`, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

function readAllVocab(): VocabularyItem[] {
  try {
    const raw = window.localStorage.getItem(VOCAB_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as VocabularyItem[]) : [];
  } catch {
    return [];
  }
}

function writeAllVocab(items: VocabularyItem[]): void {
  try {
    window.localStorage.setItem(VOCAB_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

/** Copy guest-local chat & vocabulary into the authenticated user id on first login. */
export function mergeGuestLocalDataIntoAuthUser(guestUserId: string, authUserId: string): void {
  if (typeof window === "undefined" || !guestUserId || !authUserId || guestUserId === authUserId) {
    return;
  }

  const guestChat = readChatStore(guestUserId);
  const authChat = readChatStore(authUserId) ?? { sessions: [], messagesBySession: {} };

  if (guestChat?.sessions?.length) {
    const sessionIds = new Set(authChat.sessions.map((s) => s.id));
    for (const session of guestChat.sessions) {
      if (!sessionIds.has(session.id)) {
        authChat.sessions.push({ ...session, userId: authUserId });
        authChat.messagesBySession[session.id] = (guestChat.messagesBySession[session.id] ?? []).map(
          (m) => ({ ...m, sessionId: session.id }),
        );
      }
    }
    authChat.sessions.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    writeChatStore(authUserId, authChat);
  }

  const allVocab = readAllVocab();
  const guestItems = allVocab.filter((v) => v.userId === guestUserId);
  if (guestItems.length === 0) return;

  const authIds = new Set(allVocab.filter((v) => v.userId === authUserId).map((v) => v.id));
  const merged = allVocab.map((item) => {
    if (item.userId !== guestUserId) return item;
    if (authIds.has(item.id)) return item;
    return { ...item, userId: authUserId };
  });
  writeAllVocab(merged);
}
