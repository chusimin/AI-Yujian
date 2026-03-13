import { supabaseAdmin } from "./supabase-server";

export async function getRecentMemories(userId: string): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from("check_ins")
    .select("memory, created_at")
    .eq("user_id", userId)
    .neq("memory", "")
    .order("created_at", { ascending: false })
    .limit(5);

  return data?.map((c) => c.memory) || [];
}
