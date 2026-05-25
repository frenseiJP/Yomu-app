import { formatJaRomajiLine, stripJaWrappers } from "@/lib/chat/japaneseFormat";
import type { FtueCoachPayload } from "@/lib/ftue/types";

export type ReplySection =
  | { kind: "praise"; text: string }
  | { kind: "label"; label: string; body: string; hideLabel?: boolean }
  | { kind: "bullets"; label: string; items: string[] }
  | { kind: "cta"; text: string }
  | { kind: "paragraphs"; blocks: string[] };

/** Split prose into short mobile-friendly blocks (max ~2 sentences each). */
export function chunkProse(text: string, maxSentencesPerBlock = 2): string[] {
  const t = text.trim();
  if (!t) return [];
  const sentences = t.split(/(?<=[.!?。])\s+/).filter((s) => s.trim());
  if (sentences.length === 0) return [t];
  const blocks: string[] = [];
  for (let i = 0; i < sentences.length; i += maxSentencesPerBlock) {
    blocks.push(sentences.slice(i, i + maxSentencesPerBlock).join(" ").trim());
  }
  return blocks;
}

export function buildReplySections(p: FtueCoachPayload, studentLine?: string): ReplySection[] {
  if (p.replyMode === "explain" || p.replyMode === "reading") {
    const answer = (p.answer ?? p.whyEnglish ?? "").trim();
    const sections: ReplySection[] = [];
    if (p.niceLine?.trim()) {
      sections.push({ kind: "praise", text: p.niceLine.trim() });
    }
    const blocks = chunkProse(answer, 2);
    if (blocks.length) {
      sections.push({ kind: "paragraphs", blocks });
    }
    return sections;
  }

  const sections: ReplySection[] = [];
  sections.push({ kind: "praise", text: (p.niceLine ?? "Nice 👍").trim() });

  const student = (p.studentSentence ?? studentLine ?? "").trim();
  if (student) {
    sections.push({
      kind: "label",
      label: "You wrote",
      body: formatJaRomajiLine(stripJaWrappers(student), p.studentRomaji),
    });
  }

  sections.push({
    kind: "label",
    label: "Better",
    body: formatJaRomajiLine(
      stripJaWrappers(p.correctedSentence),
      p.correctedRomaji,
      p.correctedEnglish,
    ),
  });

  const whyChunks = chunkProse(p.whyEnglish.trim(), 2);
  whyChunks.forEach((chunk, i) => {
    sections.push({
      kind: "label",
      label: "Why",
      body: chunk,
      hideLabel: i > 0,
    });
  });

  const bullets: string[] = [];
  const o1 = formatJaRomajiLine(
    stripJaWrappers(p.otherWay1),
    p.otherWay1Romaji,
    p.otherWay1English,
  );
  const o2 = formatJaRomajiLine(
    stripJaWrappers(p.otherWay2),
    p.otherWay2Romaji,
    p.otherWay2English,
  );
  if (o1) bullets.push(o1);
  if (o2) bullets.push(o2);
  if (bullets.length) {
    sections.push({ kind: "bullets", label: "Other ways", items: bullets });
  }

  sections.push({ kind: "cta", text: "Try again 👇" });
  return sections;
}

export function sectionsToPlainText(sections: ReplySection[]): string {
  const lines: string[] = [];
  for (const s of sections) {
    if (s.kind === "praise") {
      lines.push(s.text, "");
    } else if (s.kind === "label") {
      if (!s.hideLabel && s.label) lines.push(`${s.label}:`);
      lines.push(s.body, "");
    } else if (s.kind === "bullets") {
      lines.push(`${s.label}:`);
      lines.push(...s.items.map((i) => `・${i}`), "");
    } else if (s.kind === "paragraphs") {
      lines.push(...s.blocks, "");
    } else if (s.kind === "cta") {
      lines.push(s.text);
    }
  }
  return lines.join("\n").trim();
}
