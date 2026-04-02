import Link from "next/link";

const DUMMY_AMAZON_URL =
  "https://www.amazon.co.jp/dp/0000000000?tag=your-affiliate-tag-22";

const DUMMY_IMAGE_URL =
  "https://placehold.co/200x280/475569/94a3b8/png?text=Textbook";

export default function AffiliateSection() {
  return (
    <section
      className="rounded-2xl border border-slate-600/70 bg-slate-800/50 p-5 shadow-inner sm:p-6"
      aria-labelledby="affiliate-section-title"
    >
      <h2
        id="affiliate-section-title"
        className="mb-4 font-wa-serif text-lg font-semibold tracking-tight text-slate-100 sm:text-xl"
      >
        Recommended Japanese Textbooks
      </h2>

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
        <a
          href={DUMMY_AMAZON_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mx-auto flex-shrink-0 overflow-hidden rounded-lg border border-slate-600/50 bg-slate-900/40 shadow-md transition hover:border-slate-500 md:mx-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DUMMY_IMAGE_URL}
            alt="Japanese textbook (placeholder)"
            width={200}
            height={280}
            className="h-auto w-[min(100%,200px)] object-cover"
          />
        </a>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <p className="text-sm leading-relaxed text-slate-300">
            A curated pick for learners building real-world reading and grammar
            skills. Replace this copy with your short recommendation and disclosure
            text for Amazon Associates.
          </p>
          <div>
            <Link
              href={DUMMY_AMAZON_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-amber-600/50 bg-amber-500/15 px-5 py-2.5 text-sm font-semibold text-amber-100 transition hover:border-amber-500/70 hover:bg-amber-500/25"
            >
              View on Amazon
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
