import Link from "next/link";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { t } from "@/src/utils/i18n/t";

export default function PricingPage() {
  const lang = getLangServer();

  const copy =
    lang === "ja"
      ? {
          title: "プラン",
          free: "無料",
          pro: "Pro",
          founder: "Founder（ベータ）",
          freeBullets: ["1日30メッセージ", "語彙保存", "デイリーミッション", "基本コーチ"],
          proBullets: [
            "チャット無制限",
            "語彙無制限",
            "パーソナルコーチ",
            "詳細な進捗",
          ],
          founderBullets: ["ベータ参加者向け", "早期アクセス", "フィードバック優先"],
          cta: "近日公開",
          back: "アプリに戻る",
        }
      : {
          title: "Pricing",
          free: "Free",
          pro: "Pro",
          founder: "Founder (beta)",
          freeBullets: [
            "30 chat messages / day",
            "Vocabulary saves",
            "Daily missions",
            "Basic coaching",
          ],
          proBullets: [
            "Unlimited chat",
            "Unlimited vocabulary",
            "Personalized coaching",
            "Advanced progress",
          ],
          founderBullets: ["Beta participants", "Early access", "Priority feedback"],
          cta: "Coming soon",
          back: "Back to app",
        };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="font-wa-serif text-2xl font-semibold">{copy.title}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {lang === "ja"
            ? "決済はまだ有効化されていません。ベータ中のプラン設計です。"
            : "Payments are not active yet. This is beta pricing infrastructure."}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { name: copy.free, bullets: copy.freeBullets, highlight: false },
            { name: copy.pro, bullets: copy.proBullets, highlight: true },
            { name: copy.founder, bullets: copy.founderBullets, highlight: false },
          ].map((plan) => (
            <section
              key={plan.name}
              className={`rounded-2xl border p-5 ${
                plan.highlight
                  ? "border-wa-ruri/50 bg-wa-ruri/10 shadow-[0_12px_40px_rgba(56,189,248,0.12)]"
                  : "border-slate-800 bg-slate-950/80"
              }`}
            >
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <ul className="mt-4 space-y-2 text-[13px] text-slate-300">
                {plan.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
              <button
                type="button"
                disabled
                className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-400"
              >
                {copy.cta}
              </button>
            </section>
          ))}
        </div>

        <Link
          href="/app"
          className="mt-8 inline-flex text-sm text-sky-300 hover:text-sky-200"
        >
          ← {copy.back}
        </Link>
      </main>
    </div>
  );
}
