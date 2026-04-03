import Link from "next/link";

const CONTACT_EMAIL = "frensei.jp@gmail.com";

export default function ContactPage() {
  const mailSubject = encodeURIComponent("Yomu に関するお問い合わせ");
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${mailSubject}`;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="rounded-3xl border border-pink-400/60 bg-slate-950/90 p-6 shadow-[0_20px_70px_rgba(236,72,153,0.18)] sm:p-8">
          <p className="text-xs tracking-[0.18em] text-pink-200">YOMU CONTACT</p>
          <h1 className="mt-2 font-wa-serif text-2xl font-semibold text-slate-50 sm:text-3xl">
            お問い合わせ
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            本サービスに関するご質問、不具合のご報告、Amazon
            アソシエイト掲載に関するお問い合わせなどは、下記メールアドレスまでご連絡ください。運営者が責任をもって対応します。
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:mt-8 sm:p-6">
          <h2 className="font-wa-serif text-base font-bold text-pink-200 sm:text-lg">
            連絡先
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            メールアドレス：
            <a
              href={mailHref}
              className="break-all text-pink-300 underline decoration-pink-400/50 underline-offset-2 hover:text-pink-200"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            返信まで数日かかる場合があります。内容によってはお答えできないこともありますので、あらかじめご了承ください。
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:p-6">
          <h2 className="font-wa-serif text-base font-bold text-pink-200 sm:text-lg">
            関連ページ
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-200">
            <li>
              <Link href="/feedback" className="text-pink-300 hover:text-pink-200">
                感想
              </Link>
              （フィードバック・ご意見）
            </li>
            <li>
              <Link href="/privacy" className="text-pink-300 hover:text-pink-200">
                プライバシーポリシー
              </Link>
              （Cookie・広告・アソシエイトについて）
            </li>
            <li>
              <Link href="/terms" className="text-pink-300 hover:text-pink-200">
                利用規約
              </Link>
            </li>
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_16px_45px_rgba(236,72,153,0.35)] hover:bg-pink-400"
          >
            トップへ戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
