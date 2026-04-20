"use client";

type Props = {
  value: string;
  onChange: (q: string) => void;
};

export default function VocabularySearchBar({ value, onChange }: Props) {
  return (
    <label className="block">
      <span className="sr-only">Search vocabulary</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search term, meaning, or tags…"
        className="w-full rounded-xl border border-slate-700/90 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-wa-ruri/40 focus:border-wa-ruri/50 focus:ring-2"
      />
    </label>
  );
}
