import { buildReplySections, sectionsToPlainText } from "@/lib/chat/replySections";
import type { SenseiReplyMode } from "@/lib/chat/replyMode";
import { inferReplyModeHint } from "@/lib/chat/replyMode";
import type { FtueCoachPayload } from "@/lib/ftue/types";

function pickStr(o: Record<string, unknown>, key: string): string | undefined {
  const v = o[key];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function normalizeReplyMode(raw: unknown, fallback: SenseiReplyMode): SenseiReplyMode {
  if (raw === "explain" || raw === "reading" || raw === "correction") return raw;
  return fallback;
}

export function buildSenseiChatMessage(p: FtueCoachPayload, studentLine?: string): string {
  return sectionsToPlainText(buildReplySections(p, studentLine));
}

export { buildReplySections } from "@/lib/chat/replySections";

/** @deprecated Use buildSenseiChatMessage */
export const buildFtueCoachMessage = buildSenseiChatMessage;

export function parseSenseiChatPayload(
  raw: unknown,
  userText = "",
): FtueCoachPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const hint = inferReplyModeHint(userText);
  const replyMode = normalizeReplyMode(o.replyMode, hint);
  const answer = pickStr(o, "answer");

  if (replyMode === "explain" || replyMode === "reading") {
    const body = answer ?? pickStr(o, "whyEnglish") ?? pickStr(o, "niceLine");
    if (!body) return null;
    return {
      replyMode,
      answer: body,
      correctedSentence: "",
      whyEnglish: body,
      otherWay1: "",
      otherWay2: "",
      niceLine: pickStr(o, "niceLine"),
    };
  }

  const correctedSentence = typeof o.correctedSentence === "string" ? o.correctedSentence.trim() : "";
  const whyEnglish = typeof o.whyEnglish === "string" ? o.whyEnglish.trim() : "";
  const otherWay1 = typeof o.otherWay1 === "string" ? o.otherWay1.trim() : "";
  const otherWay2 = typeof o.otherWay2 === "string" ? o.otherWay2.trim() : "";
  if (!correctedSentence || !whyEnglish) return null;

  return {
    replyMode: "correction",
    correctedSentence,
    correctedRomaji: pickStr(o, "correctedRomaji"),
    correctedEnglish: pickStr(o, "correctedEnglish"),
    whyEnglish,
    otherWay1: otherWay1 || "遅れてすみません。",
    otherWay1Romaji: pickStr(o, "otherWay1Romaji"),
    otherWay1English: pickStr(o, "otherWay1English"),
    otherWay2: otherWay2 || "お待たせしてすみませんでした。",
    otherWay2Romaji: pickStr(o, "otherWay2Romaji"),
    otherWay2English: pickStr(o, "otherWay2English"),
    niceLine: pickStr(o, "niceLine"),
    studentSentence: pickStr(o, "studentSentence"),
    studentRomaji: pickStr(o, "studentRomaji"),
  };
}

export const parseFtueCoachPayload = parseSenseiChatPayload;

function clipUserLine(text: string, max = 120): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return "…";
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

export function fallbackStructuredCoachPayload(userSentence: string): FtueCoachPayload {
  const mode = inferReplyModeHint(userSentence);
  const u = clipUserLine(userSentence, 200);

  if (mode === "explain" || mode === "reading") {
    return {
      replyMode: mode,
      answer:
        mode === "reading"
          ? `I couldn't finish the reading help for "${clipUserLine(userSentence, 80)}". Please ask again with the exact word or phrase you want pronounced.`
          : `I couldn't complete that answer about "${clipUserLine(userSentence, 80)}". Please try asking one part at a time, or rephrase your question.`,
      correctedSentence: "",
      whyEnglish: "",
      otherWay1: "",
      otherWay2: "",
    };
  }

  return {
    replyMode: "correction",
    niceLine: "Let me try again 👍",
    studentSentence: u,
    correctedSentence: u,
    correctedEnglish: "I couldn't finish polishing this line — please send it again.",
    whyEnglish: `I lost the thread on: "${clipUserLine(userSentence, 100)}". Send the same Japanese once more and I'll correct it properly.`,
    otherWay1: "もう一度、同じ文を送ってください。",
    otherWay1Romaji: "mou ichido, onaji bun wo okutte kudasai",
    otherWay1English: "Please send the same sentence again.",
    otherWay2: "短く言い直しても大丈夫です。",
    otherWay2Romaji: "mijikaku iinaoshite mo daijoubu desu",
    otherWay2English: "You can also try a shorter version.",
  };
}

export function fallbackFtueCoachPayload(userSentence: string): FtueCoachPayload {
  const mode = inferReplyModeHint(userSentence);
  if (mode !== "correction") {
    return fallbackStructuredCoachPayload(userSentence);
  }

  return fallbackStructuredCoachPayload(userSentence);
}
