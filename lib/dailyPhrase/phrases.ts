export type DailyUsefulPhrase = {
  phrase: string;
  romaji: string;
  meaning: string;
  whenToUse: string;
  practicePromptEn: string;
};

/** Beginner-friendly, daily-life phrases (rotated by date). */
export const DAILY_USEFUL_PHRASES: DailyUsefulPhrase[] = [
  {
    phrase: "おつかれさま",
    romaji: "otsukaresama",
    meaning: "Good job / thanks for your hard work",
    whenToUse: "After work, school, or when someone finishes a task",
    practicePromptEn: "How do I say “good job after work” naturally in Japanese?",
  },
  {
    phrase: "いただきます",
    romaji: "itadakimasu",
    meaning: "Said before eating (thanks for the food)",
    whenToUse: "Before a meal, alone or with others",
    practicePromptEn: "When do Japanese people say itadakimasu?",
  },
  {
    phrase: "お先に失礼します",
    romaji: "osaki ni shitsurei shimasu",
    meaning: "I'm leaving before you (polite)",
    whenToUse: "Leaving the office while others are still working",
    practicePromptEn: "How do I leave the office politely in Japanese?",
  },
  {
    phrase: "大丈夫です",
    romaji: "daijoubu desu",
    meaning: "I'm fine / no problem",
    whenToUse: "When someone offers help or asks if you're okay",
    practicePromptEn: "How do I say “I'm fine, no worries” in Japanese?",
  },
  {
    phrase: "ちょっと待ってください",
    romaji: "chotto matte kudasai",
    meaning: "Please wait a moment",
    whenToUse: "Shop, phone, or when you need a second",
    practicePromptEn: "What's a natural way to ask someone to wait in Japanese?",
  },
  {
    phrase: "よろしくお願いします",
    romaji: "yoroshiku onegaishimasu",
    meaning: "Nice to work with you / please treat me well",
    whenToUse: "Introductions, first day, or starting a project",
    practicePromptEn: "What does yoroshiku onegaishimasu really mean?",
  },
  {
    phrase: "すみません",
    romaji: "sumimasen",
    meaning: "Sorry / excuse me",
    whenToUse: "Apologizing lightly or getting attention in a store",
    practicePromptEn: "When should I use sumimasen vs gomennasai?",
  },
  {
    phrase: "お願いします",
    romaji: "onegaishimasu",
    meaning: "Please (polite request)",
    whenToUse: "Ordering, asking for a favor, or “this one please”",
    practicePromptEn: "How do I order politely with onegaishimasu?",
  },
  {
    phrase: "行ってきます",
    romaji: "itte kimasu",
    meaning: "I'm heading out (and coming back)",
    whenToUse: "Leaving home or the office to someone staying",
    practicePromptEn: "What do I say when leaving home in Japanese?",
  },
  {
    phrase: "ただいま",
    romaji: "tadaima",
    meaning: "I'm home",
    whenToUse: "When you arrive back home",
    practicePromptEn: "What do people say when they get home?",
  },
  {
    phrase: "お疲れ様でした",
    romaji: "otsukaresama deshita",
    meaning: "Good work today (past / finished)",
    whenToUse: "After a meeting or event has ended",
    practicePromptEn: "How is otsukaresama deshita different from otsukaresama?",
  },
  {
    phrase: "かしこまりました",
    romaji: "kashikomarimashita",
    meaning: "Certainly / understood (service tone)",
    whenToUse: "Shops, hotels, or customer-facing replies",
    practicePromptEn: "When do staff say kashikomarimashita?",
  },
  {
    phrase: "少々お待ちください",
    romaji: "shoushou omachi kudasai",
    meaning: "Please wait a moment (polite)",
    whenToUse: "Phone or service counter",
    practicePromptEn: "What's a polite phrase for please wait on the phone?",
  },
  {
    phrase: "気をつけて",
    romaji: "ki wo tsukete",
    meaning: "Take care",
    whenToUse: "Saying goodbye to a friend",
    practicePromptEn: "How do I say take care naturally in Japanese?",
  },
];
