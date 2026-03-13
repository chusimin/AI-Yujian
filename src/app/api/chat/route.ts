import { buildSystemPrompt } from "@/lib/prompts";
import { getRecentMemories } from "@/lib/memory";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const { messages, userId, userName } = await req.json();

  const memories = userId ? await getRecentMemories(userId) : [];

  // Fetch user profile for personalized prompts
  let profile;
  if (userId) {
    const { data } = await supabaseAdmin
      .from("user_profiles")
      .select("nickname, occupation, mbti, zodiac")
      .eq("id", userId)
      .single();
    profile = data || undefined;
  }

  const systemPrompt = buildSystemPrompt(userName || "", memories, profile);

  const apiMessages = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  // Call Kimi API directly to handle reasoning_content streaming
  const apiRes = await fetch(
    `${process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1"}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.KIMI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.KIMI_MODEL || "moonshot-v1-8k",
        messages: apiMessages,
        stream: true,
        max_tokens: 1024,
      }),
    }
  );

  if (!apiRes.ok) {
    const error = await apiRes.text();
    return new Response(JSON.stringify({ error }), { status: apiRes.status });
  }

  // Transform Kimi's SSE stream into a custom stream with reasoning + content
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = apiRes.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;
              if (!delta) continue;

              if (delta.reasoning_content) {
                controller.enqueue(
                  encoder.encode(`<!--T:${delta.reasoning_content}-->`)
                );
              }

              if (delta.content) {
                controller.enqueue(encoder.encode(delta.content));
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      } catch (error) {
        console.error("Stream error:", error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
