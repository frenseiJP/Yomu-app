"use client";

type TutorialHintCardProps = {
  title: string;
  body: string;
  cta?: string;
  onCta?: () => void;
  onSkip: () => void;
  skipLabel?: string;
  className?: string;
  /** Pin above bottom nav on mobile */
  docked?: boolean;
};

export default function TutorialHintCard({
  title,
  body,
  cta,
  onCta,
  onSkip,
  skipLabel = "Skip",
  className = "",
  docked = true,
}: TutorialHintCardProps) {
  return (
    <div
      className={`pointer-events-auto z-[275] mx-auto w-[min(100%,24rem)] rounded-2xl border border-wa-ruri/40 bg-slate-950/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-md ${
        docked ? "fixed left-4 right-4 bottom-[calc(80px+env(safe-area-inset-bottom,0px))] sm:left-auto sm:right-6 sm:bottom-24" : ""
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-wa-ruri/90">
        Tutorial
      </p>
      <h3 className="mt-1 font-wa-serif text-base font-semibold text-slate-50">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{body}</p>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onSkip}
          className="min-h-[40px] rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
        >
          {skipLabel}
        </button>
        {cta && onCta ? (
          <button
            type="button"
            onClick={onCta}
            className="min-h-[44px] flex-1 rounded-xl bg-wa-ruri px-4 py-2 text-sm font-semibold text-white hover:bg-wa-ruri/90"
          >
            {cta}
          </button>
        ) : null}
      </div>
    </div>
  );
}
