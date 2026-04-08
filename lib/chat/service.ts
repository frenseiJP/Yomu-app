import type { ChatMessage, ChatSession } from "@/lib/chat/types";
import {
  appendMessage,
  createSession,
  deleteSession,
  getSessionMessages,
  listSessions,
} from "@/lib/chat/storage";

const USER_ID_KEY = "frensei:user_id";

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "guest";
  try {
    const found = window.localStorage.getItem(USER_ID_KEY);
    if (found && found.trim()) return found;
    const id = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem(USER_ID_KEY, id);
    return id;
  } catch {
    return "guest";
  }
}

export function startNewChatSession(userId: string, firstPrompt?: string): ChatSession {
  return createSession(userId, firstPrompt);
}

export function getSessions(userId: string): ChatSession[] {
  return listSessions(userId);
}

export function getMessages(userId: string, sessionId: string): ChatMessage[] {
  return getSessionMessages(userId, sessionId);
}

export function addUserMessage(userId: string, sessionId: string, content: string): ChatMessage {
  return appendMessage(userId, sessionId, "user", content);
}

export function addAssistantMessage(userId: string, sessionId: string, content: string): ChatMessage {
  return appendMessage(userId, sessionId, "assistant", content);
}

export function removeSession(userId: string, sessionId: string): void {
  deleteSession(userId, sessionId);
}
