"use client";

import { useState, useEffect } from "react";
import { MoodChart } from "@/components/MoodChart";
import { CheckInButton } from "@/components/CheckInButton";
import { RecentCheckIns } from "@/components/RecentCheckIns";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { MoodDataPoint, CheckIn } from "@/types";

export default function Home() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (!user || !supabase) return;

    const fetchData = async () => {
      setDataLoading(true);

      // Fetch check-ins for the last 30 days (covers both 7d and 30d views)
      const since = new Date();
      since.setDate(since.getDate() - 30);

      const { data } = await supabase!
        .from("check_ins")
        .select("id, user_id, score, summary, action, created_at")
        .eq("user_id", user.id)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: true });

      if (data) {
        // Mood chart data
        setMoodData(
          data.map((c) => ({
            date: c.created_at,
            score: c.score,
            summary: c.summary,
          }))
        );

        // Calendar check-ins
        setCheckIns(
          data.map((c) => ({
            id: c.id,
            user_id: c.user_id,
            score: c.score,
            summary: c.summary,
            action: c.action,
            messages: [],
            created_at: c.created_at,
          }))
        );

        // Check if today already has a check-in
        const todayStr = new Date().toLocaleDateString("zh-CN");
        const todayCheckIn = data.find(
          (c) => new Date(c.created_at).toLocaleDateString("zh-CN") === todayStr
        );
        setHasCheckedInToday(!!todayCheckIn);
      }

      setDataLoading(false);
    };

    fetchData();
  }, [user]);

  // Filter mood data based on period
  const filteredMoodData = (() => {
    const days = period === "7d" ? 7 : 30;
    const since = new Date();
    since.setDate(since.getDate() - days);
    return moodData.filter((d) => new Date(d.date) >= since);
  })();

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--yj-bg-primary)] flex items-center justify-center">
        <span className="text-sm text-[var(--yj-text-muted)] animate-pulse">
          加载中...
        </span>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--yj-bg-primary)] flex items-center justify-center">
        <div className="text-center px-8">
          <h1 className="text-3xl font-bold text-[var(--yj-text-primary)] mb-2">
            愈见
          </h1>
          <p className="text-sm text-[var(--yj-text-secondary)] mb-8">
            每天3分钟，看见情绪的轨迹
          </p>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-[var(--yj-primary)] text-[#FFFCF7] text-sm font-medium hover:bg-[var(--yj-primary-hover)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            使用 Google 账号登录
          </button>
          <p className="text-xs text-[var(--yj-text-muted)] mt-4">
            登录后即可开始每日情绪签到
          </p>
        </div>
      </div>
    );
  }

  // Logged in
  return (
    <div className="min-h-screen bg-[var(--yj-bg-primary)] pb-20">
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

        {dataLoading ? (
          <div className="text-center py-20">
            <span className="text-sm text-[var(--yj-text-muted)] animate-pulse">
              加载数据中...
            </span>
          </div>
        ) : (
          <>
            {/* Mood Chart */}
            <div className="mb-6">
              <MoodChart
                data={filteredMoodData}
                period={period}
                onPeriodChange={setPeriod}
              />
            </div>

            {/* Check-in Button */}
            <div className="mb-8">
              <CheckInButton hasCheckedInToday={hasCheckedInToday} />
            </div>

            {/* Calendar */}
            <RecentCheckIns checkIns={checkIns} />
          </>
        )}
      </div>
    </div>
  );
}
