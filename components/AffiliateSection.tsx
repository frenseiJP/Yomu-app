import Link from "next/link";
import { BookOpen } from "lucide-react";

const AMAZON_URL = "https://www.amazon.co.jp";

/**
 * 下部固定のアフィリエイト用バー（高さ 60px + セーフエリア）。
 * layout の body に同じ余白（pb）を付けてコンテンツの隠れを防ぐ。
 */
export default function AffiliateSection() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[880] border-t border-slate-200/90 bg-[rgba(255,255,255,0.9)] backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="Recommended textbook"
    >
      <div className="mx-auto flex h-[60px] w-full max-w-5xl items-center gap-2 px-2 sm:gap-3 sm:px-4">
        <BookOpen
          className="h-5 w-5 flex-shrink-0 text-slate-700 sm:h-6 sm:w-6"
          aria-hidden
        />
        <p className="min-w-0 flex-1 truncate text-left text-[11px] font-semibold leading-tight text-slate-800 sm:text-sm">
          Recommended: Japanese Textbook
        </p>
        <Link
          href={AMAZON_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex min-h-[36px] flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 sm:min-h-[40px] sm:px-4 sm:text-sm"
        >
          View
        </Link>
      </div>
    </div>
  );
}
