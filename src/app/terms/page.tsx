import Link from "next/link";

const LAST_UPDATED = "2026年4月2日";
const VERSION = "Beta 1.0";

const articles = [
  {
    title: "第1条 総則",
    body: [
      "1. 本利用規約（以下「本規約」）は、Yomu（以下「当社」または「運営者」）が提供する日本語学習AIサービス「Yomu」（以下「本サービス」）の利用条件を定めるものです。",
      "2. ユーザー（以下「利用者」）は、本サービスにアクセスまたは利用を開始した時点で、本規約に同意したものとみなします。",
      "3. 本サービスはベータ版として提供されており、本番リリース版とは品質・機能・安定性が異なる場合があります。",
    ],
  },
  {
    title: "第2条 ベータ版サービスの性質",
    bullets: [
      "AIによる日本語学習支援の精度・正確性は保証されません。",
      "サービスの内容・機能・仕様は予告なく変更・追加・削除される場合があります。",
      "サービスの中断・停止が予告なく発生する場合があります。",
      "ベータ期間終了後、サービスの提供条件が変更される場合があります。",
      "ベータ版のデータ・学習履歴は、正式版への移行時に引き継がれない場合があります。",
    ],
  },
  {
    title: "第3条 免責事項（重要）",
    body: [
      "3-1 AIの回答精度に関する免責: Yomuが提供するAIによる日本語学習支援（文法解説・翻訳・発音アドバイス・例文生成等）は参考情報として提供されるものです。その内容の正確性・完全性・最新性を当社は一切保証しません。特に試験・資格取得・業務上の重要な判断では、必ず有資格の専門家または公式教材にてご確認ください。",
      "3-2 学習成果に関する免責: 本サービスの利用により特定の日本語能力の習得・向上を保証するものではありません。学習効果には個人差があり、当社は利用者の学習成果について一切の責任を負いません。",
      "3-3 サービス停止・データ損失に関する免責: システム障害・メンテナンス・天災・その他予期せぬ事由によるサービスの中断・停止、および利用者データ（学習履歴・進捗データ等）の消失・破損について、当社は一切責任を負いません。定期的なバックアップは利用者自身の責任で行ってください。",
      "3-4 第三者サービスとの連携に関する免責: 外部API・翻訳エンジン・音声認識技術等の第三者サービスに起因する不具合・仕様変更・終了等による損害について、当社は責任を負いません。",
      "3-5 損害賠償の制限: 当社の責に帰すべき事由により利用者に損害が生じた場合でも、当社の賠償責任は直接かつ通常の損害に限られ、逸失利益・間接損害・特別損害・結果損害は含みません。賠償総額は、直近3か月分の利用料金（無償利用時は1,000円）を上限とします。",
    ],
  },
  {
    title: "第4条 利用者の責任",
    bullets: [
      "本サービスを日本語学習の補助ツールとして適切に利用すること。",
      "AIの回答を盲目的に信頼せず、重要な場面では必ず公式情報を確認すること。",
      "本サービスを不正・違法な目的に使用しないこと。",
      "他の利用者または第三者の権利を侵害しないこと。",
      "本サービスのシステムに対して過度な負荷をかける行為を行わないこと。",
    ],
  },
  {
    title: "第5条 知的財産権",
    body: [
      "本サービスに含まれるコンテンツの著作権その他知的財産権は当社または正当な権利者に帰属します。利用者は個人的な学習目的の範囲内でのみ使用できるものとし、無断での複製・転載・二次利用は禁止します。",
    ],
  },
  {
    title: "第6条 プライバシーと個人情報",
    body: [
      "当社は、利用者の個人情報を別途定める「Yomuプライバシーポリシー」に従い適切に取り扱います。ベータ版においては、サービス改善を目的として利用者の学習ログ・AIとの会話データを収集・分析する場合があります。",
    ],
  },
  {
    title: "第7条 規約の変更",
    body: [
      "当社は、法令の改正・サービスの変更その他必要に応じて、本規約をいつでも変更できるものとします。変更後の規約は本サービス上に掲示された時点で効力を生じます。",
    ],
  },
  {
    title: "第8条 サービスの終了",
    body: [
      "当社は、ベータ版サービスをいつでも予告の有無にかかわらず終了できるものとします。サービス終了に伴い生じた損害について、当社は第3条3-5の範囲を超える責任を負いません。",
    ],
  },
  {
    title: "第9条 準拠法および管轄",
    body: [
      "本規約は日本法に準拠し、これに従い解釈されます。本規約に関して紛争が生じた場合、当社所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <main id="top" className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="rounded-3xl border border-pink-400/60 bg-slate-950/90 p-6 shadow-[0_20px_70px_rgba(236,72,153,0.16)] sm:p-8">
          <p className="text-xs tracking-[0.18em] text-pink-200">YOMU BETA TERMS</p>
          <h1 className="mt-2 font-wa-serif text-2xl font-semibold text-slate-50 sm:text-3xl">
            利用規約（ベータ版）
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            最終更新日：{LAST_UPDATED} ｜ バージョン：{VERSION}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-slate-200">
            ご利用前に必ずお読みください。本サービス「Yomu」はベータ版（試験提供段階）のAIサービスです。
            ベータ期間中はサービスの品質・内容・機能が予告なく変更される場合があります。本規約に同意いただいた上でご利用ください。
          </p>
        </section>

        <section className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          {articles.map((article) => (
            <article
              key={article.title}
              className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:p-6"
            >
              <h2 className="font-wa-serif text-base font-bold text-pink-200 sm:text-lg">
                {article.title}
              </h2>

              {"body" in article && article.body ? (
                <div className="mt-3 space-y-3">
                  {article.body.map((line) => (
                    <p key={line} className="text-sm leading-7 text-slate-200">
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}

              {"bullets" in article && article.bullets ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-200">
                  {article.bullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-pink-500/40 bg-slate-950/90 p-5 sm:mt-10 sm:p-6">
          <p className="text-sm leading-7 text-slate-200">
            お問い合わせ：Yomu サポート窓口（frensei.jp@gmail.com）<br />
            受付時間：平日 10:00〜18:00（日本時間）
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
