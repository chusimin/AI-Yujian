"use client";

import { useState } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  isStreaming?: boolean;
}

export function ChatMessage({
  role,
  content,
  thinking,
  isStreaming,
}: ChatMessageProps) {
  const [showThinking, setShowThinking] = useState(false);

  // Strip hidden signals from display
  const displayContent = content
    .replace(/<!--CHECKIN_END:[\s\S]*?-->/, "")
    .replace(/<!--T:[\s\S]*?-->/g, "")
    .trim();

  // During streaming with no content yet, show thinking indicator
  if (role === "assistant" && !displayContent && isStreaming) {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[80%] bg-[var(--yj-bg-secondary)] border border-[var(--yj-border)] rounded-[4px_20px_20px_20px] px-5 py-4 shadow-[var(--yj-shadow-sm)]">
          {thinking ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--yj-accent)] animate-pulse" />
                <span className="text-xs text-[var(--yj-text-muted)]">
                  正在思考...
                </span>
              </div>
              <p className="text-xs text-[var(--yj-text-muted)] leading-relaxed line-clamp-3 italic">
                {thinking.slice(-100)}
              </p>
            </div>
          ) : (
            <span className="text-sm text-[var(--yj-text-muted)] animate-pulse">
              正在思考...
            </span>
          )}
        </div>
      </div>
    );
  }

  if (!displayContent) return null;

  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className="max-w-[80%]">
        <div
          className={`px-5 py-4 text-sm leading-relaxed ${
            role === "user"
              ? "bg-[var(--yj-primary)] text-[#FFFCF7] rounded-[20px_4px_20px_20px]"
              : "bg-[var(--yj-bg-secondary)] text-[var(--yj-text-primary)] border border-[var(--yj-border)] rounded-[4px_20px_20px_20px] shadow-[var(--yj-shadow-sm)]"
          }`}
        >
          {displayContent}
        </div>

        {/* Show thinking toggle for AI messages with thinking content */}
        {role === "assistant" && thinking && !isStreaming && (
          <button
            onClick={() => setShowThinking(!showThinking)}
            className="mt-1 ml-1 text-xs text-[var(--yj-text-muted)] hover:text-[var(--yj-text-secondary)] transition-colors"
          >
            {showThinking ? "收起思考过程 ▴" : "查看思考过程 ▾"}
          </button>
        )}
        {showThinking && thinking && (
          <div className="mt-1 ml-1 p-3 rounded-lg bg-[var(--yj-bg-tertiary)] text-xs text-[var(--yj-text-muted)] leading-relaxed max-h-32 overflow-y-auto">
            {thinking}
          </div>
        )}
      </div>
    </div>
  );
}
