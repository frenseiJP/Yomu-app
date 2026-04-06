const MEMORY_STORAGE = new Map<string, string>();

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function createMemoryStorage(): StorageLike {
  return {
    getItem: (key: string) => (MEMORY_STORAGE.has(key) ? MEMORY_STORAGE.get(key)! : null),
    setItem: (key: string, value: string) => {
      MEMORY_STORAGE.set(key, value);
    },
    removeItem: (key: string) => {
      MEMORY_STORAGE.delete(key);
    },
  };
}

export function getStorage(): StorageLike {
  if (typeof window === "undefined" || !window.localStorage) {
    return createMemoryStorage();
  }
  return window.localStorage;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function generateRecordId(prefix: string): string {
  const randomPart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${randomPart}`;
}

export function safeParseArray<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as T[];
  } catch {
    return [];
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

