const COMPLETED_KEY_PREFIX = "frensei:tutorial-completed:v1:";
const SESSION_SHOWN_KEY = "frensei:tutorial-shown-session:v1";

function completedKey(userId: string): string {
  return `${COMPLETED_KEY_PREFIX}${userId}`;
}

export function getTutorialCompleted(userId: string): boolean {
  if (typeof window === "undefined" || !userId || userId === "guest") return false;
  try {
    return window.localStorage.getItem(completedKey(userId)) === "1";
  } catch {
    return false;
  }
}

export function markTutorialCompleted(userId: string): void {
  if (typeof window === "undefined" || !userId || userId === "guest") return;
  try {
    window.localStorage.setItem(completedKey(userId), "1");
  } catch {
    // ignore
  }
}

export function resetTutorial(userId: string): void {
  if (typeof window === "undefined" || !userId || userId === "guest") return;
  try {
    window.localStorage.removeItem(completedKey(userId));
  } catch {
    // ignore
  }
}

export function wasTutorialShownThisSession(userId: string): boolean {
  if (typeof window === "undefined" || !userId) return true;
  try {
    return window.sessionStorage.getItem(SESSION_SHOWN_KEY) === userId;
  } catch {
    return false;
  }
}

export function markTutorialShownThisSession(userId: string): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    window.sessionStorage.setItem(SESSION_SHOWN_KEY, userId);
  } catch {
    // ignore
  }
}
