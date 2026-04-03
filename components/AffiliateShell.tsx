"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import AffiliateSection from "@/components/AffiliateSection";
import { isAffiliateBarVisibleForPath } from "@/lib/affiliateVisibility";

/**
 * チャット画面ではアフィリエイトバーを出さず、入力・タブ・音声ボタンの操作を邪魔しないようにする。
 */
export default function AffiliateShell() {
  const pathname = usePathname();
  const hideAffiliate = !isAffiliateBarVisibleForPath(pathname);

  useEffect(() => {
    if (hideAffiliate) {
      document.body.style.paddingBottom = "0px";
    } else {
      document.body.style.paddingBottom = "";
    }
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [hideAffiliate]);

  if (hideAffiliate) return null;
  return <AffiliateSection />;
}
