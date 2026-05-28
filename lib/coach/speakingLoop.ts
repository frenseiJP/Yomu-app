import { stripSnippet } from "@/lib/save-candidates/japanese";

export interface ShadowChunk {
  text: string;
  romajiHint?: string;
}

/** Split corrected line into short shadowing chunks (coach pacing) */
export function shadowChunksFromSentence(sentence: string): ShadowChunk[] {
  const s = stripSnippet(sentence);
  if (!s) return [];
  const parts = s.split(/(?<=。)|(?<=！)|(?<=？)|(?<=[、，])/).map(stripSnippet).filter(Boolean);
  if (parts.length <= 1 && s.length > 14) {
    const mid = Math.ceil(s.length / 2);
    return [
      { text: s.slice(0, mid) },
      { text: s.slice(mid) },
    ];
  }
  return parts.map((text) => ({ text }));
}

export interface PronunciationScore {
  score: number;
  maxScore: number;
  feedback: string;
}

/** Lightweight similarity — not ASR vendor, keeps privacy on-device */
export function scorePronunciationAttempt(target: string, heard: string): PronunciationScore {
  const t = normalizeForCompare(target);
  const h = normalizeForCompare(heard);
  if (!h) {
    return { score: 0, maxScore: 100, feedback: "Try again — speak the line clearly." };
  }
  if (t === h) {
    return { score: 100, maxScore: 100, feedback: "Nice — that matched your correction." };
  }
  const overlap = charOverlapRatio(t, h);
  const score = Math.round(overlap * 100);
  if (score >= 75) {
    return { score, maxScore: 100, feedback: "Close — one more time with the full line." };
  }
  if (score >= 45) {
    return { score, maxScore: 100, feedback: "Getting there — follow the chunks below." };
  }
  return { score, maxScore: 100, feedback: "Listen, then shadow chunk by chunk." };
}

function normalizeForCompare(s: string): string {
  return stripSnippet(s)
    .replace(/\s+/g, "")
    .replace(/[。、！？,.]/g, "")
    .toLowerCase();
}

function charOverlapRatio(a: string, b: string): number {
  if (!a.length) return 0;
  const setB = new Set(b);
  let hit = 0;
  for (const ch of a) {
    if (setB.has(ch)) hit++;
  }
  return hit / Math.max(a.length, b.length);
}

export function speakJapanese(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.92;
  window.speechSynthesis.speak(u);
}

export type SpeechRecognitionCtor = new () => {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((ev: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
