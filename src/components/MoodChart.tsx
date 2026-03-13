"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { MoodDataPoint } from "@/types";

interface MoodChartProps {
  data: MoodDataPoint[];
  period: "7d" | "30d";
  onPeriodChange: (period: "7d" | "30d") => void;
}

const scoreLabel = (score: number) => {
  const map: Record<number, string> = {
    1: "很差",
    2: "不太好",
    3: "一般",
    4: "还不错",
    5: "很好",
  };
  return map[score] || "";
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: MoodDataPoint }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[var(--yj-bg-secondary)] border border-[var(--yj-border)] rounded-lg px-3 py-2 shadow-[var(--yj-shadow-md)]">
      <p className="text-xs text-[var(--yj-text-muted)]">{d.date}</p>
      <p className="text-sm font-medium text-[var(--yj-text-primary)]">
        {d.score}分 · {scoreLabel(d.score)}
      </p>
      {d.summary && (
        <p className="text-xs text-[var(--yj-text-secondary)] mt-1 max-w-[160px]">
          {d.summary}
        </p>
      )}
    </div>
  );
}

export function MoodChart({ data, period, onPeriodChange }: MoodChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("zh-CN", {
      month: "numeric",
      day: "numeric",
    }),
  }));

  return (
    <div className="rounded-lg bg-[var(--yj-bg-secondary)] border border-[var(--yj-border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[var(--yj-text-primary)]">
          情绪曲线
        </h2>
        <div className="flex gap-1 bg-[var(--yj-bg-tertiary)] rounded-md p-0.5">
          {(["7d", "30d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-3 py-1 text-xs rounded transition-all ${
                period === p
                  ? "bg-[var(--yj-primary)] text-[#FFFCF7] shadow-sm"
                  : "text-[var(--yj-text-secondary)] hover:text-[var(--yj-text-primary)]"
              }`}
            >
              {p === "7d" ? "7天" : "30天"}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[var(--yj-primary-light)] flex items-center justify-center">
            <span className="text-xl">~</span>
          </div>
          <p className="text-sm text-[var(--yj-text-muted)]">
            还没有签到记录
          </p>
          <p className="text-xs text-[var(--yj-text-muted)]">
            开始第一次签到，点亮你的情绪曲线
          </p>
        </div>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D98E73" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#D98E73" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#B8AD9E" }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#B8AD9E" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#D98E73"
                strokeWidth={2}
                fill="url(#moodGradient)"
                dot={{ r: 4, fill: "#A68A6B", stroke: "#FFFCF7", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#D98E73", stroke: "#FFFCF7", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
