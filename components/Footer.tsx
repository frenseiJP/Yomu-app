"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getFooterCopy } from "@/lib/i18n/legalCopy";
import { getMarketingCopy } from "@/lib/i18n/marketingCopy";
import { mkt } from "@/lib/ui/appTheme";
import { useAppLang } from "@/lib/i18n/useAppLang";

export default function Footer() {
  const pathname = usePathname() || "";
  const lang = useAppLang();
  const copy = getFooterCopy(lang);
  const m = getMarketingCopy(lang);
  const isChatRoute = pathname === "/chat" || pathname.startsWith("/chat/");
  const isAppShellRoute =
    pathname === "/app" ||
    pathname === "/vocabulary" ||
    pathname === "/progress" ||
    pathname === "/more" ||
    pathname === "/topic";
  if (isChatRoute || isAppShellRoute) return null;

  const showShareCta =
    pathname === "/" ||
    pathname === "/try" ||
    pathname.startsWith("/try/") ||
    pathname === "/trial" ||
    pathname === "/pricing" ||
    pathname === "/launch" ||
    pathname.startsWith("/learn");

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {showShareCta ? (
          <>
            <p className="text-center text-base font-semibold text-slate-900">{m.footerShareLine}</p>
            <div className="mt-4 flex justify-center">
              <Link href="/try" className={mkt.cta}>
                {m.footerShareCta}
              </Link>
            </div>
          </>
        ) : null}
        <div
          className={`mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-3 text-xs text-slate-600 sm:justify-between ${
            showShareCta ? "mt-8 border-t border-slate-200 pt-6" : "py-2"
          }`}
        >
          <p className="text-center sm:text-left">Frensei</p>
          <nav className="flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
            <Link className="hover:text-blue-700" href="/pricing">
              {m.pricing}
            </Link>
            <Link className="hover:text-blue-700" href="/try">
              Try
            </Link>
            <Link className="hover:text-blue-700" href="/learn">
              Guides
            </Link>
            <Link className="hover:text-blue-700" href="/trial">
              Beta intro
            </Link>
            <Link className="hover:text-blue-700" href="/terms">
              {copy.terms}
            </Link>
            <Link className="hover:text-blue-700" href="/privacy">
              {copy.privacy}
            </Link>
            <Link className="hover:text-blue-700" href="/contact">
              {copy.contact}
            </Link>
            <Link className="hover:text-blue-700" href="/feedback">
              {copy.feedback}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
