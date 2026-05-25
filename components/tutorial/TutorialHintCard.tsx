"use client";

type TutorialHintCardProps = {
  title: string;
  body: string;
  cta?: string;
  onCta?: () => void;
  onSkip: () => void;
  skipLabel?: string;
  className?: string;
  /** bottom = above tab bar; top-right = out of the way during chat */
  placement?: "bottom" | "top-right";
};

const PLACEMENT_CLASS: Record<NonNullable<TutorialHintCardProps["placement"]>, string> = {
  bottom:
    "fixed left-4 right-4 bottom-[calc(80px+env(safe-area-inset-bottom,0px))] sm:left-auto sm:right-6 sm:bottom-24",
  "top-right":
    "fixed right-3 top-[max(4.25rem,env(safe-area-inset-top,0px)+3.25rem)] left-auto bottom-auto w-[min(17rem,calc(100vw-1.5rem))] sm:right-4 sm:top-[4.75rem]",
};

export default function TutorialHintCard({
  title,
  body,
  cta,
  onCta,
  onSkip,
  skipLabel = "Skip",
  className = "",
  placement = "bottom",
}: TutorialHintCardProps) {
  const compact = placement === "top-right";

  return (
    <div
      className={`pointer-events-auto z-[275] rounded-2xl border border-wa-ruri/40 bg-slate-950/95 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-md ${PLACEMENT_CLASS[placement]} ${
        compact ? "p-3" : "p-4"
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-wa-ruri/90">
        Tutorial
      </p>
      <h3
        className={`font-wa-serif font-semibold text-slate-50 ${compact ? "mt-0.5 text-sm leading-snug" : "mt-1 text-base"}`}
      >
        {title}
      </h3>
      <p className={`leading-relaxed text-slate-300 ${compact ? "mt-1 text-xs" : "mt-1.5 text-sm"}`}>
        {body}
      </p>
      <div className={`flex items-center gap-2 ${compact ? "mt-2.5" : "mt-4"}`}>
        <button
          type="button"
          onClick={onSkip}
          className={`rounded-xl px-3 py-2 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 ${compact ? "min-h-[36px] text-xs" : "min-h-[40px] text-sm"}`}
        >
          {skipLabel}
        </button>
        {cta && onCta ? (
          <button
            type="button"
            onClick={onCta}
            className={`flex-1 rounded-xl bg-wa-ruri font-semibold text-white hover:bg-wa-ruri/90 ${compact ? "min-h-[40px] px-3 py-1.5 text-xs" : "min-h-[44px] px-4 py-2 text-sm"}`}
          >
            {cta}
          </button>
        ) : null}
      </div>
    </div>
  );
}
