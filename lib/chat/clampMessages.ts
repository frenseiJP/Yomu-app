export type ChatApiMessage = { role: "user" | "assistant"; content: string };

export type ClampMessagesOptions = {
  maxMessages?: number;
  maxMessageChars?: number;
  maxTotalChars?: number;
};

const DEFAULTS: Required<ClampMessagesOptions> = {
  maxMessages: 12,
  maxMessageChars: 2_000,
  maxTotalChars: 10_000,
};

/** Keep the most recent messages; drop oldest when over limits. */
export function clampChatMessages(
  raw: unknown,
  opts: ClampMessagesOptions = {},
): ChatApiMessage[] {
  const { maxMessages, maxMessageChars, maxTotalChars } = { ...DEFAULTS, ...opts };
  if (!Array.isArray(raw)) return [];

  const normalized: ChatApiMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const c = content.trim();
    if (!c) continue;
    normalized.push({ role, content: c });
  }

  const tail = normalized.slice(-maxMessages);
  const out: ChatApiMessage[] = [];
  let total = 0;

  for (let i = tail.length - 1; i >= 0; i--) {
    const role = tail[i].role;
    let content = tail[i].content.slice(0, maxMessageChars);
    if (total + content.length > maxTotalChars) {
      const room = maxTotalChars - total;
      if (room < 80) break;
      content = content.slice(-room);
    }
    total += content.length;
    out.unshift({ role, content });
  }

  return out;
}
