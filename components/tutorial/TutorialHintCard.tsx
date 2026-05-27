"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

type TutorialHintCardProps = {
  title: string;
  body: string;
  cta?: string;
  onCta?: () => void;
  onSkip: () => void;
  skipLabel?: string;
  className?: string;
  /** inline = in chat column above input; floating = fixed overlay */
  variant?: "inline" | "floating";
  placement?: "bottom" | "top-right";
  /** Hide while the on-screen keyboard is open */
  keyboardInset?: number;
  /** Start minimized to a small pill */
  startCollapsed?: boolean;
  /** Auto-minimize after ms (0 = never) */
  autoCollapseAfterMs?: number;
  /** Stable key when step changes (resets collapse timer) */
  stepKey?: string;
};

export default function TutorialHintCard({
  title,
  body,
  cta,
  onCta,
  onSkip,
  skipLabel = "Skip",
  className = "",
  variant = "floating",
  placement = "bottom",
  keyboardInset = 0,
  startCollapsed = false,
  autoCollapseAfterMs = 2800,
  stepKey = "",
}: TutorialHintCardProps) {
  const [collapsed, setCollapsed] = useState(startCollapsed);

  useEffect(() => {
    setCollapsed(startCollapsed);
  }, [stepKey, startCollapsed, title]);

  useEffect(() => {
    if (autoCollapseAfterMs <= 0) return;
    const t = window.setTimeout(() => setCollapsed(true), autoCollapseAfterMs);
    return () => window.clearTimeout(t);
  }, [stepKey, autoCollapseAfterMs, title]);

  if (keyboardInset > 48) return null;

  const pill = (
    <button
      type="button"
      onClick={() => setCollapsed(false)}
      className={`flex w-full items-center justify-center gap-1.5 rounded-full border border-wa-ruri/45 bg-slate-950/95 px-4 py-2 text-[11px] font-medium text-slate-200 shadow-lg backdrop-blur-md ${
        variant === "floating"
          ? "fixed left-1/2 z-[275] max-w-[min(92vw,20rem)] -translate-x-1/2 bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))]"
          : ""
      }`}
      aria-label={`${title} — show guide`}
    >
      <span className="truncate">{title}</span>
      <ChevronUp className="h-3.5 w-3.5 shrink-0 text-wa-ruri" aria-hidden />
    </button>
  );

  if (collapsed) {
    return variant === "inline" ? (
      <div className={className}>{pill}</div>
    ) : (
      pill
    );
  }

  const card = (
    <div
      className={`rounded-2xl border border-wa-ruri/40 bg-slate-950/95 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-md ${
        variant === "inline" ? "p-3" : placement === "top-right" ? "p-3" : "p-4"
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-wa-ruri/90">Guide</p>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] text-slate-500 hover:bg-slate-800/80 hover:text-slate-300"
          aria-label="Minimize"
        >
          −
        </button>
      </div>
      <h3
        className={`font-wa-serif font-semibold text-slate-50 ${
          variant === "inline" ? "mt-0.5 text-sm leading-snug" : "mt-0.5 text-sm leading-snug sm:text-base"
        }`}
      >
        {title}
      </h3>
      <p className={`leading-relaxed text-slate-300 ${variant === "inline" ? "mt-1 text-xs" : "mt-1 text-xs sm:text-sm"}`}>
        {body}
      </p>
      <div className={`flex items-center gap-2 ${variant === "inline" ? "mt-2.5" : "mt-3"}`}>
        <button
          type="button"
          onClick={onSkip}
          className="min-h-[36px] rounded-xl px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
        >
          {skipLabel}
        </button>
        {cta && onCta ? (
          <button
            type="button"
            onClick={() => {
              onCta();
              window.setTimeout(() => setCollapsed(true), 400);
            }}
            className="min-h-[40px] flex-1 rounded-xl bg-wa-ruri px-3 py-2 text-xs font-semibold text-white hover:bg-wa-ruri/90"
          >
            {cta}
          </button>
        ) : null}
      </div>
    </div>
  );

  if (variant === "inline") {
    return card;
  }

  const floatingClass =
    placement === "top-right"
      ? "fixed right-3 top-[max(4.25rem,env(safe-area-inset-top,0px)+3.25rem)] left-auto z-[275] w-[min(17rem,calc(100vw-1.5rem))] sm:right-4 sm:top-[4.75rem]"
      : "fixed left-4 right-4 z-[275] bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:left-auto sm:right-6 sm:bottom-24 sm:max-w-sm";

  return <div className={floatingClass}>{card}</div>;
}
