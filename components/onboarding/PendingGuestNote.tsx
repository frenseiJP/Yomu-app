"use client";

import { useEffect, useState } from "react";
import { hasPendingGuestChat } from "@/lib/guest/pendingChat";
import { getOnboardingGoalCopy } from "@/lib/i18n/onboardingCopy";
import { useAppLang } from "@/lib/i18n/useAppLang";

export default function PendingGuestNote() {
  const lang = useAppLang();
  const copy = getOnboardingGoalCopy(lang);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(hasPendingGuestChat());
  }, []);

  if (!show) return null;

  return (
    <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
      {copy.pendingGuestNote}
    </div>
  );
}
