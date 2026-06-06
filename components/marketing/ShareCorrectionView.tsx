import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { ShareCorrectionPayload } from "@/lib/share/encode";

type Props = {
  data: ShareCorrectionPayload;
};

export default function ShareCorrectionView({ data }: Props) {
  return (
    <div className="min-h-screen bg-[#020617] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-lg">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-slate-200">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Frensei</span>
        </Link>

        <p className="text-[11px] font-semibold uppercase tracking-wider text-pink-400/90">
          Shared correction
        </p>
        <h1 className="mt-2 font-wa-serif text-2xl font-semibold text-slate-50">
          Natural Japanese coaching
        </h1>

        <div className="mt-8 space-y-4">
          {data.niceLine ? (
            <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/90">
                Nice
              </p>
              <p className="mt-2 text-slate-100">{data.niceLine}</p>
            </section>
          ) : null}

          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              You wrote
            </p>
            <p className="mt-2 text-slate-100">{data.userText}</p>
          </section>

          <section className="rounded-2xl border border-sky-500/25 bg-sky-500/8 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-300/90">
              Better
            </p>
            <p className="mt-2 text-lg text-slate-50">{data.correctedSentence}</p>
          </section>

          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Why
            </p>
            <p className="mt-2 leading-relaxed text-slate-300">{data.whyEnglish}</p>
          </section>
        </div>

        <div className="mt-10 rounded-2xl border border-pink-500/25 bg-pink-500/8 p-6 text-center">
          <p className="text-sm text-slate-300">Want your own Japanese coach?</p>
          <Link
            href="/login?intent=signup"
            className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-3 text-sm font-medium text-white"
          >
            Try Frensei free
          </Link>
          <Link href="/try" className="mt-3 block text-[12px] text-slate-500 hover:text-slate-300">
            Or try 3 messages without signing up
          </Link>
        </div>
      </div>
    </div>
  );
}
