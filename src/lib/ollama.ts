import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export const LLM_MODEL = process.env.LLM_MODEL || "llama-3.1-8b-instant";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatWithLLM(
  messages: LLMMessage[],
  options: { temperature?: number; max_tokens?: number } = {}
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: LLM_MODEL,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 1024,
    stream: false,
  });

  return completion.choices[0]?.message?.content || "";
}

export async function streamChatWithLLM(
  messages: LLMMessage[],
  options: { temperature?: number; max_tokens?: number } = {}
) {
  const stream = await groq.chat.completions.create({
    model: LLM_MODEL,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 1024,
    stream: true,
  });

  return stream;
}

export async function checkLLMHealth(): Promise<boolean> {
  try {
    if (!process.env.GROQ_API_KEY) return false;
    const res = await groq.chat.completions.create({
      model: LLM_MODEL,
      messages: [{ role: "user", content: "hi" }],
      max_tokens: 1,
    });
    return !!res.choices[0];
  } catch {
    return false;
  }
}
