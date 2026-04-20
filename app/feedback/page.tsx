import Link from "next/link";
import FeedbackCommentColumn from "@/components/feedback/FeedbackCommentColumn";
import { FEEDBACK_FORM_URL, isFeedbackFormConfigured } from "@/lib/feedbackFormUrl";
import { getLangServer } from "@/src/utils/i18n/serverLang";

const CONTACT_EMAIL = "frensei.jp@gmail.com";

export default function FeedbackPage() {
  const uiLang = getLangServer();
  const commentLang = uiLang === "ja" ? "ja" : "en";
  const mailSubject = encodeURIComponent("【感想】Yomu");
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${mailSubject}`;
  const formReady = isFeedbackFormConfigured();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="rounded-3xl border border-pink-400/60 bg-slate-950/90 p-6 shadow-[0_20px_70px_rgba(236,72,153,0.18)] sm:p-8">
          <p className="text-xs tracking-[0.18em] text-pink-200">BETA · FRENSEI / YOMU</p>
          <h1 className="mt-2 font-wa-serif text-2xl font-semibold text-slate-50 sm:text-3xl">
            ベータ版へのご意見・ご感想
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Beta commentary — bugs, ideas, and how learning feels for you.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            お試しいただきありがとうございます。ここは<span className="text-pink-200">お客様の声を伺う専用のページ</span>
            です。不具合、もっとこうしてほしいこと、うれしかったこと、学習の変化など、どんなことでも構いません。いただいた内容はサービス改善とベータ終了後の仕様検討に活用します。
          </p>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            アプリの「More」や学習レポート（Report）からもこのページへ来られます。右上のピンクのボタンからも開けます。
          </p>
        </section>

        <FeedbackCommentColumn lang={commentLang} />

        <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:mt-8 sm:p-6">
          <h2 className="font-wa-serif text-base font-bold text-pink-200 sm:text-lg">
            フォームで送る
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            下のボタンから、アンケート・感想フォームを開けます（別タブで開きます）。
          </p>
          <div className="mt-5">
            {formReady ? (
              <a
                href={FEEDBACK_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_45px_rgba(236,72,153,0.35)] transition hover:bg-pink-400"
              >
                感想フォームを開く
              </a>
            ) : (
              <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                開発用メモ: 環境変数 <code className="text-xs">NEXT_PUBLIC_FEEDBACK_FORM_URL</code> に Google フォームの URL を設定すると、ここにボタンが表示されます。
              </p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:p-6">
          <h2 className="font-wa-serif text-base font-bold text-pink-200 sm:text-lg">
            メールで送る
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            フォームが使いにくい場合や、詳しく書きたい場合はメールでも構いません。
            <a
              href={mailHref}
              className="ml-1 break-all text-pink-300 underline decoration-pink-400/50 underline-offset-2 hover:text-pink-200"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:p-6">
          <h2 className="font-wa-serif text-base font-bold text-pink-200 sm:text-lg">
            その他
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-200">
            <li>
              <Link href="/contact" className="text-pink-300 hover:text-pink-200">
                お問い合わせ
              </Link>
              （不具合・契約・その他）
            </li>
            <li>
              <Link href="/privacy" className="text-pink-300 hover:text-pink-200">
                プライバシーポリシー
              </Link>
            </li>
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200 hover:border-pink-400/60"
          >
            トップへ戻る
          </Link>
          <Link
            href="/report"
            className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200 hover:border-pink-400/60"
          >
            学習レポートへ
          </Link>
        </div>
      </main>
    </div>
  );
}
