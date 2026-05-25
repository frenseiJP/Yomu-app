export type FtuePracticeMode = "natural" | "daily" | "free";

export interface FtuePersisted {
  pickerDone: boolean;
  firstLearningCompleted: boolean;
}

import type { SenseiReplyMode } from "@/lib/chat/replyMode";

export type { SenseiReplyMode };

export interface FtueCoachPayload {
  replyMode: SenseiReplyMode;
  /** explain / reading — full prose answer */
  answer?: string;
  correctedSentence: string;
  correctedRomaji?: string;
  correctedEnglish?: string;
  whyEnglish: string;
  otherWay1: string;
  otherWay1Romaji?: string;
  otherWay1English?: string;
  otherWay2: string;
  otherWay2Romaji?: string;
  otherWay2English?: string;
  niceLine?: string;
  studentSentence?: string;
  studentRomaji?: string;
}
