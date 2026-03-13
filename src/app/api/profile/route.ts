import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data } = await supabaseAdmin
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return Response.json({ profile: data });
}

export async function POST(req: Request) {
  const { userId, nickname, occupation, mbti, zodiac } = await req.json();

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("user_profiles").upsert(
    {
      id: userId,
      nickname: nickname || "",
      occupation: occupation || "",
      mbti: mbti || "",
      zodiac: zodiac || "",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
