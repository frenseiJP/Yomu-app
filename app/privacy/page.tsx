import Link from "next/link";

const sections = [
  {
    title: "1. 取得する情報",
    lines: [
      "当社は、サービス提供に必要な範囲で、アカウント情報、利用ログ、学習履歴、AIとの会話データ等を取得することがあります。",
    ],
  },
  {
    title: "2. 利用目的",
    lines: [
      "取得した情報は、本人確認、サービス提供、品質向上、不具合対応、利用状況分析、セキュリティ確保の目的で利用します。",
    ],
  },
  {
    title: "3. ベータ版におけるデータ利用",
    lines: [
      "ベータ期間中は、サービス改善のために学習ログおよび会話データを分析する場合があります。",
      "分析結果は品質向上に活用され、個人を特定しない形で統計化することがあります。",
    ],
  },
  {
    title: "4. 第三者提供",
    lines: [
      "法令に基づく場合を除き、本人の同意なく個人情報を第三者へ提供しません。",
      "外部API等の委託先を利用する場合は、必要な契約・安全管理措置を講じます。",
    ],
  },
  {
    title: "5. 安全管理",
    lines: [
      "不正アクセス、漏えい、滅失、毀損の防止に向け、技術的・組織的な安全管理措置を実施します。",
    ],
  },
  {
    title: "6. 開示・訂正・削除等",
    lines: [
      "利用者は、法令の定めに従い、自己情報の開示・訂正・利用停止・削除等を請求できます。",
    ],
  },
  {
    title: "7. ポリシーの改定",
    lines: [
      "当社は、法令改正やサービス変更等に応じて本ポリシーを改定することがあります。改定後は本サービス上への掲示時点で効力を生じます。",
    ],
  },
] as const;

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
            Yomu（ベータ版）における個人情報および利用データの取り扱い方針を定めます。
          </p>
        </section>

        <section className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:p-6"
            >
              <h2 className="font-wa-serif text-base font-bold text-pink-200 sm:text-lg">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.lines.map((line) => (
                  <p key={line} className="text-sm leading-7 text-slate-200">
                    {line}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-pink-500/40 bg-slate-950/90 p-5 sm:mt-10 sm:p-6">
          <p className="text-sm leading-7 text-slate-200">
            お問い合わせ：frensei.jp@gmail.com
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_16px_45px_rgba(236,72,153,0.35)] hover:bg-pink-400"
            >
              同意して利用を開始する
            </Link>
            <a
              href="#top"
              className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200 hover:border-pink-400/60"
            >
              トップへ戻る
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
