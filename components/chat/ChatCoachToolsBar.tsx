"use client";

import type { ReactNode } from "react";
import CollapsibleSection from "@/components/ui/CollapsibleSection";

type Props = {
  sessionGoalRow: ReactNode;
  importSheet: ReactNode;
  speakPanel?: ReactNode | null;
  weakDrillChip?: ReactNode | null;
  defaultOpen?: boolean;
};

export default function ChatCoachToolsBar({
  sessionGoalRow,
  importSheet,
  speakPanel,
  weakDrillChip,
  defaultOpen = false,
}: Props) {
  const hasSpeak = Boolean(speakPanel);
  const badge = hasSpeak ? "Speaking" : undefined;

  return (
    <CollapsibleSection
      title="Coach tools"
      subtitle="Goals, paste-to-save, drills — optional extras"
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
