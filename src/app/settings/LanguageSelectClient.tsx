"use client";

import { useMemo, useState } from "react";
import { useLanguage, type Language } from "@/app/contexts/LanguageContext";
import type { Lang } from "@/src/utils/i18n/types";

type Props = {
  currentDisplayLang: Lang;
  displayLanguageLabel: string;
  saveLanguageButtonLabel: string;
  saveAction: (formData: FormData) => Promise<void> | void;
};

export default function LanguageSelectClient({
  currentDisplayLang,
  displayLanguageLabel,
  saveLanguageButtonLabel,
  saveAction,
}: Props) {
  const { setLanguage } = useLanguage();
  const [selected, setSelected] = useState<Lang>(currentDisplayLang);

  /** 各言語の自語名（表示言語に依らず統一） */
  const languages = useMemo(
    () =>
      [
        ["ja", "日本語"],
        ["en", "English"],
        ["ko", "한국어"],
        ["zh", "中文"],
      ] as const,
    [],
  );

  return (
    <form action={saveAction} className="space-y-3">
      <div className="space-y-1.5">
        <p className="text-[11px] font-medium text-slate-400">{displayLanguageLabel}</p>
        <select
          name="lang"
          value={selected}
          onChange={(e) => {
            const next = e.target.value as Lang;
            setSelected(next);
            setLanguage(next as Language);
          }}
          className="w-full appearance-none rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-[13px] text-slate-100 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
        >
          {languages.map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="btn-wa-hover btn-wa-hover-ruri inline-flex w-full items-center justify-center rounded-2xl bg-pink-500/90 px-4 py-3 text-[12px] font-medium text-white shadow-[0_18px_60px_rgba(236,72,153,0.25)] transition hover:bg-pink-400"
      >
        {saveLanguageButtonLabel}
      </button>
    </form>
  );
}

