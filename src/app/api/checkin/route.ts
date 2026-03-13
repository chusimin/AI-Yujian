import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const { userId, score, summary, action, memory, conversation } =
    await req.json();

  if (!userId || !score) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  const { data, error } = await supabaseAdmin.from("check_ins").insert({
    user_id: userId,
    score,
    summary: summary || "",
    action: action || "",
    memory: memory || "",
    conversation: conversation || [],
  }).select("id").single();

  if (error) {
    console.error("Check-in save error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return Response.json({ id: data.id });
}
