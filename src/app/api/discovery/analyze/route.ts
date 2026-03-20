import { NextRequest, NextResponse } from "next/server";
import { chatWithLLM, type LLMMessage } from "@/lib/ollama";
import { requireAuth } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validateOrigin, validateTextInput } from "@/lib/validate";

const DISCOVERY_PROMPT = `You are a Vedic-Science Discovery Engine. Given a Sanskrit verse or Vedic concept, you:

1. Provide the original text context (which Veda/Upanishad, the rishi, the devata)
2. Give a careful literal translation
3. Identify potential structural parallels with modern science
4. Generate testable hypotheses where genuine parallels exist

CRITICAL RULES:
- Never claim ancient texts "predicted" modern science
- Use [structural_parallel] tag for pattern matches between Vedic and scientific concepts
- Use [speculative] for interpretive leaps
- Use [testable] for hypotheses that could be experimentally investigated
- Use [verified] only for well-established textual facts
- Be honest about the limits of cross-domain comparison

Format your response as:
**Text Context**: [source, rishi, context]
**Translation**: [careful literal meaning]
**Structural Parallels**: [honest comparison with modern concepts]
**Hypotheses**: [testable ideas, clearly marked as speculative]
**Epistemic Status**: [overall confidence assessment]`;

export async function POST(req: NextRequest) {
  try {
    // CSRF check
    if (!validateOrigin(req.headers)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Auth check
    const { error: authError } = await requireAuth();
    if (authError) return authError;

    // Rate limit: 5 requests per minute
    const ip = getClientIp(req.headers);
    const limit = rateLimit(ip, { maxRequests: 5, windowMs: 60_000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await req.json();
    const input = body.verse || body.concept;

    const validation = validateTextInput(input, "verse or concept");
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        content: "Discovery Engine requires GROQ_API_KEY. Get a free key at console.groq.com",
        fallback: true,
      });
    }

    const messages: LLMMessage[] = [
      { role: "system", content: DISCOVERY_PROMPT },
      { role: "user", content: `Analyze this Vedic text/concept for scientific parallels:\n\n${String(input).slice(0, 4000)}` },
    ];

    const response = await chatWithLLM(messages, { temperature: 0.5, max_tokens: 2048 });

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("Discovery analyze error:", error);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
