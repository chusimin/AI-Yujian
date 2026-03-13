"use client";

import { useState, useEffect } from "react";
import type { MoodDataPoint } from "@/types";
import { supabase } from "@/lib/supabase";

export function useMoodHistory(userId: string, days: number = 7) {
  const [data, setData] = useState<MoodDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !supabase) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data: checkIns } = await supabase!
        .from("check_ins")
        .select("score, summary, created_at")
        .eq("user_id", userId)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: true });

      setData(
        checkIns?.map((c) => ({
          date: c.created_at,
          score: c.score,
          summary: c.summary,
        })) || []
      );
      setLoading(false);
    };

    fetchData();
  }, [userId, days]);

  return { data, loading };
}
