"use client";

import { useEffect, useState } from "react";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import type { Lang } from "@/src/utils/i18n/types";

/** Client hook for pages outside LanguageProvider sync (footer, legal shells). */
export function useAppLang(): Lang {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(getLangClient());
    const onLangChanged = (event: Event) => {
      const custom = event as CustomEvent<{ lang?: Lang }>;
      setLang(custom.detail?.lang ?? getLangClient());
    };
    const onVisibility = () => setLang(getLangClient());
    window.addEventListener("yomu:lang-changed", onLangChanged);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("yomu:lang-changed", onLangChanged);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return lang;
}
