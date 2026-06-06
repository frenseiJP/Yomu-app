export type LearnExample = {
  ja: string;
  en: string;
  context: string;
};

export type LearnPhrase = {
  slug: string;
  topic: string;
  reading: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  meaningEn: string;
  level: string;
  nuance: string;
  culturalNote: string;
  examples: LearnExample[];
  commonMistakes: string[];
  relatedSlugs: string[];
  tryPrompt: string;
};
