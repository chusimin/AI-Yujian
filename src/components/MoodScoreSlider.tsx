"use client";

import { useState } from "react";

interface MoodScoreSliderProps {
  suggestedScore: number;
  onConfirm: (score: number) => void;
}

const labels = ["", "很低落", "有点丧", "一般", "还不错", "很棒"];
const emojis = ["", "😔", "😕", "😐", "🙂", "😊"];

export function MoodScoreSlider({ suggestedScore, onConfirm }: MoodScoreSliderProps) {
  const [score, setScore] = useState(suggestedScore);

  return (
    <div className="p-6 rounded-lg bg-[var(--yj-bg-secondary)] border border-[var(--yj-border)]">
      <p className="text-sm font-medium text-[var(--yj-text-primary)] mb-1">
        今天的情绪评分
      </p>
      <p className="text-xs text-[var(--yj-text-muted)] mb-5">
        AI建议评分 {suggestedScore} 分，你可以调整
      </p>

      <div className="flex items-center gap-5 mb-4">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="flex-1 h-2 rounded-full appearance-none bg-[var(--yj-bg-tertiary)] accent-[var(--yj-primary)] cursor-pointer"
        />
        <div className="flex flex-col items-center min-w-[3rem]">
          <span className="text-2xl">{emojis[score]}</span>
          <span className="text-lg font-bold text-[var(--yj-primary)]">{score}</span>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--yj-text-secondary)] mb-5">
        {labels[score]}
      </p>

      <button
        onClick={() => onConfirm(score)}
        className="w-full py-3 rounded-lg bg-[var(--yj-primary)] text-[#FFFCF7] text-sm font-medium hover:bg-[var(--yj-primary-hover)] transition-colors active:scale-[0.98]"
      >
        确认评分
      </button>
    </div>
  );
}
