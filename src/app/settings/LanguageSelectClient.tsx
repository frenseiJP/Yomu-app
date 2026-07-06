"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage, type Language } from "@/app/contexts/LanguageContext";
import type { Lang } from "@/src/utils/i18n/types";
import { mkt } from "@/lib/ui/appTheme";

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

  useEffect(() => {
    setSelected(currentDisplayLang);
  }, [currentDisplayLang]);

  const languages = useMemo(
    () =>
      [
        ["en", "English"],
        ["ja", "日本語"],
        ["ko", "한국어"],
        ["zh", "中文"],
      ] as const,
    [],
  );

  return (
    <form action={saveAction} className="space-y-3">
      <div className="space-y-1.5">
        <p className={`text-[11px] font-medium ${mkt.faint}`}>{displayLanguageLabel}</p>
        <select
          name="lang"
          value={selected}
          onChange={(e) => {
            const next = e.target.value as Lang;
            setSelected(next);
            setLanguage(next as Language);
          }}
          className={mkt.select}
        >
          {languages.map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className={mkt.ctaFull}>
        {saveLanguageButtonLabel}
      </button>
    </form>
  );
}
