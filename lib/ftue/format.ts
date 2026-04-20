import type { FtueCoachPayload } from "@/lib/ftue/types";

export function buildFtueCoachMessage(p: FtueCoachPayload): string {
  const nice = (p.niceLine ?? "Nice 👍").trim();
  const o1 = (p.otherWay1 ?? "").trim();
  const o2 = (p.otherWay2 ?? "").trim();
  const lines = [
    nice,
    "",
    "Better:",
    p.correctedSentence.trim(),
    "",
    "Why:",
    p.whyEnglish.trim(),
    "",
    "Other ways:",
  ];
  if (o1) lines.push(`・${o1}`);
  if (o2) lines.push(`・${o2}`);
  lines.push("", "Try again 👇");
  return lines.join("\n");
}

export function parseFtueCoachPayload(raw: unknown): FtueCoachPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const correctedSentence = typeof o.correctedSentence === "string" ? o.correctedSentence.trim() : "";
  const whyEnglish = typeof o.whyEnglish === "string" ? o.whyEnglish.trim() : "";
  const otherWay1 = typeof o.otherWay1 === "string" ? o.otherWay1.trim() : "";
  const otherWay2 = typeof o.otherWay2 === "string" ? o.otherWay2.trim() : "";
  const niceLine = typeof o.niceLine === "string" ? o.niceLine.trim() : undefined;
  if (!correctedSentence || !whyEnglish) return null;
  return {
    correctedSentence,
    whyEnglish,
    otherWay1: otherWay1 || "遅れてすみません。",
    otherWay2: otherWay2 || "お待たせしてすみませんでした。",
    niceLine,
  };
}

/** API 未設定時などの最低限のフォールバック */
export function fallbackFtueCoachPayload(userSentence: string): FtueCoachPayload {
  const hasJp = /[ぁ-んァ-ン一-龯]/.test(userSentence);
  const corrected = hasJp
    ? "すみません、少し遅れてしまいました。"
    : "すみません、少し遅れてしまいました。";
  return {
    niceLine: "Nice 👍",
    correctedSentence: corrected,
    whyEnglish:
      "Apologies often pair すみません with a short, clear reason. 〜てしまいました softens the impact and sounds more natural than a bare past tense.",
    otherWay1: "遅れてすみません。",
    otherWay2: "お待たせしてすみませんでした。",
  };
}

/** 通常チャットの構造化 API 失敗時（遅刻フレーズに縛らない） */
export function fallbackStructuredCoachPayload(userSentence: string): FtueCoachPayload {
  const u = userSentence.trim();
  const clip = u.length > 200 ? `${u.slice(0, 200)}…` : u || "…";
  return {
    niceLine: "Nice 👍",
    correctedSentence: clip,
    whyEnglish:
      "We could not finish this coaching turn. Please try again in a moment — your line is still worth polishing.",
    otherWay1: "もう一度、短く言い直してみてください。",
    otherWay2: "語尾や敬語のレベルを少し変えてみるのもおすすめです。",
  };
}
