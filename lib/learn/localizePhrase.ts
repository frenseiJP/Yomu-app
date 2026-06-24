import type { LearnPhrase } from "@/lib/learn/types";
import type { Lang } from "@/src/utils/i18n/types";

import { PHRASE_LOCALES } from "@/lib/learn/phraseLocales";

export type LocalizedPhrase = LearnPhrase & {
  meaning: string;
  examplesLocalized: Array<{ translation: string; context: string }>;
};

export function localizePhrase(phrase: LearnPhrase, lang: Lang): LocalizedPhrase {
  const overlay = lang === "en" ? undefined : PHRASE_LOCALES[phrase.slug]?.[lang];

  return {
    ...phrase,
    title: overlay?.title ?? phrase.title,
    meaning: overlay?.meaning ?? phrase.meaningEn,
    nuance: overlay?.nuance ?? phrase.nuance,
    culturalNote: overlay?.culturalNote ?? phrase.culturalNote,
    commonMistakes: overlay?.commonMistakes ?? phrase.commonMistakes,
    tryPrompt: overlay?.tryPrompt ?? phrase.tryPrompt,
    examplesLocalized: phrase.examples.map((example, index) => ({
      translation: overlay?.examples?.[index]?.translation ?? example.en,
      context: overlay?.examples?.[index]?.context ?? example.context,
    })),
  };
}
