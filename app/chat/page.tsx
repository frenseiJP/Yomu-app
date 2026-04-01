"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import YomuPrototypePage from "../YomuPrototypePage";
import { LogOut, BookOpen } from "lucide-react";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";

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

  const supabase = createClient();

  useEffect(() => {
    setLang(getLangClient());
    const onLangChanged = (event: Event) => {
      const custom = event as CustomEvent<{ lang?: Lang }>;
      const next = custom.detail?.lang;
      setLang(next ?? getLangClient());
    };
    window.addEventListener("yomu:lang-changed", onLangChanged as EventListener);
    const onVisibility = () => setLang(getLangClient());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("yomu:lang-changed", onLangChanged as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (!u) {
        router.replace("/login");
        return;
      }

      // 初回はオンボーディング（プロフィール未完了）へ誘導
      try {
        const { data: profileRows, error: profileError } = await supabase
          .from("user_profiles")
          .select("user_id")
          .eq("user_id", u.id)
          .limit(1);

        if (!profileError && (!profileRows || profileRows.length === 0)) {
          router.replace("/onboarding");
          return;
        }
      } catch {
        // テーブル未作成などの場合は、まずは通常表示にフォールバック
      }

      setUser(u);
      setChecking(false);
    };
    init();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500/30 border-t-pink-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#020617]">
      {/* メイン画面用ヘッダー: パーソナライズ挨拶 + ログアウト */}
      <header className="sticky top-0 z-[150] flex flex-shrink-0 items-center justify-between gap-3 border-b border-slate-800/60 bg-slate-950/95 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-wa-ruri to-wa-asagi text-sm font-bold text-white shadow-lg">
            <BookOpen className="h-4 w-4" />
          </div>
          <p className="truncate font-wa-serif text-sm font-semibold text-slate-100 sm:text-base">
            {t(lang, "chatHeaderTitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <p className="hidden truncate text-xs text-slate-400 sm:block sm:text-sm">
            {t(lang, "chatGreetingPrefix")}
            <span className="font-medium text-pink-300/90">
              {displayName(user?.email)}
            </span>
            {t(lang, "chatGreetingSuffix")}
          </p>
          <p className="truncate text-xs text-slate-400 sm:hidden">
            <span className="font-medium text-pink-300/90">
              {displayName(user?.email)}
            </span>
            {t(lang, "chatGreetingSuffix")}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 py-2 text-xs font-medium text-pink-200 transition hover:bg-pink-500/20 hover:text-pink-100 sm:px-4"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t(lang, "chatLogoutButton")}</span>
          </button>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <YomuPrototypePage initialView="chat" embedded />
      </main>
    </div>
  );
}
