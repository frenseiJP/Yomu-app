"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import { checkUserProfileStatus } from "@/lib/auth/profile";
import { mkt } from "@/lib/ui/appTheme";

type Props = {
  children: React.ReactNode;
  requireAuth?: boolean;
};

export default function OnboardingGate({ children, requireAuth = false }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (!user) {
        if (requireAuth) {
          router.replace("/login");
          return;
        }
        setReady(true);
        return;
      }

      const profileStatus = await checkUserProfileStatus(supabase, user.id);
      if (cancelled) return;

      if (profileStatus === "missing_profile") {
        router.replace("/onboarding");
        return;
      }

      setReady(true);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [requireAuth, router]);

  if (!ready) {
    return (
      <div className={`flex min-h-screen min-h-[100dvh] items-center justify-center ${mkt.page}`}>
        <div className={mkt.spinner} />
      </div>
    );
  }

  return <>{children}</>;
}
