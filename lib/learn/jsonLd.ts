import type { LearnPhrase } from "@/lib/learn/types";

const BASE = "https://frensei.jp";

export function phraseArticleJsonLd(phrase: LearnPhrase): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: phrase.title,
    description: phrase.seoDescription,
    inLanguage: ["en", "ja"],
    url: `${BASE}/learn/${phrase.slug}`,
    author: {
      "@type": "Organization",
      name: "Frensei",
      url: BASE,
    },
    publisher: {
      "@type": "Organization",
      name: "Frensei",
      url: BASE,
    },
    about: {
      "@type": "DefinedTerm",
      name: phrase.topic,
      description: phrase.meaningEn,
    },
  };
}

export function phraseFaqJsonLd(phrase: LearnPhrase): object {
  const items = [
    {
      question: `What does ${phrase.topic} mean?`,
      answer: phrase.meaningEn,
    },
    {
      question: `When do Japanese people use ${phrase.topic}?`,
      answer: phrase.nuance,
    },
  ];
  if (phrase.commonMistakes[0]) {
    items.push({
      question: `Common mistakes with ${phrase.topic}`,
      answer: phrase.commonMistakes.join(" "),
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
