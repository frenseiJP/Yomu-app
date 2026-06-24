"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] px-4 text-center text-slate-100">
      <h1 className="font-wa-serif text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        Frensei hit an unexpected error. You can try again or return home.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-pink-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-pink-400"
        >
          Try again
        </button>
        <Link
          href="/app"
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
        >
          Go to app
        </Link>
      </div>
    </div>
  );
}
