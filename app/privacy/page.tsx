import Link from "next/link";

const CONTACT_EMAIL = "frensei.jp@gmail.com";

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
    title: "3. Amazonアソシエイト・プログラムについて",
    lines: [
      "当サイトは、Amazon.co.jp を宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供するアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。",
      "本サービス内の適切な箇所に、Amazon（アマゾン）へのリンクが掲載される場合があります。利用者が当該リンクから商品等を購入し、プログラムの条件を満たした場合、運営者が紹介料を受け取ることがあります。",
      "商品の価格・在庫・送料・表示内容等は、購入時点の Amazon の販売ページに準じます。商品の購入契約は、利用者と Amazon（または出品者）との間で成立し、当社は契約当事者ではありません。",
    ],
  },
  {
    title: "4. Cookie（クッキー）および広告配信について",
    lines: [
      "本サービスでは、利用状況の把握、利便性の向上、セキュリティ、および広告の配信・効果測定のため、Cookie や類似の技術（ローカルストレージ等を含みます）を使用する場合があります。",
      "第三者（例：Amazon その他の広告・分析サービス提供事業者）が提供するサービスを利用する場合、当該第三者による Cookie の設定により、利用者の興味・関心に応じた広告が表示されたり、当サイトや他サイトへの訪問に基づいて広告が配信されたりすることがあります。",
      "利用者は、ブラウザの設定により Cookie を無効化または削除できる場合があります。無効化した場合、本サービスの一部機能が正しく動作しないことがあります。",
    ],
  },
  {
    title: "5. ベータ版におけるデータ利用",
    lines: [
      "ベータ期間中は、サービス改善のために学習ログおよび会話データを分析する場合があります。",
      "分析結果は品質向上に活用され、個人を特定しない形で統計化することがあります。",
    ],
  },
  {
    title: "6. 第三者提供",
    lines: [
      "法令に基づく場合を除き、本人の同意なく個人情報を第三者へ提供しません。",
      "外部API等の委託先を利用する場合は、必要な契約・安全管理措置を講じます。",
    ],
  },
  {
    title: "7. 安全管理",
    lines: [
      "不正アクセス、漏えい、滅失、毀損の防止に向け、技術的・組織的な安全管理措置を実施します。",
    ],
  },
  {
    title: "8. 開示・訂正・削除等",
    lines: [
      "利用者は、法令の定めに従い、自己情報の開示・訂正・利用停止・削除等を請求できます。",
    ],
  },
  {
    title: "9. ポリシーの改定",
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
            Yomu（ベータ版）における個人情報および利用データの取り扱い方針を定めます。Amazon
            アソシエイト・プログラムへの参加および Cookie を用いた広告配信についても、本条項で説明します。
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
          <p className="text-sm font-medium text-pink-100">お問い合わせ</p>
          <p className="mt-2 text-sm leading-7 text-slate-200">
            本ポリシーに関するご質問は、
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("プライバシーポリシーに関するお問い合わせ")}`}
              className="text-pink-300 underline decoration-pink-400/50 underline-offset-2 hover:text-pink-200"
            >
              {CONTACT_EMAIL}
            </a>
            までご連絡ください。
          </p>
          <p className="mt-3 text-sm text-slate-400">
            <Link href="/contact" className="text-pink-300 hover:text-pink-200">
              お問い合わせページ
            </Link>
            もご利用いただけます。
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
              ページ上部へ
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
