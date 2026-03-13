import { createOpenAI } from "@ai-sdk/openai";

const kimiProvider = createOpenAI({
  apiKey: process.env.KIMI_API_KEY || "",
  baseURL: process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1",
});

export const KIMI_MODEL = process.env.KIMI_MODEL || "moonshot-v1-8k";

// Use .chat() to force /chat/completions endpoint (Kimi doesn't support /responses)
export const kimiModel = kimiProvider.chat(KIMI_MODEL);
