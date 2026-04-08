import { getStorage } from "@/src/features/records/storage/helpers";

function habitKey(kind: string, userId: string): string {
  return `frensei:habit:${kind}:${userId}`;
}

export function readHabitJson<T>(kind: string, userId: string, fallback: T): T {
  try {
    const raw = getStorage().getItem(habitKey(kind, userId));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return parsed as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

export function writeHabitJson(kind: string, userId: string, value: unknown): void {
  try {
    getStorage().setItem(habitKey(kind, userId), JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}
