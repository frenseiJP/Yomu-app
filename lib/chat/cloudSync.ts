"use client";

import { createClient } from "@/src/utils/supabase/client";
import { isMissingTableError } from "@/src/utils/supabase/schema-errors";
import type { ChatMessage, ChatSession, ChatSessionStore } from "@/lib/chat/types";

const KEY_PREFIX = "frensei:chat:v1:";

let syncTimer: ReturnType<typeof setTimeout> | null = null;

function storageKey(userId: string): string {
  return `${KEY_PREFIX}${userId}`;
}

function emptyStore(): ChatSessionStore {
  return { sessions: [], messagesBySession: {} };
}

export function readLocalChatStore(userId: string): ChatSessionStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as ChatSessionStore;
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      messagesBySession:
        parsed.messagesBySession && typeof parsed.messagesBySession === "object"
          ? parsed.messagesBySession
          : {},
    };
  } catch {
    return emptyStore();
  }
}

export function writeLocalChatStore(userId: string, store: ChatSessionStore): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

function mergeStores(local: ChatSessionStore, remote: ChatSessionStore): ChatSessionStore {
  const sessionMap = new Map<string, ChatSession>();
  for (const s of [...remote.sessions, ...local.sessions]) {
    const prev = sessionMap.get(s.id);
    if (!prev || new Date(s.updatedAt).getTime() >= new Date(prev.updatedAt).getTime()) {
      sessionMap.set(s.id, s);
    }
  }
  const messagesBySession: Record<string, ChatMessage[]> = {};
  for (const id of sessionMap.keys()) {
    const localMsgs = local.messagesBySession[id] ?? [];
    const remoteMsgs = remote.messagesBySession[id] ?? [];
    const msgMap = new Map<string, ChatMessage>();
    for (const m of [...remoteMsgs, ...localMsgs]) {
      msgMap.set(m.id, m);
    }
    messagesBySession[id] = [...msgMap.values()].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }
  return {
    sessions: [...sessionMap.values()].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    ),
    messagesBySession,
  };
}

async function fetchRemoteStore(authUserId: string): Promise<ChatSessionStore | null> {
  const supabase = createClient();
  const { data: sessions, error: sErr } = await supabase
    .from("chat_sessions")
    .select("id, title, created_at, updated_at")
    .eq("user_id", authUserId)
    .order("updated_at", { ascending: false });
  if (sErr) {
    if (isMissingTableError(sErr, "chat_sessions")) return null;
    throw sErr;
  }

  const { data: messages, error: mErr } = await supabase
    .from("chat_messages")
    .select("id, session_id, role, content, meta, created_at")
    .eq("user_id", authUserId);
  if (mErr) {
    if (isMissingTableError(mErr, "chat_messages")) return null;
    throw mErr;
  }

  const store = emptyStore();
  for (const row of sessions ?? []) {
    store.sessions.push({
      id: row.id,
      userId: authUserId,
      title: row.title ?? "",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  for (const row of messages ?? []) {
    const sid = row.session_id as string;
    if (!store.messagesBySession[sid]) store.messagesBySession[sid] = [];
    store.messagesBySession[sid].push({
      id: row.id,
      sessionId: sid,
      role: row.role as ChatMessage["role"],
      content: row.content ?? "",
      createdAt: row.created_at,
      meta: (row.meta as ChatMessage["meta"]) ?? undefined,
    });
  }
  return store;
}

async function pushStore(authUserId: string, store: ChatSessionStore): Promise<boolean> {
  const supabase = createClient();
  if (store.sessions.length === 0) return true;

  const sessionRows = store.sessions.map((s) => ({
    id: s.id,
    user_id: authUserId,
    title: s.title,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  }));
  const { error: sErr } = await supabase.from("chat_sessions").upsert(sessionRows, { onConflict: "id" });
  if (sErr) {
    if (isMissingTableError(sErr, "chat_sessions")) return false;
    throw sErr;
  }

  const messageRows: Array<Record<string, unknown>> = [];
  for (const [sessionId, msgs] of Object.entries(store.messagesBySession)) {
    for (const m of msgs) {
      messageRows.push({
        id: m.id,
        session_id: sessionId,
        user_id: authUserId,
        role: m.role,
        content: m.content,
        meta: m.meta ?? null,
        created_at: m.createdAt,
      });
    }
  }
  if (messageRows.length > 0) {
    const { error: mErr } = await supabase.from("chat_messages").upsert(messageRows, { onConflict: "id" });
    if (mErr) {
      if (isMissingTableError(mErr, "chat_messages")) return false;
      throw mErr;
    }
  }
  return true;
}

export async function pullChatFromCloud(localUserId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const remote = await fetchRemoteStore(user.id);
    if (!remote) return false;

    const local = readLocalChatStore(localUserId);
    const merged = mergeStores(local, remote);
    writeLocalChatStore(localUserId, merged);
    return true;
  } catch {
    return false;
  }
}

export async function pushChatToCloud(localUserId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const local = readLocalChatStore(localUserId);
    const remote = (await fetchRemoteStore(user.id)) ?? emptyStore();
    const merged = mergeStores(local, remote);
    writeLocalChatStore(localUserId, merged);
    return pushStore(user.id, merged);
  } catch {
    return false;
  }
}

export function queueChatCloudSync(localUserId: string): void {
  if (typeof window === "undefined") return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    void pushChatToCloud(localUserId);
  }, 1500);
}
