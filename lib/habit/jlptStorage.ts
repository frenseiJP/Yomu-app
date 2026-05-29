const KEY = "frensei:jlpt:v1";

export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

const LEVELS: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export function readStoredJlpt(userId: string): JlptLevel {
  if (typeof window === "undefined") return "N3";
  try {
    const raw = localStorage.getItem(`${KEY}:${userId}`);
    if (raw && LEVELS.includes(raw as JlptLevel)) return raw as JlptLevel;
  } catch {
    /* ignore */
  }
  return "N3";
}

export function writeStoredJlpt(userId: string, level: JlptLevel): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${KEY}:${userId}`, level);
  } catch {
    /* ignore */
  }
}
