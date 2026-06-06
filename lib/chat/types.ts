export type ChatRole = "user" | "assistant";

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

/** Serializable assistant metadata persisted with chat history */
export interface ChatMessageMeta {
  replyTone?: string;
  senseiPayload?: unknown;
  chatContext?: unknown;
  goalFeedback?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  meta?: ChatMessageMeta;
}

export interface ChatSessionStore {
  sessions: ChatSession[];
  messagesBySession: Record<string, ChatMessage[]>;
}
