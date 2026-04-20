"use client";

type Props = {
  total: number;
  reviewCount: number;
};

export default function VocabularyHeader({ total, reviewCount }: Props) {
  return (
    <header className="space-y-1">
      <h1 className="font-wa-serif text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
        Vocabulary
      </h1>
      <p className="text-sm text-slate-400">
        Your personal learning library — not a dictionary. Corrections, phrases, and words you chose to keep.
      </p>
      <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
        <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-slate-300">
          {total} saved
        </span>
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-200/90">
          {reviewCount} to review
        </span>
      </div>
    </header>
  );
}
