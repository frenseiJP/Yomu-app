export type FtuePracticeMode = "natural" | "daily" | "free";

export interface FtuePersisted {
  pickerDone: boolean;
  firstLearningCompleted: boolean;
}

export interface FtueCoachPayload {
  correctedSentence: string;
  whyEnglish: string;
  otherWay1: string;
  otherWay2: string;
  niceLine?: string;
}
