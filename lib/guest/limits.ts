export const GUEST_CHAT_MAX_TURNS = 3;
export const GUEST_TURN_KEY = "frensei:guest:turns:v1";

export function readGuestTurns(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.sessionStorage.getItem(GUEST_TURN_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function incrementGuestTurns(): number {
  const next = readGuestTurns() + 1;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(GUEST_TURN_KEY, String(next));
    } catch {
      /* noop */
    }
  }
  return next;
}

export function guestTurnsRemaining(): number {
  return Math.max(0, GUEST_CHAT_MAX_TURNS - readGuestTurns());
}
