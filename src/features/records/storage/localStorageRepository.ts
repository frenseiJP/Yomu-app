import type { UserScopedRepository } from "@/src/features/records/storage/repository";
import {
  generateRecordId,
  getStorage,
  isRecord,
  nowIso,
  safeParseArray,
  type StorageLike,
} from "@/src/features/records/storage/helpers";

type LocalStorageRepoOptions<T extends { id: string; userId: string; createdAt: string }> = {
  entityKey: string;
  supportsUpdatedAt: boolean;
  storage?: StorageLike;
};

export function createLocalStorageRepository<
  T extends { id: string; userId: string; createdAt: string },
>(
  options: LocalStorageRepoOptions<T>,
): UserScopedRepository<T> {
  const { entityKey, supportsUpdatedAt, storage = getStorage() } = options;

  function keyForUser(userId: string): string {
    return `frensei:records:${entityKey}:${userId}`;
  }

  function readAll(userId: string): T[] {
    const key = keyForUser(userId);
    const raw = storage.getItem(key);
    const parsed = safeParseArray<unknown>(raw);
    const filtered = parsed.filter(
      (item): item is T =>
        isRecord(item) &&
        typeof item.id === "string" &&
        typeof item.userId === "string" &&
        item.userId === userId &&
        typeof item.createdAt === "string",
    );

    // 破損データが混ざっていた場合は、健全なデータのみで自己修復する。
    if (raw && parsed.length !== filtered.length) {
      writeAll(userId, filtered);
    }

    return filtered;
  }

  function writeAll(userId: string, records: T[]): void {
    storage.setItem(keyForUser(userId), JSON.stringify(records));
  }

  return {
    getAllByUser(userId: string): T[] {
      return readAll(userId);
    },
    getBySession(userId: string, sessionId: string): T[] {
      return readAll(userId).filter((record) => {
        const maybe = record as unknown as Record<string, unknown>;
        return maybe.sessionId === sessionId;
      });
    },
    create(userId, input) {
      const existing = readAll(userId);
      const createdAt = input.createdAt ?? nowIso();
      const next: T = {
        ...(input as T),
        id: input.id ?? generateRecordId(entityKey),
        userId,
        createdAt,
      };

      if (supportsUpdatedAt) {
        (next as Record<string, unknown>).updatedAt = nowIso();
      }

      existing.unshift(next);
      writeAll(userId, existing);
      return next;
    },
    update(userId, id, patch) {
      const existing = readAll(userId);
      const index = existing.findIndex((item) => item.id === id);
      if (index < 0) return null;

      const current = existing[index];
      const next: T = {
        ...current,
        ...(patch as T),
      };

      if (supportsUpdatedAt) {
        (next as Record<string, unknown>).updatedAt = nowIso();
      }

      existing[index] = next;
      writeAll(userId, existing);
      return next;
    },
    delete(userId, id) {
      const existing = readAll(userId);
      const next = existing.filter((item) => item.id !== id);
      if (next.length === existing.length) return false;
      writeAll(userId, next);
      return true;
    },
  };
}

