"use client";

import type { ReactNode } from "react";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import type { ChatActionsCopy } from "@/lib/i18n/chatActionsCopy";

type Props = {
  copy: ChatActionsCopy;
  sessionGoalRow: ReactNode;
  importSheet: ReactNode;
  speakPanel?: ReactNode | null;
  weakDrillChip?: ReactNode | null;
  defaultOpen?: boolean;
};

export default function ChatCoachToolsBar({
  copy,
  sessionGoalRow,
  importSheet,
  speakPanel,
  weakDrillChip,
  defaultOpen = false,
}: Props) {
  const hasSpeak = Boolean(speakPanel);
  const badge = hasSpeak ? copy.speaking : undefined;

  return (
    <CollapsibleSection
      title={copy.coachToolsTitle}
      subtitle={copy.coachToolsSubtitle}
      defaultOpen={defaultOpen || hasSpeak}
      badge={badge}
      tone="muted"
    >
      <div className="space-y-3">
        {speakPanel}
        {sessionGoalRow}
        {importSheet}
        {weakDrillChip}
      </div>
    </CollapsibleSection>
  );
}
