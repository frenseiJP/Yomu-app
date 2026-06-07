import {
  addAssistantMessage,
  addUserMessage,
  startNewChatSession,
  updateMessageMeta,
} from "@/lib/chat/service";
import {
  clearPendingGuestChat,
  markGuestImportBannerPending,
  readPendingGuestChat,
} from "@/lib/guest/pendingChat";

/** Import saved guest trial into the user's chat library. Returns new session id. */
export function importPendingGuestChat(userId: string): string | null {
  if (typeof window === "undefined" || !userId || userId === "guest") return null;

  const pending = readPendingGuestChat();
  if (!pending || pending.lines.length < 2) return null;

  const firstUser = pending.lines.find((l) => l.role === "user" && l.text.trim());
  if (!firstUser) return null;

  const session = startNewChatSession(userId, firstUser.text.trim());

  for (const line of pending.lines) {
    if (line.role === "user") {
      if (!line.text.trim()) continue;
      addUserMessage(userId, session.id, line.text.trim());
      continue;
    }
    if (!line.text.trim()) continue;
    const msg = addAssistantMessage(userId, session.id, line.text.trim());
    if (line.payload) {
      updateMessageMeta(userId, session.id, msg.id, { senseiPayload: line.payload });
    }
  }

  clearPendingGuestChat();
  markGuestImportBannerPending();
  return session.id;
}
