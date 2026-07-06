"use client";

import type { ReactNode } from "react";
import { buildReplySections, chunkProse, type ReplySection } from "@/lib/chat/replySections";
import { getReplySectionLabels, type ReplySectionLabels } from "@/lib/i18n/chatActionsCopy";
import type { Lang } from "@/src/utils/i18n/types";
import type { FtueCoachPayload } from "@/lib/ftue/types";

type PhrasePair = [string, string, string?];

type Theme = "light" | "dark";

type Props = {
  text: string;
  payload?: FtueCoachPayload | null;
  lang?: Lang;
  theme?: Theme;
  renderInline: (line: string) => ReactNode;
};

function useBodyStyles(theme: Theme) {
  const light = theme === "light";
  return {
    body: light ? "text-slate-800" : "text-slate-100",
    label: light ? "text-slate-500" : "text-slate-500",
    labelAccent: light ? "text-blue-600" : "text-sky-300/90",
    praise: light ? "text-emerald-700" : "text-emerald-100/95",
    cta: light ? "text-slate-600" : "text-slate-400",
    details: light
      ? "border-slate-200 bg-white"
      : "border-slate-800/50 bg-slate-900/30",
    detailsSummary: light ? "text-slate-600" : "text-slate-400",
    bulletMarker: light ? "text-slate-400" : "text-slate-500",
  };
}

function SectionLabel({
  children,
  accent,
  className,
}: {
  children: string;
  accent?: boolean;
  className: string;
}) {
  if (!children) return null;
  return (
    <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${className}`}>
      {children}
    </p>
  );
}

function LabelSection({
  label,
  body,
  hideLabel,
  readFullLabel,
  renderInline,
  styles,
}: {
  label: string;
  body: string;
  hideLabel?: boolean;
  readFullLabel: string;
  renderInline: (line: string) => ReactNode;
  styles: ReturnType<typeof useBodyStyles>;
}) {
  if (hideLabel || !label) {
    return (
      <section>
        <BodyBlock className={styles.body}>{renderInline(body)}</BodyBlock>
      </section>
    );
  }
  const isWhy = label === "Why" && body.length > 160;
  if (!isWhy) {
    return (
      <section>
        <SectionLabel accent={label === "Better"} className={label === "Better" ? styles.labelAccent : styles.label}>
          {label}
        </SectionLabel>
        <BodyBlock className={styles.body}>{renderInline(body)}</BodyBlock>
      </section>
    );
  }
  const preview = body.split(/(?<=[.!?。])\s+/).slice(0, 1).join(" ").trim() || body.slice(0, 120);
  return (
    <section>
      <SectionLabel className={styles.label}>{hideLabel ? "" : label}</SectionLabel>
      <BodyBlock className={styles.body}>
        {renderInline(preview)}
        {body.length > preview.length ? "…" : ""}
      </BodyBlock>
      <details className={`mt-1 rounded-lg border px-2 py-1.5 ${styles.details}`}>
        <summary className={`cursor-pointer text-[11px] font-medium ${styles.detailsSummary}`}>
          {readFullLabel}
        </summary>
        <div className="mt-2">
          <BodyBlock className={styles.body}>{renderInline(body)}</BodyBlock>
        </div>
      </details>
    </section>
  );
}

function BodyBlock({ children, className }: { children: ReactNode; className: string }) {
  return <div className={`mt-1.5 text-[15px] leading-[1.55] tracking-[0.01em] ${className}`}>{children}</div>;
}

function renderSections(
  sections: ReplySection[],
  labels: ReplySectionLabels,
  renderInline: (line: string) => ReactNode,
  styles: ReturnType<typeof useBodyStyles>,
) {
  return (
    <div className="flex flex-col gap-4">
      {sections.map((s, i) => {
        if (s.kind === "praise") {
          return (
            <p key={i} className={`text-[15px] font-medium leading-snug ${styles.praise}`}>
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
              readFullLabel={labels.readFullExplanation}
              renderInline={renderInline}
              styles={styles}
            />
          );
        }
        if (s.kind === "bullets") {
          return (
            <section key={i}>
              <SectionLabel className={styles.label}>{s.label}</SectionLabel>
              <ul className="mt-2 space-y-2.5">
                {s.items.map((item, j) => (
                  <li key={j} className={`flex gap-2 text-[15px] leading-[1.5] ${styles.body}`}>
                    <span className={`shrink-0 ${styles.bulletMarker}`}>・</span>
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
                <BodyBlock key={j} className={styles.body}>
                  {renderInline(block)}
                </BodyBlock>
              ))}
            </div>
          );
        }
        if (s.kind === "cta") {
          return (
            <p key={i} className={`pt-1 text-[13px] font-medium ${styles.cta}`}>
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
function legacySectionsFromText(text: string, labels: ReplySectionLabels): ReplySection[] | null {
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

  pullBlock(/What you wrote:|You wrote:/i, labels.youWrote);
  pullBlock(/Corrected version:|Better:/i, labels.better);
  pullBlock(/What to adjust:|Why:/i, labels.why);

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
      sections.push({ kind: "bullets", label: labels.otherWays, items });
    }
  }

  if (lines.some((l) => /Try again/i.test(l))) {
    sections.push({ kind: "cta", text: labels.tryAgain });
  }

  return sections.length ? sections : null;
}

export default function AssistantMessageBody({
  text,
  payload,
  lang = "en",
  theme = "dark",
  renderInline,
}: Props) {
  const labels = getReplySectionLabels(lang);
  const styles = useBodyStyles(theme);
  const sections = payload
    ? buildReplySections(payload, undefined, labels)
    : legacySectionsFromText(text, labels);

  if (sections?.length) {
    return renderSections(sections, labels, renderInline, styles);
  }

  const blocks = chunkProse(text, 2);
  if (blocks.length > 1) {
    return renderSections([{ kind: "paragraphs", blocks }], labels, renderInline, styles);
  }

  return <BodyBlock className={styles.body}>{renderInline(text)}</BodyBlock>;
}
