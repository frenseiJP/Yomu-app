import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-pink-400/30 bg-[#020617]">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-4 px-4 py-4 text-xs text-slate-300 sm:justify-between sm:px-6 lg:px-8">
        <p className="text-slate-500">Yomu / Frensei</p>
        <nav className="flex items-center gap-4">
          <Link className="text-pink-200 hover:text-pink-100" href="/terms">
            利用規約
          </Link>
          <Link className="text-pink-200 hover:text-pink-100" href="/privacy">
            プライバシーポリシー
          </Link>
          <Link className="text-pink-200 hover:text-pink-100" href="/contact">
            お問い合わせ
          </Link>
          <Link className="text-pink-200 hover:text-pink-100" href="/feedback">
            感想
          </Link>
        </nav>
      </div>
    </footer>
  );
}
