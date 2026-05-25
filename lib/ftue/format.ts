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

export function fallbackStructuredCoachPayload(userSentence: string): FtueCoachPayload {
  const mode = inferReplyModeHint(userSentence);
  const u = userSentence.trim();

  if (mode === "explain" || mode === "reading") {
    return {
      replyMode: mode,
      answer:
        mode === "reading"
          ? "Tell me which word or phrase you want to read. I'll give you Japanese (romaji) — English meaning plus pronunciation tips."
          : "I had trouble finishing that answer — please try sending your question again.",
      correctedSentence: "",
      whyEnglish: "",
      otherWay1: "",
      otherWay2: "",
    };
  }

  const clip = u.length > 200 ? `${u.slice(0, 200)}…` : u || "…";
  return {
    replyMode: "correction",
    niceLine: "Nice effort 👍",
    studentSentence: clip,
    correctedSentence: clip,
    correctedEnglish: "Could not finish this turn — please try again.",
    whyEnglish: "Please try again in a moment. Your line is still worth polishing.",
    otherWay1: "もう一度、短く言い直してみてください。",
    otherWay1Romaji: "mou ichido, mijikaku iinaoshite mite kudasai",
    otherWay1English: "Try saying it again, a bit shorter.",
    otherWay2: "語尾を少し変えてみるのもおすすめです。",
    otherWay2Romaji: "gobi wo sukoshi kaete miru no mo osusume desu",
    otherWay2English: "Try adjusting the ending politeness.",
  };
}

export function fallbackFtueCoachPayload(userSentence: string): FtueCoachPayload {
  const mode = inferReplyModeHint(userSentence);
  if (mode !== "correction") {
    return fallbackStructuredCoachPayload(userSentence);
  }

  const corrected = "すみません、少し遅れてしまいました。";
  return {
    replyMode: "correction",
    niceLine: "Nice 👍",
    studentSentence: userSentence.trim() || corrected,
    studentRomaji: "sumimasen, sukoshi okurete shimaimashita",
    correctedSentence: corrected,
    correctedRomaji: "sumimasen, sukoshi okurete shimaimashita",
    correctedEnglish: "Sorry, I ended up running a little late.",
    whyEnglish:
      "Pair すみません with a short reason. 〜てしまいました sounds softer than a bare past tense.",
    otherWay1: "遅れてすみません。",
    otherWay1Romaji: "okurete sumimasen",
    otherWay1English: "Sorry for being late.",
    otherWay2: "お待たせしてすみませんでした。",
    otherWay2Romaji: "omachikite sumimasen deshita",
    otherWay2English: "Sorry to have kept you waiting.",
  };
}
