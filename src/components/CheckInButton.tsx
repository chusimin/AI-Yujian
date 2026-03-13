"use client";

import { useRouter } from "next/navigation";

interface CheckInButtonProps {
  hasCheckedInToday: boolean;
}

export function CheckInButton({ hasCheckedInToday }: CheckInButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/chat")}
      disabled={hasCheckedInToday}
      className={`w-full py-4 rounded-lg text-base font-medium transition-all ${
        hasCheckedInToday
          ? "bg-[var(--yj-bg-tertiary)] text-[var(--yj-text-muted)] cursor-not-allowed"
          : "bg-[var(--yj-primary)] text-[var(--yj-bg-secondary)] hover:bg-[var(--yj-primary-hover)] active:scale-[0.98]"
      }`}
    >
      {hasCheckedInToday ? "今天已签到 ✓" : "开始今日签到"}
    </button>
  );
}
