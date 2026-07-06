"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import FrenseiAppShell from "../FrenseiAppShell";
import { resolvePostLoginPath } from "@/lib/auth/resolvePostLoginPath";
import { LogOut, BookOpen } from "lucide-react";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";
import { getStoredUiTheme } from "@/src/utils/theme/theme";
import { shellTheme } from "@/lib/ui/shellTheme";

function displayName(email: string | undefined): string {
  if (!email) return "Guest";
  const prefix = email.split("@")[0];
  if (!prefix) return "User";
  return prefix.length > 8 ? `${prefix.slice(0, 8)}…` : prefix;
}

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const [lang, setLang] = useState<Lang>("en");
  const [isLightTheme, setIsLightTheme] = useState(true);
  const th = shellTheme(isLightTheme);

  const supabase = createClient();

  useEffect(() => {
    setLang(getLangClient());
    setIsLightTheme(getStoredUiTheme() === "light");
    const onLangChanged = (event: Event) => {
      const custom = event as CustomEvent<{ lang?: Lang }>;
      const next = custom.detail?.lang;
      setLang(next ?? getLangClient());
    };
    window.addEventListener("yomu:lang-changed", onLangChanged as EventListener);
    const onVisibility = () => setLang(getLangClient());
    document.addEventListener("visibilitychange", onVisibility);
    const onFocus = () => setIsLightTheme(getStoredUiTheme() === "light");
    window.addEventListener("focus", onFocus);
    document.body.classList.add("marketing-light-page");
    return () => {
      window.removeEventListener("yomu:lang-changed", onLangChanged as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      document.body.classList.remove("marketing-light-page");
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      const destination = await resolvePostLoginPath(supabase, "/chat");
      if (destination !== "/chat") {
        router.replace(destination);
        return;
      }

      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      setUser(u);
      setChecking(false);
    };
    void init();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className={`flex min-h-[100dvh] max-h-[100dvh] flex-col overflow-hidden ${isLightTheme ? "bg-slate-50" : "bg-[#020617]"}`}>
      <header
        className={`z-[150] flex flex-shrink-0 items-center justify-between gap-2 border-b px-3 pb-3 pt-[max(12px,env(safe-area-inset-top,0px))] backdrop-blur-xl sm:gap-3 sm:px-6 sm:py-3 sm:pt-3 ${th.nav}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${th.brandIcon}`}
          >
            <BookOpen className="h-4 w-4" />
          </div>
          <p className={`truncate text-sm font-semibold sm:text-base ${th.pageTitle}`}>
            {t(lang, "chatHeaderTitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <p className={`hidden truncate text-xs sm:block sm:text-sm ${th.pageMuted}`}>
            {t(lang, "chatGreetingPrefix")}
            <span className={`font-medium ${isLightTheme ? "text-blue-700" : "text-pink-300/90"}`}>
              {displayName(user?.email)}
            </span>
            {t(lang, "chatGreetingSuffix")}
          </p>
          <p className={`truncate text-xs sm:hidden ${th.pageMuted}`}>
            <span className={`font-medium ${isLightTheme ? "text-blue-700" : "text-pink-300/90"}`}>
              {displayName(user?.email)}
            </span>
            {t(lang, "chatGreetingSuffix")}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition sm:px-4 ${
              isLightTheme
                ? "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                : "border-pink-500/30 bg-pink-500/10 text-pink-200 hover:bg-pink-500/20 hover:text-pink-100"
            }`}
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t(lang, "chatLogoutButton")}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-[60rem] flex-1 flex-col overflow-hidden">
        <FrenseiAppShell initialView="chat" embedded />
      </main>
    </div>
  );
}
