"use client";

import type { PrototypeUiText } from "@/src/utils/i18n/prototypeCopy";

type Props = {
  value: string;
  onChange: (q: string) => void;
  ui: PrototypeUiText;
};

export default function VocabularySearchBar({ value, onChange, ui }: Props) {
  return (
    <label className="block">
      <span className="sr-only">{ui.vocabLibSearchSr}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={ui.vocabLibSearchPh}
        className="w-full rounded-xl border border-slate-700/90 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-wa-ruri/40 focus:border-wa-ruri/50 focus:ring-2"
      />
    </label>
  );
}
