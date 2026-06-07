import type { FtueCoachPayload } from "@/lib/ftue/types";

const PENDING_KEY = "frensei:guest:pending_chat:v1";
const IMPORTED_BANNER_KEY = "frensei:guest:imported_banner:v1";

export type PendingGuestLine = {
  role: "user" | "assistant";
  text: string;
  payload?: FtueCoachPayload;
};

export type PendingGuestChat = {
  lines: PendingGuestLine[];
  savedAt: string;
  source: string;
};

export function savePendingGuestChat(
  lines: PendingGuestLine[],
  source: string,
): void {
  if (typeof window === "undefined") return;
  const userLines = lines.filter((l) => l.role === "user");
  if (userLines.length === 0) return;
  try {
    const payload: PendingGuestChat = {
      lines: lines
        .filter((l) => l.role === "user" || (l.role === "assistant" && l.text.trim()))
        .map((l) => ({
          role: l.role,
          text: l.text,
          payload: l.payload,
        })),
      savedAt: new Date().toISOString(),
      source,
    };
    window.localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function readPendingGuestChat(): PendingGuestChat | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingGuestChat;
    if (!parsed?.lines?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingGuestChat(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}

export function hasPendingGuestChat(): boolean {
  return readPendingGuestChat() !== null;
}

export function markGuestImportBannerPending(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(IMPORTED_BANNER_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function consumeGuestImportBanner(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const v = window.sessionStorage.getItem(IMPORTED_BANNER_KEY);
    if (v !== "1") return false;
    window.sessionStorage.removeItem(IMPORTED_BANNER_KEY);
    return true;
  } catch {
    return false;
  }
}

export function lastUserPreview(lines: PendingGuestLine[]): string {
  const last = [...lines].reverse().find((l) => l.role === "user" && l.text.trim());
  if (!last) return "";
  const t = last.text.trim().replace(/\s+/g, " ");
  return t.length > 72 ? `${t.slice(0, 72)}…` : t;
}
