"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getFooterCopy } from "@/lib/i18n/legalCopy";
import { useAppLang } from "@/lib/i18n/useAppLang";

export default function Footer() {
  const pathname = usePathname() || "";
  const lang = useAppLang();
  const copy = getFooterCopy(lang);
  const isChatRoute = pathname === "/chat" || pathname.startsWith("/chat/");
  const isAppShellRoute =
    pathname === "/app" ||
    pathname === "/vocabulary" ||
    pathname === "/progress" ||
    pathname === "/more" ||
    pathname === "/topic";
  if (isChatRoute || isAppShellRoute) return null;

  return (
    <footer className="border-t border-pink-400/30 bg-[#020617]">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-3 px-4 py-4 text-xs text-slate-300 sm:justify-between sm:gap-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]">
        <p className="text-center text-slate-500 sm:text-left">Frensei</p>
        <nav className="flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
          <Link className="text-pink-200 hover:text-pink-100" href="/terms">
            {copy.terms}
          </Link>
          <Link className="text-pink-200 hover:text-pink-100" href="/privacy">
            {copy.privacy}
          </Link>
          <Link className="text-pink-200 hover:text-pink-100" href="/contact">
            {copy.contact}
          </Link>
          <Link className="text-pink-200 hover:text-pink-100" href="/feedback">
            {copy.feedback}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
