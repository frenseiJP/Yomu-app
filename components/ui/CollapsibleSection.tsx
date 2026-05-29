"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  badge?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "accent";
};

export default function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = false,
  badge,
  children,
  className = "",
  tone = "default",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const shell =
    tone === "accent"
      ? "border-wa-ruri/30 bg-slate-950/70"
      : tone === "muted"
        ? "border-slate-800/50 bg-slate-950/40"
        : "border-slate-800/70 bg-slate-950/80";

  return (
    <section className={`rounded-2xl border ${shell} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] font-semibold text-slate-100">{title}</p>
            {badge ? (
              <span className="rounded-full bg-wa-ruri/20 px-2 py-0.5 text-[10px] font-medium text-sky-200">
                {badge}
              </span>
            ) : null}
          </div>
          {subtitle ? <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">{subtitle}</p> : null}
        </div>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? <div className="border-t border-slate-800/60 px-4 pb-4 pt-3">{children}</div> : null}
    </section>
  );
}
