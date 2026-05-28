export type MistakeCategory =
  | "particle"
  | "politeness"
  | "tense"
  | "word_choice"
  | "word_order"
  | "register"
  | "other";

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

/**
 * Lightweight heuristic classifier for correction notes.
 * Keeps categories stable enough for learner-facing trends.
 */
export function inferMistakeCategory(input: {
  userSentence?: string;
  correctedSentence?: string;
  note?: string;
}): MistakeCategory {
  const t = `${input.note ?? ""}\n${input.userSentence ?? ""}\n${input.correctedSentence ?? ""}`.toLowerCase();
  if (!t.trim()) return "other";

  if (hasAny(t, [/助詞/, /\bparticle\b/, /\bは\b|\bが\b|\bを\b|\bに\b|\bで\b/, /\bwa\b|\bga\b|\bo\b/])) {
    return "particle";
  }
  if (hasAny(t, [/敬語/, /ていねい/, /\bpolite\b/, /\bcasual\b/, /\bformal\b/])) {
    return "politeness";
  }
  if (hasAny(t, [/時制/, /\btense\b/, /ました/, /ている/, /\bpast\b|\bpresent\b/])) {
    return "tense";
  }
  if (hasAny(t, [/語順/, /\bword order\b/, /\border\b/, /\bposition\b/])) {
    return "word_order";
  }
  if (hasAny(t, [/語彙/, /\bword choice\b/, /\bnatural\b/, /言い換え/])) {
    return "word_choice";
  }
  if (hasAny(t, [/場面/, /\bregister\b/, /\bcontext\b/, /\bsituation\b/])) {
    return "register";
  }
  return "other";
}

export function mistakeCategoryLabel(cat?: MistakeCategory): string | null {
  if (!cat || cat === "other") return null;
  const map: Record<Exclude<MistakeCategory, "other">, string> = {
    particle: "Particle",
    politeness: "Politeness",
    tense: "Tense",
    word_choice: "Word choice",
    word_order: "Word order",
    register: "Register",
  };
  return map[cat];
}
