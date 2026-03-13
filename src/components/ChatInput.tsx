"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "说说你现在的感受...",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className="flex items-end gap-3 p-4 border-t border-[var(--yj-divider)] bg-[var(--yj-bg-primary)]">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none rounded-xl bg-[var(--yj-bg-tertiary)] px-4 py-3 text-sm text-[var(--yj-text-primary)] placeholder:text-[var(--yj-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--yj-primary-light)] transition-shadow"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        className="px-5 py-3 rounded-xl bg-[var(--yj-primary)] text-[#FFFCF7] text-sm font-medium hover:bg-[var(--yj-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        发送
      </button>
    </div>
  );
}
