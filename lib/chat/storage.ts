import { getStorage, generateRecordId, nowIso } from "@/src/features/records/storage/helpers";
import type {
  ChatMessage,
  ChatMessageMeta,
  ChatSession,
  ChatSessionStore,
} from "@/lib/chat/types";

function key(userId: string): string {
  return `frensei:chat:v1:${userId}`;
}

function emptyStore(): ChatSessionStore {
  return { sessions: [], messagesBySession: {} };
}

function readStore(userId: string): ChatSessionStore {
  try {
    const raw = getStorage().getItem(key(userId));
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return emptyStore();
    const o = parsed as Record<string, unknown>;
    const sessions = Array.isArray(o.sessions) ? (o.sessions as ChatSession[]) : [];
    const messagesBySession =
      o.messagesBySession && typeof o.messagesBySession === "object"
        ? (o.messagesBySession as Record<string, ChatMessage[]>)
        : {};
    return { sessions, messagesBySession };
  } catch {
    return emptyStore();
  }
}

function writeStore(userId: string, store: ChatSessionStore): void {
  try {
    getStorage().setItem(key(userId), JSON.stringify(store));
    if (typeof window !== "undefined") {
      void import("@/lib/chat/cloudSync").then((m) => m.queueChatCloudSync(userId));
    }
  } catch {
    /* ignore */
  }
}

function normalizeTitle(firstUserText: string): string {
  const t = firstUserText.replace(/\s+/g, " ").trim();
  if (!t) return "New conversation";
  return t.length > 36 ? `${t.slice(0, 36)}…` : t;
}

export function listSessions(userId: string): ChatSession[] {
  const store = readStore(userId);
  return [...store.sessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getSessionMessages(userId: string, sessionId: string): ChatMessage[] {
  const store = readStore(userId);
  const rows = store.messagesBySession[sessionId] ?? [];
  return [...rows].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function createSession(userId: string, firstUserPrompt?: string): ChatSession {
  const store = readStore(userId);
  const now = nowIso();
  const s: ChatSession = {
    id: generateRecordId("cs"),
    userId,
    title: normalizeTitle(firstUserPrompt ?? ""),
    createdAt: now,
    updatedAt: now,
  };
  store.sessions.unshift(s);
  store.messagesBySession[s.id] = [];
  writeStore(userId, store);
  return s;
}

export function deleteSession(userId: string, sessionId: string): void {
  const store = readStore(userId);
  store.sessions = store.sessions.filter((s) => s.id !== sessionId);
  delete store.messagesBySession[sessionId];
  writeStore(userId, store);
}

export function appendMessage(
  userId: string,
  sessionId: string,
  role: ChatMessage["role"],
  content: string,
): ChatMessage {
  const store = readStore(userId);
  const msg: ChatMessage = {
    id: generateRecordId("cm"),
    sessionId,
    role,
    content,
    createdAt: nowIso(),
  };
  const rows = store.messagesBySession[sessionId] ?? [];
  rows.push(msg);
  store.messagesBySession[sessionId] = rows;

  const firstUser = rows.find((m) => m.role === "user");
  store.sessions = store.sessions.map((s) =>
    s.id === sessionId
      ? {
          ...s,
          title: firstUser ? normalizeTitle(firstUser.content) : s.title,
          updatedAt: nowIso(),
        }
      : s,
  );

  writeStore(userId, store);
  return msg;
}

export function patchMessageMeta(
  userId: string,
  sessionId: string,
  messageId: string,
  patch: ChatMessageMeta,
): void {
  const store = readStore(userId);
  const rows = store.messagesBySession[sessionId];
  if (!rows) return;
  const idx = rows.findIndex((m) => m.id === messageId);
  if (idx < 0) return;
  rows[idx] = {
    ...rows[idx],
    meta: { ...rows[idx].meta, ...patch },
  };
  store.messagesBySession[sessionId] = rows;
  writeStore(userId, store);
}

export function upsertSession(userId: string, session: ChatSession): void {
  const store = readStore(userId);
  const idx = store.sessions.findIndex((s) => s.id === session.id);
  if (idx < 0) store.sessions.unshift(session);
  else store.sessions[idx] = session;
  if (!store.messagesBySession[session.id]) store.messagesBySession[session.id] = [];
  writeStore(userId, store);
}

export function getSessionSummarySnippet(userId: string, sessionId: string): string {
  const store = readStore(userId);
  const session = store.sessions.find((s) => s.id === sessionId);
  return session?.summarySnippet?.trim() ?? "";
}

export function appendSessionSummarySnippet(
  userId: string,
  sessionId: string,
  line: string,
): void {
  const trimmed = line.trim();
  if (!trimmed) return;
  const store = readStore(userId);
  const idx = store.sessions.findIndex((s) => s.id === sessionId);
  if (idx < 0) return;
  const prev = store.sessions[idx].summarySnippet?.trim() ?? "";
  const combined = prev ? `${prev} | ${trimmed}` : trimmed;
  store.sessions[idx] = {
    ...store.sessions[idx],
    summarySnippet: combined.slice(-600),
    updatedAt: nowIso(),
  };
  writeStore(userId, store);
}
