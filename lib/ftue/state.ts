import { getProgressSnapshot } from "@/lib/habit/progress";
import type { FtuePersisted } from "@/lib/ftue/types";

const KEY = "frensei:ftue_v1";

function defaultState(): FtuePersisted {
  return { pickerDone: false, firstLearningCompleted: false };
}

export function readFtuePersist(): FtuePersisted {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const o = JSON.parse(raw) as Record<string, unknown>;
    return {
      pickerDone: Boolean(o.pickerDone),
      firstLearningCompleted: Boolean(o.firstLearningCompleted),
    };
  } catch {
    return defaultState();
  }
}

export function writeFtuePersist(patch: Partial<FtuePersisted>): FtuePersisted {
  const next = { ...readFtuePersist(), ...patch };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
  return next;
}

/** 既存ユーザー: 進捗がある場合は FTUE をスキップ扱いにする */
export function migrateFtueIfLegacyUser(userId: string): void {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(KEY)) return;
    const snap = getProgressSnapshot(userId);
    if (snap.totalChatMessages > 0) {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({ pickerDone: true, firstLearningCompleted: true } satisfies FtuePersisted),
      );
    }
  } catch {
    /* ignore */
  }
}
