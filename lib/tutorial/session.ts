import type { GuidedTutorialSession, GuidedTutorialStep } from "@/lib/tutorial/types";

const SESSION_KEY = "frensei:tutorial-guided:v1";

export function readGuidedTutorialSession(): GuidedTutorialSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GuidedTutorialSession;
    if (!parsed?.step) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeGuidedTutorialSession(
  patch: Partial<GuidedTutorialSession> & { step: GuidedTutorialStep },
): void {
  if (typeof window === "undefined") return;
  const prev = readGuidedTutorialSession();
  const next: GuidedTutorialSession = {
    startedAt: prev?.startedAt ?? new Date().toISOString(),
    chatSessionId: prev?.chatSessionId,
    assistantMessageId: prev?.assistantMessageId,
    savedVocabularyId: prev?.savedVocabularyId,
    ...prev,
    ...patch,
  };
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function clearGuidedTutorialSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

export function isGuidedTutorialInProgress(): boolean {
  const s = readGuidedTutorialSession();
  if (!s) return false;
  return s.step !== "welcome" && s.step !== "complete";
}
