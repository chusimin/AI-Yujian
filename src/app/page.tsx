"use client";

import { useState } from "react";
import { MoodChart } from "@/components/MoodChart";
import { CheckInButton } from "@/components/CheckInButton";
import { RecentCheckIns } from "@/components/RecentCheckIns";
import type { MoodDataPoint, CheckIn } from "@/types";

// Mock data for visual preview
const today = new Date();
const mockMoodData: MoodDataPoint[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (6 - i));
  const scores = [3, 2, 3, 4, 3, 4, 5];
  const summaries = [
    "课业压力有点大",
    "和室友闹了点小矛盾",
    "普通的一天",
    "和朋友吃了顿好的",
    "论文进度有点卡",
    "跑步之后感觉好多了",
    "今天状态不错",
  ];
  return {
    date: d.toISOString(),
    score: scores[i],
    summary: summaries[i],
  };
});

// Mock check-ins spread across the month for calendar view
const mockCheckIns: CheckIn[] = [
  { id: "1", user_id: "mock", score: 5, summary: "今天状态不错，完成了一个小目标", action: "给自己泡杯茶，庆祝一下", messages: [], created_at: new Date().toISOString() },
  { id: "2", user_id: "mock", score: 4, summary: "跑步之后感觉好多了", action: "拉伸5分钟", messages: [], created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "3", user_id: "mock", score: 3, summary: "论文进度有点卡", action: "先写10分钟", messages: [], created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "4", user_id: "mock", score: 4, summary: "和朋友吃了顿好的", action: "给朋友发个感谢消息", messages: [], created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "5", user_id: "mock", score: 3, summary: "普通的一天", action: "听一首喜欢的歌", messages: [], created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "6", user_id: "mock", score: 2, summary: "和室友闹了点小矛盾", action: "写下你的感受，不发出去也行", messages: [], created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "7", user_id: "mock", score: 3, summary: "课业压力有点大", action: "去楼下散步10分钟", messages: [], created_at: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: "8", user_id: "mock", score: 4, summary: "看了一部好电影", action: "把感受写下来", messages: [], created_at: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: "9", user_id: "mock", score: 1, summary: "考试考砸了，很难过", action: "允许自己难过一会儿", messages: [], created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: "10", user_id: "mock", score: 5, summary: "收到了实习offer！", action: "和家人分享这个好消息", messages: [], created_at: new Date(Date.now() - 86400000 * 12).toISOString() },
];

export default function Home() {
  const [period, setPeriod] = useState<"7d" | "30d">("7d");

  return (
    <div className="min-h-screen bg-[var(--yj-bg-primary)]">
      <div className="mx-auto max-w-md px-5 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--yj-text-primary)]">
            愈见
          </h1>
          <p className="text-sm text-[var(--yj-text-secondary)] mt-1">
            每天3分钟，看见情绪的轨迹
          </p>
        </div>

        {/* Mood Chart */}
        <div className="mb-6">
          <MoodChart
            data={mockMoodData}
            period={period}
            onPeriodChange={setPeriod}
          />
        </div>

        {/* Check-in Button */}
        <div className="mb-8">
          <CheckInButton hasCheckedInToday={false} />
        </div>

        {/* Calendar */}
        <RecentCheckIns checkIns={mockCheckIns} />
      </div>
    </div>
  );
}
