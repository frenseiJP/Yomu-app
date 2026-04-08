export type ChatRole = "user" | "assistant";

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatSessionStore {
  sessions: ChatSession[];
  messagesBySession: Record<string, ChatMessage[]>;
}
