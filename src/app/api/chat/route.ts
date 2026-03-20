import { NextRequest, NextResponse } from "next/server";
import { streamChatWithLLM, type LLMMessage } from "@/lib/ollama";
import { getRishiById } from "@/lib/rishi-personalities";
import { requireAuth } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validateChatInput, validateOrigin } from "@/lib/validate";

export async function POST(req: NextRequest) {
  try {
    // CSRF check
    if (!validateOrigin(req.headers)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Auth check
    const { session, error: authError } = await requireAuth();
    if (authError) return authError;

    // Rate limit: 10 requests per minute
    const ip = getClientIp(req.headers);
    const limit = rateLimit(ip, { maxRequests: 10, windowMs: 60_000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
      );
    }

    // Parse and validate input
    const body = await req.json();
    const validation = validateChatInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { messages, rishi: rishiId } = body;
    const rishiPersonality = getRishiById(rishiId || "narada");

    // Build messages with Rishi system prompt
    const llmMessages: LLMMessage[] = [
      { role: "system", content: rishiPersonality.systemPrompt },
      ...messages.map((m: any) => ({
        role: (m.role === "rishi" ? "assistant" : "user") as "user" | "assistant",
        content: String(m.content).slice(0, 4000),
      })),
    ];

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        fallback: true,
        content: `${rishiPersonality.greeting}\n\n[Groq API key not configured. Add GROQ_API_KEY to .env.local — get a free key at console.groq.com]`,
      });
    }

    // Stream from Groq
    const stream = await streamChatWithLLM(llmMessages);
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
            if (chunk.choices[0]?.finish_reason === "stop") {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: "\n\n[Stream interrupted. Please try again.]" })}\n\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-store",
        Connection: "keep-alive",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
