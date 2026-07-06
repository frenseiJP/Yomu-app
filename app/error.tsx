"use client";

import { useEffect } from "react";
import Link from "next/link";
import { mkt } from "@/lib/ui/appTheme";

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
    <div className={`flex min-h-screen flex-col items-center justify-center px-4 text-center ${mkt.page}`}>
      <h1 className={`text-xl font-semibold ${mkt.heading}`}>Something went wrong</h1>
      <p className={`mt-2 max-w-md text-sm ${mkt.muted}`}>
        Frensei hit an unexpected error. You can try again or return home.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => reset()} className={mkt.cta}>
          Try again
        </button>
        <Link href="/app" className={mkt.secondaryBtn}>
          Go to app
        </Link>
      </div>
    </div>
  );
}
