"use client";

import type { ChatMessage as ChatMsg } from "@/lib/chat/types";

type Props = {
  message: ChatMsg;
};

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "rounded-br-sm bg-wa-ruri text-white"
            : "rounded-bl-sm border border-yomu-glassBorder bg-yomu-glass text-slate-100"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
