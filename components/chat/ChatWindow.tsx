"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/chat/types";
import ChatMessageBubble from "@/components/chat/ChatMessage";

type Props = {
  messages: ChatMessage[];
};

export default function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 text-[13px] leading-relaxed">
      {messages.map((m) => (
        <ChatMessageBubble key={m.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
