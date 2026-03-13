import { supabase } from "./supabase";

export async function getRecentMemories(userId: string): Promise<string[]> {
  if (!supabase) return [];

  const { data } = await supabase
    .from("memories")
    .select("content")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  return data?.map((m) => m.content) || [];
}

export async function saveMemory(
  userId: string,
  content: string,
  sourceCheckinId: string
): Promise<void> {
  if (!supabase) return;

  await supabase.from("memories").insert({
    user_id: userId,
    content,
    source_checkin_id: sourceCheckinId,
  });
}
