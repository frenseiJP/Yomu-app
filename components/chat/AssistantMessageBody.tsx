"use client";

import type { ReactNode } from "react";
import { buildReplySections, chunkProse, type ReplySection } from "@/lib/chat/replySections";
import type { FtueCoachPayload } from "@/lib/ftue/types";

type PhrasePair = [string, string, string?];

type Props = {
  text: string;
  payload?: FtueCoachPayload | null;
  renderInline: (line: string) => ReactNode;
};

function SectionLabel({ children, accent }: { children: string; accent?: boolean }) {
  if (!children) return null;
  return (
    <p
      className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
        accent ? "text-sky-300/90" : "text-slate-500"
      }`}
    >
      {children}
    </p>
  );
}

function LabelSection({
  label,
  body,
  hideLabel,
  renderInline,
}: {
  label: string;
  body: string;
  hideLabel?: boolean;
  renderInline: (line: string) => ReactNode;
}) {
  if (hideLabel || !label) {
    return (
      <section>
        <BodyBlock>{renderInline(body)}</BodyBlock>
      </section>
    );
  }
  const isWhy = label === "Why" && body.length > 160;
  if (!isWhy) {
    return (
      <section>
        <SectionLabel accent={label === "Better"}>{label}</SectionLabel>
        <BodyBlock>{renderInline(body)}</BodyBlock>
      </section>
    );
  }
  const preview = body.split(/(?<=[.!?。])\s+/).slice(0, 1).join(" ").trim() || body.slice(0, 120);
  return (
    <section>
      <SectionLabel>{hideLabel ? "" : label}</SectionLabel>
      <BodyBlock>{renderInline(preview)}{body.length > preview.length ? "…" : ""}</BodyBlock>
      <details className="mt-1 rounded-lg border border-slate-800/50 bg-slate-900/30 px-2 py-1.5">
        <summary className="cursor-pointer text-[11px] font-medium text-slate-400">Read full explanation</summary>
        <div className="mt-2">
          <BodyBlock>{renderInline(body)}</BodyBlock>
        </div>
      </details>
    </section>
  );
}

function BodyBlock({ children }: { children: ReactNode }) {
  return (
    <div className="mt-1.5 text-[15px] leading-[1.55] tracking-[0.01em] text-slate-100">
      {children}
    </div>
  );
}

function renderSections(sections: ReplySection[], renderInline: (line: string) => ReactNode) {
  return (
    <div className="flex flex-col gap-4">
      {sections.map((s, i) => {
        if (s.kind === "praise") {
          return (
            <p key={i} className="text-[15px] font-medium leading-snug text-emerald-100/95">
              {renderInline(s.text)}
            </p>
          );
        }
        if (s.kind === "label") {
          return (
            <LabelSection
              key={i}
              label={s.label}
              body={s.body}
              hideLabel={s.hideLabel}
              renderInline={renderInline}
            />
          );
        }
        if (s.kind === "bullets") {
          return (
            <section key={i}>
              <SectionLabel>{s.label}</SectionLabel>
              <ul className="mt-2 space-y-2.5">
                {s.items.map((item, j) => (
                  <li key={j} className="flex gap-2 text-[15px] leading-[1.5] text-slate-100">
                    <span className="shrink-0 text-slate-500">・</span>
                    <span className="min-w-0 flex-1">{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }
        if (s.kind === "paragraphs") {
          return (
            <div key={i} className="space-y-3">
              {s.blocks.map((block, j) => (
                <BodyBlock key={j}>{renderInline(block)}</BodyBlock>
              ))}
            </div>
          );
        }
        if (s.kind === "cta") {
          return (
            <p key={i} className="pt-1 text-[13px] font-medium text-slate-400">
              {s.text}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

/** Parse legacy plain-text coach messages still in history. */
function legacySectionsFromText(text: string): ReplySection[] | null {
  const t = text.trim();
  if (!t) return null;

  const hasCorrection =
    /Corrected version:|What to adjust:|Alternative ways:/i.test(t) ||
    /Better:|Why:|Other ways:/i.test(t);

  if (!hasCorrection) {
    const blocks = chunkProse(t.replace(/\n{3,}/g, "\n\n"), 2);
    return blocks.length ? [{ kind: "paragraphs", blocks }] : null;
  }

  const lines = t.split("\n").map((l) => l.trimEnd());
  const sections: ReplySection[] = [];
  let i = 0;

  if (lines[0] && !/^Better:|What you wrote:/i.test(lines[0])) {
    sections.push({ kind: "praise", text: lines[0] });
    i = 1;
  }

  const pullBlock = (labelRe: RegExp, outLabel: string) => {
    while (i < lines.length) {
      const line = lines[i] ?? "";
      if (labelRe.test(line)) {
        i++;
        const body: string[] = [];
        while (i < lines.length && lines[i] && !/^[A-Za-z].+:$/.test(lines[i]!) && lines[i] !== "Try again 👇") {
          body.push(lines[i]!.replace(/^[・→]\s*/, "").trim());
          i++;
        }
        if (body.length) {
          sections.push({ kind: "label", label: outLabel, body: body.join("\n") });
        }
        return;
      }
      i++;
    }
  };

  pullBlock(/What you wrote:|You wrote:/i, "You wrote");
  pullBlock(/Corrected version:|Better:/i, "Better");
  pullBlock(/What to adjust:|Why:/i, "Why");

  const otherIdx = lines.findIndex((l) => /Alternative ways:|Other ways:/i.test(l));
  if (otherIdx >= 0) {
    i = otherIdx + 1;
    const items: string[] = [];
    while (i < lines.length && lines[i] && !/^Try again/i.test(lines[i]!)) {
      const item = lines[i]!.replace(/^[・→]\s*/, "").trim();
      if (item) items.push(item);
      i++;
    }
    if (items.length) {
      sections.push({ kind: "bullets", label: "Other ways", items });
    }
  }

  if (lines.some((l) => /Try again/i.test(l))) {
    sections.push({ kind: "cta", text: "Try again 👇" });
  }

  return sections.length ? sections : null;
}

export default function AssistantMessageBody({ text, payload, renderInline }: Props) {
  const sections = payload
    ? buildReplySections(payload)
    : legacySectionsFromText(text);

  if (sections?.length) {
    return renderSections(sections, renderInline);
  }

  const blocks = chunkProse(text, 2);
  if (blocks.length > 1) {
    return renderSections([{ kind: "paragraphs", blocks }], renderInline);
  }

  return <BodyBlock>{renderInline(text)}</BodyBlock>;
}
