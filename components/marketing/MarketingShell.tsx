"use client";

import { type ReactNode } from "react";
import { mkt } from "@/lib/ui/appTheme";

export { mkt };

type Props = {
  children: ReactNode;
  className?: string;
};

export default function MarketingShell({ children, className = "" }: Props) {
  return <div className={`${mkt.page} ${className}`.trim()}>{children}</div>;
}
