"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "ja" | "en" | "zh" | "ko";

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
  // 1年保持
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // サーバー（設定保存など）がセットした cookie を最優先。古い localStorage より優先する。
    const cookieLang = readCookie("yomu_lang");
    const cookieFirstLang = readCookie("yomu_first_lang");
    const fromCookie = (cookieLang ?? cookieFirstLang ?? null) as Language | null;
    if (fromCookie && ["ja", "en", "zh", "ko"].includes(fromCookie)) {
      setLanguageState(fromCookie);
      try {
        localStorage.setItem("yomu-language", fromCookie);
      } catch {
        // ignore
      }
      return;
    }

    const local = localStorage.getItem("yomu-language") as Language | null;
    if (local && ["ja", "en", "zh", "ko"].includes(local)) {
      setLanguageState(local);
    }
  }, []);

  // ホーム（プロトタイプ）などが cookie を更新して dispatch したとき、Context も追従する
  useEffect(() => {
    const onLangChanged = (event: Event) => {
      const custom = event as CustomEvent<{ lang?: Language }>;
      const next = custom.detail?.lang;
      if (next && ["ja", "en", "zh", "ko"].includes(next)) {
        setLanguageState(next);
        try {
          localStorage.setItem("yomu-language", next);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("yomu:lang-changed", onLangChanged);
    return () => window.removeEventListener("yomu:lang-changed", onLangChanged);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("yomu-language", lang);
    } catch {
      // ignore
    }

    // 表示言語は yomu_lang のみ更新（first_language はオンボーディング等で別管理）
    writeCookie("yomu_lang", lang);

    window.dispatchEvent(new CustomEvent("yomu:lang-changed", { detail: { lang } }));
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);

