import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <main id="top" className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="rounded-3xl border border-pink-400/60 bg-slate-950/90 p-6 shadow-[0_20px_70px_rgba(236,72,153,0.16)] sm:p-8">
          <p className="text-xs tracking-[0.18em] text-pink-200">YOMU PRIVACY POLICY</p>
          <h1 className="mt-2 font-wa-serif text-2xl font-semibold text-slate-50 sm:text-3xl">
            プライバシーポリシー
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            現在準備中です
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:mt-8 sm:p-6">
          <p className="text-sm leading-7 text-slate-300">
            正式版公開に向けて、個人情報の取り扱いに関する方針を整備しています。
            公開まで今しばらくお待ちください。
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_16px_45px_rgba(236,72,153,0.35)] hover:bg-pink-400"
            >
              トップへ戻る
            </Link>
            <a
              href="#top"
              className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200 hover:border-pink-400/60"
            >
              ページ先頭へ
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
