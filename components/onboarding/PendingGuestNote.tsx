"use client";

import { useEffect, useState } from "react";
import { hasPendingGuestChat } from "@/lib/guest/pendingChat";

export default function PendingGuestNote() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(hasPendingGuestChat());
  }, []);

  if (!show) return null;

  return (
    <div className="mb-4 rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
      Your trial conversation is saved. Finish this quick setup to continue chatting.
    </div>
  );
}
