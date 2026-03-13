"use client";

import { useState } from "react";
import type { CheckIn } from "@/types";

interface RecentCheckInsProps {
  checkIns: CheckIn[];
}

const scoreColor = (score: number) => {
  const map: Record<number, string> = {
    1: "bg-[#C27264]",       // 陶红
    2: "bg-[#D4A86A]",       // 蜂蜜黄
    3: "bg-[#C9B99A]",       // 亚麻黄
    4: "bg-[#8BA5A0]",       // 灰青
    5: "bg-[#7EAA82]",       // 柔绿
  };
  return map[score] || "bg-[var(--yj-bg-tertiary)]";
};

const scoreEmoji = (score: number) => {
  const map: Record<number, string> = { 1: "😔", 2: "😕", 3: "😐", 4: "🙂", 5: "😊" };
  return map[score] || "";
};

function getCalendarDays() {
  const today = new Date();
  const days: Date[] = [];
  // Show current month grid starting from Monday of the first week
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Start from Monday before the 1st (or the 1st if it's Monday)
  let startDow = firstDay.getDay(); // 0=Sun
  if (startDow === 0) startDow = 7; // Treat Sunday as 7
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - (startDow - 1));

  // Fill 5-6 weeks
  const totalCells = Math.ceil((lastDay.getDate() + startDow - 1) / 7) * 7;
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return { days, month, year, today };
}

export function RecentCheckIns({ checkIns }: RecentCheckInsProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const { days, month, year, today } = getCalendarDays();

  // Index check-ins by date string
  const checkInMap = new Map<string, CheckIn>();
  checkIns.forEach((c) => {
    const key = new Date(c.created_at).toLocaleDateString("zh-CN");
    checkInMap.set(key, c);
  });

  const selectedCheckIn = selectedDay ? checkInMap.get(selectedDay) : null;
  const weekdays = ["一", "二", "三", "四", "五", "六", "日"];
  const monthName = `${year}年${month + 1}月`;

  return (
    <div className="rounded-lg bg-[var(--yj-bg-secondary)] border border-[var(--yj-border)] p-5">
      <h3 className="text-sm font-medium text-[var(--yj-text-primary)] mb-4">
        {monthName} 签到日历
      </h3>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((w) => (
          <div
            key={w}
            className="text-center text-xs text-[var(--yj-text-muted)] py-1"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isCurrentMonth = day.getMonth() === month;
          const isToday = day.toDateString() === today.toDateString();
          const isFuture = day > today;
          const dateKey = day.toLocaleDateString("zh-CN");
          const checkIn = checkInMap.get(dateKey);
          const isSelected = selectedDay === dateKey;

          return (
            <button
              key={i}
              onClick={() => {
                if (checkIn) setSelectedDay(isSelected ? null : dateKey);
              }}
              disabled={!checkIn}
              className={`
                relative aspect-square rounded-md flex items-center justify-center text-xs
                transition-all
                ${!isCurrentMonth ? "opacity-30" : ""}
                ${isFuture ? "opacity-40" : ""}
                ${isSelected ? "ring-2 ring-[var(--yj-primary)]" : ""}
                ${isToday ? "font-bold" : ""}
                ${
                  checkIn
                    ? `${scoreColor(checkIn.score)} text-white cursor-pointer hover:opacity-80`
                    : "bg-[var(--yj-bg-tertiary)] text-[var(--yj-text-muted)] cursor-default"
                }
              `}
            >
              {day.getDate()}
              {isToday && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--yj-accent)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 justify-center">
        <span className="text-xs text-[var(--yj-text-muted)]">情绪：</span>
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-sm ${scoreColor(s)}`} />
            <span className="text-xs text-[var(--yj-text-muted)]">{s}</span>
          </div>
        ))}
      </div>

      {/* Selected day detail */}
      {selectedCheckIn && (
        <div className="mt-4 p-4 rounded-lg bg-[var(--yj-bg-primary)] border border-[var(--yj-divider)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{scoreEmoji(selectedCheckIn.score)}</span>
            <span className="text-sm font-medium text-[var(--yj-text-primary)]">
              {selectedCheckIn.score}分
            </span>
            <span className="text-xs text-[var(--yj-text-muted)] ml-auto">
              {new Date(selectedCheckIn.created_at).toLocaleDateString("zh-CN", {
                month: "short",
                day: "numeric",
                weekday: "short",
              })}
            </span>
          </div>
          <p className="text-sm text-[var(--yj-text-primary)]">
            {selectedCheckIn.summary}
          </p>
          {selectedCheckIn.action && (
            <p className="text-xs text-[var(--yj-accent)] mt-2">
              微行动：{selectedCheckIn.action}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
