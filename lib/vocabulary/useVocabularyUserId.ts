"use client";

import { useEffect, useState } from "react";
import { getOrCreateUserId } from "@/lib/chat/service";
import { createClient } from "@/src/utils/supabase/client";

/** Same resolution as chat/habit: Supabase user id when signed in, else local guest id. */
export function useVocabularyUserId(): string {
  const [userId, setUserId] = useState("guest");

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const localUid = getOrCreateUserId();
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!mounted) return;
        setUserId(user?.id ?? localUid);
      } catch {
        if (!mounted) return;
        setUserId(getOrCreateUserId());
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, []);

  return userId;
}
