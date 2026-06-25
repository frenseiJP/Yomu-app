"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  EXPLICIT_LANG_COOKIE,
  LANG_POLICY_VERSION,
  htmlLangAttribute,
  resolveLanguage,
} from "@/lib/i18n/resolveLanguage";
import type { Lang } from "@/src/utils/i18n/types";

export type Language = Lang;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const target = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(target));
  if (!found) return null;
  return decodeURIComponent(found.slice(target.length));
}

function writeCookie(name: string, value: string) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function resolveClientLanguage(): Language {
  if (typeof window === "undefined") return "en";
  return resolveLanguage({
    savedPreference: readCookie("yomu_lang"),
    explicitUserChoice: readCookie(EXPLICIT_LANG_COOKIE) === "1",
    policyVersion: readCookie("yomu_lang_rev"),
  });
}

function applyEnglishBaseClient(): void {
  writeCookie("yomu_lang_rev", LANG_POLICY_VERSION);
  writeCookie("yomu_lang", "en");
  clearCookie(EXPLICIT_LANG_COOKIE);
  try {
    localStorage.setItem("yomu-language", "en");
  } catch {
    /* ignore */
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = htmlLangAttribute("en");
  }
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: React.ReactNode;
  initialLang?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLang);

  useEffect(() => {
    const policyOk = readCookie("yomu_lang_rev") === LANG_POLICY_VERSION;
    if (!policyOk) {
      applyEnglishBaseClient();
      setLanguageState("en");
      return;
    }

    const resolved = resolveClientLanguage();
    setLanguageState(resolved);
    if (typeof document !== "undefined") {
      document.documentElement.lang = htmlLangAttribute(resolved);
    }
    try {
      localStorage.setItem("yomu-language", resolved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onLangChanged = (event: Event) => {
      const custom = event as CustomEvent<{ lang?: Language }>;
      const next = custom.detail?.lang;
      if (next && ["ja", "en", "zh", "ko"].includes(next)) {
        setLanguageState(next);
        try {
          localStorage.setItem("yomu-language", next);
        } catch {
          /* ignore */
        }
        if (typeof document !== "undefined") {
          document.documentElement.lang = htmlLangAttribute(next);
        }
      }
    };
    window.addEventListener("yomu:lang-changed", onLangChanged);
    return () => window.removeEventListener("yomu:lang-changed", onLangChanged);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    writeCookie("yomu_lang_rev", LANG_POLICY_VERSION);
    try {
      localStorage.setItem("yomu-language", lang);
    } catch {
      /* ignore */
    }
    writeCookie("yomu_lang", lang);
    writeCookie(EXPLICIT_LANG_COOKIE, "1");
    window.dispatchEvent(new CustomEvent("yomu:lang-changed", { detail: { lang } }));
    if (typeof document !== "undefined") {
      document.documentElement.lang = htmlLangAttribute(lang);
    }
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
